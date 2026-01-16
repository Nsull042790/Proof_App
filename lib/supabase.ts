import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pdxiirbnkufeviowvwfl.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkeGlpcmJua3VmZXZpb3d2d2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MjAyOTUsImV4cCI6MjA4NDA5NjI5NX0.8lBVSxS3ys1xKx6rP5-ERFrsCC9w3yqVZT530Tfht5I';

// Create Supabase client without strict types for flexibility
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper to check if we're connected to Supabase
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && supabaseUrl !== '';
};
