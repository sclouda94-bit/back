// ============================================
// KMARKET — Mock Data (datos de demostración)
// ============================================

export const DEMO_USER = {
  email: 'admin@kmarket.com',
  password: '123456',
  name: 'Carlos Administrador',
  role: 'Administrador',
  avatar: 'CA',
  business: 'KMarket',
};

export const initialClients = [
  { id: 1, name: 'María López', email: 'maria.lopez@gmail.com', phone: '+1 (809) 555-0123', address: 'Calle Principal 45, Santo Domingo', totalPurchases: 12, totalSpent: 4850.00, lastVisit: '2026-06-10', status: 'active', notes: 'Cliente frecuente, prefiere pago en efectivo', joinDate: '2025-01-15', avatar: 'ML', avatarColor: '#6366f1' },
  { id: 2, name: 'Juan Martínez', email: 'jmartinez@outlook.com', phone: '+1 (809) 555-0456', address: 'Av. Winston Churchill 120, Santiago', totalPurchases: 8, totalSpent: 2100.50, lastVisit: '2026-06-08', status: 'active', notes: '', joinDate: '2025-03-22', avatar: 'JM', avatarColor: '#10b981' },
  { id: 3, name: 'Ana Rodríguez', email: 'ana.rod@hotmail.com', phone: '+1 (829) 555-0789', address: 'Residencial Las Palmas, #12', totalPurchases: 25, totalSpent: 9320.75, lastVisit: '2026-06-11', status: 'active', notes: 'Cliente VIP, siempre compra en cantidad', joinDate: '2024-11-05', avatar: 'AR', avatarColor: '#f59e0b' },
  { id: 4, name: 'Pedro García', email: 'pedro.garcia@gmail.com', phone: '+1 (849) 555-0321', address: 'Sector La Esperilla, Apt 3B', totalPurchases: 3, totalSpent: 450.00, lastVisit: '2026-04-15', status: 'inactive', notes: 'No ha comprado en más de 60 días', joinDate: '2025-09-10', avatar: 'PG', avatarColor: '#f43f5e' },
  { id: 5, name: 'Sofia Reyes', email: 'sofia.reyes@yahoo.com', phone: '+1 (809) 555-0654', address: 'Los Prados, Calle 5 #78', totalPurchases: 17, totalSpent: 6750.25, lastVisit: '2026-06-09', status: 'active', notes: 'Paga con tarjeta', joinDate: '2025-02-28', avatar: 'SR', avatarColor: '#06b6d4' },
  { id: 6, name: 'Luis Hernández', email: 'lhernandez@empresa.com', phone: '+1 (829) 555-0987', address: 'Zona Franca Industrial, Oficina 201', totalPurchases: 42, totalSpent: 18900.00, lastVisit: '2026-06-12', status: 'active', notes: 'Compra para empresa, requiere factura', joinDate: '2024-08-01', avatar: 'LH', avatarColor: '#a855f7' },
  { id: 7, name: 'Carmen Díaz', email: 'carmen.diaz@gmail.com', phone: '+1 (849) 555-0147', address: 'Bella Vista, Ave. Sarasota #55', totalPurchases: 6, totalSpent: 1230.00, lastVisit: '2026-05-20', status: 'active', notes: '', joinDate: '2025-06-15', avatar: 'CD', avatarColor: '#ec4899' },
  { id: 8, name: 'Roberto Silva', email: 'rsilva@correo.com', phone: '+1 (809) 555-0258', address: 'Naco, Calle Nevada 34', totalPurchases: 2, totalSpent: 315.00, lastVisit: '2026-03-01', status: 'inactive', notes: 'Cliente nuevo, segunda compra pendiente', joinDate: '2026-02-10', avatar: 'RS', avatarColor: '#64748b' },
];

export const initialProducts = [
  { id: 1, name: 'Arroz Premium 5lb', sku: 'PROD-001', category: 'Granos', price: 8.50, cost: 5.20, stock: 145, minStock: 20, unit: 'bolsa', status: 'active' },
  { id: 2, name: 'Aceite Vegetal 1L', sku: 'PROD-002', category: 'Aceites', price: 4.75, cost: 2.80, stock: 80, minStock: 15, unit: 'botella', status: 'active' },
  { id: 3, name: 'Azúcar Blanca 2kg', sku: 'PROD-003', category: 'Azúcares', price: 3.20, cost: 1.90, stock: 12, minStock: 20, unit: 'paquete', status: 'active' },
  { id: 4, name: 'Café Molido 250g', sku: 'PROD-004', category: 'Bebidas', price: 6.50, cost: 3.80, stock: 55, minStock: 10, unit: 'paquete', status: 'active' },
  { id: 5, name: 'Leche Entera 1L', sku: 'PROD-005', category: 'Lácteos', price: 2.10, cost: 1.30, stock: 8, minStock: 30, unit: 'litro', status: 'active' },
  { id: 6, name: 'Jabón de Baño x3', sku: 'PROD-006', category: 'Higiene', price: 3.80, cost: 2.10, stock: 90, minStock: 15, unit: 'pack', status: 'active' },
  { id: 7, name: 'Detergente 1kg', sku: 'PROD-007', category: 'Limpieza', price: 5.25, cost: 3.10, stock: 0, minStock: 10, unit: 'bolsa', status: 'inactive' },
  { id: 8, name: 'Pasta 500g', sku: 'PROD-008', category: 'Granos', price: 1.85, cost: 0.95, stock: 200, minStock: 30, unit: 'paquete', status: 'active' },
  { id: 9, name: 'Salsa de Tomate 400g', sku: 'PROD-009', category: 'Condimentos', price: 2.40, cost: 1.40, stock: 65, minStock: 12, unit: 'lata', status: 'active' },
  { id: 10, name: 'Shampoo 400ml', sku: 'PROD-010', category: 'Higiene', price: 7.90, cost: 4.50, stock: 30, minStock: 8, unit: 'frasco', status: 'active' },
];

