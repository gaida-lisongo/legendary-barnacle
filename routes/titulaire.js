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
const Produit = require('../models/Produit');
const Commande = require('../models/Commande');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');

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

    // Étape 3 : Récupérer toutes les commandes contenant ces produits
    let commandes = [];
    for (const produitId of Array.from(allProduitIds)) {
      console.log("Produit ID : ", produitId);
      const produit = await Produit.findById(produitId);
      console.log("Produit : ", produit);
      const commandes = await Commande.find({ productIds: produitId });
      const produitWithCommandes = { ...produit.toObject(), commandes };
      commandes.push(...produitWithCommandes);
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
  
      // Étape 1 : trouver les jurys où l’agent est membre du bureau
      const jurys = await Jury.find({ 'bureau.agentId': agentId })
        .populate('anneId')
        .populate('sectionId')
        .lean();  // lean() pour avoir des objets JS simples
  
      const dataJurys = [];
  
      for (const jury of jurys) {
        const juryId = jury._id;
        const anneeId = jury.anneId._id.toString();
  
        // Étape 2 : trouver les classes associées actives pour ce jury
        const juryClasses = await JuryClasse.find({ juryId, status: 'active' }).lean();
  
        const classesData = [];
  
        // Pour chaque classe
        for (const jc of juryClasses) {
          const classeId = jc.classeId;
  
          // Étape 3 : trouver le cycle qui contient cette classe,
          // pour récupérer les semestres de cette classe
          const cycle = await Cycle.findOne({ 'classes._id': classeId })
            .lean();
  
          if (!cycle) continue;
  
          // Trouver dans cycle.classes l’élément classe correspondant
          const thisClasse = cycle.classes.find(c => c._id.toString() === classeId.toString());
  
          // Si pas trouvé, continue
          if (!thisClasse) continue;
  
          const semestresIds = thisClasse.semestres.map(s => s.toString());
  
          // Étape 4 : pour ces semestres, trouver les unités
          const unites = await Unite.find({ semestreId: { $in: semestresIds } })
            .populate('cours')
            .lean();
  
          const semestresData = [];
  
          // Pour chaque semestre
          for (const semestreId of semestresIds) {
            // récupérer les unités de ce semestre
            const unitesDeSemestre = unites.filter(u => u.semestreId.toString() === semestreId.toString());
  
            const unitesData = [];
  
            for (const unite of unitesDeSemestre) {
              // Pour chaque unité, parcourir ses cours
              const coursDataArr = [];
  
              for (const cours of unite.cours) {
                // Étape 5 : trouver les charges de ce cours pour l’année du jury
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
  
                // On ajoute le cours avec ses fiches (s’il y en a, sinon vide)
                coursDataArr.push({
                  coursId: cours._id,
                  titre: cours.titre,
                  description: cours.description,
                  credit: cours.credit,
                  // tu peux ajouter autres champs du cours si besoin
                  fiches: fichesData
                });
              }
  
              unitesData.push({
                uniteId: unite._id,
                designation: unite.descripteur?.designation,
                code: unite.descripteur?.code,
                credit: unite.descripteur?.credit,
                cours: coursDataArr
              });
            }
  
            semestresData.push({
              semestreId: semestreId,
              unites: unitesData
            });
          }
  
          classesData.push({
            classeId: classeId,
            // tu peux rajouter nom, designation de classe si tu as les infos quelque part
            semestres: semestresData
          });
        }
  
        dataJurys.push({
          juryId: juryId,
          designation: jury.designation,
          code: jury.code,
          annee: jury.anneId,
          section: jury.sectionId,
          role: jury.bureau.find(b => b.agentId.toString() === agentId.toString())?.fonction || null,
          classes: classesData
        });
      }
  
      res.json({
        success: true,
        data: {
          agentId,
          jurys: dataJurys
        }
      });
  
    } catch (err) {
      console.error('Erreur dans /deliberations/:agentId', err);
      res.status(500).json({ error: err.message });
    }
});
  

module.exports = router;