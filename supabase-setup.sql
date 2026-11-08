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
('addon_pt_12', 'pt', 'Personal Training (12 Sessions)', 3000, 45, 99, 'Vikram', '1-on-1 personalized form correction, progressive overload programming, and weekly strength monitoring.', 'Personal Training', true),
('addon_pt_pooja', 'pt', 'HIIT & Fat Loss PT (12 Sessions)', 3200, 45, 99, 'Pooja', 'High-intensity functional conditioning, mobility work, and endurance training with Coach Pooja.', 'Personal Training', true),
('addon_pt_rakesh', 'pt', 'Bodybuilding & Hypertrophy PT', 3500, 45, 0, 'Rakesh', 'Advanced hypertrophy splits, target isolation, and stage posing prep. Currently fully booked.', 'Personal Training', false),
('addon_diet_weight_loss', 'diet', 'Weight-Loss Diet Plan', 999, 30, 999, 'Pooja', 'Custom calorie-deficit plan tailored to North Karnataka diet: Jolada Rotti, Sprouts, Dal, and High-Protein options.', 'Nutrition & Diet', true),
('addon_diet_muscle_gain', 'diet', 'Muscle Gain Diet Plan', 1199, 30, 999, 'Vikram', 'Macro-calculated clean surplus nutrition with local affordable whole food sources + supplement timing.', 'Nutrition & Diet', true),
('addon_diet_veg_protein', 'diet', 'Veg High-Protein Nutrition Guide', 899, 30, 999, 'Pooja', '100% Vegetarian 120g+ daily protein meal charts with paneer, soy, lentils, and dairy.', 'Nutrition & Diet', true),
('addon_whey_protein', 'supplement', 'Whey Protein 1kg (Chocolate Fudge)', 2500, 365, 5, NULL, 'Lab-tested 24g pure whey concentrate per scoop with digestive enzymes. Available for counter pickup.', 'Supplements', true),
('addon_creatine', 'supplement', 'Creatine Monohydrate 250g', 999, 365, 8, NULL, '100% micronized creatine monohydrate for ATP regeneration and raw strength output.', 'Supplements', true),
('addon_bcaa', 'supplement', 'BCAA Recovery Fuel 300g (Watermelon)', 1499, 365, 0, NULL, '2:1:1 branched-chain amino acids for intra-workout hydration. (Stock 0: Out of Stock)', 'Supplements', false);

