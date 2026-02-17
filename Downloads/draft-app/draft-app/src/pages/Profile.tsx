import { User, LogOut, Trophy, Target, Shield, Eye } from 'lucide-react';
import { User as UserType } from '../lib/types';

interface Props {
  user: UserType | null;
  onLogout: () => void;
  onLogin: () => void;
}

export function ProfilePage({ user, onLogout, onLogin }: Props) {
  if (!user) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: 'rgba(55,197,220,0.1)', border: '1px solid rgba(55,197,220,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <User size={28} style={{ color: 'var(--primary)' }} />
        </div>
        <h2 className="font-heading" style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>SIN SESIÓN</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>Inicia sesión para ver tu perfil y partidos</p>
        <button onClick={onLogin} className="btn btn-primary" style={{ padding: '12px 32px', fontSize: 15 }}>
          INICIAR SESIÓN
        </button>
      </div>
    );
  }

  const roleConfig = {
    admin: { label: 'ADMINISTRADOR', color: 'var(--primary)', Icon: Shield },
    player: { label: 'JUGADOR', color: '#22C55E', Icon: Target },
    viewer: { label: 'ESPECTADOR', color: '#8B8FA8', Icon: Eye },
  };

  const rc = roleConfig[user.role];

  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* Profile header */}
      <div style={{
        padding: '28px 20px 24px',
        background: 'linear-gradient(180deg, rgba(55,197,220,0.08) 0%, transparent 100%)',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'linear-gradient(135deg, var(--primary), #1a9eb5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px',
          boxShadow: '0 0 24px rgba(55,197,220,0.25)',
        }}>
          <span className="font-heading" style={{ fontSize: 24, fontWeight: 700, color: '#0F1117' }}>
            {user.avatarInitials}
          </span>
        </div>
        <h2 className="font-heading" style={{ fontSize: 26, fontWeight: 700, margin: '0 0 4px' }}>{user.name}</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <rc.Icon size={13} style={{ color: rc.color }} />
          <span className="font-heading" style={{ fontSize: 13, color: rc.color, fontWeight: 600, letterSpacing: '0.05em' }}>
            {rc.label}
          </span>
        </div>
        {user.team && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
            {user.team} · {user.position}
          </p>
        )}
      </div>

      {/* Info cards */}
      <div style={{ padding: '16px' }}>
        {user.role === 'player' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Partidos', value: 12 },
              { label: 'Victorias', value: 7 },
              { label: 'Posición', value: '#3' },
            ].map(({ label, value }) => (
              <div key={label} className="card" style={{ padding: '14px 12px', textAlign: 'center' }}>
                <div className="font-heading" style={{ fontSize: 26, fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Account info */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ padding: '14px 16px' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', margin: '0 0 10px' }}>CUENTA</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="flex justify-between">
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Correo</span>
                <span style={{ fontSize: 13 }}>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Rol</span>
                <span style={{ fontSize: 13, color: rc.color, fontWeight: 600 }}>{rc.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo info */}
        <div style={{
          padding: '12px 14px',
          background: 'rgba(55,197,220,0.06)',
          border: '1px solid rgba(55,197,220,0.15)',
          borderRadius: 10,
          marginBottom: 16,
        }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
            <span style={{ color: 'var(--primary)', fontWeight: 500 }}>Modo Demo</span> — Usa credenciales reales cuando Supabase esté conectado. Actualmente usando datos de prueba.
          </p>
        </div>

        {/* Logout */}
        <button onClick={onLogout} className="btn btn-danger" style={{ width: '100%', padding: '13px', fontSize: 15 }}>
          <LogOut size={16} />
          CERRAR SESIÓN
        </button>
      </div>
    </div>
  );
}
