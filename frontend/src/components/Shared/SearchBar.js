import React, { useState } from 'react';
import './SearchBar.css'; // Import CSS file

// SEARCH BAR COMPONENT - Reusable search input with suggestions
const SearchBar = ({ 
  onSearch,                    // Callback function when search is submitted
  placeholder = "Search for products...", // Input placeholder text
  loading = false,             // Loading state for search operation
  className = "",              // Additional CSS classes
  size = "medium",             // Size variant (small, medium, large)
  showIcon = true,             // Whether to show search icon
  suggestions = [],            // Array of search suggestions
  onSuggestionSelect           // Callback when suggestion is selected
}) => {
  // STATE MANAGEMENT - Search input and UI state
  const [query, setQuery] = useState('');              // Current search query
  const [showSuggestions, setShowSuggestions] = useState(false); // Suggestions visibility

  // SEARCH SUBMISSION HANDLER - Process search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  // SEARCH CLEAR HANDLER - Reset search query and results
  const handleClear = () => {
    setQuery('');
    onSearch('');
    setShowSuggestions(false);
  };

  // INPUT CHANGE HANDLER - Update query and show suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0);
  };

  // SUGGESTION SELECTION HANDLER - Apply selected suggestion
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };

  // KEYBOARD NAVIGATION HANDLER - Accessibility support
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // MAIN COMPONENT RENDER - Search bar interface
  return (
    <div className={`search-bar search-bar-${size} ${className}`}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          {/* SEARCH ICON - Visual indicator for search input */}
          {showIcon && (
            <span className="search-icon" aria-hidden="true">
              Search
            </span>
          )}
          
          {/* SEARCH INPUT - Main text input field */}
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="search-input"
            aria-label="Search"
            role="searchbox"
          />
          
          {/* CLEAR BUTTON - Reset search query */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-button"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
          
          {/* SEARCH SUGGESTIONS - Dropdown with search suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions" role="listbox">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSuggestionClick(suggestion)}
                  role="option"
                  tabIndex={0}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEARCH BUTTON - Submit search form */}
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className={`search-button ${loading ? 'search-button-loading' : ''}`}
          aria-label={loading ? "Searching..." : "Search"}
        >
          {loading ? '' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;