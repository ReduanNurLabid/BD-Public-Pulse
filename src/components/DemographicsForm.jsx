import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { AGE_BUCKETS, BLOC_PROFILES, ageBucketLabel } from '../data/questions';

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
    '18–25',
    '26–35',
    '36–45',
    '46–60',
    '60+'
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
  'জামায়াতে ইসলামী': 'Bangladesh Jamaat-e-Islami',
  'নির্দলীয় সুশাসনপন্থী': 'Non-partisan good governance',
  'আওয়ামী লীগ': 'Awami League',
  'বামজোট / অন্যান্য': 'Left alliance / Other',
  'কাউকে সমর্থন করি না': 'I do not support anyone',
  'হ্যাঁ (সংবিধান পুনর্লিখন / নতুন প্রজাতন্ত্র)': 'Yes (rewrite the constitution / establish a new republic)',
  'না (বিদ্যমান সংবিধানের সংশোধন)': 'No (amend the existing constitution)',
  'ভোট বর্জন করেছি / ভোট দিইনি': 'Boycotted / did not vote'
};

// Bangla display labels. Option values are stored and aggregated as-is, so
// only what the person sees changes here.
const OPTION_LABELS_BN = {
  ...Object.fromEntries(AGE_RANGES.map(value => [value, ageBucketLabel(value)])),
  'শিক্ষার্থী (ছাত্র/ছাত্রী)': 'শিক্ষার্থী',
  'স্নাতক (অধ্যয়নরত / সম্পন্ন)': 'স্নাতক (পড়ছি / শেষ করেছি)',
  'স্নাতকোত্তর ও তদূর্ধ্ব': 'স্নাতকোত্তর বা তার বেশি'
};

