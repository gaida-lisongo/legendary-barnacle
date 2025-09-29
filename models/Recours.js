const mongoose = require('mongoose');

const RecoursSchema = new mongoose.Schema({
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fiche', required: true },
    etudiantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Etudiant', required: true },
    reference: { type: String, required: false },
    object: { type: String, required: false },
    contenu : [{ type: String, required: false }],
    status: { type: String, enum: ['NO', 'PENDING', 'OK'], default: 'NO' },
    preuve: { type: String, required: false },  
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        require: false
    }  
})

module.exports = mongoose.model('Recours', RecoursSchema);
