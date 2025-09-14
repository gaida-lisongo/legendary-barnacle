const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true },
  objet: { type: String, required: true },
  telephone: { type: String },
  contenu: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'OK'], default: 'PENDING' }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);