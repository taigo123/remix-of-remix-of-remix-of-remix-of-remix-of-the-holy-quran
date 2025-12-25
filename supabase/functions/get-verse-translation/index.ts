import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Complete mapping of 40+ languages to Quran.com translation IDs
// Removed: my, km, lo, ig, fil, gu, mr, pa, sr, hr, sl, mk, tg - not available correctly in API
const quranComTranslations: Record<string, number> = {
  // Major European Languages
  en: 131, // Sahih International
  fr: 136, // Muhammad Hamidullah
  de: 27,  // Bubenheim & Elyas
  es: 140, // Muhammad Isa Garcia
  pt: 43,  // Samir El-Hayek
  it: 153, // Hamza Roberto Piccardo
  nl: 235, // Sofian S. Siregar
  pl: 42,  // Józef Bielawski
  ro: 44,  // Grigore
  sv: 48,  // Knut Bernström
  cs: 26,  // Preklad I. Hrbek
  sk: 47,  // Slovak
  
  // Eastern European & Slavic
  ru: 45,  // Elmir Kuliev
  uk: 217, // Mykhaylo Yakubovych
  bg: 237, // Tzvetan Theophanov
  bs: 25,  // Besim Korkut
  sq: 89,  // Sherif Ahmeti
  
  // Turkish & Turkic Languages
  tr: 210, // Diyanet Vakfi
  az: 23,  // Vasim Mammadaliyev
  uz: 127, // Muhammad Sodik
  kk: 222, // Khalifa Altay
  ky: 223, // Sooronbay Jdanov
  tt: 53,  // Yakub Ibn Nugman
  
  // South Asian Languages
  ur: 234, // Fateh Muhammad Jalandhry
  hi: 122, // Muhammad Farooq Khan
  bn: 163, // Muhiuddin Khan
  ta: 229, // Jan Trust Foundation
  te: 227, // Maulana Abder-Rahim
  ml: 37,  // Abdul-Hamid Haidar
  si: 228, // Ruwwad Center
  ne: 108, // Ahl Al-Hadith
  
  // Southeast Asian Languages
  id: 134, // Kemenag
  ms: 39,  // Basmeih
  th: 51,  // King Fahad Complex
  vi: 177, // Ruwwad
  
  // East Asian Languages
  zh: 56,  // Ma Jian
  ja: 35,  // Ryoichi Mita
  ko: 36,  // Korean
  
  // Middle Eastern & Persian
  fa: 29,  // Fooladvand
  
  // African Languages
  am: 87,  // Sadiq & Sani
  so: 46,  // Mahmud Abduh
  sw: 49,  // Al-Barwani
  ha: 32,  // Abubakar Gumi
  yo: 125, // Shaykh Abu Rahimah
  
  // Maldivian
  dv: 86,  // Office of the President
};

// Languages supported by AlQuran API
const alQuranApiLanguages = ['en', 'fr', 'ur', 'id', 'tr', 'ru', 'bn', 'hi', 'ms', 'th', 'zh'];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { surahNumber, language } = await req.json();

    if (!surahNumber || !language) {
      return new Response(
        JSON.stringify({ error: 'Missing surahNumber or language' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let translations: any[] = [];

    // Try AlQuran API first for supported languages
    if (alQuranApiLanguages.includes(language)) {
      try {
        const response = await fetch(
          `https://alquran-api.pages.dev/api/quran/surah/${surahNumber}?lang=${language}`
        );
        
        if (response.ok) {
          const data = await response.json();
          translations = data.verses?.map((verse: any, index: number) => ({
            number: verse.number || index + 1,
            translation: verse.translation || verse.text,
          })) || [];
        }
      } catch (e) {
        console.log('AlQuran API failed, trying Quran.com fallback');
      }
    }

    // Use Quran.com API for all other languages or as fallback
    if (translations.length === 0 && quranComTranslations[language]) {
      try {
        const translationId = quranComTranslations[language];
        const response = await fetch(
          `https://api.quran.com/api/v4/quran/translations/${translationId}?chapter_number=${surahNumber}`
        );
        
        if (response.ok) {
          const data = await response.json();
          translations = data.translations?.map((t: any, index: number) => ({
            number: index + 1,
            translation: t.text?.replace(/<[^>]*>/g, '') || '', // Remove HTML tags
          })) || [];
        }
      } catch (e) {
        console.error('Quran.com API also failed:', e);
      }
    }

    console.log(`Translations fetched for ${language}: ${translations.length} verses`);

    return new Response(
      JSON.stringify({ translations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching translation:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
