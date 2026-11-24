import { NextRequest, NextResponse } from 'next/server';
import { generateTableToken } from '@/lib/qrToken';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/env';

export async function POST(
  request: NextRequest,
  { params }: { params: { tableId: string } }
) {
  try {
    const tableId = params.tableId;

    // Default expiry: 7 days from now
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const token = generateTableToken(tableId, expiresAt);

    // If Supabase is active, persist the token on the table row
    if (isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = getSupabaseAdminClient();
        await supabase
          .from('tables')
          .update({
            qr_token: token,
            token_expires_at: expiresAt.toISOString(),
          })
          .eq('table_number', parseInt(tableId, 10));
      } catch (err) {
        console.warn('[API /api/tables/[tableId]/token] Database update error:', err);
      }
    }

    return NextResponse.json({
      success: true,
      tableId,
      token,
      expiresAt: expiresAt.toISOString(),
      url: `/t/${tableId}?t=${encodeURIComponent(token)}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
