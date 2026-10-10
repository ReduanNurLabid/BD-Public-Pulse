import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Calculator,
  Landmark,
  Lock,
  HelpCircle,
  FileText,
  ChevronDown,
  Download,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Layers,
  Database,
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import { THEMATIC_BLOCKS, BLOC_PROFILES, QUESTIONS, QUADRANT_PROFILES, QUESTION_SET_VERSION } from '../data/questions';
import BlocLogo from './BlocLogo';
import darkLogo from '../assets/dark mode logo.svg';
import lightLogo from '../assets/light mode logo.svg';

const MODEL_VERSION = 'v4-2026-10';
const PARAMS = {
  noMatchBelow: 52,
  closeCallMargin: 6,
  mixedNeutralShare: 60,
  centreRadius: 16,
  affinityCurve: 1.35,
  affinityMin: 8,
  affinityMax: 96,
  leanThreshold: 10,
  minAnswers: 16,
  straightLinePct: 90,
  minSeconds: 35,
  radialWeight: 0.8
};

const SECTION_IDS = ['mm-overview', 'mm-score', 'mm-match', 'mm-privacy', 'mm-faq', 'mm-open'];
const SECTION_ICONS = [Sparkles, Calculator, Landmark, Lock, HelpCircle, FileText];

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
const toBn = (v) => String(v).replace(/\d/g, (d) => BN_DIGITS[d]);
const MINUS = '\u2212';

