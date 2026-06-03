import api from './axios'

export const alertsApi = {
  getAll() {
    const auth = JSON.parse(localStorage.getItem('aquila_user') || '{}');
    const isAdmin = auth.role === 'admin' || auth.email === 'admin' || auth.email === 'admin@admin.ua';
    const params = !isAdmin && auth.id ? { userId: auth.id } : {};
    return api.get('/alerts', { params })
  },
  getUnread() {
    const auth = JSON.parse(localStorage.getItem('aquila_user') || '{}');
    const isAdmin = auth.role === 'admin' || auth.email === 'admin' || auth.email === 'admin@admin.ua';
    const params = !isAdmin && auth.id ? { userId: auth.id } : {};
    return api.get('/alerts/unread', { params })
  },
  getUnreadCount() {
    const auth = JSON.parse(localStorage.getItem('aquila_user') || '{}');
    const isAdmin = auth.role === 'admin' || auth.email === 'admin' || auth.email === 'admin@admin.ua';
    const params = !isAdmin && auth.id ? { userId: auth.id } : {};
    return api.get('/alerts/unread/count', { params })
  },
  getByDevice(deviceId) {
    return api.get(`/alerts/${deviceId}`)
  },
  create(data) {
    return api.post('/alerts', data)
  },
  markAsRead(id) {
    return api.put(`/alerts/${id}/read`)
  },
  markAsUnread(id) {
    return api.put(`/alerts/${id}/unread`)
  },
  delete(id) {
    return api.delete(`/alerts/${id}`)
  },
}
