/**
 * DropdownMenu Component - Reusable dropdown menu with actions
 * Follows Single Responsibility Principle by handling only dropdown functionality
 * Follows Open/Closed Principle by being extensible through props
 */

import React, { useState, useRef, useEffect } from 'react';

/**
 * Dropdown menu component with customizable actions
 * @param {Object} props - Component properties
 * @param {Array} props.actions - Array of action objects with {label, icon, onClick, className}
 * @param {string} props.triggerIcon - SVG path for trigger button icon
 * @param {React.ReactNode} props.trigger - Custom trigger element (overrides triggerIcon)
 * @param {string} props.triggerClassName - CSS classes for trigger button
 * @param {string} props.menuClassName - CSS classes for dropdown menu
 * @param {string} props.position - Menu position ('left' | 'right')
 * @returns {JSX.Element} DropdownMenu component
 */
const DropdownMenu = ({
  actions = [],
  triggerIcon,
  trigger,
  triggerClassName = "p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200",
  menuClassName = "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50",
  position = 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  /**
   * Closes dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Toggles dropdown visibility
   */
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Handles action click
   * @param {Function} onClick - Action callback
   */
  const handleActionClick = (onClick) => {
    if (onClick) {
      onClick();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      {trigger ? (
        <div onClick={toggleDropdown}>
          {trigger}
        </div>
      ) : (
        <button
          onClick={toggleDropdown}
          className={triggerClassName}
          title="More actions"
        >
          {triggerIcon ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={triggerIcon} />
            </svg>
          ) : (
            // Default three dots icon
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
            </svg>
          )}
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`${menuClassName} ${position === 'left' ? 'left-0' : 'right-0'}`}>
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action.onClick)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3 ${
                action.className || 'text-gray-700 hover:text-gray-900'
              }`}
              disabled={action.disabled}
            >
              {action.icon && (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                </svg>
              )}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;