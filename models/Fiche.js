const mongoose = require('mongoose');

const FicheSchema = new mongoose.Schema({
  chargeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Charge', required: true },
  etudiantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Etudiant', required: false },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'REJECTED', required: true },
  reference: String,
  cmi: Number,
  examen: Number,
  rattrapage: Number,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  logs: [{
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
    justification: String
  }]
});

module.exports = mongoose.model('Fiche', FicheSchema);
