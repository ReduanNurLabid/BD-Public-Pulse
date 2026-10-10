/**
 * বাংলাদেশ রাজনৈতিক আদর্শ মূল্যায়ন ২০২৬ (BD Political Compass 2026)
 * গবেষণামূলক ৪০টি প্রশ্ন এবং আদর্শিক ম্যাট্রিক্স
 *
 * MODEL NOTES (for maintainers)
 * - 'direction': +1 if AGREEING moves toward the block's RIGHT pole, -1 if toward the LEFT pole. Used only for block scores.
 * - 'x_weight'/'y_weight': effect of AGREEING on the compass (x: -collectivist/+market, y: -authoritarian/+libertarian). Used only for the compass.
 * - 'bloc_weights': how strongly a supporter of each bloc is expected to AGREE (+) or DISAGREE (-). Used for bloc matching.
 * - bloc_weights and centroids are EDITORIAL ESTIMATES, not measured. Calibrate them with the optional CALIBRATION_QUESTION data.
 * - Centroids are derived from the weights (typical supporter), not from evidence about real party positions.
 * - Results mean "closest to the stated positions of X in this test", not "you belong to X".
 */

export const THEMATIC_BLOCKS = [
  {
    "id": 1,
    "key": "state_power",
    "title": "রাষ্ট্র ও শাসনক্ষমতা",
    "subtitle": "রাষ্ট্রীয় ক্ষমতা ও নির্বাহী কর্তৃত্ব",
    "icon": "Shield",
    "questionRange": [
      1,
      5
    ],
    "leftPole": "কর্তৃত্ববাদী / কেন্দ্রীয় নিয়ন্ত্রণ",
    "rightPole": "ক্ষমতার ভারসাম্য ও বিকেন্দ্রীকরণ",
    "leftShort": "কর্তৃত্ববাদী",
    "rightShort": "ভারসাম্যমুখী"
  },
  {
    "id": 2,
    "key": "democracy",
    "title": "গণতন্ত্র ও নির্বাচনব্যবস্থা",
    "subtitle": "নির্বাচন ব্যবস্থা ও গণতন্ত্র",
    "icon": "Vote",
    "questionRange": [
      6,
      10
    ],
    "leftPole": "দলীয় প্রভাব ও নির্বাহী নিয়ন্ত্রণ",
    "rightPole": "নিরপেক্ষ তত্ত্বাবধায়ক ও গণভোট",
    "leftShort": "দলীয় নিয়ন্ত্রণ",
    "rightShort": "নিরপেক্ষ ব্যবস্থা"
  },
  {
    "id": 3,
    "key": "religion_society",
    "title": "ধর্মনিরপেক্ষতা ও সমাজ",
    "subtitle": "ধর্ম, ধর্মনিরপেক্ষতা ও নৈতিকতা",
    "icon": "Scale",
    "questionRange": [
      11,
      15
    ],
    "leftPole": "ধর্মীয় অনুশাসন ও রাষ্ট্রধর্ম প্রাধান্য",
    "rightPole": "ধর্মনিরপেক্ষতা ও সর্বজনীন সমতা",
    "leftShort": "ধর্মীয় অনুশাসন",
    "rightShort": "ধর্মনিরপেক্ষতা"
  },
  {
    "id": 4,
    "key": "economy_market",
    "title": "অর্থনীতি  ও বাজার",
    "subtitle": "বাজার ও সম্পদ বণ্টন",
    "icon": "TrendingUp",
    "questionRange": [
      16,
      20
    ],
    "leftPole": "রাষ্ট্রীয় মালিকানা ও প্রগতিশীল কর",
    "rightPole": "উন্মুক্ত মুক্তবাজার ও পুঁজিবাদী প্রবৃদ্ধি",
    "leftShort": "সামষ্টিক / কল্যাণ",
    "rightShort": "মুক্তবাজার"
  },
  {
    "id": 5,
    "key": "sovereignty",
    "title": "জাতীয়তাবাদ ও সার্বভৌমত্ব",
    "subtitle": "জাতীয়তাবাদ ও সার্বভৌমত্ব",
    "icon": "Globe",
    "questionRange": [
      21,
      25
    ],
    "leftPole": "কৌশলগত ছাড় ও আঞ্চলিক আপস",
    "rightPole": "আপসহীন সার্বভৌমত্ব ও সমমর্যাদা",
    "leftShort": "কৌশলগত ছাড়",
    "rightShort": "আপসহীন মর্যাদা"
  },
  {
    "id": 6,
    "key": "civil_liberties",
    "title": "স্বাধীনতা ও মানবাধিকার",
    "subtitle": "নাগরিক স্বাধীনতা ও মানবাধিকার",
    "icon": "UserCheck",
    "questionRange": [
      26,
      30
    ],
    "leftPole": "নিয়ন্ত্রণ ও সাইবার নজরদারি",
    "rightPole": "নিরঙ্কুশ বাকস্বাধীনতা ও সমাবেশ",
    "leftShort": "কঠোর নিয়ন্ত্রণ",
    "rightShort": "বাকস্বাধীনতা"
  },
  {
    "id": 7,
    "key": "state_reform",
    "title": "সংস্কার ও সংবিধান",
    "subtitle": "প্রাতিষ্ঠানিক সংস্কার ও ২০২৪ এর গণ-অভ্যুত্থান",
    "icon": "FileText",
    "questionRange": [
      31,
      35
    ],
    "leftPole": "প্রচলিত সাংবিধানিক স্থিতাবস্থা",
    "rightPole": "আমূল রূপান্তর ও বৈষম্যহীন ন্যায়বিচার",
    "leftShort": "স্থিতাবস্থা",
    "rightShort": "আমূল রূপান্তর"
  },
  {
    "id": 8,
    "key": "social_justice",
    "title": "ন্যায়বিচার ও সমতা",
    "subtitle": "সামাজিক ন্যায়বিচার ও অন্তর্ভুক্তিমূলক উন্নয়ন",
    "icon": "HeartHandshake",
    "questionRange": [
      36,
      40
    ],
    "leftPole": "বিদ্যমান ব্যবস্থা ও বিশেষ সংরক্ষণ বহাল রাখা",
    "rightPole": "সামাজিক সমতা, জবাবদিহি ও পুনর্বণ্টনমূলক ন্যায়বিচার",
    "leftShort": "বিদ্যমান কাঠামো",
    "rightShort": "সামাজিক সমতা"
  }
];