const COPY = {
  bn: {
    badge: 'উন্মুক্ত গবেষণা পদ্ধতি',
    title: 'পদ্ধতি ও গাণিতিক কাঠামো',
    subtitle: 'পুরো পদ্ধতি সহজ ভাষায়। প্রাথমিক ৪০টি প্রশ্ন থেকে নিবিড়ভাবে নির্বাচিত ২৪টি নীতিগত প্রশ্ন, নিরপেক্ষ স্কোরিং সূত্র এবং প্রতিটি প্রশ্নের ওজন এখানে উন্মুক্ত।',
    nav: ['সারসংক্ষেপ', 'স্কোরিং পদ্ধতি', 'দলের সঙ্গে মিল', 'তথ্য ও নিরাপত্তা', 'প্রশ্নোত্তর', 'উন্মুক্ত সূত্র ও CSV'],
    startTest: 'মূল্যায়ন শুরু করুন',
    goBack: 'নীড়ে ফিরে যান',

    overviewTitle: 'ত্রিশ সেকেন্ডে বুঝে নিন',
    steps: [
      { h: 'আপনি ২৪টি নীতিগত বিবৃতির সঙ্গে একমত বা দ্বিমত জানান', b: 'প্রতিটি বিবৃতিতে দুটি বৈধ মূল্যবোধের মধ্যে টানাপোড়েন আছে। কোনো উত্তরই সঠিক বা ভুল নয়।' },
      { h: 'প্রতিটি উত্তর আপনার অবস্থানকে সুনির্দিষ্ট অক্ষে সরায়', b: 'একমত বা দ্বিমতের মাত্রা যত জোরালো, সরানোর জোর তত বেশি। “নিরপেক্ষ” উত্তর অবস্থান অপরিবর্তিত রাখে।' },
      { h: 'শেষে দুটি মূল অক্ষে আপনার অবস্থান নির্ণয় হয়', b: 'একটি অক্ষ অর্থনীতির (রাষ্ট্র বনাম বাজার), অন্যটি শাসনের (নিয়ন্ত্রণ বনাম স্বাধীনতা)।' },
      { h: 'তারপর শুরু হয় রাজনৈতিক ও ঐতিহাসিক তুলনা', b: 'আপনার উত্তর কোন রাজনৈতিক ধারার অনুমিত উত্তরের সঙ্গে বেশি মেলে এবং কোন নেতা ও রাষ্ট্রের মডেল আপনার সবচেয়ে কাছে, তা হিসাব করা হয়।' }
    ],
    isTitle: 'এই ফলাফল যা প্রকাশ করে',
    isItems: [
      '২৪টি সুনির্দিষ্ট নীতিগত প্রশ্নে আপনার উত্তরের বস্তুনিষ্ঠ সারসংক্ষেপ',
      'এই গবেষণার ৫টি রেফারেন্স প্রোফাইলের সঙ্গে আপনার অবস্থানের তুলনামূলক চিত্র',
      'রাষ্ট্র ও সমাজ পরিচালনায় দুটি বিপরীত মূল্যবোধের ভারসাম্য নিয়ে ভাবার একটি আয়না'
    ],
    isNotTitle: 'এই ফলাফল যা নয়',
    isNotItems: [
      'কোনো রাজনৈতিক দলের সদস্যপদ বা অন্ধ সমর্থনের প্রমাণপত্র নয়',
      'নির্বাচনের পূর্বাভাস বা জনমত জরিপের আনুষ্ঠানিক রায় নয়',
      'আপনার সামগ্রিক রাজনৈতিক ব্যক্তিত্বের ওপর কোনো চূড়ান্ত লেবেল নয়'
    ],
    independent: 'এটি সম্পূর্ণ স্বাধীন ও নির্দলীয় নাগরিক-গবেষণা উদ্যোগ। কোনো রাজনৈতিক দল বা গোষ্ঠীর সঙ্গে এর কোনো আর্থিক বা সাংগঠনিক সম্পর্ক নেই।',

    scoreTitle: 'আপনার উত্তর কীভাবে স্কোর হয়',
    scoreIntro: 'প্রতিটি বিবৃতির পাশে ৫টি বিকল্প থাকে। প্রতিটি বিকল্পের একটি সুনির্দিষ্ট গাণিতিক “ধাক্কা” (Push Multiplier) আছে:',
    scale: ['দৃঢ়ভাবে একমত', 'একমত', 'নিরপেক্ষ', 'দ্বিমত', 'দৃঢ়ভাবে দ্বিমত'],
    scaleHelp: '+২ মানে দ্বিগুণ শক্তিতে সরানো, ০ মানে কোনো পরিবর্তন নেই।',
    directionNote: 'ধাক্কা কোন দিকে যাবে, তা নির্ভর করে প্রশ্নটি কোন আদর্শের দিকে রচিত তার ওপর। একই “একমত” উত্তর কোনো প্রশ্নে মুক্তবাজারের দিকে আবার কোনো প্রশ্নে রাষ্ট্রীয় কল্যাণের দিকে সরায়। পক্ষপাতহীনতা বজায় রাখতে প্রশ্নগুলো ইচ্ছাকৃতভাবে বিপরীতমুখী করে সাজানো।',
    tryTitle: 'একটি আসল প্রশ্নে পরীক্ষা করে দেখুন',
    tryHint: 'যেকোনো একটি উত্তর নির্বাচন করে দেখুন স্থানাঙ্কে কতটা পরিবর্তন হয়:',
    tryPush: 'ধাক্কা',
    tryWeight: 'এই প্রশ্নের ওজন',
    tryRight: 'অর্থনীতির অক্ষে মুক্তবাজারের দিকে',
    tryLeft: 'অর্থনীতির অক্ষে রাষ্ট্রীয় নিয়ন্ত্রণের দিকে',
    tryNone: 'কোনো পরিবর্তন নেই',
    tryUnit: 'পয়েন্ট',
    normalise: 'সব ধাক্কা যোগ করে সংশ্লিষ্ট অক্ষের সর্বোচ্চ সম্ভাব্য ধাক্কা দিয়ে ভাগ করা হয়। ফলে প্রতিটি অক্ষের স্কোর {neg} থেকে +১০০-এর মধ্যে পরিমাপ করা হয়। ±১০০ পেতে হলে প্রতিটি প্রশ্নে সর্বোচ্চ শক্তিতে একই দিকে ভোট দিতে হয়; তাই সিংহভাগ সচেতন নাগরিকের অবস্থান মধ্যবর্তী পরিমণ্ডলে আসে। এটি স্বাভাবিক এবং ভারসাম্যপূর্ণ নাগরিক চিন্তার পরিচায়ক।',
    axesTitle: 'কম্পাসের দুটি মূল অক্ষ',
    axisX: 'অর্থনৈতিক অক্ষ (Horizontal)',
    axisXLeft: 'রাষ্ট্র-নিয়ন্ত্রিত অর্থনীতি, পুনর্বণ্টন ও মেগা প্রকল্প',
    axisXRight: 'উন্মুক্ত মুক্তবাজার, ব্যক্তিমালিকানা ও পুঁজিবাদী প্রবৃদ্ধি',
    axisY: 'শাসনব্যবস্থার অক্ষ (Vertical)',
    axisYTop: 'আইনের শাসন, প্রাতিষ্ঠানিক বিকেন্দ্রীকরণ ও বাকস্বাধীনতা',
    axisYBottom: 'শক্তিশালী কেন্দ্রীয় নিয়ন্ত্রণ, নির্বাহী কর্তৃত্ব ও কঠোর নজরদারি',
    centreNote: 'কেন্দ্রবিন্দু থেকে {r} পয়েন্টের মধ্যে অবস্থানকে “মধ্যপন্থী” (Centrist) বিবেচনা করা হয়।',
    compassMid: 'মধ্যপন্থী',
    topicsTitle: 'আটটি নীতিগত বিষয়ের বার',
    topicsBody: 'কম্পাসের পাশাপাশি ফলাফল ৮টি পৃথক নীতিগত বিষয়ের ওপর আপনার সুস্পষ্ট অবস্থান তুলে ধরে। প্রতিটি বার দুই বিপরীত মেরুর মধ্যে {neg} থেকে +১০০ পর্যন্ত বিস্তৃত। ±{lean}-এর ভেতরের অবস্থানকে “ভারসাম্যপূর্ণ” ধরা হয়।',
    notCountTitle: 'স্কোরিং ও প্রশ্ন বিন্যাস',
    notCount: [
      'নিরপেক্ষ (৩) বা বাদ দেওয়া উত্তর গণনায় ০ হয়, অর্থাৎ স্থানাঙ্ককে কোনো দিকেই সরায় না।',
      'প্রাথমিক ৪০টি প্রশ্ন থেকে গবেষণার মাধ্যমে বাছাইকৃত এই ২৪টি নীতিগত প্রশ্নের সবগুলোই সরাসরি কম্পাস অক্ষ এবং ৮টি থিম্যাটিক ব্লকের ফলাফল তৈরিতে ভূমিকা রাখে।'
    ],

    matchTitle: 'রাজনৈতিক ধারার সঙ্গে সাদৃশ্য নির্ধারণ',
    matchBody: 'প্রতিটি ধারার জন্য আমাদের একাডেমিক মডেলে পূর্বনির্ধারিত রয়েছে—উক্ত ধারার একজন আদর্শ সমর্থক প্রতিটি নীতিগত প্রশ্নে কী অবস্থান নেবেন। আপনার উত্তরের সঙ্গে ওই ব্লকের ধারণাগত দূরত্বের ভিত্তিতে মিলের শতকরা হার হিসাব করা হয়।',
    matchWarn: 'এই ব্লকের প্রত্যাশিত উত্তরগুলো আমাদের নিজস্ব একাডেমিক ও সম্পাদকীয় মূল্যায়ন। এগুলো দলগুলোর দাপ্তরিক ঘোষণাপত্র নয়। সূত্র অংশের টেবিলে প্রতিটি ব্লকের ওজন সবার জন্য উন্মুক্ত রয়েছে।',
    blocsTitle: 'তুলনার ৫টি রাজনৈতিক ও বুদ্ধিবৃত্তিক ধারা',
    blocsOrder: 'ইংরেজি নামের বর্ণানুক্রমে উপস্থাপিত',
    nonParty: 'বুদ্ধিবৃত্তিক দৃষ্টিভঙ্গি',
    party: 'রাজনৈতিক দলীয় ধারা',
    pctTitle: 'শতাংশের প্রকৃত অর্থ',
    pctBody: [
      'এটি আপনার উত্তরের সাথে মতাদর্শিক সাদৃশ্যের তুলনামূলক সূচক, কোনো সম্ভাবনা (Probability) নয়। ৮০% মানে আপনি ৮০% ভোটার নন, বরং আপনার চিন্তার ৮০% উপাদান এই ধারার সাথে মিলেছে।',
      'চরম শূন্যবাদ এড়াতে স্কোর সর্বদা {min}% থেকে {max}%-এর মধ্যে সমন্বিত থাকে।'
    ],
    typesTitle: 'চার ধরণের সম্ভাব্য ফলাফল',
    types: [
      { h: 'স্পষ্ট মিল', b: 'শীর্ষ ধারার স্কোর {noMatch}% বা তার বেশি।' },
      { h: 'কাছাকাছি দুটি ধারা', b: 'শীর্ষ দুটি ধারার মধ্যে ব্যবধান {margin} পয়েন্টের কম (Close Call)।' },
      { h: 'স্পষ্ট মিল নেই', b: 'কোনো ধারার সঙ্গেই স্কোর {noMatch}%-এ পৌঁছায়নি (No Clear Match)।' },
      { h: 'মিশ্র বা অমীমাংসিত', b: '{mixed}% বা তার বেশি উত্তর নিরপেক্ষ বা বাদ রাখা হয়েছে।' }
    ],
    leadersTitle: 'ঐতিহাসিক ব্যক্তিত্ব ও রাষ্ট্রীয় মডেল',
    leadersBody: 'আপনার কম্পাস স্থানাঙ্ককে বাংলাদেশ, দক্ষিণ এশিয়া ও আন্তর্জাতিক ইতিহাসের ২৩ জন স্মরণীয় ব্যক্তিত্বের মতাদর্শিক স্থানাঙ্কের সাথে মিলিয়ে দেখা হয়। প্রথমে আপনার দিক (কোণ) এবং পরে তীব্রতা পরিমাপ করা হয়। একই সাথে আপনার চতুর্ভাগের ওপর ভিত্তি করে একটি তুলনামূলক রাষ্ট্রীয় মডেল প্রদর্শিত হয়।',
    leadersWarn: 'ব্যক্তিত্বদের স্থানাঙ্ক নির্ধারণ একটি গবেষণামূলক রূপরেখা। এটি কোনো ব্যক্তিত্বের রাজনৈতিক সমর্থন বা সমালোচনা নয়, বরং নাগরিক পর্যালোচনার সহায়ক।',

    privacyTitle: 'তথ্য নিরাপত্তা ও কঠোর মানদণ্ড',
    privacyCards: [
      { h: 'কোনো ব্যক্তিগত তথ্য সংগ্রহ নেই', b: 'জরিপে কোনো লগইন বা সাইন-আপ নেই। আপনার নাম, মোবাইল নম্বর, ইমেইল বা পরিচয়পত্র কখনো চাওয়া হয় না।' },
      { h: 'অজ্ঞাতনামা ব্রাউজার সেশন', b: 'পাবলিক ড্যাশবোর্ডে একই ডিভাইসের পুনরাবৃত্তি ঠেকাতে একটি ক্রিপ্টোগ্রাফিক সেশন আইডি ব্যবহৃত হয়, যার সাথে ব্যবহারকারীকে শনাক্ত করার কোনো উপায় নেই।' },
      { h: 'একমুখী সমন্বিত তথ্য সংরক্ষণ', b: 'কোনো একক ব্যবহারকারীর খণ্ডকালীন উত্তর ডাটাবেস থেকে পৃথকভাবে পড়া বা প্রদর্শন করা যায় না। কেবল সার্বিক সমষ্টিগত পরিসংখ্যান দৃশ্যমান থাকে।' },
      { h: 'স্বয়ংক্রিয় স্প্যাম ও তাড়াহুড়ো ফিল্টার', b: '{sec} সেকেন্ডের কম সময়ে তাড়াহুড়ো করে দেওয়া বা প্রায় সব প্রশ্নে একই অপশন নির্বাচন করা উত্তর পাবলিক পরিসংখ্যান থেকে বাদ দেওয়া হয়।' }
    ],
    limitsTitle: 'জরিপের সীমাবদ্ধতা',
    limits: [
      'স্বেচ্ছায় অংশগ্রহণকারী নাগরিকগণ সমগ্র দেশের প্রতিনিধিত্বশীল নমুনা (Representative Sample) নন।',
      'প্রশ্নের ভাষা নির্ধারণে সর্বোচ্চ ভারসাম্য বজায় রাখা হয়েছে, তবে সম্পূর্ণ ত্রুটিমুক্ত নিরপেক্ষতা দাবি করা হয় না।',
      'অতএব এই পরিসংখ্যানকে রাজনৈতিক চিন্তার একটি প্রবণতা হিসেবে দেখুন, আনুষ্ঠানিক নির্বাচনী জরিপ বা ফলাফল হিসেবে নয়।'
    ],

    faqTitle: 'সাধারণ জিজ্ঞাসা (FAQ)',
    faq: [
      { q: 'এটা কি কোনো পরীক্ষা? সঠিক বা ভুল উত্তর আছে কি?', a: 'না, এটি কোনো পরীক্ষা নয়। এখানে প্রতিটি প্রশ্নে দুটি সমান গুরুত্বপূর্ণ মূল্যবোধের দ্বন্দ্ব দেখানো হয়েছে। আপনার বিবেক যা সমর্থন করে, সেটাই আপনার সঠিক উত্তর।' },
      { q: 'উভয় পক্ষের যুক্তিই যুক্তিসঙ্গত মনে হলে কী করব?', a: 'যেদিকের যুক্তির প্রতি আপনি সামান্য হলেও বেশি ঝুঁকে আছেন, সেদিকে “একমত” বা “দ্বিমত” বেছে নিন। একান্তই দোলাচলে থাকলে “নিরপেক্ষ” দিতে পারেন, তবে অতিরিক্ত নিরপেক্ষ দিলে ফলাফল “মিশ্র” দেখাবে।' },
      { q: 'ফলাফলে কোনো দলের নাম এলে আমি কি তাদের সমর্থক?', a: 'একদমই না। এটি শুধু ২৪টি প্রশ্নে আপনার পছন্দের সাথে তাদের ঐতিহ্যগত অবস্থানের তুলনামূলক মিল দেখায়। দলীয় আনুগত্য মানুষের সার্বিক রাজনৈতিক চরিত্রের ক্ষুদ্র অংশমাত্র।' },
      { q: 'আমার কম্পাস অবস্থান মাঝখানে আসে কেন?', a: 'দুই অক্ষের যেকোনো দিকে ১০০ স্কোর পেতে হলে সংশ্লিষ্ট সবকটি প্রশ্নে চরম অবস্থান নিতে হয়। ভারসাম্যপূর্ণ ও বাস্তববাদী চিন্তাশীল নাগরিকরা সাধারণত কেন্দ্রের কাছাকাছি অবস্থান করেন।' },
      { q: 'আমার ফলাফল কি সুরক্ষিত?', a: 'সম্পূর্ণ সুরক্ষিত। কোনো লগইন নেই, কোনো ট্র্যাকিং নেই। আপনার ব্যক্তিগত তথ্যের কোনো রেকর্ড কোথাও সংরক্ষিত হয় না।' }
    ],

    openTitle: 'উন্মুক্ত সূত্র ও গবেষণার ডেটাসেট',
    openIntro: 'গবেষক, সাংবাদিক ও সচেতন নাগরিকদের যাচাইয়ের জন্য পুরো গাণিতিক মডেল, ফিল্টারিং নিয়ম এবং ২৪টি প্রশ্নের প্রতিটি ওজন নিচে উন্মুক্ত করা হলো। মডেল সংস্করণ:',
    formulaSummary: 'গাণিতিক সূত্র ও ধাপসমূহ',
    formulaSteps: [
      { h: '১. উত্তর রূপান্তর গুণাঙ্ক (Multiplier)', b: 'গুণাঙ্ক m = উত্তর − ৩ (অর্থাৎ −২ থেকে +২)। নিরপেক্ষ উত্তর বা বাদ দিলে m = ০।' },
      { h: '২. কম্পাস স্থানাঙ্ক (Coordinates)', b: 'X = ১০০ × Σ(m × x_weight) ÷ Σ(২ × |x_weight|)। একইভাবে Y স্থানাঙ্ক y_weight দিয়ে নির্ধারিত।' },
      { h: '৩. চতুর্ভাগ ও মধ্যপন্থী অঞ্চল', b: 'কেন্দ্র থেকে ইউক্লিডীয় দূরত্ব √(X² + Y²) ≤ {r} হলে “মধ্যপন্থী” (Centrist); অন্যথায় চিহ্নের ওপর ভিত্তি করে ৪টি চতুর্ভাগে বিভক্ত।' },
      { h: '৪. ৮টি থিম্যাটিক বার', b: 'বার স্কোর = ১০০ × Σ(m × direction × weight) ÷ Σ(২ × weight)। যেখানে direction +১ হলে ডানে এবং −১ হলে বামের মেরুতে গতিশীল করে।' },
      { h: '৫. রাজনৈতিক ধারার সাদৃশ্য (Affinities)', b: 'কাঁচা স্কোর = Σ(m × bloc_weight)। স্বাভাবিকীকরণ f = (কাঁচা − সর্বনিম্ন) ÷ (সর্বোচ্চ − সর্বনিম্ন)। চূড়ান্ত স্কোর = f^{curve} × ১০০, যা {min}% থেকে {max}%-এ সীমাবদ্ধ।' },
      { h: '৬. নেতা ও মডেল মিল', b: 'কেন্দ্রের বাইরে দিক ও দূরত্বের কোণ বিবেচনায় নৈকট্য হিসাব করা হয়। দূরত্বের ভিত্তিতে মিল ৩০% থেকে ৯৯%-এর মধ্যে প্রদর্শিত হয়।' }
    ],
    tableSummary: '২৪টি নীতিগত প্রশ্নের আদর্শিক ম্যাট্রিক্স',
    tableIntro: 'নিচের টেবিলে ২৪টি প্রশ্নের X/Y প্রভাব, অভিমুখ এবং ৫টি প্রধান রাজনৈতিক ব্লকের জন্য নির্ধারিত আদর্শিক ওজন প্রদর্শিত হলো। গবেষকদের ব্যবহারের সুবিধার্থে পুরো ডেটাসেট CSV হিসেবে ডাউনলোড করার সুবিধা রাখা হয়েছে।',
    tableHead: { serial: 'ক্রম', id: 'আইডি', block: 'নীতিগত ক্ষেত্র', statement: 'বিবৃতি', x: 'X অক্ষ', y: 'Y অক্ষ', dir: 'অভিমুখ' },
    downloadCsv: '২৪টি প্রশ্নের CSV ডাউনলোড করুন',
    downloadCount: '২৪টি নীতিগত প্রশ্ন অন্তর্ভুক্ত',
    shortBloc: { AL: 'আ.লীগ', BNP: 'বিএনপি', JI: 'জামায়াত', Student: 'NCP', Sushil: 'সুশীল' },
    csvName: 'bd-political-compass-24q-weights.csv'
  },

  en: {
    badge: 'Open Methodology',
    title: 'Methodology & Scoring Architecture',
    subtitle: 'Explore the research methodology, scoring algorithms, and data architecture behind Bangladesh Open Public Opinion Survey 2026. Understand how your responses are mapped across 24 policy dimensions and compared with historical and contemporary political viewpoints.',
    nav: ['Overview', 'Scoring Model', 'Bloc Alignment', 'Data & Privacy', 'FAQ', 'Formulas & CSV'],
    startTest: 'Take the survey',
    goBack: 'Back to Home',

    overviewTitle: 'The 30-Second Summary',
    steps: [
      { h: 'You react to 24 core policy statements', b: 'Each statement presents a real trade-off between two legitimate values. There are no right or wrong answers.' },
      { h: 'Each answer applies a weighted mathematical nudge', b: 'The stronger your agreement, the larger the displacement. Neutral answers leave your coordinates unchanged.' },
      { h: 'Your position plots on two foundational axes', b: 'One axis is Economic (State-led vs Market-driven), the other is Governance (Centralised control vs Liberty).' },
      { h: 'Comparative insights with blocs & history', b: 'Your profile is compared against expected positions of 5 reference viewpoints, plus 23 historical figures and comparative governance models.' }
    ],
    isTitle: 'What your result represents',
    isItems: [
      'An objective mapping of where your answers land across 24 core national debates',
      'A comparative benchmark against the 5 philosophical profiles in this study',
      'A structured tool to reflect on personal priorities and constitutional governance'
    ],
    isNotTitle: 'What your result is NOT',
    isNotItems: [
      'Not a certificate of party membership or endorsement of any political party',
      'Not an election forecast or representative public polling declaration',
      'Not a rigid or final label on your political identity'
    ],
    independent: 'This is an independent, non-partisan civic research initiative. It operates without funding or direction from any political party.',

    scoreTitle: 'How answers become coordinates',
    scoreIntro: 'Each statement offers 5 Likert options. Each choice carries a defined mathematical push multiplier (m):',
    scale: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
    scaleHelp: '+2 delivers twice the force of +1. Zero leaves coordinates unchanged.',
    directionNote: 'Whether a push moves toward the state or market depends on statement phrasing. The statements are intentionally counterbalanced to prevent acquiescence bias.',
    tryTitle: 'Interactive demonstration with real data',
    tryHint: 'Pick an option to observe how this statement impacts coordinates:',
    tryPush: 'Nudge',
    tryWeight: 'Statement weight',
    tryRight: 'Toward the market side of the economic axis',
    tryLeft: 'Toward the state side of the economic axis',
    tryNone: 'No movement',
    tryUnit: 'points',
    normalise: 'All statement nudges are summed and divided by the theoretical maximum possible push on each axis, mapping results between {neg} and +100. Achieving ±100 requires extreme uniform answers on all items; naturally, most nuanced citizens land in moderate bands.',
    axesTitle: 'The Two Foundation Axes',
    axisX: 'Economic Axis (Horizontal)',
    axisXLeft: 'State-led economy, redistribution, public mega-infrastructure',
    axisXRight: 'Free markets, private enterprise, capitalist growth incentives',
    axisY: 'Governance Axis (Vertical)',
    axisYTop: 'Rule of law, constitutional checks, free expression, devolution',
    axisYBottom: 'Strong central authority, executive primacy, state surveillance',
    centreNote: 'Within {r} points of the origin, positions are classified as Centrist.',
    compassMid: 'Centrist',
    topicsTitle: 'Eight Thematic Policy Bars',
    topicsBody: 'Alongside the 2D compass, results feature 8 thematic bars tracking specific policy domains from {neg} to +100. Scores within ±{lean} are designated as balanced.',
    notCountTitle: 'Scoring Rules & Scope',
    notCount: [
      'Neutral (3) and skipped answers yield a multiplier of 0, creating no displacement.',
      'Refined from our initial 40-question draft, every single one of these 24 curated questions directly shapes both the 2D compass axes and the 8 thematic policy bars.'
    ],

    matchTitle: 'Party & Ideology Matching',
    matchBody: 'For each bloc, our academic framework establishes expected responses for a representative supporter. Your similarity percentage reflects geometric proximity to these reference patterns.',
    matchWarn: 'Reference positions are editorial and academic approximations, not formal party platforms. Every individual weight is open to review in the data table below.',
    blocsTitle: 'The Five Reference Orientations',
    blocsOrder: 'Arranged alphabetically by English name',
    nonParty: 'Civic / Intellectual Viewpoint',
    party: 'Political Party Tradition',
    pctTitle: 'Understanding Percentages',
    pctBody: [
      'Percentages represent ideological similarity in this specific assessment, not voting probability.',
      'Scores are bounded between {min}% and {max}% to avoid misleading zero or hundred percent absolutes.'
    ],
    typesTitle: 'Four Outcome Types',
    types: [
      { h: 'Clear Match', b: 'Top bloc score meets or exceeds {noMatch}%.' },
      { h: 'Close Call', b: 'Margin between top two blocs is under {margin} points.' },
      { h: 'No Clear Match', b: 'No bloc reaches the {noMatch}% threshold.' },
      { h: 'Mixed / Undecided', b: '{mixed}% or more answers were neutral or skipped.' }
    ],
    leadersTitle: 'Historical Figures & Governance Models',
    leadersBody: 'Your compass coordinates are compared against calibrated coordinates for 23 historical figures across Bangladesh, South Asia, and world history. Direction is prioritised before radial intensity, accompanied by a quadrant governance model.',
    leadersWarn: 'Historical placements represent illustrative comparative mappings for intellectual reflection, not political endorsements.',

    privacyTitle: 'Data Privacy & Rigour',
    privacyCards: [
      { h: 'No personal identification collected', b: 'No logins or accounts. We do not ask for names, phone numbers, email addresses, or IDs.' },
      { h: 'Pseudonymous browser tokens', b: 'To prevent duplicate ballot-stuffing in public aggregates, browsers generate a random token with zero linkage to real identity.' },
      { h: 'Aggregation-only database reads', b: 'Individual answer sheets cannot be queried or listed publicly. Only aggregate cohort statistics are exposed.' },
      { h: 'Speed & straight-line filters', b: 'Submissions under {sec} seconds or with artificial straight-line patterns are filtered out of the public dashboard.' }
    ],
    limitsTitle: 'Methodological Limitations',
    limits: [
      'Voluntary online respondents do not constitute a nationally representative random sample.',
      'Question phrasing strives for neutrality, but no framing is entirely devoid of nuance.',
      'Treat aggregated dashboards as an indicative barometer of participating citizens, not as an official election poll.'
    ],

    faqTitle: 'Frequently Asked Questions',
    faq: [
      { q: 'Is this a test with correct and incorrect answers?', a: 'No. Every statement contrasts two legitimate socio-political principles. Your honest conviction is the correct answer.' },
      { q: 'What if I agree with aspects of both sides?', a: 'Select the option corresponding to whichever side holds slightly more weight for you. If genuinely torn, select Neutral; however, too many neutral answers will yield a Mixed outcome.' },
      { q: 'Does receiving a bloc match mean I am a member?', a: 'No. It merely demonstrates affinity with that tradition on these 24 specific policy items.' },
      { q: 'Why did my result land near the centre?', a: 'Extreme coordinates require consistent extreme answers across all questions. Pragmatic or balanced views naturally plot closer to the centre.' },
      { q: 'How is respondent privacy safeguarded?', a: 'Responses are completely pseudonymous. No contact details, IP logs, or personal credentials are ever recorded.' }
    ],

    openTitle: 'Open Mathematics & Dataset',
    openIntro: 'For researchers, data scientists, and independent auditors, the full scoring formulation and weights matrix for all 24 questions are open below. Active model version:',
    formulaSummary: 'Step-by-Step Formulation',
    formulaSteps: [
      { h: '1. Multiplier mapping', b: 'm = score − 3 (−2 to +2). Skipped or neutral answers yield m = 0.' },
      { h: '2. Compass Coordinates', b: 'X = 100 × Σ(m × x_weight) ÷ Σ(2 × |x_weight|). Y is computed symmetrically using y_weights.' },
      { h: '3. Centrist boundary', b: 'Euclidean distance √(X² + Y²) ≤ {r} assigns the Centrist profile; otherwise quadrant signs apply.' },
      { h: '4. Thematic Block scores', b: 'Bar = 100 × Σ(m × direction × weight) ÷ Σ(2 × weight), normalised between −100 and +100.' },
      { h: '5. Bloc affinity curve', b: 'raw = Σ(m × bloc_weight). Normalised f = (raw − min) ÷ (max − min). Score = f^{curve} × 100, clamped to {min}–{max}%.' },
      { h: '6. Historical figure proximity', b: 'Combines angular directional bearing and radial intensity ({rw} factor), scaled between 30% and 99%.' }
    ],
    tableSummary: 'Curated 24-Question Ideological Matrix',
    tableIntro: 'Review the weights matrix governing all 24 curated questions. Download the complete dataset in UTF-8 CSV format for independent analysis and research.',
    tableHead: { serial: 'No.', id: 'ID', block: 'Policy Domain', statement: 'Statement', x: 'X Axis', y: 'Y Axis', dir: 'Direction' },
    downloadCsv: 'Download 24-Question CSV',
    downloadCount: '24 Curated Questions Included',
    shortBloc: { AL: 'AL', BNP: 'BNP', JI: 'JI', Student: 'NCP', Sushil: 'Civil' },
    csvName: 'bd-political-compass-24q-weights.csv'
  }
};

