// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://oadlrsyjemgrrkkmdvlw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZGxyc3lqZW1ncnJra21kdmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwODc5MTgsImV4cCI6MjA2MDY2MzkxOH0.b-2tiDba0KTxy6lQ8jf4nFMTaLgV5NOpdtZBzQ1bK0w";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);