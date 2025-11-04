import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { t } from '../../locales/id';
import './Navigation.css';

const Navigation = ({ activeTab, setActiveTab }) => {
  const { isAdmin } = useAuth();

  const tabs = [
    { id: 'pos', label: t('nav.pos'), icon: '💰' },
    { id: 'products', label: t('nav.products'), icon: '📦' },
    { id: 'customers', label: t('nav.customers'), icon: '👥' },
    { id: 'inventory', label: t('nav.inventory'), icon: '📊', adminOnly: true },
    { id: 'reports', label: t('nav.reports'), icon: '📈', adminOnly: true },
    { id: 'settings', label: t('nav.settings'), icon: '⚙️', adminOnly: true },
  ];

  return (
    <nav className="app-navigation">
      {tabs.map(tab => {
        if (tab.adminOnly && !isAdmin()) {
          return null;
        }
        
        return (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
