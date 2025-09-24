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
  etudiantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Etudiant',
    required: true
  },
  produitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit',
    required: true
  }
});

module.exports = mongoose.model('Rapport', RapportSchema);
