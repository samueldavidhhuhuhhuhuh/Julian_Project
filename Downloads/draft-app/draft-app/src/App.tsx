import { useState } from 'react';
import { Page } from './lib/types';
import { useAuth } from './hooks/useAuth';
import { useMatches } from './hooks/useMatches';
import { NavBar, TopBar } from './components/NavBar';
import { AuthPage } from './pages/Auth';
import { HomePage } from './pages/Home';
import { DelaysPage } from './pages/Delays';
import { TournamentsPage } from './pages/Tournaments';
import { AdminPage } from './pages/Admin';
import { ProfilePage } from './pages/Profile';

const PAGE_TITLES: Record<Page, { title: string; subtitle?: string }> = {
  home: { title: 'DRAFT', subtitle: 'Centro Deportivo Norte' },
  delays: { title: 'ATRASOS EN VIVO', subtitle: 'Actualización automática' },
  tournaments: { title: 'TORNEOS', subtitle: 'Copa Draft · Julio 2025' },
  admin: { title: 'ADMINISTRACIÓN', subtitle: 'Panel de gestión' },
  profile: { title: 'PERFIL' },
  auth: { title: 'DRAFT' },
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('auth');
  const { user, loginAsRole, logout } = useAuth();
  const {
    matches,
    todayMatches,
    delayedMatches,
    liveMatches,
    lastUpdate,
    isLive,
    updateMatchDelay,
  } = useMatches();

  const handleLogout = () => { logout(); setCurrentPage('auth'); };
  const handleNavigate = (page: string) => setCurrentPage(page as Page);

  if (currentPage === 'auth') {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100dvh' }}>
        <AuthPage onSuccess={() => setCurrentPage('home')} />
      </div>
    );
  }

  const pageInfo = PAGE_TITLES[currentPage];

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100dvh', background: 'var(--bg)', position: 'relative' }}>
      <TopBar title={pageInfo.title} subtitle={pageInfo.subtitle} />
      <main>
        {currentPage === 'home' && user && (
          <HomePage
            user={user}
            matches={todayMatches}
            delayedMatches={delayedMatches}
            liveMatches={liveMatches}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'delays' && (
          <DelaysPage
            matches={todayMatches}
            allMatches={matches}
            lastUpdate={lastUpdate}
            isLive={isLive}
          />
        )}
        {currentPage === 'tournaments' && <TournamentsPage />}
        {currentPage === 'admin' && user?.role === 'admin' && (
          <AdminPage
            matches={todayMatches}
            allMatches={matches}
            onUpdateMatch={updateMatchDelay}
          />
        )}
        {currentPage === 'profile' && (
          <ProfilePage
            user={user}
            onLogout={handleLogout}
            onLogin={() => setCurrentPage('auth')}
          />
        )}
      </main>
      <NavBar currentPage={currentPage} onNavigate={handleNavigate} user={user} />
    </div>
  );
}
