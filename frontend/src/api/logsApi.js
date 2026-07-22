import api from './axiosInstance'

// GET /api/v1/logs/
export async function getLogs() {
  const response = await api.get('/api/v1/logs/')
  return response.data
}

// POST /api/v1/logs/
export async function createLog(payload) {
  const response = await api.post('/api/v1/logs/', payload)
  return response.data
}

// POST /api/v1/logs/analyze
export async function analyzeIncident() {
  const response = await api.post('/api/v1/logs/analyze')
  return response.data
}
