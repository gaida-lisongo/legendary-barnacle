const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cycle = require('../models/Cycle');
const Semestre = require('../models/Semestre');
const Unite = require('../models/Unite');
const Charge = require('../models/Charge');
const Cours = require('../models/Cours');
const Fiche = require('../models/Fiche');
const Jury = require('../models/Jury');
const JuryClasse = require('../models/JuryClasse');
const Etudiant = require('../models/Etudiant');
const Produit = require('../models/Produit');
const Commande = require('../models/Commande');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');
const mongoose = require('mongoose');

router.post('/auth', async (req, res) => {
  const { matricule, password } = req.body;
  if (!matricule || !password) {
    return res.status(400).json({ error: 'Matricule et mot de passe requis.' });
  }
  try {
    // Cryptage SHA1 du mot de passe
    console.log("Secure uncrypte: ", password);

    const hash = crypto.createHash('sha1').update(password).digest('hex');
    console.log("Secure crypte: ", hash)
    const agent = await Agent.findOne({ matricule, secure: hash });
    if (!agent) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }
    // Génération du token
    const token = jwt.sign({ id: agent._id, matricule: agent.matricule }, 'SECRET_KEY', { expiresIn: '1d' });
    res.json({ success: true, message: 'Authentification reussie', data : {token, agent} });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Authentification echouée', error: err.message });
  }
});

