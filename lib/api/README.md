# API Client Documentation

This directory contains the API client setup for consuming the Zoozu backend API.

## Base URL
The API base URL is configured in `config.ts` and defaults to: `https://0ab3ec2490b9.ngrok-free.app`

You can override this by setting the `NEXT_PUBLIC_API_URL` environment variable.

## Usage Examples

### Cart API

```typescript
import { cartApi } from '@/lib/api';

// Get cart
const cart = await cartApi.getCart();

// Add item to cart
await cartApi.addToCart({
  productId: 'product-id-here',
  quantity: 1
});

// Remove item from cart
await cartApi.removeFromCart('cart-item-id');

// Clear cart
await cartApi.clearCart();
```

### Orders API

```typescript
import { ordersApi } from '@/lib/api';

// Create order
const order = await ordersApi.createOrder({
  cartItemIds: ['item-id-1', 'item-id-2'],
  shippingCost: 2500,
  notes: 'Please deliver before 5pm'
});

// Get orders
const orders = await ordersApi.getOrders({
  page: 1,
  limit: 10,
  status: 'pending'
});

// Get single order
const order = await ordersApi.getOrderById('order-id');

// Initialize payment
const payment = await ordersApi.initializePayment('order-id');
// Redirect to payment.authorizationUrl

// Get shipping estimate
const estimate = await ordersApi.getShippingEstimate({
  cartItemIds: ['item-id-1']
});
```

### Auth API

```typescript
import { authApi, tokenManager } from '@/lib/api';

// Login
const response = await authApi.login({
  email: 'user@example.com',
  password: 'password'
});
tokenManager.setToken(response.data.token);

// Register
const response = await authApi.register({
  email: 'user@example.com',
  password: 'password',
  fullName: 'John Doe'
});
tokenManager.setToken(response.data.token);

// Check if authenticated
if (tokenManager.isAuthenticated()) {
  // User is logged in
}

// Logout
tokenManager.removeToken();
```

### Shipping API

```typescript
import { shippingApi } from '@/lib/api';

// Get current shipping cost
const shipping = await shippingApi.getCurrentShipping();
```

## Authentication

The API client automatically includes the authentication token in requests if it's stored in localStorage under the key `auth_token`.

The token is automatically added via the request interceptor in `config.ts`.

## Error Handling

The API client includes response interceptors that:
- Automatically redirect to login on 401 (Unauthorized) errors
- Clear the token on authentication failures

You should wrap API calls in try-catch blocks:

```typescript
try {
  const cart = await cartApi.getCart();
  // Handle success
} catch (error) {
  // Handle error
  console.error('Failed to fetch cart:', error);
}
```

