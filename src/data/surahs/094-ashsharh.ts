import { Surah } from '../types';

export const surahAshSharh: Surah = {
  id: 94, name: 'الشرح', englishName: 'Ash-Sharh', versesCount: 8, revelationType: 'مكية', order: 12, juz: [30],
  description: 'سورة الشرح تذكر نعم الله على النبي ﷺ وتبشره باليسر.', virtues: 'من السور المكية القصيرة',
  verses: [
    { id: 1, arabicText: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ', tafsir: 'ألم نوسع لك صدرك للإيمان', theme: 'شرح الصدر', benefits: 'الله شرح صدر النبي' },
    { id: 2, arabicText: 'وَوَضَعْنَا عَنكَ وِزْرَكَ', tafsir: 'ووضعنا عنك ثقلك', theme: 'وضع الوزر', benefits: 'الله خفف عن النبي' },
    { id: 3, arabicText: 'الَّذِي أَنقَضَ ظَهْرَكَ', tafsir: 'الذي أثقل ظهرك', theme: 'ثقل الهم', benefits: 'الله رفع الثقل' },
    { id: 4, arabicText: 'وَرَفَعْنَا لَكَ ذِكْرَكَ', tafsir: 'ورفعنا لك ذكرك في العالمين', theme: 'رفع الذكر', benefits: 'الله رفع ذكر النبي' },
    { id: 5, arabicText: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', tafsir: 'فإن مع الشدة يسرًا', theme: 'اليسر مع العسر', benefits: 'مع الشدة فرج' },
    { id: 6, arabicText: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', tafsir: 'إن مع الشدة يسرًا تأكيدًا', theme: 'تأكيد اليسر', benefits: 'لن يغلب عسر يسرين' },
    { id: 7, arabicText: 'فَإِذَا فَرَغْتَ فَانصَبْ', tafsir: 'فإذا فرغت من عمل فاجتهد في عبادة', theme: 'العمل والعبادة', benefits: 'استمر في العبادة' },
    { id: 8, arabicText: 'وَإِلَىٰ رَبِّكَ فَارْغَب', tafsir: 'وإلى ربك فتوجه بالدعاء', theme: 'التوجه إلى الله', benefits: 'ارغب إلى الله' }
  ]
};
