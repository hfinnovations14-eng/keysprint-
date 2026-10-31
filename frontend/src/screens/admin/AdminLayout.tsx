import React from 'react';
import { 
  BarChart, 
  Users, 
  FileText, 
  Sliders, 
  Warehouse, 
  Trophy, 
  ShieldAlert, 
  TrendingUp, 
  Lock, 
  LogOut,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  currentAdminId: string;
  onNavigateAdmin: (screenId: string) => void;
  onExitAdmin: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentAdminId,
  onNavigateAdmin,
  onExitAdmin,
  children
}) => {
  const adminNav = [
    { id: 'admin-01', label: 'Overview', icon: <BarChart size={18} /> },
    { id: 'admin-02', label: 'User Management', icon: <Users size={18} /> },
    { id: 'admin-03', label: 'Passage CMS', icon: <FileText size={18} /> },
    { id: 'admin-04', label: 'Game Configuration', icon: <Sliders size={18} /> },
    { id: 'admin-05', label: 'Garage & Catalog', icon: <Warehouse size={18} /> },
    { id: 'admin-06', label: 'XP & Economy Rules', icon: <Trophy size={18} /> },
    { id: 'admin-07', label: 'Anti-Cheat Triage', icon: <ShieldAlert size={18} /> },
    { id: 'admin-08', label: 'Analytics & KPIs', icon: <TrendingUp size={18} /> },
    { id: 'admin-09', label: 'Staff & Audit Logs', icon: <Lock size={18} /> },
  ];

  return (
    <div className="admin-portal-wrapper">
      {/* Admin Header Bar */}
      <header className="admin-top-bar">
        <div className="admin-brand-left">
          <span className="admin-tag badge badge-orange">STAFF OPERATIONS</span>
          <span className="admin-title">KeySprint Admin Center</span>
          <span className="admin-role-pill">SuperAdmin • MFA Active</span>
        </div>

        <div className="admin-actions-right">
          <span className="admin-live-pulse">🟢 Gateway Operational (99.98% SLA)</span>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onExitAdmin}
          >
            <LogOut size={14} />
            <span>Exit to Player UI</span>
          </button>
        </div>
      </header>

      {/* Admin Split View */}
      <div className="admin-main-container">
        {/* Admin Navigation Sidebar */}
        <aside className="admin-sidebar card">
          <nav className="admin-nav-menu">
            {adminNav.map((item) => (
              <button
                key={item.id}
                className={`admin-nav-item ${currentAdminId === item.id ? 'active' : ''}`}
                onClick={() => onNavigateAdmin(item.id)}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                <span className="admin-nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Admin Content Pane */}
        <main className="admin-content-pane">
          {children}
        </main>
      </div>
    </div>
  );
};
