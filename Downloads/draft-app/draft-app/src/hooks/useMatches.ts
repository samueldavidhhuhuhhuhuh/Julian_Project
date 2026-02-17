import { useState, useCallback, useEffect } from 'react';
import { Match, MatchStatus } from '../lib/types';
import { INITIAL_MATCHES } from '../lib/mockData';

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLive] = useState(true); // simulates realtime connected

  // Simulate real-time: randomly update a "live" match every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateMatchDelay = useCallback((matchId: string, delayMinutes: number, status: MatchStatus, message?: string) => {
    setMatches(prev => prev.map(m =>
      m.id === matchId
        ? { ...m, delayMinutes, status, delayMessage: message || m.delayMessage, updatedAt: new Date().toISOString() }
        : m
    ));
    setLastUpdate(new Date());
  }, []);

  const updateMatchStatus = useCallback((matchId: string, status: MatchStatus) => {
    setMatches(prev => prev.map(m =>
      m.id === matchId
        ? { ...m, status, updatedAt: new Date().toISOString() }
        : m
    ));
    setLastUpdate(new Date());
  }, []);

  const todayMatches = matches.filter(m => m.status !== 'finished');
  
  const delayedMatches = matches.filter(m => m.status === 'delayed');
  const liveMatches = matches.filter(m => m.status === 'live');

  return {
    matches,
    todayMatches,

    delayedMatches,
    liveMatches,
    lastUpdate,
    isLive,
    updateMatchDelay,
    updateMatchStatus,
  };
}
