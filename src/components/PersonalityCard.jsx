import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { CheckCircle2, Download, Flag, Globe2, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import darkLogo from '../assets/dark mode logo.svg';
import lightLogo from '../assets/light mode logo.svg';
import {
  ENGLISH_QUESTION_TEXTS,
  ENGLISH_THEMATIC_BLOCKS,
  QUESTIONS,
  THEMATIC_BLOCKS,
  TRACKED_WEDGE_ISSUE_IDS
} from '../data/questions';
import { useAggregateStats } from '../hooks/useAggregateStats';
import { MIN_PUBLIC_COHORT_SIZE } from '../lib/firebase';

const CARD_W = 1080;
const CARD_H = 1920;
const PREVIEW_MAX_W = 460;

const COUNTRIES = {
  authoritarian_left: {
    nameBn: 'কিউবা',
    nameEn: 'Cuba',
    detailBn: 'রাষ্ট্রীয় নিয়ন্ত্রিত অর্থনীতি',
    flag: '/countries/flags/cuba.gif'
  },
  authoritarian_right: {
    nameBn: 'সিঙ্গাপুর',
    nameEn: 'Singapore',
    detailBn: 'রাষ্ট্রনেতৃত্বাধীন প্রবৃদ্ধি',
    flag: '/countries/flags/singapura.gif'
  },
  libertarian_left: {
    nameBn: 'দক্ষিণ আফ্রিকা',
    nameEn: 'South Africa',
    detailBn: 'অধিকারভিত্তিক গণতন্ত্র',
    flag: '/countries/flags/africa-do-sul.gif'
  },
  libertarian_right: {
    nameBn: 'সুইজারল্যান্ড',
    nameEn: 'Switzerland',
    detailBn: 'বিকেন্দ্রীকৃত গণতন্ত্র',
    flag: '/countries/flags/suica.gif'
  },
  centrist: {
    nameBn: 'সুইডেন',
    nameEn: 'Sweden',
    detailBn: 'নর্ডিক কল্যাণ মডেল',
    flag: '/countries/flags/suecia.gif'
  }
};

const PROFILE_LABELS = {
  authoritarian_left: { en: 'Authoritarian & Egalitarian', bn: 'কর্তৃত্ববাদী ও সমতাভিত্তিক' },
  authoritarian_right: { en: 'Authoritarian & Free Market', bn: 'কর্তৃত্ববাদী ও মুক্তবাজার' },
  libertarian_left: { en: 'Libertarian & Egalitarian', bn: 'স্বাধীনতাবাদী ও সমতাভিত্তিক' },
  libertarian_right: { en: 'Libertarian & Free Market', bn: 'স্বাধীনতাবাদী ও মুক্তবাজার' },
  centrist: { en: 'Centrist', bn: 'মধ্যপন্থী' }
};

const PROFILE_THEMES = {
  authoritarian_left: {
    accent: '#F87171',
    secondary: '#BE123C',
    background: '#241014',
    edge: '#08090C'
  },
  authoritarian_right: {
    accent: '#FBBF24',
    secondary: '#B45309',
    background: '#241B0D',
    edge: '#090A0B'
  },
  libertarian_left: {
    accent: '#34D399',
    secondary: '#0F766E',
    background: '#10231D',
    edge: '#070C0B'
  },
  libertarian_right: {
    accent: '#60A5FA',
    secondary: '#4338CA',
    background: '#111A2B',
    edge: '#080A10'
  },
  centrist: {
    accent: '#CBD5E1',
    secondary: '#64748B',
    background: '#19202A',
    edge: '#090B0F'
  }
};

const ISSUE_LABELS = {
  q9: {
    en: 'Proportional representation (PR)',
    bn: 'সংসদ নির্বাচনে আনুপাতিক প্রতিনিধিত্ব (PR)'
  },
  q10: {
    en: 'Prime minister 2-term limit',
    bn: 'প্রধানমন্ত্রীর মেয়াদ সর্বোচ্চ ২ বার'
  },
  q13: {
    en: 'Equal inheritance rights',
    bn: 'উত্তরাধিকারে সমান অধিকার'
  },
  q19: {
    en: 'Privatizing loss-making SOEs',
    bn: 'লোকসানি সরকারি প্রতিষ্ঠান বেসরকারিকরণ'
  },
  q22: {
    en: 'Diversified strategic diplomacy',
    bn: 'বহুমুখী কৌশলগত কূটনীতি ও অংশীদারিত্ব'
  },
  q26: {
    en: 'Repealing Cyber Security Act',
    bn: 'সাইবার নিরাপত্তা আইন বাতিল'
  },
  q33: {
    en: 'Awami League trial & election participation',
    bn: 'আওয়ামী লীগের নির্বাচনে অংশগ্রহণ ও বিচার'
  }
};

const enToBn = (value) => String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[digit]);
const formatScore = (value, isEnglish) => `${isEnglish ? value : enToBn(value)}%`;

