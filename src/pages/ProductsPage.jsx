import React, { useState, useEffect, useMemo } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api/apiClient';

function ProductModal({ product, onClose, onSave }) {
  const isEdit = !!product?.id;
  const [form, setForm] = useState(
    product || {
      name: '', price: 0, cost: 0, stock: 0, category: 'General'
    }
  );

  function set(key, val) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      ...form,
      price: parseFloat(form.price),
      cost: parseFloat(form.cost),
      stock: parseInt(form.stock, 10),
    });
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h2>
          <button type="button" className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nombre del producto *</label>
              <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <input className="form-input" value={form.category} onChange={e => set('category', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input className="form-input" type="number" value={form.stock} onChange={e => set('stock', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Precio ($) *</label>
                <input className="form-input" type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Costo ($)</label>
                <input className="form-input" type="number" step="0.01" value={form.cost} onChange={e => set('cost', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{isEdit ? '💾 Guardar' : '✅ Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductDetail({ product, onClose, onEdit }) {
  if (!product) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <h2 className="modal-title">Detalle de Producto</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="client-detail-header" style={{ padding: '24px' }}>
          <div className="avatar avatar-lg" style={{ background: '#3b82f6', color: '#fff', fontSize: 22 }}>📦</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{product.name}</div>
            <span className="badge badge-indigo">Categoría: {product.category || 'N/A'}</span>
          </div>
        </div>
        <div className="client-stats-grid" style={{ padding: '0 24px' }}>
          <div className="client-stat">
            <div className="client-stat-value">${parseFloat(product.price).toFixed(2)}</div>
            <div className="client-stat-label">Precio</div>
          </div>
          <div className="client-stat">
            <div className="client-stat-value">${parseFloat(product.cost || 0).toFixed(2)}</div>
            <div className="client-stat-label">Costo</div>
          </div>
          <div className="client-stat">
            <div className="client-stat-value">{product.stock}</div>
            <div className="client-stat-label">Stock</div>
          </div>
        </div>
        <div className="modal-footer" style={{ marginTop: '24px' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          <button className="btn btn-primary" onClick={() => onEdit(product)}>✏️ Editar</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDelete({ product, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h2 className="modal-title">🗑️ Eliminar Producto</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <p style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>
          ¿Estás seguro de que deseas eliminar <strong>{product?.name}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm}>🗑️ Eliminar</button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
    return list;
  }, [products, search, categoryFilter]);

  function openDetail(p) { setSelected(p); setModal('detail'); }
  function openEdit(p)   { setSelected(p); setModal('edit'); }
  function openDelete(p) { setSelected(p); setModal('delete'); }
  function closeModal()  { setModal(null); setSelected(null); }

  async function handleSave(data) {
    try {
      if (data.id) {
        await updateProduct(data.id, data);
      } else {
        await createProduct(data);
      }
      await loadProducts();
      closeModal();
    } catch (err) {
      console.error(err);
      alert('Error al guardar el producto');
    }
  }

  async function handleDelete() {
    try {
      if (selected?.id) {
        await deleteProduct(selected.id);
        await loadProducts();
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el producto');
    }
  }

  const outOfStock = products.filter(p => p.stock <= 0).length;
  const totalStockValue = products.reduce((acc, p) => acc + (parseFloat(p.cost || p.price) * p.stock), 0);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando productos...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Productos</h1>
          <p className="page-subtitle">{products.length} productos en catálogo</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}>＋ Nuevo Producto</button>
      </div>

      <div className="clients-summary">
        <div className="summary-chip">
          <span className="summary-chip-icon" style={{ background: '#6366f122', color: '#818cf8' }}>📦</span>
          <div>
            <div className="summary-chip-value">{products.length}</div>
            <div className="summary-chip-label">Total en Catálogo</div>
          </div>
        </div>
        <div className="summary-chip">
          <span className="summary-chip-icon" style={{ background: '#f43f5e22', color: '#fb7185' }}>⚠️</span>
          <div>
            <div className="summary-chip-value">{outOfStock}</div>
            <div className="summary-chip-label">Sin Stock</div>
          </div>
        </div>
        <div className="summary-chip">
          <span className="summary-chip-icon" style={{ background: '#10b98122', color: '#34d399' }}>💰</span>
          <div>
            <div className="summary-chip-value">${totalStockValue.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</div>
            <div className="summary-chip-label">Valor del Inventario</div>
          </div>
        </div>
      </div>

      <div className="clients-toolbar">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="toolbar-filters">
          <select className="form-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            {categories.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'Todas las categorías' : c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="results-count">
        {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} {search && ` para "${search}"`}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div className="page-title" style={{ fontSize: 18 }}>Sin resultados</div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Costo</th>
                <th>Stock</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} onClick={() => openDetail(p)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td><span className="badge badge-indigo">{p.category || 'N/A'}</span></td>
                  <td style={{ fontWeight: 600, color: 'var(--accent-green)' }}>${parseFloat(p.price).toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
                  <td className="text-muted">${parseFloat(p.cost || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span className={`badge ${p.stock > 0 ? 'badge-green' : 'badge-rose'}`}>{p.stock}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
                      <button className="btn-icon" onClick={() => openEdit(p)}>✏️</button>
                      <button className="btn-icon" style={{ color: 'var(--accent-rose)' }} onClick={() => openDelete(p)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(modal === 'add' || modal === 'edit') && <ProductModal product={modal === 'edit' ? selected : null} onClose={closeModal} onSave={handleSave} />}
      {modal === 'detail' && <ProductDetail product={selected} onClose={closeModal} onEdit={p => { setSelected(p); setModal('edit'); }} />}
      {modal === 'delete' && <ConfirmDelete product={selected} onClose={closeModal} onConfirm={handleDelete} />}
    </div>
  );
}
