const mongoose = require('mongoose');

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
        console.log("save : ", doc);
        if(doc.status === 'OK'){
            const etudiant = await mongoose.model('Etudiant').findById(doc.etudiant);
            const classe = await mongoose.model('Cycle').findClasseById(doc.classe);
            const annee = await mongoose.model('Annee').findById(doc.annee);
            const etudiantData = eraseId(etudiant.toObject());
            const classeData = eraseId(classe.toObject());
            const anneeData = eraseId(annee.toObject());

            const payload = {
                ...etudiantData,
                parcours: {
                    classe: classeData,
                    annee: anneeData,
                    faculteId: doc.faculteId,
                    etabId: doc.etabId,
                }
            }
            console.log("payload : ", payload);
            const request = await fetch('http://192.168.1.66:4000/api/v1/etudiants/parcours', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(payload)
            })

            console.log("request : ", request);

            const response = await request.json();
            console.log("submit in minister esursi : ", response);
        }
        
    } catch (error) {
        console.log(error);
    } finally {
        next();
    }
})

module.exports = mongoose.model('Parcour', ParcourSchema);