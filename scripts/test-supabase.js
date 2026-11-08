const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lxskywepjkroblkjitod.supabase.co';
const supabaseKey = 'sb_publishable_TJHNCCr76taYp2zBGSaafw_AdhblkJn';
const client = createClient(supabaseUrl, supabaseKey);

const tables = [
  'users',
  'plans',
  'memberships',
  'attendance',
  'streaks',
  'no_show_cases',
  'follow_ups',
  'payments',
  'renewal_orders',
  'add_ons',
  'add_on_orders',
  'notifications',
  'settings',
  'audit_logs'
];

async function runCheck() {
  console.log('--- SUPABASE LIVE INTEGRATION TEST ---');
  let successCount = 0;
  let failCount = 0;

  for (const table of tables) {
    try {
      const { data, error } = await client.from(table).select('*');
      if (error) {
        console.log(`[FAIL] ${table}: ${error.code} - ${error.message}`);
        failCount++;
      } else {
        console.log(`[PASS] ${table}: ${data.length} records retrieved successfully.`);
        successCount++;
      }
    } catch (err) {
      console.log(`[ERROR] ${table}: ${err.message}`);
      failCount++;
    }
  }

  console.log(`\nResults: ${successCount} passed, ${failCount} failed.`);

  if (failCount === 0) {
    console.log('\n--- TESTING WRITE PERMISSIONS (INSERT + DELETE) ---');
    const testId = `test_ping_${Date.now()}`;
    const insertRes = await client.from('notifications').insert({
      id: testId,
      user_id: 'user_owner_manjunath',
      message: 'System Ping Test',
      type: 'general',
      read_status: false
    });

    if (insertRes.error) {
      console.log('[FAIL] Write test:', insertRes.error.message);
    } else {
      console.log('[PASS] Write test: successfully inserted test notification.');
      const delRes = await client.from('notifications').delete().eq('id', testId);
      if (delRes.error) {
        console.log('[WARN] Clean-up delete test:', delRes.error.message);
      } else {
        console.log('[PASS] Clean-up test: successfully deleted test notification.');
      }
    }
  }
}

runCheck();

