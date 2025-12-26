import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useViewerId } from './useViewerId';

interface RecitationStats {
  totalRecitations: number;
  todayRecitations: number;
}

export const useRecitationStats = () => {
  const [stats, setStats] = useState<RecitationStats>({
    totalRecitations: 0,
    todayRecitations: 0,
  });
  const [loading, setLoading] = useState(true);
  const viewerId = useViewerId();

  const fetchStats = useCallback(async () => {
    try {
      // Get total recitations
      const { data: allStats, error } = await supabase
        .from('recitation_stats')
        .select('total_recitations');

      if (error) throw error;

      const totalRecitations = allStats?.reduce((sum, row) => sum + (row.total_recitations || 0), 0) || 0;

      // Get today's recitations
      const today = new Date().toISOString().split('T')[0];
      const { data: todayStats } = await supabase
        .from('recitation_stats')
        .select('total_recitations')
        .eq('date', today)
        .single();

      setStats({
        totalRecitations,
        todayRecitations: todayStats?.total_recitations || 0,
      });
    } catch (error) {
      console.error('Error fetching recitation stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const recordRecitation = useCallback(async (
    surahId: number,
    verseStart?: number,
    verseEnd?: number,
    reciter?: string
  ) => {
    try {
      const { error } = await supabase.rpc('record_recitation', {
        p_visitor_id: viewerId,
        p_surah_id: surahId,
        p_verse_start: verseStart || null,
        p_verse_end: verseEnd || null,
        p_reciter: reciter || null,
      });

      if (error) throw error;

      // Update local stats
      setStats(prev => ({
        totalRecitations: prev.totalRecitations + 1,
        todayRecitations: prev.todayRecitations + 1,
      }));
    } catch (error) {
      console.error('Error recording recitation:', error);
    }
  }, [viewerId]);

  return {
    stats,
    loading,
    recordRecitation,
    refreshStats: fetchStats,
  };
};
