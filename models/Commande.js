const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true },
  statu: { type: String, enum: ['NO', 'PENDING', 'OK'], default: 'NO' },
  reference: { type: String, required: true },
  anneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Annee', required: true }
});

module.exports = mongoose.model('Commande', CommandeSchema);
