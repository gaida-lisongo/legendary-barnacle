const mongoose = require('mongoose');

const JuryClasseSchema = new mongoose.Schema({
  juryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jury', required: true },
  classeId: { type: mongoose.Schema.Types.ObjectId, required: true }
}, { timestamps: true });

JuryClasseSchema.index({ juryId: 1, classeId: 1 }, { unique: true });

module.exports = mongoose.model('JuryClasse', JuryClasseSchema);