// تصدير جميع السور المتوفرة
import { Surah } from './types';
import { surahAlFatiha } from './surahs/001-alfatiha';
import { surahAlBaqara } from './surahs/002-albaqara';
import { surahAlImran } from './surahs/003-alimran';
import { surahAnNisa } from './surahs/004-annisa';
import { surahAlMaida } from './surahs/005-almaida';
import { surahAlAnam } from './surahs/006-alanam';
import { surahAlAraf } from './surahs/007-alaraf';
import { surahAlAnfal } from './surahs/008-alanfal';
import { surahAtTawba } from './surahs/009-attawba';
import { surahYunus } from './surahs/010-yunus';
import { surahHud } from './surahs/011-hud';
import { surahYusuf } from './surahs/012-yusuf';
import { surahArRaad } from './surahs/013-arraad';
import { surahIbrahim } from './surahs/014-ibrahim';
import { surahAlHijr } from './surahs/015-alhijr';
import { surahAnNahl } from './surahs/016-annahl';
import { surahAlIsra } from './surahs/017-alisra';
import { surahAlKahf } from './surahs/018-alkahf';
import { surahMaryam } from './surahs/019-maryam';
import { surahTaha } from './surahs/020-taha';
import { surahAlIkhlas } from './surahs/112-alikhlas';
import { surahAlFalaq } from './surahs/113-alfalaq';
import { surahAnNas } from './surahs/114-annas';

// استيراد سورة ياسين الموجودة
import { sections as yasinSections, surahInfo as yasinInfo } from './surahYasinTafsir';

// استيراد سور جزء عمّ
import { surahAnNaba } from './surahs/078-annaba';
import { surahAnNaziat } from './surahs/079-alnaziat';
import { surahAbasa } from './surahs/080-abasa';
import { surahAtTakwir } from './surahs/081-attakwir';
import { surahAlInfitar } from './surahs/082-alinfitar';
import { surahAlMutaffifin } from './surahs/083-almutaffifin';
import { surahAlInshiqaq } from './surahs/084-alinshiqaq';
import { surahAlBuruj } from './surahs/085-alburuj';
import { surahAtTariq } from './surahs/086-attariq';
import { surahAlAla } from './surahs/087-alala';
import { surahAlGhashiyah } from './surahs/088-alghashiyah';
import { surahAlFajr } from './surahs/089-alfajr';
import { surahAlBalad } from './surahs/090-albalad';
import { surahAshShams } from './surahs/091-ashshams';
import { surahAlLayl } from './surahs/092-allayl';
import { surahAdDuha } from './surahs/093-adduha';
import { surahAshSharh } from './surahs/094-ashsharh';
import { surahAtTin } from './surahs/095-attin';
import { surahAlAlaq } from './surahs/096-alalaq';
import { surahAlQadr } from './surahs/097-alqadr';
import { surahAlBayyinah } from './surahs/098-albayyinah';
import { surahAzZalzalah } from './surahs/099-azzalzalah';
import { surahAlAdiyat } from './surahs/100-aladiyat';
import { surahAlQariah } from './surahs/101-alqariah';
import { surahAtTakathur } from './surahs/102-attakathur';
import { surahAlAsr } from './surahs/103-alasr';
import { surahAlHumazah, surahAlFil, surahQuraysh, surahAlMaun, surahAlKawthar, surahAlKafirun, surahAnNasr, surahAlMasad } from './surahs/104-111';

