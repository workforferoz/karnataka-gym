import {
  User,
  Plan,
  Membership,
  Attendance,
  Streak,
  NoShowCase,
  AddOn,
  Settings,
  AuditLog,
  Payment,
  AddOnOrder,
  Notification
} from '../types/database';

export const INITIAL_SETTINGS: Settings = {
  id: 'gym_default',
  no_show_threshold_days: 10,
  renewal_reminder_days: 7,
  duplicate_window_minutes: 5,
  gym_name: 'Karnataka Gym Hubballi',
  gym_phone: '9902667407',
  gym_email: 'karnatakagymhubli@gmail.com',
  gym_tagline: 'Iron Warrior Fitness Hub',
  gym_instagram: '@riyaz_gokul',
  gym_location: 'Kalidas Nagar, Hubballi, Karnataka 580031',
  gym_maps_url: 'https://maps.app.goo.gl/dXnSdvRU9gwHd7sAA',
  member_welcome_subtitle: 'Mera Gym Dashboard',
  member_motivational_quote: 'Consistency beats intensity. Kal fir milenge gym floor par!',
  announcement_banner_active: true,
  announcement_banner_text: 'Special Morning Batch from 5:30 AM now open! Limited slots available.',
  announcement_banner_tag: 'ANNOUNCEMENT'
};

export const INITIAL_PLANS: Plan[] = [
  {
    id: 'plan_monthly',
    name: 'Monthly Fitness Plan',
    duration_months: 1,
    base_price: 1500,
    discount_amount: 0,
    tag: 'Flexible',
    features: ['General Gym Access', 'Locker Facility', 'Floor Trainer Guidance', 'Steam Bath (1x/mo)']
  },
  {
    id: 'plan_quarterly',
    name: 'Quarterly Power Plan',
    duration_months: 3,
    base_price: 4000,
    discount_amount: 300,
    tag: 'Most Popular',
    features: ['Full Gym Access', 'Free Diet Consultation', 'Locker & Shower', 'Cardio + Strength Zones']
  },
  {
    id: 'plan_half_yearly',
    name: 'Half-Yearly Transformation',
    duration_months: 6,
    base_price: 7500,
    discount_amount: 800,
    tag: 'Recommended',
    features: ['All Hours Access', '2 Free PT Sessions', 'Free Body Composition Scan', 'Dedicated Trainer Follow-up']
  },
  {
    id: 'plan_yearly',
    name: 'Yearly Iron Warrior Plan',
    duration_months: 12,
    base_price: 12000,
    discount_amount: 2000,
    tag: 'Best Value',
    features: ['Unlimited Gym Access', '4 Free PT Sessions', 'Free Gym Kit & Shaker', 'Pause Membership up to 30 days', 'Free Diet Chart Updates']
  }
];

