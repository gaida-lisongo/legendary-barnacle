const express = require('express');
const router = express.Router();
const juryController = require('../controllers/juryController');
const juryClasseController = require('../controllers/juryController');

// Jury CRUD
router.post('/', juryController.createJury);
router.get('/', juryController.getJuries);
router.get('/:id', juryController.getJury);
router.put('/:id', juryController.updateJury);
router.delete('/:id', juryController.deleteJury);
router.get('/annee/:anneeId/section/:sectionId', juryController.getJuriesByAnneeAndSection);

// JuryClasse CRUD
router.post('/classe', juryClasseController.createJuryClasse);
router.get('/classe', juryClasseController.getJuryClasses);
router.get('/classe/:id', juryClasseController.getJuryClasse);
router.put('/classe/:id', juryClasseController.updateJuryClasse);
router.delete('/classe/:id', juryClasseController.deleteJuryClasse);

module.exports = router;