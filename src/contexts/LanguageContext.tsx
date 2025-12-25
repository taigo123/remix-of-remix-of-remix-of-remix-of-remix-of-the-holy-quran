import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Extended language support - 40+ languages from Quran.com
// Removed: my, km, lo, ig, fil, gu, mr, pa, sr, hr, sl, mk, tg - not available correctly in API
export type Language = 
  | 'ar' | 'en' | 'fr' | 'ur' | 'id' | 'tr' | 'it' | 'de' | 'es' | 'pt' 
  | 'ru' | 'bn' | 'fa' | 'hi' | 'ms' | 'nl' | 'pl' | 'ro' | 'sv' | 'th'
  | 'vi' | 'zh' | 'ja' | 'ko' | 'uz' | 'az' | 'kk' | 'ky' | 'tt'
  | 'bs' | 'sq' | 'bg' | 'cs' | 'sk' | 'uk'
  | 'am' | 'so' | 'sw' | 'ha' | 'yo' | 'ml' | 'ta' | 'te'
  | 'si' | 'ne' | 'dv';

export type LanguageRegion = 'original' | 'european' | 'asian' | 'african' | 'middleeast';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  translationId?: number;
  translator?: string;
  source?: string;
  region: LanguageRegion;
}

export const regionLabels: Record<LanguageRegion, { ar: string; en: string }> = {
  original: { ar: 'النص الأصلي', en: 'Original Text' },
  european: { ar: 'اللغات الأوروبية', en: 'European Languages' },
  asian: { ar: 'اللغات الآسيوية', en: 'Asian Languages' },
  african: { ar: 'اللغات الأفريقية', en: 'African Languages' },
  middleeast: { ar: 'لغات الشرق الأوسط', en: 'Middle Eastern Languages' },
};

