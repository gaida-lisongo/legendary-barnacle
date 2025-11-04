const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Rapport = require('../models/Rapport');
const Cycle = require('../models/Cycle');
const Semestre = require('../models/Semestre');
const Unite = require('../models/Unite');
const Cours = require('../models/Cours');
const Fiche = require('../models/Fiche');
const Charge = require('../models/Charge');
const Commande = require('../models/Commande');
const Produit = require('../models/Produit');
const Etudiant = require('../models/Etudiant');
const Parcour = require('../models/Parcour');
const Annee = require('../models/Annee');
const Recours = require('../models/Recours');
require('dotenv').config();

const auth = require('../middleware/auth');
const etudiantController = require('../controllers/etudiantController');

router.get('/', etudiantController.getEtudiants);
router.get('/:id', etudiantController.getEtudiant);
router.post('/', etudiantController.createEtudiant);
router.post('/login', etudiantController.loginEtudiant);
router.get('/resultats/:matricule', etudiantController.getResultats);
router.get('/checking-1/:matricule', async (req, res) => {
  try {
    const matricule = req.params.matricule;
    const etudiant = await Etudiant.findOne({ matricule });
    // Récupérer les commandes de l'étudiant
    const commandes = await Commande.find({ matricule });
    const allProduitsIds = new Set(commandes.map(c => c.productIds));
    
    let semestresData = [];

    for (const produitId of allProduitsIds) {
      const semestres = await Semestre.find({ 'insription.produitId': produitId }).populate('unites');
      console.log("Semestres : ", semestres);

      if (semestres.length > 0) {
        semestresData.push(...semestres);
      }
    }
    res.json({ success: true, message: 'Semestres retrieved successfully', data: semestresData });
  } catch (error) {
    res.json({ success: false, message: 'Semestres retrieval failed', error: error.message });
  }
});

