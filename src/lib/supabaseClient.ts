import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xbidzbisccuingzaunvv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiaWR6YmlzY2N1aW5nemF1bnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NDc1NTksImV4cCI6MjA5MTEyMzU1OX0.xh4f0-SbfDAymMvcIOWfeHPV_sWyl6XKLydmKBbUIG8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
