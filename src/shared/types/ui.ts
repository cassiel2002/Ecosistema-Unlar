import type { BaseListing } from './index';

// ============================================
// Shared UI Component Props
// ============================================

export interface ListingCardProps<T extends BaseListing> {
  listing: T;
  variant: 'compact' | 'full' | 'grid';
  onFavorite?: (id: string) => void;
  onReport?: (id: string) => void;
  isFavorited?: boolean;
  showAuthor?: boolean;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'range' | 'toggle' | 'search' | 'date';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

export interface FilterBarProps {
  filters: FilterConfig[];
  activeFilters: Record<string, unknown>;
  onFilterChange: (key: string, value: unknown) => void;
  onClear: () => void;
}

export interface InfiniteListProps<T> {
  queryKey: string[];
  queryFn: (page: number) => Promise<import('./index').PaginatedResponse<T>>;
  renderItem: (item: T) => React.ReactNode;
  emptyState?: React.ReactNode;
  skeleton?: React.ReactNode;
}

export interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  suggestions?: string[];
  debounceMs?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
}

export interface ToastConfig {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

export interface AvatarProps {
  src: string | null;
  name: string;
  size: 'xs' | 'sm' | 'md' | 'lg';
  showVerified?: boolean;
  isVerified?: boolean;
}

export interface ContactInfoProps {
  phone?: string | null;
  instagram?: string | null;
  email: string;
  showEmail?: boolean;
}

export interface ReputationBadgeProps {
  score: number;
  size?: 'sm' | 'md';
}
