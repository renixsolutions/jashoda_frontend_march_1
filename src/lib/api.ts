
import { Product, Category, Gender } from './mockData';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// API Response Wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }
  }
}

// Helper to build query string
const buildQueryString = (params: Record<string, any>) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      query.append(key, String(params[key]));
    }
  });
  return query.toString();
};

export const api = {
  // Products
  getProducts: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    subcategory?: string;
    occasion?: string;
    gender?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    minPrice?: number;
    maxPrice?: number;
    metalType?: string;
    stoneType?: string;
    inStock?: boolean;
  } = {}) => {
    const queryString = buildQueryString(params);
    const res = await fetch(`${BASE_URL}/products?${queryString}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json() as Promise<ApiResponse<Product[]>>;
  },

  getProduct: async (idOrSlug: string) => {
    const res = await fetch(`${BASE_URL}/products/${idOrSlug}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json() as Promise<ApiResponse<Product>>;
  },

  // Categories
  getCategories: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {}) => {
    const queryString = buildQueryString(params);
    const res = await fetch(`${BASE_URL}/categories?${queryString}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json() as Promise<ApiResponse<Category[]>>;
  },

  getParentCategories: async () => {
    const res = await fetch(`${BASE_URL}/categories/parents`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch parent categories');
    return res.json() as Promise<ApiResponse<Category[]>>;
  },

  getSubcategories: async (parentId: number) => {
    const res = await fetch(`${BASE_URL}/categories/parents/${parentId}/subcategories`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch subcategories');
    return res.json() as Promise<ApiResponse<Category[]>>;
  },

  getCategory: async (idOrSlug: string, params: { page?: number; limit?: number } = {}) => {
    const queryString = buildQueryString(params);
    const res = await fetch(`${BASE_URL}/categories/${idOrSlug}?${queryString}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch category');
    return res.json() as Promise<ApiResponse<{ category: Category, products: Product[], pagination: any }>>;
  },

  // Genders
  getGenders: async () => {
    const res = await fetch(`${BASE_URL}/genders`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch genders');
    return res.json() as Promise<ApiResponse<(Gender & { slug: string })[]>>;
  },

  // Occasions
  getOccasions: async () => {
    const res = await fetch(`${BASE_URL}/occasions`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch occasions');
    return res.json() as Promise<ApiResponse<{ id: number, name: string, slug: string, image?: string, image_url?: string }[]>>;
  },

  // Promos
  getPromos: async (activeOnly: boolean = true) => {
    const res = await fetch(`${BASE_URL}/promos?activeOnly=${activeOnly}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch promos');
    return res.json() as Promise<ApiResponse<{ id: number, title: string, subtitle: string, video_url: string, link_url: string, is_active: boolean, order_index: number }[]>>;
  }
};

export const authApi = {
  requestOtp: async (phone: string) => {
    // Check if phone starts with +91, if not add it (backend might expect full format)
    // The modal sends full format: +91XXXXXXXXXX
    const res = await fetch(`${BASE_URL}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to request OTP');
    return data;
  },

  verifyOtp: async (phone: string, otp: string) => {
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to verify OTP');
    return data;
  },

  completeRegistration: async (tempToken: string, userData: { title?: string, fullName: string, email: string }) => {
    const res = await fetch(`${BASE_URL}/auth/complete-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...userData, tempToken }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to complete registration');
    return data;
  }
};

// --- AUTHENTICATED REQUEST HELPER ---
// Add token if available
const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

const handleResponse = async (res: Response, defaultError: string) => {
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth_unauthorized'));
  }
  if (!res.ok) {
    throw new Error(data.message || defaultError);
  }
  return data;
};

// --- CART API ---
export const cartApi = {
  getCart: async () => {
    const res = await fetch(`${BASE_URL}/cart`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    return handleResponse(res, 'Failed to fetch cart');
  },

  addToCart: async (productId: number, quantity: number = 1) => {
    const res = await fetch(`${BASE_URL}/cart/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product_id: productId, quantity }),
    });
    return handleResponse(res, 'Failed to add to cart');
  },

  updateCartItem: async (itemId: number, quantity: number) => {
    const res = await fetch(`${BASE_URL}/cart/items/${itemId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    return handleResponse(res, 'Failed to update cart item');
  },

  removeCartItem: async (itemId: number) => {
    const res = await fetch(`${BASE_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res, 'Failed to remove cart item');
  },

  clearCart: async () => {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res, 'Failed to clear cart');
  },
};

// --- FAVORITES (WISHLIST) API ---
export const favoritesApi = {
  getFavorites: async () => {
    const res = await fetch(`${BASE_URL}/favorites`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    return handleResponse(res, 'Failed to fetch favorites');
  },

  checkFavorite: async (productId: number) => {
    const res = await fetch(`${BASE_URL}/favorites/check?product_id=${productId}`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    return handleResponse(res, 'Failed to check favorite');
  },

  addToFavorites: async (productId: number) => {
    const res = await fetch(`${BASE_URL}/favorites`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product_id: productId }),
    });
    return handleResponse(res, 'Failed to add to favorites');
  },

  removeFromFavorites: async (productId: number) => {
    const res = await fetch(`${BASE_URL}/favorites/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res, 'Failed to remove from favorites');
  },
};

// --- USERS API ---
export const usersApi = {
  getMe: async () => {
    const res = await fetch(`${BASE_URL}/users/me`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    return handleResponse(res, 'Failed to fetch user profile');
  },

  getAddresses: async () => {
    const res = await fetch(`${BASE_URL}/users/me/addresses`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    return handleResponse(res, 'Failed to fetch addresses');
  },

  createAddress: async (data: any) => {
    const res = await fetch(`${BASE_URL}/users/me/addresses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res, 'Failed to create address');
  },

  updateAddress: async (id: number | string, data: any) => {
    const res = await fetch(`${BASE_URL}/users/me/addresses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res, 'Failed to update address');
  },

  deleteAddress: async (id: number | string) => {
    const res = await fetch(`${BASE_URL}/users/me/addresses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res, 'Failed to delete address');
  },

  setDefaultAddress: async (id: number | string) => {
    const res = await fetch(`${BASE_URL}/users/me/addresses/${id}/default`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(res, 'Failed to set default address');
  },
};

// --- ORDERS API ---
export const ordersApi = {
  placeOrder: async (orderData: any) => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(res, 'Failed to place order');
  },

  verifyPayment: async (paymentData: { order_id: string | number, razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }) => {
    const res = await fetch(`${BASE_URL}/orders/verify-payment`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });
    return handleResponse(res, 'Failed to verify payment');
  },

  getOrders: async () => {
    const res = await fetch(`${BASE_URL}/orders`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    return handleResponse(res, 'Failed to fetch orders');
  },

  getOrderById: async (orderId: string | number) => {
    const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    return handleResponse(res, 'Failed to fetch order details');
  },
};
