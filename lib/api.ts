const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

// Token management
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

const clearToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiRequest<{ success: boolean; data: { token: string; user: any } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data.token) {
      setToken(response.data.token);
    }
    
    return response;
  },

  getMe: async () => {
    return apiRequest<{ success: boolean; data: any }>('/auth/me');
  },

  logout: () => {
    clearToken();
  },
};

// Dashboard API
export const dashboardApi = {
  getSummary: async (periode?: string) => {
    const params = new URLSearchParams();
    if (periode) params.append('periode', periode);
    return apiRequest<{ success: boolean; data: any }>(`/dashboard/summary?${params}`);
  },

  getSalesTrend: async (periode?: string) => {
    const params = new URLSearchParams();
    if (periode) params.append('periode', periode);
    return apiRequest<{ success: boolean; data: any }>(`/dashboard/tren-penjualan?${params}`);
  },

  getStockWarnings: async () => {
    return apiRequest<{ success: boolean; data: any }>('/dashboard/peringatan-stok');
  },

  getRecentActivity: async (limit?: number) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    return apiRequest<{ success: boolean; data: any }>(`/dashboard/aktivitas-terbaru?${params}`);
  },
};

// Products API
export const productsApi = {
  getAll: async (search?: string, is_active?: boolean) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (is_active !== undefined) params.append('is_active', is_active.toString());
    return apiRequest<{ success: boolean; data: any }>(`/products?${params}`);
  },

  getById: async (id: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/products/${id}`);
  },

  create: async (data: any) => {
    return apiRequest<{ success: boolean; data: any }>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any) => {
    return apiRequest<{ success: boolean; data: any }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Customers API
export const customersApi = {
  getAll: async (search?: string, status?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    return apiRequest<{ success: boolean; data: any }>(`/customers?${params}`);
  },

  getById: async (id: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/customers/${id}`);
  },

  create: async (data: any) => {
    return apiRequest<{ success: boolean; data: any }>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any) => {
    return apiRequest<{ success: boolean; data: any }>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/customers/${id}`, {
      method: 'DELETE',
    });
  },
};

// Suppliers API
export const suppliersApi = {
  getAll: async (search?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    return apiRequest<{ success: boolean; data: any }>(`/suppliers?${params}`);
  },

  getById: async (id: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/suppliers/${id}`);
  },

  create: async (data: any) => {
    return apiRequest<{ success: boolean; data: any }>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any) => {
    return apiRequest<{ success: boolean; data: any }>(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/suppliers/${id}`, {
      method: 'DELETE',
    });
  },
};

// Transactions API (Entri Transaksi - generic, terikat ke JenisTransaksi)
export const transactionsApi = {
  getAll: async (filters?: { business_unit?: string; jenis_transaksi_id?: number; tanggal_mulai?: string; tanggal_selesai?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.business_unit) params.append('business_unit', filters.business_unit);
    if (filters?.jenis_transaksi_id) params.append('jenis_transaksi_id', filters.jenis_transaksi_id.toString());
    if (filters?.tanggal_mulai) params.append('tanggal_mulai', filters.tanggal_mulai);
    if (filters?.tanggal_selesai) params.append('tanggal_selesai', filters.tanggal_selesai);
    if (filters?.search) params.append('search', filters.search);
    return apiRequest<{ success: boolean; data: any }>(`/transactions?${params}`);
  },

  getById: async (id: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/transactions/${id}`);
  },

  // Endpoint generic utama - dipakai form "Tambah Transaksi".
  // data: { tanggal, jenis_transaksi_id, detail (keterangan), nominal,
  //   debit?, kredit? (teks bebas, opsional), custom_data: {kolomId: value} }
  create: async (data: any) => {
    return apiRequest<{ success: boolean; data: any }>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },
};

