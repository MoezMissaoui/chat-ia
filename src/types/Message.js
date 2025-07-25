/**
 * Message type definition for the chat application
 * Follows Single Responsibility Principle by defining a clear data structure
 */

/**
 * Represents a single message in the chat
 * @typedef {Object} Message
 * @property {number} id - Unique identifier for the message
 * @property {string} text - The content of the message
 * @property {'user'|'ai'} sender - Who sent the message
 * @property {Date} [timestamp] - When the message was sent (optional)
 */

/**
 * Creates a new message object with proper structure
 * @param {number} id - Unique identifier
 * @param {string} text - Message content
 * @param {'user'|'ai'} sender - Message sender
 * @returns {Message} Formatted message object
 */
export const createMessage = (id, text, sender) => {
  return {
    id,
    text,
    sender,
    timestamp: new Date()
  };
};

/**
 * Validates if an object is a valid message
 * @param {any} obj - Object to validate
 * @returns {boolean} True if valid message
 */
export const isValidMessage = (obj) => {
  return (
    obj &&
    typeof obj.id === 'number' &&
    typeof obj.text === 'string' &&
    (obj.sender === 'user' || obj.sender === 'ai')
  );
};