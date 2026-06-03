import api from './axios'

export const snapshotsApi = {
  create(data) {
    return api.post('/snapshots', data)
  },
  getByDevice(deviceId, params = {}) {
    return api.get(`/snapshots/${deviceId}`, { params })
  },
  delete(id) {
    return api.delete(`/snapshots/${id}`)
  },
}
