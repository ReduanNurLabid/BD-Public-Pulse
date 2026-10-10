import React from 'react';
import { ENGLISH_THEMATIC_BLOCKS, THEMATIC_BLOCKS } from '../data/questions';

// Mapping each thematic block's left & right poles to the asset symbols in /icons.svg
const POLE_ICONS = {
  state_power: {
    left: 'pole-authoritarian',
    right: 'pole-balance'
  },
  democracy: {
    left: 'pole-party-control',
    right: 'pole-neutral-system'
  },
  religion_society: {
    left: 'pole-religious-rule',
    right: 'pole-secularism'
  },
  economy_market: {
    left: 'pole-public-welfare',
    right: 'pole-free-market'
  },
  sovereignty: {
    left: 'pole-diplomacy',
    right: 'pole-sovereignty'
  },
  civil_liberties: {
    left: 'pole-surveillance',
    right: 'pole-liberty'
  },
  state_reform: {
    left: 'pole-status-quo',
    right: 'pole-transformation'
  },
  social_justice: {
    left: 'pole-unregulated',
    right: 'pole-equality'
  }
};

// Explicit text-based mapping for direct pole matching
const POLE_TEXT_TO_ICON = {
  'কর্তৃত্ববাদী': 'pole-authoritarian',
  'ভারসাম্যমুখী': 'pole-balance',
  'দলীয় নিয়ন্ত্রণ': 'pole-party-control',
  'নিরপেক্ষ ব্যবস্থা': 'pole-neutral-system',
  'ধর্মীয় অনুশাসন': 'pole-religious-rule',
  'ধর্মনিরপেক্ষতা': 'pole-secularism',
  'সামষ্টিক / কল্যাণ': 'pole-public-welfare',
  'মুক্তবাজার': 'pole-free-market',
  'আঞ্চলিক আপস': 'pole-diplomacy',
  'আপসহীন মর্যাদা': 'pole-sovereignty',
  'কঠোর নিয়ন্ত্রণ': 'pole-surveillance',
  'বাকস্বাধীনতা': 'pole-liberty',
  'স্থিতাবস্থা': 'pole-status-quo',
  'আমূল রূপান্তর': 'pole-transformation',
  'অনিয়ন্ত্রিত বাজার': 'pole-unregulated',
  'সামাজিক সমতা': 'pole-equality'
};

const PoleIcon = ({ blockKey, side, poleText, style }) => {
  const iconId = POLE_TEXT_TO_ICON[poleText] || POLE_ICONS[blockKey]?.[side] || 'pole-balance';
  return (
    <svg
      style={{
        width: '18px',
        height: '18px',
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style
      }}
      aria-hidden="true"
    >
      <use href={`/icons.svg#${iconId}`} xlinkHref={`/icons.svg#${iconId}`} />
    </svg>
  );
};

const AXIS_DESCRIPTIONS = {
  state_power: "রাষ্ট্রীয় ক্ষমতা কীভাবে বণ্টিত হবে তা পরিমাপ করে। এটি কেন্দ্রীয় শক্তিশালী শাসন ও বিকেন্দ্রীকরণের মধ্যে পার্থক্য নির্দেশ করে।",
  economy_market: "অর্থনীতিতে রাষ্ট্রীয় বনাম ব্যক্তিমালিকানার ভারসাম্য নির্ধারণ করে। সমাজতান্ত্রিক বনাম মুক্তবাজার নীতির পার্থক্য।",
  civil_liberties: "রাষ্ট্রের আইনশৃঙ্খলার নামে ব্যক্তিস্বাধীনতায় হস্তক্ষেপ বনাম নিরঙ্কুশ ব্যক্তি অধিকারের মাত্রা নির্ণয় করে।",
  religion_society: "রাষ্ট্রে ধর্মীয় অনুশাসনের ভূমিকা ও ধর্মনিরপেক্ষতার ভারসাম্য পরিমাপ করে।",
  sovereignty: "আন্তর্জাতিক ক্ষেত্রে জাতীয়তাবাদী বিচ্ছিন্নতা বনাম বৈশ্বিক জোট ও বন্ধুত্বের নীতি।",
  democracy: "নির্বাচন ও নির্বাহী ক্ষমতায় দলীয় নিয়ন্ত্রণ এবং নিরপেক্ষ তত্ত্বাবধানের মধ্যকার ভারসাম্য দেখায়।",
  state_reform: "সাংবিধানিক স্থিতাবস্থা ও প্রাতিষ্ঠানিক সংস্কারের মধ্যকার অবস্থান দেখায়।",
  social_justice: "বিদ্যমান কাঠামো এবং সামাজিক সমতা ও জবাবদিহির মধ্যকার অবস্থান দেখায়।"
};

