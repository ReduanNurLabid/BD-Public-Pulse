/**
 * বাংলাদেশ রাজনৈতিক আদর্শ মূল্যায়ন ২০২৬ (BD Political Compass 2026)
 * গবেষণামূলক ২৪টি প্রশ্ন এবং আদর্শিক ম্যাট্রিক্স (Methodological Wedge Framework)
 *
 * MODEL NOTES (for maintainers)
 * - 'direction': +1 if AGREEING moves toward the block's RIGHT pole, -1 if toward the LEFT pole.
 * - 'x_weight'/'y_weight': effect of AGREEING on the compass (x: -collectivist/+market, y: -authoritarian/+libertarian).
 * - 'bloc_weights': how strongly a supporter of each bloc is expected to AGREE (+) or DISAGREE (-).
 * - Calibrated according to the "Enduring Principle vs Transient Event" wedge-issue methodology.
 */

export const THEMATIC_BLOCKS = [
  {
    "id": 1,
    "key": "state_power",
    "title": "রাষ্ট্র ও শাসনক্ষমতা",
    "subtitle": "রাষ্ট্রীয় ক্ষমতা ও নির্বাহী কর্তৃত্ব",
    "icon": "Shield",
    "questionRange": [1, 3],
    "leftPole": "কর্তৃত্ববাদী / কেন্দ্রীয় নিয়ন্ত্রণ",
    "rightPole": "ক্ষমতার ভারসাম্য ও বিকেন্দ্রীকরণ",
    "leftShort": "কেন্দ্রিক কর্তৃত্ব",
    "rightShort": "ভারসাম্যমুখী"
  },
  {
    "id": 2,
    "key": "democracy",
    "title": "গণতন্ত্র ও নির্বাচনব্যবস্থা",
    "subtitle": "নির্বাচন ব্যবস্থা ও গণতন্ত্র",
    "icon": "Vote",
    "questionRange": [4, 6],
    "leftPole": "দলীয় প্রভাব ও নির্বাহী নিয়ন্ত্রণ",
    "rightPole": "নিরপেক্ষ তত্ত্বাবধায়ক ও আনুপাতিক প্রতিনিধিত্ব",
    "leftShort": "দলীয় নিয়ন্ত্রণ",
    "rightShort": "নিরপেক্ষ ব্যবস্থা"
  },
  {
    "id": 3,
    "key": "religion_society",
    "title": "ধর্মনিরপেক্ষতা ও সমাজ",
    "subtitle": "ধর্ম, ধর্মনিরপেক্ষতা ও নৈতিকতা",
    "icon": "Scale",
    "questionRange": [7, 9],
    "leftPole": "ধর্মীয় অনুশাসন ও রাষ্ট্রধর্ম প্রাধান্য",
    "rightPole": "ধর্মনিরপেক্ষতা ও সর্বজনীন সমতা",
    "leftShort": "ধর্মীয় অনুশাসন",
    "rightShort": "ধর্মনিরপেক্ষতা"
  },
  {
    "id": 4,
    "key": "economy_market",
    "title": "অর্থনীতি ও বাজার",
    "subtitle": "বাজার ও সম্পদ বণ্টন",
    "icon": "TrendingUp",
    "questionRange": [10, 12],
    "leftPole": "রাষ্ট্রীয় মালিকানা ও প্রগতিশীল কর",
    "rightPole": "উন্মুক্ত মুক্তবাজার ও পুঁজিবাদী প্রবৃদ্ধি",
    "leftShort": "সামষ্টিক / কল্যাণ",
    "rightShort": "মুক্তবাজার"
  },
  {
    "id": 5,
    "key": "sovereignty",
    "title": "জাতীয়তাবাদ ও সার্বভৌমত্ব",
    "subtitle": "জাতীয়তাবাদ ও সার্বভৌমত্ব",
    "icon": "Globe",
    "questionRange": [13, 15],
    "leftPole": "কৌশলগত ছাড় ও একক নির্ভরশীলতা",
    "rightPole": "আপসহীন সার্বভৌমত্ব ও বহুমুখী পররাষ্ট্রনীতি",
    "leftShort": "কৌশলগত ছাড়",
    "rightShort": "আপসহীন মর্যাদা"
  },
  {
    "id": 6,
    "key": "civil_liberties",
    "title": "স্বাধীনতা ও মানবাধিকার",
    "subtitle": "নাগরিক স্বাধীনতা ও মানবাধিকার",
    "icon": "UserCheck",
    "questionRange": [16, 18],
    "leftPole": "নিয়ন্ত্রণ ও সাইবার নজরদারি",
    "rightPole": "নিরঙ্কুশ বাকস্বাধীনতা ও প্রাতিষ্ঠানিক বিচার",
    "leftShort": "কঠোর নিয়ন্ত্রণ",
    "rightShort": "বাকস্বাধীনতা"
  },
  {
    "id": 7,
    "key": "state_reform",
    "title": "সংস্কার ও সংবিধান",
    "subtitle": "প্রাতিষ্ঠানিক সংস্কার ও সাংবিধানিক রূপান্তর",
    "icon": "FileText",
    "questionRange": [19, 21],
    "leftPole": "প্রচলিত সাংবিধানিক স্থিতাবস্থা",
    "rightPole": "আমূল রূপান্তর ও বৈষম্যহীন ন্যায়বিচার",
    "leftShort": "স্থিতাবস্থা",
    "rightShort": "আমূল রূপান্তর"
  },
  {
    "id": 8,
    "key": "social_justice",
    "title": "ন্যায়বিচার ও সমতা",
    "subtitle": "সামাজিক ন্যায়বিচার ও অন্তর্ভুক্তিমূলক উন্নয়ন",
    "icon": "HeartHandshake",
    "questionRange": [22, 24],
    "leftPole": "বিদ্যমান ব্যবস্থা ও মালিকপক্ষের সুরক্ষা",
    "rightPole": "সামাজিক সমতা, শ্রমিক অধিকার ও সংখ্যালঘু সুরক্ষা",
    "leftShort": "বিদ্যমান কাঠামো",
    "rightShort": "সামাজিক সমতা"
  }
];

