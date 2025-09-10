const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  anneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Annee' },
  cours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cours' }],
  produitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' }
});

module.exports = mongoose.model('Session', SessionSchema);
