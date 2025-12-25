import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ar' | 'en' | 'fr' | 'ur' | 'id' | 'tr' | 'it';

export const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
];

export const translations: Record<Language, {
  // عام
  title: string;
  quran: string;
  holyQuran: string;
  home: string;
  index: string;
  settings: string;
  search: string;
  searchPlaceholder: string;
  
  // القائمة الجانبية
  athkar: string;
  appearance: string;
  lightMode: string;
  darkMode: string;
  language: string;
  about: string;
  aboutText: string;
  quickNavigation: string;
  
  // الفهرس
  surahIndex: string;
  browseSurahs: string;
  dragToScroll: string;
  viewFullIndex: string;
  verse: string;
  verses: string;
  meccan: string;
  medinan: string;
  available: string;
  
  // صفحة السورة
  surah: string;
  tafsir: string;
  tafsirSource: string;
  compareTafsirs: string;
  hideTafsir: string;
  showTafsir: string;
  benefits: string;
  aboutSurah: string;
  listenToRecitation: string;
  reciters: string;
  
  // المميزات
  features: string;
  allInOnePlace: string;
  comprehensiveApp: string;
  trustedTafsirs: string;
  fromMajorBooks: string;
  distinguishedReciters: string;
  beautifulRecitations: string;
  advancedSearch: string;
  searchInVerses: string;
  favorites: string;
  saveYourFavorites: string;
  listenVerseByVerse: string;
  orFullSurah: string;
  fullSurahs: string;
  uthmaniScript: string;
  
  // البسملة
  bismillah: string;
  bookOfAllah: string;
  readListenReflect: string;
  
  // إحصائيات
  juz: string;
  
  // الأذكار
  athkarAndDuas: string;
  
  // الفوتر
  electronicMushaf: string;
  allRightsReserved: string;
  trustedTafsirsList: string;
  // ترجمة الآية
  translation: string;
  // تحذير صوت الترجمة
  ttsWarning: string;
}> = {
  ar: {
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
  },
  en: {
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
  },
  fr: {
    title: 'Le Saint Coran',
    quran: 'Coran',
    holyQuran: 'Le Saint Coran',
    home: 'Accueil',
    index: 'Index',
    settings: 'Paramètres',
    search: 'Recherche',
    searchPlaceholder: 'Rechercher des sourates...',
    athkar: 'Athkar & Duas',
    appearance: 'Apparence',
    lightMode: 'Mode Clair',
    darkMode: 'Mode Sombre',
    language: 'Langue',
    about: 'À propos',
    aboutText: "Application Coran avec 14 Tafsirs fiables et 6 réciteurs distingués. Lisez, écoutez et méditez les versets d'Allah.",
    quickNavigation: 'Navigation Rapide',
    surahIndex: 'Index des Sourates',
    browseSurahs: 'Parcourir les Sourates du Saint Coran',
    dragToScroll: 'Faites glisser pour faire défiler ou utilisez les flèches',
    viewFullIndex: "Voir l'index complet",
    verse: 'verset',
    verses: 'versets',
    meccan: 'Mecquoise',
    medinan: 'Médinoise',
    available: 'Disponible',
    surah: 'Sourate',
    tafsir: 'Tafsir',
    tafsirSource: 'Source du Tafsir',
    compareTafsirs: 'Comparer les Tafsirs',
    hideTafsir: 'Masquer le Tafsir',
    showTafsir: 'Afficher le Tafsir',
    benefits: 'Bénéfices',
    aboutSurah: 'À propos de cette Sourate',
    listenToRecitation: 'Écoutez chaque verset par 6 réciteurs différents',
    reciters: 'réciteurs',
    features: "Fonctionnalités de l'App",
    allInOnePlace: 'Tout ce dont vous avez besoin en un seul endroit',
    comprehensiveApp: "Une application Coran complète combinant lecture, écoute et interprétation",
    trustedTafsirs: 'Tafsirs fiables',
    fromMajorBooks: 'Des grands livres de Tafsir',
    distinguishedReciters: 'réciteurs distingués',
    beautifulRecitations: 'Belles récitations',
    advancedSearch: 'Recherche Avancée',
    searchInVerses: 'Rechercher dans les versets et Tafsirs',
    favorites: 'Favoris',
    saveYourFavorites: 'Enregistrez vos versets préférés',
    listenVerseByVerse: 'Écouter verset par verset',
    orFullSurah: 'ou sourate complète',
    fullSurahs: 'sourates complètes',
    uthmaniScript: 'Coran en écriture Uthmanienne',
    bismillah: 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux',
    bookOfAllah: "Le Livre d'Allah",
    readListenReflect: "Lisez, écoutez et méditez les versets d'Allah avec un Tafsir complet",
    juz: 'Juz',
    athkarAndDuas: 'Athkar & Duas',
    electronicMushaf: 'Mushaf Électronique',
    allRightsReserved: 'Tous droits réservés',
    trustedTafsirsList: 'Tafsirs fiables: Ibn Kathir | Tabari | Saadi | Muyassar | Jalalayn',
    translation: 'Traduction',
    ttsWarning: 'Note: L\'audio peut ne pas prononcer correctement certains termes islamiques',
  },
  ur: {
    title: 'قرآن پاک',
    quran: 'قرآن',
    holyQuran: 'قرآن پاک',
    home: 'ہوم',
    index: 'اشاریہ',
    settings: 'ترتیبات',
    search: 'تلاش',
    searchPlaceholder: 'سورتیں تلاش کریں...',
    athkar: 'اذکار و دعائیں',
    appearance: 'ظاہری شکل',
    lightMode: 'روشن موڈ',
    darkMode: 'تاریک موڈ',
    language: 'زبان',
    about: 'ایپ کے بارے میں',
    aboutText: '14 معتبر تفاسیر اور 6 ممتاز قاریوں کے ساتھ قرآن ایپ۔ اللہ کی آیات پڑھیں، سنیں اور غور کریں۔',
    quickNavigation: 'فوری نیویگیشن',
    surahIndex: 'سورتوں کا اشاریہ',
    browseSurahs: 'قرآن پاک کی سورتیں دیکھیں',
    dragToScroll: 'سکرول کرنے کے لیے گھسیٹیں یا تیر استعمال کریں',
    viewFullIndex: 'مکمل اشاریہ دیکھیں',
    verse: 'آیت',
    verses: 'آیات',
    meccan: 'مکی',
    medinan: 'مدنی',
    available: 'دستیاب',
    surah: 'سورۃ',
    tafsir: 'تفسیر',
    tafsirSource: 'تفسیر کا ماخذ',
    compareTafsirs: 'تفاسیر کا موازنہ',
    hideTafsir: 'تفسیر چھپائیں',
    showTafsir: 'تفسیر دکھائیں',
    benefits: 'فوائد',
    aboutSurah: 'اس سورت کے بارے میں',
    listenToRecitation: '6 مختلف قاریوں سے ہر آیت سنیں',
    reciters: 'قاری',
    features: 'ایپ کی خصوصیات',
    allInOnePlace: 'سب کچھ ایک جگہ',
    comprehensiveApp: 'ایک جامع قرآن ایپ جو پڑھنے، سننے اور تفسیر کو یکجا کرتی ہے',
    trustedTafsirs: 'معتبر تفاسیر',
    fromMajorBooks: 'بڑی تفسیر کی کتابوں سے',
    distinguishedReciters: 'ممتاز قاری',
    beautifulRecitations: 'خوبصورت تلاوتیں',
    advancedSearch: 'جدید تلاش',
    searchInVerses: 'آیات اور تفاسیر میں تلاش کریں',
    favorites: 'پسندیدہ',
    saveYourFavorites: 'اپنی پسندیدہ آیات محفوظ کریں',
    listenVerseByVerse: 'آیت بہ آیت سنیں',
    orFullSurah: 'یا مکمل سورت',
    fullSurahs: 'مکمل سورتیں',
    uthmaniScript: 'عثمانی رسم الخط میں قرآن',
    bismillah: 'بِسْمِ اللہِ الرَّحْمٰنِ الرَّحِیْمِ',
    bookOfAllah: 'اللہ کی کتاب',
    readListenReflect: 'جامع تفسیر کے ساتھ اللہ کی آیات پڑھیں، سنیں اور غور کریں',
    juz: 'پارہ',
    athkarAndDuas: 'اذکار و دعائیں',
    electronicMushaf: 'الیکٹرانک مصحف',
    allRightsReserved: 'جملہ حقوق محفوظ ہیں',
    trustedTafsirsList: 'معتبر تفاسیر: ابن کثیر | طبری | سعدی | میسر | جلالین',
    translation: 'ترجمہ',
    ttsWarning: 'نوٹ: آڈیو کچھ اسلامی الفاظ کا صحیح تلفظ نہیں کر سکتا',
  },
  id: {
    title: 'Al-Quran Al-Karim',
    quran: 'Al-Quran',
    holyQuran: 'Al-Quran Al-Karim',
    home: 'Beranda',
    index: 'Indeks',
    settings: 'Pengaturan',
    search: 'Pencarian',
    searchPlaceholder: 'Cari surah...',
    athkar: 'Dzikir & Doa',
    appearance: 'Tampilan',
    lightMode: 'Mode Terang',
    darkMode: 'Mode Gelap',
    language: 'Bahasa',
    about: 'Tentang Aplikasi',
    aboutText: 'Aplikasi Al-Quran dengan 14 Tafsir terpercaya dan 6 qari pilihan. Baca, dengarkan dan renungkan ayat-ayat Allah.',
    quickNavigation: 'Navigasi Cepat',
    surahIndex: 'Indeks Surah',
    browseSurahs: 'Jelajahi Surah Al-Quran',
    dragToScroll: 'Geser untuk menggulir atau gunakan panah',
    viewFullIndex: 'Lihat Indeks Lengkap',
    verse: 'ayat',
    verses: 'ayat',
    meccan: 'Makkiyah',
    medinan: 'Madaniyah',
    available: 'Tersedia',
    surah: 'Surah',
    tafsir: 'Tafsir',
    tafsirSource: 'Sumber Tafsir',
    compareTafsirs: 'Bandingkan Tafsir',
    hideTafsir: 'Sembunyikan Tafsir',
    showTafsir: 'Tampilkan Tafsir',
    benefits: 'Manfaat',
    aboutSurah: 'Tentang Surah Ini',
    listenToRecitation: 'Dengarkan setiap ayat oleh 6 qari berbeda',
    reciters: 'qari',
    features: 'Fitur Aplikasi',
    allInOnePlace: 'Semua yang Anda butuhkan di satu tempat',
    comprehensiveApp: 'Aplikasi Al-Quran lengkap yang menggabungkan membaca, mendengarkan, dan tafsir',
    trustedTafsirs: 'Tafsir terpercaya',
    fromMajorBooks: 'Dari kitab-kitab tafsir utama',
    distinguishedReciters: 'qari pilihan',
    beautifulRecitations: 'Bacaan yang indah',
    advancedSearch: 'Pencarian Lanjutan',
    searchInVerses: 'Cari dalam ayat dan tafsir',
    favorites: 'Favorit',
    saveYourFavorites: 'Simpan ayat favorit Anda',
    listenVerseByVerse: 'Dengarkan ayat per ayat',
    orFullSurah: 'atau surah lengkap',
    fullSurahs: 'surah lengkap',
    uthmaniScript: 'Al-Quran dalam Tulisan Utsmani',
    bismillah: 'Dengan nama Allah, Yang Maha Pengasih, Maha Penyayang',
    bookOfAllah: 'Kitab Allah',
    readListenReflect: 'Baca, dengarkan, dan renungkan ayat-ayat Allah dengan tafsir lengkap',
    juz: 'Juz',
    athkarAndDuas: 'Dzikir & Doa',
    electronicMushaf: 'Mushaf Elektronik',
    allRightsReserved: 'Hak cipta dilindungi',
    trustedTafsirsList: 'Tafsir Terpercaya: Ibn Katsir | Thabari | Saadi | Muyassar | Jalalayn',
    translation: 'Terjemahan',
    ttsWarning: 'Catatan: Audio mungkin tidak mengucapkan beberapa istilah Islam dengan tepat',
  },
  tr: {
    title: "Kur'an-ı Kerim",
    quran: "Kur'an",
    holyQuran: "Kur'an-ı Kerim",
    home: 'Ana Sayfa',
    index: 'İndeks',
    settings: 'Ayarlar',
    search: 'Arama',
    searchPlaceholder: 'Sure ara...',
    athkar: 'Zikirler ve Dualar',
    appearance: 'Görünüm',
    lightMode: 'Açık Mod',
    darkMode: 'Karanlık Mod',
    language: 'Dil',
    about: 'Uygulama Hakkında',
    aboutText: "14 güvenilir tefsir ve 6 seçkin hafız ile Kur'an uygulaması. Allah'ın ayetlerini okuyun, dinleyin ve tefekkür edin.",
    quickNavigation: 'Hızlı Gezinme',
    surahIndex: 'Sure İndeksi',
    browseSurahs: "Kur'an-ı Kerim Surelerini Keşfedin",
    dragToScroll: 'Kaydırmak için sürükleyin veya okları kullanın',
    viewFullIndex: 'Tam İndeksi Görüntüle',
    verse: 'ayet',
    verses: 'ayet',
    meccan: 'Mekki',
    medinan: 'Medeni',
    available: 'Mevcut',
    surah: 'Sure',
    tafsir: 'Tefsir',
    tafsirSource: 'Tefsir Kaynağı',
    compareTafsirs: 'Tefsirleri Karşılaştır',
    hideTafsir: 'Tefsiri Gizle',
    showTafsir: 'Tefsiri Göster',
    benefits: 'Faydalar',
    aboutSurah: 'Bu Sure Hakkında',
    listenToRecitation: '6 farklı hafızdan her ayeti dinleyin',
    reciters: 'hafız',
    features: 'Uygulama Özellikleri',
    allInOnePlace: 'İhtiyacınız olan her şey tek bir yerde',
    comprehensiveApp: "Okuma, dinleme ve tefsiri birleştiren kapsamlı bir Kur'an uygulaması",
    trustedTafsirs: 'güvenilir tefsir',
    fromMajorBooks: 'Büyük tefsir kitaplarından',
    distinguishedReciters: 'seçkin hafız',
    beautifulRecitations: 'Güzel tilavetler',
    advancedSearch: 'Gelişmiş Arama',
    searchInVerses: 'Ayetlerde ve tefsirlerde ara',
    favorites: 'Favoriler',
    saveYourFavorites: 'Favori ayetlerinizi kaydedin',
    listenVerseByVerse: 'Ayet ayet dinleyin',
    orFullSurah: 'veya tam sure',
    fullSurahs: 'tam sure',
    uthmaniScript: 'Osmanlı Yazısında Kuran',
    bismillah: 'Rahman ve Rahim olan Allah\'ın adıyla',
    bookOfAllah: "Allah'ın Kitabı",
    readListenReflect: "Kapsamlı tefsirle Allah'ın ayetlerini okuyun, dinleyin ve tefekkür edin",
    juz: 'Cüz',
    athkarAndDuas: 'Zikirler ve Dualar',
    electronicMushaf: 'Elektronik Mushaf',
    allRightsReserved: 'Tüm hakları saklıdır',
    trustedTafsirsList: 'Güvenilir Tefsirler: İbn Kesir | Taberi | Saadi | Müyesser | Celaleyn',
    translation: 'Çeviri',
    ttsWarning: 'Not: Ses bazı İslami terimleri doğru telaffuz etmeyebilir',
  },
  it: {
    title: 'Il Sacro Corano',
    quran: 'Corano',
    holyQuran: 'Il Sacro Corano',
    home: 'Home',
    index: 'Indice',
    settings: 'Impostazioni',
    search: 'Cerca',
    searchPlaceholder: 'Cerca sure...',
    athkar: 'Athkar e Dua',
    appearance: 'Aspetto',
    lightMode: 'Modalità Chiara',
    darkMode: 'Modalità Scura',
    language: 'Lingua',
    about: 'Informazioni',
    aboutText: 'App del Corano con 14 Tafsir affidabili e 6 recitatori distinti. Leggi, ascolta e rifletti sui versetti di Allah.',
    quickNavigation: 'Navigazione Rapida',
    surahIndex: 'Indice delle Sure',
    browseSurahs: 'Sfoglia le Sure del Sacro Corano',
    dragToScroll: 'Trascina per scorrere o usa le frecce',
    viewFullIndex: 'Visualizza Indice Completo',
    verse: 'versetto',
    verses: 'versetti',
    meccan: 'Meccana',
    medinan: 'Medinese',
    available: 'Disponibile',
    surah: 'Sura',
    tafsir: 'Tafsir',
    tafsirSource: 'Fonte del Tafsir',
    compareTafsirs: 'Confronta Tafsir',
    hideTafsir: 'Nascondi Tafsir',
    showTafsir: 'Mostra Tafsir',
    benefits: 'Benefici',
    aboutSurah: 'Informazioni su questa Sura',
    listenToRecitation: 'Ascolta ogni versetto da 6 recitatori diversi',
    reciters: 'recitatori',
    features: "Funzionalità dell'App",
    allInOnePlace: 'Tutto ciò di cui hai bisogno in un unico posto',
    comprehensiveApp: "Un'app completa del Corano che combina lettura, ascolto e interpretazione",
    trustedTafsirs: 'Tafsir affidabili',
    fromMajorBooks: 'Dai principali libri di Tafsir',
    distinguishedReciters: 'recitatori distinti',
    beautifulRecitations: 'Belle recitazioni',
    advancedSearch: 'Ricerca Avanzata',
    searchInVerses: 'Cerca in versetti e Tafsir',
    favorites: 'Preferiti',
    saveYourFavorites: 'Salva i tuoi versetti preferiti',
    listenVerseByVerse: 'Ascolta versetto per versetto',
    orFullSurah: 'o sura completa',
    fullSurahs: 'sure complete',
    uthmaniScript: 'Corano in Scrittura Uthmaniyya',
    bismillah: 'Nel nome di Allah, il Clemente, il Misericordioso',
    bookOfAllah: 'Il Libro di Allah',
    readListenReflect: 'Leggi, ascolta e rifletti sui versetti di Allah con Tafsir completo',
    juz: 'Juz',
    athkarAndDuas: 'Athkar e Dua',
    electronicMushaf: 'Mushaf Elettronico',
    allRightsReserved: 'Tutti i diritti riservati',
    trustedTafsirsList: 'Tafsir Affidabili: Ibn Kathir | Tabari | Saadi | Muyassar | Jalalayn',
    translation: 'Traduzione',
    ttsWarning: 'Nota: L\'audio potrebbe non pronunciare correttamente alcuni termini islamici',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['ar'];
  isRtl: boolean;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'quran-app-language';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && languages.some(l => l.code === saved)) {
        return saved as Language;
      }
    }
    return 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  useEffect(() => {
    // Update document direction
    const isRtl = language === 'ar' || language === 'ur';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];
  const isRtl = language === 'ar' || language === 'ur';
  const dir = isRtl ? 'rtl' : 'ltr';

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
