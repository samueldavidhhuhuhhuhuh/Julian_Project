import { Clock, Zap, CheckCircle, XCircle, Play } from 'lucide-react';
import { MatchStatus } from '../lib/types';

interface Props {
  status: MatchStatus;
  delayMinutes: number;
  size?: 'sm' | 'md' | 'lg';
}

export function DelayStatusBadge({ status, delayMinutes, size = 'md' }: Props) {
  const configs = {
    scheduled: {
      bg: 'rgba(139,143,168,0.15)',
      border: 'rgba(139,143,168,0.3)',
      color: '#8B8FA8',
      label: 'PROGRAMADO',
      Icon: Clock,
    },
    delayed: {
      bg: delayMinutes >= 45 ? 'rgba(255,77,77,0.15)' : 'rgba(245,158,11,0.15)',
      border: delayMinutes >= 45 ? 'rgba(255,77,77,0.35)' : 'rgba(245,158,11,0.35)',
      color: delayMinutes >= 45 ? '#FF4D4D' : '#F59E0B',
      label: `ATRASADO ${delayMinutes} MIN`,
      Icon: Clock,
    },
    live: {
      bg: 'rgba(34,197,94,0.15)',
      border: 'rgba(34,197,94,0.35)',
      color: '#22C55E',
      label: 'EN CURSO',
      Icon: Play,
    },
    finished: {
      bg: 'rgba(139,143,168,0.1)',
      border: 'rgba(139,143,168,0.2)',
      color: '#8B8FA8',
      label: 'FINALIZADO',
      Icon: CheckCircle,
    },
    cancelled: {
      bg: 'rgba(255,77,77,0.1)',
      border: 'rgba(255,77,77,0.25)',
      color: '#FF4D4D',
      label: 'CANCELADO',
      Icon: XCircle,
    },
  };

  const { bg, border, color, label, Icon } = configs[status] || configs.scheduled;

  const sizes = {
    sm: { padding: '3px 8px', fontSize: '10px', iconSize: 10, gap: '4px' },
    md: { padding: '5px 10px', fontSize: '12px', iconSize: 12, gap: '5px' },
    lg: { padding: '8px 14px', fontSize: '14px', iconSize: 14, gap: '6px' },
  };

  const s = sizes[size];

  return (
    <span
      className="inline-flex items-center font-heading font-600 animate-status"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        color,
        padding: s.padding,
        fontSize: s.fontSize,
        gap: s.gap,
        borderRadius: 6,
        letterSpacing: '0.05em',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {status === 'live' && (
        <span
          className="animate-pulse-dot inline-block rounded-full"
          style={{ width: s.iconSize, height: s.iconSize, background: color, flexShrink: 0 }}
        />
      )}
      {status !== 'live' && <Icon size={s.iconSize} strokeWidth={2.5} />}
      <span className="font-heading">{label}</span>
    </span>
  );
}

export function getEstimatedTime(scheduledTime: string, delayMinutes: number): string {
  if (delayMinutes === 0) return scheduledTime;
  const [h, m] = scheduledTime.split(':').map(Number);
  const total = h * 60 + m + delayMinutes;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
}
