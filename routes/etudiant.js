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
const Mailer = require('../service/Mailer');
const crypto = require('crypto');
require('dotenv').config();

const usersMail = [
  {
    section: 'HE',
    auth: {
      user: process.env.HE_USER,
      pass: process.env.HE_PASS
    }
  },
  {
    section: 'BTP',
    auth: {
      user: process.env.BTP_USER,
      pass: process.env.BTP_PASS
    }
  },
  {
    section: 'GR',
    auth: {
      user: process.env.GR_USER,
      pass: process.env.GR_PASS
    }
  },
  
];

const htmlResetPassword = ({
  nom,
  post_nom,
  prenom,
  matricule,
  email,
  _id,
  url,
  section
}) => {
  const urlToRedirect = `https://${section.toString()}.inbtp.net/reset/${_id}`
  const message = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation de mot de passe</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
            <tr>
                <td>
                    <!-- Main Container -->
                    <div style="background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
                        
                        <!-- Header with Gradient -->
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 30px; text-align: center; position: relative;">
                            <!-- Decorative circles -->
                            <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                            <div style="position: absolute; bottom: -30px; left: -30px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                            
                            <!-- SVG Illustration -->
                            <div style="margin: 0 auto 30px; position: relative; z-index: 1;">
                                <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <!-- Background circle -->
                                    <circle cx="100" cy="100" r="95" fill="white" opacity="0.95"/>
                                    
                                    <!-- User icon with lock -->
                                    <circle cx="100" cy="75" r="25" fill="#667eea"/>
                                    <path d="M100 105 C75 105, 60 115, 60 130 L60 145 C60 150, 65 155, 70 155 L130 155 C135 155, 140 150, 140 145 L140 130 C140 115, 125 105, 100 105 Z" fill="#667eea"/>
                                    
                                    <!-- Lock icon -->
                                    <rect x="120" y="125" width="40" height="45" rx="5" fill="#FFC107"/>
                                    <rect x="125" y="130" width="30" height="35" rx="3" fill="#FFD54F"/>
                                    <path d="M135 125 L135 115 C135 107, 140 102, 145 102 C150 102, 155 107, 155 115 L155 125" stroke="#FFC107" stroke-width="4" fill="none"/>
                                    <circle cx="140" cy="145" r="4" fill="#FFC107"/>
                                    <rect x="138" y="145" width="4" height="8" fill="#FFC107"/>
                                    
                                    <!-- Sparkles -->
                                    <circle cx="50" cy="50" r="3" fill="#FFD54F"/>
                                    <circle cx="150" cy="60" r="2" fill="#FFD54F"/>
                                    <circle cx="160" cy="90" r="2.5" fill="#FFD54F"/>
                                    <circle cx="45" cy="100" r="2" fill="#FFD54F"/>
                                </svg>
                            </div>
                            
                            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 10px rgba(0,0,0,0.1);">Récupération de compte</h1>
                            <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0; font-size: 18px; font-weight: 500;">Section ${section}</p>
                        </div>
                        
                        <!-- Content Section -->
                        <div style="padding: 50px 40px;">
                            <!-- Greeting -->
                            <div style="text-align: center; margin-bottom: 40px;">
                                <h2 style="color: #1a202c; margin: 0 0 15px; font-size: 26px; font-weight: 700;">Bonjour ${prenom} ${nom} 👋</h2>
                                <p style="color: #4a5568; margin: 0; font-size: 17px; line-height: 1.6;">Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte étudiant.</p>
                            </div>
                            
                            <!-- Student Info Card -->
                            <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 16px; padding: 30px; margin: 35px 0; border: 2px solid #e2e8f0; position: relative; overflow: hidden;">
                                <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: rgba(102, 126, 234, 0.05); border-radius: 50%;"></div>
                                
                                <div style="display: flex; align-items: center; margin-bottom: 20px; position: relative; z-index: 1;">
                                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <h3 style="color: #2d3748; margin: 0; font-size: 20px; font-weight: 700;">Informations du compte</h3>
                                </div>
                                
                                <div style="position: relative; z-index: 1;">
                                    <div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 10px; border-left: 4px solid #667eea;">
                                        <p style="margin: 0; color: #718096; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Matricule</p>
                                        <p style="margin: 8px 0 0; color: #2d3748; font-size: 18px; font-weight: 700;">${matricule}</p>
                                    </div>
                                    <div style="padding: 15px; background: white; border-radius: 10px; border-left: 4px solid #764ba2;">
                                        <p style="margin: 0; color: #718096; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                                        <p style="margin: 8px 0 0; color: #2d3748; font-size: 16px; font-weight: 600;">${email}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- CTA Button -->
                            <div style="text-align: center; margin: 45px 0;">
                                <a href="${urlToRedirect.toLowerCase()}" 
                                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 18px 45px; border-radius: 12px; font-weight: 700; font-size: 17px; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4); transition: all 0.3s ease; letter-spacing: 0.3px;">
                                    🔐 Réinitialiser mon mot de passe
                                </a>
                                <p style="color: #a0aec0; margin: 20px 0 0; font-size: 14px;">Ce lien est valide pendant 24 heures</p>
                            </div>
                            
                            <!-- Security Notice -->
                            <div style="background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%); border-radius: 12px; padding: 25px; margin: 35px 0; border-left: 5px solid #fc8181; position: relative; overflow: hidden;">
                                <div style="position: absolute; top: -10px; right: -10px; width: 80px; height: 80px; background: rgba(252, 129, 129, 0.1); border-radius: 50%;"></div>
                                
                                <div style="display: flex; align-items: flex-start; position: relative; z-index: 1;">
                                    <div style="flex-shrink: 0; width: 40px; height: 40px; background: #fc8181; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                                        <span style="font-size: 24px;">⚠️</span>
                                    </div>
                                    <div>
                                        <h4 style="color: #c53030; margin: 0 0 10px; font-size: 18px; font-weight: 700;">Note de sécurité</h4>
                                        <p style="color: #742a2a; margin: 0; font-size: 15px; line-height: 1.6;">
                                            Si vous n'avez pas demandé cette réinitialisation, <strong>ignorez cet email</strong>. Votre compte reste sécurisé et aucune action n'est requise de votre part.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Divider -->
                            <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%); margin: 40px 0;"></div>
                            
                            <!-- Footer Message -->
                            <div style="text-align: center;">
                                <p style="color: #718096; margin: 0 0 10px; font-size: 15px;">Cordialement,</p>
                                <p style="color: #2d3748; margin: 0; font-size: 18px; font-weight: 700;">L'équipe de la Section ${section}</p>
                                <div style="margin-top: 25px;">
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity: 0.3;">
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#667eea" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M2 17L12 22L22 17" stroke="#667eea" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M2 12L12 17L22 12" stroke="#667eea" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Footer -->
                        <div style="background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%); padding: 30px; text-align: center;">
                            <p style="color: #cbd5e0; margin: 0 0 8px; font-size: 13px; line-height: 1.6;">
                                📧 Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                            </p>
                            <p style="color: #718096; margin: 0; font-size: 12px;">
                                © ${new Date().getFullYear()} Section ${section} - Tous droits réservés
                            </p>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;

  return message;
}

