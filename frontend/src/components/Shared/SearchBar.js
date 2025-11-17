import React, { useState } from 'react';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search for products...", 
  loading = false,
  className = "" 
}) => {
  const [query, setQuery] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  // Clear search query
  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={`search-bar ${className}`} style={{ width: '100%' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              outline: 'none'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
          />
          
          {/* Clear button (X) - appears when there's text */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                position: 'absolute',
                left: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                color: '#999'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Search button */}
        <button
          type="submit"
          disabled={loading || !query.trim()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !query.trim() ? 0.6 : 1,
            fontSize: '1rem'
          }}
        >
          {loading ? '...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;