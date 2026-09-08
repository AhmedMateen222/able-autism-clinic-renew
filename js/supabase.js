import { createClient } from '@supabase/supabase-js';

/**
 * Retrieves the Supabase project URL and publishable (anon) key.
 * Only the public publishable anon key is ever used on the frontend.
 * Secret / service_role keys MUST NEVER be used here.
 */
export function getSupabaseCredentials() {
  const url =
    (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_PUBLIC_SUPABASE_URL)) ||
    (typeof window !== 'undefined' && (window.__SUPABASE_URL__ || window.VITE_SUPABASE_URL || window.SUPABASE_URL)) ||
    '';

  const anonKey =
    (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY)) ||
    (typeof window !== 'undefined' && (window.__SUPABASE_ANON_KEY__ || window.VITE_SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY || window.SUPABASE_PUBLISHABLE_KEY)) ||
    '';

  return {
    url: typeof url === 'string' ? url.trim() : '',
    anonKey: typeof anonKey === 'string' ? anonKey.trim() : ''
  };
}

let supabaseClient = null;

/**
 * Lazily initializes and returns the Supabase JavaScript client instance.
 * Returns null if the URL or Publishable Anon Key is not yet configured.
 */
export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const { url, anonKey } = getSupabaseCredentials();

  if (!url || !anonKey) {
    return null;
  }

  supabaseClient = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return supabaseClient;
}

/**
 * Saves appointment form data to the 'appointments' table in Supabase.
 * Strictly maps the required fields:
 * - parent_name
 * - child_name
 * - child_age
 * - phone
 * - email
 * - service_interest
 * - preferred_schedule
 * - diagnosis_status
 * - additional_notes
 */
export async function submitAppointment(formData) {
  const client = getSupabaseClient();
  if (!client) {
    const { url, anonKey } = getSupabaseCredentials();
    if (!url && !anonKey) {
      throw new Error(
        'Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
      );
    }
    if (!url) {
      throw new Error('Supabase Project URL is missing. Please set VITE_SUPABASE_URL in your environment.');
    }
    if (!anonKey) {
      throw new Error('Supabase Publishable Key is missing. Please set VITE_SUPABASE_ANON_KEY in your environment.');
    }
    throw new Error('Failed to initialize Supabase client.');
  }

  const { data, error } = await client
    .from('appointments')
    .insert([formData]);

  if (error) {
    throw error;
  }

  return data;
}
