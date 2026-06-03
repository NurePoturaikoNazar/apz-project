import api from './axios'

export const snapshotsApi = {
  create(data) {
    return api.post('/snapshots', data)
  },
  getAll() {
    const auth = JSON.parse(localStorage.getItem('aquila_user') || '{}');
    const isAdmin = auth.role === 'admin' || auth.email === 'admin' || auth.email === 'admin@admin.ua';
    const params = !isAdmin && auth.id ? { userId: auth.id } : {};
    return api.get('/snapshots', { params })
  },
  getByDevice(deviceId, params = {}) {
    return api.get(`/snapshots/${deviceId}`, { params })
  },
  delete(id) {
    return api.delete(`/snapshots/${id}`)
  },
}
