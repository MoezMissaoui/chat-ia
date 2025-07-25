/**
 * Sidebar Component - Chat History and Navigation
 * Follows Single Responsibility Principle by handling only sidebar functionality
 * Follows Open/Closed Principle by being extensible through props
 * Follows Interface Segregation Principle by accepting only necessary props
 */

import React, { useState, useRef, useEffect } from 'react';

/**
 * Sidebar component for chat navigation and history
 * @param {Object} props - Component props
 * @param {Array} props.conversations - List of previous conversations
 * @param {string} props.currentConversationId - ID of current active conversation
 * @param {Function} props.onNewChat - Callback for creating new chat
 * @param {Function} props.onSelectConversation - Callback for selecting a conversation
 * @param {Function} props.onDeleteConversation - Callback for deleting a conversation
 * @param {Function} props.onRenameConversation - Callback for renaming a conversation
 * @param {Function} props.onShareConversation - Callback for sharing a conversation
 * @param {boolean} props.isCollapsed - Whether sidebar is collapsed
 * @param {Function} props.onToggleCollapse - Callback for toggling sidebar collapse
 * @returns {JSX.Element} The Sidebar component
 */
const Sidebar = ({
  conversations = [],
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onShareConversation,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [hoveredConversation, setHoveredConversation] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [renamingConversation, setRenamingConversation] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const dropdownRef = useRef(null);
  const renameInputRef = useRef(null);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus rename input when renaming starts
  useEffect(() => {
    if (renamingConversation && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingConversation]);

  /**
   * Handles conversation selection
   * @param {string} conversationId - ID of conversation to select
   */
  const handleSelectConversation = (conversationId) => {
    if (onSelectConversation) {
      onSelectConversation(conversationId);
    }
  };

  /**
   * Handles conversation deletion with confirmation
   * @param {string} conversationId - ID of conversation to delete
   * @param {Event} event - Click event
   */
  const handleDeleteConversation = (conversationId, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      if (onDeleteConversation) {
        onDeleteConversation(conversationId);
      }
    }
    setActiveDropdown(null);
  };

  /**
   * Handles starting rename process
   * @param {string} conversationId - ID of conversation to rename
   * @param {string} currentTitle - Current title of the conversation
   * @param {Event} event - Click event
   */
  const handleStartRename = (conversationId, currentTitle, event) => {
    event.stopPropagation();
    setRenamingConversation(conversationId);
    setRenameValue(currentTitle);
    setActiveDropdown(null);
  };

  /**
   * Handles completing rename process
   * @param {string} conversationId - ID of conversation to rename
   */
  const handleCompleteRename = (conversationId) => {
    if (renameValue.trim() && onRenameConversation) {
      onRenameConversation(conversationId, renameValue.trim());
    }
    setRenamingConversation(null);
    setRenameValue('');
  };

  /**
   * Handles canceling rename process
   */
  const handleCancelRename = () => {
    setRenamingConversation(null);
    setRenameValue('');
  };

  /**
   * Handles sharing conversation
   * @param {string} conversationId - ID of conversation to share
   * @param {Event} event - Click event
   */
  const handleShareConversation = (conversationId, event) => {
    event.stopPropagation();
    if (onShareConversation) {
      onShareConversation(conversationId);
    }
    setActiveDropdown(null);
  };

  /**
   * Handles toggling dropdown menu
   * @param {string} conversationId - ID of conversation
   * @param {Event} event - Click event
   */
  const handleToggleDropdown = (conversationId, event) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === conversationId ? null : conversationId);
  };

  /**
   * Handles key press in rename input
   * @param {Event} event - Keyboard event
   * @param {string} conversationId - ID of conversation being renamed
   */
  const handleRenameKeyPress = (event, conversationId) => {
    if (event.key === 'Enter') {
      handleCompleteRename(conversationId);
    } else if (event.key === 'Escape') {
      handleCancelRename();
    }
  };

  /**
   * Truncates conversation title for display
   * @param {string} title - Original title
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated title
   */
  const truncateTitle = (title, maxLength = 30) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 flex flex-col ${
      isCollapsed ? 'w-12' : 'w-64'
    }`}>
      {/* Sidebar Header */}
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold">Chat AI</h2>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className={`${isCollapsed ? 'p-2' : 'p-3'}`}>
        <button
          onClick={onNewChat}
          className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg ${
            isCollapsed 
              ? 'p-2.5 aspect-square' 
              : 'py-2.5 px-4'
          }`}
          title="New conversation"
        >
          {isCollapsed ? (
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium text-sm">New conversation</span>
            </div>
          )}
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Recent conversations</h3>
          </div>
        )}
        
        <div className="space-y-1 px-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`group relative rounded-lg cursor-pointer transition-colors ${
                conversation.id === currentConversationId
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-700'
              } ${
                isCollapsed ? 'p-2' : 'p-3'
              }`}
              onClick={() => handleSelectConversation(conversation.id)}
              onMouseEnter={() => setHoveredConversation(conversation.id)}
              onMouseLeave={() => setHoveredConversation(null)}
              title={isCollapsed ? conversation.title : ''}
            >
              {isCollapsed ? (
                <div className="flex justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        {renamingConversation === conversation.id ? (
                          <input
                            ref={renameInputRef}
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => handleRenameKeyPress(e, conversation.id)}
                            onBlur={() => handleCompleteRename(conversation.id)}
                            className="w-full bg-gray-800 text-white text-sm px-2 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <>
                            <p className="text-sm font-medium truncate">
                              {truncateTitle(conversation.title)}
                            </p>
                            {/* <p className="text-xs text-gray-400 truncate">
                              {conversation.lastMessage}
                            </p> */}
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions dropdown - always reserve space */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={(e) => handleToggleDropdown(conversation.id, e)}
                        className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        title="More actions"
                        style={{ visibility: renamingConversation === conversation.id ? 'hidden' : 'visible' }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zM13 12a1 1 0 11-2 0 1 1 0 012 0zM20 12a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                      </button>
                        
                      {/* Dropdown menu */}
                      {activeDropdown === conversation.id && (
                        <div className="absolute right-0 top-8 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
                          <div className="py-1">
                            <button
                              onClick={(e) => handleStartRename(conversation.id, conversation.title, e)}
                              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Rename</span>
                            </button>
                            <button
                              onClick={(e) => handleShareConversation(conversation.id, e)}
                              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                              </svg>
                              <span>Share</span>
                            </button>
                            <button
                              onClick={(e) => handleDeleteConversation(conversation.id, e)}
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Empty state */}
        {conversations.length === 0 && !isCollapsed && (
          <div className="px-3 py-8 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-400 text-sm">No conversations</p>
            <p className="text-gray-500 text-xs mt-1">Start a new conversation</p>
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-gray-700">
          <div className="text-xs text-gray-400 text-center">
            <p>Chat AI v1.0</p>
            <p>Intelligent AI Assistant</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;