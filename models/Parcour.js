const mongoose = require('mongoose');
require('dotenv').config();

const ParcourSchema = new mongoose.Schema({
    etudiant: { type: mongoose.Schema.Types.ObjectId, ref: 'Etudiant' },
    classe: { type: String},
    annee: { type: mongoose.Schema.Types.ObjectId, ref: 'Annee' },
    status: { type: String, enum: ['PENDING', 'OK', 'NO'], default: 'PENDING' },
    faculteId: { type: String },
    etabId: { type: String }, 
}, {
    timestamps: true
});

const eraseId = (obj) => {
    const { _id, ...rest } = obj;
    return rest;
}

ParcourSchema.post('save', async function(doc, next){
    try {
        // console.log("save : ", doc);
        if(doc.status == 'PENDING' || doc.status == 'OK'){
            const etudiant = await mongoose.model('Etudiant').findById(doc.etudiant);
            const classe = await mongoose.model('Cycle').findClasseById(doc.classe);
            const annee = await mongoose.model('Annee').findById(doc.annee);
            const etudiantData = eraseId(etudiant.toObject());
            const classeData = eraseId(classe.toObject());
            const anneeData = eraseId(annee.toObject());

            const etudiantSemestres = etudiant.semestres || [];
            const anneeId = doc.annee;

            // Créer une copie des semestres de l'étudiant pour la modifier
            let updatedSemestres = [...etudiantSemestres];

            if (classe && classe.semestres) {
                classe.semestres.forEach(semestreId => {
                    // Vérifier si le semestre pour cette année existe déjà
                    const semestreExists = etudiantSemestres.some(
                        s => s.semestreId.toString() === semestreId.toString() && s.anneeId.toString() === anneeId.toString()
                    );

                    // S'il n'existe pas, l'ajouter
                    if (!semestreExists) {
                        updatedSemestres.push({ semestreId, anneeId });
                    }
                });
            }

            etudiant.semestres = updatedSemestres;
            etudiant.save();

            const payload = {
                ...etudiantData,
                parcours: {
                    classe: classeData,
                    annee: anneeData,
                    faculteId: doc.faculteId,
                    etabId: doc.etabId,
                }
            }
            
            const request = await fetch(process.env.SERVER_ESU + '/etudiants/parcours', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(payload)
            })

            const response = await request.json();
            console.log('User persiting: ', response);
        }
        
    } catch (error) {
        console.log(error);
    } finally {
        next();
    }
})

module.exports = mongoose.model('Parcour', ParcourSchema);