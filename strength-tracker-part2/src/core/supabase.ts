import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ksahoupgftrbijoxhahy.supabase.co';
const supabaseAnonKey = 'sb_publishable_YyZG7kHBwlZ4CQEoTyQfrw_ZckxzBeA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
