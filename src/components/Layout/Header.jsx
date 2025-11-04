import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../locales/id';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { isOnline, syncStatus } = useApp();

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="app-title">SomansaPOS</h1>
        <div className="status-badges">
          <span className={`status-badge ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? t('common.online') : t('common.offline')}
          </span>
          {syncStatus.queueCount > 0 && (
            <span className="status-badge queue">
              {syncStatus.queueCount} queued
            </span>
          )}
        </div>
      </div>
      
      <div className="header-right">
        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <span className="user-role">({user?.role})</span>
        </div>
        <button onClick={logout} className="btn-logout">
          {t('auth.logout')}
        </button>
      </div>
    </header>
  );
};

export default Header;
