import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface AutocompleteProps {
  suggestions: string[];
  selectedItems: string[];
  onItemsChange: (items: string[]) => void;
  placeholder?: string;
}

export default function Autocomplete({
  suggestions,
  selectedItems,
  onItemsChange,
  placeholder = 'Escribe para buscar...'
}: AutocompleteProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = suggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(input.toLowerCase()) &&
        !selectedItems.includes(suggestion)
      );
    setFilteredSuggestions(filtered);
  }, [input, suggestions, selectedItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!selectedItems.includes(input.trim())) {
        onItemsChange([...selectedItems, input.trim()]);
      }
      setInput('');
      setShowSuggestions(false);
    }
  };

  const addItem = (item: string) => {
    if (!selectedItems.includes(item)) {
      onItemsChange([...selectedItems, item]);
    }
    setInput('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeItem = (itemToRemove: string) => {
    onItemsChange(selectedItems.filter(item => item !== itemToRemove));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedItems.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
          >
            {item}
            <button
              type="button"
              onClick={() => removeItem(item)}
              className="hover:text-purple-900"
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addItem(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-purple-50 text-gray-700 hover:text-purple-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}