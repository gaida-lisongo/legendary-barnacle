const mongoose = require('mongoose');

const SemestreSchema = new mongoose.Schema({
  designation: String,
  description: String,
  unites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Unite' }],
  insription: [{
    anneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Annee' },
    produitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' }
  }]
});

module.exports = mongoose.model('Semestre', SemestreSchema);
