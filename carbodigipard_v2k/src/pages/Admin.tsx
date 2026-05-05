import { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useLanguage } from '@/hooks/useLanguage';
import {
  LayoutDashboard,
  Newspaper,
  Tags,
  Image,
  BookOpen,
  LogOut,
  Leaf,
  ChevronRight,
} from 'lucide-react';
import AdminDashboard from '@/components/AdminDashboard';
import AdminNews from '@/components/AdminNews';
import AdminNewsForm from '@/components/AdminNewsForm';
import AdminCategories from '@/components/AdminCategories';
import AdminPartners from '@/components/AdminPartners';
import AdminTraining from '@/components/AdminTraining';

interface NavItem {
  path: string;
  icon: React.ComponentType<{ size?: number }>;
  labelTr: string;
  labelEn: string;
  end?: boolean;
}

const navItems: NavItem[] = [
  { path: '/admin', icon: LayoutDashboard, labelTr: 'Dashboard', labelEn: 'Dashboard', end: true },
  { path: '/admin/news', icon: Newspaper, labelTr: 'Haberler', labelEn: 'News' },
  { path: '/admin/categories', icon: Tags, labelTr: 'Kategoriler', labelEn: 'Categories' },
  { path: '/admin/partners', icon: Image, labelTr: 'Ortak Logolar', labelEn: 'Partner Logos' },
  { path: '/admin/training', icon: BookOpen, labelTr: 'Eğitim Materyalleri', labelEn: 'Training Materials' },
];

export default function Admin() {
  const { user, isAuthenticated, isLoading, logout } = useAdminAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 border-2 border-[#4ADE80] border-t-transparent rounded-full animate-spin" />
          <span style={{ color: 'var(--color-text-secondary)' }}>{t('Yükleniyor...', 'Loading...')}</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 bottom-0 w-60 flex flex-col overflow-y-auto z-40 hidden md:flex"
        style={{ background: 'var(--color-bg-secondary)', borderRight: '1px solid var(--color-border)' }}
      >
        {/* Logo */}
        <div className="p-5 flex items-center gap-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <Leaf size={20} style={{ color: 'var(--color-accent)' }} />
          <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}>
            CARBODIGIPARD
          </span>
          <span className="eu-badge text-[9px] ml-auto py-0.5 px-1.5">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.end
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
                  isActive ? 'text-[#4ADE80]' : ''
                }`}
                style={{
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  background: isActive ? 'rgba(74,222,128,0.08)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--color-accent)' : '3px solid transparent',
                }}
              >
                <item.icon size={18} />
                {t(item.labelTr, item.labelEn)}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--color-accent)', color: '#0A1410' }}
            >
              {(user?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                {user?.name || 'Admin'}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                {user?.role || 'admin'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-[rgba(239,68,68,0.1)]"
            style={{ color: '#ef4444' }}
          >
            <LogOut size={16} />
            {t('Çıkış', 'Logout')}
          </button>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <MobileSidebar navItems={navItems} user={user} logout={logout} />

      {/* Content */}
      <main className="flex-1 md:ml-60">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/news" element={<AdminNews />} />
          <Route path="/news/new" element={<AdminNewsForm />} />
          <Route path="/news/edit/:id" element={<AdminNewsForm />} />
          <Route path="/categories" element={<AdminCategories />} />
          <Route path="/partners" element={<AdminPartners />} />
          <Route path="/training" element={<AdminTraining />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function MobileSidebar({
  navItems: items,
  user,
  logout,
}: {
  navItems: NavItem[];
  user?: { name: string; role: string } | null;
  logout: () => void;
}) {
  void user; // acknowledged
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
      >
        <ChevronRight size={20} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{ background: 'var(--color-bg-secondary)' }}
        >
          <div className="p-5 pt-16 flex flex-col gap-1">
            {items.map((item) => {
              const isActive = item.end
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium no-underline ${
                    isActive ? 'text-[#4ADE80]' : ''
                  }`}
                  style={{
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    background: isActive ? 'rgba(74,222,128,0.08)' : 'transparent',
                  }}
                >
                  <item.icon size={20} />
                  {t(item.labelTr, item.labelEn)}
                </Link>
              );
            })}
            <button
              onClick={() => { setOpen(false); logout(); }}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium mt-4"
              style={{ color: '#ef4444' }}
            >
              <LogOut size={20} />
              {t('Çıkış', 'Logout')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}