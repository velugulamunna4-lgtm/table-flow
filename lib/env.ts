import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL').optional().or(z.literal('')),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required').optional().or(z.literal('')),
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL').default('http://localhost:3000'),
});

const serverEnvSchema = clientEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required').optional().or(z.literal('')),
  TABLE_QR_SECRET: z.string().min(8, 'TABLE_QR_SECRET must be at least 8 characters long').optional().or(z.literal('')),
  DEMO_STAFF_PASSWORD: z.string().optional().default('TableFlow@Demo2026'),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

let cachedServerEnv: ServerEnv | null = null;
let cachedClientEnv: ClientEnv | null = null;

export function getClientEnv(): ClientEnv {
  if (cachedClientEnv) return cachedClientEnv;

  const raw = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  };

  const parsed = clientEnvSchema.safeParse(raw);
  if (!parsed.success) {
    const errorDetails = parsed.error.issues
      .map((i) => ` - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    console.warn(`[TableFlow Env Warning] Client environment variable check:\n${errorDetails}`);
    return raw as ClientEnv;
  }

  cachedClientEnv = parsed.data;
  return cachedClientEnv;
}

export function getServerEnv(): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error('getServerEnv() cannot be called in client-side code. Use getClientEnv() instead.');
  }

  if (cachedServerEnv) return cachedServerEnv;

  const raw = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    TABLE_QR_SECRET: process.env.TABLE_QR_SECRET || 'tableflow-qr-super-secret-salt-key-2026',
    DEMO_STAFF_PASSWORD: process.env.DEMO_STAFF_PASSWORD || 'TableFlow@Demo2026',
  };

  const parsed = serverEnvSchema.safeParse(raw);
  if (!parsed.success) {
    const errorDetails = parsed.error.issues
      .map((i) => ` - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    const msg = `[TableFlow] Missing or Invalid Environment Configuration:\n${errorDetails}\nPlease verify your .env.local matches .env.example!`;
    console.error(msg);
    throw new Error(msg);
  }

  cachedServerEnv = parsed.data;
  return cachedServerEnv;
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && url.trim().length > 0 && anonKey && anonKey.trim().length > 0);
}

export const env = {
  get client() {
    return getClientEnv();
  },
  get server() {
    return getServerEnv();
  },
  isConfigured: isSupabaseConfigured,
};
