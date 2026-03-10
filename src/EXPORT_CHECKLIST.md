# WeWeb Export Checklist

Use this checklist when exporting your French Project Management Dashboard to WeWeb.

---

## ✅ Pre-Export Verification

### Component Standards
- [ ] All components use standard HTML elements (div, span, button, etc.)
- [ ] No third-party Figma plugins used
- [ ] No canvas-based rendering
- [ ] All frames properly named and organized
- [ ] shadcn/ui components are exportable (Radix UI based)

### Code Review
- [ ] All TypeScript types documented in `/types/project.ts`
- [ ] Mock data clearly separated in `/data/mockProjects.ts`
- [ ] State management is simple (useState + Context)
- [ ] No complex dependencies that can't be replicated
- [ ] Comments added for WeWeb integration points

### Testing
- [ ] All 3 screens working (Dashboard, Kanban, Timeline)
- [ ] Project modal opens and displays correctly
- [ ] Role switching works (Admin/Viewer)
- [ ] Forms submit correctly
- [ ] Filters work on Timeline view
- [ ] All toast notifications appear

---

## 📦 WeWeb Setup

### Step 1: Create Collection
- [ ] Create "Projects" collection in WeWeb
- [ ] Add all 12 fields from Project interface:
  - [ ] id (Text, unique)
  - [ ] name (Text)
  - [ ] department (Text with 5 options)
  - [ ] status (Text with 9 options)
  - [ ] priority (Text with 3 options)
  - [ ] progress (Number, 0-100)
  - [ ] projectManager (Text)
  - [ ] partners (Text)
  - [ ] startDate (Date)
  - [ ] endDate (Date)
  - [ ] comments (Long Text)
  - [ ] isDelayed (Boolean)

### Step 2: Import Initial Data
- [ ] Copy data from `/data/mockProjects.ts`
- [ ] Import 12 sample projects into collection
- [ ] Verify all fields populated correctly
- [ ] Test data displays in WeWeb

### Step 3: Create Pages
- [ ] Create page: "/" (Dashboard)
- [ ] Create page: "/projets" (Kanban)
- [ ] Create page: "/chronologie" (Timeline)
- [ ] Set up navigation links between pages

### Step 4: Build Navigation
- [ ] Create TopNavigation component
- [ ] Add navigation links (Dashboard, Projets, Chronologie)
- [ ] Add role toggle button
- [ ] Style navigation bar

---

## 🎨 Design System Setup

### Colors
- [ ] Import status colors from `/types/project.ts`
- [ ] Import priority colors from `/types/project.ts`
- [ ] Import theme colors from `/styles/globals.css`
- [ ] Create color variables in WeWeb

### Typography
- [ ] Set base font size: 14px
- [ ] Set font weights: 400 (normal), 500 (medium)
- [ ] Configure heading styles (h1-h4)

### Components
- [ ] Create reusable Button component (primary, outline)
- [ ] Create Card component (with header, title, content)
- [ ] Create Badge component (for status, priority)
- [ ] Create Progress bar component
- [ ] Create Modal/Dialog component

---

## 📊 Dashboard Page

### KPI Cards (4 total)
- [ ] Card 1: Total Projects
  - [ ] Formula: `projects.length`
- [ ] Card 2: In Progress
  - [ ] Formula: `projects.filter(p => p.status === "En exécution").length`
- [ ] Card 3: Completed
  - [ ] Formula: `projects.filter(p => p.status === "Clôturé").length`
- [ ] Card 4: Average Progress
  - [ ] Formula: `projects.reduce((sum, p) => sum + p.progress, 0) / projects.length`

### Pie Chart
- [ ] Set up Recharts or WeWeb chart component
- [ ] Calculate status distribution
- [ ] Formula for each status: `projects.filter(p => p.status === statusName).length`
- [ ] Apply status colors to chart segments

### Recent Projects List
- [ ] Display last 5 projects (sorted by startDate)
- [ ] Show: name, status badge, progress bar
- [ ] Make clickable to open modal

---

## 📋 Kanban Page

### Column Structure (9 columns)
- [ ] Column 1: Non démarré
- [ ] Column 2: En étude
- [ ] Column 3: En exécution
- [ ] Column 4: En attente de Go pour production
- [ ] Column 5: En production
- [ ] Column 6: En service
- [ ] Column 7: En pause
- [ ] Column 8: Clôturé
- [ ] Column 9: Abandonné

### Project Cards
- [ ] Display filtered projects in each column
- [ ] Formula per column: `projects.filter(p => p.status === columnStatus)`
- [ ] Show: name, department, priority badge, progress
- [ ] Make clickable to open modal
- [ ] Apply status color to card header

### Drag & Drop (Optional)
- [ ] Implement drag-drop if WeWeb supports
- [ ] Update project status on drop
- [ ] Show success toast

---

## 📅 Timeline Page

### Filters
- [ ] Department filter (dropdown with 5 options + "Tous")
- [ ] Status filter (dropdown with 9 options + "Tous")
- [ ] Apply filters to project list

### Timeline Display
- [ ] Sort projects by startDate
- [ ] Display each project as horizontal bar
- [ ] Show: name, dates, progress, status badge
- [ ] Calculate bar width based on duration
- [ ] Make clickable to open modal

### Date Formatting
- [ ] Use French locale: `fr-FR`
- [ ] Format: "15 janvier 2026" or "15/01/2026"

---

## 📝 Project Modal

### Form Fields
- [ ] Project Name (text input)
- [ ] Department (select with 5 options)
- [ ] Status (select with 9 options)
- [ ] Priority (select with 3 options)
- [ ] Progress (slider, 0-100)
- [ ] Project Manager (text input)
- [ ] Partners (text input)
- [ ] Start Date (date picker)
- [ ] End Date (date picker)
- [ ] Comments (textarea)

