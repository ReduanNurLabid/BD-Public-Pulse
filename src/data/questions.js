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
    "leftPole": "শক্তিশালী কেন্দ্রীয় নির্বাহী",
    "rightPole": "ক্ষমতার ভারসাম্য ও বিকেন্দ্রীকরণ",
    "leftShort": "শক্তিশালী কেন্দ্র",
    "rightShort": "ক্ষমতার ভাগাভাগি"
  },
  {
    "id": 2,
    "key": "democracy",
    "title": "গণতন্ত্র ও নির্বাচনব্যবস্থা",
    "subtitle": "নির্বাচন ব্যবস্থা ও গণতন্ত্র",
    "icon": "Vote",
    "questionRange": [4, 6],
    "leftPole": "নির্বাচিত সরকারের অধীনে নির্বাচন ও বিদ্যমান পদ্ধতি",
    "rightPole": "নির্দলীয় তত্ত্বাবধায়ক ও আনুপাতিক প্রতিনিধিত্ব",
    "leftShort": "নির্বাচিত সরকারের অধীনে",
    "rightShort": "নির্দলীয় তদারকিতে"
  },
  {
    "id": 3,
    "key": "religion_society",
    "title": "ধর্মনিরপেক্ষতা ও সমাজ",
    "subtitle": "ধর্ম, ধর্মনিরপেক্ষতা ও নৈতিকতা",
    "icon": "Scale",
    "questionRange": [7, 9],
    "leftPole": "রাষ্ট্র ও আইনে ধর্মীয় মূল্যবোধের প্রাধান্য",
    "rightPole": "ধর্মনিরপেক্ষতা ও সর্বজনীন সমতা",
    "leftShort": "ধর্মীয় মূল্যবোধে রাষ্ট্র",
    "rightShort": "ধর্মনিরপেক্ষ রাষ্ট্র"
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
    "leftShort": "রাষ্ট্রীয় কল্যাণ",
    "rightShort": "মুক্তবাজার"
  },
  {
    "id": 5,
    "key": "sovereignty",
    "title": "জাতীয়তাবাদ ও সার্বভৌমত্ব",
    "subtitle": "জাতীয়তাবাদ ও সার্বভৌমত্ব",
    "icon": "Globe",
    "questionRange": [13, 15],
    "leftPole": "প্রতিবেশীর সাথে সমঝোতা ও ঘনিষ্ঠ সম্পর্ক",
    "rightPole": "কঠোর দর-কষাকষি ও বহুমুখী পররাষ্ট্রনীতি",
    "leftShort": "সমঝোতার কূটনীতি",
    "rightShort": "কঠোর সার্বভৌম অবস্থান"
  },
  {
    "id": 6,
    "key": "civil_liberties",
    "title": "স্বাধীনতা ও মানবাধিকার",
    "subtitle": "নাগরিক স্বাধীনতা ও মানবাধিকার",
    "icon": "UserCheck",
    "questionRange": [16, 18],
    "leftPole": "আইনশৃঙ্খলা ও রাষ্ট্রীয় নিরাপত্তার অগ্রাধিকার",
    "rightPole": "বাকস্বাধীনতা ও আইনি প্রক্রিয়ার সুরক্ষা",
    "leftShort": "নিরাপত্তা আগে",
    "rightShort": "স্বাধীনতা আগে"
  },
  {
    "id": 7,
    "key": "state_reform",
    "title": "সংস্কার ও সংবিধান",
    "subtitle": "প্রাতিষ্ঠানিক সংস্কার ও সাংবিধানিক রূপান্তর",
    "icon": "FileText",
    "questionRange": [19, 21],
    "leftPole": "বিদ্যমান সংবিধানে ধাপে ধাপে সংশোধন",
    "rightPole": "রাষ্ট্রকাঠামোর আমূল সংস্কার",
    "leftShort": "ধাপে ধাপে সংশোধন",
    "rightShort": "আমূল সংস্কার"
  },
  {
    "id": 8,
    "key": "social_justice",
    "title": "ন্যায়বিচার ও সমতা",
    "subtitle": "সামাজিক ন্যায়বিচার ও অন্তর্ভুক্তিমূলক উন্নয়ন",
    "icon": "HeartHandshake",
    "questionRange": [22, 24],
    "leftPole": "বাজার, প্রতিযোগিতা ও মেধার অগ্রাধিকার",
    "rightPole": "সামাজিক সমতা, শ্রমিক অধিকার ও সংখ্যালঘু সুরক্ষা",
    "leftShort": "বাজার ও মেধা",
    "rightShort": "সামাজিক সুরক্ষা"
  }
];

export const QUESTION_SET_VERSION = 'qset-2026-11-v5';

