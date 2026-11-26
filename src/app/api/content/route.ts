import { NextResponse } from 'next/server';
import { getSiteContent } from '@/lib/content-store';

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json(content, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (err) {
    console.error('[api/content] Error retrieving content:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve website content.' },
      { status: 500 }
    );
  }
}
