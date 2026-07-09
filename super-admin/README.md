# Mirsarai General Hospital — Admin Panel

**STEP 1 COMPLETE ✓**  
Foundation for production-ready Hospital Management System Admin Panel.

---

## 🏗️ Tech Stack

- **Next.js 15+** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — Animations
- **React Hook Form + Zod** — Form validation
- **Lucide React** — Icons
- **next-themes** — Dark mode
- **Radix UI** — Accessible primitives

---

## 🎯 What's Built (Step 1)

### ✅ Authentication System

- Mock login with 4 demo accounts
- Role-based authentication
- Protected routes with guards
- SessionStorage for persistence
- Automatic role-based redirect

### ✅ Four User Roles

1. **Super Admin** — Full system access
2. **Reception Admin** — Patient management, appointments
3. **Lab Admin** — Lab tests, results
4. **Doctor** — Clinical records, prescriptions

### ✅ Shared Dashboard Architecture

- Reusable `DashboardLayout` component
- Responsive sidebar (mobile drawer, desktop fixed)
- Header with breadcrumb, search, notifications, user menu
- Role-specific navigation config
- Dark/Light theme toggle
- Fully responsive (mobile-first)

### ✅ UI Design (Premium SaaS)

- Brand colors: Primary `#1E2B7A`, Secondary `#76BC21`
- Clean spacing, rounded corners, smooth shadows
- Enterprise-level typography (Inter + JetBrains Mono)
- Gradient accents, opacity variations
- Accessible form inputs with validation errors
- Button variants (primary, secondary, outline, ghost, danger)

### ✅ Project Structure

```
super-admin/
├── app/
│   ├── login/              # Auth page
│   ├── super-admin/        # Super Admin dashboard
│   ├── reception-admin/    # Reception dashboard
│   ├── lab-admin/          # Lab dashboard
│   ├── doctor/             # Doctor dashboard
│   ├── layout.tsx          # Root layout (Providers)
│   ├── page.tsx            # Root redirect
│   └── globals.css         # Global styles
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RouteGuard.tsx
│   ├── dashboard/
│   │   └── ComingSoonCard.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── Breadcrumb.tsx
│   │   └── DashboardLayout.tsx
│   ├── providers/
│   │   └── Providers.tsx
│   └── ui/                 # Reusable primitives
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Badge.tsx
│       └── LoadingScreen.tsx
├── context/
│   └── AuthContext.tsx     # Auth state + login/logout
├── lib/
│   ├── utils.ts            # cn() helper
│   ├── mock-auth.ts        # Mock login logic
│   └── auth-storage.ts     # SessionStorage
├── types/
│   └── auth.ts             # Role, User types
└── config/
    └── navigation.ts       # Nav per role
```

---

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Accounts

All use password: **admin123**

| Role              | Email                   |
| ----------------- | ----------------------- |
| **Super Admin**   | superadmin@mgh.com      |
| **Reception**     | reception@mgh.com       |
| **Lab Admin**     | lab@mgh.com             |
| **Doctor**        | doctor@mgh.com          |

---

## 🎨 Theme & Design

### Colors

- **Primary:** `#1E2B7A` (Navy)
- **Secondary:** `#76BC21` (Green)
- Light/Dark mode fully supported via `next-themes`

### Typography

- **Body:** Inter (sans)
- **Code:** JetBrains Mono (mono)

### Responsive

- **Mobile:** < 640px (sidebar drawer)
- **Tablet:** 640px–1024px
- **Desktop:** ≥ 1024px (sidebar fixed)

---

## 🔐 Authentication Flow

1. User lands on `/` → redirects to `/login`
2. User logs in → `AuthContext` calls `mockLogin`
3. On success:
   - Store user in sessionStorage
   - Redirect to role-based route (e.g., `/super-admin`)
4. Each dashboard route is wrapped in `<RouteGuard>`
5. Guard checks role; if mismatch, redirects to correct dashboard

### SessionStorage Persistence

- User is stored on login
- Rehydrated on page refresh
- Cleared on logout

---

## 🧭 Navigation

Each role has custom navigation defined in `config/navigation.ts`.

**Example (Super Admin):**

- Dashboard
- Staff & Users
- Doctors
- Departments
- Appointments (badge: 12)
- Reports
- Billing
- Settings

