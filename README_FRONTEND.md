# Frontend Documentation

This document describes the frontend exactly as implemented in the repository. It is based on the React application in the frontend/src folder, the routing setup, the API integration layer, the authentication flow, the layout components, and the page-level UI modules.

---

# 1. Frontend Overview

## Purpose
The frontend is the user interface for the AI Operations Center. It allows users to log in, view incident summaries, browse logs, inspect incidents, and trigger AI-based incident analysis.

## Responsibilities
The frontend currently handles:
- Authentication screens for login and registration
- Protected routing
- Dashboard visualization
- Log browsing and log ingestion
- Incident review and assignment
- AI report modal display
- Role-based UI visibility

## Why the frontend exists
The frontend exists because end users need a visual and interactive way to use the backend services. It turns API responses into a usable experience for operators and engineers.

## Frontend architecture at a glance
The frontend is a React-based client that talks to the backend through a thin API layer.

```text
React Pages and Components
  ↓
Context and Hooks
  ↓
API Modules
  ↓
FastAPI Backend
```

This structure works well for the current app because it keeps the UI modular, makes state management simple through context, and isolates network communication in dedicated API helpers. The current implementation is lightweight and focused on operational workflows rather than a highly complex single-page application architecture.

---

# 2. Folder Structure

## frontend/src/
This is the main source folder for all frontend code.

### src/api/
Contains API helper modules that wrap HTTP calls.

- Why it exists: to centralize network requests
- What belongs inside: Axios-based request functions
- When it is used: whenever a page or component needs data from the backend
- What should never be placed here: UI state logic or visual styling

### src/components/
Contains reusable UI building blocks.

- Why it exists: to keep the user interface modular and reusable
- What belongs inside: layout components, incident table, log form, badges, and UI utilities
- When it is used: by pages and other components
- What should never be placed here: business logic that should live in hooks or API modules

### src/context/
Contains React context providers.

- Why it exists: to share authentication state across the app
- What belongs inside: AuthContext and provider logic
- When it is used: for app-wide access to auth state
- What should never be placed here: route-specific page logic

### src/hooks/
Contains custom hooks.

- Why it exists: to encapsulate reusable logic such as authentication access and fetch behavior
- What belongs inside: useAuth and useFetch
- When it is used: by pages and components that need shared behavior
- What should never be placed here: pure presentational JSX

### src/pages/
Contains page-level React components.

- Why it exists: to represent the main screens of the application
- What belongs inside: LoginPage, RegisterPage, DashboardPage, LogsPage, IncidentsPage, IncidentDetailPage
- When it is used: by the router
- What should never be placed here: generic shared UI components

### src/routes/
Contains route wrappers.

- Why it exists: to protect routes and enforce authentication
- What belongs inside: ProtectedRoute
- When it is used: during routing
- What should never be placed here: page content or API logic

### src/utils/
Contains small helper utilities.

- Why it exists: to encapsulate common browser or auth logic
- What belongs inside: role checks and JWT payload decoding
- When it is used: by pages and components
- What should never be placed here: large components or API calls

### src/assets/
The repository structure includes an assets folder, but no specific asset files are present in the current snapshot.

### src/index.css
Contains global CSS styles and design tokens.

### src/main.jsx
Bootstraps the React application.

---

# 3. Explain Every File

## Root frontend files

### frontend/package.json
- Purpose: Declares the frontend dependencies and scripts.
- Why needed: It defines the Vite application, React version, API libraries, and developer commands.
- Who uses it: developers and the build tooling.
- Scripts: dev, build, lint, preview.

### frontend/vite.config.js
- Purpose: Configures the Vite development server.
- Why needed: It sets the port and proxies API requests to the backend.
- What it does: proxies /api, /dashboard, and /health to http://localhost:8000.
- What happens if removed: local development requests would not reach the backend automatically.

### frontend/index.html
- Purpose: The HTML entry point for the Vite app.
- Why needed: It provides the root container for React rendering.

---

## Application entry files

### frontend/src/main.jsx
- Purpose: Mounts the React application to the DOM.
- Why needed: It is the real entrypoint for the browser.
- Who imports it: the browser via index.html.
- What happens if removed: the app would not render.