// Route pour récupérer l'arbre complet des semestres avec notes d'un étudiant
router.get('/checking-2/:matricule', async (req, res) => {
  try {
    const matricule = req.params.matricule;
    
    // Récupérer l'étudiant
    const etudiant = await Etudiant.findOne({ matricule });
    if (!etudiant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Étudiant non trouvé' 
      });
    }

    console.log("=== DÉBUT RÉCUPÉRATION POUR ÉTUDIANT ===", etudiant.matricule);

    // Récupérer les commandes de l'étudiant pour obtenir les produits auxquels il est inscrit
    const commandes = await Commande.find({ matricule });
    const allProduitsIds = [...new Set(commandes.flatMap(c => c.productIds))];
    
    console.log("Produits de l'étudiant:", allProduitsIds);

    // Récupérer toutes les années académiques disponibles
    const annees = await Annee.find({}).sort({ debut: -1 });
    console.log("Années disponibles:", annees.map(a => `${a.debut}-${a.fin} (ID: ${a._id})`));
    
    let arbreSemestres = [];

    for (const produitId of allProduitsIds) {
      console.log(`\n--- TRAITEMENT PRODUIT: ${produitId} ---`);
      
      // Récupérer les semestres pour ce produit
      const semestres = await Semestre.find({ 'insription.produitId': produitId })
        .populate({
          path: 'unites',
          populate: {
            path: 'cours'
          }
        });

      console.log(`Semestres trouvés pour le produit ${produitId}:`, semestres.length);

      for (const semestre of semestres) {
        console.log(`\n  >> SEMESTRE: ${semestre.designation} (${semestre._id})`);
        
        // Récupérer les inscriptions de ce semestre pour obtenir les années
        const inscriptionsSemestre = semestre.insription || [];
        const anneesInscription = inscriptionsSemestre
          .filter(insc => insc.produitId.toString() === produitId.toString())
          .map(insc => insc.anneeId);
        
        console.log(`     Années d'inscription pour ce semestre:`, anneesInscription);

        let semestreData = {
          _id: semestre._id,
          designation: semestre.designation,
          description: semestre.description,
          anneesInscription: anneesInscription,
          unites: []
        };

        // Pour chaque unité d'enseignement du semestre
        for (const unite of semestre.unites) {
          console.log(`\n    >> UNITÉ: ${unite.descripteur?.designation} (${unite._id})`);
          
          let uniteData = {
            _id: unite._id,
            designation: unite.descripteur?.designation,
            code: unite.descripteur?.code,
            credit: unite.descripteur?.credit,
            type: unite.descripteur?.type,
            cours: []
          };

          // Pour chaque cours de l'unité
          for (const cours of unite.cours) {
            console.log(`\n      >> COURS: ${cours.titre} (${cours._id})`);
            
            // Récupérer les charges pour ce cours dans les années d'inscription
            const charges = await Charge.find({ 
              coursId: cours._id,
              anneeId: { $in: anneesInscription }
            });
            
            console.log(`         Charges trouvées:`, charges.length);
            charges.forEach(charge => {
              console.log(`           - Charge ${charge._id} (Agent: ${charge.agentId}, Année: ${charge.anneeId}, Status: ${charge.status})`);
            });
            
            let coursData = {
              _id: cours._id,
              titre: cours.titre,
              description: cours.description,
              credit: cours.credit,
              notes: []
            };

            // Pour chaque charge, récupérer les fiches de cotation de l'étudiant
            for (const charge of charges) {
              console.log(`\n         >> RECHERCHE FICHES pour charge ${charge._id}`);
              
              const fiches = await Fiche.find({ 
                chargeId: charge._id, 
                etudiantId: etudiant._id
                // Enlever le filtre status temporairement pour voir toutes les fiches
              }).populate('chargeId');

              console.log(`            Fiches trouvées:`, fiches.length);
              fiches.forEach(fiche => {
                console.log(`              - Fiche ${fiche._id}: CMI=${fiche.cmi}, Examen=${fiche.examen}, Rattrapage=${fiche.rattrapage}, Status=${fiche.status}`);
              });

              for (const fiche of fiches) {
                const anneeInfo = await Annee.findById(charge.anneeId).lean();
                coursData.notes.push({
                  _id: fiche._id,
                  reference: fiche.reference,
                  cmi: fiche.cmi,
                  examen: fiche.examen,
                  rattrapage: fiche.rattrapage,
                  moyenne: calculateMoyenne(fiche.cmi, fiche.examen, fiche.rattrapage, cours.credit),
                  status: fiche.status,
                  anneeId: `${anneeInfo.debut} - ${anneeInfo.fin}`
                });
              }
            }

            console.log(`         Notes finales pour le cours:`, coursData.notes.length);
            uniteData.cours.push(coursData);
          }

          semestreData.unites.push(uniteData);
        }

        arbreSemestres.push(semestreData);
      }
    }

    // Calculer les statistiques globales
    const statistiques = calculateStatistiques(arbreSemestres);

    console.log("=== RÉSULTAT FINAL ===");
    console.log(`Semestres: ${arbreSemestres.length}`);
    console.log(`Statistiques:`, statistiques);

    res.json({ 
      success: true, 
      message: 'Arbre des semestres avec notes récupéré avec succès', 
      data: {
        etudiant: {
          _id: etudiant._id,
          nom: etudiant.nom,
          post_nom: etudiant.post_nom,
          prenom: etudiant.prenom,
          matricule: etudiant.matricule
        },
        semestres: arbreSemestres,
        statistiques: statistiques
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des semestres avec notes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des semestres avec notes', 
      error: error.message 
    });
  }
});

router.get('/checkProduct/:matricule/:produitId', etudiantController.isCommanded);

// Fonction utilitaire pour calculer la moyenne
function calculateMoyenne(cmi, examen, rattrapage, credit) {
  // Si il y a un rattrapage, on prend la meilleure note entre examen et rattrapage
  const totalSession = (cmi || 0) + (examen || 0);
  const totalRattrapage = (rattrapage || 0);

  const total = totalRattrapage > totalSession ? totalRattrapage : totalSession;

  return total
}

