# Karnataka Gym - Retention & Attendance Management PWA (Hubballi)

A modern, mobile-first Progressive Web App (PWA) built with **Next.js 16**, **React 19**, **Tailwind CSS**, and **Supabase / PostgreSQL Schema** for **Karnataka Gym** in Hubballi, Karnataka.

## 🚀 Key Brand Highlights
- **Gym Name:** Karnataka Gym
- **Helpline Phone:** `9902667407` (WhatsApp & Call deep links enabled)
- **Instagram:** [`@riyaz_gokul`](https://www.instagram.com/riyaz_gokul/)
- **Location:** Near Old Bus Stand, Station Road, Hubballi, Karnataka - 580020
- **Logo:** Circular black and gold badge with bodybuilder silhouette and stars (`/karnataka-gym-logo.png`)
- **Aesthetic:** Dark, trustworthy gym aesthetic (`#0B0E14`), high-contrast mobile typography, gold (`#E5A93C`) badges, Hinglish/English microcopy (*"Mera Plan"*, *"Renew Aaj Hi Karein"*, *"Aaj Ka Check-in"*, *"Badhai Ho! 🎉"*).

---

## 📱 Complete Screen Map

### Public & Auth
- `/` - Hubballi Gym Portal Gateway with 1-tap Member & Owner access
- `/login` - Mobile Number OTP Simulator + Instant 1-Click Profile Switcher (30+ seeded accounts)
- `/install-prompt` - PWA Installation instructions for Android (Chrome) and Apple iOS (Safari)

### Member Portal (`/member/*`)
- `/member/home` - Active membership badge, expiry countdown, weekly goal progress bar, workout streak flame 🔥
- `/member/check-in` - Session-bound personal QR pass + camera counter scanner simulator with duplicate, expired & offline states
- `/member/history` - Comprehensive attendance calendar with timestamps, check-in method (QR / Front Desk), and status
- `/member/renew` - 7-day reminder banner, 1/3/6/12 month options, GST bill breakdown, and simulated Razorpay/UPI gateway modal
- `/member/add-ons` - Transparent marketplace for Personal Training (Vikram, Pooja, Rakesh), Diet Plans, and Supplements (strictly tracked stock)
- `/member/profile` - Profile picture picker, contacts, emergency contact, communication channel preference, and marketing opt-out switch

### Owner / Manager Cockpit (`/owner/*`)
- `/owner/dashboard` - 8 Key Retention Metrics (Active members, today's check-ins, 7-day active, open no-show cases, returned members, renewals due, add-on revenue) + Daily 23:59 scan trigger
- `/owner/churn-risk` - The Red-List table of members absent for 10+ days (12-18 days). Actions: WhatsApp deep link, Call, and Mark Follow-Up Outcome
- `/owner/manage/members` - Full CRUD for 30 members. Edit plans, freeze membership (preserves streak!), and override diets/trainers with audit logs
- `/owner/manage/plans` - Membership tier pricing and discount configurator
- `/owner/manage/addons` - Personal Training packages, Diet plans, and physical supplement stock inventory management
- `/owner/assisted-checkin` - Front desk manual check-in with mandatory reason dropdown and audit log creation
- `/owner/summary` - Daily operations report with footfall graph, peak hours distribution, and printable view

---

## 🧪 In-App Automated Test Suite (12 Checkpoints)
Click the **"Test Checklist"** button in the app header to open the interactive test drawer and execute the 12 system assertions live:

1. ✅ QR Duplicate scan within 5 min rejection
2. ✅ Scanning with expired membership blocks entry
3. ✅ Approved pause (freeze) preserves attendance streak
4. ✅ Offline sync queue pushes upon reconnection
5. ✅ Assisted check-in prompts for mandatory reason and logs to AuditLogs
6. ✅ Failed simulated payment does NOT extend membership date
7. ✅ Duplicate webhook callback does not double-extend membership (idempotency guard)
8. ✅ Refund updates Payments state and adjusts Memberships table accordingly
9. ✅ Booking PT with an unavailable trainer throws a conflict error
10. ✅ Buying out-of-stock supplement fails with clear message
11. ✅ Member marketing opt-out stops non-transactional promotional notifications
12. ✅ Owner can edit member active diet plan and override trainer with AuditLog

---

## 🗄️ Database Schema
The complete PostgreSQL schema is available at `src/lib/schema.sql` covering:
`users`, `plans`, `memberships`, `attendance`, `streaks`, `no_show_cases`, `follow_ups`, `payments`, `renewal_orders`, `add_ons`, `add_on_orders`, `notifications`, `settings`, `audit_logs`.

---

## 🛠️ Run & Deploy

```bash
# Run Development Server
npm run dev

# Production Build
npm run build

# Start Production Server
npm run start
```

Deployable to Vercel with zero additional configuration.
