export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      careers: {
        Row: {
          id: string;
          name: string;
          faculty: string;
          code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          faculty: string;
          code: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          faculty?: string;
          code?: string;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
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
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          career_id?: string | null;
          enrollment_year?: number | null;
          bio?: string | null;
          contact_phone?: string | null;
          contact_instagram?: string | null;
          reputation_score?: number;
          is_verified?: boolean;
          is_freshman?: boolean;
          role?: 'student' | 'moderator' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          career_id?: string | null;
          enrollment_year?: number | null;
          bio?: string | null;
          contact_phone?: string | null;
          contact_instagram?: string | null;
          reputation_score?: number;
          is_verified?: boolean;
          is_freshman?: boolean;
          role?: 'student' | 'moderator' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      rentals: {
        Row: {
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
          type: 'apartment' | 'room' | 'shared';
          price: number;
          currency: 'ARS' | 'USD';
          location: string;
          neighborhood: string;
          amenities: string[];
          available_from: string | null;
          allows_pets: boolean;
          gender_preference: 'any' | 'male' | 'female';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          description: string;
          image_urls?: string[];
          status?: 'active' | 'paused' | 'closed' | 'removed';
          is_pinned?: boolean;
          view_count?: number;
          favorite_count?: number;
          report_count?: number;
          type: 'apartment' | 'room' | 'shared';
          price: number;
          currency?: 'ARS' | 'USD';
          location: string;
          neighborhood: string;
          amenities?: string[];
          available_from?: string | null;
          allows_pets?: boolean;
          gender_preference?: 'any' | 'male' | 'female';
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['rentals']['Insert']>;
      };
      marketplace_items: {
        Row: {
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
          category: 'notes' | 'electronics' | 'furniture' | 'books' | 'bikes' | 'other';
          price: number | null;
          condition: 'new' | 'like_new' | 'good' | 'fair';
          is_free: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          description: string;
          image_urls?: string[];
          status?: 'active' | 'paused' | 'closed' | 'removed';
          is_pinned?: boolean;
          view_count?: number;
          favorite_count?: number;
          report_count?: number;
          category: 'notes' | 'electronics' | 'furniture' | 'books' | 'bikes' | 'other';
          price?: number | null;
          condition: 'new' | 'like_new' | 'good' | 'fair';
          is_free?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['marketplace_items']['Insert']>;
      };
      forum_posts: {
        Row: {
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
          category: 'question' | 'review' | 'recommendation' | 'discussion';
          tags: string[];
          upvotes: number;
          downvotes: number;
          comment_count: number;
          is_answered: boolean;
          related_career_id: string | null;
          related_course: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          description: string;
          image_urls?: string[];
          status?: 'active' | 'paused' | 'closed' | 'removed';
          is_pinned?: boolean;
          view_count?: number;
          favorite_count?: number;
          report_count?: number;
          category: 'question' | 'review' | 'recommendation' | 'discussion';
          tags?: string[];
          upvotes?: number;
          downvotes?: number;
          comment_count?: number;
          is_answered?: boolean;
          related_career_id?: string | null;
          related_course?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['forum_posts']['Insert']>;
      };
      events: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          description: string;
          image_urls?: string[];
          status?: 'active' | 'paused' | 'closed' | 'removed';
          is_pinned?: boolean;
          event_type: 'hackathon' | 'talk' | 'workshop' | 'tournament' | 'social' | 'academic';
          start_date: string;
          end_date?: string | null;
          location: string;
          is_virtual?: boolean;
          virtual_link?: string | null;
          max_attendees?: number | null;
          current_attendees?: number;
          registration_required?: boolean;
          organizer: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      lost_found_items: {
        Row: {
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
          item_type: 'lost' | 'found';
          location_found: string;
          date_found: string;
          category: 'electronics' | 'documents' | 'clothing' | 'keys' | 'other';
          is_resolved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          description: string;
          image_urls?: string[];
          item_type: 'lost' | 'found';
          location_found: string;
          date_found: string;
          category: 'electronics' | 'documents' | 'clothing' | 'keys' | 'other';
          is_resolved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['lost_found_items']['Insert']>;
      };
      services: {
        Row: {
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
          service_type: 'design' | 'programming' | 'photography' | 'tutoring' | 'writing' | 'other';
          price_range: string | null;
          availability: string | null;
          portfolio_urls: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          description: string;
          image_urls?: string[];
          service_type: 'design' | 'programming' | 'photography' | 'tutoring' | 'writing' | 'other';
          price_range?: string | null;
          availability?: string | null;
          portfolio_urls?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['services']['Insert']>;
      };
      tutoring_listings: {
        Row: {
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
          subject: string;
          career_id: string | null;
          modality: 'in_person' | 'virtual' | 'both';
          price_per_hour: number | null;
          experience: string | null;
          schedule_availability: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          description: string;
          image_urls?: string[];
          subject: string;
          career_id?: string | null;
          modality: 'in_person' | 'virtual' | 'both';
          price_per_hour?: number | null;
          experience?: string | null;
          schedule_availability?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['tutoring_listings']['Insert']>;
      };
      announcements: {
        Row: {
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
          priority: 'normal' | 'important' | 'urgent';
          expires_at: string | null;
          target_careers: string[];
          source: 'student_center' | 'faculty' | 'community';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          description: string;
          image_urls?: string[];
          priority?: 'normal' | 'important' | 'urgent';
          expires_at?: string | null;
          target_careers?: string[];
          source: 'student_center' | 'faculty' | 'community';
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['announcements']['Insert']>;
      };
      comments: {
        Row: {
          id: string;
          author_id: string;
          target_type: string;
          target_id: string;
          parent_id: string | null;
          content: string;
          upvotes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          target_type: string;
          target_id: string;
          parent_id?: string | null;
          content: string;
          upvotes?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['comments']['Insert']>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          target_type: string;
          target_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_type: string;
          target_id: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>;
      };
      reports: {
        Row: {
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
        };
        Insert: {
          id?: string;
          reporter_id: string;
          target_type: 'listing' | 'comment' | 'user';
          target_id: string;
          reason: 'spam' | 'inappropriate' | 'scam' | 'harassment' | 'other';
          description?: string | null;
          status?: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
          moderator_id?: string | null;
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
      };
      votes: {
        Row: {
          id: string;
          user_id: string;
          target_type: 'post' | 'comment';
          target_id: string;
          vote_type: 'up' | 'down';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_type: 'post' | 'comment';
          target_id: string;
          vote_type: 'up' | 'down';
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['votes']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          link: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          link?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      communities: {
        Row: {
          id: string;
          career_id: string;
          name: string;
          description: string | null;
          member_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          career_id: string;
          name: string;
          description?: string | null;
          member_count?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['communities']['Insert']>;
      };
      community_members: {
        Row: {
          id: string;
          community_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: Partial<Database['public']['Tables']['community_members']['Insert']>;
      };
      calendar_events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          event_date: string;
          end_date: string | null;
          event_type: 'exam' | 'enrollment' | 'holiday' | 'deadline' | 'other';
          career_ids: string[];
          is_global: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          event_date: string;
          end_date?: string | null;
          event_type: 'exam' | 'enrollment' | 'holiday' | 'deadline' | 'other';
          career_ids?: string[];
          is_global?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['calendar_events']['Insert']>;
      };
      freshman_guides: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: 'procedures' | 'tips' | 'faq' | 'guide' | 'campus';
          order_index: number;
          career_id: string | null;
          author_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          category: 'procedures' | 'tips' | 'faq' | 'guide' | 'campus';
          order_index?: number;
          career_id?: string | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['freshman_guides']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
