const mongoose = require('mongoose');

const AnneeSchema = new mongoose.Schema({
  debut: { type: Number, required: true },
  fin: { type: Number, required: true },
  motDg: {
    photo: String,
    description: String
  },
  articles: [{
    title: String,
    content: String,
    author: String,
    date: { type: Date, default: Date.now },
    tags: [String],
    image: String,
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    }
  }]
});

module.exports = mongoose.model('Annee', AnneeSchema);
