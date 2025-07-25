/**
 * Main App Component - Chat IA Application
 * Follows Single Responsibility Principle by handling only app composition
 * Follows Open/Closed Principle by being extensible through component composition
 * Follows Dependency Inversion Principle by depending on abstractions (hooks, components)
 */

import React from 'react';
import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import useChat from './hooks/useChat';
import './App.css';

/**
 * Main application component that orchestrates the chat interface
 * Follows composition over inheritance principle
 * @returns {JSX.Element} The main App component
 */
function App() {
  // Use custom hook for chat functionality
  // This follows Dependency Inversion Principle by depending on abstraction
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
  } = useChat();

  /**
   * Handles message sending from the input component
   * @param {string} messageText - The message text to send
   */
  const handleSendMessage = async (messageText) => {
    await sendMessage(messageText);
  };

  /**
   * Handles clearing the chat conversation
   */
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      clearMessages();
    }
  };

  // Get current chat statistics
  const chatStats = getChatStats();

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Fixed Application Header */}
      <div className="flex-shrink-0">
        <Header 
          title="Chat IA"
          subtitle="AI Assistant"
          onClearChat={hasMessages ? handleClearChat : null}
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
              Chat IA - AI Assistant | 
              Messages: {chatStats.totalMessages} | 
              Powered by React & Tailwind CSS
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