### frontend/src/App.jsx
- Purpose: Defines the application router and wraps the app in AuthProvider.
- Why needed: It establishes the route structure and public/protected boundaries.
- Routes defined: /login, /register, /, /logs, /incidents, /incidents/:id.
- What happens if removed: navigation and route rendering would break.

---

## API layer files

### frontend/src/api/axiosInstance.js
- Purpose: Creates the shared Axios client.
- Why needed: It centralizes base URL handling and request/response interceptors.
- What it does: attaches the JWT token to requests and redirects users to /login on 401.
- Who uses it: the other API modules.
- What happens if removed: every API call would need to manage auth headers and redirects manually.

### frontend/src/api/authApi.js
- Purpose: Provides login and registration API calls.
- Why needed: It wraps the auth endpoints used by login/register pages.
- Functions: loginUser(), registerUser()
- Who uses it: LoginPage and RegisterPage.

### frontend/src/api/dashboardApi.js
- Purpose: Fetches dashboard summary and severity data.
- Why needed: It exposes the dashboard API to the UI.
- Functions: getDashboardSummary(), getDashboardSeverity()
- Who uses it: DashboardPage and layout components.

### frontend/src/api/incidentsApi.js
- Purpose: Provides incident-related API calls.
- Why needed: It wraps incident list, detail, assignment, and status update endpoints.
- Functions: getIncidents(), getIncident(), assignIncident(), updateIncidentStatus()
- Who uses it: IncidentsPage, IncidentDetailPage, IncidentTable.

### frontend/src/api/logsApi.js
- Purpose: Provides log-related API calls.
- Why needed: It wraps log retrieval, log creation, and incident analysis actions.
- Functions: getLogs(), createLog(), analyzeIncident()
- Who uses it: LogsPage, LogForm.

---

## Context and hooks

### frontend/src/context/AuthContext.jsx
- Purpose: Provides authentication state across the app.
- Why needed: It stores the JWT token, the parsed user info, and helpers for login/logout.
- State: token, user, isAuthenticated.
- Who uses it: all pages and components that need auth state.
- What happens if removed: components would need to manage auth state manually.

### frontend/src/hooks/useAuth.js
- Purpose: Exposes the authentication context to components.
- Why needed: It simplifies access to auth state.
- Who uses it: pages and components such as LoginPage, DashboardPage, ProtectedRoute.

### frontend/src/hooks/useFetch.js
- Purpose: Implements a generic data-loading hook.
- Why needed: It reduces repeated loading/error state handling in pages.
- Functions: useFetch(fetchFn, deps, skip)
- State: loading, error, data.
- What happens if removed: each page would need to duplicate loading and error state code.

---

## Routing files

### frontend/src/routes/ProtectedRoute.jsx
- Purpose: Protects the app’s main routes.
- Why needed: It redirects unauthenticated users to /login.
- Who uses it: App.jsx.
- What happens if removed: protected pages become accessible without authentication.

---

## Page files

### frontend/src/pages/LoginPage.jsx
- Purpose: Renders the login screen.
- Why needed: It allows users to sign in.
- State: form, loading, error.
- Behavior: submits credentials to the backend, stores the JWT, and redirects to the dashboard.
- Who uses it: the router.

### frontend/src/pages/RegisterPage.jsx
- Purpose: Renders the registration screen.
- Why needed: It allows new users to create accounts.
- State: form, loading, error, success.
- Behavior: submits registration data to the backend and shows success feedback.

### frontend/src/pages/DashboardPage.jsx
- Purpose: Renders the dashboard screen.
- Why needed: It gives users a summary of incident status and severity.
- Data sources: dashboard summary and severity endpoints.
- UI: stat cards and charts using Recharts.
- Behavior: allows refresh and links to the incidents view.

### frontend/src/pages/LogsPage.jsx
- Purpose: Renders the logs screen.
- Why needed: It allows users to browse logs, add a new log entry, and trigger AI incident analysis.
- State: showForm, levelFilter, analyzing, analysis result.
- Behavior: fetches logs, filters them client-side, and displays AI analysis output in a modal.

