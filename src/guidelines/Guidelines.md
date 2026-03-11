# French Project Management Dashboard - Development Guidelines

## WeWeb Export Compatibility

### Core Principles
* **Use only basic Figma components** - No third-party plugins
* **Ensure all frames are exportable** for WeWeb import
* **Standard HTML/CSS patterns only** - No custom renderers or canvas
* **Keep components simple** - Maximize no-code platform compatibility
* **Mock data separation** - Easy to replace with WeWeb collections

### Component Standards
* Use standard DOM elements (div, span, button, input, select, etc.)
* Avoid complex custom components that may not export properly
* All UI components from shadcn/ui (Radix UI based - accessible & exportable)
* No canvas-based rendering
* No third-party Figma plugins

### State Management
* Simple state with React useState
* Context API for global state (UserRole)
* No complex state libraries (Redux, Zustand, etc.)
* Clear data flow for easy WeWeb workflow integration

### Styling
* Tailwind CSS v4 utility classes
* CSS variables for theming (in `/styles/globals.css`)
* No PostCSS plugins beyond Tailwind
* Inline styles only when necessary
* Standard color system (no dynamic color generation)

## Application Structure

### Language & Content
* All content in French (UI, dates, messages, comments)
* French date formatting: `new Date().toLocaleDateString("fr-FR")`
* Realistic French IT enterprise project names
* French department names: DSI, DAF, RH, DGP, DDEV

### Navigation
* 4-screen system using React Router
  1. Dashboard - KPIs + charts (`/`)
  2. Kanban Board - 9 status columns (`/projets`)
  3. Timeline/Gantt - Project timeline (`/chronologie`)
  4. Project Modal - CRUD form (modal overlay)

### Role-Based Access Control
* Two roles: Admin (full CRUD) and Viewer (read-only)
* Toggle in TopNavigation to switch roles
* Viewers see disabled forms, hidden action buttons, info banners
* Easy to map to WeWeb user authentication

## Data Structure

### Status Types (9 total)
1. Non démarré - Gray (#94A3B8)
2. En étude - Purple (#9333EA)
3. En exécution - Yellow/Amber (#F59E0B)
4. En attente de Go pour production - Light Green (#86EFAC)
5. En production - Dark Green (#16A34A)
6. En service - Bright Green (#22C55E)
7. En pause - Gray (#6B7280)
8. Clôturé - Light Blue (#60A5FA)
9. Abandonné - Red (#DC2626)

### Priority Types (3 total)
* Haute - Red (#DC2626)
* Moyenne - Orange (#F97316)
* Basse - Gray (#6B7280)

### Department Types (5 total)
* DSI - Direction des Systèmes d'Information
* DAF - Direction Administrative et Financière
* RH - Ressources Humaines
* DGP - Direction Générale de Production
* DDEV - Direction du Développement

### Project Interface
See `/types/project.ts` for complete TypeScript interface with all fields:
* id, name, department, status, priority
* progress (0-100), projectManager, partners
* startDate, endDate, comments, isDelayed

## Design System

### Color Variables
Defined in `/styles/globals.css`:
* Status colors (9 variants)
* Priority colors (3 variants)
* Semantic colors (background, foreground, border, etc.)
* Chart colors (5 data series)

### Typography
* Base font size: 14px (`var(--font-size)`)
* Font weights: 400 (normal), 500 (medium)
* Heading styles: h1-h4 defined in base layer
* Standard line-height: 1.5

### Components
* Buttons: primary, outline, ghost variants
* Cards: with header, title, content sections
* Forms: input, select, textarea, slider
* Badges: for status and priority indicators
* Dialogs/Modals: for project CRUD operations
* Charts: Recharts pie chart for status distribution
* Toast notifications: Sonner for user feedback

## Code Organization

### File Structure
```
/components/screens/  - Main page components
/components/ui/      - Reusable UI components (shadcn)
/components/         - Layout & feature components
/contexts/           - Global state (UserRole)
/data/              - Mock data (mockProjects.ts)
/types/             - TypeScript interfaces
/styles/            - Global CSS & theme
```

### Best Practices
* Keep components focused and single-purpose
* Extract reusable logic into separate files
* Use TypeScript for type safety
* Comment complex logic
* Meaningful variable and function names
* Consistent formatting and indentation

## Export Preparation

### Before Export to WeWeb
1. Verify all components use standard HTML elements
2. Ensure no third-party Figma plugins are used
3. Check that all frames are properly named
4. Document data binding points
5. List all workflows needed (CRUD, filters, etc.)
6. Prepare mock data for initial import
7. Document role-based permission rules

### WeWeb Integration Points
* Replace `/data/mockProjects.ts` with WeWeb collection
* Map UserRoleContext to WeWeb user authentication
* Connect forms to WeWeb workflows (create, update, delete)
* Bind KPI calculations to WeWeb formulas
* Set up filtering logic in WeWeb
* Configure conditional visibility based on user role

## References
* See `/WEWEB_EXPORT_GUIDE.md` for complete export documentation
* See `/types/project.ts` for data structure
* See `/data/mockProjects.ts` for sample data
* See `/styles/globals.css` for theme variables