const AXIS_DESCRIPTIONS_EN = {
  state_power: 'Measures how state power is distributed, from strong centralized government to decentralized authority.',
  economy_market: 'Describes the balance between public and private ownership, from socialist policies to free markets.',
  civil_liberties: 'Measures state interference in personal freedoms in the name of law and order against individual rights.',
  religion_society: 'Measures the balance between religious rules in the state and secularism.',
  sovereignty: 'Contrasts nationalist isolation with international alliances and cooperation.',
  democracy: 'Shows the balance between party control of elections and executive power, and neutral oversight.',
  state_reform: 'Shows the balance between constitutional continuity and institutional reform.',
  social_justice: 'Shows the balance between existing structures and social equality with accountability.'
};

export default function AxisGrid({ lang = 'bn' }) {
  const isEnglish = lang === 'en';

  return (
    <div style={{ padding: '4rem 1.5rem', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '1360px', width: '100%' }}>

        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-red)', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.1em' }} className="font-latin">
              {isEnglish ? '— ONGOING SURVEY' : '— চলমান জরিপ'}
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            {isEnglish ? 'What are the 8 dimensions of this survey?' : 'এই জরিপের ৮টি মাপকাঠি কী কী?'}
          </h2>
        </div>

        <div className="axis-grid-container">
          {THEMATIC_BLOCKS.map((block, idx) => {
            const englishBlock = ENGLISH_THEMATIC_BLOCKS[block.id];
            const title = isEnglish
              ? englishBlock?.title || block.title
              : block.title.replace(/নীতি|বিষয়ক/g, '').trim();
            const leftShort = isEnglish ? englishBlock?.leftShort || block.leftShort : block.leftShort;
            const rightShort = isEnglish ? englishBlock?.rightShort || block.rightShort : block.rightShort;
            return (
            <div
              key={block.key}
              className="axis-grid-card"
              style={{
                background: 'var(--bg-card)',
                borderRadius: '16px',
                padding: 'clamp(1.2rem, 2vw, 1.5rem) clamp(0.85rem, 1.5vw, 1.15rem)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.1rem'
              }}
            >
              {/* Header: Number + Title */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', minWidth: 0, minHeight: '2.8rem' }}>
                <span className="font-latin" style={{ color: 'var(--text-red)', fontSize: '1.05rem', fontWeight: 800, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 style={{ fontSize: 'clamp(1.05rem, 1.25vw, 1.2rem)', fontWeight: 800, color: 'var(--text-primary)', margin: 0, minWidth: 0, lineHeight: 1.25 }}>
                  {title}
                </h3>
              </div>

              {/* Sub-header: Icons & Poles in a sleek 1-line bipolar strip */}
              <div
                className="axis-pole-strip"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.35rem',
                  padding: '0.45rem 0.6rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: 'var(--text-primary)',
                    flexShrink: 0
                  }}
                >
                  <PoleIcon blockKey={block.key} side="left" poleText={block.leftShort} style={{ width: '14px', height: '14px' }} />
                  <span>{leftShort}</span>
                </div>

                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', flexShrink: 0, padding: '0 0.1rem' }}>⇄</span>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: 'var(--text-red)',
                    flexShrink: 0,
                    justifyContent: 'flex-end'
                  }}
                >
                  <span>{rightShort}</span>
                  <PoleIcon blockKey={block.key} side="right" poleText={block.rightShort} style={{ width: '14px', height: '14px' }} />
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0, flex: 1 }}>
                {(isEnglish ? AXIS_DESCRIPTIONS_EN[block.key] : AXIS_DESCRIPTIONS[block.key]) || (isEnglish ? englishBlock?.subtitle : block.subtitle)}
              </p>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