export const QUESTION_SET_VERSION = 'qset-2026-10-curated24';

export const QUESTIONS = [
  // --- Block 1: রাষ্ট্র ও শাসনক্ষমতা (State Power & Executive Authority) ---
  {
    "id": "q4",
    "blockId": 1,
    "text": "পাবলিক বিশ্ববিদ্যালয়ের ভিসি নিয়োগ এবং সিভিল প্রশাসনের শীর্ষ পদে সরকারের সরাসরি দলীয় পছন্দ বা নির্বাহী নিয়ন্ত্রণ থাকা উচিত, যাতে সরকারের উন্নয়ন পরিকল্পনা দ্রুত বাস্তবায়ন হয়।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -2,
    "bloc_weights": {
      "AL": 2.5,
      "BNP": 1.5,
      "JI": -1.5,
      "Student": -2.5,
      "Sushil": -2.5
    }
  },
  {
    "id": "q10",
    "blockId": 1,
    "text": "বাংলাদেশের সংবিধানে একজন ব্যক্তির প্রধানমন্ত্রীর দায়িত্ব পালনের সর্বোচ্চ মেয়াদ দুই মেয়াদে নির্দিষ্ট করা উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 2,
    "bloc_weights": {
      "AL": -2.5,
      "BNP": -1.0,
      "JI": 2.0,
      "Student": 2.5,
      "Sushil": 2.5
    }
  },
  {
    "id": "q11",
    "blockId": 1,
    "text": "বিচারক নিয়োগে প্রধান বিচারপতি ও স্বাধীন জুডিশিয়াল কমিশনের সিদ্ধান্তই চূড়ান্ত হওয়া উচিত; আইন মন্ত্রণালয় বা প্রধানমন্ত্রীর কোনো ভেটো ক্ষমতা থাকা উচিত নয়।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 2.5,
    "bloc_weights": {
      "AL": -2.5,
      "BNP": 1.0,
      "JI": 2.0,
      "Student": 2.5,
      "Sushil": 2.5
    }
  },

  // --- Block 2: গণতন্ত্র ও নির্বাচনব্যবস্থা (Democracy & Electoral System) ---
  {
    "id": "q6",
    "blockId": 2,
    "text": "আওয়ামী লীগের অনুপস্থিতিতে সংসদে বা রাজনীতিতে কার্যকর শক্তিশালী বিরোধী দল না থাকা বর্তমান সরকারের জবাবদিহিতা মারাত্মকভাবে ক্ষতিগ্রস্ত করছে।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 1.5,
    "bloc_weights": {
      "AL": 2.5,
      "BNP": 2.0,
      "JI": 0.5,
      "Student": -0.5,
      "Sushil": 1.5
    }
  },
  {
    "id": "q8",
    "blockId": 2,
    "text": "একটি নিরপেক্ষ নির্দলীয় তত্ত্বাবধায়ক সরকার ছাড়া বাংলাদেশে কোনো ক্ষমতাসীন দলীয় সরকারের অধীনে নিরপেক্ষ জাতীয় নির্বাচন কখনোই সম্ভব নয়।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 2,
    "bloc_weights": {
      "AL": -3.0,
      "BNP": 2.5,
      "JI": 2.5,
      "Student": 2.0,
      "Sushil": 2.0
    }
  },
  {
    "id": "q9",
    "blockId": 2,
    "text": "সংসদ নির্বাচনে একক সংখ্যাগরিষ্ঠতার (FPTP) বদলে আনুপাতিক প্রতিনিধিত্ব (PR) পদ্ধতি চালু করা উচিত, যাতে প্রাপ্ত ভোটের অনুপাতে সব দলের প্রতিনিধিত্ব থাকে।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 2,
    "bloc_weights": {
      "AL": -2.0,
      "BNP": -2.5,
      "JI": 2.5,
      "Student": 2.5,
      "Sushil": 1.5
    }
  },

  // --- Block 3: ধর্মনিরপেক্ষতা ও সমাজ (Religion, Ethics & Society) ---
  {
    "id": "q12",
    "blockId": 3,
    "text": "শিক্ষার্থীদের মাঝে নৈতিকতা বৃদ্ধি ও দুর্নীতি রোধের ক্ষেত্রে কেবল ধর্মীয় আচার ও তত্ত্ব শিক্ষার চেয়ে সর্বজনীন মানবিক মূল্যবোধ এবং ব্যবহারিক নীতিশিক্ষা (Ethics) বাধ্যতামূলক করা বেশি কার্যকর।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 1.5,
    "bloc_weights": {
      "AL": 1.5,
      "BNP": -1.0,
      "JI": -2.5,
      "Student": 1.5,
      "Sushil": 2.5
    }
  },
  {
    "id": "q13",
    "blockId": 3,
    "text": "পারিবারিক ও ধর্মীয় প্রথা যা-ই হোক না কেন, সম্পত্তিতে নারী ও পুরুষের সমান উত্তরাধিকার অধিকার নিশ্চিত করতে রাষ্ট্রীয় আইন প্রণয়ন করা উচিত।",
    "direction": 1,
    "x_weight": -1,
    "y_weight": 2,
    "bloc_weights": {
      "AL": 1.0,
      "BNP": -1.5,
      "JI": -3.0,
      "Student": 1.0,
      "Sushil": 2.5
    }
  },
  {
    "id": "q14",
    "blockId": 3,
    "text": "রাজনীতিতে ধর্মের অপব্যবহার ও সাম্প্রদায়িক বিভাজন রোধ করতে সংবিধানে ধর্মভিত্তিক রাজনৈতিক দল গঠন সম্পূর্ণ নিষিদ্ধ করা উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": -1,
    "bloc_weights": {
      "AL": 2.5,
      "BNP": -1.5,
      "JI": -3.0,
      "Student": -1.0,
      "Sushil": 1.5
    }
  },

  // --- Block 4: অর্থনীতি ও বাজার (Economy & Markets) ---
  {
    "id": "q17",
    "blockId": 4,
    "text": "জ্বালানি খাতে বেসরকারি ও বিদেশি বিদ্যুৎকেন্দ্রগুলোকে উৎপাদন না করলেও হাজার কোটি টাকার 'ক্যাপাসিটি চার্জ' বা কেন্দ্রভাড়া দেওয়ার অসম চুক্তিগুলো অবিলম্বে বাতিল বা পুনর্বিবেচনা করা উচিত।",
    "direction": 1,
    "x_weight": -2,
    "y_weight": 1,
    "bloc_weights": {
      "AL": -2.5,
      "BNP": 2.0,
      "JI": 2.0,
      "Student": 2.5,
      "Sushil": 2.0
    }
  },
  {
    "id": "q18",
    "blockId": 4,
    "text": "কৃষকদের স্বার্থে ধান ও নিত্যপণ্যের ন্যূনতম সহায়ক মূল্য নির্ধারণ ও সার-ডিজেলে বিপুল ভর্তুকি অব্যাহত রাখা উচিত, এমনকি তা যদি মুক্তবাজার নীতি ভঙ্গ করে।",
    "direction": -1,
    "x_weight": -2,
    "y_weight": -1,
    "bloc_weights": {
      "AL": 1.0,
      "BNP": 1.0,
      "JI": 1.5,
      "Student": 2.0,
      "Sushil": -0.5
    }
  },
  {
    "id": "q19",
    "blockId": 4,
    "text": "পাটকল ও চিনিকলের মতো লোকসানে থাকা রাষ্ট্রায়ত্ত কলকারখানাগুলো পুরোপুরি বেসরকারি খাতে ছেড়ে দেওয়া উচিত।",
    "direction": 1,
    "x_weight": 2.5,
    "y_weight": 0,
    "bloc_weights": {
      "AL": -1.0,
      "BNP": 2.5,
      "JI": 1.0,
      "Student": -1.5,
      "Sushil": 2.0
    }
  },

  // --- Block 5: জাতীয়তাবাদ ও সার্বভৌমত্ব (Nationalism & Sovereignty) ---
  {
    "id": "q21",
    "blockId": 5,
    "text": "জুলাই হত্যাকাণ্ডের বিচারের জন্য শেখ হাসিনাকে ফিরিয়ে আনার দাবি আদায়ে ভারতের সাথে বাণিজ্যিক ও কৌশলগত সম্পর্কে টানাপোড়েন হলেও বাংলাদেশ সরকারকে অনড় থাকতে হবে।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 1,
    "bloc_weights": {
      "AL": -3.0,
      "BNP": 2.5,
      "JI": 2.5,
      "Student": 2.5,
      "Sushil": 1.0
    }
  },
  {
    "id": "q22",
    "blockId": 5,
    "text": "একটি একক আঞ্চলিক প্রতিবেশীর ওপর নির্ভরশীলতা কাটিয়ে উঠতে বাংলাদেশের উচিত যুক্তরাষ্ট্র, চীন ও পশ্চিমা বিশ্বের সাথে বহুমুখী কৌশলগত ও প্রতিরক্ষা অংশীদারিত্ব গড়ে তোলা।",
    "direction": 1,
    "x_weight": 1,
    "y_weight": 1,
    "bloc_weights": {
      "AL": -2.0,
      "BNP": 2.0,
      "JI": 2.0,
      "Student": 2.0,
      "Sushil": 2.0
    }
  },
  {
    "id": "q25",
    "blockId": 5,
    "text": "নিজস্ব জাতীয় নিরাপত্তা ও রাজস্ব নিশ্চিত না করে এবং তিস্তার মতো অভিন্ন নদীর হিস্যা না পেয়ে ভারতকে চট্টগ্রাম-মোংলা বন্দর ব্যবহারের অবাধ ট্রানজিট সুবিধা দেওয়া উচিত নয়।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 1,
    "bloc_weights": {
      "AL": -2.5,
      "BNP": 2.5,
      "JI": 2.5,
      "Student": 2.5,
      "Sushil": 1.5
    }
  },

  // --- Block 6: স্বাধীনতা ও মানবাধিকার (Civil Liberties & Human Rights) ---
  {
    "id": "q20",
    "blockId": 6,
    "text": "ব্যাংক খাত ধ্বংসকারী শীর্ষ ইচ্ছাকৃত ঋণখেলাপি ও অর্থপাচারকারীদের স্থাবর-অস্থাবর সম্পদ কোনো আইনি দীর্ঘসূত্রতা ছাড়াই অবিলম্বে রাষ্ট্রের অনুকূলে বাজেয়াপ্ত করা উচিত।",
    "direction": 1,
    "x_weight": -2,
    "y_weight": -1,
    "bloc_weights": {
      "AL": -2.0,
      "BNP": 1.5,
      "JI": 2.0,
      "Student": 2.5,
      "Sushil": 1.0
    }
  },
  {
    "id": "q26",
    "blockId": 6,
    "text": "সাইবার নিরাপত্তা আইন বা এ জাতীয় বিশেষ আইন বাতিল করা উচিত; ধর্ম বা রাষ্ট্রের অবমাননার অজুহাতে অনলাইনে ভিন্নমত দমন সম্পূর্ণ বন্ধ হওয়া উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 2.5,
    "bloc_weights": {
      "AL": -2.5,
      "BNP": 1.5,
      "JI": -0.5,
      "Student": 2.5,
      "Sushil": 2.5
    }
  },
  {
    "id": "q32",
    "blockId": 6,
    "text": "বিগত দেড় দশকে সংঘটিত গুম ও বিচারবহির্ভূত হত্যাকাণ্ডে জড়িত নিরাপত্তা বাহিনীর সদস্যদের বিচার বিশেষ ট্রাইব্যুনালে প্রকাশ্যে হওয়া উচিত, বাহিনীর মনোবল যা-ই হোক।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 2,
    "bloc_weights": {
      "AL": -3.0,
      "BNP": 2.5,
      "JI": 2.5,
      "Student": 2.5,
      "Sushil": 2.5
    }
  },

  // --- Block 7: সংস্কার ও সংবিধান (State Reform & Constitution) ---
  {
    "id": "q23",
    "blockId": 7,
    "text": "ভারতের আপত্তির তোয়াক্কা না করে উত্তরবঙ্গের লাখ লাখ কৃষকের স্বার্থে তিস্তা মহাপরিকল্পনা চীনের অর্থায়ন ও কারিগরি সহায়তায় দ্রুত বাস্তবায়ন করা উচিত।",
    "direction": 1,
    "x_weight": -1,
    "y_weight": 1,
    "bloc_weights": {
      "AL": -2.0,
      "BNP": 2.0,
      "JI": 2.5,
      "Student": 2.5,
      "Sushil": 1.0
    }
  },
  {
    "id": "q33",
    "blockId": 7,
    "text": "জুলাই অভ্যুত্থানের অপরাধের সুরাহা ও দৃশ্যমান অনুশোচনা ছাড়া আওয়ামী লীগকে আসন্ন জাতীয় নির্বাচনে সরাসরি অংশ নিতে দেওয়া উচিত নয়।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 1,
    "bloc_weights": {
      "AL": -3.0,
      "BNP": 1.5,
      "JI": 2.5,
      "Student": 2.5,
      "Sushil": 0.5
    }
  },
  {
    "id": "q34",
    "blockId": 7,
    "text": "সংসদে ক্ষমতার একচ্ছত্র আধিপত্য রোধ করতে বাংলাদেশে উচ্চকক্ষ ও নিম্নকক্ষ বিশিষ্ট দ্বিকক্ষবিশিষ্ট সংসদীয় ব্যবস্থা প্রবর্তন করা উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 2,
    "bloc_weights": {
      "AL": -2.5,
      "BNP": 2.5,
      "JI": 1.5,
      "Student": 2.0,
      "Sushil": 2.0
    }
  },

  // --- Block 8: ন্যায়বিচার ও সমতা (Social Justice & Inclusion) ---
  {
    "id": "q15",
    "blockId": 8,
    "text": "বিশ্ববিদ্যালয় ও অন্যান্য শিক্ষাপ্রতিষ্ঠানে জাতীয় রাজনৈতিক দলের ব্যানারে ছাত্ররাজনীতি বন্ধ করে কেবল নিয়মিত ছাত্র সংসদ নির্বাচন চালু রাখা উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 1.5,
    "bloc_weights": {
      "AL": -2.0,
      "BNP": -1.5,
      "JI": -0.5,
      "Student": 2.5,
      "Sushil": 2.5
    }
  },
  {
    "id": "q27",
    "blockId": 8,
    "text": "গার্মেন্টস ও শিল্প শ্রমিকদের জীবনধারণের উপযোগী ন্যূনতম মজুরি এবং মালিকপক্ষের চাপমুক্ত স্বাধীন ট্রেড ইউনিয়ন গঠনের অধিকার আইনে বাধ্যতামূলক করা উচিত।",
    "direction": 1,
    "x_weight": -2.5,
    "y_weight": 1.5,
    "bloc_weights": {
      "AL": 0.5,
      "BNP": 0.5,
      "JI": 1.0,
      "Student": 2.5,
      "Sushil": 2.0
    }
  },
  {
    "id": "q39",
    "blockId": 8,
    "text": "ধর্মীয় ও ক্ষুদ্র নৃগোষ্ঠীর উপাসনালয় এবং সম্পত্তির ওপর সহিংসতা প্রতিরোধে আলাদা বিশেষ সুরক্ষা আইন ও দ্রুত বিচার সেল গঠন করা জরুরি।",
    "direction": 1,
    "x_weight": -1,
    "y_weight": 2,
    "bloc_weights": {
      "AL": 2.0,
      "BNP": 1.0,
      "JI": 0.5,
      "Student": 2.0,
      "Sushil": 2.5
    }
  }
];