-- 8. Seed Users (34 Total: Owner, Staff, 3 Trainers, 30 Hubballi Members)
INSERT INTO users (id, role, phone, name, profile_image, marketing_opt_in, emergency_contact, comm_preference, assigned_trainer, active_diet_plan, created_at) VALUES
('user_owner_manjunath', 'owner', '9902667407', 'Manjunath (Gym Owner)', NULL, TRUE, '9902667407', 'whatsapp', NULL, NULL, '2025-01-01'),
('user_staff_suresh', 'front_desk', '9888877777', 'Suresh (Front Desk)', NULL, TRUE, '9902667407', 'call', NULL, NULL, '2025-01-10'),
('user_trainer_vikram', 'trainer', '9845011111', 'Vikram (Coach - Strength)', NULL, TRUE, '9902667407', 'whatsapp', NULL, NULL, '2025-01-05'),
('user_trainer_pooja', 'trainer', '9845022222', 'Pooja (Coach - HIIT/Diet)', NULL, TRUE, '9902667407', 'whatsapp', NULL, NULL, '2025-01-05'),
('user_trainer_rakesh', 'trainer', '9845033333', 'Rakesh (Coach - Hypertrophy)', NULL, TRUE, '9902667407', 'call', NULL, NULL, '2025-01-05'),
('member_rahul_desai', 'member', '9876543210', 'Rahul Desai', '', TRUE, '9902667407', 'whatsapp', 'Vikram', 'Muscle Gain Diet Plan', '2025-02-15'),
('member_priya_patil', 'member', '9845112233', 'Priya Patil', NULL, TRUE, '9845112200', 'whatsapp', 'Pooja', 'Weight-Loss Diet Plan', '2025-03-01'),
('member_rohan_kulkarni', 'member', '9845223344', 'Rohan Kulkarni', NULL, TRUE, '9845223300', 'call', 'Vikram', NULL, '2025-02-20'),
('member_sneha_joshi', 'member', '9845334455', 'Sneha Joshi', NULL, FALSE, '9845334400', 'whatsapp', 'Pooja', 'Veg High-Protein Nutrition Guide', '2025-02-10'),
('member_manoj_nayak', 'member', '9845445566', 'Manoj Nayak', NULL, TRUE, '9845445500', 'sms', 'Rakesh', NULL, '2025-01-25'),
('member_amit_sharma', 'member', '9845556677', 'Amit Sharma', NULL, TRUE, '9845556600', 'whatsapp', 'Vikram', NULL, '2025-02-01'),
('member_prakash_hubli', 'member', '9740110001', 'Prakash Hubli', NULL, TRUE, '9740110099', 'whatsapp', 'Vikram', NULL, '2025-01-10'),
('member_sunita_rao', 'member', '9740110002', 'Sunita Rao', NULL, TRUE, '9740110098', 'call', 'Pooja', NULL, '2025-01-12'),
('member_vinod_angadi', 'member', '9740110003', 'Vinod Angadi', NULL, TRUE, '9740110097', 'whatsapp', 'Rakesh', NULL, '2025-01-15'),
('member_ramesh_pujari', 'member', '9740110004', 'Ramesh Pujari', NULL, TRUE, '9740110096', 'sms', 'Vikram', NULL, '2025-01-18'),
('member_deepak_hiremath', 'member', '9740110005', 'Deepak Hiremath', NULL, TRUE, '9740110095', 'whatsapp', 'Rakesh', NULL, '2025-01-20'),
('member_kavya_hegde', 'member', '9740110006', 'Kavya Hegde', NULL, TRUE, '9740110094', 'whatsapp', 'Pooja', NULL, '2025-01-22'),
('m13', 'member', '9740220013', 'Anand Shettar', NULL, TRUE, NULL, 'whatsapp', 'Vikram', NULL, '2025-03-10'),
('m14', 'member', '9740220014', 'Sachin Patil', NULL, TRUE, NULL, 'whatsapp', 'Vikram', NULL, '2025-03-05'),
('m15', 'member', '9740220015', 'Vijay Kumar Badiger', NULL, TRUE, NULL, 'call', 'Rakesh', NULL, '2025-03-08'),
('m16', 'member', '9740220016', 'Naveen Gouda', NULL, TRUE, NULL, 'whatsapp', 'Vikram', NULL, '2025-03-12'),
('m17', 'member', '9740220017', 'Shilpa Dharwadkar', NULL, TRUE, NULL, 'sms', 'Pooja', NULL, '2025-03-14'),
('m18', 'member', '9740220018', 'Basavaraj Bommai', NULL, TRUE, NULL, 'whatsapp', 'Rakesh', NULL, '2025-03-15'),
('m19', 'member', '9740220019', 'Santosh Havaldar', NULL, TRUE, NULL, 'call', 'Vikram', NULL, '2025-03-16'),
('m20', 'member', '9740220020', 'Megha Belagavi', NULL, TRUE, NULL, 'whatsapp', 'Pooja', NULL, '2025-03-18'),
('m21', 'member', '9740220021', 'Girish Koppal', NULL, TRUE, NULL, 'whatsapp', 'Vikram', NULL, '2025-03-20'),
('m22', 'member', '9740220022', 'Arun Koliwad', NULL, TRUE, NULL, 'whatsapp', 'Rakesh', NULL, '2025-03-22'),
('m23', 'member', '9740220023', 'Geeta Mudhol', NULL, TRUE, NULL, 'call', 'Pooja', NULL, '2025-03-25'),
('m24', 'member', '9740220024', 'Jagadish Kundagol', NULL, TRUE, NULL, 'whatsapp', 'Vikram', NULL, '2025-03-26'),
('m25', 'member', '9740220025', 'Laxmi Navalgund', NULL, TRUE, NULL, 'whatsapp', 'Pooja', NULL, '2025-03-28'),
('m26', 'member', '9740220026', 'Mahesh Byahatti', NULL, TRUE, NULL, 'sms', 'Rakesh', NULL, '2025-03-29'),
('m27', 'member', '9740220027', 'Kiran Kalghatgi', NULL, TRUE, NULL, 'whatsapp', 'Vikram', NULL, '2025-04-01'),
('m28', 'member', '9740220028', 'Rekha Shirahatti', NULL, TRUE, NULL, 'call', 'Pooja', NULL, '2025-04-02'),
('m29', 'member', '9740220029', 'Chetan Gokak', NULL, TRUE, NULL, 'whatsapp', 'Rakesh', NULL, '2025-04-03'),
('m30', 'member', '9740220030', 'Sowmya Ron', NULL, TRUE, NULL, 'whatsapp', 'Pooja', NULL, '2025-04-04');