export const QUESTIONS = [
  // --- Block 1: State power ---
  {
    "id": "c1",
    "blockId": 1,
    "tier": 1,
    "text": "কেন্দ্রীয় ব্যাংকের গভর্নর, দুদক ও নির্বাচন কমিশনের প্রধান নিয়োগে বিরোধী দলের সম্মতি বাধ্যতামূলক হওয়া উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 0.5,
    "bloc_weights": {
      "AL": -1,
      "BNP": -2,
      "JI": 2.5,
      "Student": 2.5,
      "Sushil": 2
    }
  },
  {
    "id": "c2",
    "blockId": 1,
    "tier": 1,
    "text": "দুই-তৃতীয়াংশ আসন পাওয়া সরকারের সংবিধান সংশোধনে বিরোধী দলের সম্মতি লাগা উচিত নয়।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -0.5,
    "bloc_weights": {
      "AL": 1.5,
      "BNP": 2.5,
      "JI": -2.5,
      "Student": -2.5,
      "Sushil": -1.5
    }
  },
  {
    "id": "c33",
    "blockId": 1,
    "tier": 2,
    "text": "ক্যাম্পাসে দলীয় ছাত্র রাজনীতি নিষিদ্ধ করা উচিত, শুধু নির্বাচিত ছাত্র সংসদ থাকবে।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 0.5,
    "bloc_weights": {
      "AL": -2,
      "BNP": -2,
      "JI": -1.5,
      "Student": 2,
      "Sushil": 2
    }
  },
  {
    "id": "c34",
    "blockId": 1,
    "tier": 3,
    "text": "উপজেলা পরিষদের কাজে স্থানীয় এমপির কোনো ভূমিকা থাকা উচিত নয়।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 0.5,
    "bloc_weights": {
      "AL": -1.5,
      "BNP": -1.5,
      "JI": 1.5,
      "Student": 2,
      "Sushil": 2
    }
  },
  // --- Block 2: Democracy & elections ---
  {
    "id": "c5",
    "blockId": 2,
    "tier": 1,
    "text": "বিরোধী দলের সংসদ বর্জন ভুল; দাবি যা-ই হোক, সংসদে থেকেই লড়াই করা উচিত।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -0.5,
    "bloc_weights": {
      "AL": 0.5,
      "BNP": 2.5,
      "JI": -2.5,
      "Student": -2,
      "Sushil": 0.5
    }
  },
  {
    "id": "c36",
    "blockId": 2,
    "tier": 3,
    "kind": "sentiment",
    "text": "আওয়ামী লীগকে বাইরে রেখে হওয়া ২০২৬ সালের নির্বাচন জনগণের প্রকৃত রায় নয়।",
    "x_weight": 0,
    "y_weight": 0,
    "bloc_weights": {
      "AL": 3,
      "BNP": -3,
      "JI": -2,
      "Student": -2,
      "Sushil": 0
    }
  },
  {
    "id": "c44",
    "blockId": 2,
    "tier": 2,
    "kind": "sentiment",
    "text": "বর্তমান সরকারের অধীনে বিরোধী দলের রাজনীতি করার পূর্ণ স্বাধীনতা আছে।",
    "x_weight": 0,
    "y_weight": 0,
    "bloc_weights": {
      "AL": -3,
      "BNP": 3,
      "JI": -1.5,
      "Student": -2,
      "Sushil": -1
    }
  },
  {
    "id": "c35",
    "blockId": 2,
    "tier": 1,
    "kind": "sentiment",
    "text": "আওয়ামী লীগকে দল হিসেবে রাজনীতি করতে দেওয়া উচিত; তবে যাঁরা অপরাধে জড়িত, তাঁদের আলাদাভাবে বিচার হতে হবে।",
    "x_weight": 0,
    "y_weight": 0,
    "bloc_weights": {
      "AL": 3,
      "BNP": 0,
      "JI": -2.5,
      "Student": -3,
      "Sushil": 1.5
    }
  },
  // --- Block 3: Religion & society ---
  {
    "id": "c37",
    "blockId": 3,
    "tier": 1,
    "text": "ধর্মভিত্তিক রাজনীতি নিষিদ্ধ করা উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 2.5,
    "bloc_weights": {
      "AL": 2.5,
      "BNP": 0,
      "JI": -3,
      "Student": -0.5,
      "Sushil": 2
    }
  },
  {
    "id": "c10",
    "blockId": 3,
    "tier": 1,
    "text": "এলাকার আলেমরা আপত্তি করলে বাউল গান, মেলা বা মাজারের অনুষ্ঠান বন্ধ করে দেওয়া প্রশাসনের দায়িত্ব।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -3,
    "bloc_weights": {
      "AL": -1.5,
      "BNP": -0.5,
      "JI": 2,
      "Student": -0.5,
      "Sushil": -2.5
    }
  },
  {
    "id": "c11",
    "blockId": 3,
    "tier": 2,
    "text": "বাবা-মায়ের সম্পত্তিতে ছেলে ও মেয়ের সমান ভাগ পাওয়ার আইন করা উচিত, ধর্ম যা-ই হোক।",
    "direction": 1,
    "x_weight": -0.5,
    "y_weight": 2.5,
    "bloc_weights": {
      "AL": 0.5,
      "BNP": -1.5,
      "JI": -3,
      "Student": -0.5,
      "Sushil": 2.5
    }
  },
  {
    "id": "c12",
    "blockId": 3,
    "tier": 3,
    "text": "স্কুলে ধর্মশিক্ষা বাধ্যতামূলক থাকা উচিত।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -2.5,
    "bloc_weights": {
      "AL": 0.5,
      "BNP": 1.5,
      "JI": 3,
      "Student": 0.5,
      "Sushil": -2
    }
  },
  // --- Block 4: Economy ---
  {
    "id": "c13",
    "blockId": 4,
    "tier": 1,
    "text": "ফ্যামিলি কার্ডের মতো নগদ সহায়তার চেয়ে সেই টাকা কর্মসংস্থান তৈরিতে খরচ করা বেশি জরুরি।",
    "direction": 1,
    "x_weight": 0.5,
    "y_weight": 0,
    "bloc_weights": {
      "AL": 0.5,
      "BNP": -2.5,
      "JI": 1,
      "Student": 1,
      "Sushil": 1.5
    }
  },
  {
    "id": "c14",
    "blockId": 4,
    "tier": 1,
    "text": "চাল, ডাল, ডিম, পেঁয়াজের মতো নিত্যপণ্যের দাম সরকারের বেঁধে দেওয়া উচিত।",
    "direction": -1,
    "x_weight": -1,
    "y_weight": -0.5,
    "bloc_weights": {
      "AL": 0.5,
      "BNP": 0.5,
      "JI": 1.5,
      "Student": 1.5,
      "Sushil": -1.5
    }
  },
  {
    "id": "c15",
    "blockId": 4,
    "tier": 2,
    "text": "বিদ্যুৎ ও জ্বালানিতে ভর্তুকি কমিয়ে দাম বাড়ানো উচিত, যাতে সেই টাকা শিক্ষা আর স্বাস্থ্যে খরচ হয়।",
    "direction": 1,
    "x_weight": 2,
    "y_weight": 0,
    "bloc_weights": {
      "AL": 0.5,
      "BNP": -0.5,
      "JI": -1.5,
      "Student": -1,
      "Sushil": 1.5
    }
  },
  {
    "id": "c16",
    "blockId": 4,
    "tier": 3,
    "text": "কষ্ট হলেও আইএমএফের শর্ত মেনে ঋণ নেওয়া বন্ধ করা উচিত।",
    "direction": -1,
    "x_weight": -1,
    "y_weight": 0,
    "bloc_weights": {
      "AL": -0.5,
      "BNP": -1.5,
      "JI": 1.5,
      "Student": 1,
      "Sushil": -2
    }
  },
  // --- Block 5: Sovereignty ---
  {
    "id": "c17",
    "blockId": 5,
    "tier": 1,
    "text": "গঙ্গার পানির নিশ্চিত হিস্যার গ্যারান্টি না পেলে ভারতের সাথে নতুন চুক্তি সই করা উচিত নয়, আলোচনা আটকে গেলেও।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 0,
    "bloc_weights": {
      "AL": -2.5,
      "BNP": 1.5,
      "JI": 2.5,
      "Student": 2.5,
      "Sushil": 0.5
    }
  },
  {
    "id": "c43",
    "blockId": 5,
    "tier": 1,
    "kind": "sentiment",
    "text": "জিয়াউর রহমানই স্বাধীনতার প্রকৃত ঘোষক।",
    "x_weight": 0,
    "y_weight": 0,
    "bloc_weights": {
      "AL": -3,
      "BNP": 3,
      "JI": 1.5,
      "Student": 0,
      "Sushil": -0.5
    }
  },
  {
    "id": "c18",
    "blockId": 5,
    "tier": 2,
    "text": "বাণিজ্য আর চিকিৎসা-ভিসার স্বার্থে ভারতের সাথে সম্পর্ক দ্রুত স্বাভাবিক করা উচিত।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -0.5,
    "bloc_weights": {
      "AL": 2.5,
      "BNP": 0,
      "JI": -2,
      "Student": -2,
      "Sushil": 1
    }
  },
  {
    "id": "c38",
    "blockId": 5,
    "tier": 3,
    "kind": "sentiment",
    "text": "মুক্তিযুদ্ধে বিরোধিতার কারণে জামায়াতে ইসলামীকে রাজনীতিতে নিষিদ্ধ করা উচিত।",
    "x_weight": 0,
    "y_weight": 0,
    "bloc_weights": {
      "AL": 3,
      "BNP": -0.5,
      "JI": -3,
      "Student": -0.5,
      "Sushil": 0.5
    }
  },
  // --- Block 6: Civil liberties ---
  {
    "id": "c39",
    "blockId": 6,
    "tier": 1,
    "text": "উসকানিমূলক বা মিথ্যা পোস্টের জন্য সাইবার আইনে গ্রেপ্তারের ক্ষমতা সরকারের থাকা উচিত।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -2,
    "bloc_weights": {
      "AL": 1.5,
      "BNP": 0.5,
      "JI": 0,
      "Student": -2,
      "Sushil": -2.5
    }
  },
  {
    "id": "c46",
    "blockId": 6,
    "tier": 1,
    "text": "গুম ও বিচারবহির্ভূত হত্যা ঠেকাতে বিশেষ এলিট বাহিনী বিলুপ্ত করে সাধারণ পুলিশকেই অপরাধ দমনের দায়িত্ব দেওয়া উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 2,
    "bloc_weights": {
      "AL": -2,
      "BNP": -1.5,
      "JI": 2,
      "Student": 2.5,
      "Sushil": 2
    }
  },
  {
    "id": "c40",
    "blockId": 6,
    "tier": 2,
    "kind": "sentiment",
    "text": "২০২৪ সালের জুলাই আন্দোলনের পেছনে বিদেশি শক্তির বড় ভূমিকা ছিল।",
    "x_weight": 0,
    "y_weight": 0,
    "bloc_weights": {
      "AL": 3,
      "BNP": -2.5,
      "JI": -3,
      "Student": -3,
      "Sushil": -1.5
    }
  },
  {
    "id": "c24",
    "blockId": 6,
    "tier": 3,
    "text": "ধর্মীয় অনুভূতিতে আঘাত দেয় এমন পোস্ট দিলে সঙ্গে সঙ্গে গ্রেপ্তার করা উচিত।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -2.5,
    "bloc_weights": {
      "AL": 0.5,
      "BNP": 1,
      "JI": 2.5,
      "Student": 0,
      "Sushil": -2
    }
  },
  // --- Block 7: Reform & constitution ---
  {
    "id": "c25",
    "blockId": 7,
    "tier": 1,
    "text": "গণভোটে পাস হওয়া জুলাই সনদ হুবহু বাস্তবায়ন করতে হবে — সংসদের কমিটি তা বদলাতে পারবে না।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 0.5,
    "bloc_weights": {
      "AL": -1,
      "BNP": -2.5,
      "JI": 2.5,
      "Student": 3,
      "Sushil": 1.5
    }
  },
  {
    "id": "c26",
    "blockId": 7,
    "tier": 2,
    "text": "একজন নেতা যতবার নির্বাচিত হন, ততবার প্রধানমন্ত্রী হতে পারবেন; মেয়াদের কোনো সীমা থাকা উচিত নয়।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -0.5,
    "bloc_weights": {
      "AL": 2,
      "BNP": 0,
      "JI": -2,
      "Student": -2.5,
      "Sushil": -2.5
    }
  },
  {
    "id": "c41",
    "blockId": 7,
    "tier": 1,
    "kind": "sentiment",
    "text": "শেখ মুজিবুর রহমানই একমাত্র জাতির পিতা।",
    "x_weight": 0,
    "y_weight": 0,
    "bloc_weights": {
      "AL": 3,
      "BNP": -2.5,
      "JI": -2.5,
      "Student": -2,
      "Sushil": 0
    }
  },
  {
    "id": "c28",
    "blockId": 7,
    "tier": 3,
    "text": "নতুন সংবিধান লেখার দরকার নেই; বর্তমান সংবিধানে প্রয়োজনীয় সংশোধন করলেই যথেষ্ট।",
    "direction": -1,
    "x_weight": 0,
    "y_weight": -0.5,
    "bloc_weights": {
      "AL": 2,
      "BNP": 2,
      "JI": -0.5,
      "Student": -3,
      "Sushil": 0
    }
  },
  // --- Block 8: Social justice ---
  {
    "id": "c29",
    "blockId": 8,
    "tier": 1,
    "text": "পোশাকশ্রমিকের ন্যূনতম মজুরি এমন হওয়া উচিত যাতে একটা পরিবার চলে, তাতে কিছু কারখানা বন্ধ হলেও।",
    "direction": 1,
    "x_weight": -2.5,
    "y_weight": 0.5,
    "bloc_weights": {
      "AL": -0.5,
      "BNP": -0.5,
      "JI": 1,
      "Student": 2,
      "Sushil": 1
    }
  },
  {
    "id": "c45",
    "blockId": 8,
    "tier": 1,
    "text": "মৃত্যুদণ্ড পুরোপুরি বাতিল করা উচিত।",
    "direction": 1,
    "x_weight": 0,
    "y_weight": 1.5,
    "bloc_weights": {
      "AL": 1,
      "BNP": -1,
      "JI": -2.5,
      "Student": -1.5,
      "Sushil": 1
    }
  },
  {
    "id": "c42",
    "blockId": 8,
    "tier": 2,
    "text": "আদিবাসীদের সাংবিধানিক স্বীকৃতি দেওয়া উচিত।",
    "direction": 1,
    "x_weight": -0.5,
    "y_weight": 1.5,
    "bloc_weights": {
      "AL": 0,
      "BNP": -0.5,
      "JI": -2,
      "Student": 0.5,
      "Sushil": 2
    }
  },
  {
    "id": "c32",
    "blockId": 8,
    "tier": 3,
    "text": "সরকারি চাকরিতে নারী, প্রতিবন্ধী বা পিছিয়ে পড়া এলাকার জন্যও কোটা থাকা উচিত নয়; নিয়োগ হবে শুধু মেধায়।",
    "direction": -1,
    "x_weight": 1,
    "y_weight": 0,
    "bloc_weights": {
      "AL": -1,
      "BNP": 0.5,
      "JI": 1,
      "Student": 0.5,
      "Sushil": -1.5
    }
  }
];

