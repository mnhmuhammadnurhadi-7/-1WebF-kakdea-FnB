const API_ROOT = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1").replace(/\/api\/v1\/?$/, "");
const CUSTOMER_API = `${API_ROOT}/api/customer`;
const TOKEN_KEY = "customer_auth_token";

export type CustomerProfile = { id: number; nama: string; email: string; noTelepon: string; alamat: string; dibuatPada?: string };
export type CustomerCartItem = { productId: number; nama?: string; varian: string; jumlah: number; catatan: string; harga?: number; satuan?: string; gambar?: string | null };

export const customerToken = {
  get: () => typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY),
  set: (token: string) => { if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token); },
  clear: () => { if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY); },
};

async function request<T>(path: string, options: RequestInit = {}, requiresAuth = true): Promise<T> {
  const token = customerToken.get();
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(options.headers as Record<string, string> | undefined) };
  if (requiresAuth && token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${CUSTOMER_API}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({ message: "Terjadi kesalahan" }));
  if (!response.ok) {
    if (response.status === 401 && requiresAuth) customerToken.clear();
    throw new Error(body.message || "Permintaan customer gagal");
  }
  return body as T;
}

export const customerApi = {
  isAuthenticated: () => Boolean(customerToken.get()),
  register: async (data: { nama: string; email: string; noTelepon: string; alamat: string; password: string }) => {
    const result = await request<{ success: boolean; data: { token: string; customer: CustomerProfile } }>("/auth/daftar", { method: "POST", body: JSON.stringify(data) }, false);
    customerToken.set(result.data.token);
    return result;
  },
  login: async (email: string, password: string) => {
    const result = await request<{ success: boolean; data: { token: string; customer: CustomerProfile } }>("/auth/masuk", { method: "POST", body: JSON.stringify({ email, password }) }, false);
    customerToken.set(result.data.token);
    return result;
  },
  logout: () => customerToken.clear(),
  getProfile: () => request<{ success: boolean; data: CustomerProfile }>("/profil"),
  updateProfile: (data: Partial<Pick<CustomerProfile, "nama" | "email" | "noTelepon" | "alamat">>) =>
    request<{ success: boolean; data: CustomerProfile }>("/profil", { method: "PATCH", body: JSON.stringify(data) }),
  getCart: () => request<{ success: boolean; data: CustomerCartItem[] }>("/keranjang"),
  updateCart: (items: Array<Pick<CustomerCartItem, "productId" | "varian" | "jumlah" | "catatan">>) =>
    request<{ success: boolean; data: { jumlahItem: number } }>("/keranjang", { method: "PUT", body: JSON.stringify({ items }) }),
  checkout: (alamat?: string) => request<{ success: boolean; data: any; message: string }>("/checkout", { method: "POST", body: JSON.stringify({ alamat }) }),
  getOrders: () => request<{ success: boolean; data: any[] }>("/pesanan"),
  getOrder: (id: number) => request<{ success: boolean; data: any }>(`/pesanan/${id}`),
};
