/**
 * MessageList Component - Displays a list of chat messages
 * Follows Single Responsibility Principle by handling only message list display
 * Follows Open/Closed Principle by being extensible through props
 */

import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { isValidMessage } from '../types/Message';

/**
 * MessageList component for displaying chat messages with auto-scroll
 * @param {Object} props - Component properties
 * @param {Array} props.messages - Array of message objects to display
 * @param {boolean} props.isTyping - Whether to show typing indicator
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.autoScroll - Whether to auto-scroll to bottom (default: true)
 * @returns {JSX.Element} MessageList component
 */
const MessageList = ({ 
  messages = [], 
  isTyping = false, 
  className = "", 
  autoScroll = true 
}) => {
  // Reference to the messages container for auto-scrolling
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  /**
   * Scrolls to the bottom of the message list
   * Follows Single Responsibility Principle by handling only scroll behavior
   */
  const scrollToBottom = () => {
    if (messagesEndRef.current && autoScroll) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  // Auto-scroll when messages change or typing state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, autoScroll]);

  /**
   * Validates and filters messages array
   * @returns {Array} Array of valid messages
   */
  const getValidMessages = () => {
    if (!Array.isArray(messages)) {
      console.error('Messages prop must be an array');
      return [];
    }

    return messages.filter(message => {
      const isValid = isValidMessage(message);
      if (!isValid) {
        console.warn('Invalid message found in messages array:', message);
      }
      return isValid;
    });
  };

  const validMessages = getValidMessages();

  return (
    <div 
      ref={containerRef}
      className={`flex-1 overflow-y-auto p-4 ${className}`}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Render all valid messages */}
        {validMessages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message}
          />
        ))}
        
        {/* Show typing indicator when AI is processing */}
        <TypingIndicator isVisible={isTyping} />
        
        {/* Empty div for auto-scroll reference */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;