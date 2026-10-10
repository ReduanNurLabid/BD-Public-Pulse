import React from 'react';

/**
 * 2D Political Compass Chart (SVG) - High-Contrast Light Mode Engine
 * Features:
 * - High-contrast horizontal and vertical axes (Dark Slate #0F172A)
 * - Calibrated low-opacity quadrant zones (opacity: 0.15) for maximum watermark text legibility
 * - Solid Dark Blue/Black user plotting dot with crisp white border
 * - Floating precision coordinate badge
 * - Fully responsive mini and full compass modes
 */
export default function CompassChart({ coordinates, quadrantProfile, primaryBloc, isMini = false, miniMaxWidth = '280px', lang = 'bn' }) {
  const isEnglish = lang === 'en';
  const quadrantTitles = {
    authoritarian_left: 'Authoritarian Left',
    authoritarian_right: 'Authoritarian Right',
    libertarian_left: 'Libertarian Left',
    libertarian_right: 'Libertarian Right',
    centrist: 'Centrist'
  };
  const quadrantTitle = isEnglish
    ? (quadrantTitles[quadrantProfile?.key] || 'Political Quadrant')
    : quadrantProfile?.title;
  const { x = 0, y = 0 } = coordinates || {};

  // Map [-100, 100] coordinate space to SVG Viewbox [40, 440]
  // Center is (240, 240)
  const mapCoordinateToSvg = (val) => {
    return 240 + (val / 100) * 200;
  };

  const svgX = mapCoordinateToSvg(x);
  const svgY = 240 - (y / 100) * 200; // Inverted for SVG Y

  // User dot color: Solid Dark Blue / Black with crisp white border
  const solidDotColor = '#0F172A';

  if (isMini) {
    // Ultra crisp self-contained mini compass for certificate/card
    return (
      <div style={{ width: '100%', maxWidth: miniMaxWidth, aspectRatio: '1 / 1', position: 'relative' }}>
        <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            {/* Low Opacity Quadrant Gradients (<= 0.15) */}
            <radialGradient id="mini-tl" cx="20%" cy="20%" r="80%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.03" />
            </radialGradient>
            <radialGradient id="mini-tr" cx="80%" cy="20%" r="80%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.03" />
            </radialGradient>
            <radialGradient id="mini-bl" cx="20%" cy="80%" r="80%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.03" />
            </radialGradient>
            <radialGradient id="mini-br" cx="80%" cy="80%" r="80%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.03" />
            </radialGradient>
          </defs>

          {/* Canvas Background */}
          <rect x="20" y="20" width="360" height="360" fill="var(--bg-card)" rx="8" />

          {/* Quadrant backgrounds */}
          <rect x="20" y="20" width="180" height="180" fill="url(#mini-tl)" rx="8" />
          <rect x="200" y="20" width="180" height="180" fill="url(#mini-tr)" rx="8" />
          <rect x="20" y="200" width="180" height="180" fill="url(#mini-bl)" rx="8" />
          <rect x="200" y="200" width="180" height="180" fill="url(#mini-br)" rx="8" />

          {/* Grid lines */}
          {[60, 100, 140, 260, 300, 340].map(c => (
            <React.Fragment key={c}>
              <line x1={c} y1="20" x2={c} y2="380" stroke="rgba(15, 23, 42, 0.08)" strokeDasharray="3 3" />
              <line x1="20" y1={c} x2="380" y2={c} stroke="rgba(15, 23, 42, 0.08)" strokeDasharray="3 3" />
            </React.Fragment>
          ))}

          {/* Outer Border */}
          <rect x="20" y="20" width="360" height="360" fill="none" stroke="#CBD5E1" strokeWidth="1.5" rx="8" />

          {/* Main High-Contrast Dark Crosshairs */}
          <line x1="15" y1="200" x2="385" y2="200" stroke="#0F172A" strokeWidth="2.2" strokeOpacity="0.85" />
          <line x1="200" y1="15" x2="200" y2="385" stroke="#0F172A" strokeWidth="2.2" strokeOpacity="0.85" />

          {/* Origin Centrist Ring */}
          <circle cx="200" cy="200" r="26" fill="rgba(2, 132, 199, 0.06)" stroke="rgba(2, 132, 199, 0.35)" strokeDasharray="3 3" />

          {/* Coordinate Scale mapping for mini [20 to 380, center 200] */}
          {(() => {
            const mX = 200 + (x / 100) * 180;
            const mY = 200 - (y / 100) * 180;
            return (
              <>
                {/* Subtle pulse ring */}
                <circle cx={mX} cy={mY} r="14" fill="none" stroke="#0F172A" strokeWidth="1.5" opacity="0.35" />
                {/* Solid Dark Blue / Black dot with crisp white border */}
                <circle cx={mX} cy={mY} r="7" fill={solidDotColor} stroke="#FFFFFF" strokeWidth="2.5" />
                <circle cx={mX} cy={mY} r="2" fill="#FFFFFF" />
              </>
            );
          })()}
        </svg>

        {/* Mini Compass Axis Labels in High-Contrast Colors */}
        <div style={{ position: 'absolute', top: '-20px', left: '0', right: '0', textAlign: 'center', fontSize: '0.72rem', color: '#0369A1', fontWeight: 800 }}>
          {isEnglish ? '▲ LIBERTARIAN' : '▲ স্বাধীনতাবাদী (LIBERTARIAN)'}
        </div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '0', right: '0', textAlign: 'center', fontSize: '0.72rem', color: '#B91C1C', fontWeight: 800 }}>
          {isEnglish ? '▼ AUTHORITARIAN' : '▼ কর্তৃত্ববাদী (AUTHORITARIAN)'}
        </div>
        <div style={{ position: 'absolute', left: '-26px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontSize: '0.68rem', color: '#047857', fontWeight: 800 }}>
          {isEnglish ? '◄ COLLECTIVE' : '◄ সামষ্টিক'}
        </div>
        <div style={{ position: 'absolute', right: '-26px', top: '50%', transform: 'translateY(-50%) rotate(90deg)', fontSize: '0.68rem', color: '#B45309', fontWeight: 800 }}>
          {isEnglish ? 'FREE MARKET ►' : 'মুক্তবাজার ►'}
        </div>
      </div>
    );
  }

  // Full High-Resolution Compass on Result Screen (Light Mode Engine)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      
      {/* Compass Canvas Container - Clean White Card with Subtle Elevation */}
      {/* Compass Canvas Container */}
      <div 
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto',
          padding: '1rem',
          borderRadius: '24px',
          border: '1.5px solid var(--border-medium)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Horizontal Top Label Pill (Libertarian) */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          background: 'var(--bg-card)',
          border: '1.5px solid #0284C7',
          borderRadius: '9999px',
          padding: '0.2rem 0.6rem',
          fontSize: 'clamp(0.62rem, 2vw, 0.78rem)',
          fontWeight: 700,
          color: '#0284C7',
          boxShadow: 'var(--shadow-sm)',
          whiteSpace: 'nowrap',
          maxWidth: '92%',
          textAlign: 'center'
        }}>
          {isEnglish ? '▲ LIBERTARIAN & CIVIL LIBERTIES' : '▲ স্বাধীনতাবাদী ও নাগরিক অধিকার (LIBERTARIAN)'}
        </div>

        {/* Horizontal Bottom Label Pill (Authoritarian) */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          background: 'var(--bg-card)',
          border: '1.5px solid #DC2626',
          borderRadius: '9999px',
          padding: '0.2rem 0.6rem',
          fontSize: 'clamp(0.62rem, 2vw, 0.78rem)',
          fontWeight: 700,
          color: '#DC2626',
          boxShadow: 'var(--shadow-sm)',
          whiteSpace: 'nowrap',
          maxWidth: '92%',
          textAlign: 'center'
        }}>
          {isEnglish ? '▼ AUTHORITARIAN & CENTRAL ORDER' : '▼ কর্তৃত্ববাদী ও কেন্দ্রীয় শৃঙ্খলা (AUTHORITARIAN)'}
        </div>

        <svg 
          viewBox="0 0 480 480" 
          style={{ width: '100%', height: 'auto', overflow: 'visible', display: 'block' }}
        >
          <defs>
            {/* Low Opacity Quadrant Gradients (opacity: 0.15) for Light Mode */}
            <radialGradient id="grad-tl" cx="25%" cy="25%" r="75%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.15" />
              <stop offset="60%" stopColor="#EF4444" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
            </radialGradient>
            
            <radialGradient id="grad-tr" cx="75%" cy="25%" r="75%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
              <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
            </radialGradient>

            <radialGradient id="grad-bl" cx="25%" cy="75%" r="75%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
              <stop offset="60%" stopColor="#10B981" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
            </radialGradient>

            <radialGradient id="grad-br" cx="75%" cy="75%" r="75%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.15" />
              <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
            </radialGradient>

            {/* Crisp Drop Shadow for Marker Dot */}
            <filter id="dot-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* 4 Quadrants Fill with Low Opacity (0.15) */}
          <rect x="36" y="36" width="204" height="204" fill="url(#grad-tl)" rx="10" />
          <rect x="240" y="36" width="204" height="204" fill="url(#grad-tr)" rx="10" />
          <rect x="36" y="240" width="204" height="204" fill="url(#grad-bl)" rx="10" />
          <rect x="240" y="240" width="204" height="204" fill="url(#grad-br)" rx="10" />

          {/* Subtle Grid Lines (Every 40 units) */}
          {[76, 116, 156, 196, 284, 324, 364, 404].map(coord => (
            <React.Fragment key={coord}>
              <line x1={coord} y1="36" x2={coord} y2="444" stroke="var(--border-subtle)" strokeDasharray="3 3" />
              <line x1="36" y1={coord} x2="444" y2={coord} stroke="var(--border-subtle)" strokeDasharray="3 3" />
            </React.Fragment>
          ))}

          {/* Outer Border */}
          <rect x="36" y="36" width="408" height="408" fill="none" stroke="var(--border-medium)" strokeWidth="1.8" rx="10" />

          {/* Origin Centrist Circle (r=38) */}
          <circle cx="240" cy="240" r="38" fill="rgba(2, 132, 199, 0.05)" stroke="rgba(2, 132, 199, 0.35)" strokeDasharray="4 4" />
          <text x="240" y="244" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="700">
            {isEnglish ? 'CENTRIST' : 'সুশীল মধ্যপন্থা'}
          </text>

          {/* Crisp High-Contrast Crosshairs Axes at (0, 0) */}
          {/* X Axis (Horizontal) */}
          <line x1="26" y1="240" x2="454" y2="240" stroke="var(--text-primary)" strokeWidth="2.5" strokeOpacity="0.85" />
          {/* Y Axis (Vertical) */}
          <line x1="240" y1="26" x2="240" y2="454" stroke="var(--text-primary)" strokeWidth="2.5" strokeOpacity="0.85" />

          {/* Horizontal Axis Badges on Left and Right Inside SVG */}
          {/* Left: Collectivist */}
          <g transform="translate(42, 224)">
            <rect x="0" y="0" width="108" height="28" rx="6" fill="var(--bg-card)" stroke="#059669" strokeWidth="1.2" />
            <text x="54" y="18" textAnchor="middle" fill="#047857" fontSize="12" fontWeight="800">
              {isEnglish ? '◄ COLLECTIVE WELFARE' : '◄ সামষ্টিক কল্যাণ'}
            </text>
          </g>

          {/* Right: Free Market */}
          <g transform="translate(330, 224)">
            <rect x="0" y="0" width="108" height="28" rx="6" fill="var(--bg-card)" stroke="#D97706" strokeWidth="1.2" />
            <text x="54" y="18" textAnchor="middle" fill="#B45309" fontSize="12" fontWeight="800">
              {isEnglish ? 'FREE MARKET ►' : 'মুক্তবাজার ►'}
            </text>
          </g>

          {/* Watermark Quadrant Titles - Increased font size for mobile readability */}
          <text x="138" y="74" textAnchor="middle" fill="#334155" fontSize="15" fontWeight="700">
            {isEnglish ? 'LIBERTARIAN LEFT' : 'সামাজিক প্রগতিশীল'}
          </text>
          <text x="342" y="74" textAnchor="middle" fill="#334155" fontSize="15" fontWeight="700">
            {isEnglish ? 'LIBERTARIAN RIGHT' : 'উদার মুক্তবাজারপন্থী'}
          </text>
          <text x="138" y="420" textAnchor="middle" fill="#334155" fontSize="15" fontWeight="700">
            {isEnglish ? 'AUTHORITARIAN LEFT' : 'কর্তৃত্ববাদী সমাজকল্যাণ'}
          </text>
          <text x="342" y="420" textAnchor="middle" fill="#334155" fontSize="15" fontWeight="700">
            {isEnglish ? 'AUTHORITARIAN RIGHT' : 'জাতীয় ঐতিহ্যবাদী'}
          </text>

          {/* User's Plotted Coordinate Dot: Solid Dark Blue/Black (#0F172A) with Crisp White Border */}
          {/* Primary Pulse Ring 1 */}
          <circle cx={svgX} cy={svgY} r="22" fill="none" stroke="#0F172A" strokeWidth="2" opacity="0.35">
            <animate attributeName="r" values="10;30;10" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.45;0.05;0.45" dur="2.4s" repeatCount="indefinite" />
          </circle>

          {/* Primary Pulse Ring 2 */}
          <circle cx={svgX} cy={svgY} r="14" fill="none" stroke="#0F172A" strokeWidth="1.5" opacity="0.25">
            <animate attributeName="r" values="8;20;8" dur="2.4s" begin="0.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.35;0.05;0.35" dur="2.4s" begin="0.4s" repeatCount="indefinite" />
          </circle>

          {/* Solid Point: Dark Blue / Black with thick White border so it pops against light quadrant */}
          <circle 
            cx={svgX} 
            cy={svgY} 
            r="9.5" 
            fill={solidDotColor}
            stroke="#FFFFFF" 
            strokeWidth="3.5"
            filter="url(#dot-shadow)"
          />

          {/* Center White Pin Dot */}
          <circle cx={svgX} cy={svgY} r="2.5" fill="#FFFFFF" />

          {/* High-Contrast Floating Coordinate Badge Attached to Dot */}
          {(() => {
            const badgeW = 98;
            const badgeH = 24;
            // Position badge offset so it never overflows
            const badgeX = svgX > 240 ? svgX - badgeW - 12 : svgX + 12;
            const badgeY = svgY > 240 ? svgY - badgeH - 8 : svgY + 8;
            return (
              <g transform={`translate(${badgeX}, ${badgeY})`}>
                <rect 
                  width={badgeW} 
                  height={badgeH} 
                  rx="6" 
                  fill="#0F172A" 
                  stroke="#FFFFFF" 
                  strokeWidth="1.5" 
                  filter="url(#dot-shadow)"
                />
                <text 
                  x={badgeW / 2} 
                  y={16} 
                  textAnchor="middle" 
                  fill="#FFFFFF" 
                  fontSize="11" 
                  fontWeight="800" 
                  className="font-latin"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  X: {x > 0 ? `+${x}` : x} | Y: {y > 0 ? `+${y}` : y}
                </text>
              </g>
            );
          })()}
        </svg>

      </div>

      {/* Quadrant Legend Tag */}
      <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
        <div className="badge-tag" style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-medium)',
          color: 'var(--text-primary)',
          padding: '0.45rem 1.15rem',
          fontSize: '0.94rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <span>{isEnglish ? 'Political Quadrant: ' : 'আদর্শিক চতুর্ভুজ: '}</span>
          <strong style={{ color: quadrantProfile?.badgeColor || '#D97706' }}>
            {quadrantTitle}
          </strong>
        </div>
      </div>

    </div>
  );
}
