import { useState } from 'react';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../lib/types';

interface Props {
  onSuccess: () => void;
}

export function AuthPage({ onSuccess }: Props) {
  const { login, loginAsRole, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    const ok = await login(email, password);
    if (ok) onSuccess();
  };

  const handleQuickLogin = (role: UserRole) => {
    loginAsRole(role);
    onSuccess();
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 24px 40px',
      }}
    >
      {/* Logo area */}
      <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          width: 72, height: 72,
          background: 'linear-gradient(135deg, var(--primary), #1a9eb5)',
          borderRadius: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 0 40px rgba(55,197,220,0.3)',
        }}>
          <Zap size={36} color="#0F1117" strokeWidth={2.5} />
        </div>
        <h1 className="font-heading" style={{ fontSize: 42, fontWeight: 700, margin: 0, letterSpacing: '0.04em' }}>
          DRAFT
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Let's Play a Match
        </p>
      </div>

      {/* Login form */}
      <div className="animate-slide-up" style={{ width: '100%', maxWidth: 360, animationDelay: '80ms' }}>
        <div className="flex flex-col gap-3" style={{ marginBottom: 16 }}>
          <input
            className="input-field"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoComplete="email"
          />
          <div style={{ position: 'relative' }}>
            <input
              className="input-field"
              type={showPass ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoComplete="current-password"
              style={{ paddingRight: 44 }}
            />
            <button
              onClick={() => setShowPass(s => !s)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <p style={{ fontSize: 13, color: 'var(--red)', marginBottom: 12, textAlign: 'center' }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !email}
          className="btn btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: 16, marginBottom: 24, opacity: loading || !email ? 0.6 : 1 }}
        >
          {loading ? 'INGRESANDO...' : 'INGRESAR'}
        </button>

        {/* Demo Quick Access */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 12, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Acceso rápido (demo)
          </p>
          <div className="flex flex-col gap-2">
            {[
              { role: 'admin' as UserRole, label: 'Administrador del Centro', desc: 'Gestiona partidos y atrasos', color: 'var(--primary)' },
              { role: 'player' as UserRole, label: 'Jugador', desc: 'Ve tus partidos y estado', color: '#22C55E' },
              { role: 'viewer' as UserRole, label: 'Espectador', desc: 'Solo consulta horarios', color: '#8B8FA8' },
            ].map(({ role, label, desc, color }) => (
              <button
                key={role}
                onClick={() => handleQuickLogin(role)}
                className="card card-hover"
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${color}20`,
                  border: `1px solid ${color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                </div>
                <div>
                  <div className="font-heading" style={{ fontSize: 15, fontWeight: 700, color }}>{label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
