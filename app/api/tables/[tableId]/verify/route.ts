import { NextRequest, NextResponse } from 'next/server';
import { verifyTableToken } from '@/lib/qrToken';

export async function GET(
  request: NextRequest,
  { params }: { params: { tableId: string } }
) {
  const tableId = params.tableId;
  const token = request.nextUrl.searchParams.get('t');

  // If TABLE_QR_SECRET is not configured or in development without tokens, allow demo access
  const hasSecret = Boolean(process.env.TABLE_QR_SECRET);
  if (!hasSecret && !token) {
    return NextResponse.json({ valid: true, demoMode: true });
  }

  // If a token is provided, verify it
  if (token) {
    const result = verifyTableToken(tableId, token);
    return NextResponse.json(result);
  }

  // If secret is set but token is missing
  return NextResponse.json({
    valid: false,
    reason: 'missing',
    message: 'This table code has expired. Please ask our staff for help.',
  });
}