export default function DemographicsForm({ onSubmit, onSkip, lang = 'bn' }) {
  const isEnglish = lang === 'en';
  const optionLabel = (value) => isEnglish ? (OPTION_LABELS_EN[value] || value) : (OPTION_LABELS_BN[value] || value);
  const [formData, setFormData] = useState({
    ageRange: '',
    division: '',
    religion: '',
    gender: '',
    education: '',
    occupation: '',
    partySupport: '',
    referendumVote: ''
  });
  // Consent only matters once the person has actually shared something.
  const hasAnyAnswer = Object.values(formData).some(Boolean);

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
          color: 'var(--accent-green)',
          padding: '0.45rem 1.25rem',
          fontSize: '0.95rem'
        }}>
          <Sparkles size={16} />
          <span>{isEnglish ? '🎉 Nice! All questions done' : '🎉 দারুণ! সব প্রশ্ন শেষ'}</span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: 'clamp(1.5rem, 3.5vw, 2.5rem)', border: '1px solid var(--border-gold)' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
            {isEnglish ? 'Refine your results and contribute to the research' : 'আর ২০ সেকেন্ড দেবেন?'}
          </h2>
          <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto', lineHeight: 1.7 }}>
            {isEnglish
              ? <>The information below is <strong style={{ color: 'var(--accent-gold)' }}>optional</strong>. Responses are stored with a pseudonymous session identifier. Demographic answers may be used in aggregate comparisons on the live dashboard. We never ask for your name.</>
              : <>নিচের সবকিছু <strong style={{ color: 'var(--accent-gold)' }}>ঐচ্ছিক</strong>। দিলে ড্যাশবোর্ডে বয়স, বিভাগ বা পেশাভেদে মতের পার্থক্য দেখানো যায়। আপনার নাম জানতে চাওয়া হয় না।</>}
          </p>
          <button
            type="button"
            onClick={handleSkip}
            disabled={isSubmitting}
            style={{ marginTop: '0.9rem', background: 'none', border: 'none', padding: '0.4rem', color: 'var(--hero-accent)', fontWeight: 700, fontSize: '1rem', textDecoration: 'underline', textUnderlineOffset: '3px', cursor: 'pointer' }}
          >
            {isEnglish ? 'Skip these and see my result →' : 'এগুলো বাদ দিয়ে ফলাফল দেখি →'}
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Row 1: Age & Division */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {isEnglish ? 'Age' : 'বয়স'}
              </label>
              <select
                value={formData.ageRange}
                onChange={(e) => handleChange('ageRange', e.target.value)}
                className="form-select-control"
              >
                <option value="">{isEnglish ? '-- Select age (optional) --' : 'বেছে নিন'}</option>
                {AGE_RANGES.map(a => (
                  <option key={a} value={a}>{optionLabel(a)}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {isEnglish ? 'Division' : 'বিভাগ'}
              </label>
              <select
                value={formData.division}
                onChange={(e) => handleChange('division', e.target.value)}
                className="form-select-control"
              >
                <option value="">{isEnglish ? '-- Select division (optional) --' : 'বেছে নিন'}</option>
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
                {isEnglish ? 'Religion' : 'ধর্ম'}
              </label>
              <select
                value={formData.religion}
                onChange={(e) => handleChange('religion', e.target.value)}
                className="form-select-control"
              >
                <option value="">{isEnglish ? '-- Select religion (optional) --' : 'বেছে নিন'}</option>
                {RELIGIONS.map(r => (
                  <option key={r} value={r}>{optionLabel(r)}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {isEnglish ? 'Gender' : 'লিঙ্গ'}
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="form-select-control"
              >
                <option value="">{isEnglish ? '-- Select gender (optional) --' : 'বেছে নিন'}</option>
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
                {isEnglish ? 'Education' : 'পড়াশোনা'}
              </label>
              <select
                value={formData.education}
                onChange={(e) => handleChange('education', e.target.value)}
                className="form-select-control"
              >
                <option value="">{isEnglish ? '-- Select education (optional) --' : 'বেছে নিন'}</option>
                {EDUCATION_LEVELS.map(ed => (
                  <option key={ed} value={ed}>{optionLabel(ed)}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {isEnglish ? 'Occupation' : 'পেশা'}
              </label>
              <select
                value={formData.occupation}
                onChange={(e) => handleChange('occupation', e.target.value)}
                className="form-select-control"
              >
                <option value="">{isEnglish ? '-- Select occupation (optional) --' : 'বেছে নিন'}</option>
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
                {isEnglish ? 'Which party did you support in the February 2026 election?' : 'ফেব্রুয়ারি ২০২৬-এর নির্বাচনে কোন দলকে সমর্থন করেছিলেন?'}
              </label>
              <select
                value={formData.partySupport}
                onChange={(e) => handleChange('partySupport', e.target.value)}
                className="form-select-control"
              >
                <option value="">{isEnglish ? '-- Select support (optional) --' : 'বেছে নিন'}</option>
                {PARTY_SUPPORT.map(p => (
                  <option key={p} value={p}>{optionLabel(p)}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {isEnglish ? 'How did you vote in the referendum?' : 'গণভোটে কী ভোট দিয়েছিলেন?'}
              </label>
              <select
                value={formData.referendumVote}
                onChange={(e) => handleChange('referendumVote', e.target.value)}
                className="form-select-control"
              >
                <option value="">{isEnglish ? '-- Select your vote (optional) --' : 'বেছে নিন'}</option>
                {REFERENDUM_VOTES.map(v => (
                  <option key={v} value={v}>{optionLabel(v)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Privacy Note */}
          {hasAnyAnswer && <label style={{
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
              ? 'I agree that the optional demographic answers I provide (including religion, party support, and referendum vote) may be used in grouped dashboard statistics. Only a pseudonymous session identifier is stored with responses, never a name.'
              : 'আমি রাজি যে ওপরের তথ্যগুলো (ধর্ম, দলীয় সমর্থন ও গণভোটসহ) ড্যাশবোর্ডের সম্মিলিত হিসাবে ব্যবহার হতে পারে। উত্তরের সাথে শুধু একটি বেনামি সেশন আইডি থাকবে, কোনো নাম নয়।'}</span>
          </label>}

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            fontSize: '0.86rem', 
            color: 'var(--text-muted)',
            marginTop: '0.5rem'
          }}>
            <ShieldCheck size={18} color="var(--accent-green)" />
            <span>{isEnglish
              ? 'Please avoid identifying details such as phone numbers or addresses. Results are only shown in groups; any group under 10 people is withheld.'
              : 'ফোন নম্বর বা ঠিকানার মতো তথ্য দেবেন না। ফলাফল শুধু দল বেঁধে দেখানো হয়; ১০ জনের কম হলে কোনো গোষ্ঠী দেখানো হয় না।'}</span>
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
              <span>{isSubmitting ? (isEnglish ? 'Preparing your result…' : 'ফলাফল তৈরি হচ্ছে…') : (isEnglish ? 'See my result' : 'আমার ফলাফল দেখি')}</span>
              {!isSubmitting && <ArrowRight size={20} />}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="btn-secondary"
              style={{ padding: '0.95rem 1.8rem', fontSize: '1rem', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              <span>{isEnglish ? 'Skip these and see my result' : 'এগুলো বাদ দিয়ে ফলাফল দেখি'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
