/**
 * Main App Component - Chat IA Application
 * Follows Single Responsibility Principle by handling only app composition
 * Follows Open/Closed Principle by being extensible through component composition
 * Follows Dependency Inversion Principle by depending on abstractions (hooks, components)
 */

import React, { useState } from 'react';
import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import Sidebar from './components/Sidebar';
import AuthForm from './components/AuthForm';
import UserProfile from './components/UserProfile';
import useChat from './hooks/useChat';
import useConversations from './hooks/useConversations';
import useAuth from './hooks/useAuth';
import './App.css';

/**
 * Main application component that orchestrates the chat interface
 * Follows composition over inheritance principle
 * @returns {JSX.Element} The main App component
 */
function App() {
  // Authentication state
  const { user, isAuthenticated } = useAuth();
  
  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Use custom hook for conversations management
  const {
    conversations,
    currentConversationId,
    isSidebarCollapsed,
    createNewConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    updateConversationWithMessage,
    toggleSidebarCollapse,
    hasConversations
  } = useConversations();

  // Use custom hook for chat functionality with conversation context
  const {
    messages,
    isTyping,
    error,
    sendMessage,
    clearMessages,
    clearError,
    getChatStats,
    hasMessages,
    isProcessing
  } = useChat({
    conversationId: currentConversationId,
    onMessageSent: updateConversationWithMessage
  });

  /**
   * Handles creating a new conversation
   */
  const handleNewChat = () => {
    createNewConversation();
  };

  /**
   * Handles message sending from the input component
   * Creates new conversation if none exists
   * @param {string} messageText - The message text to send
   */
  const handleSendMessage = async (messageText) => {
    // Create new conversation if none exists
    let conversationId = currentConversationId;
    if (!conversationId) {
      conversationId = createNewConversation(messageText);
    }
    
    await sendMessage(messageText);
  };

  /**
   * Handles clearing the current chat conversation
   */
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      clearMessages();
      if (currentConversationId) {
        // Clear messages from localStorage for this conversation
        localStorage.removeItem(`chatia_messages_${currentConversationId}`);
      }
    }
  };

  /**
   * Handles sharing the current conversation
   */
  const handleShareChat = () => {
    if (messages.length <= 1) {
      alert('No conversation to share yet.');
      return;
    }
    
    // Create shareable text
    const conversationText = messages
      .filter(msg => msg.sender === 'user' || msg.sender === 'ai')
      .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`)
      .join('\n\n');
    
    // Copy to clipboard
    navigator.clipboard.writeText(conversationText).then(() => {
      alert('Conversation copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = conversationText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Conversation copied to clipboard!');
    });
  };

  /**
   * Handles renaming a conversation
   * @param {string} conversationId - ID of conversation to rename
   * @param {string} newTitle - New title for the conversation
   */
  const handleRenameConversation = (conversationId, newTitle) => {
    renameConversation(conversationId, newTitle);
  };

  /**
   * Handles sharing a specific conversation
   * @param {string} conversationId - ID of conversation to share
   */
  const handleShareConversation = (conversationId) => {
    // Get messages for the specific conversation
    const conversationMessages = JSON.parse(
      localStorage.getItem(`chatia_messages_${conversationId}`) || '[]'
    );
    
    if (conversationMessages.length <= 1) {
      alert('No conversation content to share.');
      return;
    }
    
    // Create shareable text
    const conversationText = conversationMessages
      .filter(msg => msg.sender === 'user' || msg.sender === 'ai')
      .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`)
      .join('\n\n');
    
    // Copy to clipboard
    navigator.clipboard.writeText(conversationText).then(() => {
      alert('Conversation copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = conversationText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Conversation copied to clipboard!');
    });
  };

  /**
   * Handles showing the authentication modal
   */
  const handleShowAuth = () => {
    setShowAuthModal(true);
  };

  /**
   * Handles showing the profile modal
   */
  const handleShowProfile = () => {
    setShowProfileModal(true);
  };

  /**
   * Handles closing modals
   */
  const handleCloseModals = () => {
    setShowAuthModal(false);
    setShowProfileModal(false);
  };

  // Get current chat statistics
  const chatStats = getChatStats();

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteConversation}
        onRenameConversation={handleRenameConversation}
        onShareConversation={handleShareConversation}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Fixed Application Header */}
        <div className="flex-shrink-0">
           <Header 
             title="Chat AI"
             subtitle="Intelligent AI Assistant"
             onClearChat={hasMessages ? handleClearChat : null}
             onShareChat={hasMessages ? handleShareChat : null}
             onShowAuth={handleShowAuth}
             onShowProfile={handleShowProfile}
             chatStats={chatStats}
           />
         </div>
      
      {/* Error Display */}
      {error && (
        <div className="flex-shrink-0 bg-red-50 border-l-4 border-red-400 p-4 mx-4">
          <div className="flex items-center justify-between">
            <div className="flex">
              <div className="flex-shrink-0">
                {/* Error icon */}
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600 transition-colors"
              aria-label="Dismiss error"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages}
          isTyping={isTyping}
          className="h-full"
        />
      </div>
      
      {/* Fixed Message Input */}
      <div className="flex-shrink-0">
        <MessageInput 
          onSendMessage={handleSendMessage}
          disabled={isProcessing}
          placeholder={isProcessing ? "AI is thinking..." : "Type your message here..."}
        />
      </div>
      
        {/* Fixed Footer with app info */}
        <div className="flex-shrink-0">
          <footer className="bg-white border-t border-gray-200 py-2 px-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-xs text-gray-500 text-center">
                Chat IA - Assistant IA | 
                Messages: {chatStats.totalMessages} | 
                Conversations: {conversations.length}
                {isAuthenticated && user && ` | Welcome, ${user.name}`}
              </p>
            </div>
          </footer>
        </div>
      </div>
      
      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <AuthForm onClose={handleCloseModals} />
          </div>
        </div>
      )}
      
      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <UserProfile onClose={handleCloseModals} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