-- 9. Seed Memberships
INSERT INTO memberships (id, user_id, plan_id, start_date, expiry_date, status, freeze_reason, frozen_at) VALUES
('mem_rahul', 'member_rahul_desai', 'plan_yearly', '2025-12-23', '2026-12-23', 'active', NULL, NULL),
('mem_priya', 'member_priya_patil', 'plan_quarterly', '2026-08-14', '2026-11-12', 'active', NULL, NULL),
('mem_rohan', 'member_rohan_kulkarni', 'plan_monthly', '2026-10-13', '2026-11-12', 'active', NULL, NULL),
('mem_sneha', 'member_sneha_joshi', 'plan_half_yearly', '2026-05-16', '2026-11-12', 'active', NULL, NULL),
('mem_manoj', 'member_manoj_nayak', 'plan_quarterly', '2026-08-14', '2026-11-12', 'active', NULL, NULL),
('mem_amit', 'member_amit_sharma', 'plan_monthly', '2026-10-13', '2026-11-12', 'active', NULL, NULL),
('mem_prakash', 'member_prakash_hubli', 'plan_quarterly', '2026-09-09', '2026-12-08', 'active', NULL, NULL),
('mem_sunita', 'member_sunita_rao', 'plan_half_yearly', '2026-07-31', '2027-01-27', 'active', NULL, NULL),
('mem_vinod', 'member_vinod_angadi', 'plan_yearly', '2026-04-22', '2027-04-22', 'active', NULL, NULL),
('mem_ramesh', 'member_ramesh_pujari', 'plan_quarterly', '2026-09-19', '2026-12-18', 'active', NULL, NULL),
('mem_deepak', 'member_deepak_hiremath', 'plan_monthly', '2026-10-19', '2026-11-18', 'active', NULL, NULL),
('mem_kavya', 'member_kavya_hegde', 'plan_half_yearly', '2026-08-10', '2027-02-06', 'active', NULL, NULL),
('mem_m13', 'm13', 'plan_quarterly', '2026-09-29', '2026-12-28', 'active', NULL, NULL),
('mem_m14', 'm14', 'plan_half_yearly', '2026-09-29', '2027-01-02', 'active', NULL, NULL),
('mem_m15', 'm15', 'plan_quarterly', '2026-09-29', '2027-01-07', 'active', NULL, NULL),
('mem_m16', 'm16', 'plan_half_yearly', '2026-09-29', '2027-01-12', 'active', NULL, NULL),
('mem_m17', 'm17', 'plan_quarterly', '2026-09-29', '2027-01-17', 'active', NULL, NULL),
('mem_m18', 'm18', 'plan_half_yearly', '2026-09-29', '2027-01-22', 'active', NULL, NULL),
('mem_m19', 'm19', 'plan_quarterly', '2026-09-29', '2027-01-27', 'active', NULL, NULL),
('mem_m20', 'm20', 'plan_half_yearly', '2026-09-29', '2027-02-01', 'active', NULL, NULL),
('mem_m21', 'm21', 'plan_quarterly', '2026-09-29', '2027-02-06', 'active', NULL, NULL),
('mem_m22', 'm22', 'plan_half_yearly', '2026-09-29', '2027-02-11', 'active', NULL, NULL),
('mem_m23', 'm23', 'plan_quarterly', '2026-09-29', '2027-02-16', 'active', NULL, NULL),
('mem_m24', 'm24', 'plan_half_yearly', '2026-09-29', '2027-02-21', 'active', NULL, NULL),
('mem_m25', 'm25', 'plan_quarterly', '2026-09-29', '2027-02-26', 'active', NULL, NULL),
('mem_m26', 'm26', 'plan_half_yearly', '2026-09-29', '2027-03-03', 'active', NULL, NULL),
('mem_m27', 'm27', 'plan_quarterly', '2026-09-29', '2027-03-08', 'active', NULL, NULL),
('mem_m28', 'm28', 'plan_half_yearly', '2026-09-29', '2027-03-13', 'active', NULL, NULL),
('mem_m29', 'm29', 'plan_quarterly', '2026-09-29', '2027-03-18', 'active', NULL, NULL),
('mem_m30', 'm30', 'plan_half_yearly', '2026-09-29', '2027-03-23', 'active', NULL, NULL);