// Quiz lengths. Every length covers all 8 topics: short asks 2 per topic,
// medium 3, long 4. Medium is the default.
export const QUIZ_LENGTHS = {
  short: { key: 'short', maxTier: 1, minutes: 2 },
  medium: { key: 'medium', maxTier: 2, minutes: 4 },
  long: { key: 'long', maxTier: 3, minutes: 6 }
};
export const DEFAULT_QUIZ_LENGTH = 'medium';

export function getQuestionsForLength(length = DEFAULT_QUIZ_LENGTH) {
  const maxTier = (QUIZ_LENGTHS[length] || QUIZ_LENGTHS[DEFAULT_QUIZ_LENGTH]).maxTier;
  return QUESTIONS.filter((q) => (q.tier || 1) <= maxTier);
}

// The shortest length that contains every given question id (used when a
// caller does not say which length was taken).
export function inferQuizLength(questionIds = []) {
  const ids = new Set(questionIds);
  const maxTier = QUESTIONS.reduce((m, q) => (ids.has(q.id) ? Math.max(m, q.tier || 1) : m), 1);
  return Object.values(QUIZ_LENGTHS).find((l) => l.maxTier >= maxTier)?.key || 'long';
}

export const ENGLISH_QUESTION_TEXTS = {
  c1: "Appointing the central bank governor and the heads of the Anti-Corruption Commission and Election Commission should require the opposition's consent.",
  c2: "A government with a two-thirds majority should not need the opposition's consent to amend the constitution.",
  c33: "Party-affiliated student politics should be banned on campus; only elected student unions should remain.",
  c34: "Local MPs should have no role in the work of upazila councils.",
  c5: "Opposition walkouts from parliament are wrong. Whatever the demand, they should fight from inside parliament.",
  c36: "The 2026 election, held without the Awami League, was not a true verdict of the people.",
  c44: "Under the current government, the opposition has full freedom to do politics.",
  c35: "The Awami League should be allowed to do politics as a party, while those involved in crimes are tried individually.",
  c37: "Religion-based politics should be banned.",
  c10: "If local clerics object, the administration should shut down Baul music events, fairs or shrine festivals.",
  c11: "There should be a law giving sons and daughters equal shares of their parents' property, whatever their religion.",
  c12: "Religious education should stay compulsory in schools.",
  c13: "Spending the money on creating jobs matters more than cash support like the Family Card.",
  c14: "The government should fix the prices of everyday essentials like rice, lentils, eggs and onions.",
  c15: "Electricity and fuel subsidies should be cut and prices raised, so the money goes to education and health.",
  c16: "Even if it hurts, Bangladesh should stop taking IMF loans that come with conditions.",
  c17: "Without a guaranteed share of Ganges water, Bangladesh should not sign a new treaty with India, even if talks stall.",
  c18: "For trade and medical visas, relations with India should be normalised quickly.",
  c43: "Ziaur Rahman is the true declarer of independence.",
  c39: "The government should have the power to arrest people under cyber law for provocative or false posts.",
  c46: "To prevent enforced disappearances and extrajudicial killings, special elite forces should be abolished and crime-fighting left to the regular police.",
  c40: "Foreign powers played a major role behind the July 2024 movement.",
  c24: "Anyone who posts something that hurts religious sentiment should be arrested immediately.",
  c25: "The July Charter approved in the referendum must be implemented exactly as passed. A parliamentary committee cannot change it.",
  c26: "A leader should be able to serve as prime minister as many times as they are elected; there should be no term limit.",
  c41: "Sheikh Mujibur Rahman alone is the Father of the Nation.",
  c28: "There is no need to write a new constitution. Amending the current one where needed is enough.",
  c29: "The minimum wage for garment workers should be enough to support a family, even if some factories close.",
  c45: "The death penalty should be abolished completely.",
  c42: "Indigenous peoples should be given constitutional recognition.",
  c32: "Government jobs should have no quotas at all, not even for women, people with disabilities or lagging regions. Hiring on merit alone.",
  c38: "Jamaat-e-Islami should be banned from politics for opposing the Liberation War.",
};

