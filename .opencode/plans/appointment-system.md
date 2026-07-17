# End-to-End Appointment Booking System — Implementation Plan

## Phase 1 — Backend: User & Auth Module

### Create: `backend/src/models/user.model.js`
```
Fields: email (unique, lowercase), password (bcrypt hashed, select:false),
        name, role (enum: super-admin/reception-admin/lab-admin/doctor/patient),
        doctorRef (ObjectId ref:Doctor, nullable), department, avatar, status
Hooks: pre('save') hash password
Methods: comparePassword(candidatePassword)
Indexes: email, role
```

### Create: `backend/src/validators/auth.validator.js`
```
loginSchema: Z.object({ email: Z.string().email(), password: Z.string().min(6) })
registerSchema: Z.object({ email, password, name, role, doctorRef? })
```

### Create: `backend/src/services/auth.service.js`
```
loginUser(email, password):
  1. Find user by email (select +password)
  2. If not found → throw ApiError(UNAUTHORIZED, 'Invalid credentials')
  3. Compare password via user.comparePassword()
  4. If mismatch → throw ApiError(UNAUTHORIZED, 'Invalid credentials')
  5. Generate JWT: jwt.sign({ id: user._id, role: user.role, doctorRef: user.doctorRef }, secret, { expiresIn })
  6. Return { user: user.toJSON(), token }

registerUser(data):
  1. Check if email already exists → throw ApiError(CONFLICT)
  2. Create user via User.create(data)
  3. Return user.toJSON()
```

### Create: `backend/src/controllers/auth.controller.js`
```
login: catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    // Set httpOnly cookie
    res.cookie('accessToken', result.token, {
      httpOnly: true, secure: env.nodeEnv === 'production',
      sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    sendSuccess(res, StatusCodes.OK, result, 'Login successful');
})

register: authenticate, authorize('super-admin'), catchAsync(async (req, res) => {
    const user = await authService.registerUser(req.body);
    sendSuccess(res, StatusCodes.CREATED, user, 'User registered');
})

getMe: authenticate, catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    sendSuccess(res, StatusCodes.OK, user.toJSON());
})
```

### Create: `backend/src/routes/auth.routes.js`
```
POST /auth/login    → login (no auth)
POST /auth/register → register (auth: super-admin)
GET  /auth/me       → getMe (auth: any)
```

### Modify: `backend/src/routes/index.js`
Add: `router.use('/auth', authRoutes);`

### Modify: `backend/src/middlewares/auth.middleware.js`
Update `authenticate`:
- When real JWT token is present: verify it, extract `{ id, role, doctorRef }`
- When in dev mode and no token: keep existing mock-admin fallback
- The decoded token now includes `doctorRef` for doctor-role users

### Modify: `backend/src/scripts/seedDoctors.js`
Add user seeding at the end:
```js
const MOCK_USERS = [
  { email: 'superadmin@mgh.com', password: 'admin123', name: 'Arif Hossain', role: 'super-admin' },
  { email: 'doctor@mgh.com', password: 'admin123', name: 'Dr. Nasrin Begum', role: 'doctor', doctorRef: <firstDoctorId> },
  { email: 'reception@mgh.com', password: 'admin123', name: 'Fatema Khatun', role: 'reception-admin' },
  { email: 'lab@mgh.com', password: 'admin123', name: 'Rahim Uddin', role: 'lab-admin' },
];
```

## Phase 2 — Backend: Appointment Module

### Create: `backend/src/models/appointment.model.js`
```js
{
  patientName: { type: String, required: true, trim: true },
  patientPhone: { type: String, required: true },
  patientEmail: { type: String, trim: true },
  patientAge: { type: Number, min: 0, max: 150 },
  patientGender: { type: String, enum: Object.values(GENDER) },
  doctor: { type: ObjectId, ref: 'Doctor', required: true },
  department: { type: String },
  service: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  type: { type: String, enum: ['new', 'follow-up', 'consultation'], default: 'new' },
  status: { type: String, enum: Object.values(APPOINTMENT_STATUS), default: APPOINTMENT_STATUS.PENDING },
  reason: { type: String, trim: true },
  notes: { type: String, trim: true },
  createdBy: { type: String },
}
Indexes: { doctor: 1, date: -1 }, { status: 1 }, { date: -1 }, { department: 1 }
```

