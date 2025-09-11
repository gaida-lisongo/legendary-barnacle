const mongoose = require('mongoose');

const UniteSchema = new mongoose.Schema({
  semestreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Semestre' },
  responsable: [{
    titulaireId: { type: mongoose.Schema.Types.ObjectId, ref: 'Titulaire' },
    anneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Annee' }
  }],
  descripteur: {
    mention: String,
    code: String,
    designation: String,
    credit: Number,
    type: { type: String, enum: ['Obigatoire', 'Optionnelle'] },
    prealables: [String],
    objectif: [String],
    competences: [String],
    approches: [String],
    evaluation: [String]
  },
  ressources: [String],
  bibliographie: [String],
  videographie: [String],
  cours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cours' }]
});

module.exports = mongoose.model('Unite', UniteSchema);