export const INITIAL_ADDONS: AddOn[] = [
  {
    id: 'addon_pt_12',
    type: 'pt',
    name: 'Personal Training (12 Sessions)',
    price: 3000,
    validity_days: 45,
    stock: 99,
    trainer_name: 'Vikram',
    category_label: 'Personal Training',
    description: '1-on-1 personalized form correction, progressive overload programming, and weekly strength monitoring.',
    is_available: true
  },
  {
    id: 'addon_pt_pooja',
    type: 'pt',
    name: 'HIIT & Fat Loss PT (12 Sessions)',
    price: 3200,
    validity_days: 45,
    stock: 99,
    trainer_name: 'Pooja',
    category_label: 'Personal Training',
    description: 'High-intensity functional conditioning, mobility work, and endurance training with Coach Pooja.',
    is_available: true
  },
  {
    id: 'addon_pt_rakesh',
    type: 'pt',
    name: 'Bodybuilding & Hypertrophy PT',
    price: 3500,
    validity_days: 45,
    stock: 0, // Booked out to test conflict
    trainer_name: 'Rakesh',
    category_label: 'Personal Training',
    description: 'Advanced hypertrophy splits, target isolation, and stage posing prep. Currently fully booked.',
    is_available: false
  },
  {
    id: 'addon_diet_weight_loss',
    type: 'diet',
    name: 'Weight-Loss Diet Plan',
    price: 999,
    validity_days: 30,
    stock: 999,
    trainer_name: 'Pooja',
    category_label: 'Nutrition & Diet',
    description: 'Custom calorie-deficit plan tailored to North Karnataka diet: Jolada Rotti, Sprouts, Dal, and High-Protein options.',
    is_available: true
  },
  {
    id: 'addon_diet_muscle_gain',
    type: 'diet',
    name: 'Muscle Gain Diet Plan',
    price: 1199,
    validity_days: 30,
    stock: 999,
    trainer_name: 'Vikram',
    category_label: 'Nutrition & Diet',
    description: 'Macro-calculated clean surplus nutrition with local affordable whole food sources + supplement timing.',
    is_available: true
  },
  {
    id: 'addon_diet_veg_protein',
    type: 'diet',
    name: 'Veg High-Protein Nutrition Guide',
    price: 899,
    validity_days: 30,
    stock: 999,
    trainer_name: 'Pooja',
    category_label: 'Nutrition & Diet',
    description: '100% Vegetarian 120g+ daily protein meal charts with paneer, soy, lentils, and dairy.',
    is_available: true
  },
  {
    id: 'addon_whey_protein',
    type: 'supplement',
    name: 'Whey Protein 1kg (Chocolate Fudge)',
    price: 2500,
    validity_days: 365,
    stock: 5, // Strict stock: 5 units as per specification!
    category_label: 'Supplements',
    description: 'Lab-tested 24g pure whey concentrate per scoop with digestive enzymes. Available for counter pickup.',
    is_available: true
  },
  {
    id: 'addon_creatine',
    type: 'supplement',
    name: 'Creatine Monohydrate 250g',
    price: 999,
    validity_days: 365,
    stock: 8,
    category_label: 'Supplements',
    description: '100% micronized creatine monohydrate for ATP regeneration and raw strength output.',
    is_available: true
  },
  {
    id: 'addon_bcaa',
    type: 'supplement',
    name: 'BCAA Recovery Fuel 300g (Watermelon)',
    price: 1499,
    validity_days: 365,
    stock: 0, // Out of stock to test failure
    category_label: 'Supplements',
    description: '2:1:1 branched-chain amino acids for intra-workout hydration. (Stock 0: Out of Stock)',
    is_available: false
  }
];

// Helper to get formatted date string
const getRelativeDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const getRelativeDateTime = (offsetDays: number, hour: number = 7, min: number = 30): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