export const QUESTIONS = [
  {
    "id": "q1",
    "blockId": 1,
    "text": "উন্নয়ন প্রকল্প দ্রুত শেষ করতে প্রধানমন্ত্রীর হাতে এমন ক্ষমতা থাকা উচিত, যাতে সংসদ ও সরকারি প্রশাসনের দীর্ঘ অনুমোদন প্রক্রিয়া ছাড়াই তিনি সিদ্ধান্ত নিতে পারেন।",
    "direction": -1,
    "x_weight": -1,
    "y_weight": -2.5,
    "bloc_weights": {
      "AL": 3.5,
      "BNP": 1,
      "JI": 0,
      "Student": -3.5,
      "Sushil": -3
    }
  },
  {
    "id": "q2",
    "blockId": 1,
    "text": "বিরোধী দলের কর্মসূচিকে রাষ্ট্রের স্থিতিশীলতার জন্য হুমকি মনে করলে সরকারের হাতে সেই কর্মসূচি ঠেকাতে আইনশৃঙ্খলা বাহিনীকে দিয়ে কঠোর বলপ্রয়োগ করার ক্ষমতা থাকা উচিত।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -3,
    "bloc_weights": {
      "AL": 3.5,
      "BNP": 0.5,
      "JI": -2,
      "Student": -4,
      "Sushil": -3.5
    }
  },
  {
    "id": "q3",
    "blockId": 1,
    "text": "প্রধানমন্ত্রী কতবার নির্বাচিত হতে পারবেন, তার কোনো সীমা (যেমন সর্বোচ্চ দুই মেয়াদ) থাকা উচিত নয়।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -2.5,
    "bloc_weights": {
      "AL": 4,
      "BNP": -2.5,
      "JI": -2,
      "Student": -3.5,
      "Sushil": -3.5
    }
  },
  {
    "id": "q4",
    "blockId": 1,
    "text": "নির্বাচিত বেসামরিক সরকারের হাতেই রাষ্ট্র পরিচালনার চূড়ান্ত কর্তৃত্ব থাকা উচিত; এ ক্ষেত্রে রাজনীতিতে সেনাবাহিনীর প্রভাব কমানো উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 2.5,
    "bloc_weights": {
      "AL": 0,
      "BNP": 2,
      "JI": 2,
      "Student": 3,
      "Sushil": 3.5
    }
  },
  {
    "id": "q5",
    "blockId": 1,
    "text": "গুজব ও সাইবার অপরাধ ঠেকাতে সরকারি গোয়েন্দা সংস্থা নাগরিকদের সামাজিক যোগাযোগমাধ্যম ও ব্যক্তিগত যোগাযোগ (যেমন ফোনকল, মেসেজ) নজরদারিতে রাখতে পারা সমর্থনযোগ্য।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -3,
    "bloc_weights": {
      "AL": 3.5,
      "BNP": 1,
      "JI": -1.5,
      "Student": -4,
      "Sushil": -3.5
    }
  },
  {
    "id": "q6",
    "blockId": 2,
    "text": "সংবিধান সংস্কার নিয়ে গণভোট (সরাসরি জনগণের ভোটে হ্যাঁ বা না সিদ্ধান্ত) জাতীয় নির্বাচনের দিন না করে, নির্বাচনের আগে আলাদা দিনে করা উচিত ছিল।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 1.5,
    "bloc_weights": {
      "AL": -2,
      "BNP": -3.5,
      "JI": 3.5,
      "Student": 4,
      "Sushil": 0.5
    }
  },
  {
    "id": "q7",
    "blockId": 2,
    "text": "শুধু এলাকাভিত্তিক ফলাফলের ওপর নির্ভর না করে, সারা দেশে প্রতিটি দল মোট যত শতাংশ ভোট পেয়েছে তার ভিত্তিতে সংসদে দলগুলোর আসনসংখ্যা নির্ধারণ করা উচিত (আনুপাতিক প্রতিনিধিত্ব পদ্ধতি)।",
    "direction": 1,
    "x_weight": -0.5,
    "y_weight": 2.5,
    "bloc_weights": {
      "AL": -2,
      "BNP": -2.5,
      "JI": 3,
      "Student": 4,
      "Sushil": 3
    }
  },
  {
    "id": "q8",
    "blockId": 2,
    "text": "জুলাই জাতীয় সনদের (২০২৪-এর অভ্যুত্থানের পর রাজনৈতিক দলগুলোর আলোচনায় তৈরি সংস্কার প্রস্তাবনা) সব সংস্কার প্রস্তাব, কোনো দল আপত্তি জানালেও, পুরোপুরি বাস্তবায়ন করা উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 1.5,
    "bloc_weights": {
      "AL": -2.5,
      "BNP": -2,
      "JI": 4,
      "Student": 4,
      "Sushil": 1
    }
  },
  {
    "id": "q9",
    "blockId": 2,
    "text": "দুর্নীতি দমন কমিশন (দুদক) ও পুলিশ পুরোপুরি স্বাধীন না থেকে নির্বাচিত সরকারের আংশিক নিয়ন্ত্রণে থাকা উচিত।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -3,
    "bloc_weights": {
      "AL": 3.5,
      "BNP": 1.5,
      "JI": -1,
      "Student": -4,
      "Sushil": -4
    }
  },
  {
    "id": "q10",
    "blockId": 2,
    "text": "সংবিধানের মূল কাঠামো বা গুরুত্বপূর্ণ ধারা বদলাতে হলে শুধু সংসদ সদস্যদের ভোটে নয়, সারা দেশের জনগণের সরাসরি ভোটে (গণভোট) অনুমোদন নেওয়া বাধ্যতামূলক হওয়া উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 2.5,
    "bloc_weights": {
      "AL": -3.5,
      "BNP": 3,
      "JI": 3.5,
      "Student": 4,
      "Sushil": 3.5
    }
  },
  {
    "id": "q11",
    "blockId": 3,
    "text": "রাষ্ট্রের আইন ও নীতি তৈরিতে কোনো ধর্মের বিধান ভিত্তি হিসেবে ধরা উচিত নয়; এগুলো ধর্মনিরপেক্ষ হওয়া এবং সব নাগরিকের জন্য সমান মানদণ্ডে তৈরি হওয়া উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 4,
    "bloc_weights": {
      "AL": 3.5,
      "BNP": -1.5,
      "JI": -4,
      "Student": 1.5,
      "Sushil": 3.5
    }
  },
  {
    "id": "q12",
    "blockId": 3,
    "text": "সংবিধানে ইসলামকে রাষ্ট্রধর্ম হিসেবে বহাল রাখা উচিত।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -4,
    "bloc_weights": {
      "AL": -1.5,
      "BNP": 2.5,
      "JI": 4,
      "Student": -1.5,
      "Sushil": -3
    }
  },
  {
    "id": "q13",
    "blockId": 3,
    "text": "ধর্মীয় আদর্শের ভিত্তিতে গঠিত রাজনৈতিক দল আইন করে নিষিদ্ধ করা উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": -2,
    "bloc_weights": {
      "AL": 4,
      "BNP": -2,
      "JI": -4,
      "Student": -2.5,
      "Sushil": -1.5
    }
  },
  {
    "id": "q14",
    "blockId": 3,
    "text": "বিয়ে, বিবাহবিচ্ছেদ ও উত্তরাধিকারের মতো পারিবারিক বিষয়ে ধর্মভেদে আলাদা আইনের বদলে সব নাগরিকের জন্য একই আইন (অভিন্ন পারিবারিক আইন) চালু করা উচিত, যেখানে নারী ও পুরুষের অধিকার সমান হবে।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 4,
    "bloc_weights": {
      "AL": 2,
      "BNP": -2,
      "JI": -4,
      "Student": 2,
      "Sushil": 4
    }
  },
  {
    "id": "q15",
    "blockId": 3,
    "text": "ধর্ম অবমাননার (ব্লাসফেমি) জন্য কঠোর শাস্তির আইন থাকা উচিত, এমনকি তাতে মতপ্রকাশের স্বাধীনতা কিছুটা সীমিত হলেও।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -4,
    "bloc_weights": {
      "AL": 0,
      "BNP": 2,
      "JI": 4,
      "Student": 1,
      "Sushil": -3.5
    }
  },
  {
    "id": "q16",
    "blockId": 4,
    "text": "বিদ্যুৎ, জ্বালানি ও স্বাস্থ্যসেবার মতো মৌলিক খাতে সরকারের ভূমিকা কমিয়ে বেসরকারি কোম্পানির অংশগ্রহণ অনেক বাড়ানো উচিত।",
    "direction": 1,
    "x_weight": 3,
    "y_weight": 0,
    "bloc_weights": {
      "AL": -2.5,
      "BNP": 2.5,
      "JI": -1,
      "Student": -3.5,
      "Sushil": 2
    }
  },
  {
    "id": "q17",
    "blockId": 4,
    "text": "দেশি শিল্পকে রক্ষা করতে আমদানি শুল্ক (বিদেশি পণ্যের ওপর আরোপিত কর) বাড়ানোর বদলে বিদেশি পণ্য ও বিনিয়োগের জন্য বাজার খুলে দেওয়া এবং আন্তর্জাতিক বাণিজ্য চুক্তি বাড়ানো উচিত।",
    "direction": 1,
    "x_weight": 3,
    "y_weight": 0,
    "bloc_weights": {
      "AL": 1,
      "BNP": 3.5,
      "JI": 0,
      "Student": -2,
      "Sushil": 3
    }
  },
  {
    "id": "q18",
    "blockId": 4,
    "text": "বেশি আয় বা সম্পদের মালিকদের ওপর উচ্চ হারে কর বসিয়ে সেই অর্থে দরিদ্রদের জন্য সরকারি সহায়তা (যেমন ভাতা, খাদ্য ও স্বাস্থ্য সহায়তা) বাড়ানো উচিত।",
    "direction": -1,
    "x_weight": -3,
    "y_weight": 0,
    "bloc_weights": {
      "AL": 1,
      "BNP": -2,
      "JI": 2,
      "Student": 4,
      "Sushil": 2
    }
  },
  {
    "id": "q19",
    "blockId": 4,
    "text": "শ্রমিকদের মজুরি কত হবে, তা সরকার ন্যূনতম মজুরি বেঁধে না দিয়ে বাজারের চাহিদা ও জোগানের ওপর ছেড়ে দেওয়া উচিত।",
    "direction": 1,
    "x_weight": 3,
    "y_weight": -1,
    "bloc_weights": {
      "AL": 0,
      "BNP": 2.5,
      "JI": -1.5,
      "Student": -4,
      "Sushil": -2
    }
  },
  {
    "id": "q20",
    "blockId": 4,
    "text": "সেতু, বিদ্যুৎকেন্দ্র ও মেট্রোরেলের মতো বড় অবকাঠামো প্রকল্প সরকারের চালিয়ে যাওয়া উচিত, এমনকি তাতে সরকারের ব্যয় ও বিদেশি ঋণ বাড়লেও।",
    "direction": -1,
    "x_weight": -1.5,
    "y_weight": 0,
    "bloc_weights": {
      "AL": 4,
      "BNP": 1,
      "JI": -1,
      "Student": -2.5,
      "Sushil": -2
    }
  },
  {
    "id": "q21",
    "blockId": 5,
    "text": "ভারতের সঙ্গে ঘনিষ্ঠ সম্পর্ক ও কৌশলগত মিত্রতা ধরে রাখতে বাংলাদেশের কিছু চুক্তি ও আলোচনায় ছাড় দেওয়া বাস্তবসম্মত।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -1,
    "bloc_weights": {
      "AL": 4,
      "BNP": -1.5,
      "JI": -3,
      "Student": -3.5,
      "Sushil": -1.5
    }
  },
  {
    "id": "q22",
    "blockId": 5,
    "text": "ভারতের সঙ্গে রাজনৈতিক ও কূটনৈতিক মতবিরোধের কারণে নাগরিকদের ভারতীয় পণ্য ও ভারতীয় সংস্কৃতি (যেমন সিনেমা, টিভি অনুষ্ঠান) সম্পূর্ণভাবে বর্জন করা উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 0,
    "bloc_weights": {
      "AL": -4,
      "BNP": 0.5,
      "JI": 3.5,
      "Student": 4,
      "Sushil": -3
    }
  },
  {
    "id": "q23",
    "blockId": 5,
    "text": "কোনো বিদেশি রাষ্ট্রকে বাংলাদেশের ভূখণ্ড দিয়ে যাতায়াত (করিডর বা ট্রানজিট) কিংবা বন্দর ব্যবহারের সুযোগ দেওয়ার চুক্তি জাতীয় সংসদে খোলামেলা আলোচনা ও অনুমোদন ছাড়া করা উচিত নয়।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 2,
    "bloc_weights": {
      "AL": -1.5,
      "BNP": 2,
      "JI": 3,
      "Student": 3.5,
      "Sushil": 3
    }
  },
  {
    "id": "q24",
    "blockId": 5,
    "text": "সীমান্তে ভারতের সীমান্তরক্ষী বাহিনী (বিএসএফ)-এর হাতে বাংলাদেশি নাগরিক নিহত হলে, দ্বিপাক্ষিক সম্পর্ক রক্ষার স্বার্থে কড়া কূটনৈতিক প্রতিক্রিয়ার বদলে সংযত প্রতিক্রিয়া দেখানো ভালো।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -2,
    "bloc_weights": {
      "AL": 3,
      "BNP": -3.5,
      "JI": -4,
      "Student": -4,
      "Sushil": -3
    }
  },
  {
    "id": "q25",
    "blockId": 5,
    "text": "অর্থনৈতিক সংকটে আন্তর্জাতিক মুদ্রা তহবিলের (আইএমএফ) ঋণ নেওয়া এবং তার শর্ত, যেমন ভর্তুকি (সরকারি অর্থে জ্বালানি, সার বা খাদ্যের দাম কম রাখা) কমানো, মেনে নেওয়া উচিত, এমনকি তাতে অল্প সময়ের জন্য সাধারণ মানুষের কষ্ট বাড়লেও।",
    "direction": -1,
    "x_weight": 1.5,
    "y_weight": 0,
    "bloc_weights": {
      "AL": 2,
      "BNP": 0.5,
      "JI": -2,
      "Student": -4,
      "Sushil": 1.5
    }
  },
  {
    "id": "q26",
    "blockId": 6,
    "text": "সমাজের প্রচলিত ধর্মীয় বিশ্বাস ও মূল্যবোধের সঙ্গে সাংঘর্ষিক কোনো মত প্রকাশ্যে প্রচার করার অধিকার নাগরিকদের থাকা উচিত নয়।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -4,
    "bloc_weights": {
      "AL": -1,
      "BNP": 1,
      "JI": 4,
      "Student": -1.5,
      "Sushil": -4
    }
  },
  {
    "id": "q27",
    "blockId": 6,
    "text": "সরকারের সমালোচনা করার জন্য, এমনকি ব্যঙ্গচিত্র (কার্টুন) এঁকে সমালোচনা করলেও, কোনো নাগরিককে হয়রানি বা আইনি শাস্তি দেওয়া উচিত নয়।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 3.5,
    "bloc_weights": {
      "AL": -4,
      "BNP": 2,
      "JI": 1.5,
      "Student": 4,
      "Sushil": 4
    }
  },
  {
    "id": "q28",
    "blockId": 6,
    "text": "সরকারের আগাম অনুমতি ছাড়া কোনো স্থানে নাগরিকদের সমাবেশ বা প্রতিবাদ করা বেআইনি হওয়া উচিত।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -3,
    "bloc_weights": {
      "AL": 4,
      "BNP": -2,
      "JI": -2,
      "Student": -4,
      "Sushil": -3
    }
  },
  {
    "id": "q29",
    "blockId": 6,
    "text": "যে সংবাদমাধ্যম বা অনলাইন পোর্টাল সরকারের সমালোচনা করে, তার লাইসেন্স বাতিল বা সম্প্রচার বন্ধ করার ক্ষমতা সরকারের হাতে থাকা উচিত।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -3.5,
    "bloc_weights": {
      "AL": 3,
      "BNP": 0.5,
      "JI": -2,
      "Student": -3.5,
      "Sushil": -4
    }
  },
  {
    "id": "q30",
    "blockId": 6,
    "text": "নারীরা বাইরে কাজ করবেন কি না এবং কী পোশাক পরবেন, এ বিষয়ে ঐতিহ্য বা ধর্মের অনুশাসন মানতে রাষ্ট্রের আইন করে বাধ্য করা উচিত নয়।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 4,
    "bloc_weights": {
      "AL": 3,
      "BNP": 0.5,
      "JI": -4,
      "Student": 2,
      "Sushil": 4
    }
  },
  {
    "id": "q31",
    "blockId": 7,
    "text": "সংবিধানের ৭০ অনুচ্ছেদ (যার ফলে সংসদে দলের সিদ্ধান্তের বিপক্ষে ভোট দিলে বা দল ছাড়লে সংসদ সদস্যপদ হারাতে হয়) বহাল রাখা উচিত।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -3,
    "bloc_weights": {
      "AL": 3.5,
      "BNP": 2,
      "JI": 1.5,
      "Student": -4,
      "Sushil": -3.5
    }
  },
  {
    "id": "q32",
    "blockId": 7,
    "text": "১৯৭২ সালের সংবিধানে ফিরে যাওয়ার বদলে ২০২৪ সালের গণ-অভ্যুত্থানের আকাঙ্ক্ষার ভিত্তিতে সম্পূর্ণ নতুন একটি সংবিধান রচনা করা উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 2.5,
    "bloc_weights": {
      "AL": -4,
      "BNP": 0.5,
      "JI": 4,
      "Student": 4,
      "Sushil": 1
    }
  },
  {
    "id": "q33",
    "blockId": 7,
    "text": "২০২৪ সালের জুলাই-আগস্টের গণ-অভ্যুত্থানকালে সংঘটিত হত্যাকাণ্ডের বিচার শেষ না হওয়া পর্যন্ত আওয়ামী লীগের রাজনৈতিক কার্যক্রম ও নির্বাচনে অংশগ্রহণ নিষিদ্ধ থাকা উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": -2,
    "bloc_weights": {
      "AL": -4,
      "BNP": 0.5,
      "JI": 3.5,
      "Student": 4,
      "Sushil": -2
    }
  },
  {
    "id": "q34",
    "blockId": 7,
    "text": "ঢাকা থেকে কেন্দ্রীয়ভাবে দেশ চালানোর বদলে ক্ষমতা ও বাজেটের বড় অংশ স্থানীয় সরকার (জেলা বা বিভাগ পর্যায়ের নির্বাচিত সরকার) কিংবা প্রদেশের হাতে দেওয়া উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 2.5,
    "bloc_weights": {
      "AL": -2.5,
      "BNP": 0.5,
      "JI": 1.5,
      "Student": 4,
      "Sushil": 3.5
    }
  },
  {
    "id": "q35",
    "blockId": 7,
    "text": "বিশ্ববিদ্যালয় ক্যাম্পাসে রাজনৈতিক দলের সঙ্গে যুক্ত ছাত্রসংগঠনের (যেমন ছাত্রলীগ, ছাত্রদল, ছাত্রশিবির) কার্যক্রম নিষিদ্ধ করা উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": -1,
    "bloc_weights": {
      "AL": -4,
      "BNP": -3,
      "JI": -2.5,
      "Student": 3.5,
      "Sushil": 3.5
    }
  },
  {
    "id": "q36",
    "blockId": 8,
    "text": "কোটা সংস্কার আন্দোলনের (২০২৪) আগে প্রচলিত মুক্তিযোদ্ধা কোটা (মুক্তিযোদ্ধা ও তাঁদের সন্তান-নাতি-নাতনিদের জন্য সরকারি চাকরিতে সংরক্ষিত পদ) আবার চালু করা উচিত।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": 0,
    "bloc_weights": {
      "AL": 4,
      "BNP": -2,
      "JI": -3,
      "Student": -4,
      "Sushil": -3
    }
  },
  {
    "id": "q37",
    "blockId": 8,
    "text": "অর্থ পাচারকারী এবং সিন্ডিকেট (যোগসাজশ করে বাজারে পণ্যের দাম নিয়ন্ত্রণকারী চক্র) ব্যবসায়ীদের অবৈধ সম্পত্তি সরকারের বাজেয়াপ্ত করে শিক্ষা ও স্বাস্থ্য খাতে ব্যয় করা উচিত।",
    "direction": 1,
    "x_weight": -3,
    "y_weight": 0,
    "bloc_weights": {
      "AL": -1,
      "BNP": 2,
      "JI": 3,
      "Student": 4,
      "Sushil": 1
    }
  },
  {
    "id": "q38",
    "blockId": 8,
    "text": "পার্বত্য চট্টগ্রাম ও সমতলের ক্ষুদ্র নৃগোষ্ঠীর জমির অধিকার ও নিজস্ব সংস্কৃতি রক্ষার অধিকার সংবিধানে স্পষ্টভাবে নিশ্চিত করা উচিত।",
    "direction": 1,
    "x_weight": -1,
    "y_weight": 2.5,
    "bloc_weights": {
      "AL": 1.5,
      "BNP": 0.5,
      "JI": -1.5,
      "Student": 3,
      "Sushil": 4
    }
  },
  {
    "id": "q39",
    "blockId": 8,
    "text": "সাবেক প্রধানমন্ত্রী শেখ হাসিনাকে ভারত থেকে ফেরত এনে বিচারের মুখোমুখি করা সরকারের অন্যতম প্রধান অগ্রাধিকার হওয়া উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 0,
    "bloc_weights": {
      "AL": -4,
      "BNP": 2,
      "JI": 3,
      "Student": 4,
      "Sushil": 1.5
    }
  },
  {
    "id": "q40",
    "blockId": 8,
    "text": "স্থানীয় বাজেট ও উন্নয়ন প্রকল্পের সিদ্ধান্তে সাধারণ মানুষের সরাসরি মতামত নিতে নিয়মিত গণশুনানি (খোলা সভা, যেখানে যে কেউ প্রশ্ন ও মতামত জানাতে পারেন) চালু করা উচিত।",
    "direction": 1,
    "x_weight": -1,
    "y_weight": 2.5,
    "bloc_weights": {
      "AL": -2,
      "BNP": 2,
      "JI": 2.5,
      "Student": 4,
      "Sushil": 3.5
    }
  }
];

