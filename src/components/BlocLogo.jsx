import React from 'react';
import alLogo from '../assets/bangladesh-awami-league-seeklogo.png';
import bnpLogo from '../assets/bnp-seeklogo.png';
import jiLogo from '../assets/bangladesh-jamaat-e-islami-seeklogo.png';
import ncpLogo from '../assets/ncp-logo.png';
import sushilLogo from '../assets/উদার সংবিধানবাদী সুশীল logo.svg';
import { BLOC_PROFILES } from '../data/questions';

// Crest art per bloc key. Anything absent falls back to a neutral glyph rather
// than silently rendering an empty circle.
const CRESTS = {
  Student: { src: ncpLogo, alt: 'NCP Crest', inset: '90%' },
  AL: { src: alLogo, alt: 'Awami League Crest', inset: '84%' },
  BNP: { src: bnpLogo, alt: 'BNP Crest', inset: '84%' },
  JI: { src: jiLogo, alt: 'Jamaat-e-Islami Crest', inset: '82%' },
  Sushil: { src: sushilLogo, alt: 'উদার সংবিধানবাদী সুশীল', inset: '84%' }
};

/**
 * Renders authentic party crest / insignia for each political bloc.
 *
 * The tooltip comes from BLOC_PROFILES so the accessible name can never drift
 * from the name shown on the charts, cards and result screen.
 */
export default function BlocLogo({ blocKey, size = 32, style = {} }) {
  const containerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1.5px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    ...style
  };

  // 'NCP' is accepted as an alias so callers holding the English key still resolve.
  const key = blocKey === 'NCP' ? 'Student' : blocKey;
  const crest = CRESTS[key];

  if (crest) {
    return (
      <div style={{ ...containerStyle, background: '#FFFFFF' }} title={BLOC_PROFILES[key]?.name || key}>
        <img
          src={crest.src}
          alt={crest.alt}
          style={{ width: crest.inset, height: crest.inset, objectFit: 'contain' }}
        />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <span style={{ fontSize: `${size * 0.5}px` }}>⚖️</span>
    </div>
  );
}