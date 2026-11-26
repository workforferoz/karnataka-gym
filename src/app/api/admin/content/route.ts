import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { getSiteContent, saveSiteContent, resetSiteContentToDefaults } from '@/lib/content-store';
import { SiteContent } from '@/data/default-content';

export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  try {
    const body: SiteContent = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid content payload.' }, { status: 400 });
    }

    const saved = await saveSiteContent(body);
    return NextResponse.json({
      success: true,
      message: 'Website content updated successfully.',
      content: saved,
    });
  } catch (err) {
    console.error('[api/admin/content] Error saving content:', err);
    return NextResponse.json(
      { error: 'Failed to save website content.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  try {
    const reset = await resetSiteContentToDefaults();
    return NextResponse.json({
      success: true,
      message: 'Content reset to factory defaults.',
      content: reset,
    });
  } catch (err) {
    console.error('[api/admin/content] Error resetting content:', err);
    return NextResponse.json(
      { error: 'Failed to reset content.' },
      { status: 500 }
    );
  }
}
