import { LiveDepartureBoard } from '../components/LiveDepartureBoard';
import { Match } from '../lib/types';
import { ExternalLink } from 'lucide-react';

interface Props {
  matches: Match[];
  allMatches: Match[];
  lastUpdate: Date;
  isLive: boolean;
}

export function DelaysPage({ matches, allMatches, lastUpdate, isLive }: Props) {
  const delayed = matches.filter(m => m.status === 'delayed');

  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* Header */}
      <div style={{ padding: '20px 16px 0' }}>
        {/* Summary pills */}
        <div className="flex gap-2 flex-wrap animate-fade-in" style={{ marginBottom: 16 }}>
          {[
            { label: 'ATRASADOS', count: delayed.length, color: '#FF4D4D', bg: 'rgba(255,77,77,0.12)', border: 'rgba(255,77,77,0.25)' },
            { label: 'EN CURSO', count: matches.filter(m => m.status === 'live').length, color: '#22C55E', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.25)' },
            { label: 'EN HORA', count: matches.filter(m => m.status === 'scheduled').length, color: '#8B8FA8', bg: 'rgba(139,143,168,0.1)', border: 'rgba(139,143,168,0.2)' },
          ].map(({ label, count, color, bg, border }) => (
            <div
              key={label}
              className="font-heading"
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 20,
                padding: '5px 12px',
                fontSize: 12,
                fontWeight: 600,
                color,
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span style={{ fontSize: 16 }}>{count}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <LiveDepartureBoard matches={allMatches} lastUpdate={lastUpdate} isLive={isLive} />

        {/* TV mode hint */}
        <div
          style={{
            marginTop: 16,
            padding: '10px 14px',
            background: 'rgba(55,197,220,0.06)',
            border: '1px solid rgba(55,197,220,0.15)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <ExternalLink size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
            <span style={{ color: 'var(--primary)', fontWeight: 500 }}>Modo TV:</span> Comparte este link al centro deportivo para mostrarlo en pantalla grande.
          </p>
        </div>
      </div>
    </div>
  );
}
