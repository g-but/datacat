'use client';

import React from 'react';

// Generic types for reusability
export interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface Filter {
  id: string;
  label: string;
  options: FilterOption[];
}

interface FilterControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  
  filters: Filter[];
  selectedFilters: Record<string, string>;
  onFilterChange: (filterId: string, value: string) => void;
  
  sortByOptions: FilterOption[];
  currentSortBy: string;
  onSortByChange: (value: string) => void;
  
  children?: React.ReactNode; // For additional controls like view mode toggle
}

export function FilterControls({
  searchTerm,
  onSearchChange,
  filters,
  selectedFilters,
  onFilterChange,
  sortByOptions,
  currentSortBy,
  onSortByChange,
  children
}: FilterControlsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-0 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
              type="search"
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
            {/* Dynamic Filters */}
            {filters.map(filter => (
                 <div key={filter.id} className="flex-shrink-0">
                    <label htmlFor={`filter-${filter.id}`} className="sr-only">{filter.label}</label>
                    <select
                        id={`filter-${filter.id}`}
                        value={selectedFilters[filter.id] || ''}
                        onChange={(e) => onFilterChange(filter.id, e.target.value)}
                         className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        {filter.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
            ))}

            {/* Sort By */}
            <div className="flex-shrink-0">
                <label htmlFor="sort-by" className="sr-only">Sortieren nach</label>
                <select
                    id="sort-by"
                    value={currentSortBy}
                    onChange={(e) => onSortByChange(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    {sortByOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>

            {/* Children for additional controls */}
            {children}
        </div>
      </div>
    </div>
  );
} 