Navigation is rendered in `<Sidebar>` with active states, icons, and badges.

---

## 🎭 Role-Based Access Control

### RouteGuard Component

Every dashboard layout wraps children in `<RouteGuard allowedRole={role}>`:

```tsx
<DashboardLayout role="super-admin">
  {children}
</DashboardLayout>
```

This ensures:

- Unauthenticated users → `/login`
- Wrong role → redirect to their own dashboard

---

## 🖼️ UI Components

### Button

```tsx
<Button variant="primary" size="lg" loading={isSubmitting}>
  Sign In
</Button>
```

**Variants:** primary, secondary, outline, ghost, danger  
**Sizes:** sm, md, lg

### Input

```tsx
<Input
  label="Email"
  type="email"
  placeholder="you@mgh.com"
  leftIcon={<Mail />}
  error={errors.email?.message}
  {...register("email")}
/>
```

### Badge

```tsx
<Badge variant="success">Active</Badge>
```

---

## 🌙 Dark Mode

Toggle via header button. Uses `next-themes` with system preference detection.

All components support both light and dark modes — no hardcoded colors.

---

## 📁 File Conventions

- **Server Components** (default): No `"use client"` needed
- **Client Components**: Must have `"use client"` directive
- **Metadata**: Export `metadata` object for SEO
- **Layouts**: Each role has its own layout wrapping `<DashboardLayout>`

---

## 🧪 Next Steps (Step 2)

**Not included in Step 1:**

- Dashboard widgets (stats cards, charts)
- CRUD pages (users, doctors, appointments)
- Forms (create appointment, add patient)
- Real backend integration
- Data tables with pagination
- File uploads
- Advanced permissions

---

## 🛠️ Build & Deploy

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## 📦 Dependencies Installed

```json
{
  "dependencies": {
    "next": "16.2.10",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "framer-motion": "^12",
    "react-hook-form": "^7",
    "zod": "^3",
    "@hookform/resolvers": "^3",
    "lucide-react": "latest",
    "next-themes": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-dropdown-menu": "latest",
    "@radix-ui/react-avatar": "latest",
    "@radix-ui/react-tooltip": "latest",
    "@radix-ui/react-separator": "latest",
    "@radix-ui/react-slot": "latest",
    "@radix-ui/react-label": "latest",
    "@radix-ui/react-switch": "latest"
  }
}
```

---

## 🎓 Key Architectural Decisions

1. **No duplicate layouts** — Single `<DashboardLayout>` reused by all roles
2. **Role-based navigation config** — Sidebar items defined per role in one place
3. **Client-side auth** — Mock for now, easy to swap with real API
4. **SessionStorage** — Fast, secure for admin panel use case
5. **Mobile-first responsive** — Drawer on mobile, fixed sidebar on desktop
6. **Atomic UI components** — Button, Input, Badge can be reused everywhere
7. **TypeScript strict mode** — Zero type errors
8. **Next.js App Router** — Server components by default, client where needed

---

## 🧑‍💻 Development Tips

### Add a New Role

1. Add to `Role` type in `types/auth.ts`
2. Add route in `ROLE_ROUTES`
3. Add mock user in `lib/mock-auth.ts`
4. Create folder `app/<new-role>/`
5. Add layout with `<DashboardLayout role="new-role">`
6. Define navigation in `config/navigation.ts`

### Add a New Nav Item

Edit `config/navigation.ts`:

```ts
{
  label: "Inventory",
  href: "/super-admin/inventory",
  icon: Package,
  badge: "5",
}
```

### Protect a Page

Wrap in `<RouteGuard>` or use the role-specific layout (which already includes it).

---

## ✅ Step 1 Checklist

- [x] Project setup
- [x] Authentication system
- [x] 4 user roles
- [x] Mock login with demo accounts
- [x] Role-based redirect
- [x] Protected routes
- [x] Shared dashboard layout
- [x] Responsive sidebar
- [x] Header with breadcrumb
- [x] Notification dropdown
- [x] User dropdown menu
- [x] Dark/Light theme
- [x] Reusable UI components
- [x] Clean folder structure
- [x] Zero TypeScript errors
- [x] Production build successful

---

**Ready for Step 2!** 🚀  
*Next: Build actual dashboard pages with widgets, forms, and data tables.*

---

© 2025 Mirsarai General Hospital. All rights reserved.
