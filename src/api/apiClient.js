export const API_URL = "http://localhost:3000/api";

export const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
};

export const createProduct = async (product) => {
    const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Failed to create product");
    return res.json();
};

export const updateProduct = async (id, product) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
};

export const deleteProduct = async (id) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete product");
    return res.json();
};

export const fetchClients = async () => {
    const res = await fetch(`${API_URL}/clients`);
    if (!res.ok) throw new Error("Failed to fetch clients");
    return res.json();
};

export const createClient = async (client) => {
    const res = await fetch(`${API_URL}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
    });
    if (!res.ok) throw new Error("Failed to create client");
    return res.json();
};

export const updateClient = async (id, client) => {
    const res = await fetch(`${API_URL}/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
    });
    if (!res.ok) throw new Error("Failed to update client");
    return res.json();
};

export const deleteClient = async (id) => {
    const res = await fetch(`${API_URL}/clients/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete client");
    return res.json();
};

// --- Sales API ---

export const fetchSales = async () => {
    const res = await fetch(`${API_URL}/sales`);
    if (!res.ok) throw new Error("Failed to fetch sales");
    return res.json();
};

export const createSale = async (saleData) => {
    const res = await fetch(`${API_URL}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
    });
    if (!res.ok) throw new Error("Failed to create sale");
    return res.json();
};

// --- Inventory API ---

export const fetchInventoryMovements = async () => {
    const res = await fetch(`${API_URL}/inventory/movements`);
    if (!res.ok) throw new Error("Failed to fetch inventory movements");
    return res.json();
};

export const createInventoryMovement = async (movementData) => {
    const res = await fetch(`${API_URL}/inventory/movements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movementData),
    });
    if (!res.ok) throw new Error("Failed to create inventory movement");
    return res.json();
};

// --- Reports API ---

export const fetchDashboardStats = async () => {
    const res = await fetch(`${API_URL}/reports/dashboard`);
    if (!res.ok) throw new Error("Failed to fetch dashboard stats");
    return res.json();
};

// --- Settings API ---

export const fetchSettings = async () => {
    const res = await fetch(`${API_URL}/settings`);
    if (!res.ok) throw new Error("Failed to fetch settings");
    return res.json();
};

export const updateSettings = async (settings) => {
    const res = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error("Failed to update settings");
    return res.json();
};
