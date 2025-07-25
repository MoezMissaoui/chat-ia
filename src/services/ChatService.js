/**
 * ChatService - Handles AI communication and message processing
 * Follows Single Responsibility Principle by focusing only on chat logic
 * Follows Open/Closed Principle by being extensible for different AI providers
 */

import { createMessage } from '../types/Message';

/**
 * Service class for handling chat operations
 * Implements the Interface Segregation Principle by providing specific methods
 */
class ChatService {
  /**
   * Constructor for ChatService
   * @param {Object} config - Configuration options
   * @param {number} config.responseDelay - Delay in milliseconds for AI response simulation
   */
  constructor(config = {}) {
    this.responseDelay = config.responseDelay || 1500;
    this.isProcessing = false;
  }

  /**
   * Processes a user message and generates an AI response
   * Follows Single Responsibility Principle by handling only message processing
   * @param {string} userMessage - The user's input message
   * @param {number} messageId - ID for the AI response message
   * @returns {Promise<Object>} Promise that resolves to an AI response message
   */
  async processMessage(userMessage, messageId) {
    // Validate input parameters
    if (!userMessage || typeof userMessage !== 'string') {
      throw new Error('Invalid user message provided');
    }

    if (typeof messageId !== 'number') {
      throw new Error('Invalid message ID provided');
    }

    // Set processing state
    this.isProcessing = true;

    try {
      // Simulate AI processing delay
      await this.delay(this.responseDelay);

      // Generate AI response based on user input
      const aiResponseText = this.generateAIResponse(userMessage);

      // Create and return the AI message
      const aiMessage = createMessage(messageId, aiResponseText, 'ai');
      
      return aiMessage;
    } catch (error) {
      // Handle any errors during processing
      console.error('Error processing message:', error);
      throw new Error('Failed to process message');
    } finally {
      // Reset processing state
      this.isProcessing = false;
    }
  }

  /**
   * Generates an AI response based on user input
   * This method can be extended to integrate with real AI services
   * Follows Open/Closed Principle - can be extended without modification
   * @param {string} userMessage - The user's message
   * @returns {string} Generated AI response
   * @private
   */
  generateAIResponse(userMessage) {
    // Simple response generation logic
    // In a real implementation, this would call an AI API
    const responses = [
      "I understand your message. How can I help you further?",
      "That's an interesting point. Let me think about that.",
      "I'm here to assist you. What would you like to know?",
      "Thank you for sharing that with me. Is there anything specific you'd like help with?",
      "I appreciate your input. How can I best support you today?"
    ];

    // Simple logic to vary responses based on message content
    if (userMessage.toLowerCase().includes('help')) {
      return "I'm here to help! What specific assistance do you need?";
    }
    
    if (userMessage.toLowerCase().includes('thank')) {
      return "You're welcome! I'm glad I could help. Is there anything else you'd like to discuss?";
    }

    // Return a random response for other messages
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }

  /**
   * Creates a delay for simulating processing time
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Promise that resolves after the delay
   * @private
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Checks if the service is currently processing a message
   * @returns {boolean} True if processing, false otherwise
   */
  getProcessingState() {
    return this.isProcessing;
  }

  /**
   * Updates the response delay configuration
   * Follows Open/Closed Principle by allowing configuration changes
   * @param {number} delay - New delay in milliseconds
   */
  setResponseDelay(delay) {
    if (typeof delay !== 'number' || delay < 0) {
      throw new Error('Invalid delay value provided');
    }
    this.responseDelay = delay;
  }
}

// Export a singleton instance for use across the application
// Follows Dependency Inversion Principle by providing a consistent interface
export default new ChatService();

// Also export the class for testing or custom instances
export { ChatService };