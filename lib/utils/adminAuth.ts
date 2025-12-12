import { tokenManager } from '@/lib/api';
import { apiClient } from '@/lib/api/config';

/**
 * Decode JWT token without verification (client-side only)
 */
export function decodeToken(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token?: string): boolean {
  const tokenToCheck = token || tokenManager.getToken();
  if (!tokenToCheck) return true;
  
  try {
    const decoded = decodeToken(tokenToCheck);
    if (!decoded || !decoded.exp) return true;
    
    // Check if token expires in less than 1 minute (buffer time)
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    return currentTime >= expirationTime - 60000;
  } catch (error) {
    return true;
  }
}

/**
 * Check if token is valid (exists and not expired)
 */
export function isTokenValid(token?: string): boolean {
  const tokenToCheck = token || tokenManager.getToken();
  if (!tokenToCheck) return false;
  return !isTokenExpired(tokenToCheck);
}

/**
 * Verify if the current user is an admin
 */
export async function verifyAdminStatus(): Promise<{
  isAdmin: boolean;
  isValid: boolean;
  error?: string;
}> {
  try {
    const token = tokenManager.getToken();
    if (!token || isTokenExpired(token)) {
      return { isAdmin: false, isValid: false, error: 'No valid token' };
    }

    // Decode token to check role
    const decoded = decodeToken(token);
    if (!decoded) {
      return { isAdmin: false, isValid: false, error: 'Invalid token' };
    }

    // Check if role exists in token and is ADMIN
    if (decoded.role === 'ADMIN') {
      return { isAdmin: true, isValid: true };
    }

    // If role is not ADMIN or doesn't exist in token
    return { isAdmin: false, isValid: false, error: 'User is not an admin' };
  } catch (error: any) {
    return {
      isAdmin: false,
      isValid: false,
      error: error.message || 'Verification error',
    };
  }
}

