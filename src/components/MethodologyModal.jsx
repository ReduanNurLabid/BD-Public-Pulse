import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  Calculator,
  Landmark,
  Lock,
  HelpCircle,
  FileText,
  ChevronDown,
  Download,
  Check
} from 'lucide-react';
import { THEMATIC_BLOCKS, BLOC_PROFILES, QUESTIONS, QUADRANT_PROFILES } from '../data/questions';
import BlocLogo from './BlocLogo';

/**
 * Methodology guide.
 *
 * Written for first-time visitors: plain language first, the full formula and
 * every weight at the bottom ("Open methodology").
 * Props: isOpen, onClose, lang ('bn' | 'en').
 *
 * KEEP IN SYNC with scoring.js. The numbers in PARAMS mirror its tunables
 * (MODEL_VERSION v4-2026-10). If you change a threshold there, change it here.
 */
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

// ---------------------------------------------------------------------------
// Copy
// ---------------------------------------------------------------------------
const COPY = {
  bn: {
    badge: 'খোলা পদ্ধতি',
    title: 'এটি কীভাবে কাজ করে',
    subtitle: 'পুরো পদ্ধতি সহজ ভাষায়। পুরো সূত্র আর প্রতিটি প্রশ্নের ওজন দেখতে চাইলে একদম নিচে যান।',
    close: 'বন্ধ করুন',
    gotIt: 'বুঝেছি',
    nav: ['সারসংক্ষেপ', 'স্কোর কীভাবে হয়', 'দলের সঙ্গে মিল', 'আপনার তথ্য', 'প্রশ্নোত্তর', 'পুরো সূত্র'],

    overviewTitle: 'ত্রিশ সেকেন্ডে বুঝে নিন',
    steps: [
      { h: 'আপনি {n}টি বিবৃতির সঙ্গে একমত বা দ্বিমত জানান', b: 'প্রতিটি বিবৃতিতে দুটি বৈধ মূল্যবোধের মধ্যে টানাপোড়েন আছে। কোনো উত্তরই সঠিক বা ভুল নয়।' },
      { h: 'প্রতিটি উত্তর আপনার অবস্থানকে একটু সরায়', b: 'একমত বা দ্বিমতের মাত্রা যত জোরালো, সরানোর জোর তত বেশি। “নিরপেক্ষ” উত্তর কিছুই সরায় না।' },
      { h: 'শেষে দুটি অক্ষে আপনার অবস্থান দেখা যায়', b: 'একটি অক্ষ অর্থনীতির (রাষ্ট্র বনাম বাজার), অন্যটি শাসনের (নিয়ন্ত্রণ বনাম স্বাধীনতা)।' },
      { h: 'তারপর শুরু হয় তুলনা', b: 'আপনার উত্তর কোন রাজনৈতিক ধারার অনুমিত উত্তরের সঙ্গে বেশি মেলে, আর কোন নেতা ও রাষ্ট্রের মডেল আপনার কাছাকাছি, তা দেখানো হয়।' }
    ],
    isTitle: 'ফলাফল যা',
    isItems: ['আপনি কীভাবে উত্তর দিয়েছেন, তার সারসংক্ষেপ', 'এই জরিপের পাঁচটি রেফারেন্স প্রোফাইলের সঙ্গে তুলনা', 'দুই মূল্যবোধের টানাপোড়েন নিয়ে ভাবার একটি সুযোগ'],
    isNotTitle: 'ফলাফল যা নয়',
    isNotItems: ['কোনো দলের সদস্যপদ বা সমর্থনের ঘোষণা নয়', 'নির্বাচনের পূর্বাভাস নয়', 'আপনার সম্পর্কে চূড়ান্ত রায় নয়'],
    independent: 'এটি একটি স্বাধীন ও নির্দলীয় নাগরিক-গবেষণা উদ্যোগ। কোনো রাজনৈতিক দলের সঙ্গে যুক্ত নয়।',

    scoreTitle: 'আপনার উত্তর কীভাবে স্কোর হয়',
    scoreIntro: 'প্রতিটি বিবৃতির পাশে পাঁচটি উত্তর থাকে। প্রতিটি উত্তরের একটি “ধাক্কা” আছে:',
    scale: ['দৃঢ়ভাবে একমত', 'একমত', 'নিরপেক্ষ', 'দ্বিমত', 'দৃঢ়ভাবে দ্বিমত'],
    scaleHelp: '+২ মানে দ্বিগুণ জোরে সরানো, ০ মানে একেবারেই না সরানো।',
    directionNote: 'ধাক্কা কোন দিকে যাবে, তা নির্ভর করে বিবৃতিটি কোন দিক ঘেঁষা, তার ওপর। একই “একমত” উত্তর একটি বিবৃতিতে আপনাকে বাজারের দিকে, আরেকটিতে রাষ্ট্রের দিকে সরাতে পারে। প্রশ্নগুলো তাই ইচ্ছে করেই মিশিয়ে সাজানো।',
    tryTitle: 'একটি আসল প্রশ্নে চেষ্টা করে দেখুন',
    tryHint: 'একটি উত্তর বেছে নিন, দেখুন কতটা ধাক্কা লাগে:',
    tryPush: 'ধাক্কা',
    tryWeight: 'এই প্রশ্নের ওজন',
    tryRight: 'অর্থনীতির অক্ষে বাজারের দিকে',
    tryLeft: 'অর্থনীতির অক্ষে রাষ্ট্রের দিকে',
    tryNone: 'কোনো দিকে সরে না',
    tryUnit: 'পয়েন্ট',
    normalise: 'সব ধাক্কা যোগ করে, আপনার পক্ষে সম্ভব সর্বোচ্চ ধাক্কার যোগফল দিয়ে ভাগ করা হয়। ফলাফল প্রতিটি অক্ষে {neg} থেকে +১০০-এর মধ্যে একটি সংখ্যা। ±১০০ পেতে হলে ওই অক্ষের প্রতিটি প্রশ্নে সর্বোচ্চ জোরে একই দিকে উত্তর দিতে হয়। তাই বেশির ভাগ মানুষের অবস্থান মাঝের কাছাকাছি পড়ে। এটাই স্বাভাবিক, ত্রুটি নয়।',
    axesTitle: 'দুটি অক্ষ',
    axisX: 'অর্থনীতি (আড়াআড়ি)',
    axisXLeft: 'রাষ্ট্র-নিয়ন্ত্রিত, পুনর্বণ্টন ও বৃহৎ প্রকল্প',
    axisXRight: 'মুক্তবাজার, ব্যক্তিমালিকানা ও বাজারভিত্তিক প্রণোদনা',
    axisY: 'শাসন (উল্লম্ব)',
    axisYTop: 'আইনের শাসন, ক্ষমতার ভারসাম্য ও বাকস্বাধীনতা',
    axisYBottom: 'কঠোর কেন্দ্রীয় নিয়ন্ত্রণ ও নজরদারি',
    centreNote: 'কেন্দ্র থেকে {r} পয়েন্টের মধ্যে থাকলে আপনি “মধ্যপন্থী” অঞ্চলে পড়েন।',
    compassMid: 'মধ্য',
    topicsTitle: 'আটটি বিষয়ের বার',
    topicsBody: 'কম্পাসের পাশাপাশি আপনার ফলাফলে আটটি বিষয়ের আটটি বার থাকে। প্রতিটি বার দুই প্রান্তের মধ্যে {neg} থেকে +১০০ পর্যন্ত চলে। বারের মান ±{lean}-এর ভেতরে থাকলে সেটিকে “ভারসাম্যপূর্ণ” ধরা হয়।',
    notCountTitle: 'যা স্কোর সরায় না',
    notCount: [
      'নিরপেক্ষ বা বাদ দেওয়া উত্তর গণনায় ০ হয়, অর্থাৎ কিছুই সরায় না।',
      'চলমান পরিস্থিতি নিয়ে {s}টি প্রশ্ন (চাঁদাবাজি, সংসদে বিরোধী দল, জুলাই অভ্যুত্থান) আপনার কম্পাস বা বিষয়ের বার সরায় না। এগুলো শুধু পাবলিক ড্যাশবোর্ড এবং দলের সঙ্গে মিলে ভূমিকা রাখে।'
    ],

    matchTitle: 'দলের সঙ্গে মিল কীভাবে বের হয়',
    matchBody: 'প্রতিটি ধারার জন্য আমরা আগে থেকে অনুমান করে রেখেছি, ওই ধারার একজন সাধারণ সমর্থক প্রতিটি বিবৃতিতে সম্ভবত কেমন উত্তর দেবেন। আপনার উত্তর যত বেশি মেলে, সেই ধারার শতাংশ তত বেশি।',
    matchWarn: 'এই অনুমিত উত্তরগুলো আমাদের নিজস্ব সম্পাদকীয় অনুমান। এগুলো দলগুলোর অফিসিয়াল অবস্থান নয়, জরিপে পাওয়া তথ্যও নয়। নিয়মিত পর্যালোচনা করা হয়, আর প্রতিটি অনুমান নিচের “পুরো সূত্র” অংশে খোলা আছে।',
    blocsTitle: 'ফলাফলে যে পাঁচটি ধারা থাকে',
    blocsOrder: 'ইংরেজি নামের বর্ণানুক্রমে সাজানো',
    nonParty: 'দল নয়',
    party: 'রাজনৈতিক দল',
    pctTitle: 'শতাংশ মানে কী',
    pctBody: [
      'এটি তুলনামূলক স্কোর, সম্ভাবনা নয়। ৭৮% মানে “এই ধারার সমর্থক হওয়ার সম্ভাবনা ৭৮%” নয়।',
      'স্কোর {min}% থেকে {max}%-এর মধ্যে রাখা হয়, যাতে কোনো ফলাফল ০% বা ১০০% দেখায় না।'
    ],
    typesTitle: 'ফলাফল চার রকম হতে পারে',
    types: [
      { h: 'স্পষ্ট মিল', b: 'শীর্ষ ধারার স্কোর {noMatch}% বা তার বেশি।' },
      { h: 'কাছাকাছি দুটি ধারা', b: 'প্রথম দুই ধারার ব্যবধান {margin} পয়েন্টের কম।' },
      { h: 'স্পষ্ট মিল নেই', b: 'কোনো ধারাই {noMatch}%-এ পৌঁছায়নি।' },
      { h: 'মিশ্র', b: '{mixed}% বা তার বেশি উত্তর নিরপেক্ষ বা বাদ।' }
    ],
    leadersTitle: 'নেতা ও রাষ্ট্রের মডেল',
    leadersBody: 'আপনার কম্পাস-অবস্থানকে ইতিহাসের নেতাদের অবস্থানের সঙ্গে তুলনা করা হয়। আগে দেখা হয় আপনি কোন দিকে ঝুঁকে আছেন, তারপর কতটা তীব্রভাবে। ফলে একই দিকের নেতারা আগে আসেন। রাষ্ট্রের মডেল বাছা হয় আপনার চতুর্ভাগ (কম্পাসের কোন কোণে আছেন) অনুযায়ী।',
    leadersWarn: 'নেতাদের অবস্থান আমাদের মোটামুটি সম্পাদকীয় অনুমান। এটি কোনো নেতার প্রতি সমর্থন বা বিরোধিতা নয়। তুলনাটি আগ্রহ ও আলোচনার জন্য।',

    privacyTitle: 'আপনার তথ্য ও জরিপের নিরাপত্তা',
    privacyCards: [
      { h: 'নাম বা মোবাইল নম্বর লাগে না', b: 'লগইন নেই। আপনার নাম, ফোন নম্বর বা ইমেইল চাওয়া হয় না।' },
      { h: 'ব্রাউজারে একটি এলোমেলো কোড', b: 'পাবলিক পরিসংখ্যানে একই ব্রাউজার থেকে একাধিক উত্তর গোনা ঠেকাতে ব্রাউজারে একটি এলোমেলো কোড তৈরি হয়। এটি আপনার পরিচয়ের সঙ্গে যুক্ত নয়।' },
      { h: 'শুধু যোগফল প্রকাশ হয়', b: 'কারও আলাদা উত্তর অন্য কেউ দেখতে বা তালিকা করতে পারে না। ড্যাশবোর্ডে কেবল সমষ্টিগত সংখ্যা দেখানো হয়।' },
      { h: 'তাড়াহুড়োর উত্তর ছাঁটাই', b: '{sec} সেকেন্ডের কম সময়ে জমা দেওয়া উত্তর গ্রহণ করা হয় না। কম উত্তর দেওয়া বা প্রায় সব প্রশ্নে একই দিকে উত্তর দেওয়া জমাও পাবলিক পরিসংখ্যান থেকে বাদ পড়তে পারে।' }
    ],
    limitsTitle: 'যে সীমাবদ্ধতাগুলো আপনার জানা উচিত',
    limits: [
      'কোনো অনলাইন জরিপই স্বয়ংক্রিয় স্ক্রিপ্ট বা একজনের একাধিক ব্রাউজার ব্যবহার সম্পূর্ণ আটকাতে পারে না।',
      'অংশগ্রহণকারীরা নিজে থেকে এসেছেন। তাঁরা সারা দেশের প্রতিনিধিত্বকারী নমুনা নন।',
      'প্রশ্নের শব্দচয়ন ফলাফলে প্রভাব ফেলে। আমরা প্রতিটি প্রশ্ন দুই দিক থেকে ভারসাম্য রেখে লিখেছি, কিন্তু নিখুঁত নিরপেক্ষতা দাবি করি না।',
      'তাই পাবলিক পরিসংখ্যানকে একটি সূচক হিসেবে দেখুন, নির্ভুল জনমত বা নির্বাচনী পূর্বাভাস হিসেবে নয়।'
    ],

    faqTitle: 'প্রশ্নোত্তর',
    faq: [
      { q: 'এটা কি কোনো পরীক্ষা? সঠিক উত্তর কোনটি?', a: 'না। কোনো উত্তরই সঠিক বা ভুল নয়। প্রতিটি বিবৃতিতে দুটি বৈধ মূল্যবোধের টানাপোড়েন আছে। আপনার প্রথম প্রতিক্রিয়া কী, সেটাই আমরা জানতে চাই।' },
      { q: 'দুই পক্ষের কথাই ঠিক মনে হলে কী করব?', a: 'সেটাই আসল কঠিন প্রশ্ন। যেদিকে সামান্য বেশি ঝুঁকছেন, সেদিকে একমত বা দ্বিমত দিন। সত্যিই সিদ্ধান্ত নিতে না পারলে “নিরপেক্ষ” বেছে নিতে পারেন। তবে বেশির ভাগ উত্তর নিরপেক্ষ হলে ফলাফল “মিশ্র” দেখাবে।' },
      { q: 'ফলাফলে কোনো দলের নাম এলে কি আমি সেই দলের সমর্থক?', a: 'না। এটি শুধু এই জরিপের {n}টি বিবৃতিতে আপনার উত্তরের সঙ্গে ওই ধারার অনুমিত উত্তরের মিল। আপনি কোন দলকে ভোট দেবেন বা সমর্থন করেন, তা এই ফলাফল বলে না।' },
      { q: 'একই “একমত” কখনো বাজারের দিকে, কখনো রাষ্ট্রের দিকে সরায় কেন?', a: 'ইচ্ছে করেই। কিছু বিবৃতি এক দিকের, কিছু উল্টো দিকের। এতে সব প্রশ্নে “হ্যাঁ” বলে যাওয়ার প্রবণতা ধরা পড়ে এবং আপনার প্রকৃত অবস্থান স্পষ্ট হয়।' },
      { q: 'আমার অবস্থান প্রায় মাঝখানে কেন?', a: 'দুই অক্ষের যেকোনো একটিতে ±১০০ পেতে হলে ওই অক্ষের প্রতিটি প্রশ্নে সর্বোচ্চ জোরে একই দিকে উত্তর দিতে হয়। মিশ্র মতামত থাকলে বিন্দু স্বাভাবিকভাবেই মাঝের দিকে থাকে। মাঝামাঝি থাকা কোনো দুর্বলতা নয়।' },
      { q: '“স্পষ্ট মিল নেই” বা “মিশ্র” কেন দেখাল?', a: '“মিশ্র” দেখায় যখন {mixed}% বা তার বেশি উত্তর নিরপেক্ষ বা বাদ থাকে। “স্পষ্ট মিল নেই” দেখায় যখন কোনো ধারার স্কোরই {noMatch}%-এ পৌঁছায় না। দুটোই বলে যে আপনার মতামত এই পাঁচটি প্রোফাইলের কোনোটির সঙ্গে স্পষ্টভাবে মেলে না। এটি ত্রুটি নয়।' },
      { q: 'কিছু প্রশ্নে দল বা ব্যক্তির নাম আছে কেন?', a: 'বেশির ভাগ প্রশ্নে নেই। যেখানে আছে (যেমন আওয়ামী লীগ, শেখ হাসিনা, শেখ মুজিবুর রহমান, তৌহিদি জনতা), সেখানে বিতর্কটাই ওই নামকে ঘিরে। নাম বাদ দিলে প্রশ্নটি বোঝা যেত না।' },
      { q: 'আমার উত্তর কি কেউ দেখতে পায়?', a: 'না। কোনো ব্যবহারকারী বা ক্লায়েন্ট আলাদা উত্তর পড়তে পারে না। প্রকাশ হয় কেবল সমষ্টিগত সংখ্যা। আপনার নাম, ফোন বা ইমেইল সংগ্রহই করা হয় না।' },
      { q: 'একই ব্রাউজার থেকে আবার অংশ নিলে কী হয়?', a: 'পাবলিক পরিসংখ্যানে একটি ব্রাউজার থেকে একটি উত্তরই গোনা হয়। তাই একজনের বারবার অংশ নেওয়ায় ড্যাশবোর্ডের সংখ্যা ফুলে যায় না।' },
      { q: 'দল বা নেতাদের জন্য ধরা ওজন ভুল মনে হলে?', a: 'প্রতিটি ওজন নিচের “পুরো সূত্র” অংশে খোলা আছে। আপনি দেখতে ও CSV হিসেবে নামিয়ে নিতে পারেন। এগুলো সম্পাদকীয় অনুমান এবং নিয়মিত পর্যালোচনা হয়।' },
      { q: 'এই ফলাফল কি নির্বাচনের পূর্বাভাস?', a: 'না। এটি স্বেচ্ছায় অংশ নেওয়া মানুষের মতামত। এঁরা সারা দেশের প্রতিনিধিত্বকারী নমুনা নন। তাই ফলাফল দিয়ে নির্বাচনের ফল অনুমান করা যায় না।' },
      { q: 'কে এটি চালায়? কোনো দলের সঙ্গে যুক্ত?', a: 'না। এটি স্বাধীন ও নির্দলীয় একটি নাগরিক-গবেষণা উদ্যোগ। কোনো রাজনৈতিক দলের সঙ্গে যুক্ত নয়।' }
    ],

    openTitle: 'পুরো সূত্র (গবেষক ও কৌতূহলীদের জন্য)',
    openIntro: 'এখানে স্কোরিং-এর প্রতিটি ধাপ, প্রতিটি সীমারেখা আর প্রতিটি প্রশ্নের ওজন খোলা আছে। মডেল সংস্করণ:',
    formulaSummary: 'ধাপে ধাপে সূত্র',
    formulaSteps: [
      { h: '১. উত্তর থেকে গুণাঙ্ক', b: 'গুণাঙ্ক m = উত্তর − ৩ (অর্থাৎ −২ থেকে +২)। বাদ দেওয়া প্রশ্নের m = ০।' },
      { h: '২. কম্পাসের স্থানাঙ্ক', b: 'X = ১০০ × Σ(m × x-ওজন) ÷ Σ(২ × |x-ওজন|)। Y একইভাবে y-ওজন দিয়ে।' },
      { h: '৩. চতুর্ভাগ', b: 'কেন্দ্র থেকে দূরত্ব √(X² + Y²) ≤ {r} হলে “মধ্যপন্থী”। নইলে X ও Y-এর চিহ্ন অনুযায়ী চার কোণের একটি।' },
      { h: '৪. বিষয়ের বার', b: 'বার = ১০০ × Σ(m × দিক × জোর) ÷ Σ(২ × জোর), যেখানে জোর = max(|x|, |y|, ১)। “দিক” +১ মানে একমত হলে ডান প্রান্তের দিকে, −১ মানে বাম প্রান্তের দিকে। সেন্টিমেন্ট প্রশ্ন বাদ।' },
      { h: '৫. ধারার মিল', b: 'প্রতিটি ধারার জন্য: কাঁচা = Σ(m × ধারার-ওজন), সর্বোচ্চ = Σ(২ × |ওজন|), সর্বনিম্ন = −সর্বোচ্চ। f = (কাঁচা − সর্বনিম্ন) ÷ (সর্বোচ্চ − সর্বনিম্ন)। শতাংশ = f^{curve} × ১০০, {min}–{max}-এর মধ্যে সীমিত।' },
      { h: '৬. “১০০-এর ভাগ” চার্ট', b: 'শুধু উপস্থাপনার জন্য: প্রতিটি শতাংশের ঘন (³) নিয়ে যোগফল ১০০-তে স্বাভাবিক করা হয়। এটি কোনো সম্ভাবনা নয়।' },
      { h: '৭. নেতার মিল', b: 'কেন্দ্রের বাইরে থাকলে দিক-খরচ ও দূরত্ব-খরচ ({rw} গুণক) মিলিয়ে নৈকট্য। কেন্দ্রের ভেতরে থাকলে সরাসরি দূরত্ব। মিল = ১০০ − (দূরত্ব ÷ ১৪১.৪২ × ৩৫), ৩০–৯৯-এর মধ্যে।' },
      { h: '৮. পাবলিক পরিসংখ্যানে গণনা', b: 'কমপক্ষে {minA}টি উত্তর, ≥{sl}% একদিকে নয় (≥১০টি সিদ্ধান্তসহ উত্তরে), এবং বেশির ভাগ নিরপেক্ষ নয়। নইলে বাদ পড়তে পারে।' }
    ],
    tableSummary: 'প্রতিটি প্রশ্নের ওজন',
    tableIntro: 'X/Y: একমত হলে কম্পাস কতটা ও কোন দিকে সরে (+ মানে বাজার/স্বাধীনতার দিক)। দিক: বিষয়ের বারে একমত হলে ডান (+) না বাম (−) প্রান্তের দিকে। ডান দিকের পাঁচ কলাম প্রতিটি ধারার অনুমিত উত্তরের ঝোঁক (+ মানে একমত হওয়ার সম্ভাবনা বেশি)।',
    tableHead: { id: 'নং', statement: 'বিবৃতি', x: 'X', y: 'Y', dir: 'দিক' },
    tracker: 'সেন্টিমেন্ট',
    download: 'CSV নামিয়ে নিন',
    shortBloc: { AL: 'আ.লীগ', BNP: 'বিএনপি', JI: 'জামায়াত', Student: 'NCP', Sushil: 'সুশীল' },
    csvName: 'bd-compass-scoring-weights.csv'
  },

  en: {
    badge: 'Open methodology',
    title: 'How this works',
    subtitle: 'The whole method in plain language. For the full formula and every weight, scroll to the bottom.',
    close: 'Close',
    gotIt: 'Got it',
    nav: ['Overview', 'How scoring works', 'Party match', 'Your data', 'FAQ', 'Full formula'],

    overviewTitle: 'The short version',
    steps: [
      { h: 'You react to {n} statements', b: 'Each one sets two legitimate values against each other. There are no right or wrong answers.' },
      { h: 'Each answer nudges your position', b: 'The stronger your agreement or disagreement, the bigger the nudge. “Neutral” does not move you at all.' },
      { h: 'You get a position on two axes', b: 'One axis is economic (state versus market). The other is about governance (control versus liberty).' },
      { h: 'Then come the comparisons', b: 'We show which bloc’s expected answers yours resemble most, and which leaders and country models sit closest to you.' }
    ],
    isTitle: 'What your result is',
    isItems: ['A summary of how you answered', 'A comparison with the five reference profiles used in this survey', 'A prompt to think about trade-offs between values'],
    isNotTitle: 'What it is not',
    isNotItems: ['Not a party membership or a declaration of support', 'Not an election forecast', 'Not a final verdict on you'],
    independent: 'This is an independent, non-partisan civic research project. It is not affiliated with any political party.',

    scoreTitle: 'How your answers become a score',
    scoreIntro: 'Every statement has five possible answers. Each one carries a “push”:',
    scale: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    scaleHelp: '+2 pushes twice as hard as +1. A zero does not move you at all.',
    directionNote: 'Which way the push goes depends on the statement. The same “agree” can move you toward the market side on one statement and toward the state side on another. That is why the statements are deliberately mixed.',
    tryTitle: 'Try it on a real question',
    tryHint: 'Pick an answer and watch the push:',
    tryPush: 'Push',
    tryWeight: 'this question’s weight',
    tryRight: 'toward the market side of the economic axis',
    tryLeft: 'toward the state side of the economic axis',
    tryNone: 'no movement',
    tryUnit: 'points',
    normalise: 'All pushes are added up and divided by the largest total push you could possibly have made. The result is a number from {neg} to +100 on each axis. Reaching ±100 means answering as strongly as possible in the same direction on every question that affects that axis, so most people land nearer the middle. That is normal, not a flaw.',
    axesTitle: 'The two axes',
    axisX: 'Economy (horizontal)',
    axisXLeft: 'State-led, redistribution and large projects',
    axisXRight: 'Free market, private ownership and market incentives',
    axisY: 'Governance (vertical)',
    axisYTop: 'Rule of law, checks and balances, free speech',
    axisYBottom: 'Strong central control and surveillance',
    centreNote: 'Within {r} points of the centre you fall in the “Centrist” zone.',
    compassMid: 'Centre',
    topicsTitle: 'The eight topic bars',
    topicsBody: 'Besides the compass, your result shows eight bars, one per topic. Each runs from {neg} to +100 between two poles. A bar within ±{lean} is read as balanced.',
    notCountTitle: 'What does not move your score',
    notCount: [
      'Neutral and skipped answers count as 0, so they move nothing.',
      '{s} questions about current affairs (extortion, the opposition in parliament, the July uprising) do not move your compass or topic bars. They only feed the public dashboard and the bloc comparison.'
    ],

    matchTitle: 'How the party match works',
    matchBody: 'For each bloc we wrote down how a typical supporter would probably answer every statement. The more your answers line up with a bloc’s expected answers, the higher its percentage.',
    matchWarn: 'These expected answers are our own editorial estimates. They are not official party positions and not survey measurements. We review them regularly, and every one is open in the “Full formula” section below.',
    blocsTitle: 'The five blocs in your result',
    blocsOrder: 'Listed alphabetically by English name',
    nonParty: 'Not a party',
    party: 'Political party',
    pctTitle: 'What the percentage means',
    pctBody: [
      'It is a comparison score, not a probability. 78% does not mean “78% likely to support this bloc.”',
      'Scores are kept between {min}% and {max}%, so no result ever reads as 0% or 100%.'
    ],
    typesTitle: 'Four kinds of result',
    types: [
      { h: 'Clear match', b: 'The top bloc scores {noMatch}% or more.' },
      { h: 'Close call', b: 'The top two blocs are less than {margin} points apart.' },
      { h: 'No clear match', b: 'No bloc reaches {noMatch}%.' },
      { h: 'Mixed', b: '{mixed}% or more of your answers are neutral or skipped.' }
    ],
    leadersTitle: 'Leaders and country models',
    leadersBody: 'Your compass position is compared with the positions of historical leaders. We look at the direction you lean first, then how strongly, so leaders on your side of the compass come up first. Country models are chosen by your quadrant (which corner of the compass you are in).',
    leadersWarn: 'The leaders’ positions are our own rough editorial estimates. They are not an endorsement or criticism of any leader. The comparison is for interest and discussion.',

    privacyTitle: 'Your data and survey safeguards',
    privacyCards: [
      { h: 'No name or phone number', b: 'There is no login. We do not ask for your name, phone number or email.' },
      { h: 'A random code in your browser', b: 'To stop one browser being counted many times in the public statistics, your browser creates a random code. It is not linked to who you are.' },
      { h: 'Only totals are published', b: 'Nobody can read or list individual responses. The dashboard shows aggregate numbers only.' },
      { h: 'Rushed responses are filtered', b: 'Responses submitted in under {sec} seconds are rejected. Submissions with very few answers, or with nearly every answer on the same side, can also be left out of the public statistics.' }
    ],
    limitsTitle: 'Limits you should know about',
    limits: [
      'No online survey can fully stop automated scripts, or one person using several browsers.',
      'Participants chose to take part. They are not a representative sample of the country.',
      'Question wording affects results. We wrote each question to balance both sides, but we do not claim perfect neutrality.',
      'So read the public statistics as an indicator, not as precise public opinion or an election forecast.'
    ],

    faqTitle: 'Frequently asked questions',
    faq: [
      { q: 'Is this a test? Which answer is correct?', a: 'No. There is no correct answer. Every statement sets two legitimate values against each other. We want your first honest reaction.' },
      { q: 'What if both sides sound right to me?', a: 'That is the real difficulty, and the point. Lean whichever way you tilt even slightly. If you truly cannot decide, choose “Neutral.” But if most of your answers are neutral, your result will read “Mixed.”' },
      { q: 'If a party appears in my result, do I support that party?', a: 'No. It only means your answers to these {n} statements resemble that bloc’s expected answers. It does not say how you will vote or whom you support.' },
      { q: 'Why does “agree” sometimes move me toward the market and sometimes toward the state?', a: 'On purpose. Some statements lean one way and some the opposite way. This catches the habit of saying “yes” to everything and brings out your actual position.' },
      { q: 'Why am I near the middle?', a: 'Reaching ±100 on an axis means answering as strongly as possible in the same direction on every question that affects it. Mixed views naturally land near the centre. Being in the middle is not a weakness.' },
      { q: 'Why did I get “No clear match” or “Mixed”?', a: '“Mixed” appears when {mixed}% or more of your answers are neutral or skipped. “No clear match” appears when no bloc reaches {noMatch}%. Both simply mean your views do not clearly line up with any of the five profiles. It is not an error.' },
      { q: 'Why do some questions name a party or a person?', a: 'Most do not. Where they do (for example the Awami League, Sheikh Hasina, Sheikh Mujibur Rahman or the Tawhidi Janata), the dispute itself is about that name. The question could not be understood without it.' },
      { q: 'Can anyone see my answers?', a: 'No. Nobody can read individual responses. Only aggregate totals are published. We do not collect your name, phone or email at all.' },
      { q: 'What if I take part again from the same browser?', a: 'The public statistics count one response per browser, so repeat attempts do not inflate the dashboard.' },
      { q: 'What if I think a weight for a bloc or leader is wrong?', a: 'Every weight is open in the “Full formula” section below. You can inspect it and download it as CSV. They are editorial estimates and are reviewed regularly.' },
      { q: 'Is the result an election forecast?', a: 'No. It reflects people who chose to take part, who are not a representative sample of the country. It cannot predict an election.' },
      { q: 'Who runs this? Is it linked to a party?', a: 'No. It is an independent, non-partisan civic research project, not affiliated with any political party.' }
    ],

    openTitle: 'Full formula (for researchers and the curious)',
    openIntro: 'Every scoring step, every threshold and every question weight is open here. Model version:',
    formulaSummary: 'Step-by-step formula',
    formulaSteps: [
      { h: '1. From answer to multiplier', b: 'Multiplier m = answer − 3 (so −2 to +2). A skipped question has m = 0.' },
      { h: '2. Compass coordinates', b: 'X = 100 × Σ(m × x-weight) ÷ Σ(2 × |x-weight|). Y is the same with y-weights.' },
      { h: '3. Quadrant', b: 'If the distance √(X² + Y²) ≤ {r}, you are “Centrist.” Otherwise the signs of X and Y pick one of the four corners.' },
      { h: '4. Topic bars', b: 'bar = 100 × Σ(m × direction × strength) ÷ Σ(2 × strength), where strength = max(|x|, |y|, 1). Direction +1 means agreeing moves you toward the right pole, −1 toward the left. Sentiment questions are excluded.' },
      { h: '5. Bloc similarity', b: 'For each bloc: raw = Σ(m × bloc-weight), max = Σ(2 × |weight|), min = −max. f = (raw − min) ÷ (max − min). Percentage = f^{curve} × 100, clamped to {min}–{max}.' },
      { h: '6. The “share of 100” chart', b: 'Presentation only: each percentage is cubed and the results are normalised to sum to 100. It is not a probability.' },
      { h: '7. Leader match', b: 'Outside the centre zone, direction cost and distance cost (×{rw}) are combined. Inside it, plain distance is used. Match = 100 − (distance ÷ 141.42 × 35), kept between 30 and 99.' },
      { h: '8. Counting in public statistics', b: 'At least {minA} answers, not ≥{sl}% on one side (among responses with ≥10 decided answers), and not mostly neutral. Otherwise a response can be left out.' }
    ],
    tableSummary: 'Weights for every question',
    tableIntro: 'X/Y: how far, and which way, agreeing moves the compass (+ is the market/liberty side). Dir: whether agreeing moves the topic bar toward the right (+) or left (−) pole. The five columns on the right show each bloc’s expected lean (+ means more likely to agree). Statements are shown in Bangla.',
    tableHead: { id: 'No.', statement: 'Statement', x: 'X', y: 'Y', dir: 'Dir' },
    tracker: 'Sentiment',
    download: 'Download CSV',
    shortBloc: { AL: 'AL', BNP: 'BNP', JI: 'JI', Student: 'NCP', Sushil: 'Civil' },
    csvName: 'bd-compass-scoring-weights.csv'
  }
};

