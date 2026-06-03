import api from './axios'

export const telemetryApi = {
  send(data) {
    return api.post('/telemetry', data)
  },
  getByDevice(deviceId, params = {}) {
    return api.get(`/telemetry/${deviceId}`, { params })
  },
}