export const ENGLISH_THEMATIC_BLOCKS = {
  1: { title: "State and Executive Power", subtitle: "State power and executive authority", leftPole: "Centralized executive control", rightPole: "Checks and balances / decentralization", leftShort: "Strong centre", rightShort: "Shared power" },
  2: { title: "Democracy and Elections", subtitle: "Elections and democracy", leftPole: "Party influence and FPTP control", rightPole: "Neutral caretaker government & PR", leftShort: "Elected government", rightShort: "Non-partisan oversight" },
  3: { title: "Secularism and Society", subtitle: "Religion, secularism, and ethics", leftPole: "Religious rules and state religion", rightPole: "Secularism and universal equality", leftShort: "Faith-guided state", rightShort: "Secular state" },
  4: { title: "Economy and Markets", subtitle: "Markets and distribution of resources", leftPole: "State ownership and agricultural subsidies", rightPole: "Open markets and privatization", leftShort: "State welfare", rightShort: "Free market" },
  5: { title: "Nationalism and Sovereignty", subtitle: "Nationalism and sovereignty", leftPole: "Accommodation and close ties with neighbours", rightPole: "Hard bargaining and diversified partners", leftShort: "Accommodating diplomacy", rightShort: "Hard-line sovereignty" },
  6: { title: "Liberty and Human Rights", subtitle: "Civil liberties and human rights", leftPole: "Law, order and state security first", rightPole: "Free speech and due process", leftShort: "Security first", rightShort: "Liberty first" },
  7: { title: "Reform and the Constitution", subtitle: "Institutional reform and historical pluralism", leftPole: "Gradual amendment of the constitution", rightPole: "Sweeping structural reform", leftShort: "Gradual amendment", rightShort: "Sweeping reform" },
  8: { title: "Justice and Equality", subtitle: "Social justice and inclusive development", leftPole: "Markets, competition and merit first", rightPole: "Social equality, labor rights & minority safety", leftShort: "Market & merit", rightShort: "Social protection" }
};