export const INITIAL_USERS: User[] = [
  // 1 Owner
  {
    id: 'user_owner_manjunath',
    role: 'owner',
    phone: '9902667407',
    name: 'Manjunath (Gym Owner)',
    marketing_opt_in: true,
    emergency_contact: '9902667407',
    comm_preference: 'whatsapp',
    created_at: '2025-01-01'
  },
  // 1 Front Desk
  {
    id: 'user_staff_suresh',
    role: 'front_desk',
    phone: '9888877777',
    name: 'Suresh (Front Desk)',
    marketing_opt_in: true,
    emergency_contact: '9902667407',
    comm_preference: 'call',
    created_at: '2025-01-10'
  },
  // 3 Trainers
  {
    id: 'user_trainer_vikram',
    role: 'trainer',
    phone: '9845011111',
    name: 'Vikram (Coach - Strength)',
    marketing_opt_in: true,
    emergency_contact: '9902667407',
    comm_preference: 'whatsapp',
    created_at: '2025-01-05'
  },
  {
    id: 'user_trainer_pooja',
    role: 'trainer',
    phone: '9845022222',
    name: 'Pooja (Coach - HIIT/Diet)',
    marketing_opt_in: true,
    emergency_contact: '9902667407',
    comm_preference: 'whatsapp',
    created_at: '2025-01-05'
  },
  {
    id: 'user_trainer_rakesh',
    role: 'trainer',
    phone: '9845033333',
    name: 'Rakesh (Coach - Hypertrophy)',
    marketing_opt_in: true,
    emergency_contact: '9902667407',
    comm_preference: 'call',
    created_at: '2025-01-05'
  },

  // 30 Members with authentic Indian names (Hubli / Karnataka region)
  // Member 1 (Logged-in demo member: Rahul Desai)
  {
    id: 'member_rahul_desai',
    role: 'member',
    phone: '9743247790',
    name: 'Rahul Desai',
    profile_image: '',
    marketing_opt_in: true,
    emergency_contact: '9902667407',
    comm_preference: 'whatsapp',
    assigned_trainer: 'Vikram',
    active_diet_plan: 'Muscle Gain Diet Plan',
    created_at: '2025-02-15'
  },

  // Members 2-6: Expiring in 4 days (5 members)
  {
    id: 'member_priya_patil',
    role: 'member',
    phone: '9845112233',
    name: 'Priya Patil',
    marketing_opt_in: true,
    emergency_contact: '9845112200',
    comm_preference: 'whatsapp',
    assigned_trainer: 'Pooja',
    active_diet_plan: 'Weight-Loss Diet Plan',
    created_at: '2025-03-01'
  },
  {
    id: 'member_rohan_kulkarni',
    role: 'member',
    phone: '9845223344',
    name: 'Rohan Kulkarni',
    marketing_opt_in: true,
    emergency_contact: '9845223300',
    comm_preference: 'call',
    assigned_trainer: 'Vikram',
    created_at: '2025-02-20'
  },
  {
    id: 'member_sneha_joshi',
    role: 'member',
    phone: '9845334455',
    name: 'Sneha Joshi',
    marketing_opt_in: false, // Marketing opted out to test!
    emergency_contact: '9845334400',
    comm_preference: 'whatsapp',
    assigned_trainer: 'Pooja',
    active_diet_plan: 'Veg High-Protein Nutrition Guide',
    created_at: '2025-02-10'
  },
  {
    id: 'member_manoj_nayak',
    role: 'member',
    phone: '9845445566',
    name: 'Manoj Nayak',
    marketing_opt_in: true,
    emergency_contact: '9845445500',
    comm_preference: 'sms',
    assigned_trainer: 'Rakesh',
    created_at: '2025-01-25'
  },
  {
    id: 'member_amit_sharma',
    role: 'member',
    phone: '9845556677',
    name: 'Amit Sharma',
    marketing_opt_in: true,
    emergency_contact: '9845556600',
    comm_preference: 'whatsapp',
    assigned_trainer: 'Vikram',
    created_at: '2025-02-01'
  },

  // Members 7-12: Absent for 12-18 days (6 members on Churn Red-List)
  {
    id: 'member_prakash_hubli',
    role: 'member',
    phone: '9740110001',
    name: 'Prakash Hubli',
    marketing_opt_in: true,
    emergency_contact: '9740110099',
    comm_preference: 'whatsapp',
    assigned_trainer: 'Vikram',
    created_at: '2025-01-10'
  },
  {
    id: 'member_sunita_rao',
    role: 'member',
    phone: '9740110002',
    name: 'Sunita Rao',
    marketing_opt_in: true,
    emergency_contact: '9740110098',
    comm_preference: 'call',
    assigned_trainer: 'Pooja',
    created_at: '2025-01-12'
  },
  {
    id: 'member_vinod_angadi',
    role: 'member',
    phone: '9740110003',
    name: 'Vinod Angadi',
    marketing_opt_in: true,
    emergency_contact: '9740110097',
    comm_preference: 'whatsapp',
    assigned_trainer: 'Rakesh',
    created_at: '2025-01-15'
  },
  {
    id: 'member_ramesh_pujari',
    role: 'member',
    phone: '9740110004',
    name: 'Ramesh Pujari',
    marketing_opt_in: true,
    emergency_contact: '9740110096',
    comm_preference: 'sms',
    assigned_trainer: 'Vikram',
    created_at: '2025-01-18'
  },
  {
    id: 'member_deepak_hiremath',
    role: 'member',
    phone: '9740110005',
    name: 'Deepak Hiremath',
    marketing_opt_in: true,
    emergency_contact: '9740110095',
    comm_preference: 'whatsapp',
    assigned_trainer: 'Rakesh',
    created_at: '2025-01-20'
  },
  {
    id: 'member_kavya_hegde',
    role: 'member',
    phone: '9740110006',
    name: 'Kavya Hegde',
    marketing_opt_in: true,
    emergency_contact: '9740110094',
    comm_preference: 'whatsapp',
    assigned_trainer: 'Pooja',
    created_at: '2025-01-22'
  },

  // Members 13-30: Regular Active Members
  { id: 'm13', role: 'member', phone: '9740220013', name: 'Anand Shettar', marketing_opt_in: true, comm_preference: 'whatsapp', assigned_trainer: 'Vikram', created_at: '2025-03-10' },
  { id: 'm14', role: 'member', phone: '9740220014', name: 'Sachin Patil', marketing_opt_in: true, comm_preference: 'whatsapp', assigned_trainer: 'Vikram', created_at: '2025-03-05' },
  { id: 'm15', role: 'member', phone: '9740220015', name: 'Vijay Kumar Badiger', marketing_opt_in: true, comm_preference: 'call', assigned_trainer: 'Rakesh', created_at: '2025-03-08' },
  { id: 'm16', role: 'member', phone: '9740220016', name: 'Naveen Gouda', marketing_opt_in: true, comm_preference: 'whatsapp', assigned_trainer: 'Vikram', created_at: '2025-03-12' },
  { id: 'm17', role: 'member', phone: '9740220017', name: 'Shilpa Dharwadkar', marketing_opt_in: true, comm_preference: 'sms', assigned_trainer: 'Pooja', created_at: '2025-03-14' },
  { id: 'm18', role: 'member', phone: '9740220018', name: 'Basavaraj Bommai', marketing_opt_in: true, comm_preference: 'whatsapp', assigned_trainer: 'Rakesh', created_at: '2025-03-15' },
  { id: 'm19', role: 'member', phone: '9740220019', name: 'Santosh Havaldar', marketing_opt_in: true, comm_preference: 'call', assigned_trainer: 'Vikram', created_at: '2025-03-16' },
  { id: 'm20', role: 'member', phone: '9740220020', name: 'Megha Belagavi', marketing_opt_in: true, comm_preference: 'whatsapp', assigned_trainer: 'Pooja', created_at: '2025-03-18' },
  { id: 'm21', role: 'member', phone: '9740220021', name: 'Girish Koppal', marketing_opt_in: true, comm_preference: 'whatsapp', assigned_trainer: 'Vikram', created_at: '2025-03-20' },
  { id: 'm22', role: 'member', phone: '9740220022', name: 'Arun Koliwad', marketing_opt_in: true, comm_preference: 'whatsapp', assigned_trainer: 'Rakesh', created_at: '2025-03-22' },
  { id: 'm23', role: 'member', phone: '9740220023', name: 'Geeta Mudhol', marketing_opt_in: true, comm_preference: 'call', assigned_trainer: 'Pooja', created_at: '2025-03-25' },
  { id: 'm24', role: 'member', phone: '9740220024', name: 'Jagadish Kundagol', marketing_opt_in: true, comm_preference: 'whatsapp', assigned_trainer: 'Vikram', created_at: '2025-03-26' },
  { id: 'm25', role: 'member', phone: '9740220025', name: 'Laxmi Navalgund', marketing_opt_in: true, comm_preference: 'whatsapp', assigned_trainer: 'Pooja', created_at: '2025-03-28' },
  { id: 'm26', role: 'member', phone: '9740220026', name: 'Mahesh Byahatti', marketing_opt_in: true, comm_preference: 'sms', assigned_trainer: 'Rakesh', created_at: '2025-03-29' },
  { id: 'm27', role: 'member', phone: '9740220027', name: 'Kiran Kalghatgi', marketing_opt_in: true, comm_preference: 'whatsapp', assigned_trainer: 'Vikram', created_at: '2025-04-01' },
  { id: 'm28', role: 'member', phone: '9740220028', name: 'Rekha Shirahatti', marketing_opt_in: true, comm_preference: 'call', assigned_trainer: 'Pooja', created_at: '2025-04-02' },
  { id: 'm29', role: 'member', phone: '9740220029', name: 'Chetan Gokak', marketing_opt_in: true, comm_preference: 'whatsapp', assigned_trainer: 'Rakesh', created_at: '2025-04-03' },
  { id: 'm30', role: 'member', phone: '9740220030', name: 'Sowmya Ron', marketing_opt_in: true, comm_preference: 'whatsapp', assigned_trainer: 'Pooja', created_at: '2025-04-04' }
];

