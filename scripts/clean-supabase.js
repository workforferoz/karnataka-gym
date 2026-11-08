const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lxskywepjkroblkjitod.supabase.co';
const supabaseKey = 'sb_publishable_TJHNCCr76taYp2zBGSaafw_AdhblkJn';
const client = createClient(supabaseUrl, supabaseKey);

async function cleanLiveSupabase() {
  console.log('--- CLEANING LIVE SUPABASE DATABASE TO PRODUCTION STATE ---');

  // 1. Delete dependent tables (in order of foreign key dependency)
  const dependentTables = [
    'audit_logs',
    'notifications',
    'add_on_orders',
    'renewal_orders',
    'payments',
    'follow_ups',
    'no_show_cases',
    'streaks',
    'attendance',
    'memberships'
  ];

  for (const table of dependentTables) {
    // delete all rows where id is not null (deletes everything)
    const { error, count } = await client.from(table).delete().neq('id', '___non_existent___');
    if (error) {
      console.error(`Error deleting from ${table}:`, error.message);
    } else {
      console.log(`Cleaned table "${table}".`);
    }
  }

  // 2. Upsert Owner Riyaz first
  const ownerUser = {
    id: 'user_owner_riyaz',
    role: 'owner',
    phone: '9902667407',
    name: 'Riyaz (Gym Owner)',
    marketing_opt_in: true,
    emergency_contact: '9902667407',
    comm_preference: 'whatsapp',
    created_at: '2025-01-01'
  };

  const { error: ownerErr } = await client.from('users').upsert(ownerUser);
  if (ownerErr) {
    console.error('Error inserting Owner Riyaz:', ownerErr.message);
  } else {
    console.log('Successfully upserted Owner Riyaz (user_owner_riyaz, 9902667407).');
  }

  // 3. Delete all demo users (all users whose id is NOT user_owner_riyaz)
  const { error: userDelErr } = await client.from('users').delete().neq('id', 'user_owner_riyaz');
  if (userDelErr) {
    console.error('Error removing demo users:', userDelErr.message);
  } else {
    console.log('Successfully deleted all demo users from "users" table.');
  }

  // 4. Upsert settings
  const settingsData = {
    id: 'gym_default',
    no_show_threshold_days: 10,
    renewal_reminder_days: 7,
    duplicate_window_minutes: 5,
    gym_name: 'Karnataka Gym',
    gym_phone: '9902667407',
    gym_instagram: '@riyaz_gokul',
    gym_location: 'Kalidas Nagar, Hubballi, Karnataka 580031',
    gym_maps_url: 'https://maps.app.goo.gl/dXnSdvRU9gwHd7sAA'
  };
  const { error: setErr } = await client.from('settings').upsert(settingsData);
  if (setErr) {
    console.error('Error upserting settings:', setErr.message);
  } else {
    console.log('Successfully verified gym settings.');
  }

  console.log('\n--- CLEANUP COMPLETE ---');
}

cleanLiveSupabase();