### Modal Modes
- [ ] Create mode: Empty form, "Créer" button
- [ ] Edit mode: Pre-filled form, "Enregistrer" + "Supprimer" buttons
- [ ] View mode (Viewer role): Disabled fields, no action buttons

### Workflows
- [ ] Create Project workflow
- [ ] Update Project workflow
- [ ] Delete Project workflow
- [ ] Close modal action

---

## 🔐 Role-Based Permissions

### Admin Role
- [ ] Show "Ajouter un Nouveau Projet" button
- [ ] Enable all form fields in modal
- [ ] Show "Enregistrer" button
- [ ] Show "Supprimer le projet" button
- [ ] Allow editing existing projects

### Viewer Role
- [ ] Hide "Ajouter un Nouveau Projet" button
- [ ] Disable all form fields in modal
- [ ] Hide "Enregistrer" button
- [ ] Hide "Supprimer le projet" button
- [ ] Show info banner: "Vous êtes en mode Lecture Seule"

### Role Toggle
- [ ] Create role toggle button in navigation
- [ ] Switch between admin/viewer
- [ ] Update UI based on role
- [ ] Show toast notification on role change

### Integration with WeWeb Auth
- [ ] Map WeWeb user roles to admin/viewer
- [ ] Use conditional visibility formulas
- [ ] Test with different user accounts

---

## 🔄 Workflows

### Create Project
- [x] Trigger: "Ajouter un Nouveau Projet" button click
- [ ] Action 1: Open modal in create mode
- [ ] Action 2: On form submit → Create record in Projects collection
- [ ] Action 3: Generate unique ID
- [ ] Action 4: Show success toast: "Projet créé avec succès"
- [ ] Action 5: Refresh project list
- [ ] Action 6: Close modal

### Update Project
- [ ] Trigger: Click on project card
- [ ] Action 1: Load project data
- [ ] Action 2: Open modal in edit mode
- [ ] Action 3: On form submit → Update record in Projects collection
- [ ] Action 4: Show success toast: "Projet mis à jour avec succès"
- [ ] Action 5: Refresh project list
- [ ] Action 6: Close modal

### Delete Project
- [ ] Trigger: "Supprimer le projet" button click
- [ ] Action 1: Show confirmation dialog
- [ ] Action 2: On confirm → Delete record from Projects collection
- [ ] Action 3: Show success toast: "Projet supprimé avec succès"
- [ ] Action 4: Refresh project list
- [ ] Action 5: Close modal

### Filter Projects
- [ ] Trigger: Dropdown selection change
- [ ] Action 1: Update filter variable
- [ ] Action 2: Re-fetch/filter projects from collection
- [ ] Action 3: Update display

---

## 🧪 Testing

### Functional Testing
- [ ] Create new project (all fields)
- [ ] Edit existing project
- [ ] Delete project
- [ ] Switch between pages (navigation works)
- [ ] Filter by department
- [ ] Filter by status
- [ ] Toggle between admin/viewer roles
- [ ] View project in viewer mode (fields disabled)

### Data Testing
- [ ] All 9 status types display correctly
- [ ] All 3 priority types display correctly
- [ ] All 5 departments display correctly
- [ ] Status colors apply correctly
- [ ] Priority colors apply correctly
- [ ] Progress bars display correctly (0-100%)

### UI Testing
- [ ] KPIs calculate correctly
- [ ] Pie chart displays status distribution
- [ ] Kanban columns show correct projects
- [ ] Timeline bars display correctly
- [ ] Modal opens and closes
- [ ] Toast notifications appear
- [ ] Forms validate input
- [ ] Dates format in French

### Responsive Testing (Optional)
- [ ] Test on desktop (1280px+)
- [ ] Test on tablet (768px-1279px)
- [ ] Test on mobile (<768px)

---

## 🌐 Localization

### French Content
- [ ] All UI labels in French
- [ ] All buttons in French
- [ ] All placeholders in French
- [ ] All toast messages in French
- [ ] Date formatting: `fr-FR` locale
- [ ] Department names in French
- [ ] Status labels in French
- [ ] Priority labels in French

---

## 📱 Notifications

### Toast Notifications
- [ ] Project created: "Projet créé avec succès"
- [ ] Project updated: "Projet mis à jour avec succès"
- [ ] Project deleted: "Projet supprimé avec succès"
- [ ] Role changed to admin: "Vous êtes maintenant en mode Administrateur"
- [ ] Role changed to viewer: "Vous êtes maintenant en mode Lecture Seule"
- [ ] Viewer tries to edit: "Accès refusé. Vous êtes en mode Lecture Seule"

---

## 📋 Final Checks

### Functionality
- [ ] All CRUD operations work
- [ ] All filters work
- [ ] All calculations are correct
- [ ] All navigation links work
- [ ] All role permissions work

### Design
- [ ] Colors match design system
- [ ] Typography is consistent
- [ ] Spacing is correct
- [ ] Components are aligned
- [ ] UI is polished

### Performance
- [ ] Pages load quickly
- [ ] Filters respond instantly
- [ ] No lag when switching views
- [ ] Modal animations smooth

### Documentation
- [ ] Users understand how to use the app
- [ ] Admin vs Viewer roles are clear
- [ ] Instructions for common tasks provided

---

## 🎉 Launch

- [ ] Final review of all pages
- [ ] Test with real users
- [ ] Gather feedback
- [ ] Make adjustments
- [ ] Deploy to production
- [ ] Monitor usage and errors

---

**Congratulations! Your French Project Management Dashboard is ready for WeWeb! 🚀**
