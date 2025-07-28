/**
 * MessageBubble Component - Displays individual chat messages
 * Follows Single Responsibility Principle by handling only message presentation
 * Follows Open/Closed Principle by being extensible through props
 */

import React from 'react';
import { isValidMessage } from '../types/Message';

/**
 * MessageBubble component for displaying individual chat messages
 * @param {Object} props - Component properties
 * @param {Object} props.message - Message object to display
 * @param {number} props.message.id - Unique message identifier
 * @param {string} props.message.text - Message content
 * @param {'user'|'ai'} props.message.sender - Who sent the message
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} MessageBubble component
 */
const MessageBubble = ({ message, className = "" }) => {
  // Validate message prop using our validation function
  if (!isValidMessage(message)) {
    console.error('Invalid message provided to MessageBubble:', message);
    return null;
  }

  // Determine if this is a user message
  const isUserMessage = message.sender === 'user';
  
  // Define styling based on message sender
  const bubbleStyles = isUserMessage
    ? 'bg-blue-500 text-white rounded-br-none' // User message styles
    : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-none'; // AI message styles
  
  // Define container alignment based on message sender
  const containerAlignment = isUserMessage ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex ${containerAlignment} ${className}`}>
      {/* Message bubble container */}
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${bubbleStyles}`}>
        {/* Message text content */}
        <p className="text-sm whitespace-pre-wrap">
          {message.text}
        </p>
        
        {/* Optional: Display timestamp if available */}
        {message.timestamp && (
          <span className="text-xs opacity-70 mt-1 block">
            {formatTimestamp(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Formats a timestamp for display
 * @param {Date} timestamp - The timestamp to format
 * @returns {string} Formatted time string
 * @private
 */
const formatTimestamp = (timestamp) => {
  if (!(timestamp instanceof Date)) {
    return '';
  }
  
  return timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export default MessageBubble;