const mongoose = require('mongoose');

const PrivilegeSchema = new mongoose.Schema({
  role: { type: String, required: true, trim: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true }
}, { timestamps: true });

PrivilegeSchema.index({ userId: 1, sectionId: 1, role: 1 }, { unique: true });

module.exports = mongoose.model('Privilege', PrivilegeSchema);