export const ENGLISH_QUESTION_TEXTS = {
  q4: "The government should retain direct executive control over the appointment of university Vice-Chancellors and civil administration heads to ensure rapid policy implementation.",
  q6: "The absence of a formidable, viable opposition party in current politics severely undermines the accountability of the government.",
  q8: "A credible national election is impossible under an incumbent political party; a non-partisan caretaker government is indispensable.",
  q9: "Bangladesh should adopt Proportional Representation (PR) instead of First-Past-The-Post, ensuring smaller parties gain parliamentary seats proportional to their national vote share.",
  q10: "The Constitution of Bangladesh should limit an individual to a maximum of two terms as Prime Minister.",
  q11: "The decision of the Chief Justice and an independent Judicial Commission on judicial appointments should be final, without any veto power from the Law Ministry or Prime Minister.",
  q12: "In fostering morality among students and preventing corruption, making universal human values and practical ethics education mandatory is more effective than focusing solely on religious rituals and doctrines.",
  q13: "The state should enact laws guaranteeing equal inheritance rights for women, regardless of traditional or religious personal laws.",
  q14: "To prevent the misuse of faith and sectarian polarization, religion-based political parties should be strictly barred by the constitution.",
  q15: "Student politics under the banner of national political parties should be banned in universities and other educational institutions, allowing only regular and democratic student councils.",
  q17: "Unfair energy contracts that pay billions in 'capacity charges' to private and foreign power plants without electricity generation must be cancelled or renegotiated.",
  q18: "The state should guarantee minimum support prices for crops and heavily subsidize agricultural inputs, even if it widens the fiscal deficit.",
  q19: "State-owned factories that are running at a loss, such as jute and sugar mills, should be fully privatized.",
  q20: "The assets of chronic bank loan defaulters and money launderers should be seized immediately by the state without procedural delays.",
  q21: "Bangladesh must relentlessly demand the extradition of Sheikh Hasina for trial over the July killings, even if it strains diplomatic and trade relations with India.",
  q22: "To overcome dependence on a single regional neighbor, Bangladesh should diversify its strategic, economic, and defense partnerships with the US, the West, and China.",
  q23: "The government should expedite the Teesta River comprehensive project with Chinese funding for Northern farmers, without waiting for Indian clearance.",
  q25: "Unrestricted transit through Bangladeshi ports and territory should not be granted without reciprocal benefits, fair water-sharing treaties, and guaranteed revenue.",
  q26: "Draconian cyber security laws should be repealed; online dissent and critical journalism should never be criminalized under the guise of defamation or state security.",
  q27: "A living wage and the right to form independent trade unions without management intimidation must be legally mandated for RMG and industrial workers.",
  q32: "Security personnel implicated in enforced disappearances and extrajudicial killings must face public trial in special tribunals, regardless of institutional pushback.",
  q33: "The Awami League should be barred from contesting the upcoming national elections until comprehensive accountability for the July uprising is achieved.",
  q34: "To prevent monopoly of power in parliament, Bangladesh should introduce a bicameral legislature with an upper and a lower house.",
  q39: "Special legislation and dedicated fast-track judicial cells are urgently needed to protect the lives, lands, and worship places of religious and ethnic minorities."
};

