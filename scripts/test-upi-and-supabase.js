// End-to-end verification script for UPI QR code to feroznadaf13008@ybl and Supabase persistence
const { createClient } = require('@supabase/supabase-js');
const QRCode = require('qrcode');

const supabaseUrl = 'https://lxskywepjkroblkjitod.supabase.co';
const supabaseKey = 'sb_publishable_TJHNCCr76taYp2zBGSaafw_AdhblkJn';
const client = createClient(supabaseUrl, supabaseKey);

const EXPECTED_UPI_ID = 'feroznadaf13008@ybl';
const EXPECTED_PAYEE = 'Karnataka Gym Hubballi';

async function runVerification() {
  console.log('====================================================');
  console.log('   KARNATAKA GYM: UPI QR & SUPABASE PERSISTENCE TEST');
  console.log('====================================================\n');

  // TEST 1: QR Code Generation
  console.log('--- TEST 1: UPI URI & QR Code Generation ---');
  const testAmounts = [999, 2499, 4499, 7999];
  for (const amt of testAmounts) {
    const uri = `upi://pay?pa=${EXPECTED_UPI_ID}&pn=${encodeURIComponent(EXPECTED_PAYEE)}&am=${amt}&cu=INR&tn=${encodeURIComponent('Gym Fee')}`;
    const qrDataUrl = await QRCode.toDataURL(uri);
    if (!qrDataUrl.startsWith('data:image/png;base64,')) {
      throw new Error(`Failed to generate valid QR code for amount ₹${amt}`);
    }
    console.log(`[PASS] UPI QR generated for ₹${amt} -> Payee: ${EXPECTED_UPI_ID} (QR length: ${qrDataUrl.length} chars)`);
  }

  // TEST 2: Member Login Event Saved to Supabase
  console.log('\n--- TEST 2: Member Login Event Persistence in Supabase ---');
  const loginAuditId = `audit_login_test_${Date.now()}`;
  const loginAuditRecord = {
    id: loginAuditId,
    actor_id: 'member_rahul_desai',
    action: 'profile_override',
    target_user_id: 'member_rahul_desai',
    timestamp: new Date().toISOString(),
    reason: `Member login verified: Rahul Desai (+91 9743247790) via credentials`,
    details: {
      userId: 'member_rahul_desai',
      phone: '9743247790',
      email: 'rahul.desai@gmail.com',
      auth_provider: 'password',
      method: 'credentials',
      login_time: new Date().toISOString()
    }
  };

  const { error: loginError } = await client.from('audit_logs').insert(loginAuditRecord);
  if (loginError) {
    throw new Error(`Failed to save login event to Supabase audit_logs: ${loginError.message}`);
  }
  console.log(`[PASS] Member login record successfully saved to Supabase audit_logs! ID: ${loginAuditId}`);

  // Query back to verify persistence
  const { data: savedAudit, error: queryError } = await client
    .from('audit_logs')
    .select('*')
    .eq('id', loginAuditId)
    .single();

  if (queryError || !savedAudit) {
    throw new Error('Could not read back saved login audit record from Supabase!');
  }
  console.log(`[PASS] Readback verified: ${savedAudit.reason}`);

  // Clean test audit record
  await client.from('audit_logs').delete().eq('id', loginAuditId);

  // TEST 3: Payment Record Saved to Supabase with UPI details
  console.log('\n--- TEST 3: UPI Payment Persistence in Supabase ---');
  const paymentId = `pay_upi_test_${Date.now()}`;
  const paymentRecord = {
    id: paymentId,
    user_id: 'member_rahul_desai',
    amount: 2499,
    status: 'paid',
    transaction_id: `TXN_UPI_${Date.now()}_UTR990266`,
    plan_id: 'plan_quarterly',
    created_at: new Date().toISOString()
  };

  const { error: payError } = await client.from('payments').insert(paymentRecord);
  if (payError) {
    throw new Error(`Failed to save payment to Supabase: ${payError.message}`);
  }
  console.log(`[PASS] Payment record saved to Supabase payments table! TXN: ${paymentRecord.transaction_id}`);

  // Query back payment
  const { data: savedPay } = await client.from('payments').select('*').eq('id', paymentId).single();
  if (!savedPay || savedPay.amount !== 2499) {
    throw new Error('Payment record verification failed!');
  }
  console.log(`[PASS] Payment verified: ₹${savedPay.amount} (Status: ${savedPay.status})`);

  // Clean test payment record
  await client.from('payments').delete().eq('id', paymentId);

  // TEST 4: Full Member Signup Persistence in Supabase
  console.log('\n--- TEST 4: New Member Account Setup Persistence in Supabase ---');
  const newMemberId = `member_signup_test_${Date.now()}`;
  const newMemberPhone = '9012345678';
  const newMember = {
    id: newMemberId,
    role: 'member',
    phone: newMemberPhone,
    name: 'Suresh Patil',
    marketing_opt_in: true,
    comm_preference: 'whatsapp',
    emergency_contact: '9902667407',
    assigned_trainer: 'Vikram',
    active_diet_plan: 'General Health & Fitness',
    created_at: new Date().toISOString()
  };

  const newMem = {
    id: `mem_${newMemberId}`,
    user_id: newMemberId,
    plan_id: 'plan_quarterly',
    start_date: new Date().toISOString().split('T')[0],
    expiry_date: '2027-02-08',
    status: 'active'
  };

  const newStreak = {
    id: `streak_${newMemberId}`,
    user_id: newMemberId,
    current_streak: 1,
    highest_streak: 1,
    last_update: new Date().toISOString(),
    weekly_goal_target: 5,
    weekly_goal_completed: 1
  };

  const { error: uErr } = await client.from('users').insert(newMember);
  const { error: mErr } = await client.from('memberships').insert(newMem);
  const { error: sErr } = await client.from('streaks').insert(newStreak);

  if (uErr || mErr || sErr) {
    throw new Error(`Failed to save new member setup: ${uErr?.message || mErr?.message || sErr?.message}`);
  }
  console.log(`[PASS] New member "${newMember.name}" saved across users, memberships & streaks!`);

  // Cleanup test user
  await client.from('streaks').delete().eq('id', newStreak.id);
  await client.from('memberships').delete().eq('id', newMem.id);
  await client.from('users').delete().eq('id', newMemberId);
  console.log('[PASS] Test cleanup completed cleanly.');

  console.log('\n====================================================');
  console.log('   ALL TESTS COMPLETED SUCCESSFULLY WITH 0 ERRORS!   ');
  console.log('====================================================');
}

runVerification().catch((err) => {
  console.error('\n[FATAL ERROR]', err.message);
  process.exit(1);
});