export const initialSales = [
  { id: 'VTA-2026-001', clientId: 6, clientName: 'Luis Hernández', date: '2026-06-12', items: [{ productId: 1, name: 'Arroz Premium 5lb', qty: 10, price: 8.50 }, { productId: 2, name: 'Aceite Vegetal 1L', qty: 6, price: 4.75 }], subtotal: 113.50, tax: 6.81, total: 120.31, paymentMethod: 'card', status: 'completed' },
  { id: 'VTA-2026-002', clientId: 3, clientName: 'Ana Rodríguez', date: '2026-06-11', items: [{ productId: 4, name: 'Café Molido 250g', qty: 3, price: 6.50 }, { productId: 6, name: 'Jabón de Baño x3', qty: 2, price: 3.80 }], subtotal: 27.10, tax: 1.63, total: 28.73, paymentMethod: 'cash', status: 'completed' },
  { id: 'VTA-2026-003', clientId: 1, clientName: 'María López', date: '2026-06-10', items: [{ productId: 8, name: 'Pasta 500g', qty: 4, price: 1.85 }, { productId: 9, name: 'Salsa de Tomate 400g', qty: 4, price: 2.40 }], subtotal: 17.00, tax: 1.02, total: 18.02, paymentMethod: 'cash', status: 'completed' },
  { id: 'VTA-2026-004', clientId: 5, clientName: 'Sofia Reyes', date: '2026-06-09', items: [{ productId: 10, name: 'Shampoo 400ml', qty: 2, price: 7.90 }, { productId: 6, name: 'Jabón de Baño x3', qty: 1, price: 3.80 }], subtotal: 19.60, tax: 1.18, total: 20.78, paymentMethod: 'card', status: 'completed' },
  { id: 'VTA-2026-005', clientId: 2, clientName: 'Juan Martínez', date: '2026-06-08', items: [{ productId: 1, name: 'Arroz Premium 5lb', qty: 2, price: 8.50 }, { productId: 3, name: 'Azúcar Blanca 2kg', qty: 1, price: 3.20 }], subtotal: 20.20, tax: 1.21, total: 21.41, paymentMethod: 'cash', status: 'completed' },
  { id: 'VTA-2026-006', clientId: 7, clientName: 'Carmen Díaz', date: '2026-06-07', items: [{ productId: 5, name: 'Leche Entera 1L', qty: 6, price: 2.10 }, { productId: 4, name: 'Café Molido 250g', qty: 1, price: 6.50 }], subtotal: 19.10, tax: 1.15, total: 20.25, paymentMethod: 'transfer', status: 'completed' },
  { id: 'VTA-2026-007', clientId: 6, clientName: 'Luis Hernández', date: '2026-06-06', items: [{ productId: 2, name: 'Aceite Vegetal 1L', qty: 12, price: 4.75 }], subtotal: 57.00, tax: 3.42, total: 60.42, paymentMethod: 'card', status: 'completed' },
  { id: 'VTA-2026-008', clientId: 3, clientName: 'Ana Rodríguez', date: '2026-06-05', items: [{ productId: 1, name: 'Arroz Premium 5lb', qty: 5, price: 8.50 }, { productId: 8, name: 'Pasta 500g', qty: 8, price: 1.85 }], subtotal: 57.30, tax: 3.44, total: 60.74, paymentMethod: 'cash', status: 'completed' },
];

export const weeklyStats = [
  { day: 'Lun', sales: 18 },
  { day: 'Mar', sales: 25 },
  { day: 'Mié', sales: 21 },
  { day: 'Jue', sales: 30 },
  { day: 'Vie', sales: 42 },
  { day: 'Sáb', sales: 38 },
  { day: 'Dom', sales: 15 },
];

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'transfer', label: 'Transferencia' },
];

export const CLIENT_STATUSES = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
];

export const PRODUCT_CATEGORIES = [
  'Granos', 'Aceites', 'Azúcares', 'Bebidas', 'Lácteos',
  'Higiene', 'Limpieza', 'Condimentos', 'Otros',
];