// Fonction utilitaire pour calculer les statistiques globales
function calculateStatistiques(semestres) {
  let totalCredits = 0;
  let totalNotes = 0;
  let nombreCours = 0;
  let coursReussis = 0;

  semestres.forEach(semestre => {
    semestre.unites.forEach(unite => {
      unite.cours.forEach(cours => {
        if (cours.notes.length > 0) {
          nombreCours++;
          totalCredits += cours.credit || 0;
          
          cours.notes.forEach(note => {
            totalNotes += note.moyenne * cours.credit / unite.credit;
            if(note.moyenne >= 10) {
              coursReussis++;
            }
          })
          
        }
      });
    });
  });

  return {
    nombreSemestres: semestres.length,
    nombreCours: nombreCours,
    coursReussis: coursReussis,
    tauxReussite: nombreCours > 0 ? Math.round((coursReussis / nombreCours) * 100) : 0,
    moyenneGenerale: totalNotes,
    totalCredits: totalCredits
  };
}

// Route optimisée avec agrégation MongoDB pour de meilleures performances
router.get('/checking-3/:matricule', async (req, res) => {
  try {
    const matricule = req.params.matricule;
    
    // Récupérer l'étudiant
    const etudiant = await Etudiant.findOne({ matricule });
    if (!etudiant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Étudiant non trouvé' 
      });
    }

    // Récupérer les commandes de l'étudiant
    const commandes = await Commande.find({ matricule });
    const allProduitsIds = [...new Set(commandes.flatMap(c => c.productIds))];
    
    if (allProduitsIds.length === 0) {
      return res.json({ 
        success: true, 
        message: 'Aucune inscription trouvée pour cet étudiant', 
        data: {
          etudiant: {
            _id: etudiant._id,
            nom: etudiant.nom,
            post_nom: etudiant.post_nom,
            prenom: etudiant.prenom,
            matricule: etudiant.matricule
          },
          semestres: [],
          statistiques: {
            nombreSemestres: 0,
            nombreCours: 0,
            coursReussis: 0,
            tauxReussite: 0,
            moyenneGenerale: 0,
            totalCredits: 0
          }
        }
      });
    }

    // Utiliser l'agrégation MongoDB pour optimiser les requêtes
    const pipeline = [
      // Filtrer les semestres par produits de l'étudiant
      {
        $match: {
          'insription.produitId': { $in: allProduitsIds.map(id => new mongoose.Types.ObjectId(id)) }
        }
      },
      // Joindre avec les unités
      {
        $lookup: {
          from: 'unites',
          localField: 'unites',
          foreignField: '_id',
          as: 'unitesData'
        }
      },
      // Dérouler les unités
      {
        $unwind: {
          path: '$unitesData',
          preserveNullAndEmptyArrays: true
        }
      },
      // Joindre avec les cours
      {
        $lookup: {
          from: 'cours',
          localField: 'unitesData.cours',
          foreignField: '_id',
          as: 'unitesData.coursData'
        }
      },
      // Dérouler les cours
      {
        $unwind: {
          path: '$unitesData.coursData',
          preserveNullAndEmptyArrays: true
        }
      },
      // Joindre avec les charges
      {
        $lookup: {
          from: 'charges',
          localField: 'unitesData.coursData._id',
          foreignField: 'coursId',
          as: 'charges'
        }
      },
      // Dérouler les charges
      {
        $unwind: {
          path: '$charges',
          preserveNullAndEmptyArrays: true
        }
      },
      // Joindre avec les fiches de cotation
      {
        $lookup: {
          from: 'fiches',
          let: { chargeId: '$charges._id', etudiantId: etudiant._id },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$chargeId', '$$chargeId'] },
                    { $eq: ['$etudiantId', '$$etudiantId'] },
                    // { $eq: ['$status', 'APPROVED'] }
                  ]
                }
              }
            }
          ],
          as: 'fiches'
        }
      },
      // Regrouper les données
      {
        $group: {
          _id: {
            semestreId: '$_id',
            uniteId: '$unitesData._id',
            coursId: '$unitesData.coursData._id'
          },
          semestre: { $first: '$$ROOT' },
          unite: { $first: '$unitesData' },
          cours: { $first: '$unitesData.coursData' },
          fiches: { $first: '$fiches' }
        }
      },
      // Restructurer les données
      {
        $group: {
          _id: {
            semestreId: '$_id.semestreId',
            uniteId: '$_id.uniteId'
          },
          semestre: { $first: '$semestre' },
          unite: { $first: '$unite' },
          cours: {
            $push: {
              _id: '$cours._id',
              titre: '$cours.titre',
              description: '$cours.description',
              credit: '$cours.credit',
              notes: {
                $map: {
                  input: '$fiches',
                  as: 'fiche',
                  in: {
                    _id: '$$fiche._id',
                    reference: '$$fiche.reference',
                    cmi: '$$fiche.cmi',
                    examen: '$$fiche.examen',
                    rattrapage: '$$fiche.rattrapage',
                    status: '$$fiche.status'
                  }
                }
              }
            }
          }
        }
      },
      // Regrouper par semestre
      {
        $group: {
          _id: '$_id.semestreId',
          semestre: { $first: '$semestre' },
          unites: {
            $push: {
              _id: '$unite._id',
              designation: '$unite.descripteur.designation',
              code: '$unite.descripteur.code',
              credit: '$unite.descripteur.credit',
              type: '$unite.descripteur.type',
              cours: '$cours'
            }
          }
        }
      },
      // Projection finale
      {
        $project: {
          _id: '$semestre._id',
          designation: '$semestre.designation',
          description: '$semestre.description',
          unites: '$unites'
        }
      }
    ];

    const arbreSemestres = await Semestre.aggregate(pipeline);

    // Calculer les moyennes et statistiques
    arbreSemestres.forEach(semestre => {
      semestre.unites.forEach(unite => {
        unite.cours.forEach(cours => {
          cours.notes.forEach(note => {
            note.moyenne = calculateMoyenne(note.cmi, note.examen, note.rattrapage);
          });
        });
      });
    });

    const statistiques = calculateStatistiques(arbreSemestres);

    res.json({ 
      success: true, 
      message: 'Arbre des semestres avec notes récupéré avec succès (version optimisée)', 
      data: {
        etudiant: {
          _id: etudiant._id,
          nom: etudiant.nom,
          post_nom: etudiant.post_nom,
          prenom: etudiant.prenom,
          matricule: etudiant.matricule
        },
        semestres: arbreSemestres,
        statistiques: statistiques
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération optimisée des semestres avec notes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des semestres avec notes', 
      error: error.message 
    });
  }
});

