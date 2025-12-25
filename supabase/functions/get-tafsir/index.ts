import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { surahNumber, verseNumber, tafsirId } = await req.json();

    if (!surahNumber || !verseNumber || !tafsirId) {
      console.error('Missing parameters:', { surahNumber, verseNumber, tafsirId });
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching tafsir: tafsirId=${tafsirId}, surah=${surahNumber}, verse=${verseNumber}`);

    // Use quran.com API v4
    const url = `https://api.quran.com/api/v4/tafsirs/${tafsirId}/by_ayah/${surahNumber}:${verseNumber}`;
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url);

    if (!response.ok) {
      console.error('API error:', response.status, await response.text());
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received tafsir data:', JSON.stringify(data).substring(0, 200));

    // Extract text from response - remove HTML tags
    let text = data.tafsir?.text || '';
    text = text.replace(/<[^>]*>/g, ''); // Remove HTML tags

    return new Response(
      JSON.stringify({ text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error fetching tafsir:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tafsir';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