### Create: `backend/src/services/appointment.service.js`
```
createAppointment(data): validate doctor exists, create appointment, return populated
getAppointments(filters): { page, limit, doctorId, department, status, dateFrom, dateTo, search }
  - Build MongoDB query from filters
  - Paginate with skip/limit, sort by date desc
  - Populate doctor (name, designation, image, department)
  - Return { appointments, total, page, limit }
getAppointmentById(id): find + populate doctor
updateAppointment(id, data, userId): find + update
deleteAppointment(id): delete by id
updateAppointmentStatus(id, status, userId): findByIdAndUpdate status
```

### Create: `backend/src/controllers/appointment.controller.js`
```js
// Public
bookAppointment: catchAsync(async (req, res) => {
  const appointment = await appointmentService.createAppointment(req.body);
  sendSuccess(res, StatusCodes.CREATED, appointment, 'Appointment booked successfully');
})

// Admin
getAdminAppointments: catchAsync(async (req, res) => {
  const result = await appointmentService.getAppointments(req.query);
  sendPaginated(res, StatusCodes.OK, result.appointments, 'Appointments fetched', result.total, result.page, result.limit);
})
getAdminAppointmentById, createAdminAppointment, updateAdminAppointment, deleteAdminAppointment, updateAdminAppointmentStatus
```

### Create: `backend/src/routes/appointment.routes.js`
```
POST /appointments → bookAppointment (public)
```

### Create: `backend/src/routes/admin/appointment.admin.routes.js`
```
GET    /admin/appointments              → getAdminAppointments
POST   /admin/appointments              → createAdminAppointment
GET    /admin/appointments/:id          → getAdminAppointmentById
PUT    /admin/appointments/:id          → updateAdminAppointment
DELETE /admin/appointments/:id          → deleteAdminAppointment
PATCH  /admin/appointments/:id/status   → updateAdminAppointmentStatus
```

### Modify: `backend/src/routes/index.js`
Add: import appointment routes, mount at /api/v1/appointments and /api/v1/admin/appointments

## Phase 3 — Backend: Service Module

### Create: `backend/src/models/service.model.js`
```js
{
  name: { en: String, bn: String },
  slug: { type: String, unique: true, lowercase: true },
  description: { en: String, bn: String },
  image: { type: String },
  icon: { type: String },
  color: { type: String },
  gradient: { type: String },
  department: { type: ObjectId, ref: 'Department', default: null },
  doctors: [{ type: ObjectId, ref: 'Doctor' }],
  highlights: [String],
  tagline: { type: String },
  link: { type: String },
  displayOrder: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
  createdBy: { type: String },
  updatedBy: { type: String },
}
```

### Create: `backend/src/services/service.service.js`
```
getPublicServices(): find({ isVisible: true }).sort({ displayOrder: 1 })
getAdminServices(filters): paginated, searchable by name.en
getServiceById(id)
createService(data, userId)
updateService(id, data, userId)
deleteService(id)
reorderServices(orderUpdates)
```

### Create: `backend/src/controllers/service.controller.js`
getPublicServices, getAdminServices, getServiceById, createService, updateService, deleteService, reorderServices

### Create: `backend/src/routes/service.routes.js`
```
GET /services → getPublicServices
```

### Create: `backend/src/routes/admin/service.admin.routes.js`
Full admin CRUD + reorder

### Create: `backend/src/scripts/seedServices.js`
Read frontend/public/data/services.json → map each to Service document.
Link to Department where department name matches.
Link to Doctors where doctor department matches.
Set createdBy: 'seed'.

### Modify: `backend/src/routes/index.js`
Mount service routes.

## Phase 4 — Frontend: Public Service Cards + Booking

### Modify: `frontend/src/components/Services.tsx`
1. Replace `fetchServices` (JSON) with `useServices()` hook from Phase 4 hooks
2. Add "Book Appointment" button to each card:
```tsx
<Link href={`/appointment?service=${encodeURIComponent(service.slug || service.title.en)}`}>
  <button className="mt-2 w-full px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
    {lang === 'bn' ? 'অ্যাপয়েন্টমেন্ট বুক করুন' : 'Book Appointment'}
  </button>
</Link>
```
3. "Learn More" link stays as-is (links to service.link)
4. Both buttons in a flex row on desktop, stacked on mobile

