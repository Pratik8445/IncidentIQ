import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'

import LoginPage          from './pages/LoginPage'
import RegisterPage       from './pages/RegisterPage'
import DashboardPage      from './pages/DashboardPage'
import LogsPage           from './pages/LogsPage'
import IncidentsPage      from './pages/IncidentsPage'
import IncidentDetailPage from './pages/IncidentDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected — all wrapped in Layout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/"               element={<DashboardPage />} />
            <Route path="/logs"           element={<LogsPage />} />
            <Route path="/incidents"      element={<IncidentsPage />} />
            <Route path="/incidents/:id"  element={<IncidentDetailPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