export const INITIAL_MEMBERSHIPS: Membership[] = [
  // Rahul Desai (Active, expires in 45 days)
  {
    id: 'mem_rahul',
    user_id: 'member_rahul_desai',
    plan_id: 'plan_yearly',
    start_date: getRelativeDate(-320),
    expiry_date: getRelativeDate(45),
    status: 'active'
  },
  // 5 Members Expiring in 4 days!
  {
    id: 'mem_priya',
    user_id: 'member_priya_patil',
    plan_id: 'plan_quarterly',
    start_date: getRelativeDate(-86),
    expiry_date: getRelativeDate(4),
    status: 'active'
  },
  {
    id: 'mem_rohan',
    user_id: 'member_rohan_kulkarni',
    plan_id: 'plan_monthly',
    start_date: getRelativeDate(-26),
    expiry_date: getRelativeDate(4),
    status: 'active'
  },
  {
    id: 'mem_sneha',
    user_id: 'member_sneha_joshi',
    plan_id: 'plan_half_yearly',
    start_date: getRelativeDate(-176),
    expiry_date: getRelativeDate(4),
    status: 'active'
  },
  {
    id: 'mem_manoj',
    user_id: 'member_manoj_nayak',
    plan_id: 'plan_quarterly',
    start_date: getRelativeDate(-86),
    expiry_date: getRelativeDate(4),
    status: 'active'
  },
  {
    id: 'mem_amit',
    user_id: 'member_amit_sharma',
    plan_id: 'plan_monthly',
    start_date: getRelativeDate(-26),
    expiry_date: getRelativeDate(4),
    status: 'active'
  },

  // 6 Members Absent 12-18 days (still have valid memberships so they qualify for no-show scan)
  {
    id: 'mem_prakash',
    user_id: 'member_prakash_hubli',
    plan_id: 'plan_quarterly',
    start_date: getRelativeDate(-60),
    expiry_date: getRelativeDate(30),
    status: 'active'
  },
  {
    id: 'mem_sunita',
    user_id: 'member_sunita_rao',
    plan_id: 'plan_half_yearly',
    start_date: getRelativeDate(-100),
    expiry_date: getRelativeDate(80),
    status: 'active'
  },
  {
    id: 'mem_vinod',
    user_id: 'member_vinod_angadi',
    plan_id: 'plan_yearly',
    start_date: getRelativeDate(-200),
    expiry_date: getRelativeDate(165),
    status: 'active'
  },
  {
    id: 'mem_ramesh',
    user_id: 'member_ramesh_pujari',
    plan_id: 'plan_quarterly',
    start_date: getRelativeDate(-50),
    expiry_date: getRelativeDate(40),
    status: 'active'
  },
  {
    id: 'mem_deepak',
    user_id: 'member_deepak_hiremath',
    plan_id: 'plan_monthly',
    start_date: getRelativeDate(-20),
    expiry_date: getRelativeDate(10),
    status: 'active'
  },
  {
    id: 'mem_kavya',
    user_id: 'member_kavya_hegde',
    plan_id: 'plan_half_yearly',
    start_date: getRelativeDate(-90),
    expiry_date: getRelativeDate(90),
    status: 'active'
  },

  // Members 13-30
  ...['m13', 'm14', 'm15', 'm16', 'm17', 'm18', 'm19', 'm20', 'm21', 'm22', 'm23', 'm24', 'm25', 'm26', 'm27', 'm28', 'm29', 'm30'].map((uid, idx) => ({
    id: `mem_${uid}`,
    user_id: uid,
    plan_id: idx % 2 === 0 ? 'plan_quarterly' : 'plan_half_yearly',
    start_date: getRelativeDate(-40),
    expiry_date: getRelativeDate(50 + idx * 5),
    status: 'active' as const
  }))
];

