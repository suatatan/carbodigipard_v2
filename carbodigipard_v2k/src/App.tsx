import { Routes, Route, useLocation } from 'react-router'
import { useEffect } from 'react'
import Home from './pages/Home'
import NewsDetail from './pages/NewsDetail'
import Training from './pages/Training'
import Admin from './pages/Admin'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      <ScrollToTop />
      {!isAdminPage && !isLoginPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/training" element={<Training />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminPage && !isLoginPage && <Footer />}
    </div>
  )
}
