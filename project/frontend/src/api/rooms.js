import api from './axios'

export const roomsApi = {
  getAll() {
    return api.get('/rooms')
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
  getTelemetry(roomId) {
    return api.get(`/rooms/${roomId}/telemetry`)
  },
}