// Age buckets shared by the demographics dropdown and the stats/aggregates
// schema. Each dropdown option value IS the Firestore field path
// (ageRanges.<value>.count), so the write path and the read path cannot
// drift apart and write increments into orphan paths.
export const AGE_BUCKETS = [
  '১৮-২৫ (তরুণ প্রজন্ম)',
  '২৬-৩৫ (যুবক/কর্মজীবী)',
  '৩৬-৪৫ (মধ্যবয়সী)',
  '৪৬-৬০ (অভিজ্ঞ নাগরিক)',
  '৬০+ (জ্যেষ্ঠ নাগরিক)'
];

// Themes a citizen can propose for the next national survey.
// The `value` set is duplicated as a literal list in firestore.rules — a rule
// change is required if a category is added or renamed here.
export const PROPOSAL_CATEGORIES = [
  { value: 'economy', label: 'অর্থনীতি ও বাজার', icon: 'free-market', color: '#16A34A' },
  { value: 'governance', label: 'শাসনব্যবস্থা ও সংস্কার', icon: 'neutral-system', color: '#0E86B0' },
  { value: 'education', label: 'শিক্ষা ও গবেষণা', icon: 'secularism', color: '#0369A1' },
  { value: 'social_justice', label: 'সামাজিক ন্যায়বিচার', icon: 'equality', color: '#AD7A06' },
  { value: 'law_justice', label: 'আইন ও বিচার', icon: 'balance', color: '#B45309' },
  { value: 'foreign_policy', label: 'পররাষ্ট্র ও সার্বভৌমত্ব', icon: 'diplomacy', color: '#8A3AA0' },
  { value: 'religion_state', label: 'ধর্ম ও রাষ্ট্রনীতি', icon: 'religious-rule', color: '#1D4ED8' },
  { value: 'environment', label: 'পরিবেশ ও জলবায়ু', icon: 'transformation', color: '#4D7C0F' },
  { value: 'health', label: 'স্বাস্থ্য ও জনস্বাস্থ্য', icon: 'public-welfare', color: '#B91C1C' },
  { value: 'other', label: 'অন্যান্য', icon: 'status-quo', color: '#5B5A55' }
];

