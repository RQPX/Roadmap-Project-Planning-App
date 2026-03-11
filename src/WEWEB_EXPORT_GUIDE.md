# WeWeb Export Compatibility Guide

## 📋 Overview

This French Project Management Dashboard is built with **WeWeb export compatibility** as a core design principle. All components use basic, standard patterns that translate seamlessly to no-code platforms.

---

## ✅ Export Compatibility Checklist

### Component Standards
- ✅ **Basic Figma components only** - No third-party plugins
- ✅ **Standard HTML/CSS patterns** - All components use div, span, button, input, etc.
- ✅ **No canvas-based rendering** - Pure DOM elements
- ✅ **No complex custom renderers** - Standard React patterns
- ✅ **Exportable frames** - All layouts properly structured for export

### State & Data
- ✅ **Simple state management** - React useState + Context API
- ✅ **Clear data structure** - Well-defined TypeScript interfaces
- ✅ **Mock data separation** - Easy to replace with WeWeb data sources
- ✅ **No external APIs** - All data is local/mock

### Styling
- ✅ **Tailwind CSS v4** - Standard utility classes
- ✅ **CSS variables** - Theme tokens in globals.css
- ✅ **No PostCSS plugins** - Pure CSS
- ✅ **Inline styles only when necessary** - Tailwind-first approach

---

## 🏗️ Architecture Overview

### File Structure
```
/
├── App.tsx                    # Main entry point with RouterProvider
├── routes.ts                  # React Router configuration
├── types/project.ts          # TypeScript interfaces & constants
├── data/mockProjects.ts      # Mock data (replace in WeWeb)
├── contexts/
│   └── UserRoleContext.tsx   # Global role state
├── components/
│   ├── Root.tsx              # Root layout with navigation
│   ├── TopNavigation.tsx     # Top nav bar with role toggle
│   ├── ProjectModal.tsx      # CRUD modal for projects
│   ├── screens/              # Main page components
│   │   ├── DashboardOverview.tsx   # KPIs + Charts
│   │   ├── ProjectsKanban.tsx      # 9-column Kanban
│   │   └── TimelineGantt.tsx       # Timeline/Gantt view
│   └── ui/                   # shadcn/ui components
└── styles/globals.css        # Theme variables
```

---

## 🔄 WeWeb Integration Strategy

### 1. Data Replacement

**Current Mock Data Location**: `/data/mockProjects.ts`

**Replace with WeWeb Collection:**
```javascript
// Current structure
export const mockProjects: Project[] = [...]

// WeWeb equivalent: Create a "Projects" collection with these fields:
// - id (Text)
// - name (Text)
// - department (Text - Options: DSI, DAF, RH, DGP, DDEV)
// - status (Text - 9 options, see below)
// - priority (Text - Options: Haute, Moyenne, Basse)
// - progress (Number - 0-100)
// - projectManager (Text)
// - partners (Text)
// - startDate (Date)
// - endDate (Date)
// - comments (Text/Long Text)
// - isDelayed (Boolean)
```

**Status Options (9 types):**
1. Non démarré
2. En étude
3. En exécution
4. En attente de Go pour production
5. En production
6. En service
7. En pause
8. Clôturé
9. Abandonné

### 2. State Management

**Current Context**: `/contexts/UserRoleContext.tsx`

**WeWeb User Authentication:**
```javascript
// Current role state
const [role, setRole] = useState<"admin" | "viewer">("admin")

// Replace with WeWeb user roles/permissions
// Map to WeWeb's built-in authentication system
```

### 3. Component Mapping

| Current Component | WeWeb Element | Notes |
|------------------|---------------|-------|
| DashboardOverview | Page | Main dashboard with KPI cards |
| ProjectsKanban | Page | Kanban board view |
| TimelineGantt | Page | Timeline/Gantt chart |
| ProjectModal | Modal/Popup | Project form (CRUD) |
| TopNavigation | Navigation Bar | Top menu with role toggle |
| KPI Cards | Flex containers | Statistics display |
| Project Cards | Repeater/List | Display project data |
| Forms | Form elements | Input, Select, Textarea, Slider |

---

## 📊 Data Binding Points

### Dashboard Screen (`DashboardOverview.tsx`)