-- 10. Seed Attendance
INSERT INTO attendance (id, user_id, check_in_time, method, status, notes, synced_from_offline) VALUES
('att_r_today', 'member_rahul_desai', '2026-11-08T01:15:00.000Z', 'qr', 'valid', NULL, NULL),
('att_r_yesterday', 'member_rahul_desai', '2026-11-07T01:40:00.000Z', 'qr', 'valid', NULL, NULL),
('att_r_2days', 'member_rahul_desai', '2026-11-06T01:20:00.000Z', 'qr', 'valid', NULL, NULL),
('att_r_3days', 'member_rahul_desai', '2026-11-05T12:45:00.000Z', 'assisted', 'valid', 'Phone battery died, verified by Suresh', NULL),
('att_today_m13', 'm13', '2026-11-08T00:45:00.000Z', 'assisted', 'valid', NULL, NULL),
('att_today_m14', 'm14', '2026-11-08T01:47:00.000Z', 'qr', 'valid', NULL, NULL),
('att_today_m15', 'm15', '2026-11-08T02:49:00.000Z', 'qr', 'valid', NULL, NULL),
('att_today_m16', 'm16', '2026-11-08T03:51:00.000Z', 'qr', 'valid', NULL, NULL),
('att_today_m17', 'm17', '2026-11-08T04:53:00.000Z', 'assisted', 'valid', NULL, NULL),
('att_today_m18', 'm18', '2026-11-08T05:55:00.000Z', 'qr', 'valid', NULL, NULL),
('att_today_m19', 'm19', '2026-11-08T06:57:00.000Z', 'qr', 'valid', NULL, NULL),
('att_today_m20', 'm20', '2026-11-08T07:59:00.000Z', 'qr', 'valid', NULL, NULL),
('att_today_m21', 'm21', '2026-11-08T09:01:00.000Z', 'assisted', 'valid', NULL, NULL),
('att_today_m22', 'm22', '2026-11-08T10:03:00.000Z', 'qr', 'valid', NULL, NULL),
('att_today_m23', 'm23', '2026-11-08T11:05:00.000Z', 'qr', 'valid', NULL, NULL),
('att_today_m24', 'm24', '2026-11-08T12:07:00.000Z', 'qr', 'valid', NULL, NULL),
('att_today_m25', 'm25', '2026-11-08T01:09:00.000Z', 'assisted', 'valid', NULL, NULL),
('att_today_m26', 'm26', '2026-11-08T02:11:00.000Z', 'qr', 'valid', NULL, NULL),
('att_today_member_priya_patil', 'member_priya_patil', '2026-11-08T03:13:00.000Z', 'qr', 'valid', NULL, NULL),
('att_today_member_amit_sharma', 'member_amit_sharma', '2026-11-08T04:15:00.000Z', 'qr', 'valid', NULL, NULL);

-- 11. Seed Streaks
INSERT INTO streaks (id, user_id, current_streak, highest_streak, last_update, weekly_goal_target, weekly_goal_completed) VALUES
('streak_rahul', 'member_rahul_desai', 14, 28, '2026-11-08', 5, 4),
('streak_priya', 'member_priya_patil', 6, 12, '2026-11-08', 4, 3),
('streak_rohan', 'member_rohan_kulkarni', 3, 15, '2026-11-07', 5, 2),
('streak_prakash', 'member_prakash_hubli', 0, 22, '2026-10-21', 5, 0),
('streak_sunita', 'member_sunita_rao', 0, 18, '2026-10-23', 4, 0),
('streak_vinod', 'member_vinod_angadi', 0, 10, '2026-10-24', 5, 0),
('streak_ramesh', 'member_ramesh_pujari', 0, 14, '2026-10-25', 5, 0),
('streak_deepak', 'member_deepak_hiremath', 0, 9, '2026-10-26', 4, 0),
('streak_kavya', 'member_kavya_hegde', 0, 19, '2026-10-27', 5, 0);

