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
  language: string;
  author: string;
}

// التفاسير المتاحة من alquran.cloud
export const AVAILABLE_TAFSIRS: TafsirEdition[] = [
  { id: 'ar.muyassar', name: 'التفسير الميسر', language: 'ar', author: 'مجمع الملك فهد' },
  { id: 'ar.jalalayn', name: 'تفسير الجلالين', language: 'ar', author: 'المحلي والسيوطي' },
];

// جلب تفسير آية واحدة
export const fetchVerseTafsir = async (
  surahNumber: number,
  verseNumber: number,
  edition: string = 'ar.muyassar'
): Promise<ExternalTafsir> => {
  try {
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
    
    const tafsirInfo = AVAILABLE_TAFSIRS.find(t => t.id === edition);
    
    return {
      source: edition,
      sourceName: tafsirInfo?.name || edition,
      text: data.data.text,
    };
  } catch (error) {
    console.error('Error fetching tafsir:', error);
    return {
      source: edition,
      sourceName: AVAILABLE_TAFSIRS.find(t => t.id === edition)?.name || edition,
      text: '',
      error: error instanceof Error ? error.message : 'خطأ في جلب التفسير',
    };
  }
};

// جلب تفاسير متعددة لآية واحدة
export const fetchMultipleTafsirs = async (
  surahNumber: number,
  verseNumber: number,
  editions: string[] = ['ar.muyassar', 'ar.jalalayn']
): Promise<ExternalTafsir[]> => {
  const promises = editions.map(edition => 
    fetchVerseTafsir(surahNumber, verseNumber, edition)
  );
  
  return Promise.all(promises);
};

// جلب تفسير سورة كاملة (للتحميل المسبق)
export const fetchSurahTafsir = async (
  surahNumber: number,
  edition: string = 'ar.muyassar'
): Promise<Map<number, string>> => {
  try {
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
  } catch (error) {
    console.error('Error fetching surah tafsir:', error);
    return new Map();
  }
};