**KPI Calculations (bind to WeWeb formulas):**
```javascript
// Total Projects
projects.length

// In Progress Projects
projects.filter(p => p.status === "En exécution").length

// Completed Projects
projects.filter(p => p.status === "Clôturé").length

// Average Progress
projects.reduce((sum, p) => sum + p.progress, 0) / projects.length

// Status Distribution (for pie chart)
status => projects.filter(p => p.status === status).length
```

### Kanban Screen (`ProjectsKanban.tsx`)

**Column Grouping (9 columns):**
```javascript
// Group projects by status
const columns = [
  "Non démarré",
  "En étude", 
  "En exécution",
  "En attente de Go pour production",
  "En production",
  "En service",
  "En pause",
  "Clôturé",
  "Abandonné"
]

// For each column:
projects.filter(p => p.status === columnStatus)
```

### Timeline Screen (`TimelineGantt.tsx`)

**Date Filtering:**
```javascript
// Filter by department
projects.filter(p => !selectedDept || p.department === selectedDept)

// Filter by status
.filter(p => !selectedStatus || p.status === selectedStatus)

// Sort by start date
.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
```

### Project Modal (`ProjectModal.tsx`)

**Form Bindings:**
- Project Name → Text Input
- Department → Select (5 options)
- Status → Select (9 options)
- Priority → Select (3 options)
- Progress → Slider (0-100)
- Project Manager → Text Input
- Partners → Text Input
- Start Date → Date Picker
- End Date → Date Picker
- Comments → Textarea
- Is Delayed → Checkbox (computed from dates)

---

## 🎨 Theme Variables (CSS)

**Location**: `/styles/globals.css`

**Key Color Variables for WeWeb:**
```css
/* Status Colors */
--status-en-execution: #F59E0B (Yellow/Amber)
--status-en-etude: #9333EA (Purple)
--status-cloture: #60A5FA (Light Blue)
--status-en-prod: #16A34A (Dark Green)
--status-en-service: #22C55E (Bright Green)
--status-en-pause: #6B7280 (Gray)
--status-non-demarre: #94A3B8 (Gray-blue)
--status-abandonne: #DC2626 (Red)
--status-attente-go: #86EFAC (Light Green)

/* Priority Colors */
--priority-haute: #DC2626 (Red)
--priority-moyenne: #F97316 (Orange)
--priority-basse: #6B7280 (Gray)

/* Base Theme */
--background: #ffffff
--foreground: #030213
--border: rgba(0, 0, 0, 0.1)
```

---

## 🔀 Workflows to Create in WeWeb

### 1. Create Project Workflow
**Trigger**: "Ajouter un Nouveau Projet" button click
**Actions**:
1. Open modal
2. On form submit → Create new record in Projects collection
3. Show success toast
4. Refresh project list
5. Close modal

### 2. Update Project Workflow
**Trigger**: Click on project card
**Actions**:
1. Load project data into modal
2. On form submit → Update record in Projects collection
3. Show success toast
4. Refresh project list
5. Close modal

### 3. Delete Project Workflow
**Trigger**: "Supprimer le projet" button in modal
**Actions**:
1. Confirm deletion
2. Delete record from Projects collection
3. Show success toast
4. Refresh project list
5. Close modal

### 4. Filter Projects Workflow
**Trigger**: Dropdown selection change
**Actions**:
1. Update filter state variable
2. Re-fetch/filter projects from collection
3. Update display

### 5. Toggle Role Workflow (Optional)
**Trigger**: Role toggle button click
**Actions**:
1. Switch between admin/viewer mode
2. Show/hide action buttons
3. Enable/disable form fields
4. Show role change notification

---

## 🚦 Role-Based Access Control

### Admin Role Features
- ✅ View all projects
- ✅ Create new projects
- ✅ Edit existing projects
- ✅ Delete projects
- ✅ All form fields enabled
- ✅ Action buttons visible

### Viewer Role Features
- ✅ View all projects
- ❌ No create button
- ❌ No edit capability
- ❌ No delete button
- 🔒 All form fields disabled
- ℹ️ Informative banner displayed

**Implementation in WeWeb:**
```javascript
// Conditional visibility formulas
Show "Create" button if: user.role === "admin"
Show "Edit" button if: user.role === "admin"
Show "Delete" button if: user.role === "admin"
Disable form fields if: user.role === "viewer"
```

---

## 📦 Component Dependencies

