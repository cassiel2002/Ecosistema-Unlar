// ============================================
// Core Domain Types
// ============================================

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  career_id: string | null;
  enrollment_year: number | null;
  bio: string | null;
  contact_phone: string | null;
  contact_instagram: string | null;
  reputation_score: number;
  is_verified: boolean;
  is_freshman: boolean;
  role: 'student' | 'moderator' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Career {
  id: string;
  name: string;
  faculty: string;
  code: string;
}

export interface BaseListing {
  id: string;
  author_id: string;
  title: string;
  description: string;
  image_urls: string[];
  status: 'active' | 'paused' | 'closed' | 'removed';
  is_pinned: boolean;
  view_count: number;
  favorite_count: number;
  report_count: number;
  created_at: string;
  updated_at: string;
  author?: UserProfile;
}

export interface Rental extends BaseListing {
  type: 'apartment' | 'room' | 'shared';
  price: number;
  currency: 'ARS' | 'USD';
  location: string;
  neighborhood: string;
  amenities: string[];
  available_from: string | null;
  allows_pets: boolean;
  gender_preference: 'any' | 'male' | 'female';
}

export interface MarketplaceItem extends BaseListing {
  category: 'notes' | 'electronics' | 'furniture' | 'books' | 'bikes' | 'other';
  price: number | null;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  is_free: boolean;
}

export interface ForumPost extends BaseListing {
  category: 'question' | 'review' | 'recommendation' | 'discussion';
  tags: string[];
  upvotes: number;
  downvotes: number;
  comment_count: number;
  is_answered: boolean;
  related_career_id: string | null;
  related_course: string | null;
}

export interface Event extends BaseListing {
  event_type: 'hackathon' | 'talk' | 'workshop' | 'tournament' | 'social' | 'academic';
  start_date: string;
  end_date: string | null;
  location: string;
  is_virtual: boolean;
  virtual_link: string | null;
  max_attendees: number | null;
  current_attendees: number;
  registration_required: boolean;
  organizer: string;
}

export interface LostFoundItem extends BaseListing {
  item_type: 'lost' | 'found';
  location_found: string;
  date_found: string;
  category: 'electronics' | 'documents' | 'clothing' | 'keys' | 'other';
  is_resolved: boolean;
}

export interface Service extends BaseListing {
  service_type: 'design' | 'programming' | 'photography' | 'tutoring' | 'writing' | 'other';
  price_range: string | null;
  availability: string | null;
  portfolio_urls: string[];
}

export interface TutoringListing extends BaseListing {
  subject: string;
  career_id: string | null;
  modality: 'in_person' | 'virtual' | 'both';
  price_per_hour: number | null;
  experience: string | null;
  schedule_availability: string | null;
}

export interface Announcement extends BaseListing {
  priority: 'normal' | 'important' | 'urgent';
  expires_at: string | null;
  target_careers: string[];
  source: 'student_center' | 'faculty' | 'community';
}

export interface Comment {
  id: string;
  author_id: string;
  target_type: string;
  target_id: string;
  parent_id: string | null;
  content: string;
  upvotes: number;
  created_at: string;
  author?: UserProfile;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: 'listing' | 'comment' | 'user';
  target_id: string;
  reason: 'spam' | 'inappropriate' | 'scam' | 'harassment' | 'other';
  description: string | null;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  moderator_id: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface Favorite {
  id: string;
  user_id: string;
  target_type: string;
  target_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'comment' | 'reply' | 'favorite' | 'report_resolved' | 'announcement' | 'event_reminder';
  title: string;
  body: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface FeedItem extends BaseListing {
  module: 'rental' | 'marketplace' | 'forum' | 'event' | 'lost_found' | 'service' | 'tutoring' | 'announcement';
  priority?: 'normal' | 'important' | 'urgent';
  related_career_id?: string | null;
  comment_count?: number;
}

// ============================================
// Chat Domain Types
// ============================================

export interface Chat {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  updated_at: string;
  // Computed / Joined properties for frontend convenience
  other_user?: UserProfile;
  last_message?: Message;
  unread_count?: number;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}
