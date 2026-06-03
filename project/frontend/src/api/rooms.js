import api from './axios'

export const roomsApi = {
  getAll() {
    const auth = JSON.parse(localStorage.getItem('aquila_user') || '{}');
    const isAdmin = auth.role === 'admin' || auth.email === 'admin' || auth.email === 'admin@admin.ua';
    const params = !isAdmin && auth.id ? { userId: auth.id } : {};
    return api.get('/rooms', { params })
  },
  getById(id) {
    return api.get(`/rooms/${id}`)
  },
  create(data) {
    return api.post('/rooms', data)
  },
  update(id, data) {
    return api.put(`/rooms/${id}`, data)
  },
  delete(id) {
    return api.delete(`/rooms/${id}`)
  },
  getTelemetry(roomId, params) {
    return api.get(`/rooms/${roomId}/telemetry`, { params })
  },
}
