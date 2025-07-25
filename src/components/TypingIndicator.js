/**
 * TypingIndicator Component - Displays typing animation when AI is processing
 * Follows Single Responsibility Principle by handling only typing indicator display
 * Follows Interface Segregation Principle by providing a focused interface
 */

import React from 'react';

/**
 * TypingIndicator component that shows animated dots when AI is typing
 * @param {Object} props - Component properties
 * @param {boolean} props.isVisible - Whether to show the typing indicator
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element|null} TypingIndicator component or null if not visible
 */
const TypingIndicator = ({ isVisible = false, className = "" }) => {
  // Don't render anything if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div className={`flex justify-start ${className}`}>
      {/* Typing indicator bubble */}
      <div className="bg-white text-gray-800 shadow-sm border border-gray-200 rounded-lg rounded-bl-none px-4 py-2">
        {/* Animated dots container */}
        <div className="flex space-x-1" role="status" aria-label="AI is typing">
          {/* First animated dot */}
          <div 
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0s' }}
          />
          {/* Second animated dot */}
          <div 
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.1s' }}
          />
          {/* Third animated dot */}
          <div 
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;