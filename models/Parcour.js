const mongoose = require('mongoose');

const ParcourSchema = new mongoose.Schema({
    etudiant: { type: mongoose.Schema.Types.ObjectId, ref: 'Etudiant' },
    classe: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe' },
    annee: { type: mongoose.Schema.Types.ObjectId, ref: 'Annee' },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    faculteId: { type: String },
    etabId: { type: String }, 
}, {
    timestamps: true
});

module.exports = mongoose.model('Parcour', ParcourSchema);