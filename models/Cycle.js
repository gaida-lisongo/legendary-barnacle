const mongoose = require('mongoose');

const CycleSchema = new mongoose.Schema({
  designation: String,
  description: String,
  systeme: String,
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  classes: [{
    vision: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
      require: false
    },
    designation: String,
    description: String,
    semestres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Semestre' }]
  }]
});

CycleSchema.statics.findClasseById = async function(id){
    const cycle = await this.findOne({ 'classes._id': id }).populate('classes.semestres');
    const classe = cycle.classes.find(c => c._id.toString() === id.toString());
    return classe;
}

module.exports = mongoose.model('Cycle', CycleSchema);
