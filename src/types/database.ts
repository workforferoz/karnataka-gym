export type UserRole = 'member' | 'owner' | 'front_desk';

export type MembershipStatus = 'active' | 'frozen' | 'cancelled' | 'expired';

export type AttendanceMethod = 'qr' | 'assisted';
export type AttendanceStatus = 'valid' | 'duplicate' | 'rejected';

export type NoShowStatus = 'open' | 'resolved';

export type FollowUpOutcome =
  | 'Will return'
  | 'Injured'
  | 'Travelling'
  | 'Timing issue'
  | 'Unhappy'
  | 'No response'
  | 'Cancelled';

export type PaymentStatus =
  | 'created'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'reversed';

export type AddOnType = 'pt' | 'diet' | 'supplement';

export type AuditAction =
  | 'attendance_correction'
  | 'payment_reversal'
  | 'profile_override'
  | 'membership_freeze'
  | 'membership_unfreeze'
  | 'addon_override'
  | 'assisted_checkin';

export interface User {
  id: string;
  role: UserRole;
  phone: string;
  name: string;
  profile_image?: string;
  marketing_opt_in: boolean;
  emergency_contact?: string;
  comm_preference: 'whatsapp' | 'sms' | 'call';
  assigned_trainer?: string;
  active_diet_plan?: string;
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  duration_months: number;
  base_price: number;
  discount_amount: number;
  tag?: string;
  features: string[];
}

export interface Membership {
  id: string;
  user_id: string;
  plan_id: string;
  start_date: string;
  expiry_date: string;
  status: MembershipStatus;
  freeze_reason?: string;
  frozen_at?: string;
}

export interface Attendance {
  id: string;
  user_id: string;
  check_in_time: string;
  method: AttendanceMethod;
  status: AttendanceStatus;
  notes?: string;
  synced_from_offline?: boolean;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  highest_streak: number;
  last_update: string;
  weekly_goal_target: number;
  weekly_goal_completed: number;
}

export interface NoShowCase {
  id: string;
  user_id: string;
  days_absent: number;
  status: NoShowStatus;
  resolved_reason?: string;
  created_at: string;
  resolved_at?: string;
}

export interface FollowUp {
  id: string;
  no_show_case_id: string;
  outcome: FollowUpOutcome;
  next_action_date?: string;
  owner_id: string;
  notes?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  status: PaymentStatus;
  transaction_id: string;
  plan_id?: string;
  addon_id?: string;
  created_at: string;
  refunded_at?: string;
  gateway?: string;
}

export interface RenewalOrder {
  id: string;
  payment_id: string;
  membership_id: string;
  plan_id: string;
  extended_months: number;
  created_at: string;
}

export interface AddOn {
  id: string;
  type: AddOnType;
  name: string;
  price: number;
  validity_days: number;
  stock: number; // for supplements
  trainer_name?: string;
  description: string;
  category_label?: string;
  is_available?: boolean;
}

export interface AddOnOrder {
  id: string;
  user_id: string;
  addon_id: string;
  payment_id: string;
  status: 'active' | 'completed' | 'cancelled';
  trainer_name?: string;
  purchased_at: string;
  expiry_date: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: 'renewal' | 'streak' | 'promo' | 'alert' | 'general';
  read_status: boolean;
  created_at: string;
  action_url?: string;
}

export interface Settings {
  id: string;
  no_show_threshold_days: number;
  renewal_reminder_days: number;
  duplicate_window_minutes: number;
  gym_name: string;
  gym_phone: string;
  gym_instagram: string;
  gym_location: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  action: AuditAction;
  target_user_id: string;
  timestamp: string;
  reason: string;
  details?: Record<string, unknown>;
}