router.get('/check-account/:section/:matricule', async (req, res) => {
  try {
    console.log("Begin");
    
    const etudiant = await Etudiant.findOne({ matricule: req.params.matricule });
    if (!etudiant) {
      return res.status(404).json({
        success: false,
        message: "Etudiant not found"
      });
    }

    const authData = usersMail.find((user) => user.section === req.params.section);
    console.log("Auth data : ", authData);
    if (!authData) {
      return res.status(404).json({
        success: false,
        message: "Auth data not found"
      });
    }
    
    const messageHtml = htmlResetPassword({
      nom: etudiant.nom,
      post_nom: etudiant.post_nom,
      prenom: etudiant.prenom,
      matricule: etudiant.matricule,
      email: "lisongobaita@gmail.com",
      _id: etudiant._id,
      url: process.env.CLIENT_URL || 'http://localhost:3000',
      section: req.params.section
    });

    console.log("Message HTML : ", messageHtml);
    
    const mailer = new Mailer(authData.auth);
    mailer.makeContent(messageHtml);
    const result = await mailer.sendMail(
      etudiant.email ?? 'lisongobaita@gmail.com',
      'Récupération de compte',
      authData.auth.user
    );
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: "Email sending failed",
        error: result.error
      });
    }
    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      data: result
    });
    
  } catch (error) {
    console.error("Error from sending email : ", error)
    return res.status(500).json({
      success: false,
      message: "Email sending failed",
      error: error.message
    });
  }
});

router.get('/id/:_id', async (req, res) => {
  try {
    const etudiant = await Etudiant.findById(req.params._id);
    if (!etudiant) {
      return res.status(404).json({
        success: false,
        message: "Etudiant not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "Etudiant found successfully",
      data: etudiant
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Etudiant not found",
      error: error.message
    });
  }
});

router.put('/secure', async (req, res) => {
  try {
    const { secure, etudiantId } = req.body;
    const etudiant = await Etudiant.findById(etudiantId);
    if (!etudiant) {
      return res.status(404).json({
        success: false,
        message: "Etudiant not found"
      });
    }
    const hash = crypto.createHash('sha1').update(secure.trim()).digest('hex');
    etudiant.secure = hash;

    console.log("Password hashed : ", hash);

    await etudiant.save();
    return res.status(200).json({
      success: true,
      message: "Etudiant updated successfully",
      data: etudiant
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Etudiant update failed",
      error: error.message
    });
  }
});

const auth = require('../middleware/auth');
const etudiantController = require('../controllers/etudiantController');

router.get('/', etudiantController.getEtudiants);
router.get('/:id', etudiantController.getEtudiant);
router.post('/', etudiantController.createEtudiant);
router.post('/login', etudiantController.loginEtudiant);
router.post('/connected', etudiantController.login);
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
router.post('/rapport',  async (req, res) => {
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
