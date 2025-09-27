const mongoose = require('mongoose');

const ResultatSchema = new mongoose.Schema({
    classeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', required: true },
    etudiantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Etudiant', required: true },
    telephone: { type: String, required: false },
    reference: { type: String, required: false },
    montant: { type: Number, required: false },
    currency: { type: String, required: false },
    status: { type: String, enum: ['NO', 'PENDING', 'OK'], default: 'NO' },
});

module.exports = mongoose.model('Resultat', ResultatSchema);
