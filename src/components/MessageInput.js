/**
 * MessageInput Component - Handles user message input and sending
 * Follows Single Responsibility Principle by handling only input functionality
 * Follows Interface Segregation Principle by providing specific input interface
 */

import React, { useState, useRef, useEffect } from 'react';

/**
 * MessageInput component for handling user input and message sending
 * @param {Object} props - Component properties
 * @param {Function} props.onSendMessage - Callback function when message is sent
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {string} props.placeholder - Placeholder text for the input
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.maxLength - Maximum message length (default: 1000)
 * @returns {JSX.Element} MessageInput component
 */
const MessageInput = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type your message here...", 
  className = "",
  maxLength = 1000
}) => {
  // Local state for input value
  const [inputMessage, setInputMessage] = useState('');
  
  // Reference to the textarea element
  const textareaRef = useRef(null);

  /**
   * Handles input value changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const value = e.target.value;
    
    // Enforce maximum length
    if (value.length <= maxLength) {
      setInputMessage(value);
      adjustTextareaHeight();
    }
  };

  /**
   * Adjusts textarea height based on content
   * Follows Single Responsibility Principle by handling only height adjustment
   */
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Set height based on content, with min and max constraints
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 120);
      textarea.style.height = `${newHeight}px`;
    }
  };

  /**
   * Handles message sending
   * Validates input and calls the onSendMessage callback
   */
  const handleSendMessage = () => {
    // Validate input
    const trimmedMessage = inputMessage.trim();
    
    if (!trimmedMessage) {
      return; // Don't send empty messages
    }

    if (!onSendMessage || typeof onSendMessage !== 'function') {
      console.error('onSendMessage prop must be a function');
      return;
    }

    // Call the callback with the message
    onSendMessage(trimmedMessage);
    
    // Clear the input
    setInputMessage('');
    
    // Reset textarea height
    setTimeout(() => {
      adjustTextareaHeight();
    }, 0);
  };

  /**
   * Handles keyboard events
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyPress = (e) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Adjust height when component mounts
  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  // Determine if send button should be disabled
  const isSendDisabled = disabled || !inputMessage.trim();

  return (
    <div className={`bg-white border-t border-gray-200 p-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-4">
          {/* Input textarea container */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              rows="1"
              style={{ 
                minHeight: '44px', 
                maxHeight: '120px',
                overflow: 'hidden'
              }}
              aria-label="Message input"
            />
            
            {/* Character counter */}
            {inputMessage.length > maxLength * 0.8 && (
              <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                {inputMessage.length}/{maxLength}
              </div>
            )}
          </div>
          
          {/* Send button - fixed size and aligned to bottom */}
          <button
            onClick={handleSendMessage}
            disabled={isSendDisabled}
            className="flex-shrink-0 w-11 h-11 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            aria-label="Send message"
          >
            {/* Send icon */}
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;