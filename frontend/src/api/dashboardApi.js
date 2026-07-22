import api from './axiosInstance'

// GET /dashboard/summary
export async function getDashboardSummary() {
  const response = await api.get('/dashboard/summary')
  return response.data
}

// GET /dashboard/severity
export async function getDashboardSeverity() {
  const response = await api.get('/dashboard/severity')
  return response.data
}