const VISION_STATEMENTS = {
  1: {
    left: { en: 'national leadership is strong and effective.', bn: 'জাতীয় নেতৃত্ব হবে শক্তিশালী ও কার্যকর।' },
    balanced: { en: 'public power is balanced and accountable.', bn: 'রাষ্ট্রক্ষমতায় থাকবে ভারসাম্য ও জবাবদিহি।' },
    right: { en: 'public institutions share power and hold each other accountable.', bn: 'প্রতিষ্ঠানগুলো ক্ষমতা ভাগ করে নেবে ও জবাবদিহি নিশ্চিত করবে।' }
  },
  2: {
    left: { en: 'elected leaders guide public policy.', bn: 'নির্বাচিত নেতৃত্ব জননীতির দিকনির্দেশনা দেবে।' },
    balanced: { en: 'elections are fair, trusted, and inclusive.', bn: 'নির্বাচন হবে সুষ্ঠু, আস্থাপূর্ণ ও অংশগ্রহণমূলক।' },
    right: { en: 'independent election oversight gives every voter a voice.', bn: 'নিরপেক্ষ নির্বাচনব্যবস্থায় প্রতিটি ভোটারের মত প্রতিফলিত হবে।' }
  },
  3: {
    left: { en: 'religious values have a meaningful place in public life.', bn: 'জনজীবনে ধর্মীয় মূল্যবোধ মর্যাদার স্থান পাবে।' },
    balanced: { en: 'religious freedom and equal civic rights go hand in hand.', bn: 'ধর্মীয় স্বাধীনতা ও সমান নাগরিক অধিকার পাশাপাশি বিকশিত হবে।' },
    right: { en: 'a secular state protects equal rights for everyone.', bn: 'ধর্মনিরপেক্ষ রাষ্ট্র সবার সমান অধিকার সুরক্ষিত করবে।' }
  },
  4: {
    left: { en: 'public resources build shared prosperity and strong welfare.', bn: 'জনসম্পদে গড়ে উঠবে সমৃদ্ধি ও শক্তিশালী জনকল্যাণ।' },
    balanced: { en: 'enterprise and social protection grow together.', bn: 'উদ্যোগ ও সামাজিক সুরক্ষা একসঙ্গে এগিয়ে যাবে।' },
    right: { en: 'open markets help enterprise and innovation flourish.', bn: 'উন্মুক্ত বাজারে বিকশিত হবে উদ্যোগ ও উদ্ভাবন।' }
  },
  5: {
    left: { en: 'pragmatic diplomacy builds strong regional partnerships.', bn: 'বাস্তবসম্মত কূটনীতিতে গড়ে উঠবে শক্তিশালী আঞ্চলিক সম্পর্ক।' },
    balanced: { en: 'principled diplomacy builds cooperation and mutual respect.', bn: 'নীতিনিষ্ঠ কূটনীতিতে বাড়বে সহযোগিতা ও পারস্পরিক মর্যাদা।' },
    right: { en: 'national sovereignty and equal dignity are upheld.', bn: 'জাতীয় সার্বভৌমত্ব ও সমমর্যাদা সুরক্ষিত থাকবে।' }
  },
  6: {
    left: { en: 'strong public services keep communities safe.', bn: 'কার্যকর জনসেবায় নিরাপদ থাকবে প্রতিটি জনপদ।' },
    balanced: { en: 'public safety and civil liberties reinforce each other.', bn: 'জননিরাপত্তা ও নাগরিক স্বাধীনতা পরস্পরকে শক্তিশালী করবে।' },
    right: { en: 'everyone can speak freely and assemble peacefully.', bn: 'সবাই স্বাধীনভাবে মত প্রকাশ ও শান্তিপূর্ণ সমাবেশ করতে পারবে।' }
  },
  7: {
    left: { en: 'stable constitutional institutions serve the public well.', bn: 'স্থিতিশীল সাংবিধানিক প্রতিষ্ঠান জনগণের কল্যাণে কাজ করবে।' },
    balanced: { en: 'thoughtful reforms strengthen laws and institutions.', bn: 'বিবেচনাপূর্ণ সংস্কারে আইন ও প্রতিষ্ঠান শক্তিশালী হবে।' },
    right: { en: 'renewed institutions deliver justice and equal accountability.', bn: 'নতুনভাবে গড়া প্রতিষ্ঠান ন্যায় ও সমান জবাবদিহি নিশ্চিত করবে।' }
  },
  8: {
    left: { en: 'trusted social protections support people in need.', bn: 'সামাজিক সুরক্ষা মানুষের পাশে থাকবে।' },
    balanced: { en: 'inclusive growth creates fair opportunities for all.', bn: 'অন্তর্ভুক্তিমূলক উন্নয়নে সবার জন্য ন্যায্য সুযোগ তৈরি হবে।' },
    right: { en: 'social equality and fair distribution help everyone thrive.', bn: 'সামাজিক সমতা ও ন্যায্য বণ্টনে সবার অগ্রগতি হবে।' }
  }
};

function getDefaultViewIds(blockResults) {
  return [...(blockResults || [])]
    .sort((a, b) => Math.abs(b.bipolarScore || 0) - Math.abs(a.bipolarScore || 0))
    .slice(0, 4)
    .map((block) => block.id);
}

function getIssueComparisons(answers, issues) {
  const issueById = new Map((issues || []).map((issue) => [issue.id, issue]));
  const comparisons = (answers || []).flatMap(({ questionId, score }) => {
    const issue = issueById.get(questionId);
    if (!issue?.hasData || issue.totalAnswers < MIN_PUBLIC_COHORT_SIZE || score === 3) return [];

    const userAgrees = score >= 4;
    const sameView = userAgrees ? issue.agree : issue.disagree;
    const oppositeView = userAgrees ? issue.disagree : issue.agree;
    return [{
      questionId,
      userAgrees,
      sameView,
      oppositeView,
      sampleSize: issue.totalAnswers
    }];
  });

  const mostAligned = [...comparisons].sort((a, b) => b.sameView - a.sameView)[0] || null;
  const mostDifferent = [...comparisons]
    .sort((a, b) => b.oppositeView - a.oppositeView)
    .find((comparison) => comparison.questionId !== mostAligned?.questionId) || null;

  return { mostAligned, mostDifferent };
}

