import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, ChevronRight, User } from 'lucide-react';
import { AGE_BUCKETS, BLOC_PROFILES } from '../data/questions';

const AGE_RANGES = AGE_BUCKETS;

const DIVISIONS = [
  'ঢাকা বিভাগ',
  'চট্টগ্রাম বিভাগ',
  'রাজশাহী বিভাগ',
  'খুলনা বিভাগ',
  'সিলেট বিভাগ',
  'রংপুর বিভাগ',
  'বরিশাল বিভাগ',
  'ময়মনসিংহ বিভাগ'
];

const RELIGIONS = [
  'ইসলাম',
  'হিন্দু',
  'বৌদ্ধ',
  'খ্রিস্টান',
  'অন্যান্য',
  'বলতে অনিচ্ছুক'
];

const GENDERS = [
  'পুরুষ',
  'নারী',
  'অন্যান্য',
  'বলতে অনিচ্ছুক'
];

const EDUCATION_LEVELS = [
  'স্নাতক (অধ্যয়নরত / সম্পন্ন)',
  'উচ্চমাধ্যমিক (HSC)',
  'স্নাতকোত্তর ও তদূর্ধ্ব',
  'মাধ্যমিক (SSC)',
  'অন্যান্য'
];

const OCCUPATIONS = [
  'শিক্ষার্থী (ছাত্র/ছাত্রী)',
  'বেসরকারি চাকরিজীবী',
  'সরকারি চাকরিজীবী',
  'ব্যবসায়ী / উদ্যোক্তা',
  'ফ্রিল্যান্সার / আইটি পেশাজীবী',
  'কৃষিজীবী / শ্রমজীবী',
  'গৃহিণী',
  'অন্যান্য'
];

// Self-declared affiliation, which is a different question from the algorithmic
// bloc classification: the tail options are not blocs at all, so they stay
// literal. The party entries are pulled from BLOC_PROFILES so a rename there
// reaches this form too. Stored verbatim and never read for any aggregation,
// so changing the strings does not invalidate existing responses.
const PARTY_SUPPORT = [
  ...Object.values(BLOC_PROFILES).map(profile => profile.name),
  'বামজোট / অন্যান্য',
  'কাউকে সমর্থন করি না',
  'বলতে অনিচ্ছুক'
];

const REFERENDUM_VOTES = [
  'হ্যাঁ (সংবিধান পুনর্লিখন / নতুন প্রজাতন্ত্র)',
  'না (বিদ্যমান সংবিধানের সংশোধন)',
  'ভোট বর্জন করেছি / ভোট দিইনি',
  'বলতে অনিচ্ছুক'
];

const OPTION_LABELS_EN = {
  ...Object.fromEntries(AGE_RANGES.map((value, index) => [value, [
    '18–25 (younger generation)',
    '26–35 (young adults / working age)',
    '36–45 (middle-aged)',
    '46–60 (experienced adults)',
    '60+ (senior citizens)'
  ][index]])),
  'ঢাকা বিভাগ': 'Dhaka Division',
  'চট্টগ্রাম বিভাগ': 'Chattogram Division',
  'রাজশাহী বিভাগ': 'Rajshahi Division',
  'খুলনা বিভাগ': 'Khulna Division',
  'সিলেট বিভাগ': 'Sylhet Division',
  'রংপুর বিভাগ': 'Rangpur Division',
  'বরিশাল বিভাগ': 'Barishal Division',
  'ময়মনসিংহ বিভাগ': 'Mymensingh Division',
  'ইসলাম': 'Islam',
  'হিন্দু': 'Hinduism',
  'বৌদ্ধ': 'Buddhism',
  'খ্রিস্টান': 'Christianity',
  'অন্যান্য': 'Other',
  'বলতে অনিচ্ছুক': 'Prefer not to say',
  'পুরুষ': 'Man',
  'নারী': 'Woman',
  'স্নাতক (অধ্যয়নরত / সম্পন্ন)': "Bachelor's degree (studying / completed)",
  'উচ্চমাধ্যমিক (HSC)': 'Higher Secondary Certificate (HSC)',
  'স্নাতকোত্তর ও তদূর্ধ্ব': "Master's degree or higher",
  'মাধ্যমিক (SSC)': 'Secondary School Certificate (SSC)',
  'শিক্ষার্থী (ছাত্র/ছাত্রী)': 'Student',
  'বেসরকারি চাকরিজীবী': 'Private-sector employee',
  'সরকারি চাকরিজীবী': 'Government employee',
  'ব্যবসায়ী / উদ্যোক্তা': 'Business owner / entrepreneur',
  'ফ্রিল্যান্সার / আইটি পেশাজীবী': 'Freelancer / IT professional',
  'কৃষিজীবী / শ্রমজীবী': 'Agriculture / labor worker',
  'গৃহিণী': 'Homemaker',
  'জাতীয় নাগরিক পার্টি': 'National Citizen Party (NCP)',
  'বিএনপি': 'Bangladesh Nationalist Party (BNP)',
  'জামায়াত-ইসলামী': 'Bangladesh Jamaat-e-Islami',
  'উদার সংবিধানবাদী সুশীল': 'Civil Society / Centrist Constitutionalist',
  'আওয়ামী লীগ': 'Awami League',
  'বামজোট / অন্যান্য': 'Left alliance / Other',
  'কাউকে সমর্থন করি না': 'I do not support anyone',
  'হ্যাঁ (সংবিধান পুনর্লিখন / নতুন প্রজাতন্ত্র)': 'Yes (rewrite the constitution / establish a new republic)',
  'না (বিদ্যমান সংবিধানের সংশোধন)': 'No (amend the existing constitution)',
  'ভোট বর্জন করেছি / ভোট দিইনি': 'Boycotted / did not vote'
};

