import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xbidzbisccuingzaunvv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_KUIdove7-VvIHlKhA7wVZw_CAtd06hQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