### UI Library: shadcn/ui
All UI components are from shadcn/ui (built on Radix UI):
- **Accessible** - Full ARIA support
- **Standard DOM** - No custom renderers
- **Composable** - Easy to replicate in WeWeb

**Key Components Used:**
- Button (primary, outline, ghost variants)
- Card (header, title, content)
- Dialog/Modal (for ProjectModal)
- Select (dropdowns)
- Input (text fields)
- Textarea (comments)
- Slider (progress)
- Badge (status, priority indicators)
- Progress (progress bars)
- Alert (info banners)
- Toast (sonner notifications)

### External Libraries
- **recharts** - Charts (pie chart in dashboard)
- **lucide-react** - Icons
- **sonner** - Toast notifications
- **react-router** - Navigation (4 pages)

**All are export-friendly** - Use standard SVG/HTML rendering

---

## 🔧 WeWeb Variables to Configure

### Page-Level Variables
```javascript
// Dashboard
- projects: Array<Project> (from Collection)
- kpiData: Object (calculated from projects)
- chartData: Array (status distribution)

// Kanban
- projects: Array<Project>
- columns: Array<StatusColumn>
- draggedProject: Object (for drag-drop)

// Timeline
- projects: Array<Project>
- selectedDepartment: String | null
- selectedStatus: String | null
- filteredProjects: Array (computed)

// Modal
- isOpen: Boolean
- mode: "create" | "edit"
- selectedProject: Object | null
- formData: Object
```

### Global Variables
```javascript
- currentUser: Object (user info)
- userRole: "admin" | "viewer"
- allProjects: Array<Project> (cached)
```

---

## 📱 Responsive Considerations

**Desktop-First Design**:
- Optimized for screens 1280px and wider
- Kanban board requires horizontal space (9 columns)
- Timeline/Gantt chart benefits from large viewport
- Can add mobile breakpoints if needed

**Recommended Breakpoints** (if adding mobile):
```css
- Desktop: 1280px+ (current)
- Tablet: 768px - 1279px (optional)
- Mobile: < 768px (optional)
```

---

## 🌐 French Localization

All content is in French:
- ✅ UI labels and buttons
- ✅ Toast notifications
- ✅ Form placeholders
- ✅ Error messages
- ✅ Date formatting (`fr-FR` locale)
- ✅ Department names (DSI, DAF, RH, DGP, DDEV)

**Date Formatting:**
```javascript
// JavaScript
new Date(dateString).toLocaleDateString("fr-FR")
// Output: "15/01/2026"

// Long format
new Date(dateString).toLocaleDateString("fr-FR", { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})
// Output: "15 janvier 2026"
```

---

## 🎯 Quick Start Guide for WeWeb

### Step 1: Set Up Collection
Create "Projects" collection with all fields listed above

### Step 2: Import Mock Data
Use the data from `/data/mockProjects.ts` as initial records

### Step 3: Create Pages
- Dashboard (`/`)
- Projets (`/projets`)
- Chronologie (`/chronologie`)

### Step 4: Build Components
- Top navigation bar
- Project modal/popup
- KPI cards (Dashboard)
- Kanban columns (Projets)
- Timeline chart (Chronologie)

### Step 5: Connect Data
- Bind collection to components
- Set up filtering formulas
- Configure CRUD workflows

### Step 6: Add Permissions
- Set up user roles (admin/viewer)
- Apply conditional visibility
- Disable forms for viewers

### Step 7: Test
- Create/edit/delete projects
- Switch between views
- Test filters
- Test role switching

---

## 📞 Support & Resources

### Key Files to Reference
- `/types/project.ts` - Data structure & colors
- `/data/mockProjects.ts` - Sample data
- `/components/ProjectModal.tsx` - Form structure
- `/components/screens/*` - Page layouts
- `/styles/globals.css` - Theme variables

### TypeScript Interfaces
All interfaces in `/types/project.ts` provide the exact data schema needed for WeWeb collection setup.

---

## ✨ Export Best Practices

1. **Test locally first** - Ensure all features work in React app
2. **Keep it simple** - Use basic components only
3. **Document data flow** - Clear comments in code
4. **Use semantic HTML** - Proper element structure
5. **Avoid complex state** - Keep state management flat
6. **Test with mock data** - Verify before connecting real data
7. **Export incrementally** - One page at a time
8. **Validate permissions** - Test admin vs viewer modes

---

**🎉 Your app is ready for WeWeb export! All components use standard, exportable patterns.**