// استيراد السور الجديدة
import { surahAlJumuah } from './surahs/062-aljumuah';
import { surahAlMunafiqun } from './surahs/063-almunafiqun';
import { surahAtTaghabun } from './surahs/064-attaghabun';
import { surahAtTalaq } from './surahs/065-attalaq';
import { surahAtTahrim } from './surahs/066-attahrim';
import { surahAlMulk } from './surahs/067-almulk';
import { surahAlQalam } from './surahs/068-alqalam';
import { surahAlHaqqah } from './surahs/069-alhaqqah';
import { surahAlMaarij } from './surahs/070-almaarij';
import { surahNuh } from './surahs/071-nuh';
import { surahAlJinn } from './surahs/072-aljinn';
import { surahAlMuzzammil } from './surahs/073-almuzzammil';
import { surahAlMuddaththir } from './surahs/074-almuddaththir';
import { surahAlQiyamah } from './surahs/075-alqiyamah';
import { surahAlInsan } from './surahs/076-alinsan';
import { surahAlMursalat } from './surahs/077-almursalat';

// تحويل بيانات سورة ياسين للتنسيق الجديد
const yasinVerses = yasinSections.flatMap(section => 
  section.verses.map(v => ({
    id: v.number,
    arabicText: v.arabic,
    tafsir: v.tafsir,
    theme: v.theme,
    benefits: v.benefits
  }))
);

const surahYasin: Surah = {
  id: 36,
  name: yasinInfo.name,
  englishName: yasinInfo.englishName,
  versesCount: yasinInfo.versesCount,
  revelationType: yasinInfo.revelation as 'مكية' | 'مدنية',
  order: yasinInfo.order,
  juz: [22, 23],
  description: yasinInfo.introduction,
  virtues: yasinInfo.virtues.join(' | '),
  verses: yasinVerses
};

export const availableSurahs: Record<number, Surah> = {
  1: surahAlFatiha,
  2: surahAlBaqara,
  3: surahAlImran,
  4: surahAnNisa,
  5: surahAlMaida,
  6: surahAlAnam,
  7: surahAlAraf,
  8: surahAlAnfal,
  9: surahAtTawba,
  10: surahYunus,
  11: surahHud,
  12: surahYusuf,
  13: surahArRaad,
  14: surahIbrahim,
  15: surahAlHijr,
  16: surahAnNahl,
  17: surahAlIsra,
  18: surahAlKahf,
  19: surahMaryam,
  20: surahTaha,
  36: surahYasin,
  62: surahAlJumuah,
  63: surahAlMunafiqun,
  64: surahAtTaghabun,
  65: surahAtTalaq,
  66: surahAtTahrim,
  67: surahAlMulk,
  68: surahAlQalam,
  69: surahAlHaqqah,
  70: surahAlMaarij,
  71: surahNuh,
  72: surahAlJinn,
  73: surahAlMuzzammil,
  74: surahAlMuddaththir,
  75: surahAlQiyamah,
  76: surahAlInsan,
  77: surahAlMursalat,
  78: surahAnNaba,
  79: surahAnNaziat,
  80: surahAbasa,
  81: surahAtTakwir,
  82: surahAlInfitar,
  83: surahAlMutaffifin,
  84: surahAlInshiqaq,
  85: surahAlBuruj,
  86: surahAtTariq,
  87: surahAlAla,
  88: surahAlGhashiyah,
  89: surahAlFajr,
  90: surahAlBalad,
  91: surahAshShams,
  92: surahAlLayl,
  93: surahAdDuha,
  94: surahAshSharh,
  95: surahAtTin,
  96: surahAlAlaq,
  97: surahAlQadr,
  98: surahAlBayyinah,
  99: surahAzZalzalah,
  100: surahAlAdiyat,
  101: surahAlQariah,
  102: surahAtTakathur,
  103: surahAlAsr,
  104: surahAlHumazah,
  105: surahAlFil,
  106: surahQuraysh,
  107: surahAlMaun,
  108: surahAlKawthar,
  109: surahAlKafirun,
  110: surahAnNasr,
  111: surahAlMasad,
  112: surahAlIkhlas,
  113: surahAlFalaq,
  114: surahAnNas,
};

export const getSurahData = (id: number): Surah | undefined => {
  return availableSurahs[id];
};

export const isDataAvailable = (id: number): boolean => {
  return id in availableSurahs;
};
