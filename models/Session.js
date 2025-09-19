const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  anneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Annee' },
  cours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cours' }],
  produitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
  nomSession: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
});

module.exports = mongoose.model('Session', SessionSchema);
