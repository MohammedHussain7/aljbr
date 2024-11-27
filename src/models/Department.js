const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }, // Optional field for a department description
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Department', DepartmentSchema);
