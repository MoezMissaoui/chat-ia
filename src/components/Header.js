/**
 * Header Component - Displays the application header
 * Follows Single Responsibility Principle by handling only header presentation
 * Follows Open/Closed Principle by being extensible through props
 */

import React from 'react';

/**
 * Header component for the Chat IA application
 * @param {Object} props - Component properties
 * @param {string} props.title - Main title to display (default: "Chat IA")
 * @param {string} props.subtitle - Subtitle to display (default: "AI Assistant")
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClearChat - Callback for clearing chat
 * @param {Object} props.chatStats - Chat statistics object
 * @returns {JSX.Element} Header component
 */
const Header = ({ 
  title = "Chat IA", 
  subtitle = "AI Assistant", 
  className = "",
  onClearChat = null,
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
        
        {/* Clear chat button */}
        {onClearChat && (
          <button
            onClick={onClearChat}
            className="px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Clear conversation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
};

// PropTypes would be added here in a TypeScript environment
// or with the prop-types library for runtime type checking

export default Header;