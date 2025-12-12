// Guest storage utilities for cart and saved items

export interface GuestCartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface GuestCart {
  items: GuestCartItem[];
}

const GUEST_CART_KEY = 'guest_cart';
const GUEST_SAVED_ITEMS_KEY = 'guest_saved_items';
const GUEST_ORDER_DETAILS_KEY = 'guest_order_details';

// Guest Cart Storage
export const guestCartStorage = {
  getCart: (): GuestCart => {
    if (typeof window === 'undefined') return { items: [] };
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      return stored ? JSON.parse(stored) : { items: [] };
    } catch {
      return { items: [] };
    }
  },

  addItem: (productId: string, quantity: number = 1): GuestCart => {
    const cart = guestCartStorage.getCart();
    const existingIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }
    
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    return cart;
  },

  removeItem: (productId: string): GuestCart => {
    const cart = guestCartStorage.getCart();
    cart.items = cart.items.filter(item => item.productId !== productId);
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    return cart;
  },

  updateQuantity: (productId: string, quantity: number): GuestCart => {
    const cart = guestCartStorage.getCart();
    const item = cart.items.find(item => item.productId === productId);
    
    if (item) {
      if (quantity <= 0) {
        return guestCartStorage.removeItem(productId);
      }
      item.quantity = quantity;
    }
    
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    return cart;
  },

  clearCart: (): void => {
    localStorage.removeItem(GUEST_CART_KEY);
  },

  getCartItems: (): GuestCartItem[] => {
    return guestCartStorage.getCart().items;
  },
};

// Guest Saved Items Storage
export const guestSavedItemsStorage = {
  getSavedItems: (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(GUEST_SAVED_ITEMS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addItem: (productId: string): void => {
    const items = guestSavedItemsStorage.getSavedItems();
    if (!items.includes(productId)) {
      items.push(productId);
      localStorage.setItem(GUEST_SAVED_ITEMS_KEY, JSON.stringify(items));
    }
  },

  removeItem: (productId: string): void => {
    const items = guestSavedItemsStorage.getSavedItems();
    const filtered = items.filter(id => id !== productId);
    localStorage.setItem(GUEST_SAVED_ITEMS_KEY, JSON.stringify(filtered));
  },

  isSaved: (productId: string): boolean => {
    return guestSavedItemsStorage.getSavedItems().includes(productId);
  },

  clearSavedItems: (): void => {
    localStorage.removeItem(GUEST_SAVED_ITEMS_KEY);
  },
};

// Guest Order Details Storage (address, note, etc.)
export interface GuestOrderDetails {
  shippingAddress?: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  note?: string;
}

export const guestOrderDetailsStorage = {
  getOrderDetails: (): GuestOrderDetails => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(GUEST_ORDER_DETAILS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  setOrderDetails: (details: GuestOrderDetails): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(GUEST_ORDER_DETAILS_KEY, JSON.stringify(details));
    } catch (err) {
      console.error('Failed to save guest order details:', err);
    }
  },

  setShippingAddress: (address: GuestOrderDetails['shippingAddress']): void => {
    const details = guestOrderDetailsStorage.getOrderDetails();
    details.shippingAddress = address;
    guestOrderDetailsStorage.setOrderDetails(details);
  },

  setNote: (note: string): void => {
    const details = guestOrderDetailsStorage.getOrderDetails();
    details.note = note;
    guestOrderDetailsStorage.setOrderDetails(details);
  },

  clearOrderDetails: (): void => {
    localStorage.removeItem(GUEST_ORDER_DETAILS_KEY);
  },
};

