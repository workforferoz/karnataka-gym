const fs = require('fs');
const path = require('path');

// Require compiled data-seed.js
const seed = require('./compiled/lib/data-seed.js');
console.log('Successfully loaded seed data:');
console.log('Users:', seed.INITIAL_USERS.length);
console.log('Plans:', seed.INITIAL_PLANS.length);
console.log('Memberships:', seed.INITIAL_MEMBERSHIPS.length);
console.log('Attendance:', seed.INITIAL_ATTENDANCE.length);
console.log('Streaks:', seed.INITIAL_STREAKS.length);
console.log('No-show cases:', seed.INITIAL_NO_SHOW_CASES.length);
console.log('Add-ons:', seed.INITIAL_ADDONS.length);

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

let sql = `-- ==============================================================================
-- KARNATAKA GYM (HUBBALLI) - SUPABASE FULL PRODUCTION SETUP
-- Project: https://lxskywepjkroblkjitod.supabase.co
-- Generated on: 2026-11-08
-- Includes: All Tables, RLS Policies, 34 Users, Plans, Memberships, Attendance & Streaks
-- ==============================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if needed (in reverse dependency order)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS add_on_orders CASCADE;
DROP TABLE IF EXISTS add_ons CASCADE;
DROP TABLE IF EXISTS renewal_orders CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS follow_ups CASCADE;
DROP TABLE IF EXISTS no_show_cases CASCADE;
DROP TABLE IF EXISTS streaks CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- 3. Create Tables
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    role VARCHAR(20) NOT NULL CHECK (role IN ('member', 'owner', 'front_desk', 'trainer')),
    phone VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    profile_image TEXT,
    marketing_opt_in BOOLEAN DEFAULT TRUE,
    emergency_contact VARCHAR(20),
    comm_preference VARCHAR(20) DEFAULT 'whatsapp' CHECK (comm_preference IN ('whatsapp', 'sms', 'call')),
    assigned_trainer VARCHAR(100),
    active_diet_plan VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE plans (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    duration_months INT NOT NULL CHECK (duration_months > 0),
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    tag VARCHAR(50),
    features JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE memberships (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES plans(id),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'cancelled', 'expired')),
    freeze_reason TEXT,
    frozen_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE attendance (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    method VARCHAR(20) NOT NULL CHECK (method IN ('qr', 'assisted')),
    status VARCHAR(20) NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'duplicate', 'rejected')),
    notes TEXT,
    synced_from_offline BOOLEAN DEFAULT FALSE
);

CREATE TABLE streaks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_streak INT DEFAULT 0 CHECK (current_streak >= 0),
    highest_streak INT DEFAULT 0 CHECK (highest_streak >= 0),
    last_update DATE DEFAULT CURRENT_DATE,
    weekly_goal_target INT DEFAULT 5,
    weekly_goal_completed INT DEFAULT 0
);

CREATE TABLE no_show_cases (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    days_absent INT NOT NULL CHECK (days_absent >= 10),
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
    resolved_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE follow_ups (
    id TEXT PRIMARY KEY,
    no_show_case_id TEXT NOT NULL REFERENCES no_show_cases(id) ON DELETE CASCADE,
    outcome VARCHAR(50) NOT NULL CHECK (outcome IN ('Will return', 'Injured', 'Travelling', 'Timing issue', 'Unhappy', 'No response', 'Cancelled')),
    next_action_date DATE,
    owner_id TEXT NOT NULL REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE payments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'pending', 'paid', 'failed', 'refunded', 'reversed')),
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    plan_id TEXT REFERENCES plans(id),
    addon_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    refunded_at TIMESTAMP WITH TIME ZONE,
    gateway VARCHAR(50) DEFAULT 'razorpay'
);

CREATE TABLE renewal_orders (
    id TEXT PRIMARY KEY,
    payment_id TEXT NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    membership_id TEXT NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES plans(id),
    extended_months INT NOT NULL CHECK (extended_months > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE add_ons (
    id TEXT PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('pt', 'diet', 'supplement')),
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    validity_days INT NOT NULL DEFAULT 30,
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    trainer_name VARCHAR(100),
    description TEXT,
    category_label VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE add_on_orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addon_id TEXT NOT NULL REFERENCES add_ons(id),
    payment_id TEXT REFERENCES payments(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    trainer_name VARCHAR(100),
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date DATE NOT NULL
);

CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('renewal', 'streak', 'promo', 'alert', 'general')),
    read_status BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE settings (
    id TEXT PRIMARY KEY DEFAULT 'gym_default',
    no_show_threshold_days INT DEFAULT 10,
    renewal_reminder_days INT DEFAULT 7,
    duplicate_window_minutes INT DEFAULT 5,
    gym_name VARCHAR(100) DEFAULT 'Karnataka Gym',
    gym_phone VARCHAR(20) DEFAULT '9902667407',
    gym_instagram VARCHAR(50) DEFAULT '@riyaz_gokul',
    gym_location VARCHAR(100) DEFAULT 'Kalidas Nagar, Hubballi, Karnataka 580031',
    gym_maps_url TEXT DEFAULT 'https://maps.app.goo.gl/dXnSdvRU9gwHd7sAA'
);

CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    actor_id TEXT NOT NULL,
    action VARCHAR(50) NOT NULL,
    target_user_id TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reason TEXT NOT NULL,
    details JSONB
);

-- 4. Enable Row Level Security (RLS) & Grant Access for anon/authenticated
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE no_show_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE renewal_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE add_on_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow anon and authenticated full read/write for retention app
CREATE POLICY "Public read/write users" ON users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write plans" ON plans FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write memberships" ON memberships FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write attendance" ON attendance FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write streaks" ON streaks FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write no_show_cases" ON no_show_cases FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write follow_ups" ON follow_ups FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write payments" ON payments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write renewal_orders" ON renewal_orders FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write add_ons" ON add_ons FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write add_on_orders" ON add_on_orders FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write notifications" ON notifications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write settings" ON settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write audit_logs" ON audit_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 5. Seed Settings
INSERT INTO settings (id, no_show_threshold_days, renewal_reminder_days, duplicate_window_minutes, gym_name, gym_phone, gym_instagram, gym_location, gym_maps_url)
VALUES ('gym_default', 10, 7, 5, 'Karnataka Gym', '9902667407', '@riyaz_gokul', 'Kalidas Nagar, Hubballi, Karnataka 580031', 'https://maps.app.goo.gl/dXnSdvRU9gwHd7sAA')
ON CONFLICT (id) DO NOTHING;
`;

