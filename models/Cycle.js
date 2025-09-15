const mongoose = require('mongoose');

const CycleSchema = new mongoose.Schema({
  designation: String,
  description: String,
  systeme: String,
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  classes: [{
    designation: String,
    description: String,
    semestres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Semestre' }]
  }]
});

module.exports = mongoose.model('Cycle', CycleSchema);