### Create: `frontend/src/app/services/page.tsx`
Full services listing page with:
- Hero banner (same pattern as sub-pages)
- Services grid reusing ServiceCard component pattern from Services.tsx
- Each card has both "Learn More" and "Book Appointment" buttons
- Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- Loading skeleton, error state, empty state

### Create: `frontend/src/hooks/useServices.ts`
```ts
const fetchServices = async (): Promise<Service[]> => {
  try {
    const res = await fetch(`${API_URL}/services`);
    if (!res.ok) throw new Error('API unavailable');
    const json = await res.json();
    return json.data;
  } catch {
    const fallback = await fetch('/data/services.json');
    return fallback.json();
  }
};
export const useServices = () => useQuery({ queryKey: ['services'], queryFn: fetchServices, staleTime: 1000 * 60 * 10 });
```

### Modify: `frontend/src/services/api.ts`
Add:
```ts
export async function submitAppointment(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to book appointment');
  return res.json();
}
```

### Create: `frontend/src/hooks/useCreateAppointment.ts`
```ts
export const useCreateAppointment = () =>
  useMutation({
    mutationFn: submitAppointment,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['appointments'] }); },
  });
```

### Modify: `frontend/src/components/appointment/AppointmentForm.tsx`
1. Import `useSearchParams` from next/navigation
2. Read `?service=` param at mount
3. Auto-select department based on service name (match against doctor.department.en)
4. If user manually changes department, clear the service param (URL stays, but form state overrides)
5. Replace `setSubmitted(true)` with:
```ts
const createAppointment = useCreateAppointment();
const handleSubmit = async () => {
  setSubmitting(true);
  try {
    await createAppointment.mutateAsync({
      patientName: form.fullName,
      patientPhone: form.phone,
      patientEmail: form.email,
      patientAge: form.age ? Number(form.age) : undefined,
      patientGender: form.gender.toLowerCase(),
      doctor: selectedDoctor._id,
      department: form.department,
      date: form.date,
      time: form.time,
      type: 'new',
      reason: form.message,
    });
    setSubmitted(true);
  } catch (err) {
    setSubmitError('Failed to book appointment. Please try again.');
  } finally {
    setSubmitting(false);
  }
};
```
6. Add submitting state (disable form, show spinner on button)
7. Add submit error banner
8. Keep PDF download on success

## Phase 5 — Super Admin: Real Appointment CRUD

### Modify: `super-admin/lib/services/api.ts`
Add appointment API functions:
```ts
export const getCmsAppointments = (params: Record<string, string> = {}) => {
  const q = new URLSearchParams(params).toString();
  return fetchAdminReal<{ data: CmsAppointment[]; total: number; page: number; limit: number }>(`admin/appointments${q ? `?${q}` : ''}`);
};
export const getCmsAppointmentById = (id: string) => fetchAdminReal<{ data: CmsAppointment }>(`admin/appointments/${id}`);
export const createCmsAppointment = (data: Partial<CmsAppointment>) => mutateAdminReal<CmsAppointment>('admin/appointments', data, 'POST');
export const updateCmsAppointment = (id: string, data: Partial<CmsAppointment>) => mutateAdminReal<CmsAppointment>(`admin/appointments/${id}`, data, 'PUT');
export const deleteCmsAppointment = (id: string) => mutateAdminReal<null>(`admin/appointments/${id}`, undefined, 'DELETE');
export const updateCmsAppointmentStatus = (id: string, status: string) => mutateAdminReal<CmsAppointment>(`admin/appointments/${id}/status`, { status }, 'PATCH');
```

