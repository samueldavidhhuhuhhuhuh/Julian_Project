// ============================================================
// DRAFT APP — HOME DASHBOARD
// ============================================================

import { Match, Tournament, User } from '../types';
import { MatchCard } from '../components/SharedComponents';
import { Trophy, Users, Clock, ChevronRight, Star } from 'lucide-react';
import { Page } from '../types';

interface HomePageProps {
  user: User;
  matches: Match[];
  tournament: Tournament;
  onNavigate: (page: Page) => void;
}

export function HomePage({ user, matches, tournament, onNavigate }: HomePageProps) {
  const isAdmin = user.role === 'admin';
  const isPlayer = user.role === 'player';

  // Player's next upcoming match
  const myNextMatch = isPlayer
    ? matches.find(
        m =>
          (m.status === 'scheduled' || m.status === 'delayed') &&
          (m.team_home.name === user.team || m.team_away.name === user.team)
      )
    : null;

  const delayedMatches = matches.filter(m => m.status === 'delayed');
  const liveMatches = matches.filter(m => m.status === 'live');

  return (
    <div className="min-h-screen bg-draft-bg pb-28">
      {/* Header Greeting */}
      <div className="bg-gradient-to-br from-draft-card to-draft-bg px-4 pt-12 pb-6 safe-top border-b border-draft-border">
        <p className="font-body text-sm text-draft-muted">
          {isAdmin ? '🔐 Administrador' : isPlayer ? '⚽ Jugador' : '👁️ Espectador'}
        </p>
        <h1 className="font-display font-bold text-3xl text-draft-text mt-0.5">
          Hola, {user.name.split(' ')[0]}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-draft-cyan animate-pulse_slow" />
          <span className="font-body text-xs text-draft-cyan">{tournament.name}</span>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* ADMIN QUICK STATS */}
        {isAdmin && (
          <div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '🟢', label: 'En Vivo', value: liveMatches.length, color: 'text-draft-green' },
                { icon: '⚠️', label: 'Atrasos', value: delayedMatches.length, color: 'text-draft-red' },
                { icon: '📋', label: 'Hoy', value: matches.filter(m => m.status !== 'finished').length, color: 'text-draft-cyan' },
              ].map(stat => (
                <div key={stat.label} className="bg-draft-card border border-draft-border rounded-2xl p-3 text-center">
                  <p className="text-xl mb-1">{stat.icon}</p>
                  <p className={`font-display font-bold text-2xl ${stat.color}`}>{stat.value}</p>
                  <p className="font-body text-xs text-draft-muted">{stat.label}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate('admin')}
              className="w-full mt-3 bg-draft-cyan text-draft-bg font-display font-bold text-base py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-draft-cyan-dark active:scale-95 transition-all"
            >
              Gestionar Atrasos
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* PLAYER NEXT MATCH HERO CARD */}
        {isPlayer && myNextMatch && (
          <div>
            <p className="font-display text-sm text-draft-muted tracking-wider mb-2">TU PRÓXIMO PARTIDO</p>
            <div
              className={`relative overflow-hidden rounded-2xl border p-5 ${
                myNextMatch.status === 'delayed'
                  ? 'bg-gradient-to-br from-draft-red/15 to-draft-card border-draft-red/50 glow-red'
                  : 'bg-gradient-to-br from-draft-cyan/10 to-draft-card border-draft-cyan/40 glow-cyan'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-body text-xs text-draft-muted">{myNextMatch.field} · {myNextMatch.phase}</span>
                {myNextMatch.status === 'delayed' ? (
                  <span className="font-display font-bold text-sm text-draft-red animate-pulse_slow">⚠ ATRASO</span>
                ) : (
                  <span className="font-display font-bold text-sm text-draft-green">✓ A TIEMPO</span>
                )}
              </div>

              <div className="text-center my-2">
                <p className="font-display font-bold text-xl text-draft-text">{myNextMatch.team_home.name}</p>
                <p className="font-display text-draft-muted text-sm my-1">vs</p>
                <p className="font-display font-bold text-xl text-draft-text">{myNextMatch.team_away.name}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-3">
                <Clock size={15} className="text-draft-muted" />
                {myNextMatch.status === 'delayed' ? (
                  <span className="font-body text-sm">
                    <span className="line-through text-draft-muted">{myNextMatch.scheduled_time}</span>
                    <span className="text-draft-red font-semibold ml-2">{myNextMatch.estimated_time}</span>
                    <span className="text-draft-red text-xs ml-1">(+{myNextMatch.delay_minutes} min)</span>
                  </span>
                ) : (
                  <span className="font-body text-sm text-draft-text font-semibold">{myNextMatch.scheduled_time}</span>
                )}
              </div>

              {myNextMatch.delay_reason && (
                <p className="font-body text-xs text-draft-red/70 italic text-center mt-2">
                  {myNextMatch.delay_reason}
                </p>
              )}
            </div>
          </div>
        )}

        {/* PLAYER STATS */}
        {isPlayer && user.stats && (
          <div>
            <p className="font-display text-sm text-draft-muted tracking-wider mb-2">TU TEMPORADA</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Partidos', value: user.stats.matches },
                { label: 'Victorias', value: user.stats.wins },
                { label: 'Goles', value: user.stats.goals },
                { label: 'Ranking', value: `#${user.stats.ranking}` },
              ].map(stat => (
                <div key={stat.label} className="bg-draft-card border border-draft-border rounded-xl p-2.5 text-center">
                  <p className="font-display font-bold text-xl text-draft-cyan">{stat.value}</p>
                  <p className="font-body text-[10px] text-draft-muted mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALERTS: Delayed matches */}
        {delayedMatches.length > 0 && (
          <div>
            <p className="font-display text-sm text-draft-muted tracking-wider mb-2">ATRASOS ACTIVOS</p>
            <div className="space-y-2">
              {delayedMatches.slice(0, 2).map(m => (
                <MatchCard key={m.id} match={m} onClick={() => onNavigate('delays')} />
              ))}
            </div>
            {delayedMatches.length > 2 && (
              <button
                onClick={() => onNavigate('delays')}
                className="w-full mt-2 text-draft-cyan font-body text-sm py-2 flex items-center justify-center gap-1 hover:underline"
              >
                Ver {delayedMatches.length - 2} más <ChevronRight size={14} />
              </button>
            )}
          </div>
        )}

        {/* QUICK ACTIONS */}
        <div>
          <p className="font-display text-sm text-draft-muted tracking-wider mb-2">ACCESOS RÁPIDOS</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Clock, label: 'Atrasos en Vivo', page: 'delays' as Page, color: 'text-draft-red' },
              { icon: Trophy, label: 'Torneos', page: 'tournaments' as Page, color: 'text-draft-cyan' },
              { icon: Users, label: 'Mi Perfil', page: 'profile' as Page, color: 'text-draft-muted' },
            ].map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => onNavigate(action.page)}
                  className="bg-draft-card border border-draft-border rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-draft-cyan transition-colors active:scale-95"
                >
                  <Icon size={22} className={action.color} />
                  <span className="font-body text-xs text-draft-muted text-center leading-tight">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* LIVE MATCHES */}
        {liveMatches.length > 0 && (
          <div>
            <p className="font-display text-sm text-draft-muted tracking-wider mb-2">EN VIVO AHORA</p>
            <div className="space-y-2">
              {liveMatches.map(m => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ============================================================
// TOURNAMENTS PAGE
// ============================================================

import { MOCK_TEAMS } from '../data/mockData';

interface TournamentsPageProps {
  matches: Match[];
  tournament: Tournament;
}

export function TournamentsPage({ matches, tournament }: TournamentsPageProps) {
  const sortedTeams = [...MOCK_TEAMS].sort((a, b) => (b.points || 0) - (a.points || 0));

  return (
    <div className="min-h-screen bg-draft-bg pb-28">
      {/* Header */}
      <div className="bg-draft-card border-b border-draft-border px-4 pt-12 pb-4 safe-top">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-draft-green animate-pulse_slow" />
          <span className="font-body text-xs text-draft-green font-medium">ACTIVO</span>
        </div>
        <h1 className="font-display font-bold text-2xl text-draft-text">{tournament.name}</h1>
        <p className="font-body text-sm text-draft-muted mt-0.5">{tournament.venue} · Bogotá</p>
      </div>

      <div className="px-4 pt-5 space-y-6">
        {/* Tournament Info */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Equipos', value: tournament.teams_count, icon: Users },
            { label: 'Premio', value: 'Trofeo', icon: Trophy },
          ].map(info => {
            const Icon = info.icon;
            return (
              <div key={info.label} className="bg-draft-card border border-draft-border rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-draft-cyan/15 rounded-xl flex items-center justify-center">
                  <Icon size={18} className="text-draft-cyan" />
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-draft-text">{info.value}</p>
                  <p className="font-body text-xs text-draft-muted">{info.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Standings Table */}
        <div>
          <p className="font-display text-sm text-draft-muted tracking-wider mb-3">TABLA DE POSICIONES</p>
          <div className="bg-draft-card border border-draft-border rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[30px_1fr_32px_32px_32px_36px] gap-2 px-4 py-2 border-b border-draft-border">
              <span className="font-body text-xs text-draft-muted">#</span>
              <span className="font-body text-xs text-draft-muted">EQUIPO</span>
              <span className="font-body text-xs text-draft-muted text-center">PJ</span>
              <span className="font-body text-xs text-draft-muted text-center">G</span>
              <span className="font-body text-xs text-draft-muted text-center">P</span>
              <span className="font-body text-xs text-draft-cyan text-center font-semibold">PTS</span>
            </div>

            {sortedTeams.map((team, idx) => (
              <div
                key={team.id}
                className={`grid grid-cols-[30px_1fr_32px_32px_32px_36px] gap-2 px-4 py-3 items-center ${
                  idx < sortedTeams.length - 1 ? 'border-b border-draft-border/50' : ''
                } ${idx === 0 ? 'bg-draft-cyan/5' : ''}`}
              >
                <span className={`font-display font-bold text-sm ${idx === 0 ? 'text-draft-cyan' : idx === 1 ? 'text-draft-muted' : 'text-draft-border'}`}>
                  {idx + 1}
                </span>
                <div className="flex items-center gap-2">
                  {idx === 0 && <Star size={12} className="text-draft-cyan shrink-0" />}
                  <span className={`font-body text-sm font-medium truncate ${idx < 4 ? 'text-draft-text' : 'text-draft-muted'}`}>
                    {team.name}
                  </span>
                </div>
                <span className="font-body text-sm text-draft-muted text-center">
                  {(team.wins || 0) + (team.losses || 0)}
                </span>
                <span className="font-body text-sm text-draft-green text-center">{team.wins || 0}</span>
                <span className="font-body text-sm text-draft-red text-center">{team.losses || 0}</span>
                <span className="font-display font-bold text-sm text-draft-cyan text-center">{team.points || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Matches */}
        <div>
          <p className="font-display text-sm text-draft-muted tracking-wider mb-3">TODOS LOS PARTIDOS HOY</p>
          <div className="space-y-3">
            {matches.map(m => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// ============================================================
// PROFILE PAGE
// ============================================================

import { LogOut, Edit3, Shield } from 'lucide-react';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
}

export function ProfilePage({ user, onLogout }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-draft-bg pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-draft-card to-draft-bg px-4 pt-12 pb-8 safe-top border-b border-draft-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display font-bold text-2xl text-draft-text">PERFIL</h1>
          <button className="p-2 rounded-xl bg-draft-card border border-draft-border hover:border-draft-cyan transition-colors">
            <Edit3 size={16} className="text-draft-muted" />
          </button>
        </div>

        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-draft-cyan to-draft-cyan-dark flex items-center justify-center shrink-0">
            <span className="font-display font-bold text-2xl text-draft-bg">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-draft-text">{user.name}</h2>
            <p className="font-body text-sm text-draft-muted">{user.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield size={12} className="text-draft-cyan" />
              <span className="font-body text-xs text-draft-cyan capitalize">
                {user.role === 'admin' ? 'Administrador' : user.role === 'player' ? 'Jugador' : 'Espectador'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* Player Info */}
        {user.team && (
          <div className="bg-draft-card border border-draft-border rounded-2xl p-4">
            <p className="font-display text-sm text-draft-muted tracking-wider mb-3">INFO DEPORTIVA</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-body text-xs text-draft-muted">Equipo</p>
                <p className="font-display font-semibold text-draft-text mt-0.5">{user.team}</p>
              </div>
              {user.position && (
                <div>
                  <p className="font-body text-xs text-draft-muted">Posición</p>
                  <p className="font-display font-semibold text-draft-text mt-0.5">{user.position}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        {user.stats && user.stats.matches > 0 && (
          <div>
            <p className="font-display text-sm text-draft-muted tracking-wider mb-3">ESTADÍSTICAS</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Partidos Jugados', value: user.stats.matches, color: 'text-draft-text' },
                { label: 'Victorias', value: user.stats.wins, color: 'text-draft-green' },
                { label: 'Goles', value: user.stats.goals, color: 'text-draft-cyan' },
                { label: 'Ranking', value: `#${user.stats.ranking}`, color: 'text-draft-yellow' },
              ].map(stat => (
                <div key={stat.label} className="bg-draft-card border border-draft-border rounded-xl p-4">
                  <p className={`font-display font-bold text-3xl ${stat.color}`}>{stat.value}</p>
                  <p className="font-body text-xs text-draft-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-draft-red/10 border border-draft-red/30 text-draft-red font-display font-semibold text-base py-4 rounded-2xl hover:bg-draft-red/20 active:scale-95 transition-all"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>

        {/* App version */}
        <p className="text-center font-body text-xs text-draft-border pb-2">Draft App v1.0 · Bogotá, Colombia</p>
      </div>
    </div>
  );
}
