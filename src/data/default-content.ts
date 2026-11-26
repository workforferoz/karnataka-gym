// Default Content Structure for Karnataka Gym Hubballi Website

export interface FacilityItem {
  id: string;
  src: string;
  title: string;
  tag: string;
  specs: string;
  desc: string;
}

export interface TransformationItem {
  id: string;
  src: string;
  title: string;
  badge: string;
  story: string;
  achievements: string[];
}

export interface TrainerPhotoItem {
  id: string;
  src: string;
  title: string;
  tag: string;
  desc: string;
}

export interface PillarItem {
  id: string;
  number: string;
  title: string;
  desc: string;
}

export interface PricingPlanItem {
  id: string;
  name: string;
  price: string;
  duration: string;
  perMonth: string;
  badge: string | null;
  highlight: boolean;
  description: string;
  features: string[];
}

export interface SiteContent {
  general: {
    gymName: string;
    tagline: string;
    badgeText: string;
    phone: string;
    whatsapp: string;
    email: string;
    instagram: string;
    address: string;
    mapsUrl: string;
    morningHours: string;
    eveningHours: string;
    sundayHours: string;
  };
  hero: {
    liveStatusText: string;
    headlinePart1: string;
    headlineHighlight: string;
    headlinePart2: string;
    subtitle: string;
    stats: Array<{
      value: string;
      label: string;
      highlight?: boolean;
    }>;
  };
  about: {
    eyebrow: string;
    heading: string;
    description: string;
    pillars: PillarItem[];
  };
  facilities: FacilityItem[];
  transformations: TransformationItem[];
  trainer: {
    name: string;
    title: string;
    experience: string;
    bio: string;
    specialties: string[];
    instagramHandle: string;
    photos: TrainerPhotoItem[];
  };
  pricing: PricingPlanItem[];
}

