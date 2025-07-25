/**
 * Header Component - Displays the application header
 * Follows Single Responsibility Principle by handling only header presentation
 * Follows Open/Closed Principle by being extensible through props
 */

import React from 'react';
import DropdownMenu from './DropdownMenu';

/**
 * Header component for the Chat IA application
 * @param {Object} props - Component properties
 * @param {string} props.title - Main title to display (default: "Chat AI")
 * @param {string} props.subtitle - Subtitle to display (default: "AI Assistant")
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClearChat - Callback for clearing chat
 * @param {Function} props.onShareChat - Callback for sharing chat
 * @param {Object} props.chatStats - Chat statistics object
 * @returns {JSX.Element} Header component
 */
const Header = ({ 
  title = "Chat AI", 
  subtitle = "AI Assistant", 
  className = "",
  onClearChat = null,
  onShareChat = null,
  chatStats = null
}) => {
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
        
        {/* Dropdown menu */}
        {(onClearChat || onShareChat) && (
          <DropdownMenu 
            actions={[
              ...(onShareChat ? [{
                label: 'Share conversation',
                icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z',
                onClick: onShareChat,
                className: 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
              }] : []),
              ...(onClearChat ? [{
                label: 'Delete conversation',
                icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
                onClick: onClearChat,
                className: 'text-red-600 hover:text-red-800 hover:bg-red-50'
              }] : [])
            ]}
          />
        )}
      </div>
    </header>
  );
};

// PropTypes would be added here in a TypeScript environment
// or with the prop-types library for runtime type checking

export default Header;