const mongoose = require('mongoose');

const CycleSchema = new mongoose.Schema({
  designation: String,
  description: String,
  systeme: String,
  classes: [{
    designation: String,
    description: String,
    semestres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Semestre' }]
  }]
});

module.exports = mongoose.model('Cycle', CycleSchema);
