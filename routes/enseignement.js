const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const coursController = require('../controllers/coursController');
const uniteController = require('../controllers/uniteController');
const semestreController = require('../controllers/semestreController');
const cycleController = require('../controllers/cycleController');
const chargeController = require('../controllers/chargeController');
const ficheController = require('../controllers/ficheController');
const Rapport = require('../models/Rapport');
const Cycle = require('../models/Cycle');
const { Cours, Travail } = require('../models/Cours');

// Cours routes
router.get('/cours', coursController.getCoursList);
router.get('/cours/:id', coursController.getCours);
router.get('/unite', uniteController.getUnites);
router.get('/unite/:id', uniteController.getUnite);
router.get('/semestre', semestreController.getSemestres);
router.get('/semestre/:id', semestreController.getSemestre);
router.get('/cycle', cycleController.getCycles);
router.get('/cycle/:id', cycleController.getCycle);
router.get('/cycle/section/:sectionId', cycleController.getCyclesBySection);
router.get('/charge', chargeController.getCharges);
router.get('/charge/:id', chargeController.getCharge);
router.get('/charge/agent/:enseignantId', chargeController.getChargesByEnseignant);
router.get('/charge/cours/:coursId', chargeController.getChargesByCours);
router.get('/charge/annee/:anneeId', chargeController.getChargesByAnnee);


router.get('/rapport/:produitId', async (req, res) => {
    try {
        const rapport = await Rapport.findOne({ produitId: req.params.produitId }).populate('etudiantId');
        res.json(rapport);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//Route Pour faire du crud sur le fiche
router.get('/fiche', ficheController.getFiches);
router.get('/fiche/:id', ficheController.getFiche);
router.post('/fiche', ficheController.createFiche);
router.put('/fiche/:id', ficheController.updateFiche);
router.delete('/fiche/:id', ficheController.deleteFiche);
router.use(auth);

// Charge routes
router.post('/charge', chargeController.createCharge);
router.put('/charge/:id', chargeController.updateCharge);
router.delete('/charge/:id', chargeController.deleteCharge);

// Cours routes
router.post('/cours', coursController.createCours);
router.put('/cours/:id', coursController.updateCours);
router.delete('/cours/:id', coursController.deleteCours);

// Unite routes
router.post('/unite', uniteController.createUnite);
router.put('/unite/:id', uniteController.updateUnite);
router.delete('/unite/:id', uniteController.deleteUnite);

// Semestre routes
router.post('/semestre', semestreController.createSemestre);
router.put('/semestre/:id', semestreController.updateSemestre);
router.delete('/semestre/:id', semestreController.deleteSemestre);

// Cycle routes
router.post('/cycle', cycleController.createCycle);
router.put('/cycle/:id', cycleController.updateCycle);
router.put('/cycle/classe/:id', async (req, res) => {
    try {
        const { vision } = req.body;

        // Validation simple de l'entrée
        if (!['active', 'inactive'].includes(vision)) {
            return res.status(400).json({ error: "vision doit être 'OK' ou 'NO'" });
        }

        // Trouver le cycle contenant la classe par l'id de la classe (subdocument)
        const classeId = req.params.id;
        const cycle = await Cycle.findOne({ 'classes._id': classeId });
        console.log('Current cycle : ', cycle);
        if (!cycle) return res.status(404).json({ error: 'Cycle non trouvé pour cette classe' });

        // Récupérer la classe subdocument
        const classe = cycle.classes.id(classeId);
        if (!classe) return res.status(404).json({ error: 'Classe non trouvée dans le cycle' });

        // Mettre à jour la vision et sauvegarder
        classe.vision = vision;
        await cycle.save();

        console.log('Updated classe : ', classe);
        res.json({ success: true, message: 'Classe mise à jour', data: classe });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});
router.delete('/cycle/:id', cycleController.deleteCycle);

router.post('/travail', async (req, res) => {
    try {
        const { coursId, anneeId, questionnaire, produitId } = req.body;
        const newTravail = await Cours.createTravail(coursId, anneeId, questionnaire, produitId);

        res.status(201).json({
            success: true,
            message: 'New travail creating successfully',
            data: newTravail
        })
        
    } catch (error) {
        console.error('Error when creating travail : ', error);
        
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
})
module.exports = router;
