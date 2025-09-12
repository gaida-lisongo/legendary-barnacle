const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true, unique: true },
  role: { type: String, default: 'admin' },
  quotite: { type: Number, required: false, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
