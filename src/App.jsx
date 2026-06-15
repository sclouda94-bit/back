import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardHome from './pages/DashboardHome';
import ClientsPage from './pages/ClientsPage';
import PlaceholderPage from './pages/PlaceholderPage';
import ProductsPage from './pages/ProductsPage';
import SalesPage from './pages/SalesPage';
import InventoryPage from './pages/InventoryPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Initialize dark mode if previously set
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
    }
  }, []);

  function renderPage() {
    switch (activePage) {
      case 'home':      return <DashboardHome />;
      case 'clients':   return <ClientsPage />;
      case 'sales':     return <SalesPage />;
      case 'products':  return <ProductsPage />;
      case 'inventory': return <InventoryPage />;
      case 'reports':   return <ReportsPage />;
      case 'settings':  return <SettingsPage />;
      default:          return <DashboardHome />;
    }
  }

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        <Topbar activePage={activePage} collapsed={collapsed} />
        <main className="page-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