if (seed.INITIAL_PLANS && seed.INITIAL_PLANS.length > 0) {
  sql += `-- 6. Seed Plans\nINSERT INTO plans (id, name, duration_months, base_price, discount_amount, tag, features) VALUES\n`;
  sql += seed.INITIAL_PLANS.map(p => 
    `(${esc(p.id)}, ${esc(p.name)}, ${p.duration_months}, ${p.base_price}, ${p.discount_amount || 0}, ${esc(p.tag)}, ${esc(p.features)})`
  ).join(',\n') + ';\n\n';
}

if (seed.INITIAL_ADDONS && seed.INITIAL_ADDONS.length > 0) {
  sql += `-- 7. Seed Add-ons\nINSERT INTO add_ons (id, type, name, price, validity_days, stock, trainer_name, description, category_label, is_available) VALUES\n`;
  sql += seed.INITIAL_ADDONS.map(a =>
    `(${esc(a.id)}, ${esc(a.type)}, ${esc(a.name)}, ${a.price}, ${a.validity_days || 30}, ${a.stock || 0}, ${esc(a.trainer_name)}, ${esc(a.description)}, ${esc(a.category_label)}, ${a.is_available !== false})`
  ).join(',\n') + ';\n\n';
}

if (seed.INITIAL_USERS && seed.INITIAL_USERS.length > 0) {
  sql += `-- 8. Seed Users (Owner Riyaz)\nINSERT INTO users (id, role, phone, name, profile_image, marketing_opt_in, emergency_contact, comm_preference, assigned_trainer, active_diet_plan, created_at) VALUES\n`;
  sql += seed.INITIAL_USERS.map(u =>
    `(${esc(u.id)}, ${esc(u.role)}, ${esc(u.phone)}, ${esc(u.name)}, ${esc(u.profile_image)}, ${esc(u.marketing_opt_in)}, ${esc(u.emergency_contact)}, ${esc(u.comm_preference)}, ${esc(u.assigned_trainer)}, ${esc(u.active_diet_plan)}, ${esc(u.created_at || '2025-01-01')})`
  ).join(',\n') + ';\n\n';
}

if (seed.INITIAL_MEMBERSHIPS && seed.INITIAL_MEMBERSHIPS.length > 0) {
  sql += `-- 9. Seed Memberships\nINSERT INTO memberships (id, user_id, plan_id, start_date, expiry_date, status, freeze_reason, frozen_at) VALUES\n`;
  sql += seed.INITIAL_MEMBERSHIPS.map(m =>
    `(${esc(m.id)}, ${esc(m.user_id)}, ${esc(m.plan_id)}, ${esc(m.start_date)}, ${esc(m.expiry_date)}, ${esc(m.status)}, ${esc(m.freeze_reason)}, ${esc(m.frozen_at)})`
  ).join(',\n') + ';\n\n';
}

if (seed.INITIAL_ATTENDANCE && seed.INITIAL_ATTENDANCE.length > 0) {
  sql += `-- 10. Seed Attendance\nINSERT INTO attendance (id, user_id, check_in_time, method, status, notes, synced_from_offline) VALUES\n`;
  sql += seed.INITIAL_ATTENDANCE.map(a =>
    `(${esc(a.id)}, ${esc(a.user_id)}, ${esc(a.check_in_time)}, ${esc(a.method)}, ${esc(a.status)}, ${esc(a.notes)}, ${esc(a.synced_from_offline)})`
  ).join(',\n') + ';\n\n';
}

