import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/dashboards/Dashboard';
import Projects from './pages/dashboards/Projects';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import BuilderDashboard from './pages/dashboards/BuilderDashboard';
import CivilEngineerDashboard from './pages/dashboards/CivilEngineerDashboard';
import ProjectSiteDashboard from './pages/dashboards/ProjectSiteDashboard';
import ClientDashboard from './pages/dashboards/ClientDashboard';
import Login from './pages/Login';
import Chatbot from './components/Chatbot';
import GlobalReports from './pages/dashboards/GlobalReports';
import BillingAndPlans from './pages/dashboards/BillingAndPlans';
import Settings from './pages/dashboards/Settings';
import LeadsAnalytics from './pages/dashboards/LeadsAnalytics';
import SiteVisits from './pages/dashboards/SiteVisits';
import ManageAttendance from './pages/dashboards/ManageAttendance';
import ManageSchedule from './pages/dashboards/ManageSchedule';
import { authService } from './services/api';
import socketService from './services/socket';
import './App.css';

function DashboardApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState(authService.getCurrentUser());
  const [theme, setTheme] = useState(localStorage.getItem('aiauto_theme') || 'glass');

  useEffect(() => {
    // Simple entrance delay for glassmorphic effect
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  useEffect(() => {
    if (user) {
      socketService.connect();
    } else {
      socketService.disconnect();
    }
  }, [user]);

  useEffect(() => {
    document.body.className = `${theme}-mode`;
    localStorage.setItem('aiauto_theme', theme);
  }, [theme]);

  const handleLogout = () => {
    console.log("[AUTH] Logging out user...");
    authService.logout();
    setUser(null);
    // Force a reload to clear any residual state/cache
    window.location.href = '/';
  };

  const renderPage = () => {
    if (currentPage === 'settings') return <Settings theme={theme} setTheme={setTheme} />;
    if (currentPage === 'reports') return <GlobalReports setCurrentPage={setCurrentPage} />;
    if (currentPage === 'billing') return <BillingAndPlans setCurrentPage={setCurrentPage} />;
    if (currentPage === 'leads') return <LeadsAnalytics />;
    if (currentPage === 'visits') return <SiteVisits />;
    if (currentPage === 'projects') return <Projects />;
    if (currentPage === 'manage-attendance') return <ManageAttendance setCurrentPage={setCurrentPage} />;
    if (currentPage === 'manage-schedule') return <ManageSchedule setCurrentPage={setCurrentPage} />;

    // Default to role-based dashboard if current page is 'dashboard' or unknown
    switch (user?.role?.toLowerCase()) {
      case 'admin': return <AdminDashboard setCurrentPage={setCurrentPage} />;
      case 'builder': return <BuilderDashboard />;
      case 'civil_engineer': return <CivilEngineerDashboard />;
      case 'project_site': return <ProjectSiteDashboard setCurrentPage={setCurrentPage} />;
      case 'client': return <ClientDashboard />;
      default: return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };


  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className={`app-container ${isLoaded ? 'loaded' : ''}`} style={{ display: 'flex', minHeight: '100vh', opacity: isLoaded ? 1 : 0, transition: 'opacity 0.8s ease' }}>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} />

      <main style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header user={user} onLogout={handleLogout} />
        <div className="content-area" style={{ flex: 1 }}>
          {renderPage()}
        </div>
      </main>

      {/* Decorative Background Shapes */}
      <div className="bg-decoration" style={{
        position: 'fixed', zIndex: -1, top: '20%', left: '80%',
        width: '100px', height: '100px',
        background: 'linear-gradient(135deg, var(--pivot-blue-light), transparent)',
        clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
        filter: 'blur(20px)', opacity: 0.2
      }}></div>
      <Chatbot user={user} />
    </div>
  );
}

export default DashboardApp;