export const PROPOSAL_CATEGORY_VALUES = PROPOSAL_CATEGORIES.map(c => c.value);

// Prompt ideas for the proposal title input's typewriter placeholder.
export const PROPOSAL_TITLE_IDEAS = [
  'পুলিশ প্রশাসনের বিকেন্দ্রীকরণ...',
  'সংবিধানে প্রধানমন্ত্রীর ক্ষমতা হ্রাস...',
  'সার্বজনীন স্বাস্থ্য বীমা...',
  'ডিপ্লোমা কোটা পুনর্বিবেচনা...',
  'জেলায় জেলায় হাওসিং প্রকল্প...'
];

// Wedge issues tracked individually on the national aggregate.
//
// These are the polarizing questions whose national agree/neutral/disagree split
// is worth publishing. Only these question ids are accumulated in
// stats/aggregates -> wedgeIssues, which keeps the O(1) document cheap.
//
// The id MUST exist in QUESTIONS; verify with:
//   npm run verify:wedge-issues
export const TRACKED_WEDGE_ISSUES = [
  {
    questionId: 'q32',
    title: '"১৯৭২ সালের সংবিধানে ফিরে যাওয়ার বদলে ২০২৪ সালের গণ-অভ্যুত্থানের আকাঙ্ক্ষার ভিত্তিতে সম্পূর্ণ নতুন একটি সংবিধান রচনা করা উচিত।"'
  },
  {
    questionId: 'q13',
    title: '"ধর্মীয় আদর্শের ভিত্তিতে গঠিত রাজনৈতিক দল আইন করে নিষিদ্ধ করা উচিত।"'
  },
  {
    questionId: 'q39',
    title: '"সাবেক প্রধানমন্ত্রী শেখ হাসিনাকে ভারত থেকে ফেরত এনে বিচারের মুখোমুখি করা সরকারের অন্যতম প্রধান অগ্রাধিকার হওয়া উচিত।"'
  },
  {
    questionId: 'q22',
    title: '"ভারতের সঙ্গে রাজনৈতিক ও কূটনৈতিক মতবিরোধের কারণে নাগরিকদের ভারতীয় পণ্য ও ভারতীয় সংস্কৃতি (যেমন সিনেমা, টিভি অনুষ্ঠান) সম্পূর্ণভাবে বর্জন করা উচিত।"'
  }
];

