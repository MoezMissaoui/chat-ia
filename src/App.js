/**
 * Main App Component - Chat IA Application
 * Follows Single Responsibility Principle by handling only app composition
 * Follows Open/Closed Principle by being extensible through component composition
 * Follows Dependency Inversion Principle by depending on abstractions (hooks, components)
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import './App.css';

/**
 * Main application component that sets up routing
 * @returns {JSX.Element} The main App component with routing
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        <Route path="/c/:conversationId" element={<ChatInterface />} />
      </Routes>
    </Router>
  );
}

export default App;
