// أنواع البيانات للقرآن الكريم

export interface Verse {
  id: number;
  arabicText: string;
  tafsir: string;
  benefits?: string;
  theme?: string;
}

export interface Surah {
  id: number;
  name: string;
  englishName: string;
  versesCount: number;
  revelationType: 'مكية' | 'مدنية';
  order: number;
  juz: number[];
  description: string;
  virtues?: string;
  verses: Verse[];
}

export interface SurahInfo {
  id: number;
  name: string;
  englishName: string;
  versesCount: number;
  revelationType: 'مكية' | 'مدنية';
  order: number;
  juz: number[];
}
