import { Surah } from '../types';

export const surahAlAsr: Surah = {
  id: 103, name: 'العصر', englishName: 'Al-Asr', versesCount: 3, revelationType: 'مكية', order: 13, juz: [30],
  description: 'سورة العصر تبين سبيل النجاة من الخسران.', virtues: 'قال الشافعي: لو تدبرها الناس لكفتهم',
  verses: [
    { id: 1, arabicText: 'وَالْعَصْرِ', tafsir: 'أقسم الله بالعصر وهو الدهر أو وقت العصر', theme: 'القسم بالعصر', benefits: 'الوقت عظيم' },
    { id: 2, arabicText: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', tafsir: 'إن الإنسان لفي خسارة', theme: 'خسران الإنسان', benefits: 'الأصل الخسران' },
    { id: 3, arabicText: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', tafsir: 'إلا الذين آمنوا وعملوا الصالحات وتواصوا بالحق والصبر', theme: 'سبيل النجاة', benefits: 'الإيمان والعمل والتواصي' }
  ]
};