export const languages: LanguageInfo[] = [
  // Arabic (Original - no translation needed)
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', translator: 'النص الأصلي', source: 'القرآن الكريم', region: 'original' },
  
  // Major European Languages
  { code: 'en', name: 'English', nativeName: 'English', translationId: 131, translator: 'Sahih International', source: 'Dar Abul-Qasim Publishing', region: 'european' },
  { code: 'fr', name: 'French', nativeName: 'Français', translationId: 136, translator: 'Muhammad Hamidullah', source: 'King Fahd Complex', region: 'european' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', translationId: 27, translator: 'Bubenheim & Elyas', source: 'King Fahd Complex', region: 'european' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', translationId: 140, translator: 'Muhammad Isa Garcia', source: 'King Fahd Complex', region: 'european' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', translationId: 43, translator: 'Samir El-Hayek', source: 'King Fahd Complex', region: 'european' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', translationId: 153, translator: 'Hamza Roberto Piccardo', source: 'UCOII', region: 'european' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', translationId: 235, translator: 'Sofian S. Siregar', source: 'Quran.com', region: 'european' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', translationId: 42, translator: 'Józef Bielawski', source: 'King Fahd Complex', region: 'european' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', translationId: 44, translator: 'George Grigore', source: 'King Fahd Complex', region: 'european' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', translationId: 48, translator: 'Knut Bernström', source: 'King Fahd Complex', region: 'european' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', translationId: 26, translator: 'Ivan Hrbek', source: 'King Fahd Complex', region: 'european' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', translationId: 47, translator: 'Slovak Translation', source: 'King Fahd Complex', region: 'european' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', translationId: 45, translator: 'Elmir Kuliev', source: 'King Fahd Complex', region: 'european' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', translationId: 217, translator: 'Mykhaylo Yakubovych', source: 'Quran.com', region: 'european' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', translationId: 237, translator: 'Tzvetan Theophanov', source: 'Quran.com', region: 'european' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', translationId: 25, translator: 'Besim Korkut', source: 'King Fahd Complex', region: 'european' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', translationId: 89, translator: 'Sherif Ahmeti', source: 'King Fahd Complex', region: 'european' },
  
  // Middle Eastern Languages
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', translationId: 210, translator: 'Diyanet Vakfı', source: 'Diyanet İşleri', region: 'middleeast' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', translationId: 29, translator: 'Hussain Fooladvand', source: 'King Fahd Complex', region: 'middleeast' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', translationId: 23, translator: 'Vasim Mammadaliyev', source: 'King Fahd Complex', region: 'middleeast' },
  { code: 'dv', name: 'Dhivehi', nativeName: 'ދިވެހި', translationId: 86, translator: "Office of the President", source: 'Maldives Government', region: 'middleeast' },
  
  // Asian Languages
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', translationId: 234, translator: 'Fateh Muhammad Jalandhry', source: 'King Fahd Complex', region: 'asian' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', translationId: 122, translator: 'Muhammad Farooq Khan', source: 'King Fahd Complex', region: 'asian' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', translationId: 163, translator: 'Muhiuddin Khan', source: 'King Fahd Complex', region: 'asian' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', translationId: 229, translator: 'Jan Trust Foundation', source: 'Quran.com', region: 'asian' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', translationId: 227, translator: 'Maulana Abder-Rahim', source: 'Quran.com', region: 'asian' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', translationId: 37, translator: 'Abdul-Hamid Haidar', source: 'King Fahd Complex', region: 'asian' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', translationId: 228, translator: 'Ruwwad Center', source: 'Quran.com', region: 'asian' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', translationId: 108, translator: 'Ahl Al-Hadith', source: 'Quran.com', region: 'asian' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', translationId: 134, translator: 'Kementerian Agama', source: 'Kemenag RI', region: 'asian' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', translationId: 39, translator: 'Abdullah Basmeih', source: 'King Fahd Complex', region: 'asian' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', translationId: 51, translator: 'King Fahad Complex', source: 'King Fahd Complex', region: 'asian' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', translationId: 177, translator: 'Ruwwad Center', source: 'Quran.com', region: 'asian' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', translationId: 56, translator: 'Ma Jian', source: 'King Fahd Complex', region: 'asian' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', translationId: 35, translator: 'Ryoichi Mita', source: 'King Fahd Complex', region: 'asian' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', translationId: 36, translator: 'Korean Translation', source: 'King Fahd Complex', region: 'asian' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek', translationId: 127, translator: 'Muhammad Sodik', source: 'King Fahd Complex', region: 'asian' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ', translationId: 222, translator: 'Khalifa Altay', source: 'King Fahd Complex', region: 'asian' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргыз', translationId: 223, translator: 'Sooronbay Jdanov', source: 'Quran.com', region: 'asian' },
  { code: 'tt', name: 'Tatar', nativeName: 'Татар', translationId: 53, translator: 'Yakub Ibn Nugman', source: 'King Fahd Complex', region: 'asian' },
  
  
  // African Languages
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', translationId: 87, translator: 'Sadiq & Sani', source: 'King Fahd Complex', region: 'african' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', translationId: 46, translator: 'Mahmud Muhammad Abduh', source: 'King Fahd Complex', region: 'african' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', translationId: 49, translator: 'Ali Muhsin Al-Barwani', source: 'King Fahd Complex', region: 'african' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', translationId: 32, translator: 'Abubakar Mahmud Gumi', source: 'King Fahd Complex', region: 'african' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', translationId: 125, translator: 'Shaykh Abu Rahimah', source: 'Quran.com', region: 'african' },
];