const BLOC_COPY = {
  AL: {
    en: 'Awami League',
    kind: 'party',
    text: {
      bn: 'ধর্মনিরপেক্ষ বাঙালি জাতীয়তাবাদ, ১৯৭২ সালের সংবিধানের কাঠামো এবং অবকাঠামোনির্ভর উন্নয়নের ওপর জোরের জন্য পরিচিত।',
      en: 'Known for secular Bengali nationalism, the framework of the 1972 constitution, and an emphasis on infrastructure-led development.'
    },
    tags: {
      bn: ['ধর্মনিরপেক্ষ জাতীয়তাবাদ', 'অবকাঠামো ও উন্নয়ন', 'শক্তিশালী কেন্দ্রীয় সরকার'],
      en: ['Secular nationalism', 'Infrastructure-led growth', 'Strong central government']
    }
  },
  BNP: {
    en: 'Bangladesh Nationalist Party (BNP)',
    kind: 'party',
    text: {
      bn: 'বাংলাদেশি জাতীয়তাবাদ, বহুদলীয় গণতন্ত্র, নির্দলীয় তত্ত্বাবধায়ক সরকারের দাবি এবং বাজারমুখী অর্থনীতির জন্য পরিচিত।',
      en: 'Known for Bangladeshi nationalism, multi-party democracy, the demand for non-party caretaker governments, and a market-leaning economy.'
    },
    tags: {
      bn: ['বাংলাদেশি জাতীয়তাবাদ', 'বহুদলীয় গণতন্ত্র', 'বাজারমুখী অর্থনীতি'],
      en: ['Bangladeshi nationalism', 'Multi-party democracy', 'Market-leaning economy']
    }
  },
  JI: {
    en: 'Jamaat-e-Islami',
    kind: 'party',
    text: {
      bn: 'রাজনীতি ও সমাজে ইসলামি মূল্যবোধ ও নৈতিকতার ওপর জোর, সুদমুক্ত অর্থনীতির ধারণা এবং বিকেন্দ্রীকরণের অবস্থানের জন্য পরিচিত।',
      en: 'Known for its emphasis on Islamic values and ethics in politics and society, the idea of an interest-free economy, and decentralisation.'
    },
    tags: {
      bn: ['ইসলামি মূল্যবোধ ও নৈতিকতা', 'সুদমুক্ত অর্থনীতি', 'বিকেন্দ্রীকরণ'],
      en: ['Islamic values and ethics', 'Interest-free finance', 'Decentralisation']
    }
  },
  Student: {
    en: 'National Citizen Party (NCP)',
    kind: 'party',
    text: {
      bn: 'জুলাই গণ-অভ্যুত্থানের চেতনা, নতুন সংবিধানের দাবি এবং প্রাতিষ্ঠানিক সংস্কার ও জবাবদিহির ওপর জোরের জন্য পরিচিত।',
      en: 'Known for the spirit of the July uprising, the call for a new constitution, and an emphasis on institutional reform and accountability.'
    },
    tags: {
      bn: ['জুলাই অভ্যুত্থানের চেতনা', 'নতুন সংবিধান', 'জবাবদিহি'],
      en: ['July uprising spirit', 'New constitution', 'Accountability']
    }
  },
  Sushil: {
    en: 'Civil society (liberal constitutionalists)',
    kind: 'view',
    text: {
      bn: 'কোনো দল নয়, একটি দৃষ্টিভঙ্গি: আইনের শাসন, স্বাধীন প্রতিষ্ঠান, বাকস্বাধীনতা ও সংবিধানের মাধ্যমে ক্ষমতার ভারসাম্যে বিশ্বাস।',
      en: 'Not a party but a viewpoint: belief in the rule of law, independent institutions, free speech, and checks on power through the constitution.'
    },
    tags: {
      bn: ['আইনের শাসন', 'স্বাধীন প্রতিষ্ঠান', 'বাকস্বাধীনতা'],
      en: ['Rule of law', 'Independent institutions', 'Free speech']
    }
  }
};