export default function DemographicsForm({ onSubmit, onSkip, lang = 'bn' }) {
  const isEnglish = lang === 'en';
  const optionLabel = (value) => isEnglish ? (OPTION_LABELS_EN[value] || value) : value;
  const [formData, setFormData] = useState({
    ageRange: '',
    division: '',
    religion: '',
    gender: '',
    education: '',
    occupation: '',
    partySupport: '',
    referendumVote: '',
    name: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    onSubmit(formData);
  };

  const handleSkip = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    onSkip();
  };

  return (
    <div lang={isEnglish ? 'en' : 'bn'} style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem 1rem 4rem' }} className="animate-fade-in">
      
      {/* Success Badge */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div className="hero-badge-tag" style={{
          background: 'rgba(0, 168, 107, 0.15)',
          borderColor: 'rgba(0, 168, 107, 0.35)',
          color: '#34D399',
          padding: '0.45rem 1.25rem',
          fontSize: '0.95rem'
        }}>
          <Sparkles size={16} />
          <span>{isEnglish ? '🎉 You have successfully completed all 24 questions!' : '🎉 ২৪টি প্রশ্নের মূল্যায়ন সফলভাবে সম্পন্ন হয়েছে!'}</span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: 'clamp(1.5rem, 3.5vw, 2.5rem)', border: '1px solid var(--border-gold)' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
            {isEnglish ? 'Refine your results and contribute to the research' : 'আপনার ফলাফল নিখুঁত করুন ও গবেষণায় অবদান রাখুন'}
          </h2>
          <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto', lineHeight: 1.7 }}>
            {isEnglish
              ? <>The information below is <strong style={{ color: '#D97706' }}>optional</strong>. Responses are stored with a pseudonymous session identifier; your name is not included in the stored response. Demographic answers may be used in aggregate comparisons on the live dashboard.</>
              : <>নিচের তথ্যগুলো <strong style={{ color: '#D97706' }}>ঐচ্ছিক</strong>। উত্তর একটি ছদ্মনামী সেশন আইডির সঙ্গে সংরক্ষিত হয়; সংরক্ষিত উত্তরে আপনার নাম রাখা হয় না। জনতাত্ত্বিক উত্তর লাইভ ড্যাশবোর্ডে সমষ্টিগত তুলনায় ব্যবহৃত হতে পারে।</>}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Row 1: Age & Division */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {isEnglish ? '1. Age group' : '১. আপনার বয়স সীমা (Age Group)'}
              </label>
              <select
                value={formData.ageRange}
                onChange={(e) => handleChange('ageRange', e.target.value)}
                className="form-select-control"
              >
                <option value="">{isEnglish ? '-- Select age (optional) --' : '-- বয়স নির্বাচন করুন (ঐচ্ছিক) --'}</option>
                {AGE_RANGES.map(a => (
                  <option key={a} value={a}>{optionLabel(a)}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {isEnglish ? '2. Division' : '২. আপনার বিভাগ (Division)'}
              </label>
              <select
                value={formData.division}
                onChange={(e) => handleChange('division', e.target.value)}
                className="form-select-control"
              >
                <option value="">{isEnglish ? '-- Select division (optional) --' : '-- বিভাগ নির্বাচন করুন (ঐচ্ছিক) --'}</option>
                {DIVISIONS.map(d => (
                  <option key={d} value={d}>{optionLabel(d)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Religion & Gender */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {isEnglish ? '3. Religion' : '৩. ধর্মীয় পরিচয় (Religion)'}
              </label>
              <select
                value={formData.religion}
                onChange={(e) => handleChange('religion', e.target.value)}
                className="form-select-control"
              >
                <option value="">{isEnglish ? '-- Select religion (optional) --' : '-- ধর্ম নির্বাচন করুন (ঐচ্ছিক) --'}</option>
                {RELIGIONS.map(r => (
                  <option key={r} value={r}>{optionLabel(r)}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {isEnglish ? '4. Gender' : '৪. লিঙ্গ পরিচয় (Gender)'}
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="form-select-control"
              >
                <option value="">{isEnglish ? '-- Select gender (optional) --' : '-- লিঙ্গ নির্বাচন করুন (ঐচ্ছিক) --'}</option>
                {GENDERS.map(g => (
                  <option key={g} value={g}>{optionLabel(g)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Education & Occupation */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {isEnglish ? '5. Education' : '৫. শিক্ষাগত যোগ্যতা (Education)'}
              </label>
              <select
                value={formData.education}
                onChange={(e) => handleChange('education', e.target.value)}
                className="form-select-control"
              >
                <option value="">{isEnglish ? '-- Select education (optional) --' : '-- শিক্ষাগত যোগ্যতা (ঐচ্ছিক) --'}</option>
                {EDUCATION_LEVELS.map(ed => (
                  <option key={ed} value={ed}>{optionLabel(ed)}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {isEnglish ? '6. Occupation' : '৬. বর্তমান পেশা (Occupation)'}
              </label>
              <select
                value={formData.occupation}
                onChange={(e) => handleChange('occupation', e.target.value)}
                className="form-select-control"
              >
                <option value="">{isEnglish ? '-- Select occupation (optional) --' : '-- পেশা নির্বাচন করুন (ঐচ্ছিক) --'}</option>
                {OCCUPATIONS.map(oc => (
                  <option key={oc} value={oc}>{optionLabel(oc)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Party Support */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {isEnglish ? '7. Party support (February 2026)' : '৭. দলীয় সমর্থন (Feb 2026 Party Support)'}
              </label>
              <select
                value={formData.partySupport}
                onChange={(e) => handleChange('partySupport', e.target.value)}
                className="form-select-control"
              >
                <option value="">{isEnglish ? '-- Select support (optional) --' : '-- সমর্থন নির্বাচন করুন (ঐচ্ছিক) --'}</option>
                {PARTY_SUPPORT.map(p => (
                  <option key={p} value={p}>{optionLabel(p)}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {isEnglish ? '8. Referendum vote' : '৮. গণভোট (Referendum) ভোটদান'}
              </label>
              <select
                value={formData.referendumVote}
                onChange={(e) => handleChange('referendumVote', e.target.value)}
                className="form-select-control"
              >
                <option value="">{isEnglish ? '-- Select your vote (optional) --' : '-- কী ভোট দিয়েছেন (ঐচ্ছিক) --'}</option>
                {REFERENDUM_VOTES.map(v => (
                  <option key={v} value={v}>{optionLabel(v)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Certificate Name */}
          <div style={{ marginTop: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              <User size={16} style={{ color: 'var(--accent-gold)' }} />
              <span>{isEnglish ? '9. Your name (optional — shown on your certificate)' : '৯. আপনার নাম (ঐচ্ছিক - সনদে প্রদর্শনের জন্য)'}</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder={isEnglish ? 'Enter your name...' : 'আপনার নাম লিখুন...'}
              className="form-select-control"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '10px' }}
            />
          </div>

          {/* Privacy Note */}
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            padding: '0.9rem 1rem',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            cursor: 'pointer'
          }}>
            <input type="checkbox" required style={{ marginTop: '0.25rem', flexShrink: 0 }} />
            <span>{isEnglish
              ? 'I agree that the optional demographic answers I provide (including religion, party support, and referendum vote) may be used in grouped dashboard statistics. A pseudonymous session identifier is stored with responses; my name is not stored with the response.'
              : 'আমি সম্মত যে আমার দেওয়া ঐচ্ছিক জনতাত্ত্বিক উত্তর (ধর্ম, দলীয় সমর্থন ও গণভোটের উত্তরসহ) ড্যাশবোর্ডের সমষ্টিগত পরিসংখ্যানে ব্যবহৃত হতে পারে। উত্তরের সঙ্গে একটি ছদ্মনামী সেশন আইডি সংরক্ষিত হয়; উত্তরের সঙ্গে আমার নাম রাখা হয় না।'}</span>
          </label>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            fontSize: '0.86rem', 
            color: 'var(--text-muted)',
            marginTop: '0.5rem'
          }}>
            <ShieldCheck size={18} color="#34D399" />
            <span>{isEnglish
              ? 'Please avoid entering identifying details. Published results are grouped; small groups are withheld.'
              : 'শনাক্তকারী তথ্য দেবেন না। প্রকাশিত ফলাফল গোষ্ঠীভিত্তিক; ছোট গোষ্ঠীর তথ্য দেখানো হয় না।'}</span>
          </div>

          {/* Action CTAs */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginTop: '1.25rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap' 
          }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary btn-gold"
              style={{ padding: '0.95rem 2.5rem', fontSize: '1.1rem', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              <span>{isSubmitting ? (isEnglish ? 'Processing...' : 'প্রসেস হচ্ছে...') : (isEnglish ? 'View results and your ideology certificate' : 'ফলাফল ও আদর্শ সনদ দেখুন')}</span>
              {!isSubmitting && <ArrowRight size={20} />}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="btn-secondary"
              style={{ padding: '0.95rem 1.8rem', fontSize: '1rem', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              <span>{isEnglish ? 'Skip / view results now' : 'বাদ দিন / সরাসরি ফলাফল দেখুন'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
