const mongoose = require('mongoose');

const ResolutionSchema = new mongoose.Schema({
    travailId: { type: mongoose.Schema.Types.ObjectId, ref: 'Travail', required: true },
    etudiantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Etudiant', required: true },
    url: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING', required: true },
    note: { type: Number, required: false }
});

module.exports = mongoose.model('Resolution', ResolutionSchema);