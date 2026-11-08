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
    id: 'user_owner_riyaz',
    role: 'owner',
    phone: '9902667407',
    name: 'Riyaz (Gym Owner)',
    email: 'riyaz.gym@gmail.com',
    password: '9902',
    auth_provider: 'password',
    marketing_opt_in: true,
    emergency_contact: '9902667407',
    comm_preference: 'whatsapp',
    created_at: '2025-01-01'
  },
  // 3 Trainers
  {
    id: 'user_trainer_vikram',
    role: 'trainer',
    phone: '9845011111',
    name: 'Vikram (Coach - Strength)',
    email: 'vikram.coach@gmail.com',
    password: '1234',
    auth_provider: 'password',
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
    email: 'pooja.coach@gmail.com',
    password: '1234',
    auth_provider: 'password',
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
    email: 'rakesh.coach@gmail.com',
    password: '1234',
    auth_provider: 'password',
    marketing_opt_in: true,
    emergency_contact: '9902667407',
    comm_preference: 'call',
    created_at: '2025-01-05'
  },

  // 1 Demo Member: Rahul Desai
  {
    id: 'member_rahul_desai',
    role: 'member',
    phone: '9743247790',
    email: 'rahul.desai@gmail.com',
    password: '1234',
    auth_provider: 'password',
    name: 'Rahul Desai',
    profile_image: '',
    marketing_opt_in: true,
    emergency_contact: '9902667407',
    comm_preference: 'whatsapp',
    assigned_trainer: 'Vikram',
    active_diet_plan: 'Muscle Gain Diet Plan',
    created_at: '2025-02-15'
  }
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
  }
];

export const INITIAL_NO_SHOW_CASES: NoShowCase[] = [];

export const INITIAL_STREAKS: Streak[] = [
  {
    id: 'streak_rahul',
    user_id: 'member_rahul_desai',
    current_streak: 14,
    highest_streak: 28,
    last_update: getRelativeDate(0),
    weekly_goal_target: 5,
    weekly_goal_completed: 4
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
    notes: 'Phone battery died, verified by Coach Vikram'
  }
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
    actor_id: 'user_owner_riyaz',
    action: 'assisted_checkin',
    target_user_id: 'member_rahul_desai',
    timestamp: getRelativeDateTime(-3, 18, 15),
    reason: 'Member phone battery was completely dead. Verified identity manually.',
    details: { method: 'front_desk_override' }
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