export const AGE_BUCKETS = [
  '১৮-২৫ (তরুণ প্রজন্ম)',
  '২৬-৩৫ (যুবক ও কর্মজীবী)',
  '৩৬-৪৫ (মধ্যবয়সী)',
  '৪৬-৬০ (অভিজ্ঞ নাগরিক)',
  '৬০+ (জ্যেষ্ঠ নাগরিক)'
];

// AGE_BUCKETS values are stored in responses and used as aggregate keys, so
// they must never change. Show this shorter label instead.
export const ageBucketLabel = (bucket) => String(bucket || '').replace(/\s*\(.*\)\s*$/, '').replace('-', '–');

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
  'সর্বজনীন স্বাস্থ্য বীমা...',
  'ডিপ্লোমা কোটা পুনর্বিবেচনা...',
  'জেলায় জেলায় হাউজিং প্রকল্প...'
];

// Wedge issues tracked individually on the national aggregate
export const TRACKED_WEDGE_ISSUES = [
  {
    questionId: 'c25',
    title: "\"গণভোটে পাস হওয়া জুলাই সনদ হুবহু বাস্তবায়ন করতে হবে — সংসদের কমিটি তা বদলাতে পারবে না।\""
  },
  {
    questionId: 'c17',
    title: "\"গঙ্গার পানির নিশ্চিত হিস্যার গ্যারান্টি না পেলে ভারতের সাথে নতুন চুক্তি সই করা উচিত নয়, আলোচনা আটকে গেলেও।\""
  },
  {
    questionId: 'c13',
    title: "\"ফ্যামিলি কার্ডের মতো নগদ সহায়তার চেয়ে সেই টাকা কর্মসংস্থান তৈরিতে খরচ করা বেশি জরুরি।\""
  },
  {
    questionId: 'c46',
    title: "\"গুম ও বিচারবহির্ভূত হত্যা ঠেকাতে বিশেষ এলিট বাহিনী বিলুপ্ত করে সাধারণ পুলিশকেই অপরাধ দমনের দায়িত্ব দেওয়া উচিত।\""
  }
];

