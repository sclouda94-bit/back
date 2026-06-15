import React, { useState, useEffect } from 'react';
import { fetchSales } from '../api/apiClient';
import NewSaleModal from '../components/NewSaleModal';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    try {
      setLoading(true);
      const data = await fetchSales();
      setSales(data);
    } catch (err) {
      console.error(err);
      alert('Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  }

  const totalRevenue = sales.reduce((acc, sale) => acc + parseFloat(sale.totalAmount), 0);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando ventas...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Ventas</h1>
          <p className="page-subtitle">Gestión de transacciones y facturación</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>＋ Nueva Venta</button>
      </div>

      <div className="clients-summary">
        <div className="summary-chip">
          <span className="summary-chip-icon" style={{ background: '#6366f122', color: '#818cf8' }}>🧾</span>
          <div>
            <div className="summary-chip-value">{sales.length}</div>
            <div className="summary-chip-label">Total de Ventas</div>
          </div>
        </div>
        <div className="summary-chip">
          <span className="summary-chip-icon" style={{ background: '#10b98122', color: '#34d399' }}>💰</span>
          <div>
            <div className="summary-chip-value">${totalRevenue.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</div>
            <div className="summary-chip-label">Ingresos Totales</div>
          </div>
        </div>
      </div>

      {sales.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🧾</div>
          <div className="page-title" style={{ fontSize: 18 }}>Aún no hay ventas</div>
          <p className="text-muted" style={{ marginTop: 8 }}>Registra la primera venta para verla aquí.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Método de Pago</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <tr key={sale.id}>
                  <td style={{ fontWeight: 600 }}>#{sale.id}</td>
                  <td>{new Date(sale.createdAt).toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{sale.clientName}</td>
                  <td style={{ textTransform: 'capitalize' }}>
                    {sale.paymentMethod === 'cash' ? '💵 Efectivo' : sale.paymentMethod === 'card' ? '💳 Tarjeta' : '🏦 Transferencia'}
                  </td>
                  <td>
                    <span className={`badge ${sale.status === 'completed' ? 'badge-green' : 'badge-rose'}`}>
                      {sale.status === 'completed' ? 'Completado' : 'Pendiente'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--accent-green)' }}>
                    ${parseFloat(sale.totalAmount).toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showNewModal && (
        <NewSaleModal 
          onClose={() => setShowNewModal(false)} 
          onSave={() => {
            setShowNewModal(false);
            loadSales();
          }} 
        />
      )}
    </div>
  );
}
