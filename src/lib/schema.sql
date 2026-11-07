-- ==============================================================================
-- KARNATAKA GYM (HUBBALLI) - DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- Retention & Attendance Management System
-- Contact: 9902667407 | Instagram: @KARNATAKA_GYM_HUBLI
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(20) NOT NULL CHECK (role IN ('member', 'owner', 'front_desk')),
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

-- 2. Plans Table
CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    duration_months INT NOT NULL CHECK (duration_months > 0),
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    tag VARCHAR(50),
    features JSONB DEFAULT '[]'::jsonb
);

-- 3. Memberships Table
CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) NOT NULL REFERENCES plans(id),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'cancelled', 'expired')),
    freeze_reason TEXT,
    frozen_at TIMESTAMP WITH TIME ZONE
);

-- 4. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    method VARCHAR(20) NOT NULL CHECK (method IN ('qr', 'assisted')),
    status VARCHAR(20) NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'duplicate', 'rejected')),
    notes TEXT,
    synced_from_offline BOOLEAN DEFAULT FALSE
);

-- 5. Streaks Table
CREATE TABLE IF NOT EXISTS streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_streak INT DEFAULT 0 CHECK (current_streak >= 0),
    highest_streak INT DEFAULT 0 CHECK (highest_streak >= 0),
    last_update DATE DEFAULT CURRENT_DATE,
    weekly_goal_target INT DEFAULT 5,
    weekly_goal_completed INT DEFAULT 0
);

-- 6. NoShowCases Table (Silent Churn Detection)
CREATE TABLE IF NOT EXISTS no_show_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    days_absent INT NOT NULL CHECK (days_absent >= 10),
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
    resolved_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 7. FollowUps Table
CREATE TABLE IF NOT EXISTS follow_ups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    no_show_case_id UUID NOT NULL REFERENCES no_show_cases(id) ON DELETE CASCADE,
    outcome VARCHAR(50) NOT NULL CHECK (outcome IN ('Will return', 'Injured', 'Travelling', 'Timing issue', 'Unhappy', 'No response', 'Cancelled')),
    next_action_date DATE,
    owner_id UUID NOT NULL REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'pending', 'paid', 'failed', 'refunded', 'reversed')),
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    plan_id VARCHAR(50) REFERENCES plans(id),
    addon_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    refunded_at TIMESTAMP WITH TIME ZONE,
    gateway VARCHAR(50) DEFAULT 'razorpay'
);

-- 9. RenewalOrders Table
CREATE TABLE IF NOT EXISTS renewal_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    membership_id UUID NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) NOT NULL REFERENCES plans(id),
    extended_months INT NOT NULL CHECK (extended_months > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. AddOns Table
CREATE TABLE IF NOT EXISTS add_ons (
    id VARCHAR(50) PRIMARY KEY,
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

-- 11. AddOnOrders Table
CREATE TABLE IF NOT EXISTS add_on_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addon_id VARCHAR(50) NOT NULL REFERENCES add_ons(id),
    payment_id UUID NOT NULL REFERENCES payments(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    trainer_name VARCHAR(100),
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date DATE NOT NULL
);

-- 12. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('renewal', 'streak', 'promo', 'alert', 'general')),
    read_status BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'gym_default',
    no_show_threshold_days INT DEFAULT 10,
    renewal_reminder_days INT DEFAULT 7,
    duplicate_window_minutes INT DEFAULT 5,
    gym_name VARCHAR(100) DEFAULT 'Karnataka Gym',
    gym_phone VARCHAR(20) DEFAULT '9902667407',
    gym_instagram VARCHAR(50) DEFAULT '@KARNATAKA_GYM_HUBLI',
    gym_location VARCHAR(100) DEFAULT 'Hubballi, Karnataka'
);

-- 14. AuditLogs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL CHECK (action IN ('attendance_correction', 'payment_reversal', 'profile_override', 'membership_freeze', 'membership_unfreeze', 'addon_override', 'assisted_checkin')),
    target_user_id UUID NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reason TEXT NOT NULL,
    details JSONB
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_memberships_expiry ON memberships(expiry_date);
CREATE INDEX IF NOT EXISTS idx_attendance_user_time ON attendance(user_id, check_in_time DESC);
CREATE INDEX IF NOT EXISTS idx_no_show_cases_status ON no_show_cases(status);
CREATE INDEX IF NOT EXISTS idx_payments_tx ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);

