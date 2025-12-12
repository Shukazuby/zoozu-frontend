// Export all API modules
export * from './config';
export * from './types';
export * from './cart';
export * from './orders';
export * from './auth';
export * from './shipping';
export * from './products';
export * from './custom-orders';
export * from './savedItems';
export * from './users';
export * from './addresses';
export * from './bespoke-fittings';
export * from './contact';

// Re-export for convenience
export { cartApi } from './cart';
export { ordersApi } from './orders';
export { authApi, tokenManager } from './auth';
export { shippingApi } from './shipping';
export { productsApi } from './products';
export { customOrdersApi } from './custom-orders';
export { savedItemsApi } from './savedItems';
export { usersApi } from './users';
export { addressesApi } from './addresses';
export { bespokeFittingsApi } from './bespoke-fittings';
export { contactApi } from './contact';