Add CmsAppointment type:
```ts
export interface CmsAppointment {
  _id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge?: number;
  patientGender?: string;
  doctor: { _id: string; name: BilingualField; designation: BilingualField; image?: string; department: BilingualField };
  department?: string;
  service?: string;
  date: string;
  time: string;
  type: 'new' | 'follow-up' | 'consultation';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  reason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Create: `super-admin/lib/hooks/useCmsAppointments.ts`
Query + mutation hooks matching the useCmsDoctors pattern.

### Modify: `super-admin/app/super-admin/appointments/page.tsx`
- Replace `useAppointments()` with `useCmsAppointments(params)`
- Add doctorId filter, date range filter
- Update columns for new data shape (doctor.name.en instead of doctorName)
- Summary cards use real counts from API

### Modify: `super-admin/app/super-admin/appointments/add/page.tsx`
- Load real doctors via `useCmsDoctors()`
- Doctor selector populates department automatically
- Submit via `useCreateCmsAppointment()` mutation

### Modify: `super-admin/app/super-admin/appointments/[id]/page.tsx`
- Use `useCmsAppointmentById(id)`
- Display nested doctor fields properly

### Modify: `super-admin/app/super-admin/appointments/[id]/edit/page.tsx`
- Load appointment via `useCmsAppointmentById(id)`
- Load doctors via `useCmsDoctors()`
- Submit via `useUpdateCmsAppointment()`

### Update auth header in fetchAdminReal/mutateAdminReal
Read token from sessionStorage and pass as Authorization header.

## Phase 6 — Doctor Admin: Auth + Filtered Appointments

### Modify: `super-admin/types/auth.ts`
Add `doctorRef?: string` to User interface:
```ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department?: string;
  doctorRef?: string;
  token?: string;
}
```

### Modify: `super-admin/lib/mock-auth.ts`
Add `doctorRef` to doctor mock user:
```ts
{ id: '4', name: 'Dr. Nasrin Begum', email: 'doctor@mgh.com', password: 'admin123',
  role: 'doctor', avatar: '', department: 'General Medicine', doctorRef: '<DOCTOR_ID>' }
```

### Modify: `super-admin/context/AuthContext.tsx`
Replace `mockLogin` with real API call:
```ts
const login = async (credentials: LoginCredentials) => {
  try {
    const res = await fetch(`${BACKEND_API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) return { error: 'Invalid credentials' };
    const json = await res.json();
    const { user: userData, token } = json.data;
    const user = { ...userData, token };
    storeUser(user);
    setUser(user);
    router.push(ROLE_ROUTES[user.role]);
    return {};
  } catch {
    // Fallback to mock
    const result = await mockLogin(credentials);
    if (!result.success || !result.user) return { error: result.error ?? 'Login failed' };
    storeUser(result.user);
    setUser(result.user);
    router.push(ROLE_ROUTES[result.user.role]);
    return {};
  }
};
```

### Update `fetchAdminReal` / `mutateAdminReal` in api.ts
Read token from sessionStorage and add Authorization header.

### Modify: `super-admin/app/doctor/appointments/page.tsx`
- Get current user from `useAuth()`
- Call `useCmsAppointments({ doctorId: user.doctorRef })`
- Replace mock `useAppointments()` with real data
- Keep same table/UI structure

## Phase 7 — Service Sub-page CTA Updates

### Modify: `frontend/src/app/services/nicu/page.tsx`
Update CTA button link: `href="/appointment?service=NICU-&-Baby-Care"`

### Modify: `frontend/src/app/services/diagnostic/page.tsx`
Update CTA button link: `href="/appointment?service=Laboratory-Services"`

### Modify: `frontend/src/app/services/baby-care/page.tsx`
Update CTA button link: `href="/appointment?service=Pediatrics"`

## Phase 8 — Navbar Link

### Modify: `frontend/src/components/Navbar.tsx`
Add `/services` link to the Services dropdown menu.

## Migration Plan

No formal migration system exists (MongoDB). New collections are created on first document insert via Mongoose. Run seed scripts after creating models:
1. `node src/scripts/seedDoctors.js` (updated with users)
2. `node src/scripts/seedServices.js`

## API Endpoint Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/v1/auth/login | Public | Login, returns JWT + user |
| GET | /api/v1/auth/me | Any | Get current user profile |
| POST | /api/v1/auth/register | super-admin | Create new user |
| POST | /api/v1/appointments | Public | Book appointment |
| GET | /api/v1/services | Public | List services |
| GET | /api/v1/admin/appointments | super-admin | List all appointments (filtered) |
| POST | /api/v1/admin/appointments | super-admin | Create appointment |
| GET | /api/v1/admin/appointments/:id | super-admin | Get appointment by ID |
| PUT | /api/v1/admin/appointments/:id | super-admin | Update appointment |
| DELETE | /api/v1/admin/appointments/:id | super-admin | Delete appointment |
| PATCH | /api/v1/admin/appointments/:id/status | super-admin | Update status |
| GET | /api/v1/admin/services | super-admin | List all services |
| POST | /api/v1/admin/services | super-admin | Create service |
| PUT | /api/v1/admin/services/:id | super-admin | Update service |
| DELETE | /api/v1/admin/services/:id | super-admin | Delete service |
| PATCH | /api/v1/admin/services/reorder | super-admin | Reorder services |