router.put('/recours/:id', async (req, res) => {
  try {
    const recours = await Recours.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recours) {
      return res.status(404).json({
        success: false,
        message: "Recours not found"
      });
    }
    const recoursUpdated = await recours.save();
    res.status(200).json({
        success: true,
        message: "Recours updated successfully",
        data: recoursUpdated
    });
  } catch (err) {
    res.status(400).json({
        success: false,
        message: "Recours update failed",
        error: err.message
    });
  }
});

router.post('/parcours', async (req, res) => {
  try {
    const {
      matricule,
      classeId,
      anneeId,
      faculte
    } = req.body;

    const faculteId = faculte == 'HE' ? process.env.HE_ID : (faculte == 'BTP' ? process.env.BTP_ID : process.env.GR_ID);
    console.log("Faculte ID :", faculteId);

    const etabId = process.env.ETAB_TOKEN;
    console.log('Etab ID: ', etabId);

    if(!faculteId){
      return res.status(404).json({
        success: false,
        message: "FaculteId not found"
      });
    }
    
    const etudiant = await Etudiant.findOne({ matricule });
    if (!etudiant) {
      return res.status(404).json({
        success: false,
        message: "Etudiant not found"
      });
    }

    const parcours = new Parcour({
      etudiant: etudiant._id,
      classe: classeId,
      annee: anneeId,
      faculteId: faculteId,
      etabId : etabId
    });
    await parcours.save();
    
    res.status(201).json({
        success: true,
        message: "Parcours created successfully",
        data: {
          etudiant: etudiant,
          parcours: parcours
        }
    });

  } catch (error) {
    console.error("Error when subscribe student to classe : ", error)
    res.status(500).json({
        success: false,
        message: "Parcours retrieval failed",
        error: error.message
    });
  }
})

