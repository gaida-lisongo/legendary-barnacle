const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
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
  grade: String,
  titre: String,
  photo: String
});

module.exports = mongoose.model('Agent', AgentSchema);
