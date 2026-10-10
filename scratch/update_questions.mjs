import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetPath = path.resolve(__dirname, '../src/data/questions.js');

async function update() {
  const data = await import('file://' + targetPath);
  let QUESTIONS = JSON.parse(JSON.stringify(data.QUESTIONS));
  let BLOC_PROFILES = JSON.parse(JSON.stringify(data.BLOC_PROFILES));
  let THEMATIC_BLOCKS = JSON.parse(JSON.stringify(data.THEMATIC_BLOCKS));
  let LIKERT_OPTIONS = JSON.parse(JSON.stringify(data.LIKERT_OPTIONS));

  // Phase 4: Rename Sushil
  BLOC_PROFILES.Sushil.name = 'উদার-সংবিধানবাদী সুশীল';

  // Helper to reverse key a question
  function reverseKeyQuestion(id, newText) {
    const q = QUESTIONS.find(q => q.id === id);
    if (q) {
      q.text = newText;
      q.x_weight = (q.x_weight || 0) * -1;
      q.y_weight = (q.y_weight || 0) * -1;
      for (const key in q.bloc_weights) {
        q.bloc_weights[key] *= -1;
      }
      q.isReverseKeyed = true;
    }
  }

  // Soften Q1, Q2, Q5, Q8
  QUESTIONS.find(q => q.id === 'q1').text = "দেশের দ্রুত অর্থনৈতিক অগ্রগতি ও মেগা প্রকল্প বাস্তবায়নের জন্য কেন্দ্রীয় সরকারের হাতে পর্যাপ্ত নির্বাহী ক্ষমতা থাকা প্রয়োজন, যাতে নীতি বাস্তবায়নে অহেতুক বিলম্ব না হয়।";
  QUESTIONS.find(q => q.id === 'q2').text = "রাষ্ট্রীয় নিরাপত্তা ও শৃঙ্খলা বজায় রাখতে আইনশৃঙ্খলা রক্ষাকারী বাহিনীকে রাজনৈতিক হস্তক্ষেপমুক্ত রেখে স্বাধীনভাবে কাজ করতে দেওয়া উচিত।";
  QUESTIONS.find(q => q.id === 'q5').text = "জাতীয় নিরাপত্তা রক্ষা ও সাইবার অপরাধ দমনে আধুনিক প্রযুক্তির মাধ্যমে রাষ্ট্রের গোয়েন্দা নজরদারি ব্যবস্থা থাকা একটি স্বাভাবিক প্রক্রিয়া।";
  QUESTIONS.find(q => q.id === 'q8').text = "রাষ্ট্রের গুরুত্বপূর্ণ ও জটিল নীতি নির্ধারণে কেবল সাধারণ জনমতের ওপর নির্ভর না করে বিশেষজ্ঞ ও উচ্চশিক্ষিত ব্যক্তিদের মতামতকে বিশেষ গুরুত্ব দেওয়া উচিত।";

  // De-weaponize Q31/Q33
  QUESTIONS.find(q => q.id === 'q31').text = "ভবিষ্যতে ক্ষমতার অপব্যবহার রোধ করতে বর্তমান সাংবিধানিক কাঠামোর সংস্কার করে ক্ষমতার ভারসাম্য নিশ্চিত করা জরুরি।";
  QUESTIONS.find(q => q.id === 'q33').text = "বিগত সরকারের আমলের মানবাধিকার লঙ্ঘন ও দুর্নীতির অভিযোগগুলো আইনি প্রক্রিয়ার মাধ্যমে নিরপেক্ষ ট্রাইব্যুনালে বিচার করা উচিত।";

  // Q22: BNP relations
  QUESTIONS.find(q => q.id === 'q22').text = "বিএনপি'র নেতৃত্বাধীন গণতান্ত্রিক সরকারের উচিত ভারতের সাথে পূর্ববর্তী আওয়ামী লীগ সরকারের করা অসম চুক্তিগুলো বাতিল করে নতুন শর্তে সমমর্যাদার সম্পর্ক নির্ধারণ করা।";
  QUESTIONS.find(q => q.id === 'q22').bloc_weights = { AL: -3.5, BNP: +4.0, JI: +3.0, Student: +3.0, Sushil: +1.5, JP: +1.0 }; // Adjust weights to favor BNP taking lead
  
  // Q29: JI student politics
  QUESTIONS.find(q => q.id === 'q29').text = "ক্যাম্পাসে লেজুড়বৃত্তিক ছাত্ররাজনীতি নিষিদ্ধ হলেও, ইসলামী মূল্যবোধ ও চরিত্র গঠনের লক্ষ্যে ধর্মভিত্তিক ছাত্র সংগঠনগুলোর (যেমন ছাত্রশিবির) কার্যক্রম পরিচালনার অধিকার থাকা উচিত।";
  QUESTIONS.find(q => q.id === 'q29').bloc_weights = { AL: -4.0, BNP: +1.0, JI: +4.0, Student: -2.0, Sushil: -3.0, JP: -1.0 };

  // Replace Q9: Banned AL status
  const q9 = QUESTIONS.find(q => q.id === 'q9');
  q9.text = "গণহত্যার দায়ে অভিযুক্ত রাজনৈতিক দল হিসেবে আওয়ামী লীগকে নিষিদ্ধ করে তাদের যেকোনো নির্বাচনে অংশগ্রহণের অধিকার বাতিল করা উচিত।";
  q9.bloc_weights = { AL: -4.0, BNP: +1.5, JI: +3.5, Student: +4.0, Sushil: -2.0, JP: 0.0 };
  
  // Replace Q39: Hasina extradition
  const q39 = QUESTIONS.find(q => q.id === 'q39');
  q39.text = "জুলাই গণঅভ্যুত্থানে গণহত্যার দায়ে সাবেক প্রধানমন্ত্রী শেখ হাসিনাকে ভারত থেকে দেশে ফিরিয়ে এনে আন্তর্জাতিক অপরাধ ট্রাইব্যুনালে বিচার করা রাষ্ট্রের সর্বোচ্চ অগ্রাধিকার হওয়া উচিত।";
  q39.bloc_weights = { AL: -4.0, BNP: +2.5, JI: +3.5, Student: +4.0, Sushil: +2.0, JP: +1.0 };

  // Replace Q32: 1972 Constitution
  const q32 = QUESTIONS.find(q => q.id === 'q32');
  q32.text = "বাহাত্তরের (১৯৭২) সংবিধানে ফিরে যাওয়ার বদলে, ২০২৪-এর গণঅভ্যুত্থানের আকাঙ্ক্ষার ভিত্তিতে একটি সম্পূর্ণ নতুন সংবিধান প্রণয়ন করা উচিত।";
  q32.bloc_weights = { AL: -4.0, BNP: +2.0, JI: +4.0, Student: +4.0, Sushil: -1.0, JP: +1.0 };
  
  // Replace Q23: Ganges Treaty renewal
  const q23 = QUESTIONS.find(q => q.id === 'q23');
  q23.text = "২০২৬ সালে গঙ্গার পানি বণ্টন চুক্তি নবায়নের ক্ষেত্রে ভারতের কাছ থেকে তিস্তাসহ সকল অভিন্ন নদীর পানির ন্যায্য হিস্যা আদায়ে প্রয়োজনে আন্তর্জাতিক ফোরামে যাওয়া উচিত।";
  q23.bloc_weights = { AL: -1.0, BNP: +3.0, JI: +3.5, Student: +3.5, Sushil: +2.5, JP: +1.5 };

  // Reverse keying for 10+ questions
  // Q3: Two-term limit -> Reverse: No two-term limit
  reverseKeyQuestion('q3', "রাষ্ট্রপ্রধান বা সরকারপ্রধানের জন্য দুই মেয়াদের সীমাবদ্ধতা থাকা উচিত নয়, কারণ একজন দক্ষ নেতা যতবার খুশি নির্বাচিত হতে পারেন।");
  // Q4: Civilian vs Military -> Reverse: Military/Bureaucracy is better
  reverseKeyQuestion('q4', "রাজনৈতিক নেতৃত্বের চেয়ে দক্ষ সামরিক বাহিনী বা আমলাতন্ত্রের হাতে রাষ্ট্রের নিয়ন্ত্রণ থাকলে দেশ বেশি সুরক্ষিত ও শৃঙ্খলার মধ্যে থাকে।");
  // Q10: Referendum -> Reverse: Referendum is unnecessary
  reverseKeyQuestion('q10', "সংবিধানের মৌলিক পরিবর্তনের জন্য গণভোটের কোনো প্রয়োজন নেই, নির্বাচিত সংসদ সদস্যদের সিদ্ধান্তই চূড়ান্ত হওয়া উচিত।");
  // Q14: Inheritance -> Reverse: Religious inheritance
  reverseKeyQuestion('q14', "পারিবারিক ও উত্তরাধিকার আইনে নারী-পুরুষের সমঅধিকার নিশ্চিত করার জন্য ধর্মীয় অনুশাসন পরিবর্তন করে সর্বজনীন নাগরিক আইন চালু করা অনুচিত।");
  // Q16: State control of basics -> Reverse: Privatize basics
  reverseKeyQuestion('q16', "বিদ্যুৎ, জ্বালানি ও স্বাস্থ্য খাতের মতো মৌলিক সেবাগুলো সরকারের হাতে না রেখে সম্পূর্ণভাবে বেসরকারি খাতে ছেড়ে দেওয়া উচিত।");
  // Q18: Progressive wealth tax -> Reverse: Flat or no wealth tax
  reverseKeyQuestion('q18', "ধনী ও পুঁজিপতিদের ওপর উচ্চ হারে প্রগতিশীল কর (Progressive Wealth Tax) আরোপ করলে বিনিয়োগ বাধাগ্রস্ত হয়, তাই এটি পরিহার করা উচিত।");
  // Q24: Border killings -> Reverse: Compromise for peace
  reverseKeyQuestion('q24', "সীমান্তে নাগরিক হত্যা বা পানি বণ্টন নিয়ে বিরোধে কঠোর অবস্থান নিলে ভারতের সাথে সম্পর্ক নষ্ট হতে পারে, তাই এসব ইস্যুতে ছাড় দেওয়াই উত্তম।");
  // Q26: Free speech -> Reverse: Limit free speech
  reverseKeyQuestion('q26', "সমাজের প্রচলিত অনুভূতি ও ধর্মীয় বিশ্বাসের সাথে সাংঘর্ষিক কোনো দর্শন বা মত প্রচারের অধিকার নাগরিকদের থাকা উচিত নয়।");
  // Q28: Peaceful assembly -> Reverse: Restrict assembly
  reverseKeyQuestion('q28', "জনদুর্ভোগ ও বিশৃঙ্খলা এড়াতে সরকারের পূর্বানুমতি ছাড়া যেকোনো স্থানে নাগরিকদের সমাবেশ ও প্রতিবাদ করা সম্পূর্ণ বেআইনি হওয়া উচিত।");
  // Q34: Decentralization -> Reverse: Centralization
  reverseKeyQuestion('q34', "দেশের সার্বিক উন্নয়নের জন্য স্থানীয় স্বায়ত্তশাসনের চেয়ে ঢাকাকেন্দ্রিক শক্তিশালী কেন্দ্রীয় শাসনব্যবস্থাই বেশি কার্যকরী।");
  // Q35: Article 70 -> Reverse: Keep Article 70
  reverseKeyQuestion('q35', "সংসদে দলীয় শৃঙ্খলা বজায় রাখার জন্য সংবিধানের ৭০ অনুচ্ছেদ বহাল থাকা আবশ্যক, যাতে এমপিরা দলের বিপক্ষে ভোট দিতে না পারেন।");

  // Re-build file content
  let newFile = `/**
 * বাংলাদেশ রাজনৈতিক আদর্শ মূল্যায়ন ২০২৬ (BD Political Compass 2026)
 * গবেষণামূলক ৪০টি প্রশ্ন এবং আদর্শিক ম্যাট্রিক্স
 */

export const THEMATIC_BLOCKS = ${JSON.stringify(THEMATIC_BLOCKS, null, 2)};

export const QUESTIONS = ${JSON.stringify(QUESTIONS, null, 2)};

export const LIKERT_OPTIONS = ${JSON.stringify(LIKERT_OPTIONS, null, 2)};

export const BLOC_PROFILES = ${JSON.stringify(BLOC_PROFILES, null, 2)};
`;

  fs.writeFileSync(targetPath, newFile, 'utf8');
  console.log("Updated questions.js successfully!");
}

update().catch(console.error);
