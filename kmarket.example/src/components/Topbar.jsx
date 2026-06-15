import React, { useState } from 'react';
import { DEMO_USER } from '../data/mockData';

const pageLabels = {
  home: 'Dashboard',
  sales: 'Ventas',
  clients: 'Clientes',
  products: 'Productos',
  inventory: 'Inventario',
  reports: 'Reportes',
  settings: 'Configuración',
};

export default function Topbar({ activePage, collapsed }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className={`topbar ${collapsed ? 'collapsed' : ''}`}>
      <div className="topbar-left">
        <div className="topbar-breadcrumb">
          <span className="topbar-breadcrumb-home">KMarket</span>
          <span className="topbar-breadcrumb-sep">›</span>
          <span className="topbar-breadcrumb-current">{pageLabels[activePage] || activePage}</span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Date */}
        <div className="topbar-date">
          {new Date().toLocaleDateString('es-DO', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </div>

        {/* Notification */}
        <button className="btn-icon topbar-notif" title="Notificaciones">
          <span style={{ fontSize: 14 }}>🔔</span>
          <span className="notif-badge">3</span>
        </button>

        {/* User avatar dropdown */}
        <div className="topbar-user" onClick={() => setShowMenu(!showMenu)}>
          <div
            className="avatar avatar-sm"
            style={{ background: '#2d8a4e', color: '#fff', cursor: 'pointer' }}
          >
            {DEMO_USER.avatar}
          </div>
          <div className="topbar-user-info">
            <span className="topbar-user-name">{DEMO_USER.name.split(' ').slice(0, 2).join(' ')}</span>
            <span className="topbar-user-role">{DEMO_USER.role}</span>
          </div>
          <span style={{ fontSize: 10, color: '#9ca3af', marginLeft: 2 }}>▾</span>

          {showMenu && (
            <div className="topbar-dropdown">
              <div className="topbar-dropdown-item">Mi perfil</div>
              <div className="topbar-dropdown-item">Configuración</div>
              <div className="topbar-dropdown-divider" />
              <div className="topbar-dropdown-item topbar-dropdown-danger">Cerrar sesión</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
