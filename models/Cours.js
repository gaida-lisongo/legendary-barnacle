const mongoose = require('mongoose');

const TravailSchema = new mongoose.Schema({
    anneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Annee' },
    questionnaire: {
      type: String,
      required: false
    },
    produitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
    status: { type: String, enum: ['NO', 'PENDING', 'OK'] }
})


const CoursSchema = new mongoose.Schema({
  titre: String,
  description: String,
  enseignement: [String],
  credit: Number,
  contenu: [String],
  repartition: [String],
  plan: [{
    anneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Annee' },
    contenu: [String]
  }],
  seances: [{
    anneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Annee' },
    produitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
    status: { type: String, enum: ['NO', 'PENDING', 'OK'] }
  }],
  travaux: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Travail' }],
  ressources: [String],
  penalites: [String],
  plagiat: [String]
});

const Cours = mongoose.model('Cours', CoursSchema);
const Travail = mongoose.model('Travail', TravailSchema);


Cours.createTravail = async function(coursId, anneeId, questionnaire, produitId) {
  const cours = await Cours.findById(coursId);
  if (!cours) throw new Error('Cours not found');
  const travail = await Travail.create({ anneeId, questionnaire, status: 'PENDING', produitId });
  cours.travaux.push(travail._id);
  await cours.save();
  return travail;
}

module.exports = {
  Cours,
  Travail
}

