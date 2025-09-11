const mongoose = require('mongoose');

const ChargeSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  coursId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cours' },
  anneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Annee' }
});

module.exports = mongoose.model('Charge', ChargeSchema);