export const INITIAL_NO_SHOW_CASES: NoShowCase[] = [
  {
    id: 'case_prakash',
    user_id: 'member_prakash_hubli',
    days_absent: 18,
    status: 'open',
    created_at: getRelativeDateTime(-8)
  },
  {
    id: 'case_sunita',
    user_id: 'member_sunita_rao',
    days_absent: 16,
    status: 'open',
    created_at: getRelativeDateTime(-6)
  },
  {
    id: 'case_vinod',
    user_id: 'member_vinod_angadi',
    days_absent: 15,
    status: 'open',
    created_at: getRelativeDateTime(-5)
  },
  {
    id: 'case_ramesh',
    user_id: 'member_ramesh_pujari',
    days_absent: 14,
    status: 'open',
    created_at: getRelativeDateTime(-4)
  },
  {
    id: 'case_deepak',
    user_id: 'member_deepak_hiremath',
    days_absent: 13,
    status: 'open',
    created_at: getRelativeDateTime(-3)
  },
  {
    id: 'case_kavya',
    user_id: 'member_kavya_hegde',
    days_absent: 12,
    status: 'open',
    created_at: getRelativeDateTime(-2)
  }
];

export const INITIAL_STREAKS: Streak[] = [
  {
    id: 'streak_rahul',
    user_id: 'member_rahul_desai',
    current_streak: 14,
    highest_streak: 28,
    last_update: getRelativeDate(0),
    weekly_goal_target: 5,
    weekly_goal_completed: 4
  },
  {
    id: 'streak_priya',
    user_id: 'member_priya_patil',
    current_streak: 6,
    highest_streak: 12,
    last_update: getRelativeDate(0),
    weekly_goal_target: 4,
    weekly_goal_completed: 3
  },
  {
    id: 'streak_rohan',
    user_id: 'member_rohan_kulkarni',
    current_streak: 3,
    highest_streak: 15,
    last_update: getRelativeDate(-1),
    weekly_goal_target: 5,
    weekly_goal_completed: 2
  },
  // For the absent members, current streak is 0
  {
    id: 'streak_prakash',
    user_id: 'member_prakash_hubli',
    current_streak: 0,
    highest_streak: 22,
    last_update: getRelativeDate(-18),
    weekly_goal_target: 5,
    weekly_goal_completed: 0
  },
  {
    id: 'streak_sunita',
    user_id: 'member_sunita_rao',
    current_streak: 0,
    highest_streak: 18,
    last_update: getRelativeDate(-16),
    weekly_goal_target: 4,
    weekly_goal_completed: 0
  },
  {
    id: 'streak_vinod',
    user_id: 'member_vinod_angadi',
    current_streak: 0,
    highest_streak: 10,
    last_update: getRelativeDate(-15),
    weekly_goal_target: 5,
    weekly_goal_completed: 0
  },
  {
    id: 'streak_ramesh',
    user_id: 'member_ramesh_pujari',
    current_streak: 0,
    highest_streak: 14,
    last_update: getRelativeDate(-14),
    weekly_goal_target: 5,
    weekly_goal_completed: 0
  },
  {
    id: 'streak_deepak',
    user_id: 'member_deepak_hiremath',
    current_streak: 0,
    highest_streak: 9,
    last_update: getRelativeDate(-13),
    weekly_goal_target: 4,
    weekly_goal_completed: 0
  },
  {
    id: 'streak_kavya',
    user_id: 'member_kavya_hegde',
    current_streak: 0,
    highest_streak: 19,
    last_update: getRelativeDate(-12),
    weekly_goal_target: 5,
    weekly_goal_completed: 0
  }
];

