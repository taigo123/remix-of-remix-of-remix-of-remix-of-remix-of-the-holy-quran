// خدمة جلب التفسير من APIs موثوقة

export interface ExternalTafsir {
  source: string;
  sourceName: string;
  text: string;
  isLoading?: boolean;
  error?: string;
}

export interface TafsirEdition {
  id: string;
  name: string;
  description: string;
  author: string;
  apiSource: 'alquran' | 'quran-tafseer';
  apiId?: number; // للـ quran-tafseer API
}

// التفاسير المتاحة مع شرح كل تفسير
export const AVAILABLE_TAFSIRS: TafsirEdition[] = [
  { 
    id: 'ar.muyassar', 
    name: 'التفسير الميسر', 
    description: 'تفسير مبسط من مجمع الملك فهد لطباعة المصحف الشريف - سهل الفهم للجميع',
    author: 'مجمع الملك فهد',
    apiSource: 'alquran'
  },
  { 
    id: 'ar.jalalayn', 
    name: 'تفسير الجلالين', 
    description: 'تفسير موجز وشامل للإمامين جلال الدين المحلي وجلال الدين السيوطي',
    author: 'المحلي والسيوطي',
    apiSource: 'alquran'
  },
  { 
    id: 'quran-tafseer-1', 
    name: 'التفسير الميسر (مفصل)', 
    description: 'تفسير ميسر مفصل من مجمع الملك فهد - نسخة موسعة',
    author: 'مجمع الملك فهد',
    apiSource: 'quran-tafseer',
    apiId: 1
  },
  { 
    id: 'quran-tafseer-2', 
    name: 'تفسير ابن كثير', 
    description: 'من أشهر كتب التفسير بالمأثور للحافظ عماد الدين ابن كثير',
    author: 'ابن كثير (774 هـ)',
    apiSource: 'quran-tafseer',
    apiId: 2
  },
  { 
    id: 'quran-tafseer-3', 
    name: 'تفسير الطبري', 
    description: 'جامع البيان في تأويل القرآن - أعظم تفاسير السلف',
    author: 'الإمام الطبري (310 هـ)',
    apiSource: 'quran-tafseer',
    apiId: 3
  },
  { 
    id: 'quran-tafseer-4', 
    name: 'تفسير القرطبي', 
    description: 'الجامع لأحكام القرآن - يركز على الأحكام الفقهية',
    author: 'الإمام القرطبي (671 هـ)',
    apiSource: 'quran-tafseer',
    apiId: 4
  },
  { 
    id: 'quran-tafseer-5', 
    name: 'تفسير البغوي', 
    description: 'معالم التنزيل - تفسير سلفي موجز',
    author: 'الإمام البغوي (516 هـ)',
    apiSource: 'quran-tafseer',
    apiId: 5
  },
  { 
    id: 'quran-tafseer-6', 
    name: 'تفسير السعدي', 
    description: 'تيسير الكريم الرحمن - تفسير عصري ميسر',
    author: 'الشيخ السعدي (1376 هـ)',
    apiSource: 'quran-tafseer',
    apiId: 6
  },
  { 
    id: 'quran-tafseer-7', 
    name: 'التفسير الوسيط', 
    description: 'تفسير معاصر من الأزهر الشريف',
    author: 'مجمع البحوث الإسلامية',
    apiSource: 'quran-tafseer',
    apiId: 7
  },
];

// جلب تفسير من alquran.cloud
const fetchFromAlQuranCloud = async (
  surahNumber: number,
  verseNumber: number,
  edition: string
): Promise<string> => {
  const response = await fetch(
    `https://api.alquran.cloud/v1/ayah/${surahNumber}:${verseNumber}/${edition}`
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.code !== 200 || !data.data) {
    throw new Error('فشل في جلب التفسير');
  }
  
  return data.data.text;
};

