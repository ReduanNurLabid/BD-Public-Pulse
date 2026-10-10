import { THEMATIC_BLOCKS, BLOC_PROFILES, QUADRANT_PROFILES } from '../src/data/questions.js';

export const CURATED_24_QUESTIONS = [
  // --- Block 1: রাষ্ট্র ও শাসনক্ষমতা (State Power & Executive Authority) ---
  {
    id: "q4",
    blockId: 1,
    text: "পাবলিক বিশ্ববিদ্যালয়ের ভিসি নিয়োগ এবং সিভিল প্রশাসনের শীর্ষ পদে সরকারের সরাসরি দলীয় পছন্দ বা নির্বাহী নিয়ন্ত্রণ থাকা উচিত, যাতে সরকারের উন্নয়ন পরিকল্পনা দ্রুত বাস্তবায়ন হয়।",
    direction: -1,
    x_weight: 0,
    y_weight: -2,
    bloc_weights: { BNP: 1.5, Student: -2.5, JI: -1.5, Sushil: -2.5, AL: 2.5 }
  },
  {
    id: "q10",
    blockId: 1,
    text: "এক ব্যক্তি যাতে আজীবন ক্ষমতার কেন্দ্রবিন্দু না হতে পারেন, সেজন্য বাংলাদেশের সংবিধানে প্রধানমন্ত্রীর দায়িত্ব পালনের সর্বোচ্চ মেয়াদ দুইবার নির্ধারণ করা জরুরি।",
    direction: 1,
    x_weight: 0,
    y_weight: 2,
    bloc_weights: { BNP: -1.0, Student: 2.5, JI: 2.0, Sushil: 2.5, AL: -2.5 }
  },
  {
    id: "q11",
    blockId: 1,
    text: "বিচারক নিয়োগে প্রধান বিচারপতি ও স্বাধীন জুডিশিয়াল কমিশনের সিদ্ধান্তই চূড়ান্ত হওয়া উচিত; আইন মন্ত্রণালয় বা প্রধানমন্ত্রীর কোনো ভেটো ক্ষমতা থাকা উচিত নয়।",
    direction: 1,
    x_weight: 0,
    y_weight: 2.5,
    bloc_weights: { BNP: 1.0, Student: 2.5, JI: 2.0, Sushil: 2.5, AL: -2.5 }
  },

  // --- Block 2: গণতন্ত্র ও নির্বাচনব্যবস্থা (Democracy & Electoral System) ---
  {
    id: "q6",
    blockId: 2,
    text: "আওয়ামী লীগের অনুপস্থিতিতে সংসদে বা রাজনীতিতে কার্যকর শক্তিশালী বিরোধী দল না থাকা বর্তমান সরকারের জবাবদিহিতা মারাত্মকভাবে ক্ষতিগ্রস্ত করছে।",
    direction: 1,
    x_weight: 0,
    y_weight: 1.5,
    bloc_weights: { BNP: 2.0, Student: -0.5, JI: 0.5, Sushil: 1.5, AL: 2.5 }
  },
  {
    id: "q8",
    blockId: 2,
    text: "একটি নিরপেক্ষ নির্দলীয় তত্ত্বাবধায়ক সরকার ছাড়া বাংলাদেশে কোনো ক্ষমতাসীন দলীয় সরকারের অধীনে নিরপেক্ষ জাতীয় নির্বাচন কখনোই সম্ভব নয়।",
    direction: 1,
    x_weight: 0,
    y_weight: 2,
    bloc_weights: { BNP: 2.5, Student: 2.0, JI: 2.5, Sushil: 2.0, AL: -3.0 }
  },
  {
    id: "q9",
    blockId: 2,
    text: "সংসদ নির্বাচনে একক সংখ্যাগরিষ্ঠতার (FPTP) বদলে আনুপাতিক প্রতিনিধিত্ব (PR) পদ্ধতি চালু করা উচিত, যাতে প্রাপ্ত ভোটের অনুপাতে সব দলের প্রতিনিধিত্ব থাকে।",
    direction: 1,
    x_weight: 0,
    y_weight: 2,
    bloc_weights: { BNP: -2.5, Student: 2.5, JI: 2.5, Sushil: 1.5, AL: -2.0 }
  },

  // --- Block 3: ধর্মনিরপেক্ষতা ও সমাজ (Religion, Ethics & Society) ---
  {
    id: "q12",
    blockId: 3,
    text: "স্কুলে শুধু ধর্মীয় আচার ও তত্ত্ব শেখানোর প্রকল্পে নৈতিক অবক্ষয় ও দুর্নীতি কমেনি; এর চেয়ে সর্বজনীন মানবিক মূল্যবোধ ও কার্যকর নীতিশিক্ষা (Ethics) বাধ্যতামূলক করা বেশি ফলপ্রসূ।",
    direction: 1,
    x_weight: 0,
    y_weight: 1.5,
    bloc_weights: { BNP: -1.0, Student: 1.5, JI: -2.5, Sushil: 2.5, AL: 1.5 }
  },
  {
    id: "q13",
    blockId: 3,
    text: "পারিবারিক ও ধর্মীয় প্রথা যা-ই হোক না কেন, সম্পত্তিতে নারী ও পুরুষের সমান উত্তরাধিকার অধিকার নিশ্চিত করতে রাষ্ট্রীয় আইন প্রণয়ন করা উচিত।",
    direction: 1,
    x_weight: -1,
    y_weight: 2,
    bloc_weights: { BNP: -1.5, Student: 1.0, JI: -3.0, Sushil: 2.5, AL: 1.0 }
  },
  {
    id: "q14",
    blockId: 3,
    text: "রাজনীতিতে ধর্মের অপব্যবহার ও সাম্প্রদায়িক বিভাজন রোধ করতে সংবিধানে ধর্মভিত্তিক রাজনৈতিক দল গঠন সম্পূর্ণ নিষিদ্ধ করা উচিত।",
    direction: 1,
    x_weight: 0,
    y_weight: -1,
    bloc_weights: { BNP: -1.5, Student: -1.0, JI: -3.0, Sushil: 1.5, AL: 2.5 }
  },

  // --- Block 4: অর্থনীতি ও বাজার (Economy & Markets) ---
  {
    id: "q17",
    blockId: 4,
    text: "জ্বালানি খাতে বেসরকারি ও বিদেশি বিদ্যুৎকেন্দ্রগুলোকে উৎপাদন না করলেও হাজার কোটি টাকার 'ক্যাপাসিটি চার্জ' দেওয়ার অসম চুক্তিগুলো অবিলম্বে বাতিল বা পুনর্বিবেচনা করা উচিত।",
    direction: 1,
    x_weight: -2,
    y_weight: 1,
    bloc_weights: { BNP: 2.0, Student: 2.5, JI: 2.0, Sushil: 2.0, AL: -2.5 }
  },
  {
    id: "q18",
    blockId: 4,
    text: "কৃষকদের স্বার্থে ধান ও নিত্যপণ্যের ন্যূনতম সহায়ক মূল্য নির্ধারণ ও সার-ডিজেলে বিপুল ভর্তুকি অব্যাহত রাখা উচিত, এমনকি তা যদি মুক্তবাজার নীতি ভঙ্গ করে।",
    direction: -1,
    x_weight: -2,
    y_weight: -1,
    bloc_weights: { BNP: 1.0, Student: 2.0, JI: 1.5, Sushil: -0.5, AL: 1.0 }
  },
  {
    id: "q19",
    blockId: 4,
    text: "প্রতি বছর জনগণের করের টাকায় লোকসান গোনা রাষ্ট্রায়ত্ত শিল্প ও কারখানাগুলো (যেমন পাটকল, চিনিকল) অবিলম্বে বেসরকারি খাতে ছেড়ে দেওয়া উচিত।",
    direction: 1,
    x_weight: 2.5,
    y_weight: 0,
    bloc_weights: { BNP: 2.5, Student: -1.5, JI: 1.0, Sushil: 2.0, AL: -1.0 }
  },

  // --- Block 5: জাতীয়তাবাদ ও সার্বভৌমত্ব (Nationalism & Sovereignty) ---
  {
    id: "q21",
    blockId: 5,
    text: "জুলাই হত্যাকাণ্ডের বিচারের জন্য শেখ হাসিনাকে ফিরিয়ে আনার দাবি আদায়ে ভারতের সাথে বাণিজ্যিক ও কৌশলগত সম্পর্কে টানাপোড়েন হলেও বাংলাদেশ সরকারকে অনড় থাকতে হবে।",
    direction: 1,
    x_weight: 0,
    y_weight: 1,
    bloc_weights: { BNP: 2.5, Student: 2.5, JI: 2.5, Sushil: 1.0, AL: -3.0 }
  },
  {
    id: "q22",
    blockId: 5,
    text: "একটি একক আঞ্চলিক প্রতিবেশীর ওপর নির্ভরশীলতা কাটিয়ে উঠতে বাংলাদেশের উচিত যুক্তরাষ্ট্র, চীন ও পশ্চিমা বিশ্বের সাথে বহুমুখী কৌশলগত ও প্রতিরক্ষা অংশীদারিত্ব গড়ে তোলা।",
    direction: 1,
    x_weight: 1,
    y_weight: 1,
    bloc_weights: { BNP: 2.0, Student: 2.0, JI: 2.0, Sushil: 2.0, AL: -2.0 }
  },
  {
    id: "q25",
    blockId: 5,
    text: "নিজস্ব জাতীয় নিরাপত্তা ও রাজস্ব নিশ্চিত না করে এবং তিস্তার মতো অভিন্ন নদীর হিস্যা না পেয়ে ভারতকে চট্টগ্রাম-মোংলা বন্দর ব্যবহারের অবাধ ট্রানজিট সুবিধা দেওয়া উচিত নয়।",
    direction: 1,
    x_weight: 0,
    y_weight: 1,
    bloc_weights: { BNP: 2.5, Student: 2.5, JI: 2.5, Sushil: 1.5, AL: -2.5 }
  },

  // --- Block 6: স্বাধীনতা ও মানবাধিকার (Civil Liberties & Human Rights) ---
  {
    id: "q20",
    blockId: 6,
    text: "ব্যাংক খাত ধ্বংসকারী শীর্ষ ইচ্ছাকৃত ঋণখেলাপি ও অর্থপাচারকারীদের স্থাবর-অস্থাবর সম্পদ কোনো আইনি দীর্ঘসূত্রতা ছাড়াই অবিলম্বে রাষ্ট্রের অনুকূলে বাজেয়াপ্ত করা উচিত।",
    direction: 1,
    x_weight: -2,
    y_weight: -1,
    bloc_weights: { BNP: 1.5, Student: 2.5, JI: 2.0, Sushil: 1.0, AL: -2.0 }
  },
  {
    id: "q26",
    blockId: 6,
    text: "সাইবার নিরাপত্তা আইন বা এ জাতীয় বিশেষ আইন বাতিল করা উচিত; ধর্ম বা রাষ্ট্রের অবমাননার অজুহাতে অনলাইনে ভিন্নমত দমন সম্পূর্ণ বন্ধ হওয়া উচিত।",
    direction: 1,
    x_weight: 0,
    y_weight: 2.5,
    bloc_weights: { BNP: 1.5, Student: 2.5, JI: -0.5, Sushil: 2.5, AL: -2.5 }
  },
  {
    id: "q32",
    blockId: 6,
    text: "বিগত দেড় দশকে সংঘটিত গুম ও বিচারবহির্ভূত হত্যাকাণ্ডে জড়িত নিরাপত্তা বাহিনীর সদস্যদের বিচার বিশেষ ট্রাইব্যুনালে প্রকাশ্যে হওয়া উচিত, বাহিনীর মনোবল যা-ই হোক।",
    direction: 1,
    x_weight: 0,
    y_weight: 2,
    bloc_weights: { BNP: 2.5, Student: 2.5, JI: 2.5, Sushil: 2.5, AL: -3.0 }
  },

  // --- Block 7: সংস্কার ও সংবিধান (State Reform & Constitution) ---
  {
    id: "q23",
    blockId: 7,
    text: "ভারতের আপত্তির তোয়াক্কা না করে উত্তরবঙ্গের লাখ লাখ কৃষকের স্বার্থে তিস্তা মহাপরিকল্পনা চীনের অর্থায়ন ও কারিগরি সহায়তায় দ্রুত বাস্তবায়ন করা উচিত।",
    direction: 1,
    x_weight: -1,
    y_weight: 1,
    bloc_weights: { BNP: 2.0, Student: 2.5, JI: 2.5, Sushil: 1.0, AL: -2.0 }
  },
  {
    id: "q33",
    blockId: 7,
    text: "জুলাই অভ্যুত্থানের অপরাধের সুরাহা ও দৃশ্যমান অনুশোচনা ছাড়া আওয়ামী লীগকে আসন্ন জাতীয় নির্বাচনে সরাসরি অংশ নিতে দেওয়া উচিত নয়।",
    direction: 1,
    x_weight: 0,
    y_weight: 1,
    bloc_weights: { BNP: 1.5, Student: 2.5, JI: 2.5, Sushil: 0.5, AL: -3.0 }
  },
  {
    id: "q34",
    blockId: 7,
    text: "১৯৭১ সালের মুক্তিযুদ্ধ ছিল সামগ্রিক জনযুদ্ধ; সংবিধানে একক ব্যক্তিকে 'জাতির পিতা' ঘোষণার একচ্ছত্র বিধান বাতিল করে ভাসানী ও জিয়ার অবদানকেও সমমর্যাদা দেওয়া উচিত।",
    direction: 1,
    x_weight: 0,
    y_weight: 1.5,
    bloc_weights: { BNP: 2.5, Student: 2.0, JI: 2.0, Sushil: 1.5, AL: -3.0 }
  },

  // --- Block 8: ন্যায়বিচার ও সমতা (Social Justice & Inclusion) ---
  {
    id: "q15",
    blockId: 8,
    text: "কওমি মাদ্রাসার দাওরায়ে হাদিস ডিগ্রির মাস্টার্স মান বহাল রাখতে হলে পাঠ্যক্রমে আধুনিক বিজ্ঞান, তথ্যপ্রযুক্তি ও সংবিধানের মৌলিক শিক্ষা বাধ্যতামূলক করা উচিত।",
    direction: 1,
    x_weight: 0,
    y_weight: 1.5,
    bloc_weights: { BNP: 0.5, Student: 2.0, JI: -2.0, Sushil: 2.5, AL: 1.5 }
  },
  {
    id: "q27",
    blockId: 8,
    text: "গার্মেন্টস ও শিল্প শ্রমিকদের জীবনধারণের উপযোগী ন্যূনতম মজুরি এবং মালিকপক্ষের চাপমুক্ত স্বাধীন ট্রেড ইউনিয়ন গঠনের অধিকার আইনে বাধ্যতামূলক করা উচিত।",
    direction: 1,
    x_weight: -2.5,
    y_weight: 1.5,
    bloc_weights: { BNP: 0.5, Student: 2.5, JI: 1.0, Sushil: 2.0, AL: 0.5 }
  },
  {
    id: "q39",
    blockId: 8,
    text: "ধর্মীয় ও ক্ষুদ্র নৃগোষ্ঠীর উপাসনালয় এবং সম্পত্তির ওপর সহিংসতা প্রতিরোধে আলাদা বিশেষ সুরক্ষা আইন ও দ্রুত বিচার সেল গঠন করা জরুরি।",
    direction: 1,
    x_weight: -1,
    y_weight: 2,
    bloc_weights: { BNP: 1.0, Student: 2.0, JI: 0.5, Sushil: 2.5, AL: 2.0 }
  }
];