// Basic UI translations (we'll keep Arabic, English as primary, others will use English fallback for UI)
const baseTranslations = {
  title: 'القرآن الكريم',
  quran: 'القرآن',
  holyQuran: 'القرآن الكريم',
  home: 'الرئيسية',
  index: 'الفهرس',
  settings: 'الإعدادات',
  search: 'البحث',
  searchPlaceholder: 'ابحث في السور...',
  athkar: 'الأذكار والأدعية',
  appearance: 'المظهر',
  lightMode: 'الوضع النهاري',
  darkMode: 'الوضع الليلي',
  language: 'اللغة',
  about: 'عن التطبيق',
  aboutText: 'تطبيق القرآن الكريم مع 14 تفسير موثوق و6 قراء مميزين. اقرأ واستمع وتدبر آيات الله.',
  quickNavigation: 'التنقل السريع',
  surahIndex: 'فهرس السور',
  browseSurahs: 'تصفح سور القرآن الكريم',
  dragToScroll: 'اسحب للتصفح أو استخدم الأسهم',
  viewFullIndex: 'عرض الفهرس الكامل',
  verse: 'آية',
  verses: 'آية',
  meccan: 'مكية',
  medinan: 'مدنية',
  available: 'متوفر',
  surah: 'سورة',
  tafsir: 'التفسير',
  tafsirSource: 'مصدر التفسير',
  compareTafsirs: 'مقارنة تفسيرين',
  hideTafsir: 'إخفاء التفسير',
  showTafsir: 'إظهار التفسير',
  benefits: 'الفوائد',
  aboutSurah: 'نبذة عن السورة',
  listenToRecitation: 'استمع لتلاوة كل آية بصوت 6 قراء مختلفين',
  reciters: 'قراء',
  features: 'مميزات التطبيق',
  allInOnePlace: 'كل ما تحتاجه في مكان واحد',
  comprehensiveApp: 'تطبيق شامل للقرآن الكريم يجمع بين القراءة والاستماع والتفسير',
  trustedTafsirs: 'تفسير موثوق',
  fromMajorBooks: 'من أمهات كتب التفسير',
  distinguishedReciters: 'قراء مميزين',
  beautifulRecitations: 'تلاوات بأصوات عذبة',
  advancedSearch: 'بحث متقدم',
  searchInVerses: 'ابحث في الآيات والتفاسير',
  favorites: 'المفضلة',
  saveYourFavorites: 'احفظ آياتك المفضلة',
  listenVerseByVerse: 'استماع آية بآية',
  orFullSurah: 'أو السورة كاملة',
  fullSurahs: 'سورة كاملة',
  uthmaniScript: 'القرآن الكريم بالرسم العثماني',
  bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  bookOfAllah: 'كتاب الله المبين',
  readListenReflect: 'اقرأ واستمع وتدبر آيات الله بتفسير شامل من أمهات كتب التفسير',
  juz: 'جزء',
  athkarAndDuas: 'الأذكار والأدعية',
  electronicMushaf: 'المصحف الإلكتروني',
  allRightsReserved: 'جميع الحقوق محفوظة',
  trustedTafsirsList: 'التفاسير الموثوقة: ابن كثير | الطبري | السعدي | التفسير الميسر | الجلالين',
  translation: 'الترجمة',
  ttsWarning: 'تنبيه: صوت الترجمة قد لا يكون دقيقاً في نطق بعض الكلمات الإسلامية',
};

const englishTranslations = {
  title: 'The Holy Quran',
  quran: 'Quran',
  holyQuran: 'The Holy Quran',
  home: 'Home',
  index: 'Index',
  settings: 'Settings',
  search: 'Search',
  searchPlaceholder: 'Search surahs...',
  athkar: 'Athkar & Duas',
  appearance: 'Appearance',
  lightMode: 'Light Mode',
  darkMode: 'Dark Mode',
  language: 'Language',
  about: 'About App',
  aboutText: 'Quran app with 14 trusted Tafsirs and 6 distinguished reciters. Read, listen and reflect on the verses of Allah.',
  quickNavigation: 'Quick Navigation',
  surahIndex: 'Surah Index',
  browseSurahs: 'Browse the Surahs of the Holy Quran',
  dragToScroll: 'Drag to scroll or use arrows',
  viewFullIndex: 'View Full Index',
  verse: 'verse',
  verses: 'verses',
  meccan: 'Meccan',
  medinan: 'Medinan',
  available: 'Available',
  surah: 'Surah',
  tafsir: 'Tafsir',
  tafsirSource: 'Tafsir Source',
  compareTafsirs: 'Compare Tafsirs',
  hideTafsir: 'Hide Tafsir',
  showTafsir: 'Show Tafsir',
  benefits: 'Benefits',
  aboutSurah: 'About this Surah',
  listenToRecitation: 'Listen to each verse by 6 different reciters',
  reciters: 'reciters',
  features: 'App Features',
  allInOnePlace: 'Everything you need in one place',
  comprehensiveApp: 'A comprehensive Quran app combining reading, listening, and interpretation',
  trustedTafsirs: 'trusted Tafsirs',
  fromMajorBooks: 'From major Tafsir books',
  distinguishedReciters: 'distinguished reciters',
  beautifulRecitations: 'Beautiful recitations',
  advancedSearch: 'Advanced Search',
  searchInVerses: 'Search in verses and Tafsirs',
  favorites: 'Favorites',
  saveYourFavorites: 'Save your favorite verses',
  listenVerseByVerse: 'Listen verse by verse',
  orFullSurah: 'or full surah',
  fullSurahs: 'full surahs',
  uthmaniScript: 'Quran in Uthmani Script',
  bismillah: 'In the name of Allah, the Most Gracious, the Most Merciful',
  bookOfAllah: 'The Book of Allah',
  readListenReflect: 'Read, listen, and reflect on the verses of Allah with comprehensive Tafsir',
  juz: 'Juz',
  athkarAndDuas: 'Athkar & Duas',
  electronicMushaf: 'Electronic Mushaf',
  allRightsReserved: 'All rights reserved',
  trustedTafsirsList: 'Trusted Tafsirs: Ibn Kathir | Tabari | Saadi | Muyassar | Jalalayn',
  translation: 'Translation',
  ttsWarning: 'Note: Audio may not accurately pronounce some Islamic terms',
};

