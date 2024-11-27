const mongoose = require('mongoose');

const ManagerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    department: String,
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: false,  }
  });
  module.exports = mongoose.model('Manager', ManagerSchema);
  