export const INITIAL_ATTENDANCE: Attendance[] = [
  // Rahul Desai's recent attendance
  {
    id: 'att_r_today',
    user_id: 'member_rahul_desai',
    check_in_time: getRelativeDateTime(0, 6, 45),
    method: 'qr',
    status: 'valid'
  },
  {
    id: 'att_r_yesterday',
    user_id: 'member_rahul_desai',
    check_in_time: getRelativeDateTime(-1, 7, 10),
    method: 'qr',
    status: 'valid'
  },
  {
    id: 'att_r_2days',
    user_id: 'member_rahul_desai',
    check_in_time: getRelativeDateTime(-2, 6, 50),
    method: 'qr',
    status: 'valid'
  },
  {
    id: 'att_r_3days',
    user_id: 'member_rahul_desai',
    check_in_time: getRelativeDateTime(-3, 18, 15),
    method: 'assisted',
    status: 'valid',
    notes: 'Phone battery died, verified by Suresh'
  },
  // Today's gym check-ins (18 check-ins for owner dashboard)
  ...['m13', 'm14', 'm15', 'm16', 'm17', 'm18', 'm19', 'm20', 'm21', 'm22', 'm23', 'm24', 'm25', 'm26', 'member_priya_patil', 'member_amit_sharma'].map((uid, idx) => ({
    id: `att_today_${uid}`,
    user_id: uid,
    check_in_time: getRelativeDateTime(0, 6 + (idx % 12), 15 + (idx * 2) % 45),
    method: (idx % 4 === 0 ? 'assisted' : 'qr') as 'assisted' | 'qr',
    status: 'valid' as const
  }))
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    user_id: 'member_rahul_desai',
    message: '🔥 Dhamakedar Streak! You have completed 14 consecutive workout days at Karnataka Gym!',
    type: 'streak',
    read_status: false,
    created_at: getRelativeDateTime(0, 7, 0)
  },
  {
    id: 'notif_2',
    user_id: 'member_priya_patil',
    message: '⚠️ Renew Aaj Hi Karein: Your Quarterly membership expires in 4 days. Renew now to retain your slot!',
    type: 'renewal',
    read_status: false,
    created_at: getRelativeDateTime(-1, 9, 0),
    action_url: '/member/renew'
  },
  {
    id: 'notif_promo',
    user_id: 'member_rahul_desai',
    message: '💥 Hubballi Fitness Fest! Get ₹500 off on 12-Month Iron Warrior plan this weekend.',
    type: 'promo',
    read_status: true,
    created_at: getRelativeDateTime(-3, 10, 0)
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit_init_1',
    actor_id: 'user_staff_suresh',
    action: 'assisted_checkin',
    target_user_id: 'member_rahul_desai',
    timestamp: getRelativeDateTime(-3, 18, 15),
    reason: 'Member phone battery was completely dead. Verified identity manually.',
    details: { method: 'front_desk_override' }
  },
  {
    id: 'audit_init_2',
    actor_id: 'user_owner_manjunath',
    action: 'addon_override',
    target_user_id: 'member_priya_patil',
    timestamp: getRelativeDateTime(-10, 11, 30),
    reason: 'Upgraded diet plan to Weight-Loss per trainer recommendation.',
    details: { trainer: 'Pooja', plan: 'Weight-Loss Diet Plan' }
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay_rahul_1',
    user_id: 'member_rahul_desai',
    amount: 10000,
    status: 'paid',
    transaction_id: 'TXN_KG_9902667407_INIT_1',
    plan_id: 'plan_yearly',
    created_at: getRelativeDateTime(-320)
  },
  {
    id: 'pay_addon_1',
    user_id: 'member_rahul_desai',
    amount: 999,
    status: 'paid',
    transaction_id: 'TXN_KG_ADDON_8812',
    addon_id: 'addon_diet_muscle_gain',
    created_at: getRelativeDateTime(-15)
  }
];

export const INITIAL_ADDON_ORDERS: AddOnOrder[] = [
  {
    id: 'order_1',
    user_id: 'member_rahul_desai',
    addon_id: 'addon_diet_muscle_gain',
    payment_id: 'pay_addon_1',
    status: 'active',
    trainer_name: 'Vikram',
    purchased_at: getRelativeDateTime(-15),
    expiry_date: getRelativeDate(15)
  }
];

