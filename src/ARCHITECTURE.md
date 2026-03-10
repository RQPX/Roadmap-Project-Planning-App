# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        REACT APPLICATION                         │
│                                                                   │
│  ┌────────────────┐    ┌─────────────────┐   ┌───────────────┐ │
│  │  Login Screen  │    │  Auth Context   │   │  Projects     │ │
│  │                │───▶│  - user         │   │  Context      │ │
│  │ - Admin        │    │  - isAdmin      │   │  - projects   │ │
│  │ - Directeur    │    │  - isDirecteur  │   │  - loading    │ │
│  └────────────────┘    │  - login()      │   │  - CRUD ops   │ │
│                        │  - logout()     │   └───────────────┘ │
│                        └─────────────────┘            │         │
│                                │                      │         │
│                                ▼                      ▼         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              PROTECTED ROUTES (if authenticated)          │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                            │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │  │
│  │  │  Dashboard  │  │   Kanban     │  │   Timeline     │  │  │
│  │  │             │  │              │  │                │  │  │
│  │  │ - KPI Cards │  │ - 9 Columns  │  │ - Gantt Chart  │  │  │
│  │  │ - Pie Chart │  │ - Drag Cards │  │ - Filters      │  │  │
│  │  │ - Table     │  │ - Add/Edit   │  │ - Timeline     │  │  │
│  │  └─────────────┘  └──────────────┘  └────────────────┘  │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │          Project Modal (CRUD Form)                  │  │  │
│  │  │  - Admin: Full edit + delete                        │  │  │
│  │  │  - Directeur: Read-only view                        │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AIRTABLE DATABASE                           │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Projects Table                                             │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │  - name             (Single line text)                      │ │
│  │  - department       (Single select: DSI, DAF, RH...)       │ │
│  │  - status           (Single select: 9 options)              │ │
│  │  - priority         (Single select: Haute, Moyenne, Basse)  │ │
│  │  - progress         (Number: 0-100)                         │ │
│  │  - projectManager   (Single line text)                      │ │
│  │  - partners         (Long text)                             │ │
│  │  - startDate        (Date)                                  │ │
│  │  - endDate          (Date)                                  │ │
│  │  - comments         (Long text)                             │ │
│  │  - isDelayed        (Checkbox)                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  Total Records: 78 Projects                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Authentication Flow

```
┌──────────┐
│  User    │
│ enters   │
│ /login   │
└────┬─────┘
     │
     ▼
┌────────────────┐
│ Login Screen   │
│ - Email input  │
│ - Password     │
└────┬───────────┘
     │
     ▼
┌──────────────────┐      ┌────────────────────┐
│  Auth Service    │─────▶│  LocalStorage      │
│  - Validate user │      │  Save user session │
│  - Return user   │      └────────────────────┘
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│  Auth Context    │
│  - Set user      │
│  - Set role      │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ Protected Routes │
│ → Dashboard      │
└──────────────────┘
```

### CRUD Operations Flow (Admin Only)

```
CREATE PROJECT:
User clicks "Add" → Modal opens → Fill form → Save
  → createProject() → POST to Airtable → Update local state → Toast success

READ PROJECTS:
App loads → fetchProjects() → GET from Airtable (with pagination)
  → Update ProjectsContext → Render in all screens

UPDATE PROJECT:
User clicks project → Modal opens → Edit form → Save
  → updateProject() → PATCH to Airtable → Update local state → Toast success

DELETE PROJECT:
User clicks "Delete" → Confirm dialog → Delete
  → deleteProject() → DELETE from Airtable → Remove from local state → Toast success
```

### Directeur (Read-Only) Flow

```
Directeur logs in
  ↓
All screens visible
  ↓
Click project → Modal opens → Form fields DISABLED
  ↓
No "Add" button
  ↓
No "Delete" button
  ↓
No "Save" button
  ↓
Blue banner: "Mode lecture seule"
```

---

## Component Hierarchy

