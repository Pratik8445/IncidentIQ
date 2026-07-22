import api from './axiosInstance'

// GET /api/v1/incidents/?limit=20&offset=0
export async function getIncidents(limit = 20, offset = 0) {
  const response = await api.get('/api/v1/incidents/', {
    params: { limit, offset },
  })
  return response.data
}

// GET /api/v1/incidents/:id
export async function getIncident(id) {
  const response = await api.get(`/api/v1/incidents/${id}`)
  return response.data
}

// PATCH /api/v1/incidents/:id/assign
export async function assignIncident(id, assigned_to) {
  const response = await api.patch(`/api/v1/incidents/${id}/assign`, {
    assigned_to,
  })
  return response.data
}

// PATCH /api/v1/incidents/:id/status
export async function updateIncidentStatus(id, status) {
  const response = await api.patch(`/api/v1/incidents/${id}/status`, {
    status,
  })
  return response.data
}
