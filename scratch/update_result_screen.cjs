const fs = require('fs');

let content = fs.readFileSync('src/components/ResultScreen.jsx', 'utf8');

// 1. Add LEADER_MATCHES at the top outside the component
const leaderMatchesCode = `
const LEADER_MATCHES = {
  AL: {
    leader: 'লি কুয়ান ইউ (Lee Kuan Yew)',
    leaderDesc: 'রাষ্ট্রীয় শৃঙ্খলা, মেগা প্রকল্প ও কেন্দ্রীয় নিয়ন্ত্রণের মাধ্যমে দ্রুত উন্নয়ন।',
    country: 'সিঙ্গাপুর',
    countryEmoji: '🇸🇬',
    countryDesc: 'কেন্দ্রীয় নিয়ন্ত্রণ ও রাষ্ট্রীয় পুঁজিপতি মডেল।'
  },
  Student: {
    leader: 'ভাকলাভ হাভেল (Václav Havel)',
    leaderDesc: 'ফ্যাসিবাদবিরোধী সংগ্রাম, নাগরিক অধিকার ও শাসনতান্ত্রিক রূপান্তর।',
    country: 'এস্তোনিয়া',
    countryEmoji: '🇪🇪',
    countryDesc: 'ডিজিটাল গণতন্ত্র, স্বচ্ছতা ও তরুণ প্রজন্মের শাসন।'
  },
  Sushil: {
    leader: 'অমর্ত্য সেন (Amartya Sen)',
    leaderDesc: 'সাংবিধানিক উদারতাবাদ, মানবাধিকার ও কল্যাণমুখী গণতন্ত্র।',
    country: 'সুইজারল্যান্ড',
    countryEmoji: '🇨🇭',
    countryDesc: 'ভারসাম্যপূর্ণ ক্ষমতা, নিরপেক্ষ বিচার ও সরাসরি গণতন্ত্র।'
  },
  BNP: {
    leader: 'কনরাড আডেনাউয়ার (Konrad Adenauer)',
    leaderDesc: 'কেন্দ্র-ডান জাতীয়তাবাদ, মুক্তবাজার ও গণতান্ত্রিক জোট।',
    country: 'মালয়েশিয়া',
    countryEmoji: '🇲🇾',
    countryDesc: 'বহুদলীয় গণতন্ত্র, দেশীয় পুঁজি ও মিশ্র অর্থনীতি।'
  },
  JI: {
    leader: 'নেকমেত্তিন এরবাকান (Necmettin Erbakan)',
    leaderDesc: 'ধর্মীয় মূল্যবোধ, সামাজিক ন্যায়বিচার ও ইসলামী কল্যাণ রাষ্ট্র।',
    country: 'কাতার',
    countryEmoji: '🇶🇦',
    countryDesc: 'ঐতিহ্যবাহী ধর্মীয় মূল্যবোধ ও রাষ্ট্রীয় কল্যাণ ব্যবস্থার সমন্বয়।'
  },
  JP: {
    leader: 'মাহাথির মোহাম্মদ (Mahathir Mohamad)',
    leaderDesc: 'বাস্তববাদী সমন্বয়, প্রশাসনিক বিকেন্দ্রীকরণ ও উন্নয়ন।',
    country: 'ইন্দোনেশিয়া',
    countryEmoji: '🇮🇩',
    countryDesc: 'বিশাল প্রশাসনিক বিকেন্দ্রীকরণ ও রাজনৈতিক ভারসাম্য।'
  },
  Mixed: {
    leader: 'অ্যাঞ্জেলা মার্কেল (Angela Merkel)',
    leaderDesc: 'চরমপন্থা বর্জন করে বাস্তবসম্মত ও মধ্যপন্থী নীতি গ্রহণ।',
    country: 'নরওয়ে',
    countryEmoji: '🇳🇴',
    countryDesc: 'ভারসাম্যপূর্ণ ও অন্তর্ভুক্তিমূলক মিশ্র নীতি।'
  }
};

export default function ResultScreen`;

content = content.replace('export default function ResultScreen', leaderMatchesCode);

// 2. Destructure coherenceScore
content = content.replace(
  '    blockResults \n  } = analysis;',
  '    blockResults,\n    coherenceScore \n  } = analysis;'
);