```
App.tsx
└── RouterProvider
    ├── /login → Login.tsx
    └── / → ProtectedRoute
        └── Root.tsx
            ├── AuthContext
            ├── ProjectsContext
            ├── TopNavigation.tsx
            │   ├── Navigation links
            │   ├── User badge (role)
            │   └── Logout button
            └── Outlet (child routes)
                ├── /               → DashboardOverview.tsx
                │   ├── KPI Cards
                │   ├── Pie Chart (Recharts)
                │   └── Projects Table
                ├── /projets        → ProjectsKanban.tsx
                │   ├── 9 Status Columns
                │   ├── Project Cards
                │   └── ProjectModal
                └── /chronologie    → TimelineGantt.tsx
                    ├── Filters (Dept, Status)
                    ├── Gantt Chart
                    └── Timeline Bars
```

---

## Services Layer

### Airtable Service (`/services/airtable.ts`)

```typescript
Functions:
- isAirtableConfigured()      → Check if API key exists
- fetchProjects()              → GET all projects (with pagination)
- createProject(project)       → POST new project
- updateProject(id, updates)   → PATCH existing project
- deleteProject(id)            → DELETE project

Features:
✅ Automatic pagination (gets all 78 projects)
✅ Error handling with user-friendly messages
✅ Toast notifications on success/error
✅ Fallback to mock data if not configured
```

### Auth Service (`/services/auth.ts`)

```typescript
Functions:
- login(email, password)       → Authenticate user
- logout()                     → Clear session
- getCurrentUser()             → Get stored user
- isAuthenticated()            → Check if logged in

Current Implementation:
⚠️  Simple localStorage-based auth (for demo)
🔐  Production: Use Supabase Authentication

Demo Users:
1. admin@entreprise.fr / admin123
2. directeur@entreprise.fr / directeur123
```

---

## State Management

### AuthContext

```typescript
State:
- user: User | null
- isAuthenticated: boolean
- isAdmin: boolean
- isDirecteur: boolean
- loading: boolean

Methods:
- login(email, password)
- logout()
```

### ProjectsContext

```typescript
State:
- projects: Project[]
- loading: boolean
- error: string | null
- usingMockData: boolean

Methods:
- refreshProjects()
- createProject(project)
- updateProject(id, updates)
- deleteProject(id)

Behavior:
- On mount: Fetch from Airtable
- If Airtable fails: Use mock data (12 projects)
- All CRUD ops: Update Airtable + local state
```

---

## Permission Matrix

| Feature | Admin | Directeur |
|---------|-------|-----------|
| View Dashboard | ✅ | ✅ |
| View KPIs & Charts | ✅ | ✅ |
| View Kanban Board | ✅ | ✅ |
| View Timeline | ✅ | ✅ |
| Create Project | ✅ | ❌ |
| Edit Project | ✅ | ❌ |
| Delete Project | ✅ | ❌ |
| View Project Details | ✅ | ✅ (read-only) |
| "Add Project" Button | ✅ Visible | ❌ Hidden |
| Form Fields | ✅ Enabled | ❌ Disabled |
| "Save" Button | ✅ Visible | ❌ Hidden |
| "Delete" Button | ✅ Visible | ❌ Hidden |

---

## Environment Variables

### Required for Airtable

```bash
VITE_AIRTABLE_API_KEY      # Personal access token from Airtable
VITE_AIRTABLE_BASE_ID      # Base ID (starts with 'app')
VITE_AIRTABLE_TABLE_NAME   # Table name (default: 'Projects')
```

### Optional for Auth

```bash
VITE_ADMIN_EMAIL           # Admin login email
VITE_ADMIN_PASSWORD        # Admin password
VITE_DIRECTEUR_EMAIL       # Directeur login email
VITE_DIRECTEUR_PASSWORD    # Directeur password
```

### Where to Set

**Development:**
- `.env.local` file in project root

**Production (Vercel):**
- Project Settings → Environment Variables

**Production (Netlify):**
- Site Settings → Build & Deploy → Environment

---

## API Endpoints (Airtable)

### Base URL
```
https://api.airtable.com/v0/{BASE_ID}/{TABLE_NAME}
```

### Endpoints Used

```
GET    /                    → Fetch all records (with pagination)
POST   /                    → Create new record
PATCH  /{recordId}          → Update record
DELETE /{recordId}          → Delete record
```

### Headers

```javascript
{
  "Authorization": "Bearer {API_KEY}",
  "Content-Type": "application/json"
}
```

