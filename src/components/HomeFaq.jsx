import React from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = [
  {
    q: { bn: 'এটা কি কোনো পরীক্ষা? ভুল উত্তর আছে?', en: 'Is this a test? Are there wrong answers?' },
    a: { bn: 'না। প্রতিটি প্রশ্নে দুই পক্ষেরই যুক্তি আছে। আপনি যা সত্যি মনে করেন, সেটাই আপনার উত্তর।', en: 'No. Each question has reasonable arguments on both sides. What you honestly think is your answer.' }
  },
  {
    q: { bn: 'কত সময় লাগবে?', en: 'How long does it take?' },
    a: { bn: 'সাধারণ সংস্করণে ২৪টি প্রশ্ন, প্রায় ৪ মিনিট। হাতে সময় কম থাকলে ১৬ প্রশ্নের ছোট সংস্করণ, বিস্তারিত চাইলে ৩২ প্রশ্নের পূর্ণ সংস্করণ।', en: 'The standard version has 24 questions and takes about 4 minutes. There is a 16-question short version and a 32-question full version.' }
  },
  {
    q: { bn: 'আপনারা কি কোনো দল বা নেতার সাথে যুক্ত?', en: 'Are you connected with any party or leader?' },
    a: { bn: 'না। কোনো দল, নেতা বা সরকারের সাথে এই প্ল্যাটফর্মের সম্পর্ক নেই। কেউ টাকা দিয়ে ফলাফল বদলাতে পারে না।', en: 'No. This platform has no link to any party, leader or government, and nobody can pay to change a result.' }
  },
  {
    q: { bn: 'ফলাফলে কোনো দলের নাম এলে কি আমি তাদের সমর্থক?', en: 'If a party appears in my result, am I its supporter?' },
    a: { bn: 'না। এর মানে শুধু এই প্রশ্নগুলোতে আপনার মতের সাথে ওই ধারার মিল বেশি। কাকে সমর্থন করবেন, সেটা আপনার সিদ্ধান্ত।', en: 'No. It only means your answers to these questions are close to that tradition. Who you support is your own decision.' }
  },
  {
    q: { bn: 'নেতাদের সাথে মিল কীভাবে বের হয়?', en: 'How are leader matches worked out?' },
    a: { bn: 'দলীয় কর্মসূচি, প্রকাশ্য বক্তব্য ও সরকারি কাজ দেখে প্রত্যেক নেতার সম্ভাব্য উত্তর আমরা অনুমান করেছি, তারপর আপনার উত্তরের সাথে মিলিয়েছি। এগুলো অনুমান, নেতাদের নিজের দেওয়া উত্তর নয়। পুরো তালিকা “কীভাবে হিসাব হয়” পাতায় আছে।', en: 'We estimated each leader’s likely answers from party programmes, public statements and government decisions, then compared them with yours. These are estimates, not answers from the leaders. The full list is on the How it works page.' }
  },
  {
    q: { bn: 'ফলাফল কি দেশের সবার মত?', en: 'Do the results show what the whole country thinks?' },
    a: { bn: 'না। এটা শুধু যাঁরা অংশ নিয়েছেন তাঁদের মত, নির্বাচনের পূর্বাভাস নয়। মানুষ বাড়লে ছবিও বদলাবে।', en: 'No. They show only the people who took part and are not an election forecast. The picture will change as more people join.' }
  },
  {
    q: { bn: 'আমার তথ্য কি নিরাপদ?', en: 'Is my information safe?' },
    a: { bn: 'নাম, ফোন বা লগইন লাগে না। বয়স-এলাকা দেওয়া ঐচ্ছিক। উত্তর একটি এলোমেলো আইডিতে জমা হয়, আর কার্ডে দেওয়া নাম শুধু আপনার ফোনেই থাকে। ১০ জনের কম এমন কোনো গোষ্ঠীর ফলাফল আমরা দেখাই না।', en: 'No name, phone number or login is needed, and age and area are optional. Answers are stored under a random ID, and the name on your card stays on your phone. We never show results for a group of fewer than 10 people.' }
  },
  {
    q: { bn: 'কোনো প্রশ্ন একপেশে মনে হলে?', en: 'What if a question seems biased?' },
    a: { bn: 'পাতার একদম নিচে “ভুল বা পক্ষপাত জানান” চাপুন। প্রতিটি মতামত আমরা পড়ি।', en: 'Tap “Report a problem” at the very bottom of the page. We read every message.' }
  }
];

export default function HomeFaq({ lang = 'bn' }) {
  const key = lang === 'en' ? 'en' : 'bn';
  return (
    <section style={{ width: '100%', boxSizing: 'border-box', maxWidth: '860px', margin: '0 auto', padding: '4rem 1rem' }}>
      <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 1.25rem' }}>
        {key === 'en' ? 'Common questions' : 'যা জানতে চান'}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {FAQ.map((item) => (
          <details key={item.q.en} className="home-faq glass-panel">
            <summary>
              <span>{item.q[key]}</span>
              <ChevronDown size={20} aria-hidden="true" />
            </summary>
            <p>{item.a[key]}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
