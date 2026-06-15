import React, { useState, useEffect } from 'react';
import { fetchInventoryMovements } from '../api/apiClient';
import AdjustStockModal from '../components/AdjustStockModal';

export default function InventoryPage() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  useEffect(() => {
    loadMovements();
  }, []);

  async function loadMovements() {
    try {
      setLoading(true);
      const data = await fetchInventoryMovements();
      setMovements(data);
    } catch (err) {
      console.error(err);
      alert('Error al cargar historial de inventario');
    } finally {
      setLoading(false);
    }
  }

  const entriesCount = movements.filter(m => m.type === 'IN').length;
  const exitsCount = movements.filter(m => m.type === 'OUT').length;

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando inventario...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventario</h1>
          <p className="page-subtitle">Registro de entradas y salidas de stock</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdjustModal(true)}>＋ Ajustar Stock</button>
      </div>

      <div className="clients-summary">
        <div className="summary-chip">
          <span className="summary-chip-icon" style={{ background: '#6366f122', color: '#818cf8' }}>📦</span>
          <div>
            <div className="summary-chip-value">{movements.length}</div>
            <div className="summary-chip-label">Total Movimientos</div>
          </div>
        </div>
        <div className="summary-chip">
          <span className="summary-chip-icon" style={{ background: '#10b98122', color: '#34d399' }}>⬇️</span>
          <div>
            <div className="summary-chip-value">{entriesCount}</div>
            <div className="summary-chip-label">Entradas Registradas</div>
          </div>
        </div>
        <div className="summary-chip">
          <span className="summary-chip-icon" style={{ background: '#f43f5e22', color: '#fb7185' }}>⬆️</span>
          <div>
            <div className="summary-chip-value">{exitsCount}</div>
            <div className="summary-chip-label">Salidas Registradas</div>
          </div>
        </div>
      </div>

      {movements.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div className="page-title" style={{ fontSize: 18 }}>Sin Movimientos</div>
          <p className="text-muted" style={{ marginTop: 8 }}>Aún no hay registros de ajustes de stock.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Tipo</th>
                <th style={{ textAlign: 'center' }}>Cantidad</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              {movements.map(mov => (
                <tr key={mov.id}>
                  <td style={{ fontWeight: 600 }}>#{mov.id}</td>
                  <td>{new Date(mov.createdAt).toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{mov.productName}</td>
                  <td>
                    <span className={`badge ${mov.type === 'IN' ? 'badge-green' : 'badge-rose'}`}>
                      {mov.type === 'IN' ? 'Entrada (IN)' : 'Salida (OUT)'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: mov.type === 'IN' ? 'var(--accent-green)' : 'var(--accent-rose)' }}>
                    {mov.type === 'IN' ? '+' : '-'}{mov.quantity}
                  </td>
                  <td className="text-muted">{mov.reason || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdjustModal && (
        <AdjustStockModal 
          onClose={() => setShowAdjustModal(false)} 
          onSave={() => {
            setShowAdjustModal(false);
            loadMovements();
          }} 
        />
      )}
    </div>
  );
}
