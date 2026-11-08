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


const PoleIcon = ({ blockKey, side, style }) => {
  const iconId = POLE_ICONS[blockKey]?.[side] || 'pole-balance';
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
  state_power: "ক্ষমতা কি এক জায়গায় থাকবে, নাকি ভাগ হবে? শক্তিশালী কেন্দ্রীয় সরকার বনাম ক্ষমতার ভারসাম্য ও বিকেন্দ্রীকরণ।",
  economy_market: "অর্থনীতি কে চালাবে — রাষ্ট্র না বাজার? ভর্তুকি ও রাষ্ট্রীয় মালিকানা বনাম বেসরকারি উদ্যোগ।",
  civil_liberties: "নিরাপত্তা আর স্বাধীনতার টানাপোড়েনে আপনি কোন দিকে? আইনশৃঙ্খলা বনাম বাকস্বাধীনতা ও ন্যায্য বিচার।",
  religion_society: "রাষ্ট্র ও আইনে ধর্মের জায়গা কতটুকু? ধর্মীয় মূল্যবোধ বনাম ধর্মনিরপেক্ষ রাষ্ট্র।",
  sovereignty: "প্রতিবেশী ও বিশ্বের সাথে কেমন সম্পর্ক? সমঝোতার কূটনীতি বনাম কঠোর দর-কষাকষি।",
  democracy: "নির্বাচন কার অধীনে, কোন পদ্ধতিতে? নির্বাচিত সরকারের অধীনে বনাম নির্দলীয় তত্ত্বাবধায়ক ও আনুপাতিক ভোট।",
  state_reform: "সংবিধান ও প্রতিষ্ঠান — ধাপে ধাপে সংশোধন, নাকি আমূল সংস্কার?",
  social_justice: "উন্নয়নের সুফল কার কাছে যাবে? বাজার ও মেধা বনাম শ্রমিক, নারী ও সংখ্যালঘুর সুরক্ষা।"
};

const AXIS_DESCRIPTIONS_EN = {
  state_power: 'Measures how state power is distributed, from strong centralized government to decentralized authority.',
  economy_market: 'Describes the balance between public and private ownership, from socialist policies to free markets.',
  civil_liberties: 'Measures state interference in personal freedoms in the name of law and order against individual rights.',
  religion_society: 'Measures the balance between religious rules in the state and secularism.',
  sovereignty: 'How to deal with neighbours and the world: accommodation versus hard bargaining.',
  democracy: 'Shows the balance between party control of elections and executive power, and neutral oversight.',
  state_reform: 'Shows the balance between constitutional continuity and institutional reform.',
  social_justice: 'Who benefits from growth: markets and merit versus protection for workers, women and minorities.'
};

export default function AxisGrid({ lang = 'bn' }) {
  const isEnglish = lang === 'en';

  return (
    <div style={{ padding: '4rem 1.5rem', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '1360px', width: '100%' }}>

        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-red)', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.1em' }} className="font-latin">
              {isEnglish ? '— WHAT WE ASK ABOUT' : '— কী নিয়ে প্রশ্ন'}
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            {isEnglish ? 'Eight big questions, two sides each' : 'কোন ৮টি বিষয়ে প্রশ্ন?'}
          </h2>
        </div>

        <div className="axis-grid-container">
          {THEMATIC_BLOCKS.map((block, idx) => {
            const englishBlock = ENGLISH_THEMATIC_BLOCKS[block.id];
            const title = isEnglish
              ? englishBlock?.title || block.title
              : block.title;
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
                  <PoleIcon blockKey={block.key} side="left" style={{ width: '14px', height: '14px' }} />
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
                  <PoleIcon blockKey={block.key} side="right" style={{ width: '14px', height: '14px' }} />
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
