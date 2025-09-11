const mongoose = require('mongoose');

const ProduitSchema = new mongoose.Schema({
  benefice: [String],
  designation: { type: String, required: true },
  image: String,
  montant: { type: Number, required: true },
  caracteristiques: [String],
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  anneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Annee', required: true },
  categorie: [String],
  avantages: [String]
});

module.exports = mongoose.model('Produit', ProduitSchema);
