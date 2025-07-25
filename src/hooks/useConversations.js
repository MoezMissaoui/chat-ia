/**
 * Custom Hook for Managing Conversations
 * Follows Single Responsibility Principle by handling only conversation state
 * Follows Open/Closed Principle by being extensible for different storage backends
 * Follows Dependency Inversion Principle by abstracting conversation management
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing chat conversations
 * Handles conversation creation, selection, deletion, and persistence
 * @returns {Object} Conversation management functions and state
 */
const useConversations = () => {
  // State for all conversations
  const [conversations, setConversations] = useState([]);
  
  // State for current active conversation
  const [currentConversationId, setCurrentConversationId] = useState(null);
  
  // State for sidebar collapse - initialize from localStorage
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const savedSidebarState = localStorage.getItem('chatia_sidebar_collapsed');
    return savedSidebarState !== null ? JSON.parse(savedSidebarState) : false;
  });

  /**
   * Loads conversations from localStorage on component mount
   */
  useEffect(() => {
    const savedConversations = localStorage.getItem('chatia_conversations');
    const savedCurrentId = localStorage.getItem('chatia_current_conversation');
    
    if (savedConversations) {
      try {
        const parsedConversations = JSON.parse(savedConversations);
        setConversations(parsedConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    }
    
    if (savedCurrentId) {
      setCurrentConversationId(savedCurrentId);
    }
  }, []);

  /**
   * Saves conversations to localStorage whenever they change
   */
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('chatia_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  /**
   * Saves current conversation ID to localStorage
   */
  useEffect(() => {
    if (currentConversationId) {
      localStorage.setItem('chatia_current_conversation', currentConversationId);
    }
  }, [currentConversationId]);

  /**
   * Saves sidebar state to localStorage
   */
  useEffect(() => {
    localStorage.setItem('chatia_sidebar_collapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  /**
   * Generates a unique conversation ID
   * @returns {string} Unique conversation ID
   */
  const generateConversationId = useCallback(() => {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  /**
   * Generates a conversation title from the first message
   * @param {string} firstMessage - The first message in the conversation
   * @returns {string} Generated title
   */
  const generateConversationTitle = useCallback((firstMessage) => {
    if (!firstMessage) return 'New conversation';
    
    // Take first 50 characters and clean up
    let title = firstMessage.substring(0, 50).trim();
    
    // Remove line breaks and extra spaces
    title = title.replace(/\s+/g, ' ');
    
    // Add ellipsis if truncated
    if (firstMessage.length > 50) {
      title += '...';
    }
    
    return title || 'New conversation';
  }, []);

  /**
   * Creates a new conversation
   * @param {string} firstMessage - Optional first message to start the conversation
   * @returns {string} ID of the new conversation
   */
  const createNewConversation = useCallback((firstMessage = null) => {
    const newId = generateConversationId();
    const title = firstMessage ? generateConversationTitle(firstMessage) : 'New conversation';
    
    const newConversation = {
      id: newId,
      title,
      lastMessage: firstMessage || 'Empty conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: firstMessage ? 1 : 0
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newId);
    
    return newId;
  }, [generateConversationId, generateConversationTitle]);

  /**
   * Selects an existing conversation
   * @param {string} conversationId - ID of conversation to select
   */
  const selectConversation = useCallback((conversationId) => {
    setCurrentConversationId(conversationId);
  }, []);

  /**
   * Deletes a conversation
   * @param {string} conversationId - ID of conversation to delete
   */
  const deleteConversation = useCallback((conversationId) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    
    // If deleting current conversation, select the first available one or create new
    if (conversationId === currentConversationId) {
      const remainingConversations = conversations.filter(conv => conv.id !== conversationId);
      if (remainingConversations.length > 0) {
        setCurrentConversationId(remainingConversations[0].id);
      } else {
        setCurrentConversationId(null);
      }
    }
  }, [conversations, currentConversationId]);

  /**
   * Updates conversation metadata (title, last message, etc.)
   * @param {string} conversationId - ID of conversation to update
   * @param {Object} updates - Updates to apply
   */
  const updateConversation = useCallback((conversationId, updates) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, ...updates, updatedAt: new Date().toISOString() }
        : conv
    ));
  }, []);

  /**
   * Renames a conversation
   * @param {string} conversationId - ID of conversation to rename
   * @param {string} newTitle - New title for the conversation
   */
  const renameConversation = useCallback((conversationId, newTitle) => {
    if (!newTitle.trim()) return;
    
    updateConversation(conversationId, {
      title: newTitle.trim()
    });
  }, [updateConversation]);

  /**
   * Updates conversation with new message info
   * @param {string} conversationId - ID of conversation
   * @param {string} lastMessage - Last message text
   * @param {number} messageCount - Total message count
   */
  const updateConversationWithMessage = useCallback((conversationId, lastMessage, messageCount) => {
    updateConversation(conversationId, {
      lastMessage: lastMessage.substring(0, 100),
      messageCount,
      updatedAt: new Date().toISOString()
    });
  }, [updateConversation]);

  /**
   * Gets the current conversation object
   * @returns {Object|null} Current conversation or null
   */
  const getCurrentConversation = useCallback(() => {
    return conversations.find(conv => conv.id === currentConversationId) || null;
  }, [conversations, currentConversationId]);

  /**
   * Toggles sidebar collapsed state
   */
  const toggleSidebarCollapse = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  /**
   * Clears all conversations
   */
  const clearAllConversations = useCallback(() => {
    if (window.confirm('Are you sure you want to delete all conversations?')) {
      setConversations([]);
      setCurrentConversationId(null);
      localStorage.removeItem('chatia_conversations');
      localStorage.removeItem('chatia_current_conversation');
    }
  }, []);

  /**
   * Exports conversations as JSON
   * @returns {string} JSON string of all conversations
   */
  const exportConversations = useCallback(() => {
    return JSON.stringify({
      conversations,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  }, [conversations]);

  return {
    // State
    conversations,
    currentConversationId,
    isSidebarCollapsed,
    
    // Actions
    createNewConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    updateConversation,
    updateConversationWithMessage,
    toggleSidebarCollapse,
    clearAllConversations,
    
    // Getters
    getCurrentConversation,
    exportConversations,
    
    // Computed values
    hasConversations: conversations.length > 0,
    conversationCount: conversations.length
  };
};

export default useConversations;