import React, { useRef, useState, useLayoutEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  Download,
  Share2,
  Check,
  Copy,
  Award,
  ShieldCheck,
  Compass,
  MessageCircle,
  ExternalLink,
  X,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import BlocLogo from './BlocLogo';
import CompassChart from './CompassChart';
import darkLogo from '../assets/light mode logo.svg';
import { formatCertificateId } from '../lib/certificateId';

/**
 * Printable Certificate (Sanod)
 *
 * The certificate is a fixed 1123x794px sheet (A4 landscape at 96dpi).
 * On screen it is scaled down to fit its container; the PDF is captured at
 * full size, so the output never depends on the viewer's screen width.
 *
 * Colors are locked to a light palette. Site theme switching does not touch it.
 * Bengali text uses no letter-spacing (it breaks conjuncts, especially in html2canvas)
 * and no italics/faux bold (Tiro Bangla ships Regular only).
 */

const CERT_W = 1123;
const CERT_H = 794;

const C = {
  parchment: '#FDFBF7',
  navy: '#0F172A',
  slate: '#475569',
  muted: '#64748B',
  green: '#006A4E',
  greenLight: '#047857',
  gold: '#D4AF37',
  goldText: '#8A6A12', // darker gold, readable as text on parchment
  line: '#E6DCC3',
  card: '#FFFFFF'
};

const SERIF = "'Tiro Bangla', serif";
const SANS = "'Noto Sans Bengali', sans-serif";

// Overrides the site's theme variables inside the certificate only,
// so child components (CompassChart, BlocLogo) also render in light colors.
const PAPER_VARS = {
  '--bg-card': C.parchment,
  '--bg-elevated': C.card,
  '--border-color': C.line,
  '--text-primary': C.navy,
  '--text-secondary': C.slate,
  '--text-muted': C.muted,
  '--text-gold': C.goldText
};

const CORNERS = [
  { pos: { top: 28, left: 28 }, t: '' },
  { pos: { top: 28, right: 28 }, t: 'translate(48 0) scale(-1 1)' },
  { pos: { bottom: 28, left: 28 }, t: 'translate(0 48) scale(1 -1)' },
  { pos: { bottom: 28, right: 28 }, t: 'translate(48 48) scale(-1 -1)' }
];

function Corner({ pos, t }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" style={{ position: 'absolute', ...pos }} aria-hidden="true">
      <g transform={t}>
        <path d="M3 44 V11 Q3 3 11 3 H44" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 44 V18 Q10 10 18 10 H44" fill="none" stroke={C.gold} strokeWidth="1" opacity="0.7" />
        <rect x="14" y="14" width="7" height="7" transform="rotate(45 17.5 17.5)" fill={C.green} stroke={C.gold} strokeWidth="1.2" />
      </g>
    </svg>
  );
}

