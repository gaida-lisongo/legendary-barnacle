const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const etudiantController = require('../controllers/etudiantController');

router.get('/', etudiantController.getEtudiants);
router.get('/:id', etudiantController.getEtudiant);


// Etudiant routes
router.use(auth);
router.post('/', etudiantController.createEtudiant);
router.put('/:id', etudiantController.updateEtudiant);
router.delete('/:id', etudiantController.deleteEtudiant);


module.exports = router;
