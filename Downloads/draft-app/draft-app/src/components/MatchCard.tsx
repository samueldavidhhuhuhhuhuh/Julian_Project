import { MapPin, MessageSquare } from 'lucide-react';
import { Match } from '../lib/types';
import { DelayStatusBadge, getEstimatedTime } from './DelayStatusBadge';

interface Props {
  match: Match;
  highlight?: boolean;
  index?: number;
}

export function MatchCard({ match, highlight, index = 0 }: Props) {
  const estimated = getEstimatedTime(match.scheduledTime, match.delayMinutes);
  const isDelayed = match.status === 'delayed';
  const isLive = match.status === 'live';

  return (
    <div
      className="card card-hover animate-slide-up"
      style={{
        animationDelay: `${index * 60}ms`,
        border: isLive
          ? '1px solid rgba(34,197,94,0.35)'
          : isDelayed
          ? match.delayMinutes >= 45
            ? '1px solid rgba(255,77,77,0.25)'
            : '1px solid rgba(245,158,11,0.25)'
          : undefined,
        boxShadow: highlight ? '0 0 20px rgba(55,197,220,0.15)' : undefined,
      }}
    >
      <div style={{ padding: '14px 16px' }}>
        {/* Header: tournament + field */}
        <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {match.tournamentName}
          </span>
          <span className="flex items-center gap-1" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            <MapPin size={10} />
            {match.field}
          </span>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <span className="font-heading" style={{ fontSize: 20, fontWeight: 700, flex: 1 }}>
            {match.teamHome}
          </span>
          <span style={{
            fontSize: 12, fontWeight: 700,
            color: 'var(--text-muted)',
            padding: '2px 8px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 4,
            margin: '0 10px',
            letterSpacing: '0.06em',
          }}>
            VS
          </span>
          <span className="font-heading" style={{ fontSize: 20, fontWeight: 700, flex: 1, textAlign: 'right' }}>
            {match.teamAway}
          </span>
        </div>

        {/* Time + Status */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: isDelayed ? 'line-through' : 'none' }}>
              {match.scheduledTime}
            </span>
            {isDelayed && (
              <span className="font-heading" style={{ fontSize: 15, fontWeight: 700, color: match.delayMinutes >= 45 ? '#FF4D4D' : '#F59E0B' }}>
                → {estimated}
              </span>
            )}
          </div>
          <DelayStatusBadge status={match.status} delayMinutes={match.delayMinutes} size="sm" />
        </div>

        {/* Delay reason */}
        {isDelayed && match.delayMessage && (
          <div className="flex items-center gap-2" style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 6 }}>
            <MessageSquare size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{match.delayMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
