import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useViewerId } from './useViewerId';

interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  todayUniqueVisitors: number;
}

export const useVisitorStats = () => {
  const [stats, setStats] = useState<VisitorStats>({
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisits: 0,
    todayUniqueVisitors: 0
  });
  const [loading, setLoading] = useState(true);
  const viewerId = useViewerId();

  useEffect(() => {
    const recordVisit = async () => {
      if (!viewerId) return;

      try {
        // Record the visit using the database function
        await supabase.rpc('record_visit', {
          p_visitor_id: viewerId,
          p_page_path: window.location.pathname
        });
      } catch (error) {
        console.error('Error recording visit:', error);
      }
    };

    const fetchStats = async () => {
      try {
        // Get all-time stats
        const { data: allTimeData } = await supabase
          .from('visitor_stats')
          .select('total_visits, unique_visitors');

        // Get today's stats
        const today = new Date().toISOString().split('T')[0];
        const { data: todayData } = await supabase
          .from('visitor_stats')
          .select('total_visits, unique_visitors')
          .eq('date', today)
          .maybeSingle();

        const totalVisits = allTimeData?.reduce((sum, row) => sum + (row.total_visits || 0), 0) || 0;
        const uniqueVisitors = allTimeData?.reduce((sum, row) => sum + (row.unique_visitors || 0), 0) || 0;

        setStats({
          totalVisits,
          uniqueVisitors,
          todayVisits: todayData?.total_visits || 0,
          todayUniqueVisitors: todayData?.unique_visitors || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    recordVisit();
    fetchStats();
  }, [viewerId]);

  return { stats, loading };
};