export const TRACKED_WEDGE_ISSUE_IDS = TRACKED_WEDGE_ISSUES.map(i => i.questionId);

// Likert answers are 1..5. Agree = 4/5, Neutral = 3, Disagree = 1/2.
export const LIKERT_MIN = 1;
export const LIKERT_MAX = 5;

export const LIKERT_OPTIONS = [
  {
    "value": 1,
    "label": "একদমই না",
    "shortLabel": "পুরো দ্বিমত",
    "multiplier": -2,
    "color": "#EF4444"
  },
  {
    "value": 2,
    "label": "কিছুটা দ্বিমত",
    "shortLabel": "দ্বিমত",
    "multiplier": -1,
    "color": "#F87171"
  },
  {
    "value": 3,
    "label": "নিশ্চিত নই",
    "shortLabel": "নিরপেক্ষ",
    "multiplier": 0,
    "color": "#94A3B8"
  },
  {
    "value": 4,
    "label": "কিছুটা একমত",
    "shortLabel": "একমত",
    "multiplier": 1,
    "color": "#34D399"
  },
  {
    "value": 5,
    "label": "পুরোপুরি একমত",
    "shortLabel": "পুরো একমত",
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
      "label": "নির্দলীয় সুশাসনপন্থী ধারা"
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
    "badge": "তরুণ নেতৃত্ব ও রাষ্ট্র সংস্কার",
    "iconLetter": "শাপলা কলি",
    "symbolEmoji": "🌸",
    "centroid": {
      "x": -57,
      "y": 10
    },
    "summaryHeadline": "আপনি পুরোনো রাজনৈতিক ধারার বদলে তরুণ নেতৃত্বে রাষ্ট্রের মৌলিক সংস্কার এবং কম বৈষম্যের বাংলাদেশ চান।",
    "keyPillars": {
      "state": "অতীতের রাষ্ট্রীয় নিপীড়নের বিচার, সংবিধানে মৌলিক সংস্কার ও তরুণ নেতৃত্ব",
      "market": "বাজার সিন্ডিকেট ভাঙা, খেলাপি ঋণ ও অর্থপাচারে কঠোরতা এবং শ্রমিক কল্যাণ",
      "liberty": "সততা, ঐক্য ও প্রগতি; মতপ্রকাশের পূর্ণ স্বাধীনতা ও বৈষম্যহীন সাম্য"
    },
    "shortDescription": "জুলাই অভ্যুত্থান-পরবর্তী রাষ্ট্র সংস্কার, তরুণ নেতৃত্ব এবং বৈষম্য কমানোর রাজনীতিতে আস্থাশীল।",
    "detailedDescription": "আপনার রাজনৈতিক ভাবনা ২০২৪-এর জুলাই অভ্যুত্থান-পরবর্তী সংস্কারের দাবিকে ঘিরে। আপনি মনে করেন, পুরোনো দলীয় রাজনীতির বাইরে তরুণ নেতৃত্ব, সততা ও সংবিধানের মৌলিক পরিবর্তনের মাধ্যমে একটি বৈষম্যহীন ও সার্বভৌম বাংলাদেশ গড়া সম্ভব।",
    "coreValues": [
      "তরুণ নেতৃত্ব",
      "সততা, ঐক্য ও প্রগতি",
      "রাষ্ট্র সংস্কার",
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
    "name": "জামায়াতে ইসলামী",
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
    "name": "নির্দলীয় সুশাসনপন্থী",
    "shortName": "সুশাসনপন্থী",
    "englishName": "Non-partisan good governance",
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
    "name": "সংস্কারের সৈনিক",
    "title": "সংস্কারের সৈনিক",
    "nameEn": "Reform Soldier",
    "tagline": "গণভোটের রায় হুবহু কার্যকর করতে হবে।",
    "taglineEn": "The referendum’s verdict must be carried out in full.",
    "badgeColor": "#10B981",
    "color": "#10B981",
    "description": "আপনি অর্থনৈতিক সমতা, সামাজিক ন্যায়বিচার এবং নাগরিক স্বাধীনতার পক্ষে। আপনি রাষ্ট্রীয় ক্ষমতার বিকেন্দ্রীকরণ ও প্রান্তিক মানুষের অধিকার সমর্থন করেন।"
  },
  "libertarian_right": {
    "key": "libertarian_right",
    "name": "স্বাধীন নাগরিক",
    "title": "স্বাধীন নাগরিক",
    "nameEn": "Free Citizen",
    "tagline": "উদ্যোগ আর মতপ্রকাশ, দুটোই মুক্ত থাকুক।",
    "taglineEn": "Keep both enterprise and speech free.",
    "badgeColor": "#3B82F6",
    "color": "#3B82F6",
    "description": "আপনি মুক্তবাজার অর্থনীতি, ব্যক্তিমালিকানা এবং ব্যক্তিগত নাগরিক স্বাধীনতার পক্ষে। আপনি মনে করেন রাষ্ট্রীয় হস্তক্ষেপ ন্যূনতম হওয়া উচিত।"
  },
  "authoritarian_left": {
    "key": "authoritarian_left",
    "name": "জনস্বার্থের প্রহরী",
    "title": "জনস্বার্থের প্রহরী",
    "nameEn": "People’s Guardian",
    "tagline": "বাজারের আগে মানুষের স্বার্থ।",
    "taglineEn": "People’s interests before the market.",
    "badgeColor": "#EF4444",
    "color": "#EF4444",
    "description": "আপনি রাষ্ট্রের প্রত্যক্ষ ভূমিকার মাধ্যমে অর্থনৈতিক সমতা ও গণকল্যাণ নিশ্চিত করার পক্ষে। আপনি মনে করেন জনস্বার্থে শক্তিশালী কেন্দ্রীয় নিয়ন্ত্রণ প্রয়োজন।"
  },
  "authoritarian_right": {
    "key": "authoritarian_right",
    "name": "আইনের পাহারাদার",
    "title": "আইনের পাহারাদার",
    "nameEn": "Law Guardian",
    "tagline": "আইনশৃঙ্খলা ছাড়া কোনো অগ্রগতি টেকে না।",
    "taglineEn": "No progress lasts without law and order.",
    "badgeColor": "#F59E0B",
    "color": "#F59E0B",
    "description": "আপনি সামাজিক ঐতিহ্য, শৃঙ্খলা এবং শক্তিশালী রাষ্ট্রীয় কাঠামোর পক্ষে। পাশাপাশি আপনি মুক্তবাজার অর্থনীতি, ব্যক্তিমালিকানা এবং ব্যবসা-বান্ধব পরিবেশ সমর্থন করেন।"
  },
  "centrist": {
    "key": "centrist",
    "name": "নিরপেক্ষ বিচারক",
    "title": "নিরপেক্ষ বিচারক",
    "nameEn": "Impartial Judge",
    "tagline": "দুই পক্ষ শুনে তবেই সিদ্ধান্ত।",
    "taglineEn": "I decide only after hearing both sides.",
    "badgeColor": "#94A3B8",
    "color": "#94A3B8",
    "description": "আপনি রাজনৈতিক ও অর্থনৈতিক নীতিতে একটি ভারসাম্যপূর্ণ বাস্তবসম্মত অবস্থান পছন্দ করেন। চরমপন্থার বদলে আপনি নীতিগত ভারসাম্য খোঁজেন।"
  }
};

// Alternate names inside a compass area. A name like "সংস্কারের সৈনিক" makes a
// claim the card prints beside the person's own verdicts, so an answer that
// contradicts it switches the name. The camp-defining questions on the Father
// of the Nation and the declarer of independence also give AL-leaning and
// BNP-leaning people in the same area names of their own. First match wins.
const MUJIB_HEIR = {
  requires: { questionId: 'c41', when: 'agree' },
  name: 'মুক্তিযুদ্ধের উত্তরসূরি',
  nameEn: 'Liberation Heir',
  tagline: 'মুক্তিযুদ্ধের চেতনাই রাষ্ট্রের ভিত্তি।',
  taglineEn: 'The spirit of 1971 is the nation’s foundation.'
};
const PATRIOT_NATIONALIST = {
  requires: { questionId: 'c43', when: 'agree' },
  name: 'দেশপ্রেমিক জাতীয়তাবাদী',
  nameEn: 'Patriotic Nationalist',
  tagline: 'সবার আগে বাংলাদেশ।',
  taglineEn: 'Bangladesh comes first.'
};
const IDENTITY_ALTERNATES = {
  libertarian_left: [{
    requires: { questionId: 'c25', minScore: 3 },
    name: 'রাজপথের কণ্ঠ',
    nameEn: 'Street Voice',
    tagline: 'ভিন্নমত দমন করে দেশ চলে না।',
    taglineEn: 'Silencing dissent is no way to run a country.'
  }],
  authoritarian_left: [MUJIB_HEIR],
  authoritarian_right: [MUJIB_HEIR, PATRIOT_NATIONALIST]
};

export function getIdentity(quadrantKey, scoreOf) {
  const base = QUADRANT_PROFILES[quadrantKey] || QUADRANT_PROFILES.centrist;
  const source = (IDENTITY_ALTERNATES[quadrantKey] || []).find((alternate) => {
    const score = scoreOf(alternate.requires.questionId);
    if (score === undefined) return false;
    return alternate.requires.when === 'agree' ? score >= 4 : score < alternate.requires.minScore;
  }) || base;
  return {
    name: source.name,
    nameEn: source.nameEn,
    tagline: source.tagline,
    taglineEn: source.taglineEn
  };
}

// Live issues that can appear on the share card. All are in the short quiz, so
// every length has them. In priority order. Religion questions are left off on
// purpose: a public verdict on them could put the person sharing at risk.
export const CARD_ISSUES = [
  { id: 'c25', agreeBn: 'সনদ হুবহু বাস্তবায়ন চাই', disagreeBn: 'সনদে সংশোধন প্রয়োজন', agreeEn: 'Implement the Charter in full', disagreeEn: 'The Charter needs amending', topicBn: 'জুলাই সনদ', topicEn: 'July Charter' },
  { id: 'c17', agreeBn: 'গ্যারান্টি ছাড়া গঙ্গা চুক্তি নয়', disagreeBn: 'আগে গঙ্গা চুক্তি নবায়ন হোক', agreeEn: 'No Ganges deal without a guarantee', disagreeEn: 'Renew the Ganges deal first', topicBn: 'গঙ্গা চুক্তি', topicEn: 'Ganges deal' },
  { id: 'c13', agreeBn: 'নগদ সহায়তার আগে কর্মসংস্থান', disagreeBn: 'ফ্যামিলি কার্ড চালু থাকুক', agreeEn: 'Jobs before cash support', disagreeEn: 'Keep the Family Card', topicBn: 'ফ্যামিলি কার্ড', topicEn: 'Family Card' },
  { id: 'c14', agreeBn: 'নিত্যপণ্যের দাম বেঁধে দেওয়া হোক', disagreeBn: 'দাম নির্ধারণে সরকার নয়, বাজার', agreeEn: 'Fix essential food prices', disagreeEn: 'Let the market set prices', topicBn: 'বাজারদর', topicEn: 'Food prices' },
  { id: 'c1', agreeBn: 'বড় নিয়োগে বিরোধী দলের সম্মতি', disagreeBn: 'নিয়োগের দায়িত্ব সরকারের', agreeEn: 'Opposition consent on top posts', disagreeEn: 'Appointments are the government’s job', topicBn: 'বড় নিয়োগ', topicEn: 'Top appointments' },
  { id: 'c39', agreeBn: 'মিথ্যা পোস্টে গ্রেপ্তারের ক্ষমতা থাকুক', disagreeBn: 'পোস্টের জন্য গ্রেপ্তার নয়', agreeEn: 'Arrest powers for false posts', disagreeEn: 'No arrests for posts', topicBn: 'বাকস্বাধীনতা', topicEn: 'Free speech' },
  { id: 'c29', agreeBn: 'আগে শ্রমিকের ন্যায্য মজুরি', disagreeBn: 'আগে কারখানা টিকিয়ে রাখা', agreeEn: 'Fair wages first', disagreeEn: 'Keep factories running first', topicBn: 'শ্রমিকের মজুরি', topicEn: 'Workers\' wages' },
  { id: 'c5', agreeBn: 'সংসদে থেকেই বিরোধিতা', disagreeBn: 'প্রতিবাদে সংসদ বর্জন যৌক্তিক', agreeEn: 'Oppose from inside parliament', disagreeEn: 'Walkouts are a fair protest', topicBn: 'সংসদ বর্জন', topicEn: 'Parliament walkouts' },
  { id: 'c26', agreeBn: 'মেয়াদ নয়, ভোটারই শেষ কথা', disagreeBn: 'প্রধানমন্ত্রীর মেয়াদের সীমা চাই', agreeEn: 'Voters decide, not term limits', disagreeEn: 'Term limits for prime ministers', topicBn: 'মেয়াদের সীমা', topicEn: 'Term limits' },
  { id: 'c18', agreeBn: 'ভারতের সাথে সম্পর্ক স্বাভাবিক হোক', disagreeBn: 'আগে সমতা, পরে সম্পর্ক', agreeEn: 'Normalise relations with India', disagreeEn: 'Equality first, then relations', topicBn: 'ভারত সম্পর্ক', topicEn: 'India relations' }
];

