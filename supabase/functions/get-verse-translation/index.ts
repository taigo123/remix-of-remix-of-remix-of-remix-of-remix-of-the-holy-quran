import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Language to translation ID mapping for Quran.com API (fallback)
    const quranComTranslations: Record<string, number> = {
      en: 131, // Sahih International
      fr: 136, // French - Muhammad Hamidullah
      ur: 234, // Urdu - Fateh Muhammad Jalandhry
      id: 134, // Indonesian - Kemenag
      tr: 210, // Turkish - Diyanet Vakfi
      it: 153, // Italian - Hamza Roberto Piccardo
    };

    let translations: any[] = [];

    // Try AlQuran API first (except for Italian which isn't supported)
    if (language !== 'it') {
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
        console.log('AlQuran API failed, trying fallback');
      }
    }

    // Fallback to Quran.com API if needed
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
        console.log('Quran.com API also failed');
      }
    }

    console.log('Translations fetched:', translations.length);

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
