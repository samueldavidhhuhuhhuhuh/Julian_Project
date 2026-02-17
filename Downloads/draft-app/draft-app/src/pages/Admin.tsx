import { useState } from 'react';
import { Edit3, Clock, Play, CheckCircle, XCircle } from 'lucide-react';
import { Match, MatchStatus } from '../lib/types';
import { DelayUpdateModal } from '../components/DelayUpdateModal';
import { DelayStatusBadge } from '../components/DelayStatusBadge';

interface Props {
  matches: Match[];
  allMatches: Match[];
  onUpdateMatch: (matchId: string, delayMinutes: number, status: MatchStatus, message?: string) => void;
}

export function AdminPage({ matches, allMatches, onUpdateMatch }: Props) {
  const [editMatch, setEditMatch] = useState<Match | null>(null);

  const quickAction = (match: Match, status: MatchStatus) => {
    onUpdateMatch(match.id, status === 'delayed' ? 30 : 0, status);
  };

  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* Stats bar */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { label: 'TOTAL', count: allMatches.length, color: 'var(--text)' },
            { label: 'ATRASADOS', count: allMatches.filter(m => m.status === 'delayed').length, color: '#FF4D4D' },
            { label: 'VIVOS', count: allMatches.filter(m => m.status === 'live').length, color: '#22C55E' },
            { label: 'LISTOS', count: allMatches.filter(m => m.status === 'scheduled').length, color: '#8B8FA8' },
          ].map(({ label, count, color }) => (
            <div key={label} className="card" style={{ padding: '10px 8px', textAlign: 'center' }}>
              <div className="font-heading" style={{ fontSize: 24, fontWeight: 700, color, lineHeight: 1 }}>{count}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.05em', marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Match list */}
      <div style={{ padding: '16px' }}>
        <h2 className="font-heading" style={{ fontSize: 18, fontWeight: 700, margin: '0 0 14px' }}>
          GESTIÓN DE PARTIDOS
        </h2>

        <div className="flex flex-col gap-3 stagger">
          {allMatches.map((match, i) => (
            <div
              key={match.id}
              className="card animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div style={{ padding: '14px 14px 10px' }}>
                {/* Match name */}
                <div className="flex items-start justify-between" style={{ marginBottom: 8 }}>
                  <div>
                    <div className="font-heading" style={{ fontSize: 16, fontWeight: 700 }}>
                      {match.teamHome} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>vs</span> {match.teamAway}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {match.field} · {match.scheduledTime} · {match.tournamentName}
                    </div>
                  </div>
                  <DelayStatusBadge status={match.status} delayMinutes={match.delayMinutes} size="sm" />
                </div>

                {/* Delay reason */}
                {match.delayMessage && match.status === 'delayed' && (
                  <p style={{ fontSize: 12, color: '#F59E0B', marginBottom: 8, padding: '4px 8px', background: 'rgba(245,158,11,0.08)', borderRadius: 5 }}>
                    ⚠️ {match.delayMessage}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ borderTop: '1px solid var(--border)', padding: '10px 14px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={() => quickAction(match, 'live')}
                  className="btn"
                  style={{ fontSize: 11, padding: '6px 10px', background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }}
                >
                  <Play size={11} /> EN CURSO
                </button>
                <button
                  onClick={() => quickAction(match, 'finished')}
                  className="btn"
                  style={{ fontSize: 11, padding: '6px 10px', background: 'rgba(139,143,168,0.1)', color: '#8B8FA8', border: '1px solid rgba(139,143,168,0.2)' }}
                >
                  <CheckCircle size={11} /> FINALIZADO
                </button>
                <button
                  onClick={() => setEditMatch(match)}
                  className="btn btn-primary"
                  style={{ fontSize: 11, padding: '6px 10px', marginLeft: 'auto' }}
                >
                  <Clock size={11} /> ACTUALIZAR ATRASO
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delay update modal */}
      {editMatch && (
        <DelayUpdateModal
          match={editMatch}
          onUpdate={onUpdateMatch}
          onClose={() => setEditMatch(null)}
        />
      )}
    </div>
  );
}
