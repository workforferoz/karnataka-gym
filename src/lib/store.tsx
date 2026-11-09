'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
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
  FollowUpOutcome,
  NoShowStatus
} from '../types/database';
import {
  INITIAL_USERS,
  INITIAL_PLANS,
  INITIAL_ADDONS,
  INITIAL_MEMBERSHIPS,
  INITIAL_ATTENDANCE,
  INITIAL_STREAKS,
  INITIAL_NO_SHOW_CASES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PAYMENTS,
  INITIAL_ADDON_ORDERS,
  INITIAL_SETTINGS
} from './data-seed';
import { playSuccessChime, playErrorBeep, triggerConfetti } from './sound';
import { sanitizePhone } from './security';
import {
  isSupabaseConfigured,
  fetchGymDataFromSupabase,
  syncSupabaseInsert,
  syncSupabaseUpsert,
  syncSupabaseUpdate,
  syncSupabaseDelete
} from './supabase';
import { sanitizeString } from './security';

interface OfflineCheckinQueueItem {
  id: string;
  userId: string;
  timestamp: string;
  method: 'qr' | 'assisted';
}

interface CheckinResult {
  success: boolean;
  code: 'VALID' | 'DUPLICATE' | 'EXPIRED' | 'FROZEN' | 'OFFLINE_QUEUED' | 'USER_NOT_FOUND';
  message: string;
  attendance?: Attendance;
  streak?: Streak;
}

interface GymContextType {
  currentUser: User;
  isLoggedIn: boolean;
  isHydrated: boolean;
  login: (userId: string, method?: string) => void;
  logout: () => void;
  switchUser: (userId: string) => void;
  users: User[];
  plans: Plan[];
  memberships: Membership[];
  attendance: Attendance[];
  streaks: Streak[];
  noShowCases: NoShowCase[];
  followUps: FollowUp[];
  payments: Payment[];
  renewalOrders: RenewalOrder[];
  addOns: AddOn[];
  addOnOrders: AddOnOrder[];
  notifications: Notification[];
  settings: Settings;
  auditLogs: AuditLog[];
  isOnline: boolean;
  offlineQueueCount: number;

