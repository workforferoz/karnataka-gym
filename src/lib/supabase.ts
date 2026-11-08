import { createClient } from '@supabase/supabase-js';
import type {
  User,
  Plan,
  Membership,
  Attendance,
  Streak,
  NoShowCase,
  FollowUp,
  Payment,
  RenewalOrder,
  AddOn,
  AddOnOrder,
  Notification,
  Settings,
  AuditLog,
} from '../types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lxskywepjkroblkjitod.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_TJHNCCr76taYp2zBGSaafw_AdhblkJn';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface SupabaseGymData {
  users?: User[];
  plans?: Plan[];
  memberships?: Membership[];
  attendance?: Attendance[];
  streaks?: Streak[];
  noShowCases?: NoShowCase[];
  followUps?: FollowUp[];
  payments?: Payment[];
  renewalOrders?: RenewalOrder[];
  addOns?: AddOn[];
  addOnOrders?: AddOnOrder[];
  notifications?: Notification[];
  settings?: Settings;
  auditLogs?: AuditLog[];
}

export async function fetchGymDataFromSupabase(): Promise<SupabaseGymData | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const [
      usersRes,
      plansRes,
      membershipsRes,
      attendanceRes,
      streaksRes,
      noShowRes,
      followUpsRes,
      paymentsRes,
      renewalsRes,
      addOnsRes,
      ordersRes,
      notificationsRes,
      settingsRes,
      auditRes,
    ] = await Promise.all([
      supabase.from('users').select('*'),
      supabase.from('plans').select('*'),
      supabase.from('memberships').select('*'),
      supabase.from('attendance').select('*').order('check_in_time', { ascending: false }),
      supabase.from('streaks').select('*'),
      supabase.from('no_show_cases').select('*'),
      supabase.from('follow_ups').select('*'),
      supabase.from('payments').select('*').order('created_at', { ascending: false }),
      supabase.from('renewal_orders').select('*'),
      supabase.from('add_ons').select('*'),
      supabase.from('add_on_orders').select('*'),
      supabase.from('notifications').select('*').order('created_at', { ascending: false }),
      supabase.from('settings').select('*').limit(1).maybeSingle(),
      supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }),
    ]);

    // If tables don't exist yet, usersRes.error will be returned
    if (usersRes.error) {
      console.warn('Supabase query notice (tables may be pending creation via supabase-setup.sql):', usersRes.error.message);
      return null;
    }

    if (!usersRes.data || usersRes.data.length === 0) {
      return null;
    }

    return {
      users: (usersRes.data as User[]) || undefined,
      plans: (plansRes.data as Plan[]) || undefined,
      memberships: (membershipsRes.data as Membership[]) || undefined,
      attendance: (attendanceRes.data as Attendance[]) || undefined,
      streaks: (streaksRes.data as Streak[]) || undefined,
      noShowCases: (noShowRes.data as NoShowCase[]) || undefined,
      followUps: (followUpsRes.data as FollowUp[]) || undefined,
      payments: (paymentsRes.data as Payment[]) || undefined,
      renewalOrders: (renewalsRes.data as RenewalOrder[]) || undefined,
      addOns: (addOnsRes.data as AddOn[]) || undefined,
      addOnOrders: (ordersRes.data as AddOnOrder[]) || undefined,
      notifications: (notificationsRes.data as Notification[]) || undefined,
      settings: (settingsRes.data as Settings) || undefined,
      auditLogs: (auditRes.data as AuditLog[]) || undefined,
    };
  } catch (err) {
    console.warn('Error fetching data from Supabase:', err);
    return null;
  }
}

function sanitizeForSupabase<T extends Record<string, any>>(table: string, record: T): any {
  if (table === 'users' && record) {
    // If table doesn't have email/password/auth_provider columns yet, sanitize payload
    const copy = { ...record };
    delete copy.password;
    delete copy.auth_provider;
    // Keep email if schema supports it, but fallback if rejected
    return copy;
  }
  return record;
}

export async function syncSupabaseInsert<T extends Record<string, any>>(table: string, record: T) {
  if (!isSupabaseConfigured) return;
  try {
    const payload = table === 'users' ? sanitizeForSupabase(table, record) : record;
    const { error } = await supabase.from(table).insert(payload as any);
    if (error && table === 'users' && error.message.includes('column')) {
      const { email, password, auth_provider, ...coreUser } = record as any;
      await supabase.from(table).insert(coreUser as any);
    } else if (error) {
      console.warn(`Supabase insert warning on ${table}:`, error.message);
    }
  } catch (err) {
    console.warn(`Supabase insert failed on ${table}:`, err);
  }
}

export async function syncSupabaseUpsert<T extends Record<string, any>>(table: string, record: T | T[]) {
  if (!isSupabaseConfigured) return;
  try {
    const payload = table === 'users' && !Array.isArray(record) ? sanitizeForSupabase(table, record) : record;
    const { error } = await supabase.from(table).upsert(payload as any);
    if (error) console.warn(`Supabase upsert warning on ${table}:`, error.message);
  } catch (err) {
    console.warn(`Supabase upsert failed on ${table}:`, err);
  }
}

export async function syncSupabaseUpdate<T extends Record<string, any>>(
  table: string,
  record: Partial<T>,
  idField = 'id',
  idVal: any
) {
  if (!isSupabaseConfigured) return;
  try {
    const payload = table === 'users' ? sanitizeForSupabase(table, record) : record;
    const { error } = await supabase.from(table).update(payload as any).eq(idField, idVal);
    if (error && table === 'users' && error.message.includes('column')) {
      const { email, password, auth_provider, ...coreUser } = record as any;
      await supabase.from(table).update(coreUser as any).eq(idField, idVal);
    } else if (error) {
      console.warn(`Supabase update warning on ${table}:`, error.message);
    }
  } catch (err) {
    console.warn(`Supabase update failed on ${table}:`, err);
  }
}

export async function syncSupabaseDelete(table: string, idVal: any, idField = 'id') {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from(table).delete().eq(idField, idVal);
    if (error) console.warn(`Supabase delete warning on ${table}:`, error.message);
  } catch (err) {
    console.warn(`Supabase delete failed on ${table}:`, err);
  }
}
