import { X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import type { FilterBarProps, FilterConfig } from '@/shared/types/ui';
import { Button } from './Button';

function FilterSelect({
  filter,
  value,
  onChange,
}: {
  filter: FilterConfig;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
}) {
  return (
    <select
      value={(value as string) ?? ''}
      onChange={(e) => onChange(filter.key, e.target.value || null)}
      className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      aria-label={filter.label}
    >
      <option value="">{filter.label}</option>
      {filter.options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function FilterRange({
  filter,
  value,
  onChange,
}: {
  filter: FilterConfig;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
}) {
  const rangeValue = (value as { min?: number; max?: number }) ?? {};

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        placeholder={`Min ${filter.label}`}
        min={filter.min}
        max={filter.max}
        value={rangeValue.min ?? ''}
        onChange={(e) =>
          onChange(filter.key, {
            ...rangeValue,
            min: e.target.value ? Number(e.target.value) : undefined,
          })
        }
        className="min-h-[44px] w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        aria-label={`${filter.label} mínimo`}
      />
      <span className="text-gray-400">-</span>
      <input
        type="number"
        placeholder={`Max ${filter.label}`}
        min={filter.min}
        max={filter.max}
        value={rangeValue.max ?? ''}
        onChange={(e) =>
          onChange(filter.key, {
            ...rangeValue,
            max: e.target.value ? Number(e.target.value) : undefined,
          })
        }
        className="min-h-[44px] w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        aria-label={`${filter.label} máximo`}
      />
    </div>
  );
}

function FilterToggle({
  filter,
  value,
  onChange,
}: {
  filter: FilterConfig;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
}) {
  const isActive = !!value;

  return (
    <button
      onClick={() => onChange(filter.key, !isActive)}
      className={`
        min-h-[44px] rounded-lg border px-3 py-2 text-sm font-medium transition-colors
        ${
          isActive
            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
        }
      `}
      aria-pressed={isActive}
      aria-label={filter.label}
    >
      {filter.label}
    </button>
  );
}

function FilterSearch({
  filter,
  value,
  onChange,
}: {
  filter: FilterConfig;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
}) {
  return (
    <input
      type="text"
      placeholder={filter.label}
      value={(value as string) ?? ''}
      onChange={(e) => onChange(filter.key, e.target.value || null)}
      className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      aria-label={filter.label}
    />
  );
}

function FilterDate({
  filter,
  value,
  onChange,
}: {
  filter: FilterConfig;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
}) {
  return (
    <input
      type="date"
      value={(value as string) ?? ''}
      onChange={(e) => onChange(filter.key, e.target.value || null)}
      className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      aria-label={filter.label}
    />
  );
}

export function FilterBar({ filters, activeFilters, onFilterChange, onClear }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeCount = Object.values(activeFilters).filter(
    (v) => v !== null && v !== undefined && v !== '' && v !== false
  ).length;

  const renderFilter = (filter: FilterConfig) => {
    const value = activeFilters[filter.key];

    switch (filter.type) {
      case 'select':
        return <FilterSelect key={filter.key} filter={filter} value={value} onChange={onFilterChange} />;
      case 'range':
        return <FilterRange key={filter.key} filter={filter} value={value} onChange={onFilterChange} />;
      case 'toggle':
        return <FilterToggle key={filter.key} filter={filter} value={value} onChange={onFilterChange} />;
      case 'search':
        return <FilterSearch key={filter.key} filter={filter} value={value} onChange={onFilterChange} />;
      case 'date':
        return <FilterDate key={filter.key} filter={filter} value={value} onChange={onFilterChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {/* Mobile toggle */}
      <div className="flex items-center gap-2 md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          leftIcon={<SlidersHorizontal className="h-4 w-4" />}
        >
          Filtros
          {activeCount > 0 && (
            <span className="ml-1 rounded-full bg-primary-500 px-1.5 py-0.5 text-xs text-white">
              {activeCount}
            </span>
          )}
        </Button>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="h-4 w-4" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Filter controls */}
      <div
        className={`
          flex-wrap items-center gap-2
          ${isExpanded ? 'flex' : 'hidden md:flex'}
        `}
      >
        {filters.map(renderFilter)}
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="hidden md:inline-flex"
            leftIcon={<X className="h-4 w-4" />}
          >
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
