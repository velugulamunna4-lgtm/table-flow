import 'server-only';
import { createClient } from '@supabase/supabase-js';

let adminClient: any = null;

export function getSupabaseAdminClient(): any {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

  adminClient = createClient<any>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}

export const createAdminClient = getSupabaseAdminClient;