export const TRACKED_WEDGE_ISSUE_IDS = TRACKED_WEDGE_ISSUES.map(i => i.questionId);

// Likert answers are 1..5. Agree = 4/5, Neutral = 3, Disagree = 1/2.
export const LIKERT_MIN = 1;
export const LIKERT_MAX = 5;

export const LIKERT_OPTIONS = [
  {
    "value": 1,
    "label": "দৃঢ়ভাবে দ্বিমত",
    "shortLabel": "কঠোর দ্বিমত",
    "multiplier": -2,
    "color": "#EF4444"
  },
  {
    "value": 2,
    "label": "দ্বিমত",
    "shortLabel": "দ্বিমত",
    "multiplier": -1,
    "color": "#F87171"
  },
  {
    "value": 3,
    "label": "নিরপেক্ষ / স্পষ্ট নয়",
    "shortLabel": "নিরপেক্ষ",
    "multiplier": 0,
    "color": "#94A3B8"
  },
  {
    "value": 4,
    "label": "একমত",
    "shortLabel": "একমত",
    "multiplier": 1,
    "color": "#34D399"
  },
  {
    "value": 5,
    "label": "দৃঢ়ভাবে একমত",
    "shortLabel": "কঠোর একমত",
    "multiplier": 2,
    "color": "#10B981"
  }
];