router.post('/subscribe', async (req, res) => {
  try {
    const {
      matricule,
      classeId,
      anneeId,
      faculteId,
      etabId
    } = req.body;
    const etudiant = await Etudiant.findOne({ matricule });
    if (!etudiant) {
      return res.status(404).json({
        success: false,
        message: "Etudiant not found"
      });
    }
    const parcours = new Parcour({
      etudiant: etudiant._id,
      classe: classeId,
      annee: anneeId,
      faculteId,
      etabId
    });
    await parcours.save();
    
    res.status(201).json({
        success: true,
        message: "Parcours created successfully",
        data: {
          etudiant: etudiant,
          parcours: parcours
        }
    });
  } catch (err) {
    res.status(500).json({
        success: false,
        message: "Parcours retrieval failed",
        error: err.message
    });
  }
});

router.get('/parcours/classe/:id/annee/:anneeId', async (req, res) => {  
  try {
    // console.log("Current classeId: ", req.params.id);

    const parcours = await Parcour.find({ annee: req.params.anneeId})
      .populate('etudiant classe annee')
      .lean();
    // console.log("Data Parcours : ", parcours);
    const filterParcours = [];
    parcours.map(p => {
      // console.log("Current parcours : ", p);
      
      if (p.classe.toString() == req.params.id.toString()){
        filterParcours.push(p);
      }
    });

    if(!filterParcours){
      res.status(404).json({
          success: false,
          message: "Parcours retrieval failed",
          data: []
      });
    }

    res.status(200).json({
        success: true,
        message: "Parcours retrieved successfully",
        data: filterParcours
    });
  } catch (err) {
    console.error("Error from getting all parcours of classe : ", err)
    res.status(500).json({
        success: false,
        message: "Parcours retrieval failed",
        error: err.message
    });
  }
})

router.get('/parcours', async (req, res) => {
  try {
    const parcours = await Parcour.find().populate('etudiant classe annee');
    res.status(200).json({
        success: true,
        message: "Parcours retrieved successfully",
        data: parcours
    });
  } catch (err) {
    res.status(500).json({
        success: false,
        message: "Parcours retrieval failed",
        error: err.message
    });
  }
});

router.get('/parcours/:etudiantId', async (req, res) => {
  try {
    const parcours = await Parcour.find({ etudiantId: req.params.etudiantId }).populate('etudiant classe annee');
    res.status(200).json({
        success: true,
        message: "Parcours retrieved successfully",
        data: parcours
    });
  } catch (err) {
    res.status(500).json({
        success: false,
        message: "Parcours retrieval failed",
        error: err.message
    });
  }
});

router.put('/parcours/:id', async (req, res) => {
  try {
    const parcours = await Parcour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!parcours) {
      return res.status(404).json({
        success: false,
        message: "Parcours not found"
      });
    }
    const parcoursUpdated = await parcours.save();
    res.status(200).json({
        success: true,
        message: "Parcours updated successfully",
        data: parcoursUpdated
    });
  } catch (err) {
    res.status(500).json({
        success: false,
        message: "Parcours update failed",
        error: err.message
    });
  }
});

router.delete('/parcours/:id', async (req, res) => {
  try {
    const parcours = await Parcour.findByIdAndDelete(req.params.id);
    if (!parcours) {
      return res.status(404).json({
        success: false,
        message: "Parcours not found"
      });
    }
    res.status(200).json({
        success: true,
        message: "Parcours deleted successfully",
        data: parcours
    });
  } catch (err) {
    res.status(500).json({
        success: false,
        message: "Parcours deletion failed",
        error: err.message
    });
  }
});

// Etudiant routes
router.use(auth);
router.post('/rapport', async (req, res) => {
  try {
    const rapport = new Rapport(req.body);
    await rapport.save();
    res.status(201).json({
        success: true,
        message: "Rapport created successfully",
        data: rapport
    });
  } catch (err) {
    res.status(400).json({
        success: false,
        message: "Rapport creation failed",
        error: err.message
    });
  }
});

router.get('/rapport/:etudiantId', async (req, res) => {
  try {
    const rapports = await Rapport.find({ etudiantId: req.params.etudiantId }).populate('produitId');
    res.status(200).json({
        success: true,
        message: "Rapports retrieved successfully",
        data: rapports
    });
  } catch (err) {
    res.status(500).json({
        success: false,
        message: "Rapports retrieval failed",
        error: err.message
    });
  }
});
router.put('/:id', etudiantController.updateEtudiant);
router.delete('/:id', etudiantController.deleteEtudiant);

module.exports = router;