### frontend/src/pages/IncidentsPage.jsx
- Purpose: Renders the incidents listing page.
- Why needed: It allows users to filter incident records by severity and status.
- State: offset, severityFilter, statusFilter.
- Behavior: fetches incident pages and renders the incident table.

### frontend/src/pages/IncidentDetailPage.jsx
- Purpose: Renders the detailed incident view.
- Why needed: It shows one incident plus its AI report and update controls.
- Behavior: fetches one incident, allows status updates and assignment, and opens the AI report modal.

---

## Layout components

### frontend/src/components/layout/Layout.jsx
- Purpose: Defines the overall shell for protected pages.
- Why needed: It wraps the page content with the sidebar and topbar.
- State: sidebarOpen.
- What happens if removed: protected pages lose their global navigation frame.

### frontend/src/components/layout/Sidebar.jsx
- Purpose: Renders the left navigation sidebar.
- Why needed: It provides navigation to Dashboard, Logs, and Incidents.
- Behavior: shows live incident counts from the dashboard summary endpoint.

### frontend/src/components/layout/Topbar.jsx
- Purpose: Renders the top header bar.
- Why needed: It shows the current page, open incident alert count, and user menu.
- Behavior: supports logout and navigation to incidents.

---

## Incident-related components

### frontend/src/components/incidents/IncidentTable.jsx
- Purpose: Displays incidents in a table.
- Why needed: It provides an interactive list of incidents with actions.
- Behavior: supports viewing AI reports, assigning incidents, and updating status.
- Who uses it: IncidentsPage.

### frontend/src/components/incidents/AiReportModal.jsx
- Purpose: Displays the AI-generated incident report in a modal.
- Why needed: It gives the user a full-screen-like read experience for long reports.
- Behavior: closes on Escape and on backdrop click.

---

## Log-related components

### frontend/src/components/logs/LogForm.jsx
- Purpose: Renders the form used to submit a new log entry.
- Why needed: It lets users create log data for testing and demonstration.
- State: form, loading, error, success.
- Behavior: converts the timestamp to ISO format and calls the backend.

### frontend/src/components/logs/LogTable.jsx
- Purpose: Displays logs in a table.
- Why needed: It turns raw log data into a readable UI.
- Who uses it: LogsPage.

---

## UI utility components

### frontend/src/components/ui/Badge.jsx
- Purpose: Renders status, severity, and level badges.
- Why needed: It gives the app consistent colored tags for incident states.
- Who uses it: incident and log views.

### frontend/src/components/ui/StatCard.jsx
- Purpose: Renders summary cards on the dashboard.
- Why needed: It gives the dashboard a compact visual summary of metrics.
- Behavior: is clickable and navigates to incidents when provided a route.

### frontend/src/components/ui/Spinner.jsx
- Purpose: Displays a loading spinner.
- Why needed: It gives visual feedback during async requests.

### frontend/src/components/ui/ErrorMessage.jsx
- Purpose: Displays inline error feedback.
- Why needed: It helps users understand failures without a full page crash.

### frontend/src/components/ui/EmptyState.jsx
- Purpose: Displays an empty state message.
- Why needed: It improves the experience when no data exists.

---

## Utility files

### frontend/src/utils/roleGuard.js
- Purpose: Defines role helpers.
- Why needed: It centralizes role-based access checks for the UI.
- Functions: hasRole(), constants for ROLES and WRITE_ROLES.

### frontend/src/utils/jwtDecode.js
- Purpose: Decodes JWT payloads client-side.
- Why needed: It lets the app read the token claims to populate auth state.
- Functions: decodeToken(), isTokenExpired().

---

# 4. React Architecture

## Component hierarchy
The frontend uses a simple component hierarchy:

```text
App
  └── AuthProvider
      └── Routes
          ├── LoginPage
          ├── RegisterPage
          └── ProtectedRoute
              └── Layout
                  ├── Sidebar
                  ├── Topbar
                  └── Page Component
```

