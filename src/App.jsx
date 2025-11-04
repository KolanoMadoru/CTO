import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { initDB } from './utils/indexedDB';
import { seedData } from './utils/seedData';
import Login from './components/Auth/Login';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import POSScreen from './components/POS/POSScreen';
import ProductList from './components/Products/ProductList';
import CustomerList from './components/Customers/CustomerList';
import Inventory from './components/Inventory/Inventory';
import Reports from './components/Reports/Reports';
import Settings from './components/Settings/Settings';
import './App.css';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('pos');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await initDB();
    await seedData();
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="app-main">
        {activeTab === 'pos' && <POSScreen />}
        {activeTab === 'products' && <ProductList />}
        {activeTab === 'customers' && <CustomerList />}
        {activeTab === 'inventory' && <Inventory />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
