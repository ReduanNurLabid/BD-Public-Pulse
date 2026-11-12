import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Link2, Share2 } from 'lucide-react';
import darkLogo from '../assets/dark mode logo.svg';
import { CARD_ISSUES } from '../data/questions';

const SITE_URL = 'https://politicalcompass.web.app';
const SITE_LABEL = 'politicalcompass.web.app';
// The result page's sticky share bar fires this to trigger the card's share.
export const SHARE_CARD_EVENT = 'bdc:share-card';

const CARD_W = 1080;
const CARD_H = 1920;
const PREVIEW_MAX_W = 460;

// Fixed palette, independent of the site's light/dark theme.
const PAPER = '#F7F2E7';
const INK = '#17140F';

// Same template for everyone, a different skin per type: that sameness is what
// makes friends' cards comparable.
const THEMES = {
  libertarian_left: { accent: '#E5262A', onAccent: '#FFFFFF', panel: PAPER, text: INK, muted: '#6B6357', pattern: 'rose', artLight: false },
  libertarian_right: { accent: '#4A86FF', onAccent: '#FFFFFF', panel: INK, text: PAPER, muted: '#A9A294', pattern: 'phyllotaxis', artLight: true },
  authoritarian_left: { accent: '#0B9A5B', onAccent: '#FFFFFF', panel: PAPER, text: INK, muted: '#6B6357', pattern: 'harmonograph', artLight: false },
  authoritarian_right: { accent: '#F6B100', onAccent: INK, panel: INK, text: PAPER, muted: '#A9A294', pattern: 'spirograph', artLight: true },
  centrist: { accent: '#F0468F', onAccent: '#FFFFFF', panel: INK, text: PAPER, muted: '#A9A294', pattern: 'moire', artLight: true }
};

const ART_W = 1080;
const ART_H = 1040;
// Where the figure is centred: to the right, in the space beside the portrait.
const ART_CX = 790;
const ART_CY = 500;
const artCache = new Map();

const gcd = (a, b) => (b ? gcd(b, a % b) : a);

