# Jashoda Website API Integration Guide

This guide provides a structured approach to integrating the backend APIs from your Postman collection into your Next.js frontend (`jashoda_jeweller`). Since you are using Next.js 16+, we will focus on leveraging the native `fetch` API for both Server and Client Components.

## 1. Environment Setup

First, configure your API base URL in the frontend.

1. Create or open `.env.local` in your `jashoda_jeweller` root folder.
2. Add the backend URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

> [!TIP]
> Using `NEXT_PUBLIC_` makes the variable accessible in Client Components as well as Server Components.

## 2. Setting Up an API Utility

To avoid repeating the `fetch` logic, headers, and token management in every component, create a central API utility.

Create a file at `src/lib/api.ts` (or `utils/api.ts` based on your structure):

```typescript
// src/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { requireAuth = false, headers, ...customOptions } = options;
  
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Manage Authorization Token
  if (requireAuth) {
    // Note: If using Client Components, get token from localStorage or cookies.
    // If using Server Components, use Next.js cookies() from 'next/headers'.
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null; 
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...customOptions,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }

  return data;
}
```

## 3. Implementing API Services

Organize your raw API calls into service functions. Create a folder `src/services/` and add files for different domains.

### Authentication (`src/services/auth.ts`)
```typescript
import { fetchApi } from '@/lib/api';

export const login = async (credentials: any) => {
  return fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const requestOtp = async (phone: string) => {
  return fetchApi('/auth/request-otp', {
    method: 'POST',
    body: JSON.stringify({ phone })
  });
};
```

### Products (`src/services/products.ts`)
```typescript
import { fetchApi } from '@/lib/api';

// For Next.js Server Components, you might just fetch directly inside the component, 
// but encapsulating it here is cleaner.
export const getProducts = async (searchParams: URLSearchParams | string = '') => {
  return fetchApi(`/products?${searchParams}`);
};

export const getProductById = async (idOrSlug: string) => {
  return fetchApi(`/products/${idOrSlug}`);
};
```

### Cart (`src/services/cart.ts`)
```typescript
import { fetchApi } from '@/lib/api';

export const getCart = async () => {
  return fetchApi('/cart', { requireAuth: true });
};

export const addToCart = async (productId: number, quantity: number = 1) => {
  return fetchApi('/cart/items', {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify({ product_id: productId, quantity })
  });
};
```

## 4. Connecting to Next.js Components

### Using in Server Components (Standard approach for Next.js App Router)
For SEO and performance, fetch public data like products natively on the server.

```tsx
// app/products/page.tsx
import { getProducts } from '@/services/products';

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  // Fetch products directly on the server
  const params = new URLSearchParams(searchParams).toString();
  const products = await getProducts(params);

  return (
    <div>
      <h1>Our Products</h1>
      {/* Render Product Cards */}
    </div>
  );
}
```

### Using in Client Components (For interactive features like Cart / Auth)
When dealing with user interaction (like adding to cart), use Client Components.

```tsx
'use client';

import { useState } from 'react';
import { addToCart } from '@/services/cart';
import toast from 'react-hot-toast'; // You have this installed!

export default function AddToCartButton({ productId }: { productId: number }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    try {
      setIsLoading(true);
      await addToCart(productId, 1);
      toast.success("Added to cart successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleAdd} disabled={isLoading} className="btn-primary">
      {isLoading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
```

## 5. Token Management Strategy

Since most of your endpoints require `Authorization: Bearer {{token}}`, here is the recommended Next.js strategy:

1. **Login**: User logs in -> Backend sends JWT token.
2. **Storage**: Save the token.
    - *Option A (Easiest)*: Save in `localStorage`. Only accessible in Client Components.
    - *Option B (Best for Next.js)*: Store in an `HttpOnly` cookie or regular cookie. This allows Server Components to read the token using `cookies()` from `next/headers` and make authenticated SSR requests!
3. **Usage**: Inject it into headers via your `fetchApi` wrapper.

> [!IMPORTANT]
> If you decide to use cookies (Option B), update your `fetchApi` utility to grab the cookie when running on the server. You can install `js-cookie` (for client) and use Next.js `cookies()` (for server).

## 6. Execution Plan

Here is the step-by-step order you should follow to implement this:

1. [ ] **Setup base utility**: Create `.env.local` and `src/lib/api.ts`.
2. [ ] **Auth Flow implementation**: Create `services/auth.ts`, hook it up to your Login / OTP / Registration modals. Store the token on success.
3. [ ] **Products List & Details**: Create `services/products.ts`. Update your `TrendingSection`, `ProductListing`, and individual product pages to fetch real data from the backend instead of mock data.
4. [ ] **User Profile**: Fetch the `Me` endpoint and display user details.
5. [ ] **Cart & Wishlist (Favorites)**: Connect the "Add to Cart" and "Favorite" buttons to the respective endpoints.
6. [ ] **Checkout Flow**: Finally, connect the address selection and "Place Order" APIs.

Let me know if you want me to start implementing any of these specific steps for you!
