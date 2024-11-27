const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  department: String,
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager' },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