type TranslationStrings = typeof baseTranslations;

export const translations: Record<Language, TranslationStrings> = {
  ar: baseTranslations,
  en: englishTranslations,
  fr: {
    ...englishTranslations,
    title: 'Le Saint Coran',
    quran: 'Coran',
    holyQuran: 'Le Saint Coran',
    home: 'Accueil',
    index: 'Index',
    settings: 'Paramètres',
    search: 'Recherche',
    searchPlaceholder: 'Rechercher des sourates...',
    language: 'Langue',
    translation: 'Traduction',
    bismillah: 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux',
  },
  ur: {
    ...englishTranslations,
    title: 'قرآن پاک',
    quran: 'قرآن',
    holyQuran: 'قرآن پاک',
    home: 'ہوم',
    index: 'اشاریہ',
    settings: 'ترتیبات',
    search: 'تلاش',
    searchPlaceholder: 'سورتیں تلاش کریں...',
    language: 'زبان',
    translation: 'ترجمہ',
    bismillah: 'بِسْمِ اللہِ الرَّحْمٰنِ الرَّحِیْمِ',
  },
  id: {
    ...englishTranslations,
    title: 'Al-Quran Al-Karim',
    quran: 'Al-Quran',
    holyQuran: 'Al-Quran Al-Karim',
    home: 'Beranda',
    index: 'Indeks',
    settings: 'Pengaturan',
    search: 'Pencarian',
    searchPlaceholder: 'Cari surah...',
    language: 'Bahasa',
    translation: 'Terjemahan',
    bismillah: 'Dengan nama Allah, Yang Maha Pengasih, Maha Penyayang',
  },
  tr: {
    ...englishTranslations,
    title: "Kur'an-ı Kerim",
    quran: "Kur'an",
    holyQuran: "Kur'an-ı Kerim",
    home: 'Ana Sayfa',
    index: 'İndeks',
    settings: 'Ayarlar',
    search: 'Arama',
    searchPlaceholder: 'Sure ara...',
    language: 'Dil',
    translation: 'Çeviri',
    bismillah: 'Rahmân ve Rahîm olan Allah\'ın adıyla',
  },
  it: {
    ...englishTranslations,
    title: 'Il Sacro Corano',
    quran: 'Corano',
    holyQuran: 'Il Sacro Corano',
    home: 'Home',
    index: 'Indice',
    settings: 'Impostazioni',
    search: 'Cerca',
    searchPlaceholder: 'Cerca sure...',
    language: 'Lingua',
    translation: 'Traduzione',
    bismillah: 'In nome di Allah, il Clemente, il Misericordioso',
  },
  // All other languages will use English as fallback for UI
  de: { ...englishTranslations, title: 'Der Heilige Quran', language: 'Sprache', translation: 'Übersetzung' },
  es: { ...englishTranslations, title: 'El Sagrado Corán', language: 'Idioma', translation: 'Traducción' },
  pt: { ...englishTranslations, title: 'O Sagrado Alcorão', language: 'Idioma', translation: 'Tradução' },
  ru: { ...englishTranslations, title: 'Священный Коран', language: 'Язык', translation: 'Перевод' },
  bn: { ...englishTranslations, title: 'পবিত্র কুরআন', language: 'ভাষা', translation: 'অনুবাদ' },
  fa: { ...englishTranslations, title: 'قرآن کریم', language: 'زبان', translation: 'ترجمه' },
  hi: { ...englishTranslations, title: 'पवित्र कुरान', language: 'भाषा', translation: 'अनुवाद' },
  ms: { ...englishTranslations, title: 'Al-Quran Al-Karim', language: 'Bahasa', translation: 'Terjemahan' },
  nl: { ...englishTranslations, title: 'De Heilige Koran', language: 'Taal', translation: 'Vertaling' },
  pl: { ...englishTranslations, title: 'Święty Koran', language: 'Język', translation: 'Tłumaczenie' },
  ro: { ...englishTranslations, title: 'Sfântul Coran', language: 'Limbă', translation: 'Traducere' },
  sv: { ...englishTranslations, title: 'Den Heliga Koranen', language: 'Språk', translation: 'Översättning' },
  th: { ...englishTranslations, title: 'อัลกุรอาน', language: 'ภาษา', translation: 'การแปล' },
  vi: { ...englishTranslations, title: 'Kinh Thánh Quran', language: 'Ngôn ngữ', translation: 'Bản dịch' },
  zh: { ...englishTranslations, title: '神圣古兰经', language: '语言', translation: '翻译' },
  ja: { ...englishTranslations, title: '聖クルアーン', language: '言語', translation: '翻訳' },
  ko: { ...englishTranslations, title: '성 꾸란', language: '언어', translation: '번역' },
  uz: { ...englishTranslations, title: 'Qur\'oni Karim', language: 'Til', translation: 'Tarjima' },
  az: { ...englishTranslations, title: 'Müqəddəs Quran', language: 'Dil', translation: 'Tərcümə' },
  kk: { ...englishTranslations, title: 'Құран Кәрім', language: 'Тіл', translation: 'Аударма' },
  ky: { ...englishTranslations, title: 'Куран Карим', language: 'Тил', translation: 'Котормо' },
  tt: { ...englishTranslations, title: 'Коръән Кәрим', language: 'Тел', translation: 'Тәрҗемә' },
  bs: { ...englishTranslations, title: 'Sveti Kuran', language: 'Jezik', translation: 'Prijevod' },
  sq: { ...englishTranslations, title: 'Kurani i Shenjtë', language: 'Gjuha', translation: 'Përkthimi' },
  bg: { ...englishTranslations, title: 'Свещеният Коран', language: 'Език', translation: 'Превод' },
  cs: { ...englishTranslations, title: 'Svatý Korán', language: 'Jazyk', translation: 'Překlad' },
  sk: { ...englishTranslations, title: 'Svätý Korán', language: 'Jazyk', translation: 'Preklad' },
  uk: { ...englishTranslations, title: 'Священний Коран', language: 'Мова', translation: 'Переклад' },
  am: { ...englishTranslations, title: 'ቅዱስ ቁርዓን', language: 'ቋንቋ', translation: 'ትርጉም' },
  so: { ...englishTranslations, title: 'Quraanka Kariimka', language: 'Luuqadda', translation: 'Turjumaad' },
  sw: { ...englishTranslations, title: 'Qurani Tukufu', language: 'Lugha', translation: 'Tafsiri' },
  ha: { ...englishTranslations, title: 'Alƙur\'ani Mai Tsarki', language: 'Harshe', translation: 'Fassara' },
  yo: { ...englishTranslations, title: 'Al-Kurani Mimọ', language: 'Èdè', translation: 'Ìtumọ̀' },
  ml: { ...englishTranslations, title: 'വിശുദ്ധ ഖുർആൻ', language: 'ഭാഷ', translation: 'വിവർത്തനം' },
  ta: { ...englishTranslations, title: 'புனித குர்ஆன்', language: 'மொழி', translation: 'மொழிபெயர்ப்பு' },
  te: { ...englishTranslations, title: 'పవిత్ర ఖురాన్', language: 'భాష', translation: 'అనువాదం' },
  si: { ...englishTranslations, title: 'ශුද්ධ වූ කුර්ආනය', language: 'භාෂාව', translation: 'පරිවර්තනය' },
  ne: { ...englishTranslations, title: 'पवित्र कुरान', language: 'भाषा', translation: 'अनुवाद' },
  dv: { ...englishTranslations, title: 'ކީރިތި ޤުރުއާން', language: 'ބަސް', translation: 'ތަރުޖަމާ' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationStrings;
  isRtl: boolean;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const rtlLanguages: Language[] = ['ar', 'ur', 'fa', 'dv'];

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('quran-app-language');
    return (saved as Language) || 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('quran-app-language', lang);
  };

  const isRtl = rtlLanguages.includes(language);
  const dir = isRtl ? 'rtl' : 'ltr';
  const t = translations[language] || translations.en;

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Helper function to get translation ID for a language
export const getTranslationId = (langCode: Language): number | undefined => {
  const lang = languages.find(l => l.code === langCode);
  return lang?.translationId;
};
