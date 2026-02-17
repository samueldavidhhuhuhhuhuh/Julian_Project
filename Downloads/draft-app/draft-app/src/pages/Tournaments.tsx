import { Trophy, ChevronRight } from 'lucide-react';
import { MOCK_TOURNAMENTS, MOCK_STANDINGS } from '../lib/mockData';

export function TournamentsPage() {
  return (
    <div style={{ padding: '0 0 80px' }}>
      <div style={{ padding: '0 16px' }}>

        {/* Active tournaments */}
        <div style={{ marginBottom: 24 }}>
          <h2 className="font-heading" style={{ fontSize: 18, fontWeight: 700, margin: '16px 0 12px' }}>
            TORNEOS
          </h2>
          <div className="flex flex-col gap-3 stagger">
            {MOCK_TOURNAMENTS.map((t, i) => (
              <div key={t.id} className="card card-hover animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div style={{ padding: '14px 16px' }}>
                  <div className="flex items-start justify-between" style={{ marginBottom: 10 }}>
                    <div>
                      <div className="font-heading" style={{ fontSize: 17, fontWeight: 700 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                        {t.sport} · {t.teamsCount} equipos
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      padding: '3px 9px',
                      borderRadius: 20,
                      background: t.status === 'active' ? 'rgba(34,197,94,0.12)' : 'rgba(55,197,220,0.12)',
                      color: t.status === 'active' ? '#22C55E' : 'var(--primary)',
                      border: `1px solid ${t.status === 'active' ? 'rgba(34,197,94,0.3)' : 'rgba(55,197,220,0.3)'}`,
                      letterSpacing: '0.04em',
                    }}>
                      {t.status === 'active' ? 'ACTIVO' : 'PRÓXIMO'}
                    </span>
                  </div>

                  {/* Progress */}
                  {t.status === 'active' && (
                    <div>
                      <div className="flex justify-between" style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 5 }}>
                        <span>{t.matchesPlayed} / {t.totalMatches} partidos</span>
                        <span>{Math.round(t.matchesPlayed / t.totalMatches * 100)}%</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${t.matchesPlayed / t.totalMatches * 100}%`,
                          background: 'var(--primary)',
                          borderRadius: 2,
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Standings table */}
        <div className="animate-slide-up" style={{ animationDelay: '120ms' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
            <Trophy size={16} style={{ color: 'var(--primary)' }} />
            <h2 className="font-heading" style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
              TABLA DE POSICIONES
            </h2>
          </div>

          {/* Header */}
          <div
            className="font-heading"
            style={{
              display: 'grid',
              gridTemplateColumns: '28px 1fr 32px 32px 32px 40px',
              padding: '7px 12px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '8px 8px 0 0',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
              gap: 4,
            }}
          >
            <span>#</span>
            <span>EQUIPO</span>
            <span style={{ textAlign: 'center' }}>G</span>
            <span style={{ textAlign: 'center' }}>E</span>
            <span style={{ textAlign: 'center' }}>P</span>
            <span style={{ textAlign: 'center' }}>PTS</span>
          </div>

          {/* Rows */}
          <div style={{ background: 'var(--card)', borderRadius: '0 0 12px 12px', border: '1px solid var(--border)', borderTop: 'none' }}>
            {MOCK_STANDINGS.map((team, i) => (
              <div
                key={team.id}
                className="animate-board-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '28px 1fr 32px 32px 32px 40px',
                  padding: '11px 12px',
                  borderBottom: i < MOCK_STANDINGS.length - 1 ? '1px solid var(--border)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  animationDelay: `${i * 40}ms`,
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span
                  className="font-heading"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: i === 0 ? '#F59E0B' : i === 1 ? '#8B8FA8' : i === 2 ? '#CD7F32' : 'var(--text-muted)',
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: 14, fontWeight: i < 3 ? 600 : 400 }}>{team.name}</span>
                <span style={{ textAlign: 'center', fontSize: 13, color: '#22C55E' }}>{team.wins}</span>
                <span style={{ textAlign: 'center', fontSize: 13, color: '#F59E0B' }}>{team.draws}</span>
                <span style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>{team.losses}</span>
                <span className="font-heading" style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>{team.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
