const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true }],
  status: { type: String, enum: ['NO', 'PENDING', 'OK'], default: 'NO' },
  reference: { type: String, required: true },
  matricule: { type: String, required: false },
  telephone: { type: String, required: false },
  currency: { type: String, required: false },
  montant: { type: String, required: false }
});

module.exports = mongoose.model('Commande', CommandeSchema);
