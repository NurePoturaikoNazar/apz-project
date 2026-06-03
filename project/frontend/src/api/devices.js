import api from './axios'

export const devicesApi = {
  getAll() {
    return api.get('/devices')
  },
  getById(id) {
    return api.get(`/devices/${id}`)
  },
  getByMac(macAddress) {
    return api.get(`/devices/by-mac/${macAddress}`)
  },
  create(data) {
    return api.post('/devices', data)
  },
  update(id, data) {
    return api.put(`/devices/${id}`, data)
  },
  delete(id) {
    return api.delete(`/devices/${id}`)
  },
  getTelemetry(deviceId, params = {}) {
    return api.get(`/devices/${deviceId}/telemetry`, { params })
  },
  getAlerts(deviceId) {
    return api.get(`/devices/${deviceId}/alerts`)
  },
}