function Seal({ size, Icon }) {
  return (
    <div style={{
      width: size,
      height: size,
      boxSizing: 'border-box',
      borderRadius: '50%',
      border: `2px solid ${C.gold}`,
      padding: 3,
      background: C.card
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenLight} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={Math.round(size * 0.42)} color={C.gold} />
      </div>
    </div>
  );
}

function Stat({ label, value, first, latin, color }) {
  return (
    <div style={{ padding: '10px 16px', borderLeft: first ? 'none' : `1px solid ${C.line}` }}>
      <div className={latin ? 'font-latin' : undefined} style={{ fontSize: 12.5, color: C.muted, fontWeight: 600, marginBottom: 2 }}>
        {label}
      </div>
      <div className={latin ? 'font-latin' : undefined} style={{ fontSize: latin ? 22 : 17, fontWeight: 700, color: color || C.navy, lineHeight: 1.4 }}>
        {value}
      </div>
    </div>
  );
}

export default function CertificateCard({ analysis, sessionId, demographics, hideActions, lang = 'bn' }) {
  const isEnglish = lang === 'en';
  const certificateRef = useRef(null);
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPoliticalDetails, setShowPoliticalDetails] = useState(false);

  const { coordinates, quadrantProfile, primaryBloc, secondaryBloc, timestamp } = analysis;
  const serialNumber = formatCertificateId(sessionId);
  const formattedDate = new Date(timestamp || Date.now()).toLocaleDateString(isEnglish ? 'en-US' : 'bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const quadrantTitle = isEnglish
    ? ({
        authoritarian_left: 'Authoritarian Left',
        authoritarian_right: 'Authoritarian Right',
        libertarian_left: 'Libertarian Left',
        libertarian_right: 'Libertarian Right',
        centrist: 'Centrist'
      }[quadrantProfile?.key] || 'Political Quadrant')
    : quadrantProfile.title;
  const primaryName = isEnglish
    ? (primaryBloc.profile.englishName || primaryBloc.profile.name)
    : primaryBloc.profile.name;
  const secondaryName = isEnglish
    ? (secondaryBloc.profile.englishName || secondaryBloc.profile.name)
    : secondaryBloc.profile.name;
  const signed = (n) => (n > 0 ? `+${n}` : n);

  // Fit the fixed-size sheet into whatever width the page gives us
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const fit = () => setScale(Math.min(1, el.clientWidth / CERT_W));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const generateCanvas = async () => {
    await document.fonts.ready; // make sure Bengali web fonts are in before capture
    return await html2canvas(certificateRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: C.parchment,
      width: CERT_W,
      height: CERT_H,
      windowWidth: CERT_W,
      windowHeight: CERT_H,
    });
  };

  // High-res A4 landscape PDF
  const handleDownloadPDF = async () => {
    if (!certificateRef.current || downloading) return;
    setDownloading(true);
    try {
      const canvas = await generateCanvas();
      // Sheet is already A4 proportions, so it fills the page exactly
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 297, 210);
      pdf.save('BD_Political_Compass_Participation_Certificate.pdf');
    } catch (err) {
      console.error('Download error:', err);
      alert(isEnglish ? 'Could not download the certificate. Please try again.' : 'সনদ ডাউনলোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setDownloading(false);
    }
  };

  // High-res JPEG download
  const handleDownloadJPEG = async () => {
    if (!certificateRef.current || downloading) return;
    setDownloading(true);
    try {
      const canvas = await generateCanvas();
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'BD_Political_Compass_Participation_Certificate.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      alert(isEnglish ? 'Could not download the certificate. Please try again.' : 'সনদ ডাউনলোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setDownloading(false);
    }
  };



  // Facebook Share Assistant states
  const [preparingShare, setPreparingShare] = useState(false);
  const [showFbModal, setShowFbModal] = useState(false);
  const [fbShareData, setFbShareData] = useState(null);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);

  // Generate customized share template
  const generateCustomCaption = () => {
    if (isEnglish) {
      const details = showPoliticalDetails
        ? `\nClosest stated-position similarity: ${primaryBloc.percentage === null ? 'No clear match' : `${primaryBloc.percentage}% ${primaryName}`}\nCompass quadrant: ${quadrantTitle}`
        : '';
      return `🇧🇩 Bangladesh Political Compass · 2026\nI completed the 40-question political views assessment.${details}\nResults show similarity to this quiz's profiles, not party membership or endorsement.\n👉 ${window.location.origin}`;
    }

    const details = showPoliticalDetails
      ? `\nঘোষিত অবস্থানের সঙ্গে সবচেয়ে বেশি সাদৃশ্য: ${primaryBloc.percentage === null ? 'স্পষ্ট মিল নেই' : `${primaryBloc.percentage}% ${primaryBloc.profile.name}`}\nকম্পাসে অবস্থান: ${quadrantProfile.title}`
      : '';
    return `🇧🇩 বাংলাদেশ রাজনৈতিক কম্পাস · ২০২৬\nআমি ২৪টি প্রশ্নের রাজনৈতিক মতামত মূল্যায়ন সম্পন্ন করেছি।${details}\nফলাফল এই কুইজের প্রোফাইলের সঙ্গে সাদৃশ্য বোঝায়, দলীয় সদস্যপদ বা সমর্থন নয়।\n👉 ${window.location.origin}`;
  };

  // Facebook share with auto-caption clipboard & image attachment assistant
  const handleFacebookShare = async () => {
    if (!certificateRef.current || downloading || preparingShare) return;
    setPreparingShare(true);
    try {
      const canvas = await generateCanvas();
      const imgUrl = canvas.toDataURL('image/jpeg', 0.96);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'BD_Political_Compass_Participation_Certificate.png', { type: 'image/png' });
      const caption = generateCustomCaption();

      // Automatically copy caption to clipboard
      try {
        await navigator.clipboard.writeText(caption);
        setCaptionCopied(true);
        setTimeout(() => setCaptionCopied(false), 3000);
      } catch (clipErr) {
        console.warn('Clipboard writeText failed:', clipErr);
      }

      // Attempt to copy image to clipboard as well
      try {
        if (typeof ClipboardItem !== 'undefined') {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          setImageCopied(true);
          setTimeout(() => setImageCopied(false), 3000);
        }
      } catch (imgClipErr) {
        // Not all browsers allow image clipboard write without explicit gesture
      }

      setFbShareData({
        caption,
        imgUrl,
        blob,
        file
      });
      setShowFbModal(true);
    } catch (err) {
      console.error('FB Share preparation error:', err);
      const url = encodeURIComponent(window.location.origin);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=500');
    } finally {
      setPreparingShare(false);
    }
  };

  // WhatsApp share
  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(generateCustomCaption());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const certificateContent = (
    <>
      {/* Double frame: thick green, a clear gap, then thin gold */}
      <div style={{ position: 'absolute', inset: 18, border: `5px solid ${C.green}` }} />
      <div style={{ position: 'absolute', inset: 32, border: `1.5px solid ${C.gold}` }} />

      {CORNERS.map((c, i) => <Corner key={i} pos={c.pos} t={c.t} />)}

      {/* Watermark */}
      <img
        src={darkLogo}
        alt=""
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 520,
          height: 520,
          marginLeft: -260,
          marginTop: -260,
          objectFit: 'contain',
          opacity: 0.06,
          pointerEvents: 'none'
        }}
      />

      {/* Content */}
      <div style={{
        position: 'absolute',
        inset: 32,
        padding: '26px 56px 22px',
        display: 'flex',
        flexDirection: 'column'
      }}>

        {/* Header */}
        <header style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 10 }}>
            <div style={{ width: 110, height: 1.5, background: `linear-gradient(90deg, transparent, ${C.gold})` }} />
            <Seal size={40} Icon={Award} />
            <div style={{ width: 110, height: 1.5, background: `linear-gradient(270deg, transparent, ${C.gold})` }} />
          </div>

          <h1 style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: 40,
            lineHeight: 1.4,
            color: C.navy,
            margin: 0
          }}>
            {isEnglish ? 'Public Opinion Survey Participation Certificate' : 'বাংলাদেশ জনমত জরিপ অংশগ্রহণ সনদ'}
          </h1>

          <div style={{ fontSize: 17, fontWeight: 600, color: C.goldText, lineHeight: 1.5, marginTop: 2 }}>
            {isEnglish ? 'Independent, research-based public opinion survey project' : 'স্বাধীন ও গবেষণামূলক জনমত জরিপ প্রকল্প'}
          </div>

          <p style={{ fontSize: 14.5, lineHeight: 1.8, color: C.slate, maxWidth: 840, margin: '8px auto 0' }}>
            {isEnglish
              ? <>This certifies that {demographics?.name ? <strong style={{ color: C.navy, fontWeight: 700 }}>{demographics.name}</strong> : 'the certificate holder'} (Certificate ID: <strong className="font-latin" style={{ color: C.navy, fontWeight: 700 }}>{serialNumber}</strong>) has completed the Bangladesh Open Public Opinion Survey 2026, based on 24 policy criteria.</>
              : <>এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, {demographics?.name ? <strong style={{ color: C.navy, fontWeight: 700 }}>{demographics.name}</strong> : 'সনদধারী'} (সনদ আইডি: <strong className="font-latin" style={{ color: C.navy, fontWeight: 700 }}>{serialNumber}</strong>) সফলভাবে ২৪টি নীতিগত মানদণ্ডের ভিত্তিতে "বাংলাদেশ উন্মুক্ত জনমত জরিপ ২০২৬" সম্পন্ন করেছেন।</>}
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: C.muted, maxWidth: 840, margin: '4px auto 0' }}>
            {isEnglish ? 'This confirms participation only; it is not a verification of identity, expertise, or political affiliation.' : 'এটি শুধু অংশগ্রহণের স্বীকৃতি; পরিচয়, দক্ষতা বা রাজনৈতিক সম্পৃক্ততার যাচাই নয়।'}
          </p>
        </header>

        {/* Result + compass */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: 28,
          alignItems: 'center',
          marginTop: 8
        }}>

          <div>
            <div style={{
              background: C.card,
              border: `1px solid ${C.line}`,
              borderLeft: `5px solid ${primaryBloc.profile.color}`,
              borderRadius: 10,
              padding: '16px 22px'
            }}>
              <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, marginBottom: 8 }}>
                {isEnglish ? 'Closest profile similarity' : 'সবচেয়ে কাছাকাছি প্রোফাইলের সাদৃশ্য'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {showPoliticalDetails && <BlocLogo blocKey={primaryBloc.key} size={52} />}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', minWidth: 0 }}>
                  <span
                    className="font-latin"
                    style={{
                      fontSize: 54,
                      fontWeight: 800,
                      lineHeight: 1,
                      color: primaryBloc.profile.color,
                      fontVariantNumeric: 'tabular-nums'
                    }}
                  >
                    {primaryBloc.percentage === null ? '—' : `${primaryBloc.percentage}%`}
                  </span>
                  <span style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.4, color: C.navy, overflowWrap: 'anywhere' }}>
                    {showPoliticalDetails
                      ? primaryName
                      : (isEnglish ? 'Profile name hidden' : 'প্রোফাইলের নাম গোপন')}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: 13.5, color: C.goldText, fontWeight: 600, marginTop: 8 }}>
                {isEnglish ? 'Similarity to a survey profile · not party support' : 'জরিপের প্রোফাইলের সঙ্গে সাদৃশ্য · দলীয় সমর্থন নয়'}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.6fr 1fr 1fr',
              marginTop: 12,
              background: C.card,
              border: `1px solid ${C.line}`,
              borderLeft: `5px solid ${quadrantProfile.badgeColor}`,
              borderRadius: 10
            }}>
              <Stat first label={isEnglish ? 'Political Quadrant' : 'আদর্শিক চতুর্ভুজ (Compass Quadrant)'} value={quadrantTitle} />
              <Stat latin label="Economic X" value={signed(coordinates.x)} color="#059669" />
              <Stat latin label="Governance Y" value={signed(coordinates.y)} color="#0284C7" />
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: C.card,
            border: `1px solid ${C.line}`,
            borderRadius: 10,
            padding: '12px 12px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
              <Compass size={16} color="#0284C7" />
              <span>{isEnglish ? '2D Compass Map' : '২ডি কম্পাস মানচিত্র'}</span>
            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '8px 32px 8px' }}>
              <CompassChart
                coordinates={coordinates}
                quadrantProfile={quadrantProfile}
                primaryBloc={primaryBloc}
                isMini={true}
                miniMaxWidth="250px"
                lang={lang}
              />
            </div>

            {primaryBloc.key !== 'Mixed' && primaryBloc.key !== 'NoMatch' && <div style={{ marginTop: 8, fontSize: 13, color: C.slate, textAlign: 'center', lineHeight: 1.5 }}>
              {isEnglish ? 'Next closest profile: ' : 'পরবর্তী কাছাকাছি প্রোফাইল: '}
              <strong style={{ color: secondaryBloc.profile.color, fontWeight: 700 }}>
                {secondaryBloc.percentage === null ? '—' : `${secondaryBloc.percentage}%`}{' '}
                {showPoliticalDetails ? secondaryName : (isEnglish ? 'name hidden' : 'নাম গোপন')}
              </strong>
            </div>}
          </div>
        </div>

        {/* Footer */}
        <footer className="cert-footer" style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: 12,
          borderTop: `1px solid ${C.line}`,
          fontSize: 13,
          lineHeight: 1.6,
          color: C.muted
        }}>
          <div>
            <div>{isEnglish ? 'Certificate ID: ' : 'সনদ আইডি: '}<strong className="font-latin" style={{ color: C.navy, fontWeight: 800 }}>{serialNumber}</strong></div>
            <div>{isEnglish ? 'Issue date: ' : 'ইস্যু তারিখ: '}<span style={{ fontWeight: 600, color: C.navy }}>{formattedDate}</span></div>
            <div style={{ fontSize: 12 }}>{isEnglish ? 'Algorithm: ' : 'অ্যালগরিদম: '}BD-Compass-2026-v2.6</div>
          </div>

          <Seal size={58} Icon={ShieldCheck} />

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800, color: C.green, fontSize: 14 }}>{isEnglish ? 'Participation Certificate' : 'অংশগ্রহণ সনদ'}</div>
            <div className="font-latin" style={{ fontSize: 12 }}>politicalcompass.web.app</div>
          </div>
        </footer>

      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

      {/* 1. Scaled Preview Frame for Screen */}
      <div
        ref={wrapRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: CERT_W,
          height: CERT_H * scale,
          boxShadow: '0 12px 40px rgba(15, 23, 42, 0.18)',
          overflow: 'hidden'
        }}
      >
        <div
          id="bd-certificate-preview"
          style={{
            ...PAPER_VARS,
            position: 'absolute',
            top: 0,
            left: 0,
            width: CERT_W,
            height: CERT_H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            overflow: 'hidden',
            fontFamily: SANS,
            color: C.navy,
            background: `radial-gradient(ellipse at center, #FFFFFF 0%, ${C.parchment} 55%, #F6F0E1 100%)`
          }}
        >
          {certificateContent}
        </div>
      </div>

      {/* 2. Hidden Static Node for html2canvas Export */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: CERT_W, height: CERT_H, overflow: 'hidden' }}>
        <div
          ref={certificateRef}
          id="bd-certificate-print"
          style={{
            ...PAPER_VARS,
            width: CERT_W,
            height: CERT_H,
            fontFamily: SANS,
            color: C.navy,
            background: `radial-gradient(ellipse at center, #FFFFFF 0%, ${C.parchment} 55%, #F6F0E1 100%)`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {certificateContent}
        </div>
      </div>

      {/* Action Buttons Below Certificate */}
      {!hideActions && (
        <div style={{
          display: 'flex',
          gap: '0.85rem',
          marginTop: '1.75rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          maxWidth: '820px',
          width: '100%'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            width: '100%',
            padding: '0.8rem 1rem',
            border: '1px solid var(--border-gold)',
            borderRadius: '12px',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={showPoliticalDetails}
              onChange={(event) => setShowPoliticalDetails(event.target.checked)}
            />
            <span>{isEnglish ? 'Show profile names on the certificate and in the share caption (off by default). The compass and quadrant always remain visible.' : 'সনদ ও শেয়ার ক্যাপশনে প্রোফাইলের নাম দেখান (ডিফল্টভাবে বন্ধ)। কম্পাস ও চতুর্ভুজ সবসময় দেখা যাবে।'}</span>
          </label>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #006A4E 0%, #047857 100%)',
              boxShadow: '0 4px 14px rgba(0, 106, 78, 0.35)',
              padding: '0.85rem 1.6rem',
              fontSize: '1rem',
              flex: '1 1 200px'
            }}
          >
            <Download size={19} />
            <span>{downloading ? (isEnglish ? 'Preparing...' : 'প্রস্তুত হচ্ছে...') : (isEnglish ? 'Download (PDF)' : 'ডাউনলোড (PDF)')}</span>
          </button>

          <button
            onClick={handleDownloadJPEG}
            disabled={downloading}
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
              padding: '0.85rem 1.6rem',
              fontSize: '1rem',
              flex: '1 1 200px'
            }}
          >
            <Download size={19} />
            <span>{downloading ? (isEnglish ? 'Preparing...' : 'প্রস্তুত হচ্ছে...') : (isEnglish ? 'Download (JPEG)' : 'ডাউনলোড (JPEG)')}</span>
          </button>

          <button
            onClick={handleFacebookShare}
            className="btn-secondary"
            style={{ padding: '0.85rem 1.4rem', flex: '1 1 180px' }}
          >
            <Share2 size={19} color="#1877F2" />
            <span>{isEnglish ? 'Share on Facebook' : 'ফেসবুকে শেয়ার'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="btn-secondary"
            style={{ padding: '0.85rem 1.4rem', flex: '1 1 180px' }}
          >
            <MessageCircle size={19} color="#25D366" />
            <span>{isEnglish ? 'Share on WhatsApp' : 'হোয়াটসঅ্যাপে শেয়ার'}</span>
          </button>
        </div>
      )}

    </div>
  );
}
