/**
 * useAuth Hook - Custom hook for managing authentication state
 * Follows Single Responsibility Principle by handling only auth state logic
 * Follows Dependency Inversion Principle by depending on AuthService abstraction
 */

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import authService from '../services/AuthService';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Initialize authentication state from service
   */
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    const authStatus = authService.getIsAuthenticated();
    
    setUser(currentUser);
    setIsAuthenticated(authStatus);
  }, []);

  /**
   * Clear any existing errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Handle user login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<boolean>} Success status
   */
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        // Sync with AuthService state
        setUser(authService.getCurrentUser());
        setIsAuthenticated(authService.getIsAuthenticated());
        return true;
      }
      
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle user registration
   * @param {Object} userData - User registration data
   * @returns {Promise<boolean>} Success status
   */
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        // Sync with AuthService state
        setUser(authService.getCurrentUser());
        setIsAuthenticated(authService.getIsAuthenticated());
        return true;
      }
      
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle user logout
   */
  const logout = useCallback(() => {
    authService.logout();
    // Sync with AuthService state
    setUser(authService.getCurrentUser());
    setIsAuthenticated(authService.getIsAuthenticated());
    setError(null);
  }, []);

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<boolean>} Success status
   */
  const updateProfile = useCallback(async (profileData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.updateProfile(profileData);
      
      if (result.success) {
        // Sync with AuthService state
        setUser(authService.getCurrentUser());
        return true;
      }
      
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.changePassword(currentPassword, newPassword);
      return result.success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get user initials for avatar display
   * @returns {string} User initials
   */
  const getUserInitials = useCallback(() => {
    return authService.getUserInitials();
  }, []);

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    getUserInitials
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for accessing authentication context
 * @returns {Object} Authentication state and methods
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;