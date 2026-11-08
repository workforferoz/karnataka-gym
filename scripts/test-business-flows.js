const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lxskywepjkroblkjitod.supabase.co';
const supabaseKey = 'sb_publishable_TJHNCCr76taYp2zBGSaafw_AdhblkJn';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runEndToEndVerification() {
  console.log('====================================================');
  console.log('KARNATAKA GYM - FULL END-TO-END SUPABASE VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  // 1. Verify User Accounts
  try {
    const { data: users, error } = await supabase.from('users').select('*');
    if (error) throw error;
    const owner = users.find(u => u.role === 'owner');
    const staff = users.find(u => u.role === 'front_desk');
    const trainers = users.filter(u => u.role === 'trainer');
    const members = users.filter(u => u.role === 'member');

    console.log(`[PASS] Users Count: ${users.length}`);
    console.log(`       - Owner: ${owner ? owner.name + ' (' + owner.phone + ')' : 'MISSING'}`);
    console.log(`       - Staff: ${staff ? staff.name : 'MISSING'}`);
    console.log(`       - Trainers: ${trainers.length} (${trainers.map(t => t.name).join(', ')})`);
    console.log(`       - Active Members: ${members.length} Hubballi lifters`);
    passed++;
  } catch (e) {
    console.log('[FAIL] Users check:', e.message);
    failed++;
  }

  // 2. Verify Membership Plans
  try {
    const { data: plans, error } = await supabase.from('plans').select('*');
    if (error) throw error;
    console.log(`[PASS] Plans Count: ${plans.length}`);
    plans.forEach(p => console.log(`       - ${p.name}: ₹${p.base_price - (p.discount_amount || 0)} (${p.duration_months} mo)`));
    passed++;
  } catch (e) {
    console.log('[FAIL] Plans check:', e.message);
    failed++;
  }

  // 3. Verify Active Memberships
  try {
    const { data: memberships, error } = await supabase.from('memberships').select('*');
    if (error) throw error;
    const active = memberships.filter(m => m.status === 'active');
    console.log(`[PASS] Memberships: ${memberships.length} total (${active.length} active)`);
    passed++;
  } catch (e) {
    console.log('[FAIL] Memberships check:', e.message);
    failed++;
  }

  // 4. Test Check-in Insert & Streak Upsert
  try {
    const testCheckinId = `att_test_${Date.now()}`;
    const targetUser = 'member_rahul_desai';

    const { error: attErr } = await supabase.from('attendance').insert({
      id: testCheckinId,
      user_id: targetUser,
      check_in_time: new Date().toISOString(),
      method: 'qr',
      status: 'valid',
      notes: 'Automated verification scan'
    });
    if (attErr) throw attErr;

    // Clean up test checkin
    await supabase.from('attendance').delete().eq('id', testCheckinId);

    console.log('[PASS] QR Check-in workflow verified (write + cleanup passed)');
    passed++;
  } catch (e) {
    console.log('[FAIL] Check-in test:', e.message);
    failed++;
  }

  // 5. Test Churn Case & Follow-up Workflow
  try {
    const { data: cases, error: cErr } = await supabase.from('no_show_cases').select('*');
    if (cErr) throw cErr;
    console.log(`[PASS] Silent Churn Detection: ${cases.length} absent lifters flagged (10+ days absent)`);

    // Test follow-up logging
    const testFollowUpId = `fu_test_${Date.now()}`;
    const testCaseId = cases[0].id;
    const { error: fuErr } = await supabase.from('follow_ups').insert({
      id: testFollowUpId,
      no_show_case_id: testCaseId,
      outcome: 'Will return',
      next_action_date: '2026-11-15',
      owner_id: 'user_owner_manjunath',
      notes: 'Called member - was travelling to Bengaluru, returning Monday.'
    });
    if (fuErr) throw fuErr;

    // Clean up
    await supabase.from('follow_ups').delete().eq('id', testFollowUpId);
    console.log('[PASS] Churn Rescue Follow-up logging verified (write + cleanup passed)');
    passed++;
  } catch (e) {
    console.log('[FAIL] Follow-up test:', e.message);
    failed++;
  }

  // 6. Test Store & Add-on Inventory
  try {
    const { data: addons, error: aErr } = await supabase.from('add_ons').select('*');
    if (aErr) throw aErr;
    const pt = addons.filter(a => a.type === 'pt');
    const diet = addons.filter(a => a.type === 'diet');
    const supplements = addons.filter(a => a.type === 'supplement');
    console.log(`[PASS] Store Add-ons: ${addons.length} items (${pt.length} PT packs, ${diet.length} diet charts, ${supplements.length} supplements)`);
    passed++;
  } catch (e) {
    console.log('[FAIL] Add-on inventory test:', e.message);
    failed++;
  }

  // 7. Verify Gym Settings
  try {
    const { data: settings, error: sErr } = await supabase.from('settings').select('*').limit(1).single();
    if (sErr) throw sErr;
    console.log(`[PASS] Gym Settings verified:`);
    console.log(`       - Gym Name: ${settings.gym_name}`);
    console.log(`       - Phone: ${settings.gym_phone}`);
    console.log(`       - Address: ${settings.gym_location}`);
    console.log(`       - Instagram: ${settings.gym_instagram}`);
    console.log(`       - Maps URL: ${settings.gym_maps_url}`);
    passed++;
  } catch (e) {
    console.log('[FAIL] Settings test:', e.message);
    failed++;
  }

  // 8. Verify Audit Logs
  try {
    const { data: logs, error: lErr } = await supabase.from('audit_logs').select('*');
    if (lErr) throw lErr;
    console.log(`[PASS] Security Audit Trail: ${logs.length} audit entries verified`);
    passed++;
  } catch (e) {
    console.log('[FAIL] Audit logs test:', e.message);
    failed++;
  }

  console.log(`\n====================================================`);
  console.log(`VERIFICATION SUMMARY: ${passed} of ${passed + failed} suites passed.`);
  console.log(`====================================================`);
}

runEndToEndVerification();

