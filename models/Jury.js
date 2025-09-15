const mongoose = require('mongoose');

const BureauSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  fonction: { type: String, enum: ['Président', 'Secrétaire', 'Membre'], required: true }
}, { _id: false });

const JurySchema = new mongoose.Schema({
  anneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Annee', required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  designation: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  bureau: [BureauSchema]
}, { timestamps: true });

module.exports = mongoose.model('Jury', JurySchema);