export default function PersonalityCard({ analysis, lang = 'bn', showcaseOnly = false, demoProfiles = null }) {
  const isEnglish = lang === 'en';

  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const [scale, setScale] = useState(0.42);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [showPoliticalTendency, setShowPoliticalTendency] = useState(true);
  const [showPersonalityMatches, setShowPersonalityMatches] = useState(true);
  const [showIssueComparisons, setShowIssueComparisons] = useState(false);
  const [nickname, setNickname] = useState('');
  const [selectedViewIds, setSelectedViewIds] = useState(showcaseOnly ? THEMATIC_BLOCKS.map(({ id }) => id) : []);
  const { stats } = useAggregateStats('once');

  let requiredViewCount = 4;
  if (showcaseOnly) {
    requiredViewCount = 8;
  } else {
    if (showPersonalityMatches && showIssueComparisons) {
      requiredViewCount = 4;
    } else if (showPersonalityMatches || showIssueComparisons) {
      requiredViewCount = 6;
    } else {
      requiredViewCount = 8;
    }
  }

  useEffect(() => {
    const answeredBlockIds = new Set((analysis?.answers || [])
      .map(({ questionId }) => QUESTIONS.find((question) => question.id === questionId)?.blockId)
      .filter((blockId) => blockId !== undefined));
    const availableBlockIds = new Set((analysis?.blockResults || [])
      .filter((block) => answeredBlockIds.has(block.id))
      .map((block) => block.id));
    setSelectedViewIds((current) => {
      if (showcaseOnly) {
        return (analysis?.blockResults || [])
          .filter((block) => availableBlockIds.has(block.id))
          .map(({ id }) => id);
      }
      const retained = current.filter((id) => availableBlockIds.has(id)).slice(0, requiredViewCount);
      const defaults = getDefaultViewIds((analysis?.blockResults || [])
        .filter((block) => availableBlockIds.has(block.id)));
      for (const id of defaults) {
        if (retained.length >= requiredViewCount) break;
        if (!retained.includes(id)) retained.push(id);
      }
      return retained;
    });
  }, [analysis?.answers, analysis?.blockResults, requiredViewCount, showcaseOnly]);

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

  if (!analysis) return null;

  const { coordinates, quadrantProfile } = analysis;
  const quadrantKey = quadrantProfile?.key || 'centrist';
  const profileLabel = PROFILE_LABELS[quadrantKey] || PROFILE_LABELS.centrist;
  const profileTheme = PROFILE_THEMES[quadrantKey] || PROFILE_THEMES.centrist;
  const country = COUNTRIES[quadrantKey] || COUNTRIES.centrist;
  const people = analysis.personalities || [];
  const internationalMatch = people.find((person) => person.nationality === 'International');
  const bangladeshiMatch = people.find((person) => person.nationality === 'Bangladeshi');
  const primaryBloc = analysis.primaryBloc;
  const trackedAnsweredCount = (analysis.answers || []).filter(({ questionId, score }) =>
    TRACKED_WEDGE_ISSUE_IDS.includes(questionId) && score !== 3
  ).length;
  const tendencyName = isEnglish
    ? primaryBloc?.profile?.englishName || primaryBloc?.profile?.name
    : primaryBloc?.profile?.name;
  const tendencyScore = primaryBloc?.percentage ?? primaryBloc?.relativeShare ?? analysis?.confidence?.topPercentage ?? analysis?.sortedBlocs?.[0]?.percentage;
  const issueComparisons = getIssueComparisons(analysis.answers, stats.wedgeIssues);
  const answeredBlockIds = new Set((analysis.answers || [])
    .map(({ questionId }) => QUESTIONS.find((question) => question.id === questionId)?.blockId)
    .filter((blockId) => blockId !== undefined));
  const viewOptions = (analysis.blockResults || [])
    .filter((block) => answeredBlockIds.has(block.id))
    .map((block) => {
      const score = block.bipolarScore || 0;
      const direction = score > 10 ? 'right' : score < -10 ? 'left' : 'balanced';
      const statement = VISION_STATEMENTS[block.id]?.[direction] || VISION_STATEMENTS[1].balanced;
      return {
        id: block.id,
        blockTitle: isEnglish
          ? ENGLISH_THEMATIC_BLOCKS[block.id]?.title || ''
          : THEMATIC_BLOCKS.find((item) => item.id === block.id)?.title || '',
        text: statement[isEnglish ? 'en' : 'bn'],
        supportPct: Math.round(direction === 'balanced' ? 100 - Math.abs(score) : Math.abs(score))
      };
    });
  const selectedViews = selectedViewIds
    .map((id) => viewOptions.find((view) => view.id === id))
    .filter(Boolean);
  const coordinateLabel = `X(${coordinates.x > 0 ? '+' : ''}${coordinates.x}) · Y(${coordinates.y > 0 ? '+' : ''}${coordinates.y})`;

  const waitForImages = async () => {
    await document.fonts.ready;
    const images = Array.from(cardRef.current?.querySelectorAll('img') || []);
    await Promise.all(images.map(async (image) => {
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
    await waitForImages();
    const source = cardRef.current;
    if (!source) throw new Error('Story-card preview is unavailable.');

    const exportHost = document.createElement('div');
    exportHost.setAttribute('aria-hidden', 'true');
    Object.assign(exportHost.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      width: `${CARD_W}px`,
      height: `${CARD_H}px`,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: '-1',
      opacity: '0'
    });
    const exportCard = source.cloneNode(true);
    exportCard.style.transform = 'none';
    exportCard.style.transformOrigin = 'top left';
    exportCard.style.width = `${CARD_W}px`;
    exportCard.style.height = `${CARD_H}px`;
    exportHost.appendChild(exportCard);
    document.body.appendChild(exportHost);

    try {
      await Promise.all(Array.from(exportCard.querySelectorAll('img'), async (image) => {
        if (!image.complete || !image.naturalHeight) {
          await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = () => reject(new Error(`Could not load story-card image: ${image.src}`));
          });
        }
        if (typeof image.decode === 'function') await image.decode();
      }));

      return await html2canvas(exportCard, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#07110E',
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
            const imageWidth = image.naturalWidth;
            const imageHeight = image.naturalHeight;
            if (!parentWidth || !parentHeight || !imageWidth || !imageHeight) return;

            const scaleToCover = Math.max(parentWidth / imageWidth, parentHeight / imageHeight);
            const width = Math.round(imageWidth * scaleToCover);
            const height = Math.round(imageHeight * scaleToCover);
            image.style.position = 'absolute';
            image.style.width = `${width}px`;
            image.style.height = `${height}px`;
            image.style.left = `${Math.round((parentWidth - width) / 2)}px`;
            image.style.top = `${Math.round((parentHeight - height) / 2)}px`;
            image.style.right = 'auto';
            image.style.bottom = 'auto';
            image.style.maxWidth = 'none';
            image.style.maxHeight = 'none';
          });
        }
      });
    } finally {
      exportHost.remove();
    }
  };

  const downloadCanvas = (canvas, filename) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleDownload = async () => {
    if (downloading || sharing || !cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await generateCanvas();
      downloadCanvas(canvas, 'BD_Political_Compass_Story.png');
    } catch (error) {
      console.error('Personality card download failed:', error);
      alert(isEnglish ? 'Could not prepare the card. Please try again.' : 'কার্ড তৈরি করা যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (downloading || sharing || !cardRef.current) return;
    setSharing(true);
    try {
      const canvas = await generateCanvas();
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((fileBlob) => {
          if (fileBlob) resolve(fileBlob);
          else reject(new Error('Could not create the story image.'));
        }, 'image/png');
      });
      const file = new File([blob], 'BD_Political_Compass_Story.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: isEnglish ? 'My political outlook' : 'আমার রাজনৈতিক দৃষ্টিভঙ্গি',
          text: isEnglish ? 'I completed the Bangladesh Political Compass assessment.' : 'আমি বাংলাদেশ রাজনৈতিক কম্পাসের মূল্যায়ন সম্পন্ন করেছি।'
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = file.name;
        link.href = url;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        alert(isEnglish ? 'Story card downloaded. You can now add it to a social post or story.' : 'স্টোরি কার্ড ডাউনলোড হয়েছে। এখন এটি সামাজিক মাধ্যমে শেয়ার করতে পারবেন।');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('Personality card sharing failed:', error);
        alert(isEnglish ? 'Could not prepare the card for sharing. Please download it instead.' : 'শেয়ারের জন্য কার্ড তৈরি করা যায়নি। ডাউনলোড করে চেষ্টা করুন।');
      }
    } finally {
      setSharing(false);
    }
  };

  const issueCard = (comparison, kind) => {
    const isAligned = kind === 'aligned';
    const issueText = comparison
      ? ISSUE_LABELS[comparison.questionId]?.[isEnglish ? 'en' : 'bn']
        || (isEnglish
          ? ENGLISH_QUESTION_TEXTS[comparison.questionId]
          : QUESTIONS.find((q) => q.id === comparison.questionId)?.text)
        || comparison.questionId
      : null;
    const displayPct = comparison
      ? (isAligned ? comparison.sameView : comparison.oppositeView)
      : null;

    const isCompact = showPersonalityMatches;

    return (
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        flex: '1 1 0',
        minWidth: 0,
        padding: isCompact ? '12px 16px' : '18px 20px',
        borderRadius: '18px',
        background: `linear-gradient(145deg, ${profileTheme.accent}16, rgba(255,255,255,0.035) 68%)`,
        border: `1px solid ${profileTheme.accent}30`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center'
      }}>
        {comparison && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: isAligned ? '#6EE7B7' : '#FDA4AF',
              opacity: 0.15,
              fontSize: isCompact ? '68px' : '88px',
              lineHeight: 1,
              fontWeight: 900,
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            {isAligned ? <ThumbsUp size={isCompact ? 48 : 64} strokeWidth={2.5} /> : <ThumbsDown size={isCompact ? 48 : 64} strokeWidth={2.5} />}
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span>{isEnglish ? displayPct : enToBn(displayPct)}</span>
              <span style={{ fontSize: '24px', verticalAlign: '0.9em' }}>%</span>
            </div>
          </div>
        )}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '85%' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: isCompact ? '10px' : '16px' }}>
            <span style={{ color: isAligned ? '#6EE7B7' : '#FDA4AF', fontSize: isCompact ? '22px' : '25px', fontWeight: 800, lineHeight: 1.25 }}>
              {isAligned
                ? (isEnglish ? 'Most in agreement' : 'যে বিষয়ে সবচেয়ে বেশি একমত')
                : (isEnglish ? 'Most in disagreement' : 'যে বিষয়ে সবচেয়ে বেশি মতভেদ')}
            </span>
          </div>
          {comparison ? (
            <>
              <div style={{ color: '#FBF9F3', fontSize: isCompact ? '26px' : '30px', fontWeight: 700, lineHeight: 1.35, overflowWrap: 'anywhere' }}>
                {issueText}
              </div>
            </>
          ) : (
            <div style={{ color: '#AAB8B2', fontSize: isCompact ? '18px' : '21px', lineHeight: 1.45 }}>
              {trackedAnsweredCount < 2
                ? (isEnglish ? 'Answer more tracked policy issues to show highlights.' : 'তুলনা দেখতে আরও কিছু মূল নীতিগত প্রশ্নের উত্তর দিন।')
                : (isEnglish
                    ? `Not enough participant responses yet (at least ${MIN_PUBLIC_COHORT_SIZE} required to show this comparison).`
                    : `এই তুলনা দেখানোর মতো পর্যাপ্ত উত্তর এখনো সংগৃহীত হয়নি (অন্তত ${enToBn(MIN_PUBLIC_COHORT_SIZE)}টি উত্তর প্রয়োজন)।`)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const cardContent = (
    <div ref={cardRef} style={{
      width: `${CARD_W}px`,
      height: `${CARD_H}px`,
      padding: showIssueComparisons && showPersonalityMatches ? '48px 56px' : '62px 64px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: showIssueComparisons && showPersonalityMatches ? '14px' : '18px',
      overflow: 'hidden',
      borderRadius: '24px',
      position: 'relative',
      color: '#FBF9F3',
      fontFamily: '"Poppins", "Noto Sans Bengali", sans-serif',
      background: `radial-gradient(circle at 100% 0%, ${profileTheme.accent}35, transparent 38%), radial-gradient(circle at 0% 100%, ${profileTheme.secondary}24, transparent 42%), linear-gradient(155deg, ${profileTheme.background} 0%, #10151B 58%, ${profileTheme.edge} 100%)`
    }}>
      <img
        src={lightLogo}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '720px',
          height: '720px',
          left: '75%',
          top: '20%',
          transform: 'translate(-50%, -50%)',
          objectFit: 'contain',
          opacity: 0.1,
          filter: `drop-shadow(0 0 40px ${profileTheme.accent})`,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div style={{
        position: 'absolute',
        inset: '0 0 auto',
        height: '8px',
        background: `linear-gradient(90deg, ${profileTheme.secondary}, ${profileTheme.accent}, ${profileTheme.secondary})`,
        zIndex: 1
      }} />

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', minWidth: 0 }}>
          <img src={darkLogo} alt="" style={{ width: '74px', height: '74px', objectFit: 'contain', flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1.15 }}>BD Political Compass</div>
            <div style={{ marginTop: '6px', color: '#AAB8B2', fontSize: '19px' }}>
              {isEnglish ? 'Bangladesh Open Public Opinion Survey' : 'বাংলাদেশের উন্মুক্ত জনমত জরিপ'}
            </div>
          </div>
        </div>
        <div style={{
          flexShrink: 0,
          padding: '12px 16px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#D6E5DE',
          fontSize: '19px',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          maxWidth: '360px',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {nickname.trim() || (isEnglish ? 'Survey participant' : 'জরিপে অংশগ্রহণকারী')}
        </div>
      </header>
      {showcaseOnly && (
        <div style={{
          zIndex: 1,
          alignSelf: 'flex-end',
          marginTop: '-8px',
          padding: '8px 12px',
          border: `1px solid ${profileTheme.accent}70`,
          borderRadius: '999px',
          background: 'rgba(5,12,10,0.72)',
          color: profileTheme.accent,
          fontSize: '15px',
          fontWeight: 800,
          letterSpacing: '0.04em'
        }}>
          {isEnglish
            ? `ILLUSTRATIVE DEMO · ${demoProfiles} SAMPLE RESPONSES`
            : `কাল্পনিক নমুনা · ${enToBn(demoProfiles || 0)}টি উত্তর`}
        </div>
      )}

      <section style={{
        zIndex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '28px',
        padding: '24px 28px',
        borderLeft: `6px solid ${profileTheme.accent}`
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ color: profileTheme.accent, fontSize: '22px', fontWeight: 800, letterSpacing: '0.08em', lineHeight: 1.4 }}>
            {isEnglish ? 'IDEOLOGICAL PROFILE:' : 'আদর্শিক প্রোফাইল:'}
          </div>
          <div style={{ marginTop: '10px', fontSize: '54px', fontWeight: 800, lineHeight: 1.2, overflowWrap: 'anywhere' }}>
            {isEnglish ? profileLabel.en : profileLabel.bn}
          </div>
          <div style={{ marginTop: '12px', color: '#AAB8B2', fontSize: '21px', fontWeight: 600 }}>
            {isEnglish ? 'Compass position' : 'কম্পাসে অবস্থান'} · {coordinateLabel}
          </div>
        </div>
        <div
          role="img"
          aria-label={isEnglish ? `Compass position ${coordinateLabel}` : `কম্পাসে অবস্থান ${coordinateLabel}`}
          style={{
            position: 'relative',
            width: '190px',
            height: '190px',
            flex: '0 0 190px',
            overflow: 'hidden',
            border: `2px solid ${profileTheme.accent}70`,
            borderRadius: '100px',
            background: `radial-gradient(circle, ${profileTheme.accent}18, rgba(255,255,255,0.025) 72%)`
          }}
        >
          <div style={{ position: 'absolute', left: '50%', top: '12%', bottom: '12%', width: '1px', background: 'rgba(255,255,255,0.3)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '12%', right: '12%', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
          <div style={{ position: 'absolute', left: '50%', top: '7%', transform: 'translateX(-50%)', color: '#AAB8B2', fontSize: '14px', fontWeight: 700 }}>Y+</div>
          <div style={{ position: 'absolute', right: '7%', top: '50%', transform: 'translateY(-50%)', color: '#AAB8B2', fontSize: '14px', fontWeight: 700 }}>X+</div>
          <div style={{
            position: 'absolute',
            left: `${50 + Math.max(-100, Math.min(100, coordinates.x)) * 0.40}%`,
            top: `${50 - Math.max(-100, Math.min(100, coordinates.y)) * 0.40}%`,
            width: '14px',
            height: '14px',
            transform: 'translate(-50%, -50%)',
            border: '3px solid #F8FAFC',
            borderRadius: '50%',
            background: profileTheme.accent,
            boxShadow: `0 0 18px ${profileTheme.accent}`
          }} />
        </div>
      </section>

      {showPersonalityMatches && <section style={{ display: 'flex', gap: '20px', zIndex: 1 }}>
        {[
          {
            person: bangladeshiMatch,
            label: isEnglish ? 'BD' : 'বাংলাদেশি',
            fallback: isEnglish ? 'No Bangladeshi match available' : 'বাংলাদেশি মিল পাওয়া যায়নি',
            tone: '#34D399',
            flex: '1 1 0',
            imageHeight: 550
          },
          {
            person: internationalMatch,
            label: isEnglish ? 'INTL' : 'আন্তর্জাতিক',
            fallback: isEnglish ? 'No international match available' : 'আন্তর্জাতিক তুলনা নেই',
            tone: '#60A5FA',
            flex: '1 1 0',
            imageHeight: 550
          }
        ].map(({ person, label, fallback, tone, flex, imageHeight }) => (
          <div key={label} style={{
            flex,
            minWidth: 0,
            overflow: 'hidden',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.14)',
            background: 'rgba(10,25,21,0.82)'
          }}>
            <div style={{ position: 'relative', height: `${imageHeight}px`, overflow: 'hidden', background: '#10241D' }}>
              {person?.img && (
                <img
                  src={person.img}
                  alt=""
                  data-object-fit="cover"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
                />
              )}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(5,12,10,0.32) 0%, transparent 34%, rgba(5,12,10,0.96) 100%)'
              }} />
              <div style={{
                position: 'absolute',
                left: '18px',
                top: '18px',
                padding: '7px 12px',
                borderRadius: '999px',
                background: 'rgba(5,12,10,0.72)',
                color: tone,
                fontSize: '17px',
                fontWeight: 800,
                lineHeight: 1.3
              }}>
                {label}
              </div>
              {person ? (
                <div style={{ position: 'absolute', left: '22px', right: '22px', bottom: '22px' }}>
                  <div style={{ color: tone, fontSize: '18px', fontWeight: 800, lineHeight: 1.3, letterSpacing: '0.06em', opacity: 0.92 }}>
                    {isEnglish ? 'ILLUSTRATIVE COMPARISON' : 'আনুমানিক তুলনা'}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '28px', fontWeight: 800, lineHeight: 1.2, overflowWrap: 'anywhere' }}>
                    {isEnglish ? person.nameEn : person.nameBn}
                  </div>
                  <div style={{ marginTop: '6px', color: '#E2E8E4', fontSize: '18px', lineHeight: 1.35, overflowWrap: 'anywhere' }}>
                    {isEnglish ? person.roleEn || person.roleBn : person.roleBn}
                  </div>
                </div>
              ) : (
                <div style={{ position: 'absolute', left: '22px', right: '22px', bottom: '22px', color: '#FBF9F3', fontSize: '22px', fontWeight: 700, lineHeight: 1.35 }}>
                  {fallback}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
      }

      <div style={{ zIndex: 1, display: 'flex', gap: '20px', alignItems: 'stretch' }}>
        {showPoliticalTendency && tendencyName && (
          <section style={{
            flex: '1 1 0',
            minWidth: 0,
            padding: '20px 24px',
            borderRadius: '20px',
            border: `1px solid ${profileTheme.accent}55`,
            background: `${profileTheme.accent}12`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ color: profileTheme.accent, fontSize: '15px', fontWeight: 800, letterSpacing: '0.04em' }}>
                {isEnglish ? 'SIMILAR POLITICAL TENDENCY' : 'সাদৃশ্যপূর্ণ রাজনৈতিক ধারা'}
              </div>
              {tendencyScore != null && (
                <div
                  className="font-latin"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '2px 9px',
                    borderRadius: '8px',
                    background: `${profileTheme.accent}24`,
                    border: `1px solid ${profileTheme.accent}66`,
                    color: profileTheme.accent,
                    fontSize: '17px',
                    fontWeight: 900,
                    lineHeight: 1.2
                  }}
                >
                  {formatScore(tendencyScore, isEnglish)}
                </div>
              )}
            </div>
            <div style={{ marginTop: '5px', fontSize: '27px', fontWeight: 800, lineHeight: 1.3, overflowWrap: 'anywhere', color: '#FBF9F3' }}>
              {tendencyName}
            </div>
          </section>
        )}

        <section style={{
          flex: showPoliticalTendency && tendencyName ? '1 1 0' : '1 1 100%',
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '22px 24px',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(12,29,24,0.84)'
        }}>
          <img src={country.flag} alt="" style={{ width: '78px', height: '54px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ color: profileTheme.accent, fontSize: '15px', fontWeight: 800 }}>
              {isEnglish ? 'COMPARABLE COUNTRY MODEL' : 'তুলনীয় রাষ্ট্র মডেল'}
            </div>
            <div style={{ marginTop: '5px', fontSize: '27px', fontWeight: 800, lineHeight: 1.3, overflowWrap: 'anywhere' }}>
              {isEnglish ? country.nameEn : country.nameBn}
            </div>
          </div>
          <Globe2 size={30} color="#60A5FA" />
        </section>
      </div>

      <section style={{
        zIndex: 1,
        padding: showIssueComparisons && showPersonalityMatches ? '14px 18px' : '18px 20px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(12,29,24,0.84)'
      }}>
        <div style={{ marginBottom: showIssueComparisons && showPersonalityMatches ? '12px' : '18px', color: profileTheme.accent, fontSize: showIssueComparisons && showPersonalityMatches ? '26px' : '29px', fontWeight: 850, lineHeight: 1.2 }}>
          {isEnglish ? 'I want a Bangladesh where…' : 'আমার  বাংলাদেশ যেখানে,'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: showIssueComparisons && showPersonalityMatches ? '10px 14px' : '14px 16px' }}>
          {selectedViews.map((view) => (
            <div key={view.id} style={{
              position: 'relative',
              overflow: 'hidden',
              minWidth: 0,
              minHeight: showcaseOnly ? '108px' : (showIssueComparisons && showPersonalityMatches ? '118px' : '150px'),
              padding: showcaseOnly ? '12px 14px' : (showIssueComparisons && showPersonalityMatches ? '12px 16px' : '18px 20px'),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              borderRadius: '18px',
              background: `linear-gradient(145deg, ${profileTheme.accent}16, rgba(255,255,255,0.035) 68%)`,
              border: `1px solid ${profileTheme.accent}30`
            }}>
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: profileTheme.accent,
                  opacity: 0.2,
                  fontSize: showcaseOnly ? '68px' : '88px',
                  lineHeight: 1,
                  fontWeight: 900,
                  fontVariantNumeric: 'tabular-nums',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none'
                }}
              >
                <span>{isEnglish ? view.supportPct : enToBn(view.supportPct)}</span>
                <span style={{ fontSize: '24px', verticalAlign: '0.9em' }}>%</span>
              </div>
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '82%' }}>
                <div style={{ marginBottom: '12px', color: profileTheme.accent, fontSize: '17px', fontWeight: 800, letterSpacing: '0.02em' }}>
                  {view.blockTitle}
                </div>
                <div style={{
                  color: '#F8FAFC',
                  fontSize: showcaseOnly ? '20px' : (showIssueComparisons && showPersonalityMatches ? '22px' : '25px'),
                  fontWeight: 750,
                  lineHeight: 1.4,
                  overflowWrap: 'anywhere'
                }}>
                  {view.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showIssueComparisons && <section style={{
        zIndex: 1,
        padding: showIssueComparisons && showPersonalityMatches ? '14px 18px' : '18px 20px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(12,29,24,0.84)'
      }}>
        <div style={{ marginBottom: showIssueComparisons && showPersonalityMatches ? '12px' : '18px', color: profileTheme.accent, fontSize: showIssueComparisons && showPersonalityMatches ? '26px' : '29px', fontWeight: 850, lineHeight: 1.2 }}>
          {isEnglish ? 'Issue comparisons' : 'ইস্যুভিত্তিক তুলনা'}
        </div>
        <div style={{ display: 'flex', gap: showIssueComparisons && showPersonalityMatches ? '14px' : '16px' }}>
        {issueCard(issueComparisons.mostAligned, 'aligned')}
        {issueCard(issueComparisons.mostDifferent, 'different')}
        </div>
      </section>
      }

      <footer style={{
        zIndex: 1,

        paddingTop: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        borderTop: '1px solid rgba(255,255,255,0.15)',
        color: '#AAB8B2',
        fontSize: '16px'
      }}>
        <span>{showcaseOnly
          ? (isEnglish ? 'Fictional illustration · not live survey results' : 'কাল্পনিক নমুনা · সরাসরি জরিপের ফল নয়')
          : (isEnglish ? 'Your views, issue by issue.' : 'প্রতিটি বিষয়ে আপনার নিজস্ব মত.')}</span>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ color: profileTheme.accent, fontSize: '22px', fontWeight: 800, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
            politicalcompass.web.app
          </div>
        </div>
      </footer>
    </div>
  );

  const buttonStyle = {
    minHeight: '52px',
    padding: '0.8rem 1.2rem',
    borderRadius: '999px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: 700,
    cursor: downloading || sharing ? 'wait' : 'pointer'
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
          boxShadow: `0 24px 60px -15px rgba(0,0,0,0.5), 0 0 0 1.5px ${profileTheme?.accent || '#10B981'}44`,
          background: '#07110E'
        }}
      >
        <div style={{
          width: `${CARD_W}px`,
          height: `${CARD_H}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left'
        }}>
          {cardContent}
        </div>
      </div>

      {!showcaseOnly && <div className="personality-card-options">
      <details
        className="personality-card-picker"
        defaultOpen={typeof window !== 'undefined' && window.matchMedia('(min-width: 900px)').matches}
      >
        <summary className="personality-card-picker-summary">
          <span className="personality-card-picker-heading">
            <span className="personality-card-picker-title">
              {isEnglish ? 'Personalize your story card' : 'আপনার স্টোরি কার্ড সাজান'}
            </span>
            <span className="personality-card-picker-count">
              {isEnglish
                ? `${selectedViews.length} / ${requiredViewCount} selected`
                : `${enToBn(selectedViews.length)} / ${enToBn(requiredViewCount)} নির্বাচিত`}
            </span>
          </span>
          <span className="personality-card-picker-help">
            {isEnglish
              ? 'Choose four statements based on your answers.'
              : 'আপনার উত্তরের ভিত্তিতে চারটি বক্তব্য বেছে নিন।'}
          </span>
        </summary>
        <div className="personality-card-picker-options">
          {viewOptions.map((view) => {
            const isSelected = selectedViewIds.includes(view.id);
            return (
              <button
                key={view.id}
                type="button"
                aria-pressed={isSelected}
                disabled={!isSelected && selectedViews.length >= requiredViewCount}
                onClick={() => setSelectedViewIds((current) => (
                  current.includes(view.id)
                    ? current.filter((id) => id !== view.id)
                    : current.length < requiredViewCount ? [...current, view.id] : current
                ))}
                className={`personality-card-option${isSelected ? ' is-selected' : ''}`}
              >
                <span className="personality-card-option-heading">
                  <span className="personality-card-option-title">{view.blockTitle}</span>
                  <span className="personality-card-option-status">
                    {isSelected
                      ? <><CheckCircle2 size={16} aria-hidden="true" />{isEnglish ? 'Added' : 'যুক্ত হয়েছে'}</>
                      : isEnglish ? 'Tap to add' : 'যুক্ত করতে চাপুন'}
                  </span>
                </span>
                <span className="personality-card-option-text">{view.text}</span>
                {!isSelected && <span className="personality-card-option-support">{formatScore(view.supportPct, isEnglish)} {isEnglish ? 'support' : 'সমর্থন'}</span>}
              </button>
            );
          })}
        </div>
      </details>

      <div className="personality-card-builder">
        <div className="personality-card-builder-heading">
          <span className="personality-card-builder-title">{isEnglish ? 'Card details' : 'কার্ডের তথ্য'}</span>
          <span>{isEnglish ? 'Optional — you control what appears on your share card.' : 'ঐচ্ছিক — শেয়ার কার্ডে কী থাকবে তা আপনিই ঠিক করুন।'}</span>
        </div>
        <div className="personality-card-builder-fields">
          <label className="personality-card-nickname" htmlFor="personality-card-nickname">
          <span className="personality-card-field-title">
            {isEnglish ? 'Add a nickname (optional)' : 'ডাকনাম যোগ করুন (ঐচ্ছিক)'}
          </span>
          <span className="personality-card-field-help">
            {isEnglish
              ? 'This name appears on your shared card.'
              : 'শেয়ার করা কার্ডে এই নামটি দেখা যাবে।'}
          </span>
          <input
            id="personality-card-nickname"
            type="text"
            value={nickname}
            maxLength={24}
            placeholder={isEnglish ? 'Your nickname' : 'আপনার ডাকনাম'}
            onChange={(event) => setNickname(event.target.value)}
            className="personality-card-nickname-input"
          />
        </label>
          <label className={`personality-card-tendency${showPoliticalTendency ? ' is-enabled' : ''}`} htmlFor="show-political-tendency">
            <span className="personality-card-tendency-copy">
              <span className="personality-card-field-title">
                {isEnglish ? 'Show my political tendency' : 'আমার রাজনৈতিক প্রবণতা দেখান'}
              </span>
              <span className="personality-card-field-help">
                {isEnglish
                  ? 'Off by default. Adds your closest political-profile similarity.'
                  : 'ডিফল্টভাবে বন্ধ। চালু করলে কাছাকাছি রাজনৈতিক প্রোফাইলের সাদৃশ্য যোগ হবে।'}
              </span>
            </span>
            <span className="personality-card-switch">
              <input
                id="show-political-tendency"
                type="checkbox"
                checked={showPoliticalTendency}
                onChange={(event) => setShowPoliticalTendency(event.target.checked)}
              />
              <span aria-hidden="true" />
            </span>
          </label>
          <label className={`personality-card-tendency${showPersonalityMatches ? ' is-enabled' : ''}`} htmlFor="show-personality-matches">
            <span className="personality-card-tendency-copy">
              <span className="personality-card-field-title">
                {isEnglish ? 'Show historical personality comparisons' : 'ঐতিহাসিক ব্যক্তিত্বের তুলনা দেখান'}
              </span>
              <span className="personality-card-field-help">
                {isEnglish
                  ? 'Off by default. Adds one Bangladeshi and one international historical figure.'
                  : 'ডিফল্টভাবে বন্ধ। একজন বাংলাদেশি ও একজন আন্তর্জাতিক ঐতিহাসিক ব্যক্তিত্ব যোগ হবে।'}
              </span>
            </span>
            <span className="personality-card-switch">
              <input
                id="show-personality-matches"
                type="checkbox"
                checked={showPersonalityMatches}
                onChange={(event) => setShowPersonalityMatches(event.target.checked)}
              />
              <span aria-hidden="true" />
            </span>
          </label>
          <label className={`personality-card-tendency${showIssueComparisons ? ' is-enabled' : ''}`} htmlFor="show-issue-comparisons">
            <span className="personality-card-tendency-copy">
              <span className="personality-card-field-title">
                {isEnglish ? 'Show issue comparisons' : 'ইস্যুভিত্তিক তুলনা দেখান'}
              </span>
              <span className="personality-card-field-help">
                {isEnglish
                  ? 'Off by default. Adds what you agree and disagree with most participants on.'
                  : 'ডিফল্টভাবে বন্ধ। অংশগ্রহণকারীদের সঙ্গে কোন বিষয়ে বেশি একমত ও মতভেদ তা যোগ হবে।'}
              </span>
            </span>
            <span className="personality-card-switch">
              <input
                id="show-issue-comparisons"
                type="checkbox"
                checked={showIssueComparisons}
                onChange={(event) => setShowIssueComparisons(event.target.checked)}
              />
              <span aria-hidden="true" />
            </span>
          </label>
        </div>
      </div>

      <div className="personality-card-actions">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading || sharing || selectedViews.length !== requiredViewCount}
          className="btn-primary font-latin personality-card-action personality-card-action-primary"
          style={{ ...buttonStyle, flex: '1 1 210px', opacity: selectedViews.length === requiredViewCount ? 1 : 0.55 }}
        >
          <Download size={18} />
          {downloading ? (isEnglish ? 'Preparing...' : 'তৈরি হচ্ছে...') : (isEnglish ? 'Download story card' : 'স্টোরি কার্ড ডাউনলোড')}
        </button>
        <button
          type="button"
          onClick={handleShare}
          disabled={sharing || downloading || selectedViews.length !== requiredViewCount}
          className="btn-primary font-latin personality-card-action"
          style={{ ...buttonStyle, flex: '1 1 210px', opacity: selectedViews.length === requiredViewCount ? 1 : 0.55 }}
        >
          <Share2 size={18} />
          {sharing ? (isEnglish ? 'Preparing share...' : 'শেয়ার তৈরি হচ্ছে...') : (isEnglish ? 'Share story card' : 'স্টোরি কার্ড শেয়ার')}
        </button>
      </div>
      </div>}
    </div>
  );
}