export const DEFAULT_CONTENT: SiteContent = {
  general: {
    gymName: 'Karnataka Gym',
    tagline: 'Hubballi Strength Institution',
    badgeText: 'Hubballi • Est. 2011',
    phone: '9902667407',
    whatsapp: '9902667407',
    email: 'karnatakagymhubli@gmail.com',
    instagram: '@riyaz_gokul',
    address: 'Kalidas Nagar, Hubballi, Karnataka 580031',
    mapsUrl: 'https://maps.app.goo.gl/dXnSdvRU9gwHd7sAA',
    morningHours: '05:30 AM - 12:00 PM',
    eveningHours: '04:30 PM - 10:00 PM',
    sundayHours: '06:00 AM - 12:00 PM',
  },
  hero: {
    liveStatusText: 'Facility Open Today • Hubballi Floor Active (5:30 AM - 10:00 PM)',
    headlinePart1: 'BUILD RAW STRENGTH.',
    headlineHighlight: 'KARNATAKA GYM',
    headlinePart2: 'HUBBALLI',
    subtitle: "Hubballi's home for serious lifters, functional athletes, and beginner fitness journeys since 2011. Heavy Olympic iron, pin-loaded resistance machines, and certified coaching under Coach Riyaz at Kalidas Nagar.",
    stats: [
      { value: '14+ Years', label: 'Hubballi Legacy (Est. 2011)' },
      { value: '50kg+', label: 'Olympic Free Weights Rack', highlight: true },
      { value: '100% Real', label: 'Local Member Results' },
      { value: '₹0 Hidden', label: 'Zero Admission Surcharge' },
    ],
  },
  about: {
    eyebrow: 'Our Training Ethos & Heritage',
    heading: 'No Gimmicks. No Starvation Diets. Pure Discipline.',
    description: "Founded with a commitment to pure hard work and measurable physical results, Karnataka Gym is Hubballi's trusted strength institution. Centrally situated at Kalidas Nagar, our facility is engineered for serious lifters, working professionals, and beginners looking for practical fitness without ego or gimmicks.",
    pillars: [
      {
        id: 'pillar-1',
        number: '01',
        title: 'Heavy Olympic Free Weights',
        desc: 'Commercial Olympic flat, incline, and decline bench presses, heavy squat stations, and a complete line of precision cast-iron dumbbells up to 50kg for progressive overload.',
      },
      {
        id: 'pillar-2',
        number: '02',
        title: 'Biomechanical Pin-Loaded Machines',
        desc: 'Selectorized cable crossovers, 45° linear incline leg presses, pec fly machines, and lat pulldowns engineered for peak contraction with natural joint paths.',
      },
      {
        id: 'pillar-3',
        number: '03',
        title: 'Coaching Under Coach Riyaz',
        desc: 'Learn directly from 14+ years of competitive bodybuilding discipline. Form verification, injury prevention, and customized training splits tailored to your structure.',
      },
      {
        id: 'pillar-4',
        number: '04',
        title: 'Real Indian Diet & Nutrition Guidance',
        desc: 'No extreme starvation protocols or forced supplement packages. Practical nutrition frameworks built around real Indian home-cooked meals (dal, eggs, paneer, chicken, rice).',
      },
    ],
  },
  facilities: [
    {
      id: 'facility-1',
      src: '/facility/gym-floor-wide.webp',
      title: 'Olympic Free Weights & Training Floor',
      tag: 'Free Weights & Olympic Benches',
      specs: 'Commercial Olympic benches • 50kg+ Dumbbell line • Shock-absorbing rubber floor',
      desc: 'Spacious training floor with commercial Olympic bench press stations, heavy dumbbell rack, shock-absorbing rubber matting, and dual cable towers.',
    },
    {
      id: 'facility-2',
      src: '/facility/strength-cable-station.webp',
      title: 'Dual Cable Crossover & Arm Station',
      tag: 'Multi-Station Cable Towers',
      specs: 'Dual 100kg weight stacks • Multi-grip pull-up bar • Preacher curl bench',
      desc: 'Heavy-duty cable crossover system with multi-grip chin-up station, preacher curl bench, and anatomical muscle guides for joint-safe resistance.',
    },
    {
      id: 'facility-3',
      src: '/facility/leg-press-cardio.webp',
      title: 'Plate-Loaded Leg Press & Cardio Suite',
      tag: 'Leg Press, Pec Fly & Treadmill',
      specs: '45° Linear bearing leg press • Selectorized pec fly • Commercial cardio',
      desc: 'Commercial 45° plate-loaded leg press machine, selectorized pec fly station, and digital commercial treadmill for cardio conditioning.',
    },
    {
      id: 'facility-4',
      src: '/facility/free-weights-mirrors.webp',
      title: 'Resistance Machine Line & Mirror Wall',
      tag: 'Resistance Equipment & Mirror Wall',
      specs: 'Full-span posture mirrors • Selectorized pin stacks • Heavy adjustable benches',
      desc: 'Full wall-to-wall mirror setup for posture and technique verification, paired with selectorized resistance machines and heavy-duty benches.',
    },
  ],
  transformations: [
    {
      id: 'transformation-1',
      src: '/transformations/transformation-1-male-fatloss.webp',
      title: 'Fat Loss & Stamina Rebuild',
      badge: '18kg Fat Loss • 20 Weeks',
      story: 'Shifted from long hours of sedentary routine to disciplined daily resistance workouts and a calorie-managed diet under Coach Riyaz.',
      achievements: [
        'Substantial reduction in visceral fat',
        'Daily cardiovascular stamina improved',
        'Consistent strength training 5 days a week',
      ],
    },
    {
      id: 'transformation-2',
      src: '/transformations/transformation-2-female-toning.webp',
      title: 'Body Recomposition & Core Toning',
      badge: 'Lean Muscle & Toning • 16 Weeks',
      story: 'Dedicated strength training focusing on core stability, compound lifts, and balanced nutrition without extreme starvation diets.',
      achievements: [
        'Inches lost across waist and hips',
        'Enhanced functional core strength',
        'Structured home-diet meal balance',
      ],
    },
    {
      id: 'transformation-3',
      src: '/transformations/transformation-3-lifestyle-fitness.webp',
      title: 'Lifestyle Fitness & Fat Loss',
      badge: 'Sustainable Fitness • 24 Weeks',
      story: 'Replaced fad diets with structured push-pull-legs training splits and regular cardio conditioning at Karnataka Gym.',
      achievements: [
        'Consistent fat loss over months',
        'Noticeable postural correction',
        'Increased energy throughout the day',
      ],
    },
    {
      id: 'transformation-4',
      src: '/transformations/transformation-4-core-conditioning.webp',
      title: 'Middle-Age Strength & Waistline Trim',
      badge: 'Trained at Karnataka Gym • 18 Weeks',
      story: 'Trained directly on the Karnataka Gym floor with barbell complexes, plate resistance, and coach-guided nutrition protocols.',
      achievements: [
        'Visible abdominal fat loss & tone',
        'Joint mobility & heavy compound strength',
        'Proven proof of work right in Hubballi',
      ],
    },
    {
      id: 'transformation-5',
      src: '/transformations/transformation-5-active-fitness.webp',
      title: 'Active Lifestyle & Core Slimming',
      badge: 'Weight Loss & Energy • 14 Weeks',
      story: 'Shifted from long hours of sedentary desk work to consistent daily workouts, burning stubborn body fat while boosting cardiovascular fitness.',
      achievements: [
        'Visible waist & midsection trimming',
        'Consistent daily morning workout habit',
        'Enhanced endurance and daily energy',
      ],
    },
    {
      id: 'transformation-6',
      src: '/transformations/transformation-6-lifestyle-toning.webp',
      title: 'Postural Alignment & Waistline Tone',
      badge: 'Postural Correction • 16 Weeks',
      story: 'Replaced extreme food restriction with strength-based resistance training and structured, nutrient-dense home-cooked meals.',
      achievements: [
        'Inches reduced from waist and hips',
        'Improved shoulder and spinal posture',
        'Sustainable eating without starving',
      ],
    },
    {
      id: 'transformation-7',
      src: '/transformations/transformation-7-athletic-conditioning.webp',
      title: 'Athletic Conditioning & Leaning Out',
      badge: 'Athletic Conditioning • 20 Weeks',
      story: 'Committed to full-body resistance splits and HIIT cardio, transforming overall stamina and dropping body fat percentage steadily.',
      achievements: [
        'Full-body lean muscle toning',
        'Athletic agility and high energy levels',
        'Consistent 4-day gym training schedule',
      ],
    },
    {
      id: 'transformation-8',
      src: '/transformations/transformation-8-strength-recomposition.webp',
      title: 'Body Recomposition & Confidence',
      badge: 'Strength & Confidence • 22 Weeks',
      story: 'Combined progressive weight resistance with balanced daily protein intake, creating a fit, toned silhouette with renewed self-confidence.',
      achievements: [
        'Noticeable total body inch loss',
        'Increased upper and lower body strength',
        'Long-term sustainable lifestyle habits',
      ],
    },
  ],
  trainer: {
    name: 'Coach Riyaz',
    title: 'Head Coach & Founder',
    experience: '14+ Years Competitive Bodybuilding Experience',
    bio: 'Dedicated strength coach and physique athlete based in Hubballi. With over a decade of dedicated weight-training discipline, Coach Riyaz provides direct guidance on biomechanical form, injury rehabilitation, hypertrophy, and sustainable nutrition.',
    specialties: [
      '14+ years personal weightlifting discipline',
      'Specialist in compound movement biomechanics',
      'Personalized non-starvation diet coaching',
      'Hundreds of verified Hubballi transformations',
    ],
    instagramHandle: '@riyaz_gokul',
    photos: [
      {
        id: 'trainer-photo-1',
        src: '/trainers/coach-riyaz-conditioning.webp',
        title: 'Peak Conditioning & Core Striations',
        tag: 'Discipline & Definition',
        desc: 'Elite core definition, serratus cuts, and competition-level conditioning built through years of disciplined, progressive weight training.',
      },
      {
        id: 'trainer-photo-2',
        src: '/trainers/coach-riyaz-side-chest.webp',
        title: 'Side Chest & Arm Hypertrophy',
        tag: 'Karnataka Gym Floor',
        desc: 'Classic bodybuilding side chest pose on the Karnataka Gym floor, showing chest fullness, shoulder striations, and tricep separation.',
      },
      {
        id: 'trainer-photo-3',
        src: '/trainers/coach-riyaz-dumbbells.webp',
        title: 'Olympic Dumbbell Bicep Training',
        tag: 'Free Weight Mastery',
        desc: 'Vascular dumbbell training on the main gym floor. Teaching members proper tempo, peak contraction, and zero-momentum form.',
      },
      {
        id: 'trainer-photo-4',
        src: '/trainers/coach-riyaz-most-muscular.webp',
        title: 'Most Muscular & Quadricep Power',
        tag: 'Competition-Ready Physique',
        desc: 'Front most muscular pose showcasing quad separation, abdominal vascularity, and thick traps forged with heavy compound training.',
      },
    ],
  },
  pricing: [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: '₹1,500',
      duration: '1 Month',
      perMonth: '₹1,500 / month',
      badge: null,
      highlight: false,
      description: 'Ideal for beginners and short-term fitness goals without long commitments.',
      features: [
        'Full gym floor & free weights access',
        'Selectorized pin-loaded resistance machines',
        'Cardio suite (treadmill & conditioning equipment)',
        'Clean locker & changing facilities',
        'General workout & form guidance',
        'Zero admission or registration fee',
      ],
    },
    {
      id: 'quarterly',
      name: 'Quarterly Plan',
      price: '₹4,000',
      duration: '3 Months',
      perMonth: '₹1,333 / month',
      badge: 'Most Popular',
      highlight: true,
      description: 'The proven sweet spot to build habit consistency and visible physical changes.',
      features: [
        'Save ₹500 compared to monthly rate',
        'Full gym floor & Olympic equipment access',
        'All selectorized resistance stations included',
        'Cardio suite & locker access',
        'Personalized split routine consultation',
        'Zero admission fee • No hidden charges',
      ],
    },
    {
      id: 'half_yearly',
      name: 'Half-Yearly Plan',
      price: '₹7,500',
      duration: '6 Months',
      perMonth: '₹1,250 / month',
      badge: 'Great Value',
      highlight: false,
      description: 'Complete body recomposition window for dedicated lifters and fitness athletes.',
      features: [
        'Save ₹1,500 over monthly rates',
        'Includes 15-day membership freeze option',
        'Full unrestricted gym floor access',
        'All heavy Olympic free weights (up to 50kg+)',
        'Cardio suite & locker facility included',
        'Progress check-ins & form reviews',
      ],
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: '₹12,000',
      duration: '12 Months',
      perMonth: '₹1,000 / month',
      badge: 'Best Value',
      highlight: false,
      description: 'Our most economical plan for a lifetime fitness commitment in Hubballi.',
      features: [
        'Save ₹6,000 annually (effectively ₹1,000/mo)',
        'Includes 30-day membership pause option',
        'Unrestricted year-round facility access',
        'Full Olympic barbells, cages & cable towers',
        'Free lock & locker room facility',
        'Highest long-term transformation rate',
      ],
    },
  ],
};