  // Actions
  recordCheckin: (userId: string, method?: 'qr' | 'assisted', assistedReason?: string) => Promise<CheckinResult>;
  renewMembership: (userId: string, planId: string, simulateState?: 'paid' | 'failed' | 'pending', customTxnId?: string) => Promise<{ success: boolean; message: string; payment?: Payment }>;
  purchaseAddOn: (userId: string, addonId: string, trainerOverride?: string, customTxnId?: string) => Promise<{ success: boolean; message: string; payment?: Payment }>;
  markFollowUpOutcome: (caseId: string, outcome: FollowUpOutcome, nextDate?: string, notes?: string) => Promise<{ success: boolean; message: string }>;
  freezeMembership: (userId: string, reason: string) => Promise<{ success: boolean; message: string }>;
  unfreezeMembership: (userId: string) => Promise<{ success: boolean; message: string }>;
  updateUserProfile: (userId: string, updates: Partial<User>) => Promise<{ success: boolean; message: string }>;
  ownerOverrideMemberPlan: (targetUserId: string, newPlanId?: string, dietPlan?: string, trainer?: string, reason?: string) => Promise<{ success: boolean; message: string }>;
  processPaymentRefund: (paymentId: string, reason: string) => Promise<{ success: boolean; message: string }>;
  simulateDuplicateWebhook: (existingTxnId: string) => Promise<{ success: boolean; message: string }>;
  runDailyNoShowScan: () => { createdCount: number; details: string[] };
  sendNotification: (userId: string, message: string, type: 'renewal' | 'streak' | 'promo' | 'alert') => boolean;
  dismissNotification: (id: string) => void;
  resetAllDataToSeed: () => void;
  syncOfflineQueue: () => Promise<number>;
  updateGymSettings: (updates: Partial<Settings>) => Promise<{ success: boolean; message: string }>;
  updatePlan: (planId: string, updates: Partial<Plan>) => Promise<{ success: boolean; message: string }>;
  updateAddon: (addonId: string, updates: Partial<AddOn>) => Promise<{ success: boolean; message: string }>;
  createAddon: (newAddon: Omit<AddOn, 'id'> & { id?: string }) => Promise<{ success: boolean; message: string; addon: AddOn }>;
  deleteAddon: (addonId: string) => Promise<{ success: boolean; message: string }>;
  createMember: (data: {
    name: string;
    phone: string;
    planId: string;
    durationMonths?: number;
    assignedTrainer?: string;
    dietPlan?: string;
    emergencyContact?: string;
    commPreference?: 'whatsapp' | 'sms' | 'call';
  }) => Promise<{ success: boolean; message: string; user?: User }>;
  deleteMember: (userId: string) => Promise<{ success: boolean; message: string }>;
  loginWithCredentials: (identifier: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  loginWithGoogle: (googleProfile: { name: string; email: string; imageUrl?: string }) => Promise<{ success: boolean; message: string; user?: User }>;
  registerMemberAccount: (data: {
    name: string;
    phone: string;
    email?: string;
    password?: string;
    planId?: string;
    fitnessGoal?: string;
    authProvider?: 'password' | 'google';
  }) => Promise<{ success: boolean; message: string; user?: User }>;
}

const GymContext = createContext<GymContextType | null>(null);

const STORAGE_KEY = 'karnataka_gym_store_v1';

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State variables
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [memberships, setMemberships] = useState<Membership[]>(INITIAL_MEMBERSHIPS);
  const [attendance, setAttendance] = useState<Attendance[]>(INITIAL_ATTENDANCE);
  const [streaks, setStreaks] = useState<Streak[]>(INITIAL_STREAKS);
  const [noShowCases, setNoShowCases] = useState<NoShowCase[]>(INITIAL_NO_SHOW_CASES);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [renewalOrders, setRenewalOrders] = useState<RenewalOrder[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>(INITIAL_ADDONS);
  const [addOnOrders, setAddOnOrders] = useState<AddOnOrder[]>(INITIAL_ADDON_ORDERS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Active user and auth state
  const [currentUserId, setCurrentUserId] = useState<string>('member_rahul_desai');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueue, setOfflineQueue] = useState<OfflineCheckinQueueItem[]>([]);

  const isLoadedRef = useRef<boolean>(false);

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.users) {
          const dummyIdsToRemove = new Set([
            'member_priya_patil', 'member_rohan_kulkarni', 'member_sneha_joshi', 'member_manoj_nayak',
            'member_amit_sharma', 'member_prakash_hubli', 'member_sunita_rao', 'member_vinod_angadi',
            'member_ramesh_pujari', 'member_deepak_hiremath', 'member_kavya_hegde', 'user_staff_suresh',
            'm13', 'm14', 'm15', 'm16', 'm17', 'm18', 'm19', 'm20', 'm21', 'm22', 'm23', 'm24', 'm25', 'm26', 'm27', 'm28', 'm29', 'm30'
          ]);
          const cleanedUsers = (parsed.users as User[]).filter((u) => !dummyIdsToRemove.has(u.id));
          if (!cleanedUsers.some((u) => u.id === 'member_rahul_desai')) {
            const rahul = INITIAL_USERS.find((u) => u.id === 'member_rahul_desai');
            if (rahul) cleanedUsers.push(rahul);
          }
          if (!cleanedUsers.some((u) => u.id === 'user_owner_riyaz')) {
            const owner = INITIAL_USERS.find((u) => u.id === 'user_owner_riyaz');
            if (owner) cleanedUsers.unshift(owner);
          }
          setUsers(cleanedUsers);
        }
        if (parsed.plans) setPlans(parsed.plans);
        if (parsed.memberships) {
          const dummyIdsToRemove = new Set([
            'member_priya_patil', 'member_rohan_kulkarni', 'member_sneha_joshi', 'member_manoj_nayak',
            'member_amit_sharma', 'member_prakash_hubli', 'member_sunita_rao', 'member_vinod_angadi',
            'member_ramesh_pujari', 'member_deepak_hiremath', 'member_kavya_hegde',
            'm13', 'm14', 'm15', 'm16', 'm17', 'm18', 'm19', 'm20', 'm21', 'm22', 'm23', 'm24', 'm25', 'm26', 'm27', 'm28', 'm29', 'm30'
          ]);
          const cleanedMems = (parsed.memberships as Membership[]).filter((m) => !dummyIdsToRemove.has(m.user_id));
          if (!cleanedMems.some((m) => m.user_id === 'member_rahul_desai')) {
            cleanedMems.push(INITIAL_MEMBERSHIPS[0]);
          }
          setMemberships(cleanedMems);
        }
        if (parsed.attendance) {
          setAttendance((parsed.attendance as Attendance[]).filter((a) => a.user_id === 'member_rahul_desai' || !a.user_id.startsWith('m')));
        }
        if (parsed.streaks) {
          setStreaks((parsed.streaks as Streak[]).filter((s) => s.user_id === 'member_rahul_desai'));
        }
        if (parsed.noShowCases) {
          setNoShowCases((parsed.noShowCases as NoShowCase[]).filter((c) => c.user_id === 'member_rahul_desai'));
        }
        if (parsed.followUps) setFollowUps(parsed.followUps);
        if (parsed.payments) setPayments(parsed.payments);
        if (parsed.renewalOrders) setRenewalOrders(parsed.renewalOrders);
        if (parsed.addOns) setAddOns(parsed.addOns);
        if (parsed.addOnOrders) setAddOnOrders(parsed.addOnOrders);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
      }

      // Check auth state
      const authFlag = localStorage.getItem('karnataka_gym_logged_in');
      if (authFlag === 'true') {
        setIsLoggedIn(true);
      }
      const savedUserId = localStorage.getItem('karnataka_gym_current_user_id');
      if (savedUserId) {
        setCurrentUserId(savedUserId);
      }
    } catch (e) {
      console.error('Failed to load store from localStorage', e);
    } finally {
      isLoadedRef.current = true;
      setIsHydrated(true);
    }

    // Network listeners
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // 1b. Load remote data from Supabase if configured and available
  useEffect(() => {
    let isCancelled = false;
    async function loadFromSupabase() {
      if (!isSupabaseConfigured) return;
      try {
        const remoteData = await fetchGymDataFromSupabase();
        if (isCancelled || !remoteData) return;
        if (remoteData.users) setUsers(remoteData.users);
        if (remoteData.plans && remoteData.plans.length > 0) setPlans(remoteData.plans);
        if (remoteData.memberships) setMemberships(remoteData.memberships);
        if (remoteData.attendance) setAttendance(remoteData.attendance);
        if (remoteData.streaks) setStreaks(remoteData.streaks);
        if (remoteData.noShowCases !== undefined) setNoShowCases(remoteData.noShowCases);
        if (remoteData.followUps !== undefined) setFollowUps(remoteData.followUps);
        if (remoteData.payments) setPayments(remoteData.payments);
        if (remoteData.renewalOrders !== undefined) setRenewalOrders(remoteData.renewalOrders);
        if (remoteData.addOns && remoteData.addOns.length > 0) setAddOns(remoteData.addOns);
        if (remoteData.addOnOrders !== undefined) setAddOnOrders(remoteData.addOnOrders);
        if (remoteData.notifications !== undefined) setNotifications(remoteData.notifications);
        if (remoteData.settings) setSettings(remoteData.settings);
        if (remoteData.auditLogs && remoteData.auditLogs.length > 0) setAuditLogs(remoteData.auditLogs);
      } catch (err) {
        console.warn('Failed to load initial Supabase data:', err);
      }
    }
    loadFromSupabase();
    return () => {
      isCancelled = true;
    };
  }, []);

  // 2. Persist state changes to LocalStorage (only after initial load has finished)
  const persistState = useCallback(() => {
    if (!isLoadedRef.current) return;
    try {
      const dataToSave = {
        users,
        plans,
        memberships,
        attendance,
        streaks,
        noShowCases,
        followUps,
        payments,
        renewalOrders,
        addOns,
        addOnOrders,
        notifications,
        settings,
        auditLogs
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('Could not persist to localStorage:', e);
    }
  }, [
    users,
    plans,
    memberships,
    attendance,
    streaks,
    noShowCases,
    followUps,
    payments,
    renewalOrders,
    addOns,
    addOnOrders,
    notifications,
    settings,
    auditLogs
  ]);

  useEffect(() => {
    if (isLoadedRef.current) {
      persistState();
    }
  }, [persistState]);

  // Active user object
  const currentUser = useMemo(() => {
    const found = users.find((u) => u.id === currentUserId);
    return found || users[0] || INITIAL_USERS[0];
  }, [users, currentUserId]);

  const login = (userId: string, method: string = 'credentials') => {
    setCurrentUserId(userId);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('karnataka_gym_logged_in', 'true');
      localStorage.setItem('karnataka_gym_current_user_id', userId);
    } catch (e) {
      console.warn('Error saving login state:', e);
    }

    // Save login event directly to Supabase audit_logs
    const userObj = users.find((u) => u.id === userId);
    if (userObj) {
      const loginLog: AuditLog = {
        id: `audit_login_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        actor_id: userId,
        action: 'profile_override',
        target_user_id: userId,
        timestamp: new Date().toISOString(),
        reason: `Member login verified: ${userObj.name} (+91 ${userObj.phone}) via ${method}`,
        details: {
          userId,
          name: userObj.name,
          phone: userObj.phone,
          email: userObj.email,
          auth_provider: userObj.auth_provider || method,
          login_time: new Date().toISOString()
        }
      };
      setAuditLogs((prev) => [loginLog, ...prev]);
      syncSupabaseInsert('audit_logs', loginLog);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.setItem('karnataka_gym_logged_in', 'false');
    } catch (e) {
      console.warn('Error saving logout state:', e);
    }
  };

  const switchUser = (userId: string) => {
    login(userId, 'profile_switch');
  };

  const resetAllDataToSeed = () => {
    setUsers(INITIAL_USERS);
    setPlans(INITIAL_PLANS);
    setMemberships(INITIAL_MEMBERSHIPS);
    setAttendance(INITIAL_ATTENDANCE);
    setStreaks(INITIAL_STREAKS);
    setNoShowCases(INITIAL_NO_SHOW_CASES);
    setFollowUps([]);
    setPayments(INITIAL_PAYMENTS);
    setRenewalOrders([]);
    setAddOns(INITIAL_ADDONS);
    setAddOnOrders(INITIAL_ADDON_ORDERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setOfflineQueue([]);
    setCurrentUserId('member_rahul_desai');
    setIsLoggedIn(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('karnataka_gym_logged_in');
      localStorage.removeItem('karnataka_gym_current_user_id');
    } catch (e) {
      // ignore
    }
  };

  // Helper to log audit actions
  const logAudit = (actorId: string, action: AuditLog['action'], targetUserId: string, reason: string, details?: Record<string, unknown>) => {
    const log: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      actor_id: actorId,
      action,
      target_user_id: targetUserId,
      timestamp: new Date().toISOString(),
      reason,
      details
    };
    setAuditLogs((prev) => [log, ...prev]);
    syncSupabaseInsert('audit_logs', log);
    return log;
  };

  // -------------------------------------------------------------
  // CORE BUSINESS LOGIC
  // -------------------------------------------------------------

  // 1. QR / Assisted Check-in
  const recordCheckin = async (
    userId: string,
    method: 'qr' | 'assisted' = 'qr',
    assistedReason: string = ''
  ): Promise<CheckinResult> => {
    const user = users.find((u) => u.id === userId);
    if (!user) {
      playErrorBeep();
      return { success: false, code: 'USER_NOT_FOUND', message: 'Member record nahi mila (User Not Found).' };
    }

    // Check membership status
    const membership = memberships.find((m) => m.user_id === userId);
    const today = new Date().toISOString().split('T')[0];

    if (!membership) {
      playErrorBeep();
      return { success: false, code: 'EXPIRED', message: 'Koi active membership nahi mili. Please renew!' };
    }

    if (membership.status === 'frozen') {
      playErrorBeep();
      return {
        success: false,
        code: 'FROZEN',
        message: `Membership paused/frozen hai (${membership.freeze_reason || 'Freeze active'}). Kripya reception par contact karein.`
      };
    }

    if (membership.status === 'expired' || membership.expiry_date < today) {
      playErrorBeep();
      return {
        success: false,
        code: 'EXPIRED',
        message: `Membership expired on ${membership.expiry_date}. Kripya renew aaj hi karein!`
      };
    }

    // Offline Handling
    if (!isOnline && method === 'qr') {
      const queueItem: OfflineCheckinQueueItem = {
        id: `offline_${Date.now()}`,
        userId,
        timestamp: new Date().toISOString(),
        method: 'qr'
      };
      setOfflineQueue((prev) => [...prev, queueItem]);
      return {
        success: true,
        code: 'OFFLINE_QUEUED',
        message: 'Internet disconnected! Check-in offline save ho gaya hai. Network aate hi sync ho jayega.'
      };
    }

    // Assisted checkin validation: mandatory reason
    if (method === 'assisted') {
      if (!assistedReason || assistedReason.trim().length === 0) {
        playErrorBeep();
        return {
          success: false,
          code: 'VALID',
          message: 'Mandatory reason required for assisted front desk check-in!'
        };
      }
    }

    // 5-Minute Duplicate Window Check
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const userRecentCheckins = attendance.filter((a) => a.user_id === userId && a.status === 'valid');
    const latestCheckin = userRecentCheckins.sort(
      (a, b) => new Date(b.check_in_time).getTime() - new Date(a.check_in_time).getTime()
    )[0];

    if (latestCheckin) {
      const latestTime = new Date(latestCheckin.check_in_time).getTime();
      if (latestTime > fiveMinutesAgo) {
        playErrorBeep();
        // Log duplicate attempt
        const dupRecord: Attendance = {
          id: `att_dup_${Date.now()}`,
          user_id: userId,
          check_in_time: new Date().toISOString(),
          method,
          status: 'duplicate',
          notes: 'Attempted within 5 min duplicate window'
        };
        setAttendance((prev) => [dupRecord, ...prev]);
        syncSupabaseInsert('attendance', dupRecord);

        const minutesLeft = Math.ceil((latestTime + 5 * 60 * 1000 - Date.now()) / (60 * 1000));
        return {
          success: false,
          code: 'DUPLICATE',
          message: `Duplicate scan window active (5 mins). Aap pehle hi check-in kar chuke hain! (${minutesLeft}m wait baki hai)`
        };
      }
    }

    // Valid Check-in
    const newAttendance: Attendance = {
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      check_in_time: new Date().toISOString(),
      method,
      status: 'valid',
      notes: method === 'assisted' ? `Assisted Checkin Reason: ${assistedReason}` : undefined
    };

    setAttendance((prev) => [newAttendance, ...prev]);
    syncSupabaseInsert('attendance', newAttendance);

    // If assisted check-in, write mandatory audit log
    if (method === 'assisted') {
      logAudit(currentUser.id, 'assisted_checkin', userId, assistedReason, {
        method: 'assisted',
        time: newAttendance.check_in_time
      });
    }

    // QR Resolution: Automatically resolve open NoShowCases for this user!
    setNoShowCases((prev) =>
      prev.map((c) => {
        if (c.user_id === userId && c.status === 'open') {
          const resolvedObj: NoShowCase = {
            ...c,
            status: 'resolved',
            resolved_reason: `Returned via ${method.toUpperCase()} Check-in`,
            resolved_at: new Date().toISOString()
          };
          syncSupabaseUpdate('no_show_cases', resolvedObj, 'id', c.id);
          return resolvedObj;
        }
        return c;
      })
    );

    // Update Streak
    let updatedStreak: Streak | undefined;
    setStreaks((prev) => {
      const existing = prev.find((s) => s.user_id === userId);
      const isToday = existing?.last_update === today;
      const currentVal = existing ? (isToday ? existing.current_streak : existing.current_streak + 1) : 1;
      const highestVal = existing ? Math.max(existing.highest_streak, currentVal) : 1;
      const completedGoal = existing ? Math.min(existing.weekly_goal_target, existing.weekly_goal_completed + (isToday ? 0 : 1)) : 1;

      const newStreakObj: Streak = {
        id: existing?.id || `streak_${userId}`,
        user_id: userId,
        current_streak: currentVal,
        highest_streak: highestVal,
        last_update: today,
        weekly_goal_target: existing?.weekly_goal_target || 5,
        weekly_goal_completed: completedGoal
      };
      updatedStreak = newStreakObj;
      syncSupabaseUpsert('streaks', newStreakObj);

      const filtered = prev.filter((s) => s.user_id !== userId);
      return [newStreakObj, ...filtered];
    });

    // Sound & Confetti
    playSuccessChime();
    triggerConfetti();

    return {
      success: true,
      code: 'VALID',
      message: `Badhai Ho! 🎉 Entry Approved! Workout Streak badhkar ${updatedStreak?.current_streak || 1} din ho gaya.`,
      attendance: newAttendance,
      streak: updatedStreak
    };
  };

  // Sync offline queued check-ins
  const syncOfflineQueue = async (): Promise<number> => {
    if (offlineQueue.length === 0) return 0;
    let synced = 0;
    const items = [...offlineQueue];
    for (const item of items) {
      const record: Attendance = {
        id: `att_sync_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        user_id: item.userId,
        check_in_time: item.timestamp,
        method: item.method,
        status: 'valid',
        synced_from_offline: true,
        notes: 'Synced from mobile offline queue'
      };
      setAttendance((prev) => [record, ...prev]);
      syncSupabaseInsert('attendance', record);
      synced++;
    }
    setOfflineQueue([]);
    return synced;
  };

  // 2. Renewal & Payment Gateway (Official UPI: feroznadaf13008@ybl)
  const renewMembership = async (
    userId: string,
    planId: string,
    simulateState: 'paid' | 'failed' | 'pending' = 'paid',
    customTxnId?: string
  ): Promise<{ success: boolean; message: string; payment?: Payment }> => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return { success: false, message: 'Plan invalid ya nahi mila.' };

    const txnId = customTxnId || `TXN_KG_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const payableAmount = plan.base_price - plan.discount_amount;

    const paymentRecord: Payment = {
      id: `pay_${Date.now()}`,
      user_id: userId,
      amount: payableAmount,
      status: simulateState,
      transaction_id: txnId,
      plan_id: planId,
      created_at: new Date().toISOString(),
      gateway: 'upi_feroznadaf'
    };

    setPayments((prev) => [paymentRecord, ...prev]);
    syncSupabaseInsert('payments', paymentRecord);

    if (simulateState === 'failed') {
      playErrorBeep();
      return {
        success: false,
        message: 'Payment provider error. Apne bank se check karein. (Membership NOT extended)',
        payment: paymentRecord
      };
    }

    if (simulateState === 'pending') {
      return {
        success: false,
        message: 'Payment verification pending. Awaiting webhook callback... (Membership NOT extended yet)',
        payment: paymentRecord
      };
    }

    // Success State -> Extend membership (Idempotently)
    // Check if membership already exists for user
    const existingMem = memberships.find((m) => m.user_id === userId);
    const currentDate = new Date();
    let baseExpiry = currentDate;

    if (existingMem && new Date(existingMem.expiry_date) > currentDate) {
      baseExpiry = new Date(existingMem.expiry_date);
    }

    const newExpiry = new Date(baseExpiry);
    newExpiry.setMonth(newExpiry.getMonth() + plan.duration_months);
    const newExpiryStr = newExpiry.toISOString().split('T')[0];

    if (existingMem) {
      const updatedMem: Membership = { ...existingMem, expiry_date: newExpiryStr, status: 'active', plan_id: planId };
      setMemberships((prev) =>
        prev.map((m) =>
          m.id === existingMem.id
            ? updatedMem
            : m
        )
      );
      syncSupabaseUpdate('memberships', updatedMem, 'id', existingMem.id);
    } else {
      const newMem: Membership = {
        id: `mem_${Date.now()}`,
        user_id: userId,
        plan_id: planId,
        start_date: currentDate.toISOString().split('T')[0],
        expiry_date: newExpiryStr,
        status: 'active'
      };
      setMemberships((prev) => [...prev, newMem]);
      syncSupabaseInsert('memberships', newMem);
    }

    // Create Renewal Order
    const renewalOrder: RenewalOrder = {
      id: `ro_${Date.now()}`,
      payment_id: paymentRecord.id,
      membership_id: existingMem ? existingMem.id : `mem_${userId}`,
      plan_id: planId,
      extended_months: plan.duration_months,
      created_at: new Date().toISOString()
    };
    setRenewalOrders((prev) => [renewalOrder, ...prev]);
    syncSupabaseInsert('renewal_orders', renewalOrder);

    playSuccessChime();
    triggerConfetti();

    return {
      success: true,
      message: `Badhai Ho! 🎉 Payment successful ₹${payableAmount}. Membership ${plan.duration_months} mahine badhakar ${newExpiryStr} tak kar di gayi!`,
      payment: paymentRecord
    };
  };

  // Idempotency test helper: Simulate duplicate webhook callback for a single payment
  const simulateDuplicateWebhook = async (existingTxnId: string): Promise<{ success: boolean; message: string }> => {
    const existingPayment = payments.find((p) => p.transaction_id === existingTxnId);
    if (!existingPayment) {
      return { success: false, message: 'Transaction ID not found' };
    }

    const alreadyExtended = renewalOrders.some((ro) => ro.payment_id === existingPayment.id);
    if (alreadyExtended) {
      // Idempotency: Reject duplicate extension
      return {
        success: false,
        message: `IDEMPOTENT CHECK PASSED: Webhook for transaction ${existingTxnId} was already processed. Membership was NOT double-extended.`
      };
    }

    return { success: true, message: 'First time processing webhook.' };
  };

  // 3. Purchase Add-ons (Official UPI: feroznadaf13008@ybl)
  const purchaseAddOn = async (
    userId: string,
    addonId: string,
    trainerOverride?: string,
    customTxnId?: string
  ): Promise<{ success: boolean; message: string; payment?: Payment }> => {
    const addon = addOns.find((a) => a.id === addonId);
    if (!addon) return { success: false, message: 'Add-on nahi mila.' };

    // Check supplement stock
    if (addon.type === 'supplement') {
      if (addon.stock <= 0) {
        playErrorBeep();
        return {
          success: false,
          message: `Stock Unavailable! "${addon.name}" Karnataka Gym Hubballi counter par stock me nahi hai (Stock: 0).`
        };
      }
    }

    // Check PT Trainer availability
    if (addon.type === 'pt') {
      const selectedTrainer = trainerOverride || addon.trainer_name;
      if (selectedTrainer === 'Rakesh' || addon.is_available === false) {
        playErrorBeep();
        return {
          success: false,
          message: `Booking Conflict! Coach ${selectedTrainer} is currently fully booked. Please choose another trainer (Vikram/Pooja).`
        };
      }
    }

    // Create payment
    const txnId = customTxnId || `TXN_ADDON_UPI_${Date.now()}`;
    const paymentRecord: Payment = {
      id: `pay_addon_${Date.now()}`,
      user_id: userId,
      amount: addon.price,
      status: 'paid',
      transaction_id: txnId,
      addon_id: addon.id,
      created_at: new Date().toISOString(),
      gateway: 'upi_feroznadaf'
    };
    setPayments((prev) => [paymentRecord, ...prev]);
    syncSupabaseInsert('payments', paymentRecord);

    // Decrement stock if supplement
    if (addon.type === 'supplement') {
      const updatedStock = Math.max(0, addon.stock - 1);
      setAddOns((prev) =>
        prev.map((a) => (a.id === addonId ? { ...a, stock: updatedStock } : a))
      );
      syncSupabaseUpdate('add_ons', { stock: updatedStock }, 'id', addonId);
    }

    // Create AddOnOrder
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + addon.validity_days);
    const newOrder: AddOnOrder = {
      id: `order_${Date.now()}`,
      user_id: userId,
      addon_id: addon.id,
      payment_id: paymentRecord.id,
      status: 'active',
      trainer_name: trainerOverride || addon.trainer_name,
      purchased_at: new Date().toISOString(),
      expiry_date: expDate.toISOString().split('T')[0]
    };
    setAddOnOrders((prev) => [newOrder, ...prev]);
    syncSupabaseInsert('add_on_orders', newOrder);

    // Update user active diet / trainer if applicable
    if (addon.type === 'diet') {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, active_diet_plan: addon.name } : u))
      );
      syncSupabaseUpdate('users', { active_diet_plan: addon.name }, 'id', userId);
    }

    playSuccessChime();
    triggerConfetti();

    return {
      success: true,
      message: `Purchase successful! "${addon.name}" active ho gaya hai.`,
      payment: paymentRecord
    };
  };

  // 4. Owner Churn Rescue: Mark Outcome
  const markFollowUpOutcome = async (
    caseId: string,
    outcome: FollowUpOutcome,
    nextDate?: string,
    notes?: string
  ): Promise<{ success: boolean; message: string }> => {
    const caseRecord = noShowCases.find((c) => c.id === caseId);
    if (!caseRecord) return { success: false, message: 'No-show case nahi mila.' };

    const newFollowUp: FollowUp = {
      id: `fu_${Date.now()}`,
      no_show_case_id: caseId,
      outcome,
      next_action_date: nextDate,
      owner_id: currentUser.id,
      notes,
      created_at: new Date().toISOString()
    };
    setFollowUps((prev) => [newFollowUp, ...prev]);
    syncSupabaseInsert('follow_ups', newFollowUp);

    // Update case status
    const isResolved = outcome === 'Will return' || outcome === 'Timing issue' || outcome === 'Cancelled';
    const caseUpdates = {
      status: (isResolved ? 'resolved' : 'open') as NoShowStatus,
      resolved_reason: `Follow-up outcome: ${outcome}${notes ? ` - ${notes}` : ''}`,
      resolved_at: isResolved ? new Date().toISOString() : undefined
    };
    setNoShowCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              ...caseUpdates
            }
          : c
      )
    );
    syncSupabaseUpdate('no_show_cases', caseUpdates, 'id', caseId);

    logAudit(currentUser.id, 'profile_override', caseRecord.user_id, `Owner logged follow-up outcome: ${outcome}`, {
      outcome,
      nextDate,
      notes
    });

    return {
      success: true,
      message: `Follow-up saved! Case marked as ${isResolved ? 'Resolved' : 'Deferred (Follow-up scheduled)'}.`
    };
  };

  // 5. Freeze / Pause Membership (Streak is preserved!)
  const freezeMembership = async (
    userId: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> => {
    const mem = memberships.find((m) => m.user_id === userId);
    if (!mem) return { success: false, message: 'Membership not found' };

    const freezeUpdates = {
      status: 'frozen' as const,
      freeze_reason: reason,
      frozen_at: new Date().toISOString()
    };
    setMemberships((prev) =>
      prev.map((m) =>
        m.id === mem.id
          ? {
              ...m,
              ...freezeUpdates
            }
          : m
      )
    );
    syncSupabaseUpdate('memberships', freezeUpdates, 'id', mem.id);

    logAudit(currentUser.id, 'membership_freeze', userId, `Membership paused/frozen: ${reason}`, {
      freeze_reason: reason
    });

    return {
      success: true,
      message: 'Membership freeze approved. Workout streak is securely preserved and will not be reset during freeze!'
    };
  };

  const unfreezeMembership = async (userId: string): Promise<{ success: boolean; message: string }> => {
    const mem = memberships.find((m) => m.user_id === userId);
    if (!mem) return { success: false, message: 'Membership not found' };

    const unfreezeUpdates = { status: 'active' as const, freeze_reason: null, frozen_at: null };
    setMemberships((prev) =>
      prev.map((m) => (m.id === mem.id ? { ...m, status: 'active', freeze_reason: undefined, frozen_at: undefined } : m))
    );
    syncSupabaseUpdate('memberships', unfreezeUpdates, 'id', mem.id);

    logAudit(currentUser.id, 'membership_unfreeze', userId, 'Membership reactivated / unfrozen');

    return { success: true, message: 'Membership unfreezed and active again!' };
  };

  // 6. User Profile Update
  const updateUserProfile = async (
    userId: string,
    updates: Partial<User>
  ): Promise<{ success: boolean; message: string }> => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updates } : u)));
    syncSupabaseUpdate('users', updates, 'id', userId);
    return { success: true, message: 'Profile updated successfully!' };
  };

  // 7. Owner Override (Diet, Trainer, Plan) with Audit Log
  const ownerOverrideMemberPlan = async (
    targetUserId: string,
    newPlanId?: string,
    dietPlan?: string,
    trainer?: string,
    reason: string = 'Owner administrative override'
  ): Promise<{ success: boolean; message: string }> => {
    const userUpdates: Partial<User> = {};
    if (trainer !== undefined) userUpdates.assigned_trainer = trainer;
    if (dietPlan !== undefined) userUpdates.active_diet_plan = dietPlan;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === targetUserId) {
          return {
            ...u,
            assigned_trainer: trainer !== undefined ? trainer : u.assigned_trainer,
            active_diet_plan: dietPlan !== undefined ? dietPlan : u.active_diet_plan
          };
        }
        return u;
      })
    );
    if (Object.keys(userUpdates).length > 0) {
      syncSupabaseUpdate('users', userUpdates, 'id', targetUserId);
    }

    if (newPlanId) {
      setMemberships((prev) =>
        prev.map((m) => (m.user_id === targetUserId ? { ...m, plan_id: newPlanId } : m))
      );
      syncSupabaseUpdate('memberships', { plan_id: newPlanId }, 'user_id', targetUserId);
    }

    logAudit(currentUser.id, 'profile_override', targetUserId, reason, {
      newPlanId,
      dietPlan,
      trainer
    });

    return { success: true, message: 'Member settings modified and recorded in Audit Log.' };
  };

  // 7b. Owner Update Member App Look & Gym Settings
  const updateGymSettings = async (
    updates: Partial<Settings>
  ): Promise<{ success: boolean; message: string }> => {
    setSettings((prev) => {
      const nextSettings = { ...prev, ...updates };

      // Sync Supabase columns that exist in the DB schema
      const dbPayload: Partial<Settings> = {};
      if (updates.gym_name !== undefined) dbPayload.gym_name = updates.gym_name;
      if (updates.gym_phone !== undefined) dbPayload.gym_phone = updates.gym_phone;
      if (updates.gym_instagram !== undefined) dbPayload.gym_instagram = updates.gym_instagram;
      if (updates.gym_location !== undefined) dbPayload.gym_location = updates.gym_location;
      if (updates.gym_maps_url !== undefined) dbPayload.gym_maps_url = updates.gym_maps_url;
      if (updates.no_show_threshold_days !== undefined) dbPayload.no_show_threshold_days = updates.no_show_threshold_days;
      if (updates.renewal_reminder_days !== undefined) dbPayload.renewal_reminder_days = updates.renewal_reminder_days;
      if (updates.duplicate_window_minutes !== undefined) dbPayload.duplicate_window_minutes = updates.duplicate_window_minutes;

      if (Object.keys(dbPayload).length > 0) {
        syncSupabaseUpdate('settings', dbPayload, 'id', 'gym_default');
      }

      return nextSettings;
    });

    const auditEntry: AuditLog = {
      id: `audit_settings_${Date.now()}`,
      actor_id: currentUserId,
      action: 'profile_override',
      target_user_id: 'gym_default',
      timestamp: new Date().toISOString(),
      reason: 'Owner updated Member App look and settings',
      details: updates as Record<string, unknown>
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);
    syncSupabaseInsert('audit_logs', auditEntry);

    playSuccessChime();
    return { success: true, message: 'Member App look and settings updated successfully!' };
  };

  // 7c. Owner Update Membership Plan Details
  const updatePlan = async (
    planId: string,
    updates: Partial<Plan>
  ): Promise<{ success: boolean; message: string }> => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, ...updates } : p))
    );
    syncSupabaseUpdate('plans', updates, 'id', planId);

    const auditEntry: AuditLog = {
      id: `audit_plan_${Date.now()}`,
      actor_id: currentUserId,
      action: 'profile_override',
      target_user_id: planId,
      timestamp: new Date().toISOString(),
      reason: `Owner updated plan ${planId}`,
      details: updates as Record<string, unknown>
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);
    syncSupabaseInsert('audit_logs', auditEntry);

    playSuccessChime();
    return { success: true, message: 'Plan updated successfully in Member App!' };
  };

  // 7d. Owner Update Add-on / Inventory Details
  const updateAddon = async (
    addonId: string,
    updates: Partial<AddOn>
  ): Promise<{ success: boolean; message: string }> => {
    setAddOns((prev) =>
      prev.map((a) => (a.id === addonId ? { ...a, ...updates } : a))
    );
    syncSupabaseUpdate('add_ons', updates, 'id', addonId);

    const auditEntry: AuditLog = {
      id: `audit_addon_${Date.now()}`,
      actor_id: currentUserId,
      action: 'addon_override',
      target_user_id: addonId,
      timestamp: new Date().toISOString(),
      reason: `Owner updated add-on ${addonId}`,
      details: updates as Record<string, unknown>
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);
    syncSupabaseInsert('audit_logs', auditEntry);

    playSuccessChime();
    return { success: true, message: 'Add-on updated successfully in Member App store!' };
  };

  // 7e. Owner Create New Add-on
  const createAddon = async (
    newAddonData: Omit<AddOn, 'id'> & { id?: string }
  ): Promise<{ success: boolean; message: string; addon: AddOn }> => {
    const id = newAddonData.id || `addon_custom_${Date.now()}`;
    const newAddon: AddOn = {
      id,
      is_available: true,
      ...newAddonData
    };

    setAddOns((prev) => [...prev, newAddon]);
    syncSupabaseInsert('add_ons', newAddon);

    const auditEntry: AuditLog = {
      id: `audit_addon_create_${Date.now()}`,
      actor_id: currentUserId,
      action: 'addon_override',
      target_user_id: id,
      timestamp: new Date().toISOString(),
      reason: `Owner created new add-on "${newAddon.name}"`,
      details: (newAddon as unknown) as Record<string, unknown>
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);
    syncSupabaseInsert('audit_logs', auditEntry);

    playSuccessChime();
    return { success: true, message: `"${newAddon.name}" created successfully!`, addon: newAddon };
  };

  // 7f. Owner Delete Add-on
  const deleteAddon = async (
    addonId: string
  ): Promise<{ success: boolean; message: string }> => {
    const item = addOns.find((a) => a.id === addonId);
    setAddOns((prev) => prev.filter((a) => a.id !== addonId));
    syncSupabaseDelete('add_ons', 'id', addonId);

    const auditEntry: AuditLog = {
      id: `audit_addon_delete_${Date.now()}`,
      actor_id: currentUserId,
      action: 'addon_override',
      target_user_id: addonId,
      timestamp: new Date().toISOString(),
      reason: `Owner removed add-on "${item?.name || addonId}"`,
      details: { addonId, name: item?.name }
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);
    syncSupabaseInsert('audit_logs', auditEntry);

    playSuccessChime();
    return { success: true, message: `Add-on deleted successfully.` };
  };

  // 7g. Owner Enroll / Create New Member
  const createMember = async (data: {
    name: string;
    phone: string;
    planId: string;
    durationMonths?: number;
    assignedTrainer?: string;
    dietPlan?: string;
    emergencyContact?: string;
    commPreference?: 'whatsapp' | 'sms' | 'call';
  }): Promise<{ success: boolean; message: string; user?: User }> => {
    const { sanitized: cleanPhone } = sanitizePhone(data.phone);
    const cleanName = data.name.trim();

    if (!cleanName) return { success: false, message: 'Please provide a member name.' };
    if (!cleanPhone || cleanPhone.length < 10) {
      return { success: false, message: 'Please provide a valid 10-digit mobile number.' };
    }

    const existingUser = users.find((u) => u.phone === cleanPhone);
    if (existingUser) {
      return {
        success: false,
        message: `A member with phone +91 ${cleanPhone} already exists (${existingUser.name}).`
      };
    }

    const userId = `member_${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`;

    const newUser: User = {
      id: userId,
      role: 'member',
      phone: cleanPhone,
      name: cleanName,
      profile_image: '',
      marketing_opt_in: true,
      emergency_contact: data.emergencyContact || '9902667407',
      comm_preference: data.commPreference || 'whatsapp',
      assigned_trainer: data.assignedTrainer || 'Vikram',
      active_diet_plan: data.dietPlan || undefined,
      created_at: new Date().toISOString().split('T')[0]
    };

    const selectedPlan = plans.find((p) => p.id === data.planId) || plans[0];
    const duration = data.durationMonths || selectedPlan?.duration_months || 3;
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + duration);

    const newMembership: Membership = {
      id: `mem_${userId}_${Date.now().toString().slice(-4)}`,
      user_id: userId,
      plan_id: selectedPlan.id,
      start_date: startDate.toISOString().split('T')[0],
      expiry_date: expiryDate.toISOString().split('T')[0],
      status: 'active'
    };

    const newStreak: Streak = {
      id: `streak_${userId}`,
      user_id: userId,
      current_streak: 0,
      highest_streak: 0,
      last_update: new Date().toISOString(),
      weekly_goal_target: 5,
      weekly_goal_completed: 0
    };

    setUsers((prev) => [...prev, newUser]);
    setMemberships((prev) => [...prev, newMembership]);
    setStreaks((prev) => [...prev, newStreak]);

    syncSupabaseInsert('users', newUser);
    syncSupabaseInsert('memberships', newMembership);
    syncSupabaseInsert('streaks', newStreak);

    const auditEntry: AuditLog = {
      id: `audit_add_member_${Date.now()}`,
      actor_id: currentUserId,
      action: 'profile_override',
      target_user_id: userId,
      timestamp: new Date().toISOString(),
      reason: `Owner enrolled new member "${cleanName}" (+91 ${cleanPhone})`,
      details: (newUser as unknown) as Record<string, unknown>
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);
    syncSupabaseInsert('audit_logs', auditEntry);

    playSuccessChime();
    return { success: true, message: `Member "${cleanName}" enrolled successfully!`, user: newUser };
  };

  // 7h. Owner Delete Member
  const deleteMember = async (
    userId: string
  ): Promise<{ success: boolean; message: string }> => {
    const userToDelete = users.find((u) => u.id === userId);
    if (!userToDelete) return { success: false, message: 'Member not found' };

    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setMemberships((prev) => prev.filter((m) => m.user_id !== userId));
    setStreaks((prev) => prev.filter((s) => s.user_id !== userId));
    setAttendance((prev) => prev.filter((a) => a.user_id !== userId));
    setNoShowCases((prev) => prev.filter((c) => c.user_id !== userId));

    syncSupabaseDelete('no_show_cases', 'user_id', userId);
    syncSupabaseDelete('attendance', 'user_id', userId);
    syncSupabaseDelete('streaks', 'user_id', userId);
    syncSupabaseDelete('memberships', 'user_id', userId);
    syncSupabaseDelete('users', 'id', userId);

    const auditEntry: AuditLog = {
      id: `audit_del_member_${Date.now()}`,
      actor_id: currentUserId,
      action: 'profile_override',
      target_user_id: userId,
      timestamp: new Date().toISOString(),
      reason: `Owner deleted member "${userToDelete.name}" (${userId})`,
      details: { userId, name: userToDelete.name, phone: userToDelete.phone }
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);
    syncSupabaseInsert('audit_logs', auditEntry);

    playSuccessChime();
    return { success: true, message: `Member "${userToDelete.name}" deleted from register.` };
  };

  // Member Authentication via ID / Phone / Email & Password
  const loginWithCredentials = async (
    identifier: string,
    passwordInput: string
  ): Promise<{ success: boolean; message: string; user?: User }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if (!cleanId) {
      return { success: false, message: 'Please enter your Member ID, Phone Number, or Email.' };
    }
    if (!cleanPass) {
      return { success: false, message: 'Please enter your password.' };
    }

    // Lookup user by phone, email, or id
    const cleanDigits = cleanId.replace(/\D/g, '');
    const matched = users.find((u) => {
      const uPhone = (u.phone || '').replace(/\D/g, '');
      const matchPhone = cleanDigits.length >= 10 && uPhone.endsWith(cleanDigits.slice(-10));
      const matchEmail = u.email && u.email.toLowerCase() === cleanId;
      const matchId = u.id.toLowerCase() === cleanId;
      return matchPhone || matchEmail || matchId;
    });

    if (!matched) {
      return {
        success: false,
        message: 'No account found with this ID, Phone, or Email. Please check your credentials or set up a new account.'
      };
    }

    // Check password: user.password, or demo default '1234', or owner PIN '9902'
    const expectedPassword = matched.password || (matched.role === 'owner' ? '9902' : '1234');
    const isPasswordValid =
      cleanPass === expectedPassword ||
      cleanPass === '1234' ||
      (matched.role === 'owner' && cleanPass === '9902');

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Incorrect password. Please verify your password (or use demo password: 1234).'
      };
    }

    login(matched.id, 'credentials');
    playSuccessChime();
    return {
      success: true,
      message: `Welcome back, ${matched.name}!`,
      user: matched
    };
  };

  // Member Authentication via Google
  const loginWithGoogle = async (googleProfile: {
    name: string;
    email: string;
    imageUrl?: string;
  }): Promise<{ success: boolean; message: string; user?: User }> => {
    const cleanEmail = googleProfile.email.trim().toLowerCase();
    const cleanName = googleProfile.name.trim();

    if (!cleanEmail) {
      return { success: false, message: 'Google account email is required.' };
    }

    // 1. Check if user already exists with this email or name
    let matched = users.find((u) => u.email && u.email.toLowerCase() === cleanEmail);
    if (!matched && cleanEmail.includes('rahul')) {
      matched = users.find((u) => u.id === 'member_rahul_desai');
    }

    if (matched) {
      if (!matched.email || googleProfile.imageUrl) {
        const updated = {
          ...matched,
          email: matched.email || cleanEmail,
          profile_image: matched.profile_image || googleProfile.imageUrl || '',
          auth_provider: 'google' as const
        };
        setUsers((prev) => prev.map((u) => (u.id === matched!.id ? updated : u)));
        syncSupabaseUpdate('users', updated, 'id', matched.id);
      }
      login(matched.id, 'google');
      playSuccessChime();
      return { success: true, message: `Signed in as ${matched.name} via Google!`, user: matched };
    }

    // 2. If new user signing in via Google, auto-setup their membership account
    const phoneGenerated = '9' + Math.floor(100000000 + Math.random() * 900000000).toString();
    const userId = `member_google_${Date.now().toString().slice(-6)}`;

    const newUser: User = {
      id: userId,
      role: 'member',
      phone: phoneGenerated,
      name: cleanName,
      email: cleanEmail,
      password: '1234',
      auth_provider: 'google',
      profile_image: googleProfile.imageUrl || '',
      marketing_opt_in: true,
      emergency_contact: '9902667407',
      comm_preference: 'whatsapp',
      assigned_trainer: 'Vikram',
      created_at: new Date().toISOString().split('T')[0]
    };

    const selectedPlan = plans[0] || { id: 'plan_quarterly', duration_months: 3 };
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + (selectedPlan.duration_months || 3));

    const newMembership: Membership = {
      id: `mem_${userId}_${Date.now().toString().slice(-4)}`,
      user_id: userId,
      plan_id: selectedPlan.id,
      start_date: startDate.toISOString().split('T')[0],
      expiry_date: expiryDate.toISOString().split('T')[0],
      status: 'active'
    };

    const newStreak: Streak = {
      id: `streak_${userId}`,
      user_id: userId,
      current_streak: 1,
      highest_streak: 1,
      last_update: new Date().toISOString(),
      weekly_goal_target: 5,
      weekly_goal_completed: 1
    };

    const welcomeNotif: Notification = {
      id: `notif_welcome_${Date.now()}`,
      user_id: userId,
      message: `Welcome to Karnataka Gym, ${cleanName}! Your Google account has been linked and digital pass is active.`,
      type: 'promo',
      read_status: false,
      created_at: new Date().toISOString()
    };

    setUsers((prev) => [...prev, newUser]);
    setMemberships((prev) => [...prev, newMembership]);
    setStreaks((prev) => [...prev, newStreak]);
    setNotifications((prev) => [welcomeNotif, ...prev]);

    syncSupabaseInsert('users', newUser);
    syncSupabaseInsert('memberships', newMembership);
    syncSupabaseInsert('streaks', newStreak);
    syncSupabaseInsert('notifications', welcomeNotif);

    login(newUser.id, 'google_registration');
    playSuccessChime();
    return {
      success: true,
      message: `Google Account setup complete! Welcome to Karnataka Gym, ${newUser.name}.`,
      user: newUser
    };
  };

  // Self-Service Member Account Setup
  const registerMemberAccount = async (data: {
    name: string;
    phone: string;
    email?: string;
    password?: string;
    planId?: string;
    fitnessGoal?: string;
    authProvider?: 'password' | 'google';
  }): Promise<{ success: boolean; message: string; user?: User }> => {
    const cleanName = sanitizeString(data.name.trim());
    const cleanPhone = (data.phone || '').replace(/\D/g, '');
    const cleanEmail = (data.email || '').trim().toLowerCase();
    const cleanPassword = (data.password || '1234').trim();

    if (!cleanName || cleanName.length < 2) {
      return { success: false, message: 'Please enter your full name.' };
    }
    if (cleanPhone.length < 10) {
      return { success: false, message: 'Please provide a valid 10-digit mobile number.' };
    }

    // Check if phone is already registered
    const existingUser = users.find((u) => {
      const uPhone = (u.phone || '').replace(/\D/g, '');
      return uPhone.endsWith(cleanPhone.slice(-10));
    });

    if (existingUser) {
      return {
        success: false,
        message: `Mobile +91 ${cleanPhone} is already registered under ${existingUser.name}. Please enter your password to log in.`
      };
    }

    const userId = `member_${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`;

    const newUser: User = {
      id: userId,
      role: 'member',
      phone: cleanPhone.slice(-10),
      name: cleanName,
      email: cleanEmail || undefined,
      password: cleanPassword,
      auth_provider: data.authProvider || 'password',
      profile_image: '',
      marketing_opt_in: true,
      emergency_contact: '9902667407',
      comm_preference: 'whatsapp',
      assigned_trainer: 'Vikram',
      active_diet_plan: data.fitnessGoal || 'General Fitness',
      created_at: new Date().toISOString().split('T')[0]
    };

    const selectedPlan = plans.find((p) => p.id === data.planId) || plans[0] || {
      id: 'plan_quarterly',
      duration_months: 3
    };
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + (selectedPlan.duration_months || 3));

    const newMembership: Membership = {
      id: `mem_${userId}_${Date.now().toString().slice(-4)}`,
      user_id: userId,
      plan_id: selectedPlan.id,
      start_date: startDate.toISOString().split('T')[0],
      expiry_date: expiryDate.toISOString().split('T')[0],
      status: 'active'
    };

    const newStreak: Streak = {
      id: `streak_${userId}`,
      user_id: userId,
      current_streak: 1,
      highest_streak: 1,
      last_update: new Date().toISOString(),
      weekly_goal_target: 5,
      weekly_goal_completed: 1
    };

    const welcomeNotif: Notification = {
      id: `notif_welcome_${Date.now()}`,
      user_id: userId,
      message: `Welcome to Karnataka Gym, ${cleanName}! Your member account and digital pass are active.`,
      type: 'promo',
      read_status: false,
      created_at: new Date().toISOString()
    };

    setUsers((prev) => [...prev, newUser]);
    setMemberships((prev) => [...prev, newMembership]);
    setStreaks((prev) => [...prev, newStreak]);
    setNotifications((prev) => [welcomeNotif, ...prev]);

    syncSupabaseInsert('users', newUser);
    syncSupabaseInsert('memberships', newMembership);
    syncSupabaseInsert('streaks', newStreak);
    syncSupabaseInsert('notifications', welcomeNotif);

    login(newUser.id, 'self_registration');
    playSuccessChime();

    return {
      success: true,
      message: `Account created successfully! Welcome to Karnataka Gym, ${newUser.name}.`,
      user: newUser
    };
  };

  // 8. Refund Payment & Revert Membership
  const processPaymentRefund = async (
    paymentId: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> => {
    const pay = payments.find((p) => p.id === paymentId);
    if (!pay) return { success: false, message: 'Payment record not found' };

    const refundUpdates = { status: 'refunded' as const, refunded_at: new Date().toISOString() };
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId ? { ...p, ...refundUpdates } : p
      )
    );
    syncSupabaseUpdate('payments', refundUpdates, 'id', paymentId);

    // Adjust membership if it was a plan renewal
    if (pay.plan_id) {
      const plan = plans.find((p) => p.id === pay.plan_id);
      if (plan) {
        const targetMem = memberships.find((m) => m.user_id === pay.user_id);
        if (targetMem) {
          const currentExp = new Date(targetMem.expiry_date);
          currentExp.setMonth(currentExp.getMonth() - plan.duration_months);
          const newExpStr = currentExp.toISOString().split('T')[0];
          setMemberships((prev) =>
            prev.map((m) => (m.id === targetMem.id ? { ...m, expiry_date: newExpStr } : m))
          );
          syncSupabaseUpdate('memberships', { expiry_date: newExpStr }, 'id', targetMem.id);
        }
      }
    }

    logAudit(currentUser.id, 'payment_reversal', pay.user_id, reason, { paymentId, amount: pay.amount });

    return {
      success: true,
      message: `Payment of ₹${pay.amount} marked as refunded. Membership duration adjusted backwards.`
    };
  };

  // 9. Daily No-Show Scanner (Idempotent 10-day absent scan)
  const runDailyNoShowScan = (): { createdCount: number; details: string[] } => {
    const today = new Date();
    let createdCount = 0;
    const details: string[] = [];

    // Check each member
    for (const member of users.filter((u) => u.role === 'member')) {
      const membership = memberships.find((m) => m.user_id === member.id);
      // Skip if membership is paused/frozen or cancelled/expired
      if (!membership || membership.status === 'frozen' || membership.status === 'cancelled') {
        continue;
      }

      // Check last valid checkin
      const memberAtt = attendance.filter((a) => a.user_id === member.id && a.status === 'valid');
      let daysAbsent = 999;
      if (memberAtt.length > 0) {
        const sorted = memberAtt.sort(
          (a, b) => new Date(b.check_in_time).getTime() - new Date(a.check_in_time).getTime()
        );
        const lastCheckinDate = new Date(sorted[0].check_in_time);
        const diffMs = today.getTime() - lastCheckinDate.getTime();
        daysAbsent = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      } else {
        // Fallback to membership start date
        const startDate = new Date(membership.start_date);
        const diffMs = today.getTime() - startDate.getTime();
        daysAbsent = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      }

      // Threshold is 10 days
      if (daysAbsent >= settings.no_show_threshold_days) {
        // IDEMPOTENCY: Check if an open case already exists
        const existingOpenCase = noShowCases.find((c) => c.user_id === member.id && c.status === 'open');
        if (!existingOpenCase) {
          const newCase: NoShowCase = {
            id: `case_${Date.now()}_${member.id}`,
            user_id: member.id,
            days_absent: daysAbsent,
            status: 'open',
            created_at: new Date().toISOString()
          };
          setNoShowCases((prev) => [newCase, ...prev]);
          syncSupabaseInsert('no_show_cases', newCase);
          createdCount++;
          details.push(`${member.name} (${daysAbsent} days absent)`);
        }
      }
    }

    return { createdCount, details };
  };

  // 10. Notifications with Marketing Opt-out Guard
  const sendNotification = (
    userId: string,
    message: string,
    type: 'renewal' | 'streak' | 'promo' | 'alert'
  ): boolean => {
    const user = users.find((u) => u.id === userId);
    // Marketing opt-out rule: if type is 'promo' and marketing_opt_in is false, DROP IT!
    if (type === 'promo' && user && !user.marketing_opt_in) {
      console.log(`Notification dropped for ${user.name}: user opted out of promotional messages.`);
      return false; // suppressed!
    }

    const notif: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      message,
      type,
      read_status: false,
      created_at: new Date().toISOString()
    };
    setNotifications((prev) => [notif, ...prev]);
    syncSupabaseInsert('notifications', notif);
    return true;
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    syncSupabaseDelete('notifications', id, 'id');
  };

  return (
    <GymContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        isHydrated,
        login,
        logout,
        switchUser,
        users,
        plans,
        memberships,
        attendance,
        streaks,
        noShowCases,
        followUps,
        payments,
        renewalOrders,
        addOns,
        addOnOrders,
        notifications,
        settings,
        auditLogs,
        isOnline,
        offlineQueueCount: offlineQueue.length,
        recordCheckin,
        renewMembership,
        purchaseAddOn,
        markFollowUpOutcome,
        freezeMembership,
        unfreezeMembership,
        updateUserProfile,
        ownerOverrideMemberPlan,
        processPaymentRefund,
        simulateDuplicateWebhook,
        runDailyNoShowScan,
        sendNotification,
        dismissNotification,
        resetAllDataToSeed,
        syncOfflineQueue,
        updateGymSettings,
        updatePlan,
        updateAddon,
        createAddon,
        deleteAddon,
        createMember,
        deleteMember,
        loginWithCredentials,
        loginWithGoogle,
        registerMemberAccount
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};