// 3. Add Leader & Country Match Card + Ideological Coherence Score below the Compass visualizer grid
const leaderMatchGridCode = `
      </div>

      {/* Leader Match & Coherence Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Leader & Country Match Card */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Award size={22} color="#8B5CF6" />
            <span>আপনার আদর্শিক নেতা ও দেশ</span>
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem', background: 'rgba(139, 92, 246, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
              👤
            </div>
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {LEADER_MATCHES[primaryBloc.key]?.leader}
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                {LEADER_MATCHES[primaryBloc.key]?.leaderDesc}
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)' }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem' }}>
              {LEADER_MATCHES[primaryBloc.key]?.countryEmoji}
            </div>
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {LEADER_MATCHES[primaryBloc.key]?.country}
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                {LEADER_MATCHES[primaryBloc.key]?.countryDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Ideological Coherence Score */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Layers size={22} color="#059669" />
            <span>মতাদর্শিক সংহতি সূচক</span>
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            আপনার বিভিন্ন নীতিগত অবস্থানের পারস্পরিক সামঞ্জস্যের হার
          </p>

          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* SVG Circle for Coherence Score */}
            <svg width="140" height="140" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" strokeWidth="8" />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke={coherenceScore >= 80 ? '#059669' : coherenceScore >= 60 ? '#D97706' : '#EF4444'} 
                strokeWidth="8" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (283 * coherenceScore) / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="font-latin" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {enToBn(coherenceScore)}%
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>সুসংগত আদর্শ</span>
            </div>
          </div>
        </div>
      </div>
`;
content = content.replace('      </div>\n\n      {/* Comparative 6-Bloc Affinity Breakdown */}', leaderMatchGridCode + '\n      {/* Comparative 6-Bloc Affinity Breakdown */}');


// 4. Refactor Bipolar Diverging Sliders to Tug-of-War Bars
// We will locate the blockResults mapping section
const sliderCodeStart = \`        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '1.5rem'
        }}>\`;
const sliderCodeEnd = \`        </div>
      </div>

      {/* Official Certified Evaluation Certificate with Embedded 2D Compass */}\`;

const tugOfWarCode = \`        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '1.5rem'
        }}>
          {blockResults.map(block => {
            const leftPct = Math.round((100 - block.bipolarScore) / 2);
            const rightPct = Math.round((100 + block.bipolarScore) / 2);

            return (
              <div 
                key={block.id}
                style={{
                  background: 'var(--bg-card)',
                  padding: '1.25rem',
                  borderRadius: '16px',
                  border: '1.5px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Block Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem' }}>
                    {enToBn(block.id)}. {block.title}
                  </span>
                </div>

                {/* Tug-of-War Split Bar */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* Labels Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span style={{ color: '#EF4444', textAlign: 'left', flex: 1 }}>{block.leftShort}</span>
                    <span style={{ color: '#0284C7', textAlign: 'right', flex: 1 }}>{block.rightShort}</span>
                  </div>
                  
                  {/* The Bar */}
                  <div style={{ 
                    display: 'flex', 
                    width: '100%', 
                    height: '28px', 
                    borderRadius: '14px', 
                    overflow: 'hidden',
                    background: '#E2E8F0', // fallback background
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    {leftPct > 0 && (
                      <div style={{ 
                        width: \`\${leftPct}%\`, 
                        background: 'linear-gradient(90deg, #DC2626, #EF4444)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        paddingLeft: '10px', 
                        color: 'white', 
                        fontSize: '0.85rem', 
                        fontWeight: 'bold',
                        transition: 'width 1s ease-out'
                      }}>
                        {leftPct >= 15 ? \`\${enToBn(leftPct)}%\` : ''}
                      </div>
                    )}
                    {rightPct > 0 && (
                      <div style={{ 
                        width: \`\${rightPct}%\`, 
                        background: 'linear-gradient(270deg, #2563EB, #3B82F6)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'flex-end',
                        paddingRight: '10px', 
                        color: 'white', 
                        fontSize: '0.85rem', 
                        fontWeight: 'bold',
                        transition: 'width 1s ease-out'
                      }}>
                        {rightPct >= 15 ? \`\${enToBn(rightPct)}%\` : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Certified Evaluation Certificate with Embedded 2D Compass */}\`;

// We use regex to replace everything between sliderCodeStart and sliderCodeEnd
const regex = new RegExp(sliderCodeStart.replace(/[.*+?^$\{key\}()|[\\]\\\\]/g, '\\\\$&') + '.*?' + sliderCodeEnd.replace(/[.*+?^$\{key\}()|[\\]\\\\]/g, '\\\\$&'), 's');
content = content.replace(regex, tugOfWarCode);

fs.writeFileSync('src/components/ResultScreen.jsx', content, 'utf8');
console.log("Updated ResultScreen.jsx successfully.");
