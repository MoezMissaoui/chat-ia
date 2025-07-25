/**
 * Header Component - Displays the application header
 * Follows Single Responsibility Principle by handling only header presentation
 * Follows Open/Closed Principle by being extensible through props
 */

import React from 'react';
import DropdownMenu from './DropdownMenu';
import useAuth from '../hooks/useAuth';

/**
 * Header component for the Chat IA application
 * @param {Object} props - Component properties
 * @param {string} props.title - Main title to display (default: "Chat AI")
 * @param {string} props.subtitle - Subtitle to display (default: "AI Assistant")
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClearChat - Callback for clearing chat
 * @param {Function} props.onShareChat - Callback for sharing chat
 * @param {Function} props.onShowAuth - Callback for showing auth modal
 * @param {Function} props.onShowProfile - Callback for showing profile modal
 * @param {Object} props.chatStats - Chat statistics object
 * @returns {JSX.Element} Header component
 */
const Header = ({ 
  title = "Chat AI", 
  subtitle = "AI Assistant", 
  className = "",
  onClearChat = null,
  onShareChat = null,
  onShowAuth = null,
  onShowProfile = null,
  chatStats = null
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 p-4 ${className}`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Logo and Title Section */}
        <div className="flex items-center space-x-3">
          {/* Application Icon */}
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            {/* Chat bubble SVG icon */}
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-label="Chat icon"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
          </div>
          
          {/* Title and Subtitle */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {title}
            </h1>
            <p className="text-sm text-gray-500">
              {subtitle}
            </p>
            {/* Chat stats display */}
            {chatStats && (
              <p className="text-xs text-gray-500">
                {chatStats.totalMessages} messages • {chatStats.isActive ? 'Active' : 'New'} conversation
              </p>
            )}
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          
          {/* Authentication section */}
          {isAuthenticated ? (
            /* User profile dropdown */
            <DropdownMenu
              trigger={
                <div className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-medium">{user?.name || 'User'}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              }
              actions={[
                {
                  label: 'Profile Settings',
                  icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
                  onClick: onShowProfile
                },
                {
                  label: 'Sign Out',
                  icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
                  onClick: logout,
                  className: 'text-red-600 hover:text-red-800 hover:bg-red-50'
                }
              ]}
              menuClassName="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            />
          ) : (
            /* Login button */
            <button
              onClick={onShowAuth}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

// PropTypes would be added here in a TypeScript environment
// or with the prop-types library for runtime type checking

export default Header;