## Routing
React Router is used for navigation between public and protected pages. The routes are defined in App.jsx.

## API calls
The frontend uses Axios for backend communication. The API modules in src/api abstract the endpoints.

## State management
The application uses React state and context rather than a larger state library.
- Local component state is used for form values and UI toggles.
- The AuthContext stores authentication state globally.

## Custom hooks
The app uses custom hooks for reusable logic:
- useAuth for accessing auth context
- useFetch for loading and error handling around API calls

## Reusable components
Common UI pieces such as Badge, Spinner, ErrorMessage, EmptyState, and StatCard are reused across multiple pages.

---

# 5. UI Flow

## User Login
1. The user opens /login.
2. The login form collects username and password.
3. The frontend calls authApi.loginUser().
4. If successful, the access token is stored in localStorage.
5. The app updates auth state and redirects to the dashboard.

## Dashboard
1. The dashboard page loads summary and severity data.
2. The data is shown with stat cards and charts.
3. The user can refresh the data or navigate to logs/incidents.

## Buttons and forms
- The Logs page includes buttons to add a log and run AI analysis.
- The Incidents page includes filters and a refresh button.
- The Incident detail page includes actions to update status and assign the incident.

## Requests
Most requests are handled asynchronously and show loading states or errors.

## Loading and errors
The app uses Spinner, ErrorMessage, and EmptyState to provide feedback for loading, failures, and empty result states.

---

# 6. API Communication

The frontend communicates with the backend through the following flow:

```text
Frontend
  ↓
Axios / API modules
  ↓
Backend
  ↓
Response JSON
  ↓
UI Update
```

## Authentication requests
The auth API calls go to /api/v1/auth/login and /api/v1/auth/register.

## Dashboard requests
The dashboard uses /dashboard/summary and /dashboard/severity.

## Incident requests
The incident pages call /api/v1/incidents/ and /api/v1/incidents/:id.

## Log requests
The logs page uses /api/v1/logs/ and /api/v1/logs/analyze.

---

# 7. Styling

The frontend uses CSS modules for component-scoped styling.

## Current styling approach
- Each component has a corresponding .module.css file
- Global styles live in src/index.css
- The design uses custom CSS variables and modern visual styling

## What is present
- CSS modules
- Global design tokens
- Responsive layout styles
- Component-level visual states

## What is not used here
- Tailwind CSS
- Material UI
- Bootstrap
- CSS-in-JS libraries

---

# 8. Performance

## Current performance characteristics
The frontend is lightweight and simple. It uses basic React rendering with client-side state and API calls.

## What is present
- Client-side fetching through custom hooks
- Conditional rendering for loading and empty states
- Recharts for chart rendering

## What is not implemented here
- Lazy loading of routes
- Code splitting beyond what Vite naturally provides
- Memoization beyond standard React patterns
- Advanced caching

---

# 9. Security

## XSS prevention
The app is a React application, so it benefits from React’s default escaping of rendered values. However, no additional sanitization layer is implemented beyond standard React rendering.

## Validation
The frontend performs basic validation in form inputs using HTML attributes such as required and minLength.

## Token storage
The access token is stored in localStorage.

## Protected routes
Protected pages are guarded by ProtectedRoute, which redirects unauthenticated users to /login.

## Important security observations
- The frontend is not using refresh tokens
- There is no client-side CSRF protection because the app is not using cookies for authentication
- The JWT is stored in localStorage, which is a simpler but less secure approach than HttpOnly cookies

---

# 10. Frontend Summary

The frontend is a clean, interview-friendly React application for an operations center. It provides authentication, protected routing, dashboard visualization, log review, incident management, and AI report inspection.

## Strengths
- Clear separation between pages, components, and API modules
- Reusable UI components
- Clean route structure
- Good role-based UI behavior
- Simple state management approach

## Limitations
- The app relies on localStorage for tokens
- It uses client-side filtering rather than server-side filtering for some views
- It does not implement lazy loading or a complex state library
- It is a solid prototype rather than a large-scale enterprise UI system

Overall, the frontend is a strong example of a modern React application with a practical, maintainable structure for a monitoring dashboard product.