if (seed.INITIAL_STREAKS && seed.INITIAL_STREAKS.length > 0) {
  sql += `-- 11. Seed Streaks\nINSERT INTO streaks (id, user_id, current_streak, highest_streak, last_update, weekly_goal_target, weekly_goal_completed) VALUES\n`;
  sql += seed.INITIAL_STREAKS.map(s =>
    `(${esc(s.id)}, ${esc(s.user_id)}, ${s.current_streak}, ${s.highest_streak}, ${esc(s.last_update)}, ${s.weekly_goal_target}, ${s.weekly_goal_completed})`
  ).join(',\n') + ';\n\n';
}

if (seed.INITIAL_NO_SHOW_CASES && seed.INITIAL_NO_SHOW_CASES.length > 0) {
  sql += `-- 12. Seed No-Show Cases (Silent Churn)\nINSERT INTO no_show_cases (id, user_id, days_absent, status, resolved_reason, created_at, resolved_at) VALUES\n`;
  sql += seed.INITIAL_NO_SHOW_CASES.map(n =>
    `(${esc(n.id)}, ${esc(n.user_id)}, ${n.days_absent}, ${esc(n.status)}, ${esc(n.resolved_reason)}, ${esc(n.created_at)}, ${esc(n.resolved_at)})`
  ).join(',\n') + ';\n\n';
}

if (seed.INITIAL_FOLLOW_UPS && seed.INITIAL_FOLLOW_UPS.length > 0) {
  sql += `-- 13. Seed Follow-Ups\nINSERT INTO follow_ups (id, no_show_case_id, outcome, next_action_date, owner_id, notes, created_at) VALUES\n`;
  sql += seed.INITIAL_FOLLOW_UPS.map(f =>
    `(${esc(f.id)}, ${esc(f.no_show_case_id)}, ${esc(f.outcome)}, ${esc(f.next_action_date)}, ${esc(f.owner_id)}, ${esc(f.notes)}, ${esc(f.created_at)})`
  ).join(',\n') + ';\n\n';
}

if (seed.INITIAL_PAYMENTS && seed.INITIAL_PAYMENTS.length > 0) {
  sql += `-- 14. Seed Payments\nINSERT INTO payments (id, user_id, amount, status, transaction_id, plan_id, addon_id, created_at, refunded_at, gateway) VALUES\n`;
  sql += seed.INITIAL_PAYMENTS.map(p =>
    `(${esc(p.id)}, ${esc(p.user_id)}, ${p.amount}, ${esc(p.status)}, ${esc(p.transaction_id)}, ${esc(p.plan_id)}, ${esc(p.addon_id)}, ${esc(p.created_at)}, ${esc(p.refunded_at)}, ${esc(p.gateway)})`
  ).join(',\n') + ';\n\n';
}

if (seed.INITIAL_ADDON_ORDERS && seed.INITIAL_ADDON_ORDERS.length > 0) {
  sql += `-- 15. Seed Add-on Orders\nINSERT INTO add_on_orders (id, user_id, addon_id, payment_id, status, trainer_name, purchased_at, expiry_date) VALUES\n`;
  sql += seed.INITIAL_ADDON_ORDERS.map(o =>
    `(${esc(o.id)}, ${esc(o.user_id)}, ${esc(o.addon_id)}, ${esc(o.payment_id)}, ${esc(o.status)}, ${esc(o.trainer_name)}, ${esc(o.purchased_at)}, ${esc(o.expiry_date)})`
  ).join(',\n') + ';\n\n';
}

if (seed.INITIAL_NOTIFICATIONS && seed.INITIAL_NOTIFICATIONS.length > 0) {
  sql += `-- 16. Seed Notifications\nINSERT INTO notifications (id, user_id, message, type, read_status, action_url, created_at) VALUES\n`;
  sql += seed.INITIAL_NOTIFICATIONS.map(n =>
    `(${esc(n.id)}, ${esc(n.user_id)}, ${esc(n.message)}, ${esc(n.type)}, ${esc(n.read_status)}, ${esc(n.action_url)}, ${esc(n.created_at)})`
  ).join(',\n') + ';\n\n';
}

if (seed.INITIAL_AUDIT_LOGS && seed.INITIAL_AUDIT_LOGS.length > 0) {
  sql += `-- 17. Seed Audit Logs\nINSERT INTO audit_logs (id, actor_id, action, target_user_id, timestamp, reason, details) VALUES\n`;
  sql += seed.INITIAL_AUDIT_LOGS.map(a =>
    `(${esc(a.id)}, ${esc(a.actor_id)}, ${esc(a.action)}, ${esc(a.target_user_id)}, ${esc(a.timestamp)}, ${esc(a.reason)}, ${esc(a.details)})`
  ).join(',\n') + ';\n\n';
}

sql += `-- Done! 34 Users, Plans, Memberships, Attendance, Streaks & Settings ready in Supabase.\n`;

fs.writeFileSync(path.join(__dirname, '../supabase-setup.sql'), sql);
console.log('Successfully generated supabase-setup.sql with complete schema and seed data!');
