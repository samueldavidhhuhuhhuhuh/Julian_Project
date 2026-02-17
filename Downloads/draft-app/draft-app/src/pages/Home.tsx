import { Bell, ChevronRight, AlertTriangle, Play } from 'lucide-react';
import { User, Match } from '../lib/types';
import { MatchCard } from '../components/MatchCard';
import { DelayStatusBadge, getEstimatedTime } from '../components/DelayStatusBadge';

interface Props {
  user: User;
  matches: Match[];
  delayedMatches: Match[];
  liveMatches: Match[];
  onNavigate: (page: string) => void;
}

export function HomePage({ user, matches, delayedMatches, liveMatches, onNavigate }: Props) {
  const isAdmin = user.role === 'admin';
  const isPlayer = user.role === 'player';

  // For player: find their next match
  const nextMatch = isPlayer
    ? matches.find(m => m.teamHome === user.team || m.teamAway === user.team)
    : null;

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Buenos días' : now.getHours() < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 16px', background: 'linear-gradient(180deg, rgba(55,197,220,0.08) 0%, transparent 100%)' }}>
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{greeting},</p>
            <h1 className="font-heading" style={{ fontSize: 28, fontWeight: 700, margin: '2px 0 0' }}>
              {user.name.split(' ')[0]}
            </h1>
            {user.team && (
              <p style={{ fontSize: 12, color: 'var(--primary)', margin: '2px 0 0', fontWeight: 500 }}>
                {user.team} · {user.position}
              </p>
            )}
          </div>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--primary), #1a9eb5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="font-heading" style={{ fontSize: 16, fontWeight: 700, color: '#0F1117' }}>
              {user.avatarInitials}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }} className="flex flex-col gap-4">

        {/* Alert banner for delays */}
        {delayedMatches.length > 0 && (
          <button
            onClick={() => onNavigate('delays')}
            className="animate-slide-up"
            style={{
              background: 'rgba(255,77,77,0.1)',
              border: '1px solid rgba(255,77,77,0.3)',
              borderRadius: 12,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <AlertTriangle size={18} style={{ color: '#FF4D4D', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span className="font-heading" style={{ fontSize: 14, fontWeight: 700, color: '#FF4D4D' }}>
                {delayedMatches.length} PARTIDO{delayedMatches.length > 1 ? 'S' : ''} CON ATRASO
              </span>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Ver tablero de atrasos →
              </p>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </button>
        )}

        {/* Live match banner */}
        {liveMatches.length > 0 && (
          <div
            className="animate-slide-up"
            style={{
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 12,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div className="animate-pulse-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span className="font-heading" style={{ fontSize: 14, fontWeight: 700, color: '#22C55E' }}>
                {liveMatches[0].teamHome} vs {liveMatches[0].teamAway}
              </span>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                EN CURSO · {liveMatches[0].field}
              </p>
            </div>
            <Play size={14} style={{ color: '#22C55E' }} />
          </div>
        )}

        {/* Player: Next match hero */}
        {isPlayer && nextMatch && (
          <div
            className="animate-slide-up"
            style={{
              background: 'linear-gradient(135deg, rgba(55,197,220,0.15), rgba(55,197,220,0.05))',
              border: '1px solid rgba(55,197,220,0.25)',
              borderRadius: 14,
              padding: '16px',
              animationDelay: '60ms',
            }}
          >
            <p className="font-heading" style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.08em', margin: '0 0 10px' }}>
              TU PRÓXIMO PARTIDO
            </p>
            <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
              <span className="font-heading" style={{ fontSize: 22, fontWeight: 700 }}>{nextMatch.teamHome}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', padding: '2px 8px', background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>VS</span>
              <span className="font-heading" style={{ fontSize: 22, fontWeight: 700 }}>{nextMatch.teamAway}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: nextMatch.status === 'delayed' ? 'line-through' : 'none' }}>
                  {nextMatch.scheduledTime}
                </span>
                {nextMatch.status === 'delayed' && (
                  <span className="font-heading" style={{ fontSize: 18, fontWeight: 700, marginLeft: 8, color: nextMatch.delayMinutes >= 45 ? '#FF4D4D' : '#F59E0B' }}>
                    {getEstimatedTime(nextMatch.scheduledTime, nextMatch.delayMinutes)}
                  </span>
                )}
              </div>
              <DelayStatusBadge status={nextMatch.status} delayMinutes={nextMatch.delayMinutes} size="sm" />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
              📍 {nextMatch.field} · {nextMatch.tournamentName}
            </p>
          </div>
        )}

        {/* Today's matches */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <h2 className="font-heading" style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
              {isAdmin ? 'TODOS LOS PARTIDOS' : 'PARTIDOS DE HOY'}
            </h2>
            <button
              onClick={() => onNavigate('delays')}
              style={{ fontSize: 12, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Ver tablero →
            </button>
          </div>

          <div className="flex flex-col gap-3 stagger">
            {matches.map((m, i) => (
              <MatchCard key={m.id} match={m} index={i} />
            ))}
          </div>
        </div>

        {/* Admin stats */}
        {isAdmin && (
          <div className="animate-slide-up" style={{ animationDelay: '140ms' }}>
            <h2 className="font-heading" style={{ fontSize: 18, fontWeight: 700, margin: '0 0 12px' }}>
              RESUMEN DEL DÍA
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Partidos hoy', value: matches.length, color: 'var(--primary)' },
                { label: 'Con atraso', value: delayedMatches.length, color: '#FF4D4D' },
                { label: 'En curso', value: liveMatches.length, color: '#22C55E' },
                { label: 'Programados', value: matches.filter(m => m.status === 'scheduled').length, color: '#8B8FA8' },
              ].map(({ label, value, color }) => (
                <div key={label} className="card" style={{ padding: '14px 16px' }}>
                  <div className="font-heading" style={{ fontSize: 32, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
