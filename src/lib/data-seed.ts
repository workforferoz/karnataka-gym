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
  gym_name: 'Karnataka Gym',
  gym_phone: '9902667407',
  gym_instagram: '@riyaz_gokul',
  gym_location: 'Kalidas Nagar, Hubballi, Karnataka 580031',
  gym_maps_url: 'https://maps.app.goo.gl/dXnSdvRU9gwHd7sAA'
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
    trainer_name: 'Coach Riyaz',
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
    trainer_name: 'Trainer',
    category_label: 'Personal Training',
    description: 'High-intensity functional conditioning, mobility work, and endurance training.',
    is_available: true
  },
  {
    id: 'addon_pt_rakesh',
    type: 'pt',
    name: 'Bodybuilding & Hypertrophy PT',
    price: 3500,
    validity_days: 45,
    stock: 0,
    trainer_name: 'Trainer',
    category_label: 'Personal Training',
    description: 'Advanced hypertrophy splits, target isolation, and stage posing prep.',
    is_available: false
  },
  {
    id: 'addon_diet_weight_loss',
    type: 'diet',
    name: 'Weight-Loss Diet Plan',
    price: 999,
    validity_days: 30,
    stock: 999,
    trainer_name: 'Coach Riyaz',
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
    trainer_name: 'Coach Riyaz',
    category_label: 'Nutrition & Diet',
    description: 'High-protein surplus meal programming, timing protocols, and micronutrient balancing for hypertrophy.',
    is_available: true
  },
  {
    id: 'addon_diet_keto',
    type: 'diet',
    name: 'Custom Keto Transformation',
    price: 1499,
    validity_days: 30,
    stock: 999,
    trainer_name: 'Coach Riyaz',
    category_label: 'Nutrition & Diet',
    description: 'Therapeutic ketogenic plan: high healthy fats, moderate protein, under 25g net carbs per day.',
    is_available: true
  },
  {
    id: 'addon_whey_gold',
    type: 'supplement',
    name: '100% Whey Protein Isolate 1kg (Chocolate)',
    price: 2499,
    validity_days: 365,
    stock: 12,
    category_label: 'Supplements',
    description: 'Ultra-filtered whey protein isolate providing 27g pure protein per scoop. Labdoor certified.',
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
    stock: 0,
    category_label: 'Supplements',
    description: '2:1:1 branched-chain amino acids for intra-workout hydration.',
    is_available: false
  }
];

export const INITIAL_USERS: User[] = [
  // Gym Owner
  {
    id: 'user_owner_riyaz',
    role: 'owner',
    phone: '9902667407',
    name: 'Riyaz (Gym Owner)',
    marketing_opt_in: true,
    emergency_contact: '9902667407',
    comm_preference: 'whatsapp',
    created_at: '2025-01-01'
  }
];

export const INITIAL_MEMBERSHIPS: Membership[] = [];
export const INITIAL_NO_SHOW_CASES: NoShowCase[] = [];
export const INITIAL_STREAKS: Streak[] = [];
export const INITIAL_ATTENDANCE: Attendance[] = [];
export const INITIAL_NOTIFICATIONS: Notification[] = [];
export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
export const INITIAL_PAYMENTS: Payment[] = [];
export const INITIAL_ADDON_ORDERS: AddOnOrder[] = [];