export const CALIBRATION_QUESTION = {
  "id": "calib_support",
  "optional": true,
  "text": "ঐচ্ছিক: ফেব্রুয়ারি ২০২৬-এর সংসদ নির্বাচনে আপনি কোন দল/জোটকে ভোট দিয়েছেন, অথবা (ভোট না দিয়ে থাকলে) কোন দলের প্রতি আপনার সমর্থন সবচেয়ে বেশি?",
  "options": [
    {
      "value": "BNP",
      "label": "বিএনপি"
    },
    {
      "value": "JI",
      "label": "জামায়াতে ইসলামী"
    },
    {
      "value": "Student",
      "label": "জাতীয় নাগরিক পার্টি (এনসিপি)"
    },
    {
      "value": "AL",
      "label": "আওয়ামী লীগ (দলটি নির্বাচনে অংশ নিতে পারেনি)"
    },
    {
      "value": "Other",
      "label": "অন্য কোনো দল / স্বতন্ত্র"
    },
    {
      "value": "None",
      "label": "কোনো দলকে নয়"
    },
    {
      "value": "Skip",
      "label": "বলতে চাই না"
    }
  ]
};

/**
 * Canonical registry for the five political blocs.
 *
 * This is the ONLY place a bloc's display name lives. The aggregate document's
 * `blocs[*].label`, the Result Screen, the certificate, the chart labels, the
 * logo tooltips and the affiliation form are all derived from these entries, so
 * a rename here propagates everywhere at once and the pages can never drift.
 *
 *   name       full display name, used wherever there is room for it
 *   shortName  compact label for the pie chart, which has no room for `name`
 */
