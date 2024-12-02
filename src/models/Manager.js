// const mongoose = require('mongoose');

// const ManagerSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   phone: { type: String, required: true },
//   department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
//   managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: false } // Make managerId optional
// });

// module.exports = mongoose.model('Manager', ManagerSchema);

const mongoose = require('mongoose');

const ManagerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  role: { type: String, enum: ['Manager', 'Employee'], required: true }, // Added role to distinguish
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: false } // Optional for hierarchy
});

module.exports = mongoose.model('Manager', ManagerSchema);
