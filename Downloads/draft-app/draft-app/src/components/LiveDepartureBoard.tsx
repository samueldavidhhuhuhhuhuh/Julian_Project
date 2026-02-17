import { Match } from '../lib/types';
import { getEstimatedTime } from './DelayStatusBadge';
import { Wifi } from 'lucide-react';

interface Props {
  matches: Match[];
  lastUpdate: Date;
  isLive: boolean;
}

function StatusCell({ match }: { match: Match }) {
  const configs: Record<string, { color: string; bg: string; label: string }> = {
    scheduled: { color: '#8B8FA8', bg: 'rgba(139,143,168,0.12)', label: 'EN HORA' },
    delayed: {
      color: match.delayMinutes >= 45 ? '#FF4D4D' : '#F59E0B',
      bg: match.delayMinutes >= 45 ? 'rgba(255,77,77,0.12)' : 'rgba(245,158,11,0.12)',
      label: `+${match.delayMinutes} MIN`,
    },
    live: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)', label: 'EN CURSO' },
    finished: { color: '#8B8FA8', bg: 'rgba(139,143,168,0.08)', label: 'FINALIZADO' },
    cancelled: { color: '#FF4D4D', bg: 'rgba(255,77,77,0.12)', label: 'CANCELADO' },
  };

  const c = configs[match.status] || configs.scheduled;

  return (
    <span
      className="font-heading"
      style={{
        background: c.bg,
        color: c.color,
        padding: '4px 10px',
        borderRadius: 5,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.05em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        whiteSpace: 'nowrap',
      }}
    >
      {match.status === 'live' && (
        <span
          className="animate-pulse-dot"
          style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }}
        />
      )}
      {c.label}
    </span>
  );
}

export function LiveDepartureBoard({ matches, lastUpdate, isLive }: Props) {
  const sorted = [...matches].sort((a, b) => {
    const order: Record<string, number> = { live: 0, delayed: 1, scheduled: 2, finished: 3, cancelled: 4 };
    const diff = (order[a.status] ?? 5) - (order[b.status] ?? 5);
    if (diff !== 0) return diff;
    return a.scheduledTime.localeCompare(b.scheduledTime);
  });

  return (
    <div>
      {/* Board header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
        <div>
          <h2 className="font-heading" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
            PARTIDOS DE HOY
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
            Centro Deportivo Norte · Bogotá
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <span
              className="flex items-center gap-2"
              style={{
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: 20,
                padding: '4px 10px',
              }}
            >
              <span className="animate-pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
              <Wifi size={11} style={{ color: '#22C55E' }} />
              <span style={{ fontSize: 11, color: '#22C55E', fontWeight: 600 }}>VIVO</span>
            </span>
          )}
        </div>
      </div>

      {/* Column headers */}
      <div
        className="font-heading"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr 80px 80px',
          padding: '6px 14px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '8px 8px 0 0',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-muted)',
          letterSpacing: '0.06em',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span>PARTIDO</span>
        <span>CANCHA</span>
        <span style={{ textAlign: 'center' }}>HORA</span>
        <span style={{ textAlign: 'right' }}>ESTADO</span>
      </div>

      {/* Rows */}
      <div style={{ background: 'var(--card)', borderRadius: '0 0 12px 12px', border: '1px solid var(--border)', borderTop: 'none', overflow: 'hidden' }}>
        {sorted.map((match, i) => {
          const estimated = getEstimatedTime(match.scheduledTime, match.delayMinutes);
          const isOdd = i % 2 === 0;

          return (
            <div
              key={match.id}
              className="animate-board-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr 80px 80px',
                padding: '12px 14px',
                background: isOdd ? 'transparent' : 'rgba(255,255,255,0.02)',
                borderBottom: i < sorted.length - 1 ? '1px solid var(--border)' : 'none',
                animationDelay: `${i * 50}ms`,
                alignItems: 'center',
                opacity: match.status === 'finished' ? 0.45 : 1,
              }}
            >
              {/* Teams */}
              <div>
                <div className="font-heading" style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>
                  {match.teamHome}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  vs {match.teamAway}
                </div>
              </div>

              {/* Field + Tournament */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{match.field}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{match.tournamentName}</div>
              </div>

              {/* Time */}
              <div style={{ textAlign: 'center' }}>
                {match.status === 'delayed' ? (
                  <>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      {match.scheduledTime}
                    </div>
                    <div className="font-heading" style={{ fontSize: 15, fontWeight: 700, color: match.delayMinutes >= 45 ? '#FF4D4D' : '#F59E0B' }}>
                      {estimated}
                    </div>
                  </>
                ) : (
                  <div className="font-heading" style={{ fontSize: 16, fontWeight: 700 }}>
                    {match.scheduledTime}
                  </div>
                )}
              </div>

              {/* Status */}
              <div style={{ textAlign: 'right' }}>
                <StatusCell match={match} />
              </div>
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            No hay partidos programados para hoy
          </div>
        )}
      </div>

      {/* Last update */}
      <div style={{ marginTop: 8, textAlign: 'right', fontSize: 11, color: 'var(--text-muted)' }}>
        Actualizado: {lastUpdate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