export const CURATED_ENGLISH_TEXTS = {
  q4: "The government should retain direct executive control over the appointment of university Vice-Chancellors and civil administration heads to ensure rapid policy implementation.",
  q6: "The absence of a formidable, viable opposition party in current politics severely undermines the accountability of the government.",
  q8: "A credible national election is impossible under an incumbent political party; a non-partisan caretaker government is indispensable.",
  q9: "Bangladesh should adopt Proportional Representation (PR) instead of First-Past-The-Post, ensuring smaller parties gain parliamentary seats proportional to their national vote share.",
  q10: "To prevent the concentration of absolute power in one individual, the constitution should strictly cap the Prime Minister to a maximum of two terms.",
  q11: "The decision of the Chief Justice and an independent Judicial Commission on judicial appointments should be final, without any veto power from the Law Ministry or Prime Minister.",
  q12: "Mandatory denominational religious studies have failed to stem widespread corruption; schooling should instead focus on universal ethics and civic morality.",
  q13: "The state should enact laws guaranteeing equal inheritance rights for women, regardless of traditional or religious personal laws.",
  q14: "To prevent the misuse of faith and sectarian polarization, religion-based political parties should be strictly barred by the constitution.",
  q15: "To maintain university master's equivalence for Qawmi madrasha degrees, inclusion of modern science, IT, and constitutional civics in their curriculum should be mandatory.",
  q17: "Unfair energy contracts that pay billions in 'capacity charges' to private and foreign power plants without electricity generation must be cancelled or renegotiated.",
  q18: "The state should guarantee minimum support prices for crops and heavily subsidize agricultural inputs, even if it widens the fiscal deficit.",
  q19: "Chronic loss-making state-owned enterprises (such as sugar and jute mills) that burden taxpayers should be privatized immediately.",
  q20: "The assets of chronic bank loan defaulters and money launderers should be seized immediately by the state without procedural delays.",
  q21: "Bangladesh must relentlessly demand the extradition of Sheikh Hasina for trial over the July killings, even if it strains diplomatic and trade relations with India.",
  q22: "To overcome dependence on a single regional neighbor, Bangladesh should diversify its strategic, economic, and defense partnerships with the US, the West, and China.",
  q23: "The government should expedite the Teesta River comprehensive project with Chinese funding for Northern farmers, without waiting for Indian clearance.",
  q25: "Unrestricted transit through Bangladeshi ports and territory should not be granted without reciprocal benefits, fair water-sharing treaties, and guaranteed revenue.",
  q26: "Draconian cyber security laws should be repealed; online dissent and critical journalism should never be criminalized under the guise of defamation or state security.",
  q27: "A living wage and the right to form independent trade unions without management intimidation must be legally mandated for RMG and industrial workers.",
  q32: "Security personnel implicated in enforced disappearances and extrajudicial killings must face public trial in special tribunals, regardless of institutional pushback.",
  q33: "The Awami League should be barred from contesting the upcoming national elections until comprehensive accountability for the July uprising is achieved.",
  q34: "The 1971 independence struggle was a collective effort; constitutional mono-centric adulation of Sheikh Mujibur Rahman should be replaced by pluralist recognition of Bhashani, Ziaur Rahman, and all key figures.",
  q39: "Special legislation and dedicated fast-track judicial cells are urgently needed to protect the lives, lands, and worship places of religious and ethnic minorities."
};

console.log("Total Curated Questions:", CURATED_24_QUESTIONS.length);
console.log("Block distribution:");
for (let b = 1; b <= 8; b++) {
  const count = CURATED_24_QUESTIONS.filter(q => q.blockId === b).length;
  console.log(`Block ${b}: ${count} questions`);
}
