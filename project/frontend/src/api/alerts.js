import api from './axios'

export const alertsApi = {
  getAll() {
    return api.get('/alerts')
  },
  getUnread() {
    return api.get('/alerts/unread')
  },
  getUnreadCount() {
    return api.get('/alerts/unread/count')
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
