const mongoose = require('mongoose');

const RapportSchema = new mongoose.Schema({
  document: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['stage', 'sujet'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  etudiantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Etudiant',
    required: true
  }
});

module.exports = mongoose.model('Rapport', RapportSchema);