// Generative maths art, drawn once to a canvas and used as a plain image, which
// html2canvas exports reliably. `seed` comes from the person's own answers, so
// the same answers always redraw the same art and different answers differ.
function mathArt(kind, accent, seed, light) {
  const key = `${kind}|${accent}|${seed}|${light}`;
  const background = light ? PAPER : INK;
  const line = light ? INK : PAPER;
  if (artCache.has(key)) return artCache.get(key);
  const canvas = document.createElement('canvas');
  canvas.width = ART_W;
  canvas.height = ART_H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, ART_W, ART_H);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const cx = ART_CX;
  const cy = ART_CY;
  const stroke = (color, width, alpha) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.globalAlpha = alpha;
  };

  if (kind === 'rose') {
    // Maurer rose: a rose curve r = sin(nθ) joined at steps of d degrees.
    const n = 2 + (seed % 6);
    const d = [29, 37, 47, 59, 71, 83, 97, 113][seed % 8];
    const R = 760;
    const point = (deg) => {
      const t = (deg * Math.PI) / 180;
      const r = R * Math.sin(n * t);
      return [cx + r * Math.cos(t), cy + r * Math.sin(t)];
    };
    stroke(line, 1.3, 0.55);
    ctx.beginPath();
    for (let k = 0; k <= 360; k += 1) {
      const [x, y] = point(k * d);
      if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.stroke();
    stroke(accent, 5, 1);
    ctx.beginPath();
    for (let k = 0; k <= 720; k += 1) {
      const [x, y] = point(k / 2);
      if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.stroke();
  } else if (kind === 'phyllotaxis') {
    // Golden-angle spiral: how sunflower seeds pack.
    const golden = Math.PI * (3 - Math.sqrt(5));
    const twist = (seed % 360) * (Math.PI / 180);
    const every = [8, 13, 21, 34][seed % 4];
    for (let i = 1; i < 2600; i += 1) {
      const r = 19 * Math.sqrt(i);
      const t = i * golden + twist;
      const x = cx + r * Math.cos(t);
      const y = cy + r * Math.sin(t);
      if (x < -20 || x > ART_W + 20 || y < -20 || y > ART_H + 20) continue;
      const highlight = i % every === 0;
      ctx.globalAlpha = highlight ? 1 : 0.5;
      ctx.fillStyle = highlight ? accent : line;
      ctx.beginPath();
      ctx.arc(x, y, highlight ? 10 : 2 + (i % 5) * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'harmonograph') {
    // Two damped pendulums per axis.
    const ratios = [[2, 3], [3, 4], [3, 5], [4, 5], [5, 6], [5, 7]];
    const [f1, f2] = ratios[seed % ratios.length];
    const p1 = (seed % 97) / 15;
    const p2 = (seed % 53) / 9;
    const curve = (phase, color, width, alpha) => {
      stroke(color, width, alpha);
      ctx.beginPath();
      for (let i = 0; i <= 26000; i += 1) {
        const t = i / 130;
        const decay = Math.exp(-t * 0.012);
        const x = cx + 640 * decay * Math.sin(f1 * t + phase + p1);
        const y = cy + 620 * decay * Math.sin(f2 * t + p2);
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.stroke();
    };
    curve(0, line, 1.1, 0.5);
    curve(0.05, accent, 1.6, 0.95);
  } else if (kind === 'spirograph') {
    // Hypotrochoid, layered and turned.
    const R = 96 + (seed % 7) * 8;
    let r = 29 + (seed % 23);
    if (gcd(R, r) > 8) r += 1;
    const d = 62 + (seed % 31);
    const scale = 7.2 * (96 / R);
    const steps = (r / gcd(R, r)) * Math.PI * 2;
    [[line, 1.2, 0.55, 0], [accent, 2, 1, 0.26]].forEach(([color, width, alpha, turn]) => {
      stroke(color, width, alpha);
      ctx.beginPath();
      for (let t = 0, i = 0; t <= steps; t += 0.012, i += 1) {
        const ux = (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
        const uy = (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
        const x = cx + scale * (ux * Math.cos(turn) - uy * Math.sin(turn));
        const y = cy + scale * (ux * Math.sin(turn) + uy * Math.cos(turn));
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.stroke();
    });
  } else {
    // Moiré: two sets of rings interfering, two sides of an argument.
    const gap = 150 + (seed % 90);
    const spacing = 15 + (seed % 5);
    [[cx - gap, line, 0.6], [cx + gap, accent, 0.95]].forEach(([x, color, alpha]) => {
      stroke(color, 3, alpha);
      for (let r = spacing; r < 1500; r += spacing) {
        ctx.beginPath();
        ctx.arc(x, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }

  ctx.globalAlpha = 1;

  const url = canvas.toDataURL('image/jpeg', 0.9);
  artCache.set(key, url);
  return url;
}

const enToBn = (value) => String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[digit]);

// html2canvas ignores object-fit, so exported images are positioned by hand in
// onclone; anything marked data-object-fit="cover" must sit in a clipped box.
const CoverImage = ({ src, position = 'center 22%' }) => (
  src ? (
    <img
      src={src}
      alt=""
      data-object-fit="cover"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: position }}
    />
  ) : null
);

const NICKNAME_KEY = 'bd_compass_nickname';
const NICKNAME_MAX = 20;

function readSavedNickname() {
  try {
    return window.localStorage.getItem(NICKNAME_KEY) || '';
  } catch {
    return '';
  }
}

export default function PersonalityCard({ analysis, lang = 'bn', showcaseOnly = false }) {
  const isEnglish = lang === 'en';
  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const [scale, setScale] = useState(0.42);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareNote, setShareNote] = useState('');
  const [nickname, setNickname] = useState(readSavedNickname);
  const [nameMissing, setNameMissing] = useState(false);
  const nameInputRef = useRef(null);
  const cardName = nickname.trim();

  useLayoutEffect(() => {
    const element = wrapRef.current;
    if (!element) return undefined;
    const fitCard = () => {
      const width = Math.min(PREVIEW_MAX_W, element.clientWidth || PREVIEW_MAX_W);
      setScale(width / CARD_W);
    };
    fitCard();
    const observer = new ResizeObserver(fitCard);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const shareHandlerRef = useRef(null);
  useEffect(() => {
    if (showcaseOnly) return undefined;
    const onShareRequest = () => shareHandlerRef.current?.();
    window.addEventListener(SHARE_CARD_EVENT, onShareRequest);
    return () => window.removeEventListener(SHARE_CARD_EVENT, onShareRequest);
  }, [showcaseOnly]);

  // Browsers only open the share sheet shortly after a tap, and drawing the
  // card takes seconds on a phone. So the image is prepared in the background
  // once the result is on screen, and the tap can share it immediately.
  const prepareBlobRef = useRef(null);
  const blobPromiseRef = useRef(null);
  useEffect(() => {
    // A different name is a different image.
    blobPromiseRef.current = null;
    if (showcaseOnly || !analysis || !cardName) return undefined;
    const timer = window.setTimeout(() => {
      if (!blobPromiseRef.current) blobPromiseRef.current = prepareBlobRef.current?.() ?? null;
      blobPromiseRef.current?.catch(() => { blobPromiseRef.current = null; });
    }, 800);
    return () => window.clearTimeout(timer);
  }, [analysis, showcaseOnly, cardName]);

  if (!analysis) return null;

  const quadrantKey = analysis.quadrantProfile?.key || 'centrist';
  const theme = THEMES[quadrantKey] || THEMES.centrist;
  const { accent } = theme;
  const identity = analysis.identity || {};
  const typeName = (isEnglish ? identity.nameEn : identity.name) || '';
  const tagline = (isEnglish ? identity.taglineEn : identity.tagline) || '';
  const govShare = analysis.govMeter;
  const num = (value) => (isEnglish ? String(value) : enToBn(value));

  const historical = analysis.historicalPick || (analysis.personalities || [])[0];
  // Each person's answers shape their art.
  const artSeed = (analysis.answers || []).reduce((sum, { score }, index) => sum + score * (index * 7 + 3), 0)
    + Math.abs(analysis.coordinates?.x || 0) * 31 + Math.abs(analysis.coordinates?.y || 0) * 17;
  const leaders = (analysis.leaderMatches || []).filter((match) => match.share !== null);
  const topLeader = leaders[0] || null;

  const scoreOf = new Map((analysis.answers || []).map(({ questionId, score }) => [questionId, score]));
  // "আমার ৫ দফা": the five issues the person felt most strongly about, each
  // written as a slogan from their side. Unsure answers only fill empty slots.
  const dafa = CARD_ISSUES
    .filter((issue) => scoreOf.has(issue.id))
    .map((issue, order) => ({ issue, order, score: scoreOf.get(issue.id) }))
    .sort((a, b) => Math.abs(b.score - 3) - Math.abs(a.score - 3) || a.order - b.order)
    .slice(0, 5)
    .map(({ issue, score }) => {
      if (score === 3) {
        return { id: issue.id, text: isEnglish ? `Confused about ${issue.topicEn}` : `${issue.topicBn} নিয়ে কনফিউজড` };
      }
      const agrees = score > 3;
      return { id: issue.id, text: isEnglish ? (agrees ? issue.agreeEn : issue.disagreeEn) : (agrees ? issue.agreeBn : issue.disagreeBn) };
    });

  const nameLength = Array.from(typeName).length;
  const nameSize = isEnglish ? (nameLength <= 15 ? 92 : nameLength <= 22 ? 74 : 58) : (nameLength <= 13 ? 112 : 98);

  const shareText = isEnglish
    ? `The quiz exposed me: I'm ${typeName}. Here's my 5-point demand. Where do you stand? ${SITE_URL}`
    : `কুইজে ধরা খেলাম, আমি আসলে ${typeName}। এই আমার ৫ দফা। তুমি কোন পন্থী? ${SITE_URL}`;

  const waitForImages = async (root) => {
    await Promise.all(Array.from(root.querySelectorAll('img'), async (image) => {
      if (!image.complete || !image.naturalHeight) {
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = () => reject(new Error(`Could not load story-card image: ${image.src}`));
        });
      }
      if (typeof image.decode === 'function') await image.decode();
    }));
  };

  const generateCanvas = async () => {
    await document.fonts.ready;
    const source = cardRef.current;
    if (!source) throw new Error('Story-card preview is unavailable.');
    await waitForImages(source);

    const exportHost = document.createElement('div');
    exportHost.setAttribute('aria-hidden', 'true');
    Object.assign(exportHost.style, {
      position: 'fixed', left: '0', top: '0', width: `${CARD_W}px`, height: `${CARD_H}px`,
      overflow: 'hidden', pointerEvents: 'none', zIndex: '-1', opacity: '0'
    });
    const exportCard = source.cloneNode(true);
    exportCard.style.transform = 'none';
    exportCard.style.width = `${CARD_W}px`;
    exportCard.style.height = `${CARD_H}px`;
    exportHost.appendChild(exportCard);
    document.body.appendChild(exportHost);

    try {
      await waitForImages(exportCard);
      return await html2canvas(exportCard, {
        scale: 1, // 1080x1920 is the story size; 2x made 5 MB files
        useCORS: true,
        backgroundColor: theme.panel,
        width: CARD_W,
        height: CARD_H,
        windowWidth: CARD_W,
        windowHeight: CARD_H,
        onclone: (clonedDocument) => {
          clonedDocument.querySelectorAll('img[data-object-fit="cover"]').forEach((image) => {
            const parent = image.parentElement;
            if (!parent) return;
            const parentWidth = parent.offsetWidth || parent.clientWidth;
            const parentHeight = parent.offsetHeight || parent.clientHeight;
            const { naturalWidth, naturalHeight } = image;
            if (!parentWidth || !parentHeight || !naturalWidth || !naturalHeight) return;
            const cover = Math.max(parentWidth / naturalWidth, parentHeight / naturalHeight);
            const width = Math.round(naturalWidth * cover);
            const height = Math.round(naturalHeight * cover);
            Object.assign(image.style, {
              position: 'absolute',
              width: `${width}px`,
              height: `${height}px`,
              left: `${Math.round((parentWidth - width) / 2)}px`,
              // Faces sit high in portraits, so keep the top rather than centring.
              top: `${Math.round((parentHeight - height) * 0.22)}px`,
              right: 'auto',
              bottom: 'auto',
              maxWidth: 'none',
              maxHeight: 'none'
            });
          });
        }
      });
    } finally {
      exportHost.remove();
    }
  };

  const makeBlob = async () => {
    const canvas = await generateCanvas();
    return new Promise((resolve, reject) => {
      canvas.toBlob((fileBlob) => {
        if (fileBlob) resolve(fileBlob);
        else reject(new Error('Could not create the story image.'));
      }, 'image/jpeg', 0.92);
    });
  };
  prepareBlobRef.current = makeBlob;

  const getBlob = () => {
    if (!blobPromiseRef.current) blobPromiseRef.current = makeBlob();
    return blobPromiseRef.current;
  };

  const FILENAME = 'BD_Political_Compass_Story.jpg';

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const saveBlob = (blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = FILENAME;
    link.href = url;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const saveAndCopyCaption = async (blob) => {
    saveBlob(blob);
    const copied = await copyText(shareText);
    setShareNote(isEnglish
      ? `Image saved${copied ? ' and caption copied' : ''}. Post it on Facebook or your story and tag your friends.`
      : `ছবি সেভ হয়েছে${copied ? ', লেখাটাও কপি হয়েছে' : ''}। ফেসবুকে বা স্টোরিতে পোস্ট করুন, বন্ধুদের ট্যাগ করুন।`);
  };

  // The name is what stops one person's card being passed off as another's.
  const requireName = () => {
    if (cardName) return true;
    setNameMissing(true);
    nameInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    nameInputRef.current?.focus({ preventScroll: true });
    return false;
  };

  const updateNickname = (value) => {
    setNickname(value);
    setNameMissing(false);
    try {
      window.localStorage.setItem(NICKNAME_KEY, value.trim());
    } catch {
      // Private browsing: the name just is not remembered.
    }
  };

  const handleDownload = async () => {
    if (downloading || sharing || !cardRef.current || !requireName()) return;
    setDownloading(true);
    try {
      saveBlob(await getBlob());
      setShareNote(isEnglish ? 'Image saved to your device.' : 'ছবিটি আপনার ফোনে সেভ হয়েছে।');
    } catch (error) {
      console.error('Personality card download failed:', error);
      blobPromiseRef.current = null;
      setShareNote(isEnglish ? 'Could not prepare the card. Please try again.' : 'কার্ড তৈরি করা যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    const copied = await copyText(shareText);
    setShareNote(copied
      ? (isEnglish ? 'Link copied. Paste it anywhere.' : 'লিংক কপি হয়েছে। যেকোনো জায়গায় পেস্ট করুন।')
      : (isEnglish ? `Copy this: ${shareText}` : `এটা কপি করুন: ${shareText}`));
  };

  const handleShare = async () => {
    if (downloading || sharing || !cardRef.current || !requireName()) return;
    setSharing(true);
    setShareNote('');
    let blob = null;
    try {
      blob = await getBlob();
      const file = new File([blob], FILENAME, { type: 'image/jpeg' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: isEnglish ? 'Where do you stand?' : 'আপনি কোন পন্থী?',
          text: shareText
        });
      } else {
        await saveAndCopyCaption(blob);
      }
    } catch (error) {
      if (error?.name === 'AbortError') {
        // The person closed the share sheet; nothing to report.
      } else if (blob) {
        // e.g. NotAllowedError when the browser refuses the share sheet.
        console.error('Personality card sharing failed:', error);
        await saveAndCopyCaption(blob);
      } else {
        console.error('Personality card sharing failed:', error);
        blobPromiseRef.current = null;
        setShareNote(isEnglish ? 'Could not prepare the card. Please try again.' : 'কার্ড তৈরি করা যায়নি। আবার চেষ্টা করুন।');
      }
    } finally {
      setSharing(false);
    }
  };
  shareHandlerRef.current = handleShare;

  const canShareFiles = typeof navigator !== 'undefined'
    && typeof navigator.canShare === 'function'
    && (() => {
      try {
        return navigator.canShare({ files: [new File([''], 'card.jpg', { type: 'image/jpeg' })] });
      } catch {
        return false;
      }
    })();

  const heading = { fontSize: '34px', fontWeight: 800, lineHeight: 1.3, color: accent, marginBottom: '10px' };
  const rowNumber = { flex: '0 0 44px', fontSize: '33px', fontWeight: 800, color: accent };

  const cardContent = (
    <div
      ref={cardRef}
      style={{
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
        background: theme.panel,
        color: theme.text,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Noto Sans Bengali', 'Inter', sans-serif"
      }}
    >
      {/* Art: maths from the person's answers */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: `${ART_W}px`, height: `${ART_H}px`, overflow: 'hidden' }}>
        <img src={mathArt(theme.pattern, accent, artSeed, theme.artLight)} alt="" style={{ position: 'absolute', left: 0, top: 0, width: `${ART_W}px`, height: `${ART_H}px` }} />
      </div>
      <div style={{ position: 'absolute', left: '86px', top: '142px', width: '640px', height: '790px', background: accent }} />
      <div style={{ position: 'absolute', left: '64px', top: '120px', width: '640px', height: '790px', overflow: 'hidden', background: '#D9D2C2', border: `6px solid ${theme.artLight ? INK : PAPER}`, boxSizing: 'border-box' }}>
        <CoverImage src={historical?.img} />
      </div>

      {!showcaseOnly && cardName && (
        <div style={{ position: 'absolute', left: '64px', top: '40px', maxWidth: '480px', background: PAPER, color: INK, border: `4px solid ${INK}`, padding: '2px 22px 8px', fontSize: '38px', fontWeight: 800, lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {cardName}
        </div>
      )}

      {/* Pinned note at the portrait's top-right corner, clear of the face */}
      {historical && (
        <div style={{ position: 'absolute', left: '566px', top: '70px', maxWidth: '470px', background: PAPER, color: INK, border: `4px solid ${INK}`, padding: '20px 24px 12px', lineHeight: 1.3, transform: 'rotate(2deg)', transformOrigin: 'left top' }}>
          <div style={{ position: 'absolute', left: '50%', top: '-20px', marginLeft: '-17px', width: '34px', height: '34px', borderRadius: '50%', background: accent, border: `4px solid ${INK}`, boxSizing: 'border-box' }} />
          <div style={{ fontSize: '24px', fontWeight: 600 }}>{isEnglish ? 'Thought like me, in history' : 'ইতিহাসে আমার মতো ভাবতেন'}</div>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>{isEnglish ? historical.nameEn : historical.nameBn}</div>
        </div>
      )}

      {showcaseOnly && (
        <div style={{ position: 'absolute', right: '36px', top: '860px', transform: 'rotate(5deg)', background: INK, color: PAPER, padding: '6px 18px', fontSize: '28px', fontWeight: 800 }}>
          {isEnglish ? 'SAMPLE' : 'কাল্পনিক নমুনা'}
        </div>
      )}

      <div style={{ position: 'absolute', left: '64px', top: '852px', transform: 'rotate(-2deg)', transformOrigin: 'left center', background: PAPER, color: INK, border: `4px solid ${INK}`, padding: '2px 22px 6px', fontSize: '36px', fontWeight: 800, lineHeight: 1.35 }}>
        {isEnglish ? 'The quiz exposed me. I’m' : 'কুইজে ধরা খেলাম। আমি আসলে—'}
      </div>
      <div style={{ position: 'absolute', left: '56px', top: '926px', transform: 'rotate(-2deg)', transformOrigin: 'left center', background: accent, color: theme.onAccent, border: `5px solid ${INK}`, padding: '0 34px 12px', fontSize: `${nameSize}px`, fontWeight: 800, lineHeight: 1.3, maxWidth: '900px', boxSizing: 'border-box' }}>
        {typeName}
      </div>

      {/* The data everyone compares */}
      <div style={{ position: 'absolute', left: '56px', right: '56px', top: '1114px', bottom: '46px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '35px', fontWeight: 700, lineHeight: 1.35 }}>{tagline}</div>

        <div style={{ display: 'flex', gap: '36px', marginTop: '28px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={heading}>{isEnglish ? 'My 5-point demand' : 'আমার ৫ দফা'}</div>
            {dafa.map((point, index) => (
              <div key={point.id} style={{ display: 'flex', alignItems: 'center', minHeight: '56px' }}>
                <span style={rowNumber}>{num(index + 1)}</span>
                <span style={{ fontSize: '32px', fontWeight: 600, lineHeight: 1.25 }}>{point.text}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: '0 0 340px' }}>
            <div style={heading}>{isEnglish ? 'Closest leaders' : 'নেতাদের সাথে মিল'}</div>
            {leaders.map((leader, index) => (
              <div key={leader.id} style={{ display: 'flex', alignItems: 'center', minHeight: '76px' }}>
                <span style={rowNumber}>{num(index + 1)}</span>
                <span style={{ position: 'relative', width: '58px', height: '58px', flex: '0 0 58px', borderRadius: '50%', overflow: 'hidden', marginRight: '12px', background: '#D9D2C2', display: 'block' }}>
                  <CoverImage src={leader.photo} />
                </span>
                <span style={{ flex: 1, minWidth: 0, fontSize: '34px', fontWeight: 600, lineHeight: 1.25 }}>{isEnglish ? leader.shortEn : leader.shortBn}</span>
                <span style={{ fontSize: '36px', fontWeight: 800 }}>{num(leader.share)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '22px', borderTop: `3px solid ${theme.text}`, paddingTop: '14px' }}>
          <div style={{ fontSize: '30px', fontWeight: 700, color: theme.muted, lineHeight: 1.3 }}>
            {isEnglish ? 'Where government and opposition clash, I side with' : 'সরকার ও বিরোধী দল মুখোমুখি হলে আমি'}
          </div>
          {govShare == null ? (
            <div style={{ fontSize: '44px', fontWeight: 800, lineHeight: 1.5 }}>{isEnglish ? 'No clear side' : 'কোনো পক্ষে নই'}</div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '6px' }}>
                <span style={{ fontSize: '36px', fontWeight: 700 }}>{isEnglish ? 'Government' : 'সরকারের পক্ষে'} <strong style={{ fontSize: '60px', fontWeight: 800, color: accent }}>{num(govShare)}%</strong></span>
                <span style={{ fontSize: '36px', fontWeight: 700 }}><strong style={{ fontSize: '60px', fontWeight: 800 }}>{num(100 - govShare)}%</strong> {isEnglish ? 'Opposition' : 'বিরোধীর পক্ষে'}</span>
              </div>
              <div style={{ height: '20px', marginTop: '6px', background: theme.muted, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${govShare}%`, background: accent }} />
              </div>
            </>
          )}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '38px', fontWeight: 800 }}>
            <span style={{ width: '60px', height: '60px', borderRadius: '50%', background: INK, display: 'block', position: 'relative', flex: '0 0 60px' }}>
              <img src={darkLogo} alt="" style={{ position: 'absolute', left: '6px', top: '6px', width: '48px', height: '48px' }} />
            </span>
            {isEnglish ? 'And you?' : 'তুমি কোন পন্থী?'}
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '32px', fontWeight: 800 }}>{SITE_LABEL.toUpperCase()}</div>
        </div>
        <div style={{ fontSize: '20px', color: theme.muted, marginTop: '8px', lineHeight: 1.3 }}>
          {showcaseOnly
            ? (isEnglish ? 'Fictional sample, not survey results.' : 'কাল্পনিক নমুনা, জরিপের ফল নয়।')
            : (isEnglish ? 'Approximate match. No leader is involved with this quiz.' : 'আনুমানিক মিল। কোনো নেতা এই কুইজের সাথে যুক্ত নন।')}
        </div>
      </div>
    </div>
  );

  const linkButtonStyle = {
    background: 'none',
    border: 'none',
    padding: '0.4rem 0.2rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    color: 'var(--text-secondary)',
    fontWeight: 700,
    fontSize: '0.95rem',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
    cursor: 'pointer'
  };

  return (
    <div className={showcaseOnly ? 'personality-card-showcase' : 'personality-card-layout'}>
      <div
        ref={wrapRef}
        className={`personality-card-preview${showcaseOnly ? ' showcase-story__preview' : ''}`}
        style={{
          width: '100%',
          maxWidth: `${PREVIEW_MAX_W}px`,
          height: `${CARD_H * scale}px`,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          boxShadow: '0 24px 60px -15px rgba(0,0,0,0.45)',
          background: theme.panel
        }}
      >
        <div style={{ width: `${CARD_W}px`, height: `${CARD_H}px`, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          {cardContent}
        </div>
      </div>

      {!showcaseOnly && (
        <div style={{ width: '100%', maxWidth: `${PREVIEW_MAX_W}px`, display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1.25rem auto 0' }}>
          <label style={{ display: 'block', textAlign: 'left' }}>
            <span style={{ display: 'block', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              {isEnglish ? 'Your name or nickname on the card' : 'কার্ডে আপনার নাম বা ডাকনাম'}
            </span>
            <input
              ref={nameInputRef}
              type="text"
              value={nickname}
              maxLength={NICKNAME_MAX}
              autoComplete="nickname"
              aria-invalid={nameMissing}
              placeholder={isEnglish ? 'e.g. Rafi' : 'যেমন: রাফি'}
              onChange={(event) => updateNickname(event.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', minHeight: '50px', padding: '0 1rem', borderRadius: '14px', fontSize: '1.05rem', fontFamily: 'inherit', color: 'var(--text-primary)', background: 'var(--bg-card)', border: `1.5px solid ${nameMissing ? 'var(--accent-red)' : 'var(--border-medium)'}` }}
            />
            <span style={{ display: 'block', fontSize: '0.86rem', lineHeight: 1.5, marginTop: '0.35rem', color: nameMissing ? 'var(--accent-red)' : 'var(--text-muted)', fontWeight: nameMissing ? 700 : 400 }}>
              {nameMissing
                ? (isEnglish ? 'Add a name first, so the card is yours.' : 'আগে একটা নাম দিন, যাতে কার্ডটা আপনারই থাকে।')
                : (isEnglish ? 'Appears only on your card. Never stored on our servers.' : 'শুধু আপনার কার্ডে বসবে, আমাদের কাছে জমা হয় না।')}
            </span>
          </label>
          <button
            type="button"
            onClick={handleShare}
            disabled={sharing || downloading}
            className="btn-primary font-latin"
            style={{
              width: '100%', minHeight: '58px', padding: '0.8rem 1.2rem', borderRadius: '999px', fontSize: '1.1rem', fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              cursor: downloading || sharing ? 'wait' : 'pointer'
            }}
          >
            <Share2 size={20} />
            {sharing
              ? (isEnglish ? 'Preparing…' : 'তৈরি হচ্ছে…')
              : canShareFiles
                ? (isEnglish ? 'Share my card' : 'আমার কার্ড শেয়ার করুন')
                : (isEnglish ? 'Save my card' : 'আমার কার্ড সেভ করুন')}
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button type="button" onClick={handleDownload} disabled={sharing || downloading} style={linkButtonStyle}>
              <Download size={16} /> {downloading ? (isEnglish ? 'Saving…' : 'সেভ হচ্ছে…') : (isEnglish ? 'Save image' : 'ছবি সেভ করুন')}
            </button>
            <button type="button" onClick={handleCopyLink} style={linkButtonStyle}>
              <Link2 size={16} /> {isEnglish ? 'Copy link' : 'লিংক কপি করুন'}
            </button>
          </div>
          <p role="status" style={{ textAlign: 'center', fontSize: '0.9rem', lineHeight: 1.55, color: shareNote ? 'var(--accent-green)' : 'var(--text-muted)', margin: 0, fontWeight: shareNote ? 700 : 400 }}>
            {shareNote || (isEnglish
              ? 'Post it on Facebook or your story, tag friends and ask: where do you stand?'
              : 'ফেসবুকে বা স্টোরিতে দিন, বন্ধুদের ট্যাগ করে জিজ্ঞেস করুন — তুমি কোন পন্থী?')}
          </p>
        </div>
      )}
    </div>
  );
}
