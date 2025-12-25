// خدمة جلب التفسير من APIs موثوقة
import { supabase } from '@/integrations/supabase/client';

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
  apiId?: number;
}

// التفاسير المتاحة
export const AVAILABLE_TAFSIRS: TafsirEdition[] = [
  // تفاسير من alquran.cloud
  { 
    id: 'ar.muyassar', 
    name: 'التفسير الميسر', 
    description: 'تفسير مبسط وسهل الفهم من مجمع الملك فهد لطباعة المصحف الشريف',
    author: 'مجمع الملك فهد',
    apiSource: 'alquran'
  },
  { 
    id: 'ar.jalalayn', 
    name: 'تفسير الجلالين', 
    description: 'تفسير كلاسيكي موجز للإمامين جلال الدين المحلي (ت 864 هـ) وجلال الدين السيوطي (ت 911 هـ)',
    author: 'المحلي والسيوطي',
    apiSource: 'alquran'
  },
  { 
    id: 'ar.qurtubi', 
    name: 'تفسير القرطبي', 
    description: 'الجامع لأحكام القرآن - يركز على الأحكام الفقهية للإمام القرطبي (ت 671 هـ)',
    author: 'الإمام القرطبي',
    apiSource: 'alquran'
  },
  { 
    id: 'ar.baghawi', 
    name: 'تفسير البغوي', 
    description: 'معالم التنزيل - تفسير سلفي موجز للإمام البغوي (ت 516 هـ)',
    author: 'الإمام البغوي',
    apiSource: 'alquran'
  },
  { 
    id: 'ar.waseet', 
    name: 'التفسير الوسيط', 
    description: 'تفسير معاصر شامل من الأزهر الشريف',
    author: 'مجمع البحوث الإسلامية',
    apiSource: 'alquran'
  },
  { 
    id: 'ar.miqbas', 
    name: 'تنوير المقباس', 
    description: 'تنوير المقباس من تفسير ابن عباس - من أقدم التفاسير المنسوبة للصحابة',
    author: 'منسوب لابن عباس',
    apiSource: 'alquran'
  },
  // تفاسير من quran-tafseer.com (عبر Edge Function)
  { 
    id: 'qt-ibn-kathir', 
    name: 'تفسير ابن كثير', 
    description: 'من أشهر كتب التفسير بالمأثور للحافظ عماد الدين ابن كثير (ت 774 هـ)',
    author: 'ابن كثير',
    apiSource: 'quran-tafseer',
    apiId: 2
  },
  { 
    id: 'qt-tabari', 
    name: 'تفسير الطبري', 
    description: 'جامع البيان في تأويل القرآن - أعظم تفاسير السلف للإمام الطبري (ت 310 هـ)',
    author: 'الإمام الطبري',
    apiSource: 'quran-tafseer',
    apiId: 3
  },
  { 
    id: 'qt-saadi', 
    name: 'تفسير السعدي', 
    description: 'تيسير الكريم الرحمن - تفسير عصري ميسر للشيخ السعدي (ت 1376 هـ)',
    author: 'الشيخ السعدي',
    apiSource: 'quran-tafseer',
    apiId: 6
  },
  { 
    id: 'qt-muyassar', 
    name: 'التفسير الميسر (مفصل)', 
    description: 'نسخة موسعة ومفصلة من التفسير الميسر',
    author: 'مجمع الملك فهد',
    apiSource: 'quran-tafseer',
    apiId: 1
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

// جلب تفسير من quran-tafseer عبر Edge Function
const fetchFromQuranTafseer = async (
  surahNumber: number,
  verseNumber: number,
  tafsirId: number
): Promise<string> => {
  const { data, error } = await supabase.functions.invoke('get-tafsir', {
    body: { surahNumber, verseNumber, tafsirId }
  });
  
  if (error) {
    throw new Error(error.message || 'فشل في جلب التفسير');
  }
  
  if (data.error) {
    throw new Error(data.error);
  }
  
  return data.text || '';
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

// جلب تفسير سورة كاملة من quran-tafseer عبر Edge Function
const fetchSurahFromQuranTafseer = async (
  surahNumber: number,
  tafsirId: number,
  versesCount: number
): Promise<Map<number, string>> => {
  const tafsirMap = new Map<number, string>();
  
  // جلب كل الآيات بالتوازي (بحد أقصى 7 في المرة لتجنب الضغط)
  const batchSize = 7;
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
  versesCount: number = 286
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
