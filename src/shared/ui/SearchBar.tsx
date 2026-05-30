import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import type { SearchBarProps } from '@/shared/types/ui';

export function SearchBar({
  placeholder = 'Buscar...',
  value,
  onChange,
  onSubmit,
  suggestions = [],
  debounceMs = 300,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedOnChange = useCallback(
    (newValue: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        onChange(newValue);
      }, debounceMs);
    },
    [onChange, debounceMs]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      onChange(localValue);
      onSubmit?.();
      setShowSuggestions(false);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalValue(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (localValue.length > 0 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className="min-h-[44px] w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-10 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          aria-label={placeholder}
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              role="option"
              aria-selected={false}
              onClick={() => handleSuggestionClick(suggestion)}
              className="min-h-[44px] flex cursor-pointer items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Search className="mr-2 h-4 w-4 text-gray-400" aria-hidden="true" />
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
