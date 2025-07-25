/**
 * Authentication Service - Handles user authentication and profile management
 * Follows Single Responsibility Principle by handling only auth operations
 * Follows Dependency Inversion Principle by providing abstraction for auth
 */

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.loadUserFromStorage();
  }

  /**
   * Load user data from localStorage on service initialization
   */
  loadUserFromStorage() {
    try {
      const userData = localStorage.getItem('chatia_user');
      const authToken = localStorage.getItem('chatia_auth_token');
      
      if (userData && authToken) {
        this.currentUser = JSON.parse(userData);
        this.isAuthenticated = true;
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      this.logout();
    }
  }

  /**
   * Simulate user login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login result
   */
  async login(email, password) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple validation for demo purposes
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Simulate successful login
    const user = {
      id: Date.now().toString(),
      email: email,
      name: email.split('@')[0],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=3b82f6&color=fff`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    const authToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store user data
    this.currentUser = user;
    this.isAuthenticated = true;
    localStorage.setItem('chatia_user', JSON.stringify(user));
    localStorage.setItem('chatia_auth_token', authToken);

    return {
      success: true,
      user: user,
      token: authToken
    };
  }

  /**
   * Simulate user registration
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result
   */
  async register(userData) {
    const { email, password, confirmPassword, name } = userData;

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Validation
    if (!email || !password || !confirmPassword || !name) {
      throw new Error('All fields are required');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Check if user already exists (simulate)
    const existingUser = localStorage.getItem(`chatia_user_${email}`);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const user = {
      id: Date.now().toString(),
      email: email,
      name: name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    const authToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store user data
    this.currentUser = user;
    this.isAuthenticated = true;
    localStorage.setItem('chatia_user', JSON.stringify(user));
    localStorage.setItem('chatia_auth_token', authToken);
    localStorage.setItem(`chatia_user_${email}`, JSON.stringify(user));

    return {
      success: true,
      user: user,
      token: authToken
    };
  }

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} Update result
   */
  async updateProfile(profileData) {
    if (!this.isAuthenticated) {
      throw new Error('User not authenticated');
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const { name, email } = profileData;

    // Validation
    if (!name || !email) {
      throw new Error('Name and email are required');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Update user data
    const updatedUser = {
      ...this.currentUser,
      name: name,
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
      updatedAt: new Date().toISOString()
    };

    this.currentUser = updatedUser;
    localStorage.setItem('chatia_user', JSON.stringify(updatedUser));

    return {
      success: true,
      user: updatedUser
    };
  }

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Change password result
   */
  async changePassword(currentPassword, newPassword) {
    if (!this.isAuthenticated) {
      throw new Error('User not authenticated');
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validation
    if (!currentPassword || !newPassword) {
      throw new Error('Current password and new password are required');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters');
    }

    // In a real app, you would verify the current password
    // For demo purposes, we'll just simulate success
    return {
      success: true,
      message: 'Password changed successfully'
    };
  }

  /**
   * Logout user
   */
  logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem('chatia_user');
    localStorage.removeItem('chatia_auth_token');
  }

  /**
   * Get current user
   * @returns {Object|null} Current user data
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  /**
   * Get user's initials for avatar
   * @returns {string} User initials
   */
  getUserInitials() {
    if (!this.currentUser || !this.currentUser.name) {
      return 'U';
    }
    
    const names = this.currentUser.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;