const mongoose = require('mongoose');

const CoursSchema = new mongoose.Schema({
  titre: String,
  description: String,
  enseignement: [String],
  credit: Number,
  contenu: [String],
  repartition: [String],
  plan: [{
    anneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Annee' },
    contenu: [String]
  }],
  seances: [{
    anneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Annee' },
    produitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
    status: { type: String, enum: ['NO', 'PENDING', 'OK'] }
  }],
  travaux: [{
    anneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Annee' },
    produitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
    status: { type: String, enum: ['NO', 'PENDING', 'OK'] }
  }],
  ressources: [String],
  penalites: [String],
  plagiat: [String]
});

module.exports = mongoose.model('Cours', CoursSchema);
