export type UserRole = 'admin' | 'player' | 'viewer';

export type MatchStatus = 'scheduled' | 'delayed' | 'live' | 'finished' | 'cancelled';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  team?: string;
  position?: string;
  avatarInitials: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  tournamentName: string;
  teamHome: string;
  teamAway: string;
  field: string;
  scheduledTime: string; // "HH:MM"
  delayMinutes: number;
  status: MatchStatus;
  delayMessage?: string;
  updatedAt: string;
}

export interface Tournament {
  id: string;
  name: string;
  sport: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'finished';
  teamsCount: number;
  matchesPlayed: number;
  totalMatches: number;
}

export interface Team {
  id: string;
  name: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
}

export type Page = 'home' | 'delays' | 'tournaments' | 'admin' | 'profile' | 'auth';