// جلب تفسير من quran-tafseer API
const fetchFromQuranTafseer = async (
  surahNumber: number,
  verseNumber: number,
  tafsirId: number
): Promise<string> => {
  const response = await fetch(
    `https://api.quran-tafseer.com/tafseer/${tafsirId}/${surahNumber}/${verseNumber}`
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.text) {
    throw new Error('فشل في جلب التفسير');
  }
  
  return data.text;
};

// جلب تفسير آية واحدة
export const fetchVerseTafsir = async (
  surahNumber: number,
  verseNumber: number,
  editionId: string
): Promise<ExternalTafsir> => {
  const edition = AVAILABLE_TAFSIRS.find(t => t.id === editionId);
  
  if (!edition) {
    return {
      source: editionId,
      sourceName: editionId,
      text: '',
      error: 'التفسير غير موجود',
    };
  }
  
  try {
    let text: string;
    
    if (edition.apiSource === 'alquran') {
      text = await fetchFromAlQuranCloud(surahNumber, verseNumber, editionId);
    } else {
      text = await fetchFromQuranTafseer(surahNumber, verseNumber, edition.apiId!);
    }
    
    return {
      source: editionId,
      sourceName: edition.name,
      text,
    };
  } catch (error) {
    console.error('Error fetching tafsir:', error);
    return {
      source: editionId,
      sourceName: edition.name,
      text: '',
      error: error instanceof Error ? error.message : 'خطأ في جلب التفسير',
    };
  }
};

// جلب تفسير سورة كاملة من alquran.cloud
const fetchSurahFromAlQuranCloud = async (
  surahNumber: number,
  edition: string
): Promise<Map<number, string>> => {
  const response = await fetch(
    `https://api.alquran.cloud/v1/surah/${surahNumber}/${edition}`
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.code !== 200 || !data.data?.ayahs) {
    throw new Error('فشل في جلب تفسير السورة');
  }
  
  const tafsirMap = new Map<number, string>();
  
  data.data.ayahs.forEach((ayah: { numberInSurah: number; text: string }) => {
    tafsirMap.set(ayah.numberInSurah, ayah.text);
  });
  
  return tafsirMap;
};

// جلب تفسير سورة كاملة من quran-tafseer
const fetchSurahFromQuranTafseer = async (
  surahNumber: number,
  tafsirId: number,
  versesCount: number
): Promise<Map<number, string>> => {
  const tafsirMap = new Map<number, string>();
  
  // جلب كل الآيات بالتوازي (بحد أقصى 10 في المرة)
  const batchSize = 10;
  for (let i = 1; i <= versesCount; i += batchSize) {
    const promises = [];
    for (let j = i; j < Math.min(i + batchSize, versesCount + 1); j++) {
      promises.push(
        fetchFromQuranTafseer(surahNumber, j, tafsirId)
          .then(text => ({ verseNum: j, text }))
          .catch(() => ({ verseNum: j, text: '' }))
      );
    }
    
    const results = await Promise.all(promises);
    results.forEach(({ verseNum, text }) => {
      if (text) {
        tafsirMap.set(verseNum, text);
      }
    });
  }
  
  return tafsirMap;
};

// جلب تفسير سورة كاملة (للتحميل المسبق)
export const fetchSurahTafsir = async (
  surahNumber: number,
  editionId: string,
  versesCount: number = 286 // افتراضي لسورة البقرة
): Promise<Map<number, string>> => {
  const edition = AVAILABLE_TAFSIRS.find(t => t.id === editionId);
  
  if (!edition) {
    return new Map();
  }
  
  try {
    if (edition.apiSource === 'alquran') {
      return await fetchSurahFromAlQuranCloud(surahNumber, editionId);
    } else {
      return await fetchSurahFromQuranTafseer(surahNumber, edition.apiId!, versesCount);
    }
  } catch (error) {
    console.error('Error fetching surah tafsir:', error);
    return new Map();
  }
};