// Stock API
export const stockApi = {
  getAll: async () => {
    return apiRequest<{ success: boolean; data: any }>('/stock');
  },

  getMovements: async (productId: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/stock/${productId}/movements`);
  },

  createMovement: async (data: any) => {
    return apiRequest<{ success: boolean; data: any }>('/stock/movements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Orders API
export const ordersApi = {
  getAll: async (filters?: { business_unit?: string; jenis_order?: string; customer_id?: number; tanggal_mulai?: string; tanggal_selesai?: string }) => {
    const params = new URLSearchParams();
    if (filters?.business_unit) params.append('business_unit', filters.business_unit);
    if (filters?.jenis_order) params.append('jenis_order', filters.jenis_order);
    if (filters?.customer_id) params.append('customer_id', filters.customer_id.toString());
    if (filters?.tanggal_mulai) params.append('tanggal_mulai', filters.tanggal_mulai);
    if (filters?.tanggal_selesai) params.append('tanggal_selesai', filters.tanggal_selesai);
    return apiRequest<{ success: boolean; data: any }>(`/orders?${params}`);
  },

  getById: async (id: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/orders/${id}`);
  },

  create: async (data: any) => {
    return apiRequest<{ success: boolean; data: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any) => {
    return apiRequest<{ success: boolean; data: any }>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/orders/${id}`, {
      method: 'DELETE',
    });
  },
};

// Accounts API
export const accountsApi = {
  getAll: async () => {
    return apiRequest<{ success: boolean; data: any }>('/accounts');
  },
};

// Transaction Types API (Master Transaksi - JenisTransaksi, full CRUD)
export const transactionTypesApi = {
  getAll: async (filters?: { business_unit?: string; aktif?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.business_unit) params.append('business_unit', filters.business_unit);
    if (filters?.aktif !== undefined) params.append('aktif', filters.aktif.toString());
    return apiRequest<{ success: boolean; data: any }>(`/transaction-types?${params}`);
  },

  getById: async (id: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/transaction-types/${id}`);
  },

  // data: { kode, nama_transaksi, arah: 'PEMASUKAN'|'PENGELUARAN', jenis_akun? (teks bebas, saran saja), unit_bisnis? }
  create: async (data: any) => {
    return apiRequest<{ success: boolean; data: any }>('/transaction-types', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any) => {
    return apiRequest<{ success: boolean; data: any }>(`/transaction-types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/transaction-types/${id}`, {
      method: 'DELETE',
    });
  },

  // ---- Kolom custom per jenis ----
  getColumns: async (jenisTransaksiId: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/transaction-types/${jenisTransaksiId}/columns`);
  },

  // data: { nama_kolom, tipe_data: 'TEKS'|'ANGKA'|'TANGGAL'|'DROPDOWN', opsi_dropdown?: string[], urutan? }
  createColumn: async (jenisTransaksiId: number, data: any) => {
    return apiRequest<{ success: boolean; data: any }>(`/transaction-types/${jenisTransaksiId}/columns`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateColumn: async (jenisTransaksiId: number, columnId: number, data: any) => {
    return apiRequest<{ success: boolean; data: any }>(`/transaction-types/${jenisTransaksiId}/columns/${columnId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteColumn: async (jenisTransaksiId: number, columnId: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/transaction-types/${jenisTransaksiId}/columns/${columnId}`, {
      method: 'DELETE',
    });
  },
};

// Free Tables API ("Buat Tabel Bebas" - murni pendataan, terpisah dari
// Master Transaksi/akuntansi)
export const freeTablesApi = {
  getAll: async () => {
    return apiRequest<{ success: boolean; data: any }>('/free-tables');
  },

  getById: async (id: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/free-tables/${id}`);
  },

  // data: { nama_tabel, deskripsi?, kolom: [{nama_kolom, tipe_data, opsi_dropdown?}] }
  create: async (data: any) => {
    return apiRequest<{ success: boolean; data: any }>('/free-tables', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any) => {
    return apiRequest<{ success: boolean; data: any }>(`/free-tables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/free-tables/${id}`, {
      method: 'DELETE',
    });
  },

  createColumn: async (tableId: number, data: any) => {
    return apiRequest<{ success: boolean; data: any }>(`/free-tables/${tableId}/columns`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateColumn: async (tableId: number, columnId: number, data: any) => {
    return apiRequest<{ success: boolean; data: any }>(`/free-tables/${tableId}/columns/${columnId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteColumn: async (tableId: number, columnId: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/free-tables/${tableId}/columns/${columnId}`, {
      method: 'DELETE',
    });
  },

  createRow: async (tableId: number, data: Record<string, any>) => {
    return apiRequest<{ success: boolean; data: any }>(`/free-tables/${tableId}/rows`, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  },

  updateRow: async (tableId: number, rowId: number, data: Record<string, any>) => {
    return apiRequest<{ success: boolean; data: any }>(`/free-tables/${tableId}/rows/${rowId}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  },

  deleteRow: async (tableId: number, rowId: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/free-tables/${tableId}/rows/${rowId}`, {
      method: 'DELETE',
    });
  },
};

// Debts API
export const debtsApi = {
  getAll: async () => {
    return apiRequest<{ success: boolean; data: any }>('/debts');
  },

  getPayments: async (debtId: number) => {
    return apiRequest<{ success: boolean; data: any }>(`/debts/${debtId}/payments`);
  },

  create: async (data: any) => {
    return apiRequest<{ success: boolean; data: any }>('/debts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  createPayment: async (debtId: number, data: any) => {
    return apiRequest<{ success: boolean; data: any }>(`/debts/${debtId}/payments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Reports API
export const reportsApi = {
  getBalanceSheet: async (tanggal?: string, business_unit?: string) => {
    const params = new URLSearchParams();
    if (tanggal) params.append('tanggal', tanggal);
    if (business_unit) params.append('business_unit', business_unit);
    return apiRequest<{ success: boolean; data: any }>(`/reports/neraca?${params}`);
  },

  getIncomeStatement: async (tanggal_mulai?: string, tanggal_selesai?: string, business_unit?: string) => {
    const params = new URLSearchParams();
    if (tanggal_mulai) params.append('tanggal_mulai', tanggal_mulai);
    if (tanggal_selesai) params.append('tanggal_selesai', tanggal_selesai);
    if (business_unit) params.append('business_unit', business_unit);
    return apiRequest<{ success: boolean; data: any }>(`/reports/laba-rugi?${params}`);
  },

  getEquityChanges: async (periode?: string, business_unit?: string) => {
    const params = new URLSearchParams();
    if (periode) params.append('periode', periode);
    if (business_unit) params.append('business_unit', business_unit);
    return apiRequest<{ success: boolean; data: any }>(`/reports/perubahan-modal?${params}`);
  },
};

// Audit Log API - default backend 7 hari terakhir, kirim days untuk ubah
// rentang (data lama TIDAK pernah dihapus, ini murni filter tampilan)
export const auditLogApi = {
  getAll: async (filters?: { sheet?: string; source?: string; search?: string; page?: number; limit?: number; days?: number | 'all' }) => {
    const params = new URLSearchParams();
    if (filters?.sheet && filters.sheet !== 'semua') params.append('sheet', filters.sheet);
    if (filters?.source && filters.source !== 'semua') params.append('source', filters.source);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.days !== undefined) params.append('days', filters.days.toString());
    return apiRequest<{ success: boolean; data: any }>(`/audit-log?${params}`);
  },
};

// Partner Stores API
export const partnerStoresApi = {
  getAll: async () => {
    return apiRequest<{ success: boolean; data: any }>('/partner-stores');
  },

  create: async (data: any) => {
    return apiRequest<{ success: boolean; data: any }>('/partner-stores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  createCheck: async (id: number, data: any) => {
    return apiRequest<{ success: boolean; data: any }>(`/partner-stores/${id}/checks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Export all APIs
export const api = {
  auth: authApi,
  dashboard: dashboardApi,
  products: productsApi,
  customers: customersApi,
  suppliers: suppliersApi,
  transactions: transactionsApi,
  stock: stockApi,
  orders: ordersApi,
  accounts: accountsApi,
  transactionTypes: transactionTypesApi,
  debts: debtsApi,
  reports: reportsApi,
  auditLog: auditLogApi,
  partnerStores: partnerStoresApi,
  freeTables: freeTablesApi,
};