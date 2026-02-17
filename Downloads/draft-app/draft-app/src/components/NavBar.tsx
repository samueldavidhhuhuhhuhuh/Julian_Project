import { Home, Clock, Trophy, Shield, User } from 'lucide-react';
import { Page, User as UserType } from '../lib/types';

interface NavBarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: UserType | null;
}

export function NavBar({ currentPage, onNavigate, user }: NavBarProps) {
  const items = [
    { page: 'home' as Page, label: 'Inicio', Icon: Home },
    { page: 'delays' as Page, label: 'Atrasos', Icon: Clock },
    { page: 'tournaments' as Page, label: 'Torneos', Icon: Trophy },
    ...(user?.role === 'admin' ? [{ page: 'admin' as Page, label: 'Admin', Icon: Shield }] : []),
    { page: 'profile' as Page, label: user ? 'Perfil' : 'Cuenta', Icon: User },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        background: 'rgba(15,17,23,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        zIndex: 50,
        paddingTop: 8,
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      }}
    >
      {items.map(({ page, label, Icon }) => {
        const active = currentPage === page;
        return (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 4px 2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              color: active ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'color 0.15s',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, letterSpacing: '0.03em' }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

interface TopBarProps {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}

export function TopBar({ title, subtitle, rightSlot }: TopBarProps) {
  return (
    <div
      style={{
        padding: '16px 20px 12px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '0.01em' }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>{subtitle}</p>
          )}
        </div>
        {rightSlot}
      </div>
    </div>
  );
}
