// Sync guest cart and saved items to user account after login/registration

import { cartApi, savedItemsApi, addressesApi } from '@/lib/api';
import { guestCartStorage, guestSavedItemsStorage, guestOrderDetailsStorage, type GuestOrderDetails } from './guestStorage';

export interface SyncResult {
  cartSynced: boolean;
  savedItemsSynced: boolean;
  orderDetailsSynced: boolean;
  cartItemsCount: number;
  savedItemsCount: number;
}

export async function syncGuestDataToAccount(): Promise<SyncResult> {
  const result: SyncResult = {
    cartSynced: false,
    savedItemsSynced: false,
    orderDetailsSynced: false,
    cartItemsCount: 0,
    savedItemsCount: 0,
  };

  try {
    // Sync cart items
    const guestCartItems = guestCartStorage.getCartItems();
    if (guestCartItems.length > 0) {
      try {
        const syncedItems: string[] = [];
        const failedItems: string[] = [];
        
        // Add each guest cart item to user's cart
        for (const item of guestCartItems) {
          try {
            await cartApi.addToCart({
              productId: item.productId,
              quantity: item.quantity,
            });
            syncedItems.push(item.productId);
          } catch (itemErr: any) {
            // Handle individual item failures (e.g., product no longer available)
            console.warn(`Failed to sync cart item ${item.productId}:`, itemErr);
            failedItems.push(item.productId);
            // Continue syncing other items even if one fails
          }
        }
        
        if (syncedItems.length > 0) {
          result.cartSynced = true;
          result.cartItemsCount = syncedItems.length;
          // Only clear successfully synced items from guest cart
          syncedItems.forEach(productId => {
            guestCartStorage.removeItem(productId);
          });
        }
        
        // If all items failed, don't mark as synced
        if (failedItems.length === guestCartItems.length) {
          console.error('All cart items failed to sync');
        }
      } catch (err) {
        console.error('Failed to sync cart items:', err);
        // Don't clear guest cart if sync fails completely
      }
    }

    // Sync saved items
    const guestSavedItems = guestSavedItemsStorage.getSavedItems();
    if (guestSavedItems.length > 0) {
      try {
        // Add each guest saved item to user's saved items
        for (const productId of guestSavedItems) {
          await savedItemsApi.add(productId);
        }
        result.savedItemsSynced = true;
        result.savedItemsCount = guestSavedItems.length;
        // Clear guest saved items after successful sync
        guestSavedItemsStorage.clearSavedItems();
      } catch (err) {
        console.error('Failed to sync saved items:', err);
        // Don't clear guest saved items if sync fails
      }
    }

    // Sync order details (address only - note is preserved until checkout)
    const guestOrderDetails = guestOrderDetailsStorage.getOrderDetails();
    if (guestOrderDetails.shippingAddress) {
      try {
        // Create address if shipping address exists
        const addressData = guestOrderDetails.shippingAddress;
        await addressesApi.create({
          street: addressData.street,
          apartment: addressData.apartment,
          city: addressData.city,
          state: addressData.state,
          country: addressData.country,
          postalCode: addressData.postalCode,
          isDefault: true, // Set as default since it's the only one
        });
        result.orderDetailsSynced = true;
        // Clear only address from guest order details (preserve note for checkout)
        const note = guestOrderDetails.note;
        guestOrderDetailsStorage.setOrderDetails({ note });
      } catch (err) {
        console.error('Failed to sync order details:', err);
        // Don't clear guest order details if sync fails
      }
    }

    return result;
  } catch (err) {
    console.error('Error syncing guest data:', err);
    return result;
  }
}

