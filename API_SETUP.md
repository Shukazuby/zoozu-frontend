# API Setup Complete ✅

The frontend is now configured to consume the Zoozu backend API.

## Base URL
**Current API Base URL:** `https://0ab3ec2490b9.ngrok-free.app`

This is configured in `lib/api/config.ts` and can be overridden by setting the `NEXT_PUBLIC_API_URL` environment variable.

## What's Been Set Up

### 1. API Client Infrastructure
- ✅ Axios installed and configured
- ✅ Base API client with interceptors
- ✅ Automatic token injection from localStorage
- ✅ Error handling (401 redirects to login)

### 2. API Services Created
- ✅ **Cart API** (`lib/api/cart.ts`)
  - `getCart()` - Get current user cart
  - `addToCart()` - Add item to cart
  - `removeFromCart()` - Remove item from cart
  - `clearCart()` - Clear all cart items

- ✅ **Orders API** (`lib/api/orders.ts`)
  - `createOrder()` - Create new order
  - `getOrders()` - List orders with filters
  - `getOrderById()` - Get single order
  - `updateOrder()` - Update order
  - `deleteOrder()` - Delete order
  - `initializePayment()` - Initialize Paystack payment
  - `getShippingEstimate()` - Get shipping cost estimate

- ✅ **Auth API** (`lib/api/auth.ts`)
  - `login()` - User login
  - `register()` - User registration
  - `getCurrentUser()` - Get current user
  - Token management helpers

- ✅ **Shipping API** (`lib/api/shipping.ts`)
  - `getCurrentShipping()` - Get current shipping cost

### 3. TypeScript Types
- ✅ Complete type definitions in `lib/api/types.ts`
- ✅ Type-safe API responses
- ✅ DTOs for all API requests

### 4. React Hooks
- ✅ `useCart()` hook (`lib/hooks/useCart.ts`)
- ✅ `useOrders()` hook (`lib/hooks/useOrders.ts`)

### 5. Example Implementations
- ✅ Cart page updated to use API (`app/cart/page.tsx`)
- ✅ Orders page updated to use API (`app/profile/orders/page.tsx`)
- ✅ Client components created for cart and orders

## Usage Examples

### Using the Cart Hook
```typescript
'use client';
import { useCart } from '@/lib/hooks';

export default function MyComponent() {
  const { cart, loading, error, addToCart, removeFromCart } = useCart();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {cart?.cart.map(item => (
        <div key={item.id}>
          {item.product?.name} - {item.quantity}
        </div>
      ))}
    </div>
  );
}
```

### Using the Orders Hook
```typescript
'use client';
import { useOrders } from '@/lib/hooks';

export default function OrdersComponent() {
  const { orders, loading, createOrder, initializePayment } = useOrders();

  const handleCheckout = async () => {
    const order = await createOrder({
      cartItemIds: ['item1', 'item2'],
      shippingCost: 2500
    });
    
    if (order) {
      const payment = await initializePayment(order._id);
      if (payment) {
        window.location.href = payment.authorizationUrl;
      }
    }
  };

  // ... rest of component
}
```

### Direct API Usage
```typescript
import { cartApi, ordersApi } from '@/lib/api';

// Get cart
const response = await cartApi.getCart();

// Create order
const order = await ordersApi.createOrder({
  cartItemIds: ['item-id'],
  shippingCost: 2500
});
```

## Authentication

The API client automatically includes the JWT token from localStorage in the `Authorization` header.

To set the token after login:
```typescript
import { tokenManager } from '@/lib/api';

tokenManager.setToken(response.data.token);
```

## Environment Variables

Create a `.env.local` file (optional):
```env
NEXT_PUBLIC_API_URL=https://0ab3ec2490b9.ngrok-free.app
```

## Next Steps

1. **Authentication Pages**: Create login/register pages that use `authApi`
2. **Product Pages**: Integrate product API calls
3. **Checkout Flow**: Complete checkout page with order creation and payment
4. **Error Handling**: Add toast notifications for API errors
5. **Loading States**: Add loading spinners where needed

## API Endpoints Available

All endpoints match the backend structure:
- `GET /cart` - Get cart
- `POST /cart/add` - Add to cart
- `DELETE /cart/remove/:cartItemId` - Remove from cart
- `DELETE /cart/clear/all` - Clear cart
- `POST /orders` - Create order
- `GET /orders` - List orders
- `GET /orders/:id` - Get order
- `POST /orders/:id/paystack/initialize` - Initialize payment
- `POST /orders/shipping/estimate` - Get shipping estimate
- `GET /shipping/current` - Get shipping cost

## Notes

- All API calls are type-safe with TypeScript
- Error handling is built into the hooks
- Token management is automatic
- The base URL can be changed via environment variable

