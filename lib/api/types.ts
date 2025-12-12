// Base API Response Type
export interface BaseResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  totalCount?: number;
  limit?: number;
  page?: number;
  search?: string;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  } | null;
  lineTotal: number;
}

export interface Cart {
  cart: CartItem[];
  total: number;
}

// Order Types
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'initiated' | 'paid' | 'failed';
  paymentReference?: string;
  paymentProvider?: string;
  paymentAuthorizationUrl?: string;
  placedAt: string;
  userId?: string;
  shippingAddress?: string;
  contactEmail?: string;
  contactName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  cartItemIds: string[];
  notes?: string;
  shippingCost?: number;
  shippingAddress?: string;
}

export interface OrderFilterDto {
  limit?: number;
  page?: number;
  status?: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateOrderDto {
  status?: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: string;
  notes?: string;
}

// Shipping Types
export interface ShippingEstimateDto {
  cartItemIds: string[];
}

export interface ShippingEstimate {
  shippingCost: number;
}

// Auth Types
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  profilePicture?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
  categories?: string[];
  category?: string;
  gender?: string;
  sizes?: string[];
  colors?: string[];
  stock?: number;
  isAvailable?: boolean;
  isBespoke?: boolean;
  isPreOrder?: boolean;
  badge?: string;
  tag?: string;
  views?: number;
  sales?: number;
  isActive?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