export const BLOC_PROFILES = {
  "Student": {
    "key": "Student",
    "name": "জাতীয় নাগরিক পার্টি",
    "shortName": "NCP",
    "englishName": "National Citizen Party (NCP) / Student-Led Reform",
    "color": "#16A34A",
    "secondaryColor": "#15803D",
    "badge": "সততা, ঐক্য, প্রগতি ও শাপলা কলি",
    "iconLetter": "শাপলা কলি",
    "symbolEmoji": "🌸",
    "centroid": {
      "x": -70,
      "y": 69
    },
    "summaryHeadline": "আপনি জুলাই অভ্যুত্থানের চেতনা, সততা ও ঐক্যের ভিত্তিতে নতুন রাজনৈতিক বন্দোবস্ত এবং বৈষম্যহীন নতুন বাংলাদেশ প্রতিষ্ঠায় বিশ্বাসী।",
    "keyPillars": {
      "state": "ফ্যাসিবাদবিরোধী আপসহীন বিচার, নতুন সংবিধান রূপান্তর ও তরুণ প্রজন্মের নাগরিক শাসন",
      "market": "দুর্নীতি ও সিন্ডিকেট দমন, যুব উদ্যোক্তাবান্ধব উদ্ভাবন ও কর্মসংস্থান সৃষ্টি",
      "liberty": "সততা, ঐক্য ও প্রগতি; মতপ্রকাশের পূর্ণ স্বাধীনতা ও বৈষম্যহীন সাম্য"
    },
    "shortDescription": "জুলাই বিপ্লবের চেতনা, সততা ও প্রগতি, তরুণ নেতৃত্ব ও শাপলা কলির বৈষম্যহীন নতুন বন্দোবস্ত।",
    "detailedDescription": "আপনার রাজনৈতিক চেতনা দাঁড়িয়ে আছে জুলাই গণ-অভ্যুত্থানের ঐতিহাসিক অর্জন ও নতুন রাজনৈতিক বন্দোবস্তের ওপর। আপনি বিশ্বাস করেন—পুরাতন দুর্নীতিগ্রস্ত ও সুবিধাবাদী রাজনৈতিক সংস্কৃতির আমূল অবসান ঘটিয়ে তরুণ নেতৃত্বের হাত ধরে সততা, নাগরিক ঐক্য এবং মৌলিক সাংবিধানিক রূপান্তরের মাধ্যমেই একটি বৈষম্যহীন ও সার্বভৌম বাংলাদেশ গড়ে তোলা সম্ভব।",
    "coreValues": [
      "তরুণ নেতৃত্ব",
      "সততা, ঐক্য ও প্রগতি",
      "ফ্যাসিবাদবিরোধী সংস্কার",
      "বৈষম্যহীন নতুন বন্দোবস্ত"
    ]
  },
  "BNP": {
    "key": "BNP",
    "name": "বিএনপি",
    "shortName": "বিএনপি",
    "englishName": "Liberal Nationalist / Center-Right",
    "color": "#3B82F6",
    "secondaryColor": "#2563EB",
    "badge": "গণতন্ত্র ও বাংলাদেশি জাতীয়তাবাদ",
    "iconLetter": "ধানের শীষ",
    "symbolEmoji": "🔵",
    "centroid": {
      "x": 26,
      "y": -3
    },
    "summaryHeadline": "আপনি ক্ষমতার একক কেন্দ্রীভবন ভেঙে বহুদলীয় গণতন্ত্র, নিরপেক্ষ তত্ত্বাবধায়ক নির্বাচন ও দেশীয় মুক্তবাজার অর্থনীতির বিকাশে বিশ্বাসী।",
    "keyPillars": {
      "state": "প্রধানমন্ত্রীর একক ক্ষমতা হ্রাস, নির্দলীয় তত্ত্বাবধায়ক সরকার ও রাষ্ট্রীয় প্রতিষ্ঠানের ভারসাম্য",
      "market": "ব্যক্তিমালিকানাধীন উদ্যোগ, ব্যবসাবান্ধব করনীতি ও মুক্তবাজার অর্থনীতির দেশীয় প্রসার",
      "liberty": "বাংলাদেশি ভূখণ্ডভিত্তিক জাতীয় ঐক্য, ধর্মীয় অনুভূতির সম্মান এবং গণতান্ত্রিক সমাবেশ অধিকার"
    },
    "shortDescription": "বহুদলীয় গণতন্ত্র, তত্ত্বাবধায়ক নির্বাচন, মুক্তবাজার অর্থনীতি ও বাংলাদেশি ভূখণ্ডভিত্তিক সার্বভৌমত্বে বিশ্বাসী।",
    "detailedDescription": "আপনার মূল অবস্থান হচ্ছে ক্ষমতার ভারসাম্য রক্ষা, গণতান্ত্রিক অধিকার পুনরুদ্ধার, স্থানীয় ও মুক্তবাজার ব্যবসা-বাণিজ্যের প্রসার এবং বাংলাদেশি জাতীয়তাবাদী ভূ-রাজনৈতিক সার্বভৌমত্ব। আপনি মনে করেন রাষ্ট্রকে একক কর্তৃত্বের হাত থেকে মুক্ত করে জনগণের আস্থাভাজন তত্ত্বাবধায়ক ব্যবস্থার অধীনে জবাবদিহিতামূলক করা উচিত।",
    "coreValues": [
      "বহুদলীয় গণতন্ত্র",
      "তত্ত্বাবধায়ক সরকার",
      "বাংলাদেশি জাতীয়তাবাদ",
      "মুক্তবাজার অর্থনীতি"
    ]
  },
  "JI": {
    "key": "JI",
    "name": "জামায়াত-ইসলামী",
    "shortName": "জামায়াত",
    "englishName": "Religious Conservative / Faith-Based Welfare",
    "color": "#8B5CF6",
    "secondaryColor": "#7C3AED",
    "badge": "ইসলামী মূল্যবোধ ও সামাজিক ন্যায়বিচার",
    "iconLetter": "দাঁড়িপাল্লা",
    "symbolEmoji": "🟣",
    "centroid": {
      "x": -31,
      "y": 2
    },
    "summaryHeadline": "আপনি রাষ্ট্র ও সমাজের প্রতিটি ক্ষেত্রে ধর্মীয় অনুশাসন, সামাজিক নৈতিক মূল্যবোধ এবং শোষণহীন সুদমুক্ত ইনসাফ কায়েমে প্রতিশ্রুতিবদ্ধ।",
    "keyPillars": {
      "state": "আইন ও নীতি প্রণয়নে ইসলামী অনুশাসন কার্যকর করা এবং রাষ্ট্রধর্মের স্বকীয়তা সংরক্ষণ",
      "market": "সুদমুক্ত অর্থব্যবস্থা, যাকাতভিত্তিক পুনর্বণ্টন ও প্রান্তিক জনগোষ্ঠীর নৈতিক কল্যাণ",
      "liberty": "পারিবারিক ঐতিহ্য ও ধর্মীয় মূল্যবোধ অক্ষুণ্ণ রাখা এবং সাংস্কৃতিক আধিপত্যবাদের প্রতিরোধ"
    },
    "shortDescription": "ইসলামী অনুশাসন, সামাজিক নৈতিকতা, সুদমুক্ত অর্থনীতি এবং সার্বভৌম আত্মমর্যাদায় প্রতিশ্রুতিবদ্ধ।",
    "detailedDescription": "আপনার দৃষ্টিভঙ্গিতে নৈতিকতা, ধর্মীয় সামাজিক মূল্যবোধ এবং রাষ্ট্র পরিচালনায় ইনসাফ বা ন্যায়বিচারই মূল ভিত্তি। আপনি মনে করেন সমাজকে অধঃপতন ও অনৈতিক অপসংস্কৃতি থেকে রক্ষা করতে পারিবারিক ও শিক্ষাব্যবস্থায় ধর্মীয় মূল্যবোধ জোরদার করা প্রয়োজন এবং আধিপত্যবাদের বিরুদ্ধে আত্মমর্যাদাবোধ অটুট রাখা জরুরি।",
    "coreValues": [
      "ইসলামী নৈতিকতা",
      "সামাজিক ইনসাফ",
      "সুদমুক্ত অর্থব্যবস্থা",
      "সার্বভৌমত্ব রক্ষা"
    ]
  },
  "Sushil": {
    "key": "Sushil",
    "name": "উদার সংবিধানবাদী সুশীল",
    "shortName": "সুশীল",
    "englishName": "Civil Society / Centrist Constitutionalist",
    "color": "#06B6D4",
    "secondaryColor": "#0891B2",
    "badge": "আইনের শাসন ও প্রাতিষ্ঠানিক স্বকীয়তা",
    "iconLetter": "কলম / সংবিধান",
    "symbolEmoji": "⚪",
    "centroid": {
      "x": -1,
      "y": 79
    },
    "summaryHeadline": "আপনি চরম দলীয়করণ ও পপুলিজম বর্জন করে আইনের শাসন, স্বাধীন বিচার বিভাগ, সুশাসন এবং মেধাভিত্তিক সাংবিধানিক জবাবদিহিতায় সবচেয়ে বেশি বিশ্বাসী।",
    "keyPillars": {
      "state": "নির্বাহী বিভাগ থেকে বিচার বিভাগের প্রকৃত স্বাধীনতা, সাংবিধানিক ভারসাম্য ও পেশাদার আমলাতন্ত্র",
      "market": "স্বচ্ছ উন্মুক্ত দরপত্র, প্রাতিষ্ঠানিক জবাবদিহিতা ও দুর্নীতিমুক্ত ভারসাম্যপূর্ণ অর্থনীতি",
      "liberty": "মানবাধিকারের সার্বজনীন সুরক্ষা, গণমাধ্যমের স্বাধীনতা ও ভিন্নমতের প্রতি পরম পরমতসহিষ্ণুতা"
    },
    "shortDescription": "আইনের শাসন, নিরপেক্ষ বিচার বিভাগ, বাকস্বাধীনতা, নাগরিক মানবাধিকার ও মেধাভিত্তিক জবাবদিহিতায় বিশ্বাসী।",
    "detailedDescription": "আপনার আদর্শ দাঁড়িয়ে আছে প্রাতিষ্ঠানিক ভারসাম্য, আইনের শাসন, দুর্নীতিমুক্ত প্রশাসন এবং নাগরিক অধিকারের ওপর। আপনি চরম রাজনৈতিক দলবাজি পরিহার করে নিরপেক্ষ বিশেষজ্ঞ, দক্ষ আমলাতন্ত্র এবং শক্তিশালী সাংবিধানিক প্রতিষ্ঠানের মাধ্যমে রাষ্ট্রের সুশাসন নিশ্চিত করায় সবচেয়ে বেশি আস্থাশীল।",
    "coreValues": [
      "আইনের শাসন",
      "মানবাধিকার ও বাকস্বাধীনতা",
      "স্বাধীন বিচার বিভাগ",
      "সুশাসন ও প্রাতিষ্ঠানিকতা"
    ]
  },
  "AL": {
    "key": "AL",
    "name": "আওয়ামী লীগ",
    "shortName": "আওয়ামী লীগ",
    "englishName": "Development Statist / Center-Left Secular",
    "color": "#10B981",
    "secondaryColor": "#059669",
    "badge": "উন্নয়ন ও রাষ্ট্রীয় ধারাবাহিকতা",
    "iconLetter": "নৌকা",
    "symbolEmoji": "🟢",
    "centroid": {
      "x": 15,
      "y": -31
    },
    "summaryHeadline": "আপনি দৃশ্যমান অবকাঠামো উন্নয়ন, শক্তিশালী নির্বাহী নেতৃত্ব, মুক্তিযুদ্ধের চেতনা ও ধর্মনিরপেক্ষ বাঙালি জাতীয়তাবাদের ধারাবাহিকতায় সবচেয়ে বেশি আস্থাশীল।",
    "keyPillars": {
      "state": "শক্তিশালী নির্বাহী নেতৃত্ব এবং রাষ্ট্রীয় স্থিতিশীলতাকে অগ্রাধিকার",
      "market": "মেগা প্রজেক্ট, সরকারি প্রণোদনা ও রাষ্ট্রীয় পৃষ্ঠপোষকতায় দ্রুত অবকাঠামো প্রবৃদ্ধি",
      "liberty": "বাঙালি জাতীয়তাবাদ ও ধর্মনিরপেক্ষতার প্রশ্নে আপসহীন, তবে সাইবার ও শৃঙ্খলা রক্ষায় কঠোর আইন"
    },
    "shortDescription": "উন্নয়নকামী অবকাঠামো, ধর্মনিরপেক্ষ বাঙালি জাতীয়তাবাদ ও শক্তিশালী কেন্দ্রীভূত রাষ্ট্র পরিচালনায় আস্থাশীল।",
    "detailedDescription": "আপনার চিন্তাধারা রাজনৈতিক প্রক্রিয়া ও দলীয় বিরোধিতার চেয়ে অবকাঠামোগত উন্নয়ন, মেগা প্রকল্প, সামাজিক স্থিতিশীলতা এবং বাঙালি জাতীয়তাবাদের মূলনীতিকে বেশি প্রাধান্য দেয়। আপনি মনে করেন রাষ্ট্রকে একটি শক্তিশালী ও দূরদর্শী নেতৃত্বের মাধ্যমে সংগঠিত রাখা প্রয়োজন।",
    "coreValues": [
      "অবকাঠামো উন্নয়ন",
      "ধর্মনিরপেক্ষতা",
      "শক্তিশালী কেন্দ্র",
      "বাঙালি জাতীয়তাবাদ"
    ]
  }
};