const BLOCK_EN = {
  state_power: { title: 'State and executive power', left: 'Centralised control', right: 'Balanced power' },
  democracy: { title: 'Democracy and elections', left: 'Party control', right: 'Neutral system' },
  religion_society: { title: 'Religion and society', left: 'Religious norms', right: 'Secularism' },
  economy_market: { title: 'Economy and markets', left: 'Welfare / collective', right: 'Free market' },
  sovereignty: { title: 'Nationalism and sovereignty', left: 'Strategic concession', right: 'Firm sovereignty' },
  civil_liberties: { title: 'Civil liberties', left: 'Tight control', right: 'Free expression' },
  state_reform: { title: 'Reform and the constitution', left: 'Status quo', right: 'Radical change' },
  social_justice: { title: 'Justice and equality', left: 'Existing structures', right: 'Social equality' }
};

const QUADRANT_EN = {
  libertarian_left: 'Libertarian Left',
  libertarian_right: 'Libertarian Right',
  authoritarian_left: 'Authoritarian Left',
  authoritarian_right: 'Authoritarian Right'
};

const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
const signed = (n) => (n > 0 ? `+${n}` : n < 0 ? `${MINUS}${Math.abs(n)}` : '0');
const stripParen = (s) => String(s || '').replace(/\s*\(.*\)\s*$/, '');