### Response Format

```json
{
  "records": [
    {
      "id": "recXXXXXXXXXXXXXX",
      "fields": {
        "name": "Project Name",
        "department": "DSI",
        "status": "En exécution",
        ...
      },
      "createdTime": "2026-03-10T10:00:00.000Z"
    }
  ],
  "offset": "itrXXXXXXXXXXXXXX"  // If more pages exist
}
```

---

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **React Router** - Navigation
- **Vite** - Build tool

### UI Components
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **Recharts** - Charts & graphs
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Data & State
- **React Context API** - Global state
- **Airtable API** - Database
- **localStorage** - Session persistence

---

## File Structure

```
/
├── services/
│   ├── airtable.ts              # Airtable API
│   └── auth.ts                  # Authentication
├── contexts/
│   ├── AuthContext.tsx          # Auth state
│   └── ProjectsContext.tsx      # Projects state
├── components/
│   ├── screens/
│   │   ├── Login.tsx
│   │   ├── DashboardOverview.tsx
│   │   ├── ProjectsKanban.tsx
│   │   └── TimelineGantt.tsx
│   ├── ui/                      # shadcn components
│   ├── TopNavigation.tsx
│   ├── ProjectModal.tsx
│   └── ProtectedRoute.tsx
├── types/
│   ├── project.ts               # Project types
│   └── user.ts                  # User types
├── data/
│   └── mockProjects.ts          # Fallback data
├── routes.ts                    # Route config
├── App.tsx                      # Entry point
├── .env.local                   # Config (not in git)
└── .env.local.example           # Template
```

---

## Security Considerations

### ⚠️ Current Implementation

**Auth:**
- Simple email/password check
- localStorage for session
- No password hashing
- **Suitable for:** Internal demo, low-risk environments
- **NOT suitable for:** Production with sensitive data

### 🔐 Production Recommendations

1. **Use Supabase Authentication:**
   - Built-in security
   - JWT tokens
   - Row-level security
   - Email verification
   - Password reset

2. **Or implement:**
   - bcrypt password hashing
   - Server-side session validation
   - HTTPS only
   - CSRF protection
   - Rate limiting

3. **API Keys:**
   - Never commit to Git
   - Use environment variables
   - Rotate regularly
   - Minimum permissions

---

## Deployment Checklist

### Pre-Deploy

- [ ] Test all CRUD operations
- [ ] Test Admin & Directeur roles
- [ ] Verify Airtable connection
- [ ] Check all 78 projects load
- [ ] Test on desktop (1280px+)

### Deploy

- [ ] Push code to GitHub
- [ ] Deploy to Vercel/Netlify
- [ ] Add environment variables
- [ ] Test production URL
- [ ] Verify Airtable sync works

### Post-Deploy

- [ ] Share credentials with users
- [ ] Monitor error logs
- [ ] Set up analytics (optional)
- [ ] Document any customizations

---

## Scaling Considerations

### Current Capacity

✅ **78 projects** - Works perfectly  
✅ **Airtable pagination** - Handles larger datasets  
✅ **React optimization** - Fast rendering

### If You Need More

**1000+ projects:**
- Add virtualization (react-window)
- Implement server-side filtering
- Add search/pagination UI

**Multiple teams:**
- Add team management
- Add more roles (Chef de Projet, etc.)
- Implement row-level permissions

**Real-time updates:**
- Add WebSocket connection
- Use Supabase Realtime
- Implement optimistic updates

---

## Future Enhancements

### Short-term (Easy)
- [ ] Add search functionality
- [ ] Add export to Excel/CSV
- [ ] Add project templates
- [ ] Add bulk operations
- [ ] Add project archiving

### Medium-term
- [ ] Add Supabase authentication
- [ ] Add file attachments
- [ ] Add project comments/notes
- [ ] Add activity log
- [ ] Add email notifications

### Long-term
- [ ] Add mobile app (React Native)
- [ ] Add real-time collaboration
- [ ] Add advanced analytics
- [ ] Add custom workflows
- [ ] Add integrations (Slack, Teams, etc.)

---

**For detailed setup instructions, see `AIRTABLE_SETUP_GUIDE.md` or `QUICK_START.md`**