export const ENGLISH_THEMATIC_BLOCKS = {
  1: { title: "State and Executive Power", subtitle: "State power and executive authority", leftPole: "Centralized executive control", rightPole: "Checks and balances / decentralization", leftShort: "Centralized", rightShort: "Balanced" },
  2: { title: "Democracy and Elections", subtitle: "Elections and democracy", leftPole: "Party influence and FPTP control", rightPole: "Neutral caretaker government & PR", leftShort: "Party rule", rightShort: "Neutral" },
  3: { title: "Secularism and Society", subtitle: "Religion, secularism, and ethics", leftPole: "Religious rules and state religion", rightPole: "Secularism and universal equality", leftShort: "Religious rule", rightShort: "Secularism" },
  4: { title: "Economy and Markets", subtitle: "Markets and distribution of resources", leftPole: "State ownership and agricultural subsidies", rightPole: "Open markets and privatization", leftShort: "Welfare", rightShort: "Free market" },
  5: { title: "Nationalism and Sovereignty", subtitle: "Nationalism and sovereignty", leftPole: "Strategic concessions and single-neighbor reliance", rightPole: "Uncompromising sovereignty & diversification", leftShort: "Compromise", rightShort: "Sovereignty" },
  6: { title: "Liberty and Human Rights", subtitle: "Civil liberties and human rights", leftPole: "Surveillance and security immunity", rightPole: "Unrestricted free speech & accountability", leftShort: "Strict control", rightShort: "Free speech" },
  7: { title: "Reform and the Constitution", subtitle: "Institutional reform and historical pluralism", leftPole: "Constitutional status quo", rightPole: "Radical transformation and lustration", leftShort: "Status quo", rightShort: "Reform" },
  8: { title: "Justice and Equality", subtitle: "Social justice and inclusive development", leftPole: "Status quo and employer dominance", rightPole: "Social equality, labor rights & minority safety", leftShort: "Order", rightShort: "Equality" }
};

