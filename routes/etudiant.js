const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const etudiantController = require('../controllers/etudiantController');

// Etudiant routes
router.post('/etudiant', etudiantController.createEtudiant);
router.get('/etudiant', etudiantController.getEtudiants);
router.get('/etudiant/:id', etudiantController.getEtudiant);
router.put('/etudiant/:id', etudiantController.updateEtudiant);
router.delete('/etudiant/:id', etudiantController.deleteEtudiant);


module.exports = router;
