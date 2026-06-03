const User = require('../models/User');

exports.register = async (req, res) => {
  const { email, password, full_name } = req.body;
  const result = await User.register(email, password, full_name);
  
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(201).json(result.data);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const result = await User.login(email, password);
  
  if (!result.success) {
    return res.status(401).json({ error: result.error });
  }
  res.json(result.data);
};

exports.getAll = async (req, res) => {
  const result = await User.getAll();
  
  if (!result.success) {
    return res.status(500).json({ error: result.error });
  }
  res.json(result.data);
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  const result = await User.getById(id);
  
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json(result.data);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { email, full_name } = req.body;
  const result = await User.update(id, email, full_name);
  
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json(result.data);
};

exports.changePassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  
  if (!newPassword) {
    return res.status(400).json({ error: 'newPassword is required' });
  }
  
  const result = await User.changePassword(id, newPassword);
  
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json({ message: 'Password updated successfully', user: result.data });
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const result = await User.delete(id);
  
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json({ message: 'User deleted successfully', user: result.data });
};
