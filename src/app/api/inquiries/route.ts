import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/admin-auth';
import {
  addInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
  InquiryRecord,
} from '@/lib/content-store';
import { sanitizePhone, sanitizeString, checkRateLimit } from '@/lib/sanitize';

// Public: Submit Walkthrough Request
export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit('walkthrough_api', 5, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many inquiry submissions. Please wait before retrying.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, phone, goal, date, time } = body || {};

    const cleanName = sanitizeString(name);
    const { sanitized: cleanPhone, isValid } = sanitizePhone(phone);

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json({ error: 'Please enter a valid full name.' }, { status: 400 });
    }

    if (!isValid || cleanPhone.length < 10) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 });
    }

    const newRecord = await addInquiry({
      name: cleanName,
      phone: cleanPhone,
      goal: sanitizeString(goal) || 'General Fitness',
      date: sanitizeString(date) || new Date().toISOString().split('T')[0],
      time: sanitizeString(time) || '06:30 PM - 08:00 PM',
    });

    return NextResponse.json({
      success: true,
      message: 'Walkthrough request received.',
      inquiryId: newRecord.id,
    });
  } catch (err) {
    console.error('[api/inquiries] Error saving inquiry:', err);
    return NextResponse.json({ error: 'Failed to record inquiry.' }, { status: 500 });
  }
}

// Protected: Admin list all inquiries
export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const list = await getInquiries();
  return NextResponse.json({ inquiries: list });
}

// Protected: Admin update status
export async function PATCH(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status.' }, { status: 400 });
    }

    const success = await updateInquiryStatus(id, status as InquiryRecord['status']);
    return NextResponse.json({ success });
  } catch (err) {
    console.error('[api/inquiries] Error updating inquiry:', err);
    return NextResponse.json({ error: 'Failed to update inquiry.' }, { status: 500 });
  }
}

// Protected: Admin delete inquiry
export async function DELETE(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
    }

    const success = await deleteInquiry(id);
    return NextResponse.json({ success });
  } catch (err) {
    console.error('[api/inquiries] Error deleting inquiry:', err);
    return NextResponse.json({ error: 'Failed to delete inquiry.' }, { status: 500 });
  }
}