-- 12. Seed No-Show Cases (Silent Churn)
INSERT INTO no_show_cases (id, user_id, days_absent, status, resolved_reason, created_at, resolved_at) VALUES
('case_prakash', 'member_prakash_hubli', 18, 'open', NULL, '2026-10-31T02:00:00.000Z', NULL),
('case_sunita', 'member_sunita_rao', 16, 'open', NULL, '2026-11-02T02:00:00.000Z', NULL),
('case_vinod', 'member_vinod_angadi', 15, 'open', NULL, '2026-11-03T02:00:00.000Z', NULL),
('case_ramesh', 'member_ramesh_pujari', 14, 'open', NULL, '2026-11-04T02:00:00.000Z', NULL),
('case_deepak', 'member_deepak_hiremath', 13, 'open', NULL, '2026-11-05T02:00:00.000Z', NULL),
('case_kavya', 'member_kavya_hegde', 12, 'open', NULL, '2026-11-06T02:00:00.000Z', NULL);

-- 14. Seed Payments
INSERT INTO payments (id, user_id, amount, status, transaction_id, plan_id, addon_id, created_at, refunded_at, gateway) VALUES
('pay_rahul_1', 'member_rahul_desai', 10000, 'paid', 'TXN_KG_9902667407_INIT_1', 'plan_yearly', NULL, '2025-12-23T02:00:00.000Z', NULL, NULL),
('pay_addon_1', 'member_rahul_desai', 999, 'paid', 'TXN_KG_ADDON_8812', NULL, 'addon_diet_muscle_gain', '2026-10-24T02:00:00.000Z', NULL, NULL);

-- 15. Seed Add-on Orders
INSERT INTO add_on_orders (id, user_id, addon_id, payment_id, status, trainer_name, purchased_at, expiry_date) VALUES
('order_1', 'member_rahul_desai', 'addon_diet_muscle_gain', 'pay_addon_1', 'active', 'Vikram', '2026-10-24T02:00:00.000Z', '2026-11-23');

-- 16. Seed Notifications
INSERT INTO notifications (id, user_id, message, type, read_status, action_url, created_at) VALUES
('notif_1', 'member_rahul_desai', '🔥 Dhamakedar Streak! You have completed 14 consecutive workout days at Karnataka Gym!', 'streak', FALSE, NULL, '2026-11-08T01:30:00.000Z'),
('notif_2', 'member_priya_patil', '⚠️ Renew Aaj Hi Karein: Your Quarterly membership expires in 4 days. Renew now to retain your slot!', 'renewal', FALSE, '/member/renew', '2026-11-07T03:30:00.000Z'),
('notif_promo', 'member_rahul_desai', '💥 Hubballi Fitness Fest! Get ₹500 off on 12-Month Iron Warrior plan this weekend.', 'promo', TRUE, NULL, '2026-11-05T04:30:00.000Z');

-- 17. Seed Audit Logs
INSERT INTO audit_logs (id, actor_id, action, target_user_id, timestamp, reason, details) VALUES
('audit_init_1', 'user_staff_suresh', 'assisted_checkin', 'member_rahul_desai', '2026-11-05T12:45:00.000Z', 'Member phone battery was completely dead. Verified identity manually.', '{"method":"front_desk_override"}'::jsonb),
('audit_init_2', 'user_owner_manjunath', 'addon_override', 'member_priya_patil', '2026-10-29T06:00:00.000Z', 'Upgraded diet plan to Weight-Loss per trainer recommendation.', '{"trainer":"Pooja","plan":"Weight-Loss Diet Plan"}'::jsonb);

-- Done! 34 Users, Plans, Memberships, Attendance, Streaks & Settings ready in Supabase.
