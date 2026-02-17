import { useState } from 'react';
import { X, Clock, AlertTriangle, Play, CheckCircle } from 'lucide-react';
import { Match, MatchStatus } from '../lib/types';

interface Props {
  match: Match;
  onUpdate: (matchId: string, delayMinutes: number, status: MatchStatus, message?: string) => void;
  onClose: () => void;
}

const DELAY_PRESETS = [
  { label: 'A TIEMPO', minutes: 0, status: 'scheduled' as MatchStatus, color: '#22C55E' },
  { label: '+15 MIN', minutes: 15, status: 'delayed' as MatchStatus, color: '#F59E0B' },
  { label: '+30 MIN', minutes: 30, status: 'delayed' as MatchStatus, color: '#F59E0B' },
  { label: '+45 MIN', minutes: 45, status: 'delayed' as MatchStatus, color: '#FF4D4D' },
  { label: '+60 MIN', minutes: 60, status: 'delayed' as MatchStatus, color: '#FF4D4D' },
];

const DELAY_REASONS = [
  'Partido anterior en tiempo extra',
  'Lluvia en la cancha',
  'Espera de equipos',
  'Mantenimiento de cancha',
  'Problema logístico',
];

export function DelayUpdateModal({ match, onUpdate, onClose }: Props) {
  const [selectedPreset, setSelectedPreset] = useState<typeof DELAY_PRESETS[0] | null>(null);
  const [reason, setReason] = useState(match.delayMessage || '');
  const [customReason, setCustomReason] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const handleApply = () => {
    if (!selectedPreset) return;
    const msg = useCustom ? customReason : reason;
    onUpdate(match.id, selectedPreset.minutes, selectedPreset.status, msg || undefined);
    onClose();
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end',
        padding: 0,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="animate-slide-up"
        style={{
          width: '100%', maxWidth: 480, margin: '0 auto',
          background: 'var(--card)',
          borderRadius: '20px 20px 0 0',
          border: '1px solid var(--border)',
          padding: '20px 20px 32px',
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, margin: '0 auto 16px' }} />

        {/* Header */}
        <div className="flex items-start justify-between" style={{ marginBottom: 16 }}>
          <div>
            <h3 className="font-heading" style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
              ACTUALIZAR PARTIDO
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>
              {match.teamHome} vs {match.teamAway} · {match.field}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Special status buttons */}
        <div className="flex gap-2" style={{ marginBottom: 16 }}>
          <button
            onClick={() => { onUpdate(match.id, 0, 'live', undefined); onClose(); }}
            className="btn"
            style={{ flex: 1, background: 'rgba(34,197,94,0.15)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)', fontSize: 13 }}
          >
            <Play size={14} /> EN CURSO
          </button>
          <button
            onClick={() => { onUpdate(match.id, 0, 'finished', undefined); onClose(); }}
            className="btn"
            style={{ flex: 1, background: 'rgba(139,143,168,0.1)', color: '#8B8FA8', border: '1px solid rgba(139,143,168,0.2)', fontSize: 13 }}
          >
            <CheckCircle size={14} /> FINALIZADO
          </button>
          <button
            onClick={() => { onUpdate(match.id, 0, 'cancelled', 'Partido cancelado'); onClose(); }}
            className="btn btn-danger"
            style={{ flex: 1, fontSize: 13 }}
          >
            <AlertTriangle size={14} /> CANCELAR
          </button>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)', margin: '0 0 16px' }} />

        {/* Delay presets */}
        <p className="font-heading" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.06em' }}>
          MINUTOS DE ATRASO
        </p>
        <div className="flex gap-2 flex-wrap" style={{ marginBottom: 16 }}>
          {DELAY_PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => setSelectedPreset(p)}
              className="btn"
              style={{
                flex: '1 0 auto',
                border: selectedPreset?.label === p.label
                  ? `2px solid ${p.color}`
                  : '1px solid var(--border)',
                background: selectedPreset?.label === p.label
                  ? `rgba(${p.color === '#22C55E' ? '34,197,94' : p.color === '#F59E0B' ? '245,158,11' : '255,77,77'},0.15)`
                  : 'rgba(255,255,255,0.04)',
                color: p.color,
                fontSize: 13,
                padding: '8px 12px',
              }}
            >
              <Clock size={12} />
              {p.label}
            </button>
          ))}
        </div>

        {/* Reason */}
        {selectedPreset && selectedPreset.minutes > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p className="font-heading" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.06em' }}>
              MOTIVO DEL ATRASO
            </p>
            <div className="flex flex-col gap-2">
              {DELAY_REASONS.map(r => (
                <button
                  key={r}
                  onClick={() => { setReason(r); setUseCustom(false); }}
                  style={{
                    padding: '8px 12px',
                    background: reason === r && !useCustom ? 'var(--primary-dim)' : 'rgba(255,255,255,0.04)',
                    border: reason === r && !useCustom ? '1px solid var(--primary)' : '1px solid var(--border)',
                    color: reason === r && !useCustom ? 'var(--primary)' : 'var(--text)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 13,
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  {r}
                </button>
              ))}
              <input
                className="input-field"
                placeholder="Otro motivo..."
                value={useCustom ? customReason : ''}
                onChange={e => { setCustomReason(e.target.value); setUseCustom(true); setReason(''); }}
                onFocus={() => setUseCustom(true)}
              />
            </div>
          </div>
        )}

        {/* Apply button */}
        <button
          onClick={handleApply}
          disabled={!selectedPreset}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: 16,
            opacity: selectedPreset ? 1 : 0.4,
            cursor: selectedPreset ? 'pointer' : 'not-allowed',
          }}
        >
          APLICAR CAMBIO
        </button>
      </div>
    </div>
  );
}
