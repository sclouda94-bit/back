import React from 'react';

export default function PlaceholderPage({ title, icon, description }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 64, lineHeight: 1 }}>{icon}</div>
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle" style={{ maxWidth: 360 }}>{description}</p>
      <div className="badge badge-indigo" style={{ padding: '6px 16px', fontSize: 13 }}>Próximamente</div>
    </div>
  );
}