export default function MethodologyPage({ lang = 'bn', onStartTest, onGoHome }) {
  const L = lang === 'en' ? 'en' : 'bn';
  const isEn = L === 'en';
  const c = COPY[L];
  const num = (v) => (isEn ? String(v) : toBn(v));
  const sgn = (n) => `${n < 0 ? MINUS : n > 0 ? '+' : ''}${num(Math.abs(n))}`;

  const [active, setActive] = useState(SECTION_IDS[0]);
  const [demo, setDemo] = useState(4);

  const jump = (id) => {
    setActive(id);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 85;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - topOffset,
        behavior: 'smooth'
      });
    }
  };

  const total = QUESTIONS.length; // 24
  const common = {
    n: num(total),
    neg: `${MINUS}${num(100)}`,
    lean: num(PARAMS.leanThreshold),
    r: num(PARAMS.centreRadius),
    min: num(PARAMS.affinityMin),
    max: num(PARAMS.affinityMax),
    noMatch: num(PARAMS.noMatchBelow),
    margin: num(PARAMS.closeCallMargin),
    mixed: num(PARAMS.mixedNeutralShare),
    sec: num(PARAMS.minSeconds),
    minA: num(PARAMS.minAnswers),
    sl: num(PARAMS.straightLinePct),
    curve: num(PARAMS.affinityCurve),
    rw: num(PARAMS.radialWeight)
  };
  const f = (s) => fill(s, common);

  // Interactive example question from the active 24-question set (q17 - free market vs subsidies)
  const demoQ = QUESTIONS.find((q) => q.id === 'q17' && q.x_weight) || QUESTIONS[0];
  const demoMult = demo - 3;
  const demoPush = demoQ ? Math.round(demoMult * demoQ.x_weight * 10) / 10 : 0;
  const demoMax = demoQ ? 2 * Math.abs(demoQ.x_weight) : 1;
  const demoSide = demoPush > 0 ? c.tryRight : demoPush < 0 ? c.tryLeft : c.tryNone;
  const scaleColors = ['#16a34a', '#4ade80', '#94a3b8', '#f87171', '#dc2626'];
  const scaleValues = [2, 1, 0, -1, -2];

  const quadName = (key) => (isEn ? QUADRANT_EN[key] : stripParen(QUADRANT_PROFILES?.[key]?.name));
  const blocOrder = ['AL', 'BNP', 'JI', 'Student', 'Sushil'].filter((k) => BLOC_PROFILES[k]);
  const blocKeys = Object.keys(BLOC_PROFILES);

  // Clean 24-question CSV download with UTF-8 BOM
  const downloadCsv = () => {
    const head = ['serial', 'id', 'block_id', 'block_title', 'statement', 'x_weight', 'y_weight', 'direction', 'kind', ...blocKeys];
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = QUESTIONS.map((q, idx) => {
      const block = THEMATIC_BLOCKS.find((b) => b.id === q.blockId);
      const blockTitle = isEn ? (BLOCK_EN[block?.key]?.title || block?.title || '') : (block?.title || '');
      return [
        idx + 1,
        q.id,
        q.blockId,
        blockTitle,
        q.text,
        q.x_weight ?? 0,
        q.y_weight ?? 0,
        q.direction ?? 0,
        q.kind || 'trade-off',
        ...blocKeys.map((k) => (q.bloc_weights || {})[k] ?? 0)
      ];
    });
    const csv = '\uFEFF' + [head, ...rows].map((r) => r.map(esc).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = c.csvName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const cls = (n) => (n > 0 ? 'pos' : n < 0 ? 'neg' : '');

  return (
    <div className="methodology-page-container" lang={L} style={{ width: '100%', minHeight: '100vh', padding: '1.5rem 1rem 4rem' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        
        {/* Navigation Breadcrumb / Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
          {onGoHome && (
            <button 
              onClick={onGoHome} 
              className="btn-ghost"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', fontSize: '0.88rem', fontWeight: 600 }}
            >
              <ArrowLeft size={16} />
              <span>{c.goBack}</span>
            </button>
          )}

          {onStartTest && (
            <button 
              onClick={onStartTest}
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.25rem', fontSize: '0.92rem', fontWeight: 700, borderRadius: '999px', marginLeft: 'auto' }}
            >
              <span>{c.startTest}</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        {/* Hero Header */}
        <header style={{ 
          background: 'var(--bg-secondary)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: '24px', 
          padding: 'clamp(1.5rem, 3.5vw, 2.5rem)', 
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.85rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-gold)', background: 'var(--accent-gold-glow)', border: '1px solid var(--border-gold)', marginBottom: '0.85rem' }} className="font-latin">
            <Sparkles size={14} />
            <span>{c.badge}</span>
          </div>
          <h1 style={{ margin: '0 0 0.6rem', fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25 }}>
            {c.title}
          </h1>
          <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--text-secondary)', maxWidth: '68ch' }}>
            {c.subtitle}
          </p>

          {/* Quick Nav Chips */}
          <nav style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', padding: '1.5rem 0 0', marginTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', scrollbarWidth: 'none' }} aria-label={c.title}>
            {SECTION_IDS.map((id, i) => {
              const Icon = SECTION_ICONS[i];
              return (
                <button
                  key={id}
                  onClick={() => jump(id)}
                  style={{
                    flex: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.9rem',
                    borderRadius: '999px',
                    border: active === id ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                    background: active === id ? 'var(--accent-gold-glow)' : 'var(--bg-primary)',
                    color: active === id ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    font: 'inherit',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={15} />
                  <span>{c.nav[i]}</span>
                </button>
              );
            })}
          </nav>
        </header>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section 1: Overview */}
          <section id="mm-overview" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <h2 className="mm-h2" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '0 0 1.25rem', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              <Sparkles size={22} style={{ color: 'var(--accent-gold)' }} />
              <span>{c.overviewTitle}</span>
            </h2>

            <div className="mm-grid c2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '0.85rem' }}>
              {c.steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.85rem', padding: '1.1rem', borderRadius: '16px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                  <span className="font-latin" style={{ flex: 'none', display: 'grid', placeItems: 'center', width: '2.1rem', height: '2.1rem', borderRadius: '50%', background: 'var(--accent-gold-glow)', border: '1px solid var(--border-gold)', color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.95rem' }}>
                    {num(i + 1)}
                  </span>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{f(s.h)}</h4>
                    <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>{f(s.b)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '0.85rem', marginTop: '1rem' }}>
              <div style={{ padding: '1.1rem', borderRadius: '16px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ margin: '0 0 0.6rem', fontSize: '1rem', fontWeight: 800, color: 'var(--accent-green)' }}>{c.isTitle}</h4>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '0.5rem' }}>
                  {c.isItems.map((t) => (
                    <li key={t} style={{ display: 'flex', gap: '0.55rem', fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                      <Check size={16} style={{ flex: 'none', marginTop: '0.25rem', color: 'var(--accent-green)' }} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ padding: '1.1rem', borderRadius: '16px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ margin: '0 0 0.6rem', fontSize: '1rem', fontWeight: 800, color: 'var(--accent-red)' }}>{c.isNotTitle}</h4>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '0.5rem' }}>
                  {c.isNotItems.map((t) => (
                    <li key={t} style={{ display: 'flex', gap: '0.55rem', fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                      <X size={16} style={{ flex: 'none', marginTop: '0.25rem', color: 'var(--accent-red)' }} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p style={{ margin: '1.25rem 0 0', padding: '0.9rem 1.1rem', borderRadius: '14px', border: '1px solid var(--border-gold)', background: 'var(--accent-gold-glow)', fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
              {c.independent}
            </p>
          </section>

          {/* Section 2: Scoring */}
          <section id="mm-score" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <h2 className="mm-h2" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '0 0 1.25rem', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              <Calculator size={22} style={{ color: 'var(--accent-gold)' }} />
              <span>{c.scoreTitle}</span>
            </h2>
            <p style={{ margin: '0 0 0.9rem', fontSize: '1rem', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
              {c.scoreIntro}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem', margin: '0.5rem 0 0.9rem' }}>
              {c.scale.map((label, i) => (
                <div key={label} style={{ padding: '0.8rem 0.4rem', textAlign: 'center', borderRadius: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                  <b className="font-latin" style={{ display: 'block', fontSize: '1.35rem', lineHeight: 1.2, color: scaleColors[i] }}>
                    {sgn(scaleValues[i])}
                  </b>
                  <span style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.82rem', lineHeight: 1.35, color: 'var(--text-secondary)' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <p style={{ margin: '0 0 0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{c.scaleHelp}</p>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{c.directionNote}</p>

            {/* Interactive Widget */}
            {demoQ && (
              <div style={{ margin: '1.25rem 0', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
                <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '1rem' }}>{c.tryTitle}</strong>
                <blockquote style={{ margin: '0.6rem 0 1rem', padding: '0 0 0 0.75rem', borderLeft: '3px solid var(--accent-gold)', fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--text-primary)', fontStyle: 'normal' }}>
                  {demoQ.text}
                </blockquote>
                <p style={{ margin: '0 0 0.6rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>{c.tryHint}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '0.4rem' }}>
                  {c.scale.map((label, i) => (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={demo === 5 - i}
                      onClick={() => setDemo(5 - i)}
                      style={{
                        padding: '0.65rem 0.25rem',
                        borderRadius: '10px',
                        border: demo === 5 - i ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        background: demo === 5 - i ? 'var(--accent-gold-glow)' : 'var(--bg-secondary)',
                        color: demo === 5 - i ? 'var(--accent-gold)' : 'var(--text-secondary)',
                        font: 'inherit',
                        fontSize: '0.82rem',
                        fontWeight: demo === 5 - i ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                  <strong>{c.tryPush}:</strong>{' '}
                  <span className="font-latin">
                    {sgn(demoMult)} × {num(demoQ.x_weight)} = <strong style={{ color: 'var(--text-primary)' }}>{sgn(demoPush)}</strong>
                  </span>{' '}
                  {c.tryUnit}, {demoSide}.
                  <div style={{ position: 'relative', height: '10px', margin: '0.75rem 0 0.4rem', borderRadius: '999px', background: 'var(--border-subtle)' }} aria-hidden="true">
                    <u style={{ position: 'absolute', left: '50%', top: '-3px', bottom: '-3px', width: '2px', background: 'var(--text-muted)', textDecoration: 'none' }} />
                    <i
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        borderRadius: '999px',
                        background: 'var(--accent-gold)',
                        left: demoPush >= 0 ? '50%' : `${50 - (Math.abs(demoPush) / demoMax) * 50}%`,
                        width: `${(Math.abs(demoPush) / demoMax) * 50}%`
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {c.tryWeight}: <span className="font-latin">{num(demoQ.x_weight)}</span>
                  </span>
                </div>
              </div>
            )}

            <p style={{ marginTop: '1.25rem', fontSize: '0.98rem', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
              {f(c.normalise)}
            </p>

            {/* Compass Map Explanation */}
            <h3 style={{ margin: '1.75rem 0 0.85rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{c.axesTitle}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gridTemplateRows: 'auto 1fr auto', gap: '0.6rem', alignItems: 'center', margin: '0.5rem 0 1rem' }}>
              <span />
              <span style={{ fontSize: '0.85rem', lineHeight: 1.45, color: 'var(--text-secondary)', textAlign: 'center' }}>
                <b style={{ color: 'var(--text-primary)' }}>{c.axisY}</b><br />{c.axisYTop}
              </span>
              <span />
              <span style={{ fontSize: '0.85rem', lineHeight: 1.45, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '8rem' }}>
                {c.axisXLeft}
              </span>
              <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', minHeight: '220px', border: '1px solid var(--border-subtle)', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', placeItems: 'center', padding: '0.5rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', borderRight: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                  {quadName('libertarian_left')}
                </div>
                <div style={{ display: 'grid', placeItems: 'center', padding: '0.5rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                  {quadName('libertarian_right')}
                </div>
                <div style={{ display: 'grid', placeItems: 'center', padding: '0.5rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-primary)', borderRight: '1px solid var(--border-subtle)' }}>
                  {quadName('authoritarian_left')}
                </div>
                <div style={{ display: 'grid', placeItems: 'center', padding: '0.5rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {quadName('authoritarian_right')}
                </div>
                <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'grid', placeItems: 'center', width: '3.8rem', height: '3.8rem', borderRadius: '50%', background: 'var(--bg-secondary)', border: '1.5px dashed var(--accent-gold)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)', textAlign: 'center', lineHeight: 1.2 }}>
                  {c.compassMid}
                </span>
              </div>
              <span style={{ fontSize: '0.85rem', lineHeight: 1.45, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '8rem' }}>
                {c.axisXRight}
              </span>
              <span />
              <span style={{ fontSize: '0.85rem', lineHeight: 1.45, color: 'var(--text-secondary)', textAlign: 'center' }}>
                {c.axisYBottom}
              </span>
              <span />
            </div>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {f(c.centreNote)}
            </p>

            {/* Topics */}
            <h3 style={{ margin: '1.75rem 0 0.85rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{c.topicsTitle}</h3>
            <p style={{ margin: '0 0 1rem', fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{f(c.topicsBody)}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '0.65rem' }}>
              {THEMATIC_BLOCKS.map((b) => {
                const en = BLOCK_EN[b.key];
                return (
                  <div key={b.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: '0.85rem 1rem', borderRadius: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                    <b style={{ fontSize: '0.98rem', color: 'var(--text-primary)' }}>{isEn ? (en?.title || b.title) : b.title}</b>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      {isEn ? (en?.left || b.leftShort) : b.leftShort} ↔ {isEn ? (en?.right || b.rightShort) : b.rightShort}
                    </span>
                  </div>
                );
              })}
            </div>

            <h3 style={{ margin: '1.75rem 0 0.6rem', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{c.notCountTitle}</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '0.5rem' }}>
              {c.notCount.map((item, idx) => (
                <li key={idx} style={{ display: 'flex', gap: '0.55rem', fontSize: '0.95rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                  <Check size={16} style={{ flex: 'none', marginTop: '0.25rem', color: 'var(--accent-gold)' }} />
                  <span>{f(item)}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3: Match */}
          <section id="mm-match" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <h2 className="mm-h2" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '0 0 1.25rem', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              <Landmark size={22} style={{ color: 'var(--accent-gold)' }} />
              <span>{c.matchTitle}</span>
            </h2>
            <p style={{ margin: '0 0 0.9rem', fontSize: '1rem', lineHeight: 1.75, color: 'var(--text-secondary)' }}>{c.matchBody}</p>
            <p style={{ margin: '0 0 1.25rem', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-gold)', background: 'var(--accent-gold-glow)', fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-primary)' }}>
              {c.matchWarn}
            </p>

            <h3 style={{ margin: '1.5rem 0 0.5rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{c.blocsTitle}</h3>
            <p style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>{c.blocsOrder}</p>
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {blocOrder.map((k) => {
                const p = BLOC_PROFILES[k];
                const info = BLOC_COPY[k];
                return (
                  <div key={k} style={{ display: 'flex', gap: '1rem', padding: '1.1rem', borderRadius: '16px', background: 'var(--bg-primary)', border: `1.5px solid ${p.color}40` }}>
                    <div style={{ flex: 'none' }}>
                      <BlocLogo blocKey={k} size={46} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: p.color }}>{isEn ? info?.en : p.name}</h4>
                      <span style={{ display: 'inline-block', margin: '0.2rem 0 0.45rem', padding: '0.1rem 0.6rem', borderRadius: '999px', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {info?.kind === 'view' ? c.nonParty : c.party}
                      </span>
                      <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>{info?.text[L]}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.6rem' }}>
                        {(info?.tags[L] || []).map((t) => (
                          <span key={t} style={{ padding: '0.2rem 0.65rem', borderRadius: '999px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <h3 style={{ margin: '1.75rem 0 0.6rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{c.pctTitle}</h3>
            {c.pctBody.map((t) => (
              <p key={t} style={{ margin: '0 0 0.6rem', fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{f(t)}</p>
            ))}

            <h3 style={{ margin: '1.75rem 0 0.85rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{c.typesTitle}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '0.65rem' }}>
              {c.types.map((t) => (
                <div key={t.h} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', padding: '0.9rem 1rem', borderRadius: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                  <b style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{t.h}</b>
                  <span style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{f(t.b)}</span>
                </div>
              ))}
            </div>

            <h3 style={{ margin: '1.75rem 0 0.6rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{c.leadersTitle}</h3>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{c.leadersBody}</p>
            <p style={{ margin: 0, padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-gold)', background: 'var(--accent-gold-glow)', fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-primary)' }}>
              {c.leadersWarn}
            </p>
          </section>

          {/* Section 4: Privacy */}
          <section id="mm-privacy" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <h2 className="mm-h2" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '0 0 1.25rem', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              <Lock size={22} style={{ color: 'var(--accent-gold)' }} />
              <span>{c.privacyTitle}</span>
            </h2>
            <div className="mm-grid c2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '0.85rem' }}>
              {c.privacyCards.map((card) => (
                <div key={card.h} style={{ padding: '1.1rem', borderRadius: '16px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{card.h}</h4>
                  <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>{f(card.b)}</p>
                </div>
              ))}
            </div>

            <h3 style={{ margin: '1.75rem 0 0.75rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{c.limitsTitle}</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '0.55rem' }}>
              {c.limits.map((t) => (
                <li key={t} style={{ display: 'flex', gap: '0.55rem', fontSize: '0.95rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                  <Check size={16} style={{ flex: 'none', marginTop: '0.25rem', color: 'var(--accent-gold)' }} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 5: FAQ */}
          <section id="mm-faq" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <h2 className="mm-h2" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '0 0 1.25rem', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              <HelpCircle size={22} style={{ color: 'var(--accent-gold)' }} />
              <span>{c.faqTitle}</span>
            </h2>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {c.faq.map((item) => (
                <details key={item.q} style={{ border: '1px solid var(--border-subtle)', borderRadius: '14px', background: 'var(--bg-primary)', overflow: 'hidden' }}>
                  <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem 1.2rem', cursor: 'pointer', listStyle: 'none', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <span>{item.q}</span>
                    <ChevronDown size={18} style={{ color: 'var(--text-muted)', flex: 'none' }} />
                  </summary>
                  <div style={{ padding: '0 1.2rem 1.1rem' }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{f(item.a)}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Section 6: Open Formulas & Weights Table */}
          <section id="mm-open" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h2 className="mm-h2" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '0 0 0.35rem', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  <FileText size={22} style={{ color: 'var(--accent-gold)' }} />
                  <span>{c.openTitle}</span>
                </h2>
                <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                  {c.openIntro} <code className="font-latin" style={{ padding: '0.15rem 0.45rem', borderRadius: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: 'var(--accent-gold)', fontWeight: 700 }}>{MODEL_VERSION}</code>
                  {' · '}
                  <code className="font-latin" style={{ padding: '0.15rem 0.45rem', borderRadius: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>{QUESTION_SET_VERSION}</code>
                </p>
              </div>

              <button
                type="button"
                onClick={downloadCsv}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-gold)',
                  background: 'var(--accent-gold-glow)',
                  color: 'var(--accent-gold)',
                  font: 'inherit',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Download size={16} />
                <span>{c.downloadCsv}</span>
              </button>
            </div>

            {/* Formula Steps */}
            <details open style={{ border: '1px solid var(--border-subtle)', borderRadius: '16px', background: 'var(--bg-primary)', marginBottom: '1.25rem', overflow: 'hidden' }}>
              <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem 1.25rem', cursor: 'pointer', listStyle: 'none', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                <span>{c.formulaSummary}</span>
                <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />
              </summary>
              <div style={{ padding: '0 1.25rem 1.25rem', display: 'grid', gap: '0.6rem' }}>
                {c.formulaSteps.map((s) => (
                  <div key={s.h} style={{ padding: '0.8rem 1rem', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                    <b style={{ display: 'block', margin: '0 0 0.2rem', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{s.h}</b>
                    <span style={{ fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>{f(s.b)}</span>
                  </div>
                ))}
              </div>
            </details>

            {/* 24-Questions Matrix Table */}
            <details open style={{ border: '1px solid var(--border-subtle)', borderRadius: '16px', background: 'var(--bg-primary)', overflow: 'hidden' }}>
              <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem 1.25rem', cursor: 'pointer', listStyle: 'none', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span>{c.tableSummary}</span>
                  <span style={{ padding: '0.15rem 0.55rem', borderRadius: '999px', background: 'var(--accent-gold-glow)', border: '1px solid var(--border-gold)', color: 'var(--accent-gold)', fontSize: '0.78rem', fontWeight: 700 }}>
                    {c.downloadCount}
                  </span>
                </div>
                <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />
              </summary>
              <div style={{ padding: '0 1.25rem 1.25rem' }}>
                <p style={{ margin: '0 0 1rem', fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-muted)' }}>
                  {c.tableIntro}
                </p>

                <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                  <table className="font-latin" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <th style={{ padding: '0.65rem 0.6rem', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 700 }}>{c.tableHead.serial}</th>
                        <th style={{ padding: '0.65rem 0.6rem', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 700 }}>{c.tableHead.block}</th>
                        <th style={{ padding: '0.65rem 0.8rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 700, minWidth: '320px' }}>{c.tableHead.statement}</th>
                        <th style={{ padding: '0.65rem 0.6rem', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 700 }}>{c.tableHead.x}</th>
                        <th style={{ padding: '0.65rem 0.6rem', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 700 }}>{c.tableHead.y}</th>
                        <th style={{ padding: '0.65rem 0.6rem', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 700 }}>{c.tableHead.dir}</th>
                        {blocKeys.map((k) => (
                          <th key={k} style={{ padding: '0.65rem 0.6rem', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 700 }}>
                            {c.shortBloc[k] || k}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {QUESTIONS.map((q, idx) => {
                        const block = THEMATIC_BLOCKS.find((b) => b.id === q.blockId);
                        const blockTitle = isEn ? (BLOCK_EN[block?.key]?.title || block?.title || '') : (block?.title || '');
                        return (
                          <tr key={q.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
                              {idx + 1}
                            </td>
                            <td style={{ padding: '0.6rem 0.6rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                              {blockTitle}
                            </td>
                            <td style={{ padding: '0.6rem 0.8rem', textAlign: 'left', lineHeight: 1.55, color: 'var(--text-secondary)' }}>
                              {q.text}
                            </td>
                            <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center', fontWeight: 700, color: q.x_weight > 0 ? 'var(--accent-green)' : q.x_weight < 0 ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                              {q.x_weight ? signed(q.x_weight) : '0'}
                            </td>
                            <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center', fontWeight: 700, color: q.y_weight > 0 ? 'var(--accent-green)' : q.y_weight < 0 ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                              {q.y_weight ? signed(q.y_weight) : '0'}
                            </td>
                            <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                              {signed(q.direction)}
                            </td>
                            {blocKeys.map((k) => {
                              const w = (q.bloc_weights || {})[k] ?? 0;
                              return (
                                <td key={k} style={{ padding: '0.6rem 0.5rem', textAlign: 'center', fontWeight: 700, color: w > 0 ? 'var(--accent-green)' : w < 0 ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                                  {w ? signed(w) : '0'}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </details>
          </section>

        </div>

        {/* CTA Banner */}
        <div className="glass-panel dashboard-assessment-cta" style={{ marginTop: '2.5rem' }}>
          <span className="font-latin" style={{ color: 'var(--accent-green)', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {isEn ? '— Find your position' : '— নিজের অবস্থান জানুন'}
          </span>
          <h3 style={{ color: 'var(--text-primary)' }}>
            {isEn ? 'Have you assessed your own position yet?' : 'আপনি কি এখনো আপনার নিজস্ব অবস্থান মূল্যায়ন করেননি?'}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {isEn ? 'Answer 24 questions in just 3-4 minutes to discover where you stand in the new Bangladesh of 2026.' : 'মাত্র ৩-৪ মিনিটে ২৪টি প্রশ্নের উত্তর দিয়ে জেনে নিন ২০২৬-এর নতুন বাংলাদেশে আপনি কোন পন্থী।'}
          </p>

          {onStartTest && (
            <button 
              onClick={onStartTest}
              className="btn-hero-start"
              style={{ cursor: 'pointer', margin: '0 auto' }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <img 
                  src={darkLogo} 
                  alt="Logo" 
                  className="site-logo-light" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.22)' }} 
                />
                <img 
                  src={lightLogo} 
                  alt="Logo" 
                  className="site-logo-dark" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.22)' }} 
                />
              </div>
              <span>{isEn ? 'Take the survey' : 'জরিপে অংশ নিন'}</span>
              <ArrowRight size={22} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
