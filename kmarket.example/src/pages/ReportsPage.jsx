import React, { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../api/apiClient';

export default function ReportsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
        alert('Error al cargar métricas del dashboard');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !stats) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando reportes...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reportes y Analíticas</h1>
          <p className="page-subtitle">Resumen global del rendimiento del negocio</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="clients-summary" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="summary-chip" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <span className="summary-chip-icon" style={{ background: '#10b98122', color: '#34d399' }}>💰</span>
          <div>
            <div className="summary-chip-value">${stats.totalRevenue.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</div>
            <div className="summary-chip-label">Ingresos Totales</div>
          </div>
        </div>
        <div className="summary-chip" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <span className="summary-chip-icon" style={{ background: '#6366f122', color: '#818cf8' }}>🧾</span>
          <div>
            <div className="summary-chip-value">{stats.totalSalesCount}</div>
            <div className="summary-chip-label">Ventas Realizadas</div>
          </div>
        </div>
        <div className="summary-chip" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <span className="summary-chip-icon" style={{ background: '#f59e0b22', color: '#fbbf24' }}>👥</span>
          <div>
            <div className="summary-chip-value">{stats.totalClients}</div>
            <div className="summary-chip-label">Clientes Registrados</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        
        {/* Top Products */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>🏆 Top 5 Productos Más Vendidos</h3>
          {stats.topProducts.length === 0 ? (
            <p className="text-muted">Aún no hay suficientes datos de ventas.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {stats.topProducts.map((p, index) => {
                return (
                  <div 
                    key={p.productId} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: '12px 0', 
                      borderBottom: index === stats.topProducts.length - 1 ? 'none' : '1px solid var(--border-color)', 
                      fontSize: 14 
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{index + 1}. {p.name}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{p.quantitySold} unds. (${p.revenue.toLocaleString('es-DO', { minimumFractionDigits: 2 })})</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>⚠️ Alertas de Bajo Stock (≤ 5)</h3>
          {stats.lowStockProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <span style={{ fontSize: 32 }}>✅</span>
              <p style={{ color: 'var(--accent-green)', fontWeight: 500, marginTop: 8 }}>Inventario saludable</p>
            </div>
          ) : (
            <div className="table-container" style={{ margin: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th style={{ textAlign: 'right' }}>Stock Actual</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lowStockProducts.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 500 }}>{p.name}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`badge ${p.stock === 0 ? 'badge-rose' : 'badge-orange'}`}>
                          {p.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Sales */}
        <div className="card" style={{ padding: 24, gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>🕒 Ventas Recientes</h3>
          {stats.recentSales.length === 0 ? (
            <p className="text-muted">Aún no hay ventas registradas.</p>
          ) : (
            <div className="table-container" style={{ margin: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Método</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentSales.map(sale => (
                    <tr key={sale.id}>
                      <td>{new Date(sale.createdAt).toLocaleDateString('es-DO', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      <td style={{ fontWeight: 500 }}>{sale.clientName}</td>
                      <td style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{sale.paymentMethod}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--accent-green)' }}>
                        ${parseFloat(sale.totalAmount).toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