// Short bloc descriptions. Same length and tone for every bloc on purpose.
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

// English labels for the eight topic bars (Bangla comes from THEMATIC_BLOCKS).
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

// ---------------------------------------------------------------------------
// Styles (scoped under .mm). Colours come from the app's existing CSS variables.
// ---------------------------------------------------------------------------
const CSS = `
.mm-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(0,0,0,.65);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:fadeIn .2s ease-out}
.mm{position:relative;display:flex;flex-direction:column;width:100%;max-width:880px;height:min(92vh,900px);background:var(--bg-primary);border:1px solid var(--border-subtle);border-radius:24px;box-shadow:0 25px 60px rgba(0,0,0,.3);overflow:hidden;animation:slideUp .3s ease-out;color:var(--text-primary)}
.mm *{box-sizing:border-box}
.mm-head{flex:none;padding:1.25rem 1.5rem 0;border-bottom:1px solid var(--border-subtle);background:var(--bg-primary)}
.mm-badge{display:inline-flex;align-items:center;gap:.4rem;padding:.25rem .7rem;border-radius:999px;font-size:.78rem;font-weight:700;color:var(--accent-gold);background:var(--accent-gold-glow);border:1px solid var(--border-gold)}
.mm-title{margin:.55rem 0 .25rem;font-size:clamp(1.45rem,3.4vw,1.9rem);font-weight:800;line-height:1.3;padding-right:2.6rem}
.mm-sub{margin:0 0 .9rem;font-size:.95rem;line-height:1.7;color:var(--text-muted);max-width:60ch}
.mm-close{position:absolute;top:.9rem;right:.9rem;display:grid;place-items:center;width:2.4rem;height:2.4rem;border-radius:50%;border:1px solid var(--border-subtle);background:var(--bg-secondary);color:var(--text-secondary);cursor:pointer}
.mm-close:hover{color:var(--text-primary)}
.mm-nav{display:flex;gap:.4rem;overflow-x:auto;padding:0 0 .85rem;scrollbar-width:none}
.mm-nav::-webkit-scrollbar{display:none}
.mm-chip{flex:none;display:inline-flex;align-items:center;gap:.4rem;padding:.45rem .8rem;border-radius:999px;border:1px solid var(--border-subtle);background:var(--bg-secondary);color:var(--text-secondary);font:inherit;font-size:.88rem;font-weight:600;cursor:pointer;white-space:nowrap}
.mm-chip[aria-current="true"]{background:var(--accent-gold-glow);border-color:var(--border-gold);color:var(--accent-gold)}
.mm-body{flex:1;overflow-y:auto;padding:1.25rem 1.5rem 1.5rem;scroll-behavior:smooth}
.mm-sec{padding:1.5rem 0;border-bottom:1px solid var(--border-subtle)}
.mm-sec:first-child{padding-top:.25rem}
.mm-sec:last-of-type{border-bottom:0}
.mm-h2{display:flex;align-items:center;gap:.6rem;margin:0 0 .9rem;font-size:1.3rem;font-weight:800;line-height:1.35}
.mm-h2 svg{flex:none;color:var(--accent-gold)}
.mm-h3{margin:1.4rem 0 .6rem;font-size:1.05rem;font-weight:800;line-height:1.4}
.mm p{margin:0 0 .75rem;font-size:1rem;line-height:1.8;color:var(--text-secondary)}
.mm-muted{color:var(--text-muted)!important;font-size:.9rem!important}
.mm-grid{display:grid;gap:.75rem}
.mm-grid.c2{grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))}
.mm-card{padding:1rem 1.1rem;border-radius:14px;background:var(--bg-secondary);border:1px solid var(--border-subtle)}
.mm-card h4{margin:0 0 .35rem;font-size:1rem;font-weight:800;line-height:1.4;color:var(--text-primary)}
.mm-card p{margin:0;font-size:.95rem;line-height:1.7}
.mm-step{display:flex;gap:.8rem}
.mm-num{flex:none;display:grid;place-items:center;width:2rem;height:2rem;border-radius:50%;background:var(--accent-gold-glow);border:1px solid var(--border-gold);color:var(--accent-gold);font-weight:800;font-size:.95rem}
.mm-list{margin:0;padding:0;list-style:none;display:grid;gap:.5rem}
.mm-list li{display:flex;gap:.55rem;font-size:.97rem;line-height:1.65;color:var(--text-secondary)}
.mm-list svg{flex:none;margin-top:.3rem}
.mm-yes svg{color:var(--accent-green)}
.mm-no svg{color:var(--accent-red)}
.mm-note{margin:1rem 0 0;padding:.85rem 1rem;border-radius:12px;border:1px solid var(--border-gold);background:var(--accent-gold-glow);font-size:.95rem;line-height:1.7;color:var(--text-secondary)}
.mm-scale{display:grid;grid-template-columns:repeat(5,1fr);gap:.4rem;margin:.25rem 0 .6rem}
.mm-tile{padding:.7rem .3rem;text-align:center;border-radius:12px;background:var(--bg-secondary);border:1px solid var(--border-subtle)}
.mm-tile b{display:block;font-size:1.35rem;line-height:1.2}
.mm-tile span{display:block;margin-top:.25rem;font-size:.82rem;line-height:1.35;color:var(--text-secondary)}
.mm-try{margin-top:1.1rem;padding:1.1rem;border-radius:16px;border:1px solid var(--border-subtle);background:var(--bg-secondary)}
.mm-try q{display:block;margin:.4rem 0 .9rem;font-size:1rem;line-height:1.75;font-style:normal;color:var(--text-primary);quotes:none}
.mm-opts{display:grid;grid-template-columns:repeat(5,1fr);gap:.4rem}
.mm-opt{padding:.6rem .2rem;border-radius:10px;border:1.5px solid var(--border-subtle);background:var(--bg-primary);color:var(--text-secondary);font:inherit;font-size:.82rem;line-height:1.3;cursor:pointer}
.mm-opt[aria-pressed="true"]{border-color:var(--accent-gold);background:var(--accent-gold-glow);color:var(--text-primary);font-weight:700}
.mm-res{margin-top:.9rem;font-size:.97rem;line-height:1.7;color:var(--text-secondary)}
.mm-res strong{color:var(--text-primary)}
.mm-meter{position:relative;height:10px;margin:.7rem 0 .4rem;border-radius:999px;background:var(--border-subtle)}
.mm-meter i{position:absolute;top:0;bottom:0;border-radius:999px;background:var(--accent-gold)}
.mm-meter u{position:absolute;left:50%;top:-3px;bottom:-3px;width:2px;background:var(--text-muted);text-decoration:none}
.mm-compass{display:grid;grid-template-columns:auto 1fr auto;grid-template-rows:auto 1fr auto;gap:.5rem;align-items:center;margin:.5rem 0 1rem}
.mm-ax{font-size:.85rem;line-height:1.45;color:var(--text-secondary);text-align:center}
.mm-quad{position:relative;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;min-height:200px;border:1px solid var(--border-subtle);border-radius:12px;overflow:hidden}
.mm-quad>div{display:grid;place-items:center;padding:.5rem;text-align:center;font-size:.85rem;font-weight:600;line-height:1.35;color:var(--text-muted);background:var(--bg-secondary)}
.mm-quad>div:nth-child(1),.mm-quad>div:nth-child(4){background:transparent}
.mm-quad>div:nth-child(1),.mm-quad>div:nth-child(3){border-right:1px solid var(--border-subtle)}
.mm-quad>div:nth-child(1),.mm-quad>div:nth-child(2){border-bottom:1px solid var(--border-subtle)}
.mm-mid{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:grid;place-items:center;width:3.6rem;height:3.6rem;border-radius:50%;background:var(--bg-primary);border:1.5px dashed var(--accent-gold);font-size:.78rem;font-weight:700;color:var(--accent-gold);text-align:center;line-height:1.2}
.mm-topics{display:grid;gap:.5rem}
.mm-topic{display:flex;flex-direction:column;gap:.15rem;padding:.7rem .9rem;border-radius:12px;background:var(--bg-secondary);border:1px solid var(--border-subtle)}
.mm-topic b{font-size:.97rem}
.mm-topic span{font-size:.9rem;color:var(--text-muted)}
.mm-bloc{display:flex;gap:.9rem;padding:1rem;border-radius:14px;background:var(--bg-secondary);border:1.5px solid var(--bloc-edge,var(--border-subtle))}
.mm-bloc h4{margin:0;font-size:1.05rem;font-weight:800;color:var(--bloc-color,var(--text-primary))}
.mm-kind{display:inline-block;margin:.15rem 0 .4rem;padding:.1rem .55rem;border-radius:999px;border:1px solid var(--border-subtle);font-size:.78rem;color:var(--text-muted)}
.mm-tags{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.5rem}
.mm-tags span{padding:.18rem .6rem;border-radius:999px;background:var(--bg-primary);border:1px solid var(--border-subtle);font-size:.82rem;color:var(--text-secondary)}
.mm-bloc p{margin:0;font-size:.95rem;line-height:1.7}
.mm-type{display:flex;gap:.7rem;padding:.7rem .9rem;border-radius:12px;background:var(--bg-secondary);border:1px solid var(--border-subtle)}
.mm-type b{flex:none;min-width:8.5rem;font-size:.95rem}
.mm-type span{font-size:.93rem;line-height:1.6;color:var(--text-secondary)}
.mm details{border:1px solid var(--border-subtle);border-radius:14px;background:var(--bg-secondary);margin-bottom:.6rem;overflow:hidden}
.mm summary{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.9rem 1.1rem;cursor:pointer;list-style:none;font-size:1rem;font-weight:700;line-height:1.5;color:var(--text-primary)}
.mm summary::-webkit-details-marker{display:none}
.mm summary svg{flex:none;transition:transform .2s;color:var(--text-muted)}
.mm details[open]>summary svg{transform:rotate(180deg)}
.mm details>div{padding:0 1.1rem 1rem}
.mm details>div p{margin:0 0 .6rem}
.mm-formula{display:grid;gap:.6rem}
.mm-formula div{padding:.75rem .9rem;border-radius:10px;background:var(--bg-primary);border:1px solid var(--border-subtle)}
.mm-formula b{display:block;margin-bottom:.15rem;font-size:.95rem;color:var(--text-primary)}
.mm-formula span{font-size:.92rem;line-height:1.7;color:var(--text-secondary)}
.mm-tablewrap{overflow-x:auto;margin-top:.7rem;border:1px solid var(--border-subtle);border-radius:10px}
.mm table{width:100%;border-collapse:collapse;font-size:.82rem}
.mm th,.mm td{padding:.5rem .55rem;text-align:center;border-bottom:1px solid var(--border-subtle);white-space:nowrap}
.mm th{background:var(--bg-primary);color:var(--text-primary);font-weight:700}
.mm td.st{min-width:340px;white-space:normal;text-align:left;line-height:1.55;color:var(--text-secondary)}
.mm td.pos{color:var(--accent-green);font-weight:700}
.mm td.neg{color:var(--accent-red);font-weight:700}
.mm-tracker{display:inline-block;margin-left:.35rem;padding:0 .4rem;border-radius:999px;border:1px solid var(--border-gold);font-size:.72rem;color:var(--accent-gold)}
.mm-btn{display:inline-flex;align-items:center;gap:.45rem;padding:.55rem 1rem;border-radius:10px;border:1px solid var(--border-subtle);background:var(--bg-primary);color:var(--text-primary);font:inherit;font-size:.9rem;font-weight:700;cursor:pointer}
.mm-foot{flex:none;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.8rem 1.5rem;border-top:1px solid var(--border-subtle);background:var(--bg-primary)}
.mm-foot small{font-size:.8rem;color:var(--text-muted)}
.mm-primary{padding:.7rem 1.8rem;border-radius:12px;border:0;background:var(--accent-gold);color:#1a1405;font:inherit;font-size:1rem;font-weight:800;cursor:pointer}
.mm :focus-visible{outline:2px solid var(--accent-gold);outline-offset:2px}
@media (max-width:640px){
  .mm-overlay{padding:0;align-items:flex-end}
  .mm{height:94vh;max-width:none;border-radius:20px 20px 0 0}
  .mm-head{padding:1rem 1rem 0}
  .mm-body{padding:1rem}
  .mm-foot{padding:.7rem 1rem}
  .mm-type{flex-direction:column;gap:.15rem}
  .mm-opt,.mm-tile span{font-size:.74rem}
  .mm-quad{min-height:170px}
}
@media (prefers-reduced-motion:reduce){.mm,.mm-overlay{animation:none}.mm-body{scroll-behavior:auto}}
`;

