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
}

// التفاسير المتاحة من alquran.cloud API
export const AVAILABLE_TAFSIRS: TafsirEdition[] = [
  { 
    id: 'ar.muyassar', 
    name: 'التفسير الميسر', 
    description: 'تفسير مبسط وسهل الفهم من مجمع الملك فهد لطباعة المصحف الشريف',
    author: 'مجمع الملك فهد'
  },
  { 
    id: 'ar.jalalayn', 
    name: 'تفسير الجلالين', 
    description: 'تفسير كلاسيكي موجز للإمامين جلال الدين المحلي (ت 864 هـ) وجلال الدين السيوطي (ت 911 هـ)',
    author: 'المحلي والسيوطي'
  },
  { 
    id: 'ar.qurtubi', 
    name: 'تفسير القرطبي', 
    description: 'الجامع لأحكام القرآن - يركز على الأحكام الفقهية للإمام القرطبي (ت 671 هـ)',
    author: 'الإمام القرطبي'
  },
  { 
    id: 'ar.baghawi', 
    name: 'تفسير البغوي', 
    description: 'معالم التنزيل - تفسير سلفي موجز للإمام البغوي (ت 516 هـ)',
    author: 'الإمام البغوي'
  },
  { 
    id: 'ar.waseet', 
    name: 'التفسير الوسيط', 
    description: 'تفسير معاصر شامل من الأزهر الشريف',
    author: 'مجمع البحوث الإسلامية'
  },
  { 
    id: 'ar.miqbas', 
    name: 'تنوير المقباس', 
    description: 'تنوير المقباس من تفسير ابن عباس - من أقدم التفاسير المنسوبة للصحابة',
    author: 'منسوب لابن عباس'
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
    const text = await fetchFromAlQuranCloud(surahNumber, verseNumber, editionId);
    
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
    return await fetchSurahFromAlQuranCloud(surahNumber, editionId);
  } catch (error) {
    console.error('Error fetching surah tafsir:', error);
    return new Map();
  }
};