router.get('/unites/:titulaireId', async (req, res) => {
    try {
        const titulaireId = req.params.titulaireId;
        const uniteData = await Unite.find({ 'responsable.titulaireId': titulaireId })
                                .populate('cours')
                                .populate('responsable.titulaireId')
                                .populate('responsable.anneeId');

        res.json({
            success: true,
            message: 'Unites retrieved successfully',
            data: uniteData
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Unites retrieval failed', error: err.message });
    }
});


router.get('/charges/:titulaireId', async (req, res) => {
  try {
    const titulaireId = req.params.titulaireId;

    // Étape 1 : Récupérer toutes les charges
    const charges = await Charge.find({ agentId: titulaireId })
      .populate('coursId')
      .populate('anneeId');
    console.log("Charges : ", charges);
    const result = [];
    const allProduitIds = new Set();

    for (const charge of charges) {
      const { _id: chargeId, coursId: cours, anneeId } = charge;
      const anneeIdStr = anneeId._id.toString();

      // Récupérer les fiches
      const fiches = await Fiche.find({ chargeId }).populate('etudiantId');

      // Filtrer séances/travaux par année
      let seances = cours.seances?.filter(s => s.anneeId.toString() === anneeIdStr) || [];
      let travaux = cours.travaux?.filter(t => t.anneeId.toString() === anneeIdStr) || [];

      // Ajouter tous les produitIds à une liste
      seances.forEach(s => allProduitIds.add(s.produitId.toString()));
      travaux.forEach(t => allProduitIds.add(t.produitId.toString()));

      // Peupler produits dans seances/travaux
      seances = await Promise.all(seances.map(async (s) => {
        const produit = await Produit.findById(s.produitId);
        return { ...s.toObject(), produit };
      }));

      travaux = await Promise.all(travaux.map(async (t) => {
        const produit = await Produit.findById(t.produitId);
        return { ...t.toObject(), produit };
      }));

      const coursFiltré = {
        _id: cours._id,
        titre: cours.titre,
        description: cours.description,
        credit: cours.credit,
        ressources: cours.ressources,
        penalites: cours.penalites,
        plagiat: cours.plagiat,
        plan: cours.plan?.filter(p => p.anneeId.toString() === anneeIdStr),
        seances,
        travaux,
      };

      result.push({
        chargeId,
        annee: anneeId,
        cours: coursFiltré,
        fiches,
      });
    }

    let commandes = [];
    for (const produitId of Array.from(allProduitIds)) {
      console.log("Produit ID : ", produitId);
      const produit = await Produit.findById(produitId);
      console.log("Produit : ", produit);
      const commandesProduit = await Commande.find({ productIds: produitId });
      const produitWithCommandes = { ...produit.toObject(), commandes: commandesProduit };
      commandes.push(produitWithCommandes);
    }
    console.log("Commandes : ", commandes);

    res.json({
      success: true,
      message: 'Charges and commandes retrieved successfully',
      data: {
        charges: result,
        commandes
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Charges and commandes retrieval failed', error: err.message });
  }
});

router.get('/juries/:agentId', async (req, res) => {
    try {
      const agentId = req.params.agentId;
  
      // Étape 1 : trouver les jurys où l'agent est membre du bureau
      const jurys = await Jury.find({ 'bureau.agentId': agentId })
        .populate('anneId')
        .populate('sectionId')
        .lean();
  
      const dataJurys = [];
  
      for (const jury of jurys) {
        const juryId = jury._id;
        const anneeId = jury.anneId._id.toString();
  
        // Étape 2 : trouver les cycles de cette section
        const cycles = await Cycle.find({ sectionId: jury.sectionId._id }).lean();
        
        const classesData = [];
  
        // Pour chaque cycle
        for (const cycle of cycles) {
          // Pour chaque classe dans le cycle
          for (const classe of cycle.classes) {
            const classeId = classe._id;
            const semestresIds = classe.semestres;
  
            // Étape 3 : récupérer les détails des semestres
            const semestres = await Semestre.find({ _id: { $in: semestresIds } })
              .populate('unites')
              .lean();
  
            const semestresData = [];
  
            // Pour chaque semestre
            for (const semestre of semestres) {
              const unitesData = [];
  
              // Pour chaque unité du semestre
              for (const unite of semestre.unites) {
                // Récupérer les détails de l'unité avec ses cours
                const uniteComplete = await Unite.findById(unite._id)
                  .populate('cours')
                  .lean();
                console.log("Unite : ", uniteComplete);
                if (!uniteComplete) continue;
  
                const coursDataArr = [];
  
                // Pour chaque cours de l'unité
                for (const cours of uniteComplete.cours) {
                  // Étape 4 : trouver les charges de ce cours pour l'année du jury
                  const charges = await Charge.find({
                    coursId: cours._id,
                    anneeId: jury.anneId._id
                  }).lean();
  
                  const fichesData = [];
  
                  // Pour chaque charge, récupérer les fiches
                  for (const charge of charges) {
                    const fiches = await Fiche.find({ chargeId: charge._id })
                      .populate('etudiantId')
                      .lean();
  
                    for (const fiche of fiches) {
                      fichesData.push({
                        ficheId: fiche._id,
                        etudiant: fiche.etudiantId,
                        status: fiche.status,
                        cmi: fiche.cmi,
                        examen: fiche.examen,
                        rattrapage: fiche.rattrapage,
                        reference: fiche.reference
                      });
                    }
                  }
  
                  // Ajouter le cours avec ses fiches
                  coursDataArr.push({
                    coursId: cours._id,
                    titre: cours.titre,
                    description: cours.description,
                    credit: cours.credit,
                    fiches: fichesData
                  });
                }
  
                // Ajouter l'unité avec ses cours
                unitesData.push({
                  uniteId: uniteComplete._id,
                  designation: uniteComplete.descripteur?.designation,
                  code: uniteComplete.descripteur?.code,
                  credit: uniteComplete.descripteur?.credit,
                  cours: coursDataArr
                });
              }
  
              // Ajouter le semestre avec ses unités
              semestresData.push({
                semestreId: semestre._id,
                designation: semestre.designation,
                description: semestre.description,
                unites: unitesData
              });
            }
  
            // Ajouter la classe avec ses semestres
            classesData.push({
              classeId: classeId,
              vision: classe.vision,
              designation: classe.designation,
              description: classe.description,
              semestres: semestresData
            });
          }
        }

        const bureau = jury.bureau.map(async (b) => {
          const agent = await Agent.findById(b.agentId)
          return {
            fonction: b.fonction,
            agent: agent
          }
        })
        const bureauData = await Promise.all(bureau)
  
        dataJurys.push({
          juryId: juryId,
          designation: jury.designation,
          code: jury.code,
          annee: jury.anneId,
          section: jury.sectionId,
          role: jury.bureau.find(b => b.agentId.toString() === agentId.toString())?.fonction || null,
          classes: classesData,
          bureau: bureauData
        });
      }
  
      res.json({
        success: true,
        message: 'Jurys retrieved successfully',
        data: {
          agentId,
          jurys: dataJurys
        }
      });
  
    } catch (err) {
      console.error('Erreur dans /juries/:agentId', err);
      res.status(500).json({ error: err.message });
    }
});

router.get('/grille/:classeId/:anneeId', async (req, res) => {
  try {
    const classeId = req.params.classeId;
    const anneeId = req.params.anneeId;
    // Cast de l'anneeId et préparation des variantes pour correspondre même si les données existantes sont en string
    let anneeObjectId = null;
    let anneeIdStr = null;
    try {
      anneeObjectId = new mongoose.Types.ObjectId(anneeId);
      anneeIdStr = anneeObjectId.toString();
    } catch (e) {
      // Si anneeId n'est pas un ObjectId valide, on garde la string
      anneeIdStr = String(anneeId);
    }
    
    const cycle = await Cycle.findOne({ 'classes._id': classeId }).populate('classes').lean();
    
    if (!cycle) {
      return res.status(404).json({ error: 'Cycle non trouvé' });
    }

    const findClasse = cycle.classes.find(c => c._id.toString() === classeId);
    if (!findClasse) {
      return res.status(404).json({ error: 'Classe non trouvée' });
    }

    const semestresData = await Semestre.find({ _id: { $in: findClasse.semestres } }).populate('unites').lean();
    const semestresDataArr = [];
    
    // Utiliser for...of au lieu de forEach pour gérer les promesses
    for (const semestre of semestresData) {
      let etudiants = [];
      let unitesData = [];

      // Traiter les inscriptions avec for...of
      for (const inscription of semestre.insription || []) {
        // Hydratation Etudiants
        const commandes = await Commande.find({ productIds: inscription.produitId }).lean();
        if (commandes.length > 0) {
          let matricules = [];

          commandes.forEach(commande => {
            // Check if matricule is not already in matricules
            if (!matricules.includes(commande.matricule)) {
              matricules.push(commande.matricule);
            }
          });
          
          const etudiantsData = await Etudiant.find({ matricule: { $in: matricules } }).lean();
          etudiantsData.forEach(etudiant => {
            // Éviter les doublons d'étudiants
            if (!etudiants.find(e => e._id.toString() === etudiant._id.toString())) {
              etudiants.push(etudiant);
            }
          });
        }
      }

      // Hydratation Unites - utiliser for...of au lieu de forEach
      for (const unite of semestre.unites || []) {
        console.log("Unite : ", unite);
        let coursData = [];
        // Récupérer les détails complets de l'unité avec ses cours
        const uniteComplete = await Unite.findById(unite._id).populate('cours').lean();
        if (!uniteComplete) continue;

        // Traiter les cours avec for...of
        for (const cours of uniteComplete.cours || []) {
          const coursIdRaw = cours && cours._id ? cours._id : cours;
          const coursIdStr = coursIdRaw ? coursIdRaw.toString() : null;
          let coursIdObj = null;
          try {
            coursIdObj = coursIdStr ? new mongoose.Types.ObjectId(coursIdStr) : null;
          } catch (e) {
            coursIdObj = null;
          }
          
          // Requête tolérante: tente avec ObjectId et string pour couvrir des données incohérentes
          const chargesData = await Charge.find({
            anneeId: { $in: [anneeObjectId, anneeIdStr].filter(Boolean) },
            coursId: { $in: [coursIdObj, coursIdStr].filter(Boolean) }
          }).lean();
          
          if (chargesData) {
            for (const chargeData of chargesData) {
              console.log("Charge Data : ", chargeData);
              const fichesData = await Fiche.find({ chargeId: chargeData._id.toString() }).populate('etudiantId').lean();

              console.log("Fiches Data : ", fichesData);
              coursData.push({
                coursId: cours._id,
                titre: cours.titre,
                description: cours.description,
                credit: cours.credit,
                fiches: fichesData
              });
            }
          }
        }

        unitesData.push({
          uniteId: uniteComplete._id,
          designation: uniteComplete.descripteur?.designation || uniteComplete.designation,
          code: uniteComplete.descripteur?.code || uniteComplete.code,
          credit: uniteComplete.descripteur?.credit || uniteComplete.credit,
          cours: coursData
        });
      }

      semestresDataArr.push({
        semestreId: semestre._id,
        designation: semestre.designation,
        description: semestre.description,
        etudiants: etudiants,
        unites: unitesData
      });
    }

    const classeData = {
      classeId: findClasse._id,
      designation: findClasse.designation,
      description: findClasse.description,
      semestres: semestresDataArr
    };
    
    res.json({ success: true, message: 'Classe trouvée', data: classeData });
    
  } catch (err) {
    console.error('Erreur dans /grille/:classeId/:anneeId', err);
    res.status(500).json({ error: err.message });
  }
});
  

module.exports = router;