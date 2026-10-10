const fs = require('fs');
const content = `

export const QUADRANT_PROFILES = {
  libertarian_left: {
    key: 'libertarian_left',
    name: 'স্বাধীনতাবাদী বাম (Libertarian Left)',
    color: '#10B981',
    description: 'আপনি অর্থনৈতিক সমতা এবং ব্যক্তিগত স্বাধীনতার পক্ষে। আপনি রাষ্ট্রীয় ক্ষমতার বিকেন্দ্রীকরণ এবং সামাজিক ন্যায়বিচারের ওপর জোর দেন।'
  },
  libertarian_right: {
    key: 'libertarian_right',
    name: 'স্বাধীনতাবাদী ডান (Libertarian Right)',
    color: '#3B82F6',
    description: 'আপনি মুক্তবাজার অর্থনীতি এবং ব্যক্তিগত স্বাধীনতার পক্ষে। আপনি মনে করেন রাষ্ট্রের নিয়ন্ত্রণ ন্যূনতম হওয়া উচিত।'
  },
  authoritarian_left: {
    key: 'authoritarian_left',
    name: 'কর্তৃত্ববাদী বাম (Authoritarian Left)',
    color: '#EF4444',
    description: 'আপনি রাষ্ট্রের মাধ্যমে অর্থনৈতিক সমতা নিশ্চিত করার পক্ষে। আপনি মনে করেন জনকল্যাণে শক্তিশালী রাষ্ট্রীয় নিয়ন্ত্রণ প্রয়োজন।'
  },
  authoritarian_right: {
    key: 'authoritarian_right',
    name: 'কর্তৃত্ববাদী ডান (Authoritarian Right)',
    color: '#F59E0B',
    description: 'আপনি ঐতিহ্য, শৃঙ্খলা এবং শক্তিশালী রাষ্ট্রের পক্ষে। পাশাপাশি আপনি পুঁজিবাদী অর্থনীতি ও ব্যক্তিগত সম্পত্তির অধিকার সমর্থন করেন।'
  },
  centrist: {
    key: 'centrist',
    name: 'মধ্যপন্থী (Centrist)',
    color: '#94A3B8',
    description: 'আপনি রাজনৈতিক ও অর্থনৈতিক নীতিতে একটি ভারসাম্যপূর্ণ অবস্থান পছন্দ করেন। চরমপন্থার বদলে আপনি বাস্তবসম্মত সমাধান খোঁজেন।'
  }
};
`;
fs.appendFileSync('src/data/questions.js', content, 'utf8');
console.log("Appended QUADRANT_PROFILES");
