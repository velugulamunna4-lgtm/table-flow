import { createBrowserClient } from '@supabase/ssr';

let browserClient: any = null;

export function getSupabaseBrowserClient(): any {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  browserClient = createBrowserClient<any>(url, anonKey);
  return browserClient;
}

export const createClient = getSupabaseBrowserClient;
