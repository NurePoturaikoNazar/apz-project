import api from './axios'

export const usersApi = {
  register(data) {
    return api.post('/users/register', data)
  },
  login(data) {
    return api.post('/users/login', data)
  },
  getAll() {
    return api.get('/users')
  },
  getById(id) {
    return api.get(`/users/${id}`)
  },
  update(id, data) {
    return api.put(`/users/${id}`, data)
  },
  changePassword(id, newPassword) {
    return api.patch(`/users/${id}/password`, { newPassword })
  },
  delete(id) {
    return api.delete(`/users/${id}`)
  },
}
