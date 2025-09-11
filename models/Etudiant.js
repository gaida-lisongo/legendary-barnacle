const mongoose = require('mongoose');

const EtudiantSchema = new mongoose.Schema({
  nom: String,
  post_nom: String,
  prenom: String,
  sexe: String,
  nationalite: String,
  lieu_naissance: String,
  date_naissance: Date,
  matricule: String,
  secure: String,
  solde: Number,
  documents: [String],
  photo: String,
  semestres: [{
    semestreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Semestre' },
    anneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Annee' }
  }]
});

module.exports = mongoose.model('Etudiant', EtudiantSchema);