export const AGE_BUCKETS = [
  '১৮-২৫ (তরুণ প্রজন্ম)',
  '২৬-৩৫ (যুবক ও কর্মজীবী)',
  '৩৬-৪৫ (মধ্যবয়সী)',
  '৪৬-৬০ (অভিজ্ঞ নাগরিক)',
  '৬০+ (জ্যেষ্ঠ নাগরিক)'
];

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

export const PROPOSAL_TITLE_IDEAS = [
  'পুলিশ প্রশাসনের বিকেন্দ্রীকরণ...',
  'সংবিধানে প্রধানমন্ত্রীর ক্ষমতা হ্রাস...',
  'সার্বজনীন স্বাস্থ্য বীমা...',
  'ডিপ্লোমা কোটা পুনর্বিবেচনা...',
  'জেলায় জেলায় হাওসিং প্রকল্প...'
];

// Wedge issues tracked individually on the national aggregate
export const TRACKED_WEDGE_ISSUES = [
  {
    questionId: 'q9',
    title: '"সংসদ নির্বাচনে একক সংখ্যাগরিষ্ঠতার (FPTP) বদলে আনুপাতিক প্রতিনিধিত্ব (PR) পদ্ধতি চালু করা উচিত, যাতে প্রাপ্ত ভোটের অনুপাতে সব দলের প্রতিনিধিত্ব থাকে।"'
  },
  {
    questionId: 'q10',
    title: '"এক ব্যক্তি যাতে আজীবন ক্ষমতার কেন্দ্রবিন্দু না হতে পারেন, সেজন্য সংবিধানে প্রধানমন্ত্রীর দায়িত্ব পালনের সর্বোচ্চ মেয়াদ দুইবার নির্ধারণ করা জরুরি।"'
  },
  {
    questionId: 'q13',
    title: '"পারিবারিক ও ধর্মীয় প্রথা যা-ই হোক না কেন, সম্পত্তিতে নারী ও পুরুষের সমান উত্তরাধিকার অধিকার নিশ্চিত করতে রাষ্ট্রীয় আইন প্রণয়ন করা উচিত।"'
  },
  {
    questionId: 'q19',
    title: '"প্রতি বছর জনগণের করের টাকায় লোকসান গোনা রাষ্ট্রায়ত্ত শিল্প ও কারখানাগুলো (যেমন পাটকল, চিনিকল) অবিলম্বে বেসরকারি খাতে ছেড়ে দেওয়া উচিত।"'
  },
  {
    questionId: 'q22',
    title: '"একটি একক আঞ্চলিক প্রতিবেশীর ওপর নির্ভরশীলতা কাটিয়ে উঠতে বাংলাদেশের উচিত যুক্তরাষ্ট্র, চীন ও পশ্চিমা বিশ্বের সাথে বহুমুখী কৌশলগত অংশীদারিত্ব গড়ে তোলা।"'
  },
  {
    questionId: 'q26',
    title: '"সাইবার নিরাপত্তা আইন বাতিল করা উচিত; ধর্ম বা রাষ্ট্রের অবমাননার অজুহাতে অনলাইনে ভিন্নমত দমন সম্পূর্ণ বন্ধ হওয়া উচিত।"'
  },
  {
    questionId: 'q33',
    title: '"জুলাই অভ্যুত্থানের অপরাধের সুরাহা ও দৃশ্যমান অনুশোচনা ছাড়া আওয়ামী লীগকে আসন্ন জাতীয় নির্বাচনে সরাসরি অংশ নিতে দেওয়া উচিত নয়।"'
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
    "label": "নিরপেক্ষ / পরিস্থিতিনির্ভর",
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
  "text": "ঐচ্ছিক: জাতীয় নির্বাচনে আপনি কোন রাজনৈতিক ধারাকে সবচেয়ে বেশি পছন্দ করেন?",
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
      "label": "আওয়ামী লীগ"
    },
    {
      "value": "Sushil",
      "label": "উদার সংবিধানবাদী সুশীল ধারা"
    },
    {
      "value": "Other",
      "label": "অন্য কোনো দল / স্বতন্ত্র"
    },
    {
      "value": "None",
      "label": "কোনো দলকে নয় / নির্দলীয়"
    },
    {
      "value": "Skip",
      "label": "বলতে চাই না"
    }
  ]
};

