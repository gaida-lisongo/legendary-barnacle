const Etudiant = require('../models/Etudiant');
const Fiche = require('../models/Fiche');
const Commande = require('../models/Commande');
const Semestre = require('../models/Semestre');
const Unite = require('../models/Unite');
const Cours = require('../models/Cours');
const Produit = require('../models/Produit');

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.createEtudiant = async (req, res) => {
  try {
    const etudiant = new Etudiant(req.body);
    await etudiant.save();
    res.status(201).json(etudiant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getEtudiants = async (req, res) => {
  try {
    const etudiants = await Etudiant.find();
    res.json(etudiants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEtudiant = async (req, res) => {
  try {
    const etudiant = await Etudiant.findById(req.params.id);
    if (!etudiant) return res.status(404).json({ error: 'Not found' });
    res.json(etudiant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getResultats = async (req, res) => {
  try {
    const { matricule } = req.params;
    const etudiant = await Etudiant.findOne({ matricule });
    if (!etudiant) return res.status(404).json({ success: false, message: 'Not found' });
    
    //Recupérer tous les semestres auquel l'étudiant a été inscrit
    const commandesData = await Commande.find({ matricule });
    let allSemestres = [];

    for (const commande of commandesData) {
      const semestres = await Semestre.find({ insription: { $elemMatch: { produitId: commande.productIds } } }).populate('unites');
      
      //Check if semestre existed already
      for (const semestre of semestres) {
        if (!allSemestres.find((s) => s._id.toString() === semestre._id.toString())) {

          allSemestres.push(semestre);
        }
      }
    }

    //Vérifier le resultat obtenue par l'étudiant dans que matière du semestre

    //Retourner les resultats
    res.status(200).json({ success: true, message: 'Resultats retrieved successfully', data: allSemestres });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Resultats retrieval failed', error: err.message });
  }
};

exports.updateEtudiant = async (req, res) => {
  try {
    const etudiant = await Etudiant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!etudiant) return res.status(404).json({ error: 'Not found' });
    res.json(etudiant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteEtudiant = async (req, res) => {
  try {
    const etudiant = await Etudiant.findByIdAndDelete(req.params.id);
    if (!etudiant) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Authentification de l'agent
exports.loginEtudiant = async (req, res) => {
  const { matricule, password } = req.body;
  if (!matricule || !password) {
    return res.status(400).json({ error: 'Matricule et mot de passe requis.' });
  }
  try {
    // Cryptage SHA1 du mot de passe
    console.log("Secure uncrypte: ", password);

    const hash = crypto.createHash('sha1').update(password).digest('hex');
    console.log("Secure crypte: ", hash)
    const etudiant = await Etudiant.findOne({ matricule, secure: hash });
    console.log("Etudiant: ", etudiant);
    console.log("Matricule: ", matricule);
    console.log("Password: ", password);
    if (!etudiant.toObject()) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }
    // Génération du token
    const token = jwt.sign({ id: etudiant._id, matricule: etudiant.matricule }, 'SECRET_KEY', { expiresIn: '1d' });

    const commandesData = await Commande.find({ matricule });

    let mySemestres = [];
    let myRecherches = [];
    let myStages = [];
    let myValidations = [];
    let myReleves = [];
    let mySessions = [];

    if (commandesData.length === 0) {
      return res.status(200).json({ token, etudiant, mySemestres, myRecherches, myStages, myValidations, myReleves, mySessions });
    }

    // Récupération des données communes une seule fois
    const fichesStudent = await Fiche.find({ etudiantId: etudiant._id }).populate('chargeId');
    const allSemestres = await Semestre.find({});
    
    // Récupération de tous les productIds de toutes les commandes
    const allProductIds = commandesData.flatMap(commande => commande.productIds);
    const allProduitsData = await Produit.find({ _id: { $in: allProductIds } }).populate('sectionId anneeId');
    
    // Traitement séquentiel des commandes
    for (const commande of commandesData) {
      const produitsData = allProduitsData.filter(produit => 
        commande.productIds.some(id => id.toString() === produit._id.toString())
      );
      
      // Traitement des produits
      for (const produit of produitsData) {
        if (produit.categorie.includes('sujet')) {
          myRecherches.push({...produit.toObject(), status: commande.status});
        } else if (produit.categorie.includes('stage')) {
          myStages.push({...produit.toObject(), status: commande.status});
        } else if (produit.categorie.includes('validation')) {
          myValidations.push({...produit.toObject(), status: commande.status});
        } else if (produit.categorie.includes('releve')) {
          myReleves.push({...produit.toObject(), status: commande.status});
        } else if (produit.categorie.includes('session')) {
          mySessions.push({...produit.toObject(), status: commande.status});
        }
      }
      
      console.log("My Recherches: ", myRecherches);
      console.log("My Stages: ", myStages);
      console.log("My Validations: ", myValidations);
      console.log("My Releves: ", myReleves);
      console.log("My Sessions: ", mySessions);
      // Traitement des semestres
      for (const productId of commande.productIds) {

        for (const semestre of allSemestres) {
          if (semestre.insription.find((insription) => insription.produitId.toString() === productId.toString())) {
            let unitesData = [];
            
            // Traitement des unités
            for (const uniteId of semestre.unites) {
              const unite = await Unite.findById(uniteId);
              let coursData = [];
              
              // Traitement des cours
              for (const coursId of unite.cours) {
                const ecue = await Cours.findById(coursId);
                const isExist = fichesStudent.find((fiche) => fiche.chargeId.coursId.toString() === coursId.toString());
                coursData.push({ ...ecue.toObject(), fiche_cotation: isExist ? isExist : null });
              }
              
              unitesData.push({ ...unite.toObject(), cours: coursData });
            }
            
            mySemestres.push({ ...semestre.toObject(), unites: unitesData });
          }
        }
      }
    }

    res.json({success: true, message: "Login successful", data:{ token, etudiant, mySemestres, myRecherches, myStages, myValidations, myReleves, mySessions }});
  } catch (err) {
    res.status(500).json({success: false, message: "Login failed", error: err.message });
  }
};