export const QUADRANT_PROFILES = {
  "libertarian_left": {
    "key": "libertarian_left",
    "name": "স্বাধীনতাবাদী বাম (Libertarian Left)",
    "title": "স্বাধীনতাবাদী বাম (Libertarian Left)",
    "badgeColor": "#10B981",
    "color": "#10B981",
    "description": "আপনি অর্থনৈতিক সমতা এবং ব্যক্তিগত স্বাধীনতার পক্ষে। আপনি রাষ্ট্রীয় ক্ষমতার বিকেন্দ্রীকরণ এবং সামাজিক ন্যায়বিচারের ওপর জোর দেন।"
  },
  "libertarian_right": {
    "key": "libertarian_right",
    "name": "স্বাধীনতাবাদী ডান (Libertarian Right)",
    "title": "স্বাধীনতাবাদী ডান (Libertarian Right)",
    "badgeColor": "#3B82F6",
    "color": "#3B82F6",
    "description": "আপনি মুক্তবাজার অর্থনীতি এবং ব্যক্তিগত স্বাধীনতার পক্ষে। আপনি মনে করেন রাষ্ট্রের নিয়ন্ত্রণ ন্যূনতম হওয়া উচিত।"
  },
  "authoritarian_left": {
    "key": "authoritarian_left",
    "name": "কর্তৃত্ববাদী বাম (Authoritarian Left)",
    "title": "কর্তৃত্ববাদী বাম (Authoritarian Left)",
    "badgeColor": "#EF4444",
    "color": "#EF4444",
    "description": "আপনি রাষ্ট্রের মাধ্যমে অর্থনৈতিক সমতা নিশ্চিত করার পক্ষে। আপনি মনে করেন জনকল্যাণে শক্তিশালী রাষ্ট্রীয় নিয়ন্ত্রণ প্রয়োজন।"
  },
  "authoritarian_right": {
    "key": "authoritarian_right",
    "name": "কর্তৃত্ববাদী ডান (Authoritarian Right)",
    "title": "কর্তৃত্ববাদী ডান (Authoritarian Right)",
    "badgeColor": "#F59E0B",
    "color": "#F59E0B",
    "description": "আপনি ঐতিহ্য, শৃঙ্খলা এবং শক্তিশালী রাষ্ট্রের পক্ষে। পাশাপাশি আপনি পুঁজিবাদী অর্থনীতি ও ব্যক্তিগত সম্পত্তির অধিকার সমর্থন করেন।"
  },
  "centrist": {
    "key": "centrist",
    "name": "মধ্যপন্থী (Centrist)",
    "title": "মধ্যপন্থী (Centrist)",
    "badgeColor": "#94A3B8",
    "color": "#94A3B8",
    "description": "আপনি রাজনৈতিক ও অর্থনৈতিক নীতিতে একটি ভারসাম্যপূর্ণ অবস্থান পছন্দ করেন। চরমপন্থার বদলে আপনি বাস্তবসম্মত সমাধান খোঁজেন।"
  }
};