export default function MethodologyModal({ isOpen, onClose, lang }) {
  const L = lang === 'en' ? 'en' : 'bn';
  const isEn = L === 'en';
  const c = COPY[L];
  const num = (v) => (isEn ? String(v) : toBn(v));
  const sgn = (n) => `${n < 0 ? MINUS : n > 0 ? '+' : ''}${num(Math.abs(n))}`;

  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const bodyRef = useRef(null);
  const [active, setActive] = useState(SECTION_IDS[0]);
  const [demo, setDemo] = useState(4);

  // Escape to close, body scroll lock, focus trap, scroll-spy for the nav chips.
  useEffect(() => {
    if (!isOpen) return undefined;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll(
        'button, a[href], summary, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const scroller = bodyRef.current;
    const onScroll = () => {
      if (!scroller) return;
      const top = scroller.getBoundingClientRect().top;
      let current = SECTION_IDS[0];
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - top <= 90) current = id;
      });
      setActive(current);
    };

    document.addEventListener('keydown', handleKeyDown);
    scroller?.addEventListener('scroll', onScroll, { passive: true });
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      scroller?.removeEventListener('scroll', onScroll);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const total = QUESTIONS.length;
  const sentimentCount = QUESTIONS.filter((q) => q.kind === 'sentiment').length;
  const common = {
    n: num(total),
    s: num(sentimentCount),
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

  // Interactive example: a real market-economy question, so the weight shown is the real one.
  const demoQ = QUESTIONS.find((q) => q.id === 'q17' && q.x_weight) || QUESTIONS.find((q) => q.x_weight);
  const demoMult = demo - 3;
  const demoPush = demoQ ? Math.round(demoMult * demoQ.x_weight * 10) / 10 : 0;
  const demoMax = demoQ ? 2 * Math.abs(demoQ.x_weight) : 1;
  const demoSide = demoPush > 0 ? c.tryRight : demoPush < 0 ? c.tryLeft : c.tryNone;
  const scaleColors = ['--data-agree-bright', '--data-agree', '--data-neutral', '--data-disagree', '--data-disagree-bright'];
  const scaleFallback = ['#16a34a', '#4ade80', '#94a3b8', '#f87171', '#dc2626'];
  const scaleValues = [2, 1, 0, -1, -2];

  const quadName = (key) => (isEn ? QUADRANT_EN[key] : stripParen(QUADRANT_PROFILES?.[key]?.name));

  const blocOrder = ['AL', 'BNP', 'JI', 'Student', 'Sushil'].filter((k) => BLOC_PROFILES[k]);
  const blocKeys = Object.keys(BLOC_PROFILES);

  const downloadCsv = () => {
    const head = ['id', 'block', 'statement', 'x_weight', 'y_weight', 'direction', 'kind', ...blocKeys];
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = QUESTIONS.map((q) => [
      q.id, q.blockId, q.text, q.x_weight, q.y_weight, q.direction, q.kind || 'trade-off',
      ...blocKeys.map((k) => (q.bloc_weights || {})[k] ?? 0)
    ]);
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

  return createPortal(
    <div
      className="mm-overlay"
      lang={L}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{CSS}</style>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="mm-title" className="mm">
        <button ref={closeRef} onClick={onClose} className="mm-close" aria-label={c.close}>
          <X size={18} />
        </button>

        <header className="mm-head">
          <span className="mm-badge font-latin"><Sparkles size={14} />{c.badge}</span>
          <h2 id="mm-title" className="mm-title">{c.title}</h2>
          <p className="mm-sub">{c.subtitle}</p>
          <nav className="mm-nav" aria-label={c.title}>
            {SECTION_IDS.map((id, i) => {
              const Icon = SECTION_ICONS[i];
              return (
                <button key={id} className="mm-chip" aria-current={active === id} onClick={() => jump(id)}>
                  <Icon size={15} />{c.nav[i]}
                </button>
              );
            })}
          </nav>
        </header>

        <div ref={bodyRef} className="mm-body">
          {/* 1. Overview */}
          <section id="mm-overview" className="mm-sec">
            <h3 className="mm-h2"><Sparkles size={22} />{c.overviewTitle}</h3>
            <div className="mm-grid c2">
              {c.steps.map((s, i) => (
                <div key={i} className="mm-card mm-step">
                  <span className="mm-num font-latin">{num(i + 1)}</span>
                  <div>
                    <h4>{f(s.h)}</h4>
                    <p>{f(s.b)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mm-grid c2" style={{ marginTop: '1rem' }}>
              <div className="mm-card">
                <h4>{c.isTitle}</h4>
                <ul className="mm-list mm-yes">
                  {c.isItems.map((t) => <li key={t}><Check size={16} />{t}</li>)}
                </ul>
              </div>
              <div className="mm-card">
                <h4>{c.isNotTitle}</h4>
                <ul className="mm-list mm-no">
                  {c.isNotItems.map((t) => <li key={t}><X size={16} />{t}</li>)}
                </ul>
              </div>
            </div>
            <p className="mm-note">{c.independent}</p>
          </section>

          {/* 2. Scoring */}
          <section id="mm-score" className="mm-sec">
            <h3 className="mm-h2"><Calculator size={22} />{c.scoreTitle}</h3>
            <p>{c.scoreIntro}</p>
            <div className="mm-scale">
              {c.scale.map((label, i) => (
                <div key={label} className="mm-tile">
                  <b className="font-latin" style={{ color: `var(${scaleColors[i]}, ${scaleFallback[i]})` }}>
                    {sgn(scaleValues[i])}
                  </b>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <p className="mm-muted">{c.scaleHelp}</p>
            <p>{c.directionNote}</p>

            {demoQ && (
              <div className="mm-try">
                <strong>{c.tryTitle}</strong>
                <q>{demoQ.text}</q>
                <p className="mm-muted" style={{ margin: '0 0 .5rem' }}>{c.tryHint}</p>
                <div className="mm-opts" role="group" aria-label={c.tryHint}>
                  {c.scale.map((label, i) => (
                    <button
                      key={label}
                      type="button"
                      className="mm-opt"
                      aria-pressed={demo === 5 - i}
                      onClick={() => setDemo(5 - i)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="mm-res">
                  <strong>{c.tryPush}:</strong>{' '}
                  <span className="font-latin">
                    {sgn(demoMult)} × {num(demoQ.x_weight)} = <strong>{sgn(demoPush)}</strong>
                  </span>{' '}
                  {c.tryUnit}, {demoSide}.
                  <div className="mm-meter" aria-hidden="true">
                    <u />
                    <i
                      style={{
                        left: demoPush >= 0 ? '50%' : `${50 - (Math.abs(demoPush) / demoMax) * 50}%`,
                        width: `${(Math.abs(demoPush) / demoMax) * 50}%`
                      }}
                    />
                  </div>
                  <span className="mm-muted">{c.tryWeight}: <span className="font-latin">{num(demoQ.x_weight)}</span></span>
                </div>
              </div>
            )}

            <p style={{ marginTop: '1rem' }}>{f(c.normalise)}</p>

            <h4 className="mm-h3">{c.axesTitle}</h4>
            <div className="mm-compass">
              <span />
              <span className="mm-ax"><b>{c.axisY}</b><br />{c.axisYTop}</span>
              <span />
              <span className="mm-ax" style={{ maxWidth: '7rem' }}>{c.axisXLeft}</span>
              <div className="mm-quad">
                <div>{quadName('libertarian_left')}</div>
                <div>{quadName('libertarian_right')}</div>
                <div>{quadName('authoritarian_left')}</div>
                <div>{quadName('authoritarian_right')}</div>
                <span className="mm-mid">{c.compassMid}</span>
              </div>
              <span className="mm-ax" style={{ maxWidth: '7rem' }}>{c.axisXRight}</span>
              <span />
              <span className="mm-ax">{c.axisYBottom}</span>
              <span />
            </div>
            <p className="mm-muted">{c.axisX} / {c.axisY}. {f(c.centreNote)}</p>

            <h4 className="mm-h3">{c.topicsTitle}</h4>
            <p>{f(c.topicsBody)}</p>
            <div className="mm-topics">
              {THEMATIC_BLOCKS.map((b) => {
                const en = BLOCK_EN[b.key];
                return (
                  <div key={b.id} className="mm-topic">
                    <b>{isEn ? (en?.title || b.title) : b.title}</b>
                    <span>
                      {isEn ? (en?.left || b.leftShort) : b.leftShort} ↔ {isEn ? (en?.right || b.rightShort) : b.rightShort}
                    </span>
                  </div>
                );
              })}
            </div>

            <h4 className="mm-h3">{c.notCountTitle}</h4>
            <ul className="mm-list">
              <li><Check size={16} style={{ color: 'var(--text-muted)' }} />{c.notCount[0]}</li>
              {sentimentCount > 0 && <li><Check size={16} style={{ color: 'var(--text-muted)' }} />{f(c.notCount[1])}</li>}
            </ul>
          </section>

          {/* 3. Match */}
          <section id="mm-match" className="mm-sec">
            <h3 className="mm-h2"><Landmark size={22} />{c.matchTitle}</h3>
            <p>{c.matchBody}</p>
            <p className="mm-note">{c.matchWarn}</p>

            <h4 className="mm-h3">{c.blocsTitle}</h4>
            <p className="mm-muted">{c.blocsOrder}</p>
            <div className="mm-grid">
              {blocOrder.map((k) => {
                const p = BLOC_PROFILES[k];
                const info = BLOC_COPY[k];
                return (
                  <div key={k} className="mm-bloc" style={{ '--bloc-color': p.color, '--bloc-edge': `${p.color}55` }}>
                    <BlocLogo blocKey={k} size={44} />
                    <div style={{ minWidth: 0 }}>
                      <h4>{isEn ? info?.en : p.name}</h4>
                      <span className="mm-kind">{info?.kind === 'view' ? c.nonParty : c.party}</span>
                      <p>{info?.text[L]}</p>
                      <div className="mm-tags">
                        {(info?.tags[L] || []).map((t) => <span key={t}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <h4 className="mm-h3">{c.pctTitle}</h4>
            {c.pctBody.map((t) => <p key={t}>{f(t)}</p>)}

            <h4 className="mm-h3">{c.typesTitle}</h4>
            <div className="mm-grid">
              {c.types.map((t) => (
                <div key={t.h} className="mm-type"><b>{t.h}</b><span>{f(t.b)}</span></div>
              ))}
            </div>

            <h4 className="mm-h3">{c.leadersTitle}</h4>
            <p>{c.leadersBody}</p>
            <p className="mm-note">{c.leadersWarn}</p>
          </section>

          {/* 4. Privacy */}
          <section id="mm-privacy" className="mm-sec">
            <h3 className="mm-h2"><Lock size={22} />{c.privacyTitle}</h3>
            <div className="mm-grid c2">
              {c.privacyCards.map((card) => (
                <div key={card.h} className="mm-card"><h4>{card.h}</h4><p>{f(card.b)}</p></div>
              ))}
            </div>
            <h4 className="mm-h3">{c.limitsTitle}</h4>
            <ul className="mm-list">
              {c.limits.map((t) => <li key={t}><Check size={16} style={{ color: 'var(--text-muted)' }} />{t}</li>)}
            </ul>
          </section>

          {/* 5. FAQ */}
          <section id="mm-faq" className="mm-sec">
            <h3 className="mm-h2"><HelpCircle size={22} />{c.faqTitle}</h3>
            {c.faq.map((item) => (
              <details key={item.q}>
                <summary>{item.q}<ChevronDown size={18} /></summary>
                <div><p>{f(item.a)}</p></div>
              </details>
            ))}
          </section>

          {/* 6. Open formula */}
          <section id="mm-open" className="mm-sec">
            <h3 className="mm-h2"><FileText size={22} />{c.openTitle}</h3>
            <p>{c.openIntro} <code className="font-latin">{MODEL_VERSION}</code></p>

            <details>
              <summary>{c.formulaSummary}<ChevronDown size={18} /></summary>
              <div className="mm-formula">
                {c.formulaSteps.map((s) => (
                  <div key={s.h}><b>{s.h}</b><span>{f(s.b)}</span></div>
                ))}
              </div>
            </details>

            <details>
              <summary>{c.tableSummary}<ChevronDown size={18} /></summary>
              <div>
                <p className="mm-muted">{c.tableIntro}</p>
                <button type="button" className="mm-btn" onClick={downloadCsv}><Download size={16} />{c.download}</button>
                <div className="mm-tablewrap">
                  <table className="font-latin">
                    <thead>
                      <tr>
                        <th>{c.tableHead.id}</th>
                        <th style={{ textAlign: 'left' }}>{c.tableHead.statement}</th>
                        <th>{c.tableHead.x}</th>
                        <th>{c.tableHead.y}</th>
                        <th>{c.tableHead.dir}</th>
                        {blocKeys.map((k) => <th key={k}>{c.shortBloc[k] || k}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {QUESTIONS.map((q) => (
                        <tr key={q.id}>
                          <td>{q.id.replace('q', '')}</td>
                          <td className="st">
                            {q.text}
                            {q.kind === 'sentiment' && <span className="mm-tracker">{c.tracker}</span>}
                          </td>
                          <td className={cls(q.x_weight)}>{q.x_weight ? signed(q.x_weight) : '0'}</td>
                          <td className={cls(q.y_weight)}>{q.y_weight ? signed(q.y_weight) : '0'}</td>
                          <td>{q.kind === 'sentiment' ? '–' : signed(q.direction)}</td>
                          {blocKeys.map((k) => {
                            const w = (q.bloc_weights || {})[k] ?? 0;
                            return <td key={k} className={cls(w)}>{w ? signed(w) : '0'}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </details>
          </section>
        </div>

        <footer className="mm-foot">
          <small className="font-latin">{MODEL_VERSION}</small>
          <button type="button" className="mm-primary" onClick={onClose}>{c.gotIt}</button>
        </footer>
      </div>
    </div>,
    document.body
  );
}