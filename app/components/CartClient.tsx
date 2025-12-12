'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ordersApi, tokenManager, addressesApi, type CartItem, type Address } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/hooks/useCart';
import { guestOrderDetailsStorage } from '@/lib/utils/guestStorage';

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

export default function CartClient() {
  const router = useRouter();
  const { cart, loading, error, loadCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [shippingCost, setShippingCost] = useState(0);
  const [payLoading, setPayLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesError, setAddressesError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(undefined);
  const [note, setNote] = useState<string>('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [syncNotification, setSyncNotification] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => tokenManager.isAuthenticated());
  const hasInitialized = useRef(false);
  const authStateRef = useRef<boolean | null>(null);
  const shippingCalculatedRef = useRef(false);
  
  // Guest address form state
  const [guestAddress, setGuestAddress] = useState({
    street: '',
    apartment: '',
    city: '',
    state: '',
    country: 'Nigeria',
    postalCode: '',
  });

  // Initialize on mount - handle both normal load and post-login sync
  useEffect(() => {
    if (hasInitialized.current) return;
    
    hasInitialized.current = true;
    const currentAuth = tokenManager.isAuthenticated();
    authStateRef.current = currentAuth;
    setIsAuthenticated(currentAuth);
    
    // Check if user just logged in (has synced param)
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const synced = urlParams?.get('synced') === 'true';
    
    if (synced && currentAuth) {
      // User just logged in and was redirected back
      setSyncNotification('Your cart and order details have been saved to your account.');
      // Remove the param from URL
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', window.location.pathname);
      }
      // Clear notification after 5 seconds
      setTimeout(() => setSyncNotification(null), 5000);
      
      // Initialize authenticated cart after login
      const initializeAuthenticatedCart = async () => {
        // Load guest order details note if available
        const guestDetails = guestOrderDetailsStorage.getOrderDetails();
        if (guestDetails.note) {
          setNote(guestDetails.note);
        }
        
        // Load addresses first (synced address will be set as default)
        await loadAddresses();
        // Load cart to get synced items from server
        await loadCart();
        // Shipping will be calculated automatically by the cart length effect
        // when the cart state updates, so we don't need to call it here
      };
      
      initializeAuthenticatedCart();
      
      // Clear guest address form when authenticated
      setGuestAddress({
        street: '',
        apartment: '',
        city: '',
        state: '',
        country: 'Nigeria',
        postalCode: '',
      });
    } else {
      // Normal page load (not post-login)
      // Load cart first
      loadCart();
      
      if (currentAuth) {
        // Authenticated user - load addresses
        // Shipping will be calculated automatically by the cart length effect when cart loads
        loadAddresses();
      } else {
        // Guest user - load guest order details
        loadGuestOrderDetails();
        setShippingCost(0);
      }
    }
  }, []); // Run only once on mount


  // Update shipping when cart items change (only for authenticated users, avoid loops)
  useEffect(() => {
    if (!hasInitialized.current) return;
    // Don't update shipping while cart is loading - wait for cart to finish loading
    if (loading) return;
    
    const currentAuth = tokenManager.isAuthenticated();
    
    // Only update shipping for authenticated users with cart items
    if (currentAuth && cart?.cart && cart.cart.length > 0) {
      // Recalculate shipping when cart items change (items added/removed/quantity changed)
      // This ensures shipping stays up-to-date and is calculated after login
      loadShippingEstimate();
    } else if (!currentAuth) {
      // Only reset to 0 for guests
      setShippingCost(0);
      shippingCalculatedRef.current = false;
    }
    // Don't reset shipping for authenticated users even if cart is temporarily empty
    // This prevents shipping from being reset during loading or if cart becomes empty
  }, [cart?.cart?.length, loading]); // Only depend on cart items count and loading state

  // Load guest order details from localStorage
  const loadGuestOrderDetails = () => {
    const details = guestOrderDetailsStorage.getOrderDetails();
    if (!tokenManager.isAuthenticated()) {
      // For guests, load address form
      if (details.shippingAddress) {
        setGuestAddress({
          street: details.shippingAddress.street || '',
          apartment: details.shippingAddress.apartment || '',
          city: details.shippingAddress.city || '',
          state: details.shippingAddress.state || '',
          country: details.shippingAddress.country || 'Nigeria',
          postalCode: details.shippingAddress.postalCode || '',
        });
      }
    }
    // Load note for both guests and authenticated users (before sync clears it)
    if (details.note && !note) {
      setNote(details.note);
    }
  };

  // Save guest order details to localStorage
  const saveGuestOrderDetails = () => {
    if (!tokenManager.isAuthenticated()) {
      // Only save if address fields are filled
      if (guestAddress.street || guestAddress.city || guestAddress.state) {
        guestOrderDetailsStorage.setShippingAddress(guestAddress);
      }
      if (note) {
        guestOrderDetailsStorage.setNote(note);
      }
    }
  };

  // Save note when it changes (for guests)
  useEffect(() => {
    if (!tokenManager.isAuthenticated() && note !== undefined) {
      guestOrderDetailsStorage.setNote(note);
    }
  }, [note]);

  // Save guest address when it changes
  useEffect(() => {
    if (!tokenManager.isAuthenticated()) {
      const timer = setTimeout(() => {
        saveGuestOrderDetails();
      }, 500); // Debounce to avoid too many localStorage writes
      return () => clearTimeout(timer);
    }
  }, [guestAddress]);

  const loadShippingEstimate = async () => {
    // Guests should not see shipping cost - set to 0
    if (!tokenManager.isAuthenticated()) {
      setShippingCost(0);
      shippingCalculatedRef.current = false;
      return;
    }
    
    // Only calculate shipping for authenticated users
    try {
      if (cart?.cart && cart.cart.length > 0) {
        const cartItemIds = cart.cart.map((item) => item.id);
        const response = await ordersApi.getShippingEstimate({ cartItemIds });
        if (response.success && response.data && response.data.shippingCost !== undefined) {
          // Update shipping cost and mark as calculated
          setShippingCost(response.data.shippingCost);
          shippingCalculatedRef.current = true;
        }
        // Don't reset to 0 if API response is invalid - keep existing value
      }
      // Don't reset to 0 if cart is empty - might be loading or user cleared cart intentionally
    } catch (err) {
      console.error('Shipping estimate error:', err);
      // Don't reset to 0 on error - preserve existing shipping cost for authenticated users
      // Only log the error, don't change shipping state
    }
  };

  const loadAddresses = async () => {
    if (!tokenManager.isAuthenticated()) return Promise.resolve();
    try {
      setAddressesError(null);
      const resp = await addressesApi.list();
      if (resp.success && resp.data && Array.isArray(resp.data)) {
        setAddresses(resp.data);
        // Auto-select default address or first address (synced address will be default)
        const defaultAddr = resp.data.find((a: Address) => a.isDefault);
        const first = defaultAddr || resp.data[0];
        if (first) {
          setSelectedAddressId(first._id);
        }
      } else {
        setAddresses([]);
      }
      return Promise.resolve();
    } catch (err: any) {
      setAddressesError(err.response?.data?.message || 'Failed to load addresses');
      setAddresses([]);
      return Promise.resolve();
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    await removeFromCart(cartItemId);
    await loadShippingEstimate();
  };

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    const currentItem = cart?.cart.find((c) => c.id === cartItemId);
    if (!currentItem) return;

    if (newQuantity <= 0) {
      await handleRemoveItem(cartItemId);
      return;
    }

    await updateQuantity(cartItemId, newQuantity);
    await loadShippingEstimate();
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  const handleProceedCheckout = async () => {
    // Save guest order details before redirecting to login
    if (!tokenManager.isAuthenticated()) {
      saveGuestOrderDetails();
      // Save current cart state to ensure it persists
      router.push(`/auth/login?next=${encodeURIComponent('/cart')}`);
      return;
    }
    
    if (!cart || !cart.cart || cart.cart.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }
    
    // For authenticated users, require selected address
    if (!selectedAddressId) {
      setCheckoutError('Please select a shipping address before checkout.');
      return;
    }

    const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
    const shippingAddressStr = selectedAddress
      ? `${selectedAddress.street}${selectedAddress.apartment ? ', ' + selectedAddress.apartment : ''}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}${selectedAddress.postalCode ? ', ' + selectedAddress.postalCode : ''}`
      : '';
    try {
      setPayLoading(true);
      setCheckoutError(null);
      const cartItemIds = cart.cart.map((c) => c.id);
      
      // Validate that all cart items still exist and are available
      const unavailableItems: string[] = [];
      for (const item of cart.cart) {
        try {
          // This is a quick check - in production you might want to verify product availability
          if (!item.product || !item.product.id) {
            unavailableItems.push(item.product?.name || 'Unknown item');
          }
        } catch (err) {
          unavailableItems.push(item.product?.name || 'Unknown item');
        }
      }
      
      if (unavailableItems.length > 0) {
        setCheckoutError(`Some items are no longer available: ${unavailableItems.join(', ')}. Please remove them and try again.`);
        setPayLoading(false);
        // Reload cart to refresh state
        await loadCart();
        return;
      }
      
      const orderResp = await ordersApi.createOrder({
        cartItemIds,
        shippingCost,
        notes: note || undefined,
        shippingAddress: shippingAddressStr,
      });
      if (!orderResp.success || !orderResp.data?._id) {
        setCheckoutError(orderResp.message || 'Unable to create order');
        setPayLoading(false);
        return;
      }
      // Clear guest order details after successful order creation
      guestOrderDetailsStorage.clearOrderDetails();
      const orderId = orderResp.data._id;
      const initResp = await ordersApi.initializePayment(orderId);
      if (initResp.success && initResp.data?.authorizationUrl) {
        window.location.href = initResp.data.authorizationUrl;
      } else {
        setCheckoutError(initResp.message || 'Failed to initialize payment');
      }
    } catch (err: any) {
      setCheckoutError(err.response?.data?.message || 'Failed to proceed to checkout');
      // If error is related to unavailable items, reload cart
      if (err.response?.data?.message?.toLowerCase().includes('not available') || 
          err.response?.data?.message?.toLowerCase().includes('not found')) {
        await loadCart();
      }
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 pb-16 pt-12">
        <div className="container">
          <div className="text-center py-12">
            <p className="text-slate-600">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="bg-slate-50 pb-16 pt-12">
        <div className="container">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadCart}
              className="mt-4 rounded bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-500"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cartItems = cart?.cart || [];
  const subtotal = cart?.total || 0;
  // Only add shipping cost for authenticated users
  const total = tokenManager.isAuthenticated() ? subtotal + shippingCost : subtotal;

  return (
    <div className="bg-slate-50 pb-16 pt-12">
      <div className="container space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Your Cart</h1>
          <p className="text-sm text-slate-600">Review your items before checkout.</p>
        </div>

        {syncNotification && (
          <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 border border-green-200">
            <p className="font-semibold">✓ {syncNotification}</p>
          </div>
        )}
        
        {checkoutError && (
          <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
            <p className="font-semibold">⚠ {checkoutError}</p>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">Your cart is empty</p>
            <Link
              href="/collections"
              className="inline-block rounded bg-yellow-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-yellow-500"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-4">
              <div className="rounded-lg bg-white p-4 shadow-sm divide-y divide-slate-100">
                {cartItems.map((item: CartItem) => (
                  <div key={item.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-16 overflow-hidden rounded bg-slate-100">
                        {item.product?.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-slate-900">{item.product?.name || 'Product'}</p>
                        {item.product?.category && (
                          <p className="text-slate-600">Category: {item.product.category}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="flex items-center rounded border border-slate-200">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
                          aria-label="Decrease quantity"
                        >
                          –
                        </button>
                        <span className="px-3 py-2 text-sm font-semibold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{formatCurrency(item.lineTotal)}</p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-xs font-semibold text-slate-500 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/collections"
                  className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-yellow-500"
                >
                  Continue Shopping
                </Link>
                {cartItems.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="rounded border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-500"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Shipping Address</p>
                  {addressesError && <p className="text-xs text-red-600">{addressesError}</p>}
                  {tokenManager.isAuthenticated() ? (
                    addresses.length === 0 ? (
                      <p className="text-xs text-slate-600">No saved addresses. Add one in your profile.</p>
                    ) : (
                      <select
                        value={selectedAddressId}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                        className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
                      >
                        {addresses.map((addr) => (
                          <option key={addr._id} value={addr._id}>
                            {`${addr.street}${addr.apartment ? ', ' + addr.apartment : ''}, ${addr.city}, ${addr.state}`}
                            {addr.isDefault ? ' (Default)' : ''}
                          </option>
                        ))}
                      </select>
                    )
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Street Address *"
                        value={guestAddress.street}
                        onChange={(e) => {
                          setGuestAddress({ ...guestAddress, street: e.target.value });
                          saveGuestOrderDetails();
                        }}
                        className="w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
                      />
                      <input
                        type="text"
                        placeholder="Apartment, suite, etc. (Optional)"
                        value={guestAddress.apartment}
                        onChange={(e) => {
                          setGuestAddress({ ...guestAddress, apartment: e.target.value });
                          saveGuestOrderDetails();
                        }}
                        className="w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="City *"
                          value={guestAddress.city}
                          onChange={(e) => {
                            setGuestAddress({ ...guestAddress, city: e.target.value });
                            saveGuestOrderDetails();
                          }}
                          className="w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
                        />
                        <input
                          type="text"
                          placeholder="State *"
                          value={guestAddress.state}
                          onChange={(e) => {
                            setGuestAddress({ ...guestAddress, state: e.target.value });
                            saveGuestOrderDetails();
                          }}
                          className="w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Country *"
                        value={guestAddress.country}
                        onChange={(e) => {
                          setGuestAddress({ ...guestAddress, country: e.target.value });
                          saveGuestOrderDetails();
                        }}
                        className="w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
                      />
                      <input
                        type="text"
                        placeholder="Postal Code (Optional)"
                        value={guestAddress.postalCode}
                        onChange={(e) => {
                          setGuestAddress({ ...guestAddress, postalCode: e.target.value });
                          saveGuestOrderDetails();
                        }}
                        className="w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Order Note (optional)</p>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add delivery instructions or special requests"
                    className="min-h-[80px] w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
                  />
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {tokenManager.isAuthenticated() && (
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{formatCurrency(shippingCost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span>—</span>
                  </div>
                </div>
                <div className="h-px w-full bg-slate-100" />
                <div className="flex justify-between text-base font-semibold text-slate-900">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                {!tokenManager.isAuthenticated() ? (
                  <div className="space-y-3">
                    <div className="rounded-md bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                      <p className="font-semibold">Sign in to checkout</p>
                      <p className="mt-1">Please sign in or create an account to proceed with your order. Your cart and order details will be saved.</p>
                    </div>
                    <button
                      onClick={handleProceedCheckout}
                      disabled={cartItems.length === 0 || !guestAddress.street || !guestAddress.city || !guestAddress.state || !guestAddress.country}
                      className="block w-full rounded bg-yellow-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleProceedCheckout}
                    disabled={payLoading || cartItems.length === 0 || !selectedAddressId}
                    className="block w-full rounded bg-yellow-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {payLoading ? 'Processing...' : 'Proceed to Checkout'}
                  </button>
                )}
                <p className="text-xs text-slate-500">
                  By proceeding, you agree to our{' '}
                  <Link href="/terms" className="font-semibold text-slate-800 underline">
                    Terms &amp; Conditions
                  </Link>
                  .
                </p>
              </div>

              <div className="rounded-lg bg-white p-4 shadow-sm text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Need help?</p>
                <p className="mt-1">Call +234 706 820 9546 or chat with us about sizing and delivery.</p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href="/contact"
                    className="rounded border border-slate-300 px-3 py-2 font-semibold text-slate-800 transition hover:border-yellow-500"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/bespoke-fitting"
                    className="rounded bg-yellow-600 px-3 py-2 font-semibold text-white transition hover:bg-yellow-500"
                  >
                    Book a Fitting
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

