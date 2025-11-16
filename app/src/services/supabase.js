import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan Anon Key Supabase project Anda
const supabaseUrl = 'https://ompxfzjfpobitsbafqnx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tcHhmempmcG9iaXRzYmFmcW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMDY5MjAsImV4cCI6MjA3ODg4MjkyMH0.0flSUkFWaNcZTne33NxGAuEJjvh5qVoaxRKm1-CGLo0';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Error: Supabase URL and Anon Key must be set in app/src/services/supabase.js'
  );
}

// Kita gunakan 'anon' key di frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});