export const BLOC_PROFILES = {
  "Student": {
    "key": "Student",
    "name": "জাতীয় নাগরিক পার্টি",
    "shortName": "NCP",
    "englishName": "National Citizen Party (NCP)",
    "color": "#16A34A",
    "secondaryColor": "#15803D",
    "badge": "সততা, ঐক্য, প্রগতি ও শাপলা কলি",
    "iconLetter": "শাপলা কলি",
    "symbolEmoji": "🌸",
    "centroid": {
      "x": -57,
      "y": 10
    },
    "summaryHeadline": "আপনি জুলাই অভ্যুত্থানের চেতনা, সততা ও ঐক্যের ভিত্তিতে নতুন রাজনৈতিক বন্দোবস্ত এবং বৈষম্যহীন নতুন বাংলাদেশ প্রতিষ্ঠায় বিশ্বাসী।",
    "keyPillars": {
      "state": "ফ্যাসিবাদবিরোধী আপসহীন বিচার, নতুন সংবিধান রূপান্তর ও তরুণ প্রজন্মের নাগরিক শাসন",
      "market": "সিন্ডিকেট দমন, ব্যাংক লুটেরাদের সম্পত্তি বাজেয়াপ্ত ও শ্রমিক কল্যাণ",
      "liberty": "সততা, ঐক্য ও প্রগতি; মতপ্রকাশের পূর্ণ স্বাধীনতা ও বৈষম্যহীন সাম্য"
    },
    "shortDescription": "জুলাই বিপ্লবের চেতনা, সততা ও প্রগতি, তরুণ নেতৃত্ব ও শাপলা কলির বৈষম্যহীন নতুন বন্দোবস্ত।",
    "detailedDescription": "আপনার রাজনৈতিক চেতনা দাঁড়িয়ে আছে জুলাই গণ-অভ্যুত্থানের ঐতিহাসিক অর্জন ও নতুন রাজনৈতিক বন্দোবস্তের ওপর। আপনি বিশ্বাস করেন—পুরাতন সুবিধাবাদী রাজনৈতিক সংস্কৃতির অবসান ঘটিয়ে তরুণ নেতৃত্বের হাত ধরে সততা, নাগরিক ঐক্য এবং মৌলিক সাংবিধানিক রূপান্তরের মাধ্যমেই একটি বৈষম্যহীন ও সার্বভৌম বাংলাদেশ গড়ে তোলা সম্ভব।",
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
    "englishName": "Bangladesh Nationalist Party (BNP)",
    "color": "#3B82F6",
    "secondaryColor": "#2563EB",
    "badge": "গণতন্ত্র ও বাংলাদেশি জাতীয়তাবাদ",
    "iconLetter": "ধানের শীষ",
    "symbolEmoji": "🔵",
    "centroid": {
      "x": 31,
      "y": -16
    },
    "summaryHeadline": "আপনি ক্ষমতার একক কেন্দ্রীভবন ভেঙে বহুদলীয় সংসদীয় গণতন্ত্র, নিরপেক্ষ তত্ত্বাবধায়ক নির্বাচন ও দেশীয় মুক্তবাজার অর্থনীতির বিকাশে বিশ্বাসী।",
    "keyPillars": {
      "state": "প্রধানমন্ত্রীর একক ক্ষমতা হ্রাস, নির্দলীয় তত্ত্বাবধায়ক সরকার ও রাষ্ট্রীয় প্রতিষ্ঠানের ভারসাম্য",
      "market": "ব্যক্তিমালিকানাধীন উদ্যোগ, লোকসানি প্রতিষ্ঠান বিরাষ্ট্রীকরণ ও ব্যবসাবান্ধব করনীতি",
      "liberty": "বাংলাদেশি ভূখণ্ডভিত্তিক জাতীয় ঐক্য, ধর্মীয় অনুভূতির সম্মান এবং গণতান্ত্রিক অধিকার"
    },
    "shortDescription": "বহুদলীয় গণতন্ত্র, তত্ত্বাবধায়ক নির্বাচন, মুক্তবাজার অর্থনীতি ও বাংলাদেশি ভূখণ্ডভিত্তিক সার্বভৌমত্বে বিশ্বাসী।",
    "detailedDescription": "আপনার মূল অবস্থান হচ্ছে ক্ষমতার ভারসাম্য রক্ষা, গণতান্ত্রিক অধিকার পুনরুদ্ধার, দেশীয় মুক্তবাজার ব্যবসা-বাণিজ্যের প্রসার এবং বাংলাদেশি জাতীয়তাবাদী ভূ-রাজনৈতিক সার্বভৌমত্ব। আপনি মনে করেন রাষ্ট্রকে একক কর্তৃত্বের হাত থেকে মুক্ত করে জনগণের আস্থাভাজন তত্ত্বাবধায়ক ব্যবস্থার অধীনে জবাবদিহিতামূলক করা উচিত।",
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
    "englishName": "Bangladesh Jamaat-e-Islami",
    "color": "#8B5CF6",
    "secondaryColor": "#7C3AED",
    "badge": "ইসলামী মূল্যবোধ ও সামাজিক ন্যায়বিচার",
    "iconLetter": "দাঁড়িপাল্লা",
    "symbolEmoji": "🟣",
    "centroid": {
      "x": 1,
      "y": -14
    },
    "summaryHeadline": "আপনি রাষ্ট্র ও সমাজের প্রতিটি ক্ষেত্রে ধর্মীয় অনুশাসন, সামাজিক নৈতিক মূল্যবোধ এবং শোষণহীন সুদমুক্ত ইনসাফ কায়েমে প্রতিশ্রুতিবদ্ধ।",
    "keyPillars": {
      "state": "আইন ও নীতি প্রণয়নে ইসলামী অনুশাসন কার্যকর করা, আনুপাতিক প্রতিনিধিত্ব ও স্বকীয়তা সংরক্ষণ",
      "market": "সুদমুক্ত অর্থব্যবস্থা, যাকাতভিত্তিক পুনর্বণ্টন ও প্রান্তিক জনগোষ্ঠীর কল্যাণ",
      "liberty": "পারিবারিক ঐতিহ্য ও ধর্মীয় মূল্যবোধ অক্ষুণ্ণ রাখা এবং আধিপত্যবাদের প্রতিরোধ"
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
    "englishName": "Civil Society (Sushil)",
    "color": "#06B6D4",
    "secondaryColor": "#0891B2",
    "badge": "আইনের শাসন ও প্রাতিষ্ঠানিক স্বকীয়তা",
    "iconLetter": "কলম / সংবিধান",
    "symbolEmoji": "⚪",
    "centroid": {
      "x": 22,
      "y": 51
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
    "englishName": "Awami League",
    "color": "#10B981",
    "secondaryColor": "#059669",
    "badge": "উন্নয়ন ও রাষ্ট্রীয় ধারাবাহিকতা",
    "iconLetter": "নৌকা",
    "symbolEmoji": "🟢",
    "centroid": {
      "x": -6,
      "y": 16
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
    "description": "আপনি অর্থনৈতিক সমতা, সামাজিক ন্যায়বিচার এবং নাগরিক স্বাধীনতার পক্ষে। আপনি রাষ্ট্রীয় ক্ষমতার বিকেন্দ্রীকরণ ও প্রান্তিক মানুষের অধিকার সমর্থন করেন।"
  },
  "libertarian_right": {
    "key": "libertarian_right",
    "name": "স্বাধীনতাবাদী ডান (Libertarian Right)",
    "title": "স্বাধীনতাবাদী ডান (Libertarian Right)",
    "badgeColor": "#3B82F6",
    "color": "#3B82F6",
    "description": "আপনি মুক্তবাজার অর্থনীতি, ব্যক্তিমালিকানা এবং ব্যক্তিগত নাগরিক স্বাধীনতার পক্ষে। আপনি মনে করেন রাষ্ট্রীয় হস্তক্ষেপ ন্যূনতম হওয়া উচিত।"
  },
  "authoritarian_left": {
    "key": "authoritarian_left",
    "name": "রাষ্ট্রনিয়ন্ত্রিত ও সমতাভিত্তিক (Statist Left)",
    "title": "রাষ্ট্রনিয়ন্ত্রিত ও সমতাভিত্তিক (Statist Left)",
    "badgeColor": "#EF4444",
    "color": "#EF4444",
    "description": "আপনি রাষ্ট্রের প্রত্যক্ষ ভূমিকার মাধ্যমে অর্থনৈতিক সমতা ও গণকল্যাণ নিশ্চিত করার পক্ষে। আপনি মনে করেন জনস্বার্থে শক্তিশালী কেন্দ্রীয় নিয়ন্ত্রণ প্রয়োজন।"
  },
  "authoritarian_right": {
    "key": "authoritarian_right",
    "name": "ঐতিহ্যবাদী ও মুক্তবাজার (Traditionalist Right)",
    "title": "ঐতিহ্যবাদী ও মুক্তবাজার (Traditionalist Right)",
    "badgeColor": "#F59E0B",
    "color": "#F59E0B",
    "description": "আপনি সামাজিক ঐতিহ্য, শৃঙ্খলা এবং শক্তিশালী রাষ্ট্রীয় কাঠামোর পক্ষে। পাশাপাশি আপনি মুক্তবাজার অর্থনীতি, ব্যক্তিমালিকানা এবং ব্যবসা-বান্ধব পরিবেশ সমর্থন করেন।"
  },
  "centrist": {
    "key": "centrist",
    "name": "মধ্যপন্থী (Centrist)",
    "title": "মধ্যপন্থী (Centrist)",
    "badgeColor": "#94A3B8",
    "color": "#94A3B8",
    "description": "আপনি রাজনৈতিক ও অর্থনৈতিক নীতিতে একটি ভারসাম্যপূর্ণ বাস্তবসম্মত অবস্থান পছন্দ করেন। চরমপন্থার বদলে আপনি নীতিগত ভারসাম্য খোঁজেন।"
  }
};
