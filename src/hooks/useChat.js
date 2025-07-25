/**
 * useChat Hook - Custom hook for managing chat state and operations
 * Follows Single Responsibility Principle by handling only chat state logic
 * Follows Dependency Inversion Principle by depending on abstractions (ChatService)
 */

import { useState, useCallback, useEffect } from 'react';
import { createMessage } from '../types/Message';
import chatService from '../services/ChatService';

/**
 * Custom hook for managing chat functionality
 * @param {Object} options - Configuration options
 * @param {string} options.conversationId - Current conversation ID
 * @param {Function} options.onMessageSent - Callback when message is sent
 * @returns {Object} Chat state and methods
 */
const useChat = (options = {}) => {
  const { conversationId, onMessageSent } = options;
  
  // Default initial message from AI
  const defaultInitialMessages = [
    createMessage(1, "Hello! I'm your AI assistant. How can I help you today?", 'ai')
  ];

  // Initialize state
  const [messages, setMessages] = useState(defaultInitialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Loads messages for the current conversation from localStorage
   */
  useEffect(() => {
    if (conversationId) {
      const savedMessages = localStorage.getItem(`chatia_messages_${conversationId}`);
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          setMessages(parsedMessages);
        } catch (error) {
          console.error('Error loading messages:', error);
          setMessages(defaultInitialMessages);
        }
      } else {
        // New conversation, start with default messages
        setMessages(defaultInitialMessages);
      }
    } else {
      // No conversation selected, show default messages
      setMessages(defaultInitialMessages);
    }
  }, [conversationId]);

  /**
   * Saves messages to localStorage whenever they change
   */
  useEffect(() => {
    if (conversationId && messages.length > 0) {
      localStorage.setItem(`chatia_messages_${conversationId}`, JSON.stringify(messages));
    }
  }, [conversationId, messages]);

  /**
   * Generates the next message ID
   * @returns {number} Next available message ID
   */
  const getNextMessageId = useCallback(() => {
    return messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
  }, [messages]);

  /**
   * Adds a new message to the chat
   * @param {string} text - Message text
   * @param {'user'|'ai'} sender - Message sender
   * @returns {Object} The created message
   */
  const addMessage = useCallback((text, sender) => {
    const newMessage = createMessage(getNextMessageId(), text, sender);
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    return newMessage;
  }, [getNextMessageId]);

  /**
   * Sends a user message and processes AI response
   * Follows Single Responsibility Principle by handling only message sending logic
   * @param {string} messageText - The user's message text
   * @returns {Promise<void>}
   */
  const sendMessage = useCallback(async (messageText) => {
    try {
      // Clear any previous errors
      setError(null);

      // Validate input
      if (!messageText || typeof messageText !== 'string' || !messageText.trim()) {
        throw new Error('Message text is required');
      }

      // Add user message to chat
      const userMessage = addMessage(messageText.trim(), 'user');

      // Set typing indicator
      setIsTyping(true);

      // Process message through chat service
      const aiResponse = await chatService.processMessage(
        userMessage.text, 
        getNextMessageId()
      );

      // Add AI response to chat
      setMessages(prevMessages => [...prevMessages, aiResponse]);

      // Notify parent component about the new message
      if (onMessageSent && conversationId) {
        const lastMessage = aiResponse.text;
        const messageCount = messages.length + 2; // +1 for user message, +1 for AI response
        onMessageSent(conversationId, lastMessage, messageCount);
      }

    } catch (err) {
      // Handle errors
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
      
      // Add error message to chat
      const errorMessage = createMessage(
        getNextMessageId(),
        'Sorry, I encountered an error processing your message. Please try again.',
        'ai'
      );
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      
    } finally {
      // Always clear typing indicator
      setIsTyping(false);
    }
  }, [addMessage, getNextMessageId]);

  /**
   * Clears all messages from the chat
   * Useful for resetting the conversation
   */
  const clearMessages = useCallback(() => {
    setMessages(defaultInitialMessages);
    setError(null);
    setIsTyping(false);
  }, []);

  /**
   * Clears the current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Gets the current chat statistics
   * @returns {Object} Chat statistics
   */
  const getChatStats = useCallback(() => {
    const userMessages = messages.filter(m => m.sender === 'user');
    const aiMessages = messages.filter(m => m.sender === 'ai');
    
    return {
      totalMessages: messages.length,
      userMessages: userMessages.length,
      aiMessages: aiMessages.length,
      isActive: messages.length > 1 // More than just the initial message
    };
  }, [messages]);

  // Return the hook interface
  return {
    // State
    messages,
    isTyping,
    error,
    
    // Actions
    sendMessage,
    clearMessages,
    clearError,
    
    // Utilities
    getChatStats,
    
    // Computed values
    hasMessages: messages.length > 0,
    isProcessing: isTyping || chatService.getProcessingState()
  };
};

export default useChat;