-- ==============================================================================
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
-- 6. Seed Plans
INSERT INTO plans (id, name, duration_months, base_price, discount_amount, tag, features) VALUES
('plan_monthly', 'Monthly Fitness Plan', 1, 1500, 0, 'Flexible', '["General Gym Access","Locker Facility","Floor Trainer Guidance","Steam Bath (1x/mo)"]'::jsonb),
('plan_quarterly', 'Quarterly Power Plan', 3, 4000, 300, 'Most Popular', '["Full Gym Access","Free Diet Consultation","Locker & Shower","Cardio + Strength Zones"]'::jsonb),
('plan_half_yearly', 'Half-Yearly Transformation', 6, 7500, 800, 'Recommended', '["All Hours Access","2 Free PT Sessions","Free Body Composition Scan","Dedicated Trainer Follow-up"]'::jsonb),
('plan_yearly', 'Yearly Iron Warrior Plan', 12, 12000, 2000, 'Best Value', '["Unlimited Gym Access","4 Free PT Sessions","Free Gym Kit & Shaker","Pause Membership up to 30 days","Free Diet Chart Updates"]'::jsonb);

-- 7. Seed Add-ons
INSERT INTO add_ons (id, type, name, price, validity_days, stock, trainer_name, description, category_label, is_available) VALUES
('addon_pt_12', 'pt', 'Personal Training (12 Sessions)', 3000, 45, 99, 'Coach Riyaz', '1-on-1 personalized form correction, progressive overload programming, and weekly strength monitoring.', 'Personal Training', true),
('addon_pt_pooja', 'pt', 'HIIT & Fat Loss PT (12 Sessions)', 3200, 45, 99, 'Trainer', 'High-intensity functional conditioning, mobility work, and endurance training.', 'Personal Training', true),
('addon_pt_rakesh', 'pt', 'Bodybuilding & Hypertrophy PT', 3500, 45, 0, 'Trainer', 'Advanced hypertrophy splits, target isolation, and stage posing prep.', 'Personal Training', false),
('addon_diet_weight_loss', 'diet', 'Weight-Loss Diet Plan', 999, 30, 999, 'Coach Riyaz', 'Custom calorie-deficit plan tailored to North Karnataka diet: Jolada Rotti, Sprouts, Dal, and High-Protein options.', 'Nutrition & Diet', true),
('addon_diet_muscle_gain', 'diet', 'Muscle Gain Diet Plan', 1199, 30, 999, 'Coach Riyaz', 'High-protein surplus meal programming, timing protocols, and micronutrient balancing for hypertrophy.', 'Nutrition & Diet', true),
('addon_diet_keto', 'diet', 'Custom Keto Transformation', 1499, 30, 999, 'Coach Riyaz', 'Therapeutic ketogenic plan: high healthy fats, moderate protein, under 25g net carbs per day.', 'Nutrition & Diet', true),
('addon_whey_gold', 'supplement', '100% Whey Protein Isolate 1kg (Chocolate)', 2499, 365, 12, NULL, 'Ultra-filtered whey protein isolate providing 27g pure protein per scoop. Labdoor certified.', 'Supplements', true),
('addon_creatine', 'supplement', 'Creatine Monohydrate 250g', 999, 365, 8, NULL, '100% micronized creatine monohydrate for ATP regeneration and raw strength output.', 'Supplements', true),
('addon_bcaa', 'supplement', 'BCAA Recovery Fuel 300g (Watermelon)', 1499, 365, 0, NULL, '2:1:1 branched-chain amino acids for intra-workout hydration.', 'Supplements', false);

-- 8. Seed Users (Owner Riyaz, 3 Coaches & 1 Member: Rahul Desai)
INSERT INTO users (id, role, phone, name, profile_image, marketing_opt_in, emergency_contact, comm_preference, assigned_trainer, active_diet_plan, created_at) VALUES
('user_owner_riyaz', 'owner', '9902667407', 'Riyaz (Gym Owner)', NULL, TRUE, '9902667407', 'whatsapp', NULL, NULL, '2025-01-01'),
('user_trainer_vikram', 'trainer', '9845011111', 'Vikram (Coach - Strength)', NULL, TRUE, '9902667407', 'whatsapp', NULL, NULL, '2025-01-05'),
('user_trainer_pooja', 'trainer', '9845022222', 'Pooja (Coach - HIIT/Diet)', NULL, TRUE, '9902667407', 'whatsapp', NULL, NULL, '2025-01-05'),
('user_trainer_rakesh', 'trainer', '9845033333', 'Rakesh (Coach - Hypertrophy)', NULL, TRUE, '9902667407', 'call', NULL, NULL, '2025-01-05'),
('member_rahul_desai', 'member', '9743247790', 'Rahul Desai', NULL, TRUE, '9902667407', 'whatsapp', 'Vikram', 'Muscle Gain Diet Plan', '2025-02-15')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role;

-- 9. Seed Active Membership for Rahul Desai
INSERT INTO memberships (id, user_id, plan_id, start_date, expiry_date, status) VALUES
('mem_rahul', 'member_rahul_desai', 'plan_yearly', CURRENT_DATE - INTERVAL '10 months', CURRENT_DATE + INTERVAL '2 months', 'active')
ON CONFLICT (id) DO NOTHING;

-- 10. Seed Streak for Rahul Desai
INSERT INTO streaks (id, user_id, current_streak, highest_streak, last_update, weekly_goal_target, weekly_goal_completed) VALUES
('streak_rahul', 'member_rahul_desai', 14, 28, CURRENT_DATE, 5, 4)
ON CONFLICT (id) DO NOTHING;

-- Done! Only Rahul Desai as member + Owner & Coaches configured.
