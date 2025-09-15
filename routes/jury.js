const express = require('express');
const router = express.Router();
const juryController = require('../controllers/juryController');
const juryClasseController = require('../controllers/juryController');

// Jury CRUD
router.post('/jury', juryController.createJury);
router.get('/jury', juryController.getJuries);
router.get('/jury/:id', juryController.getJury);
router.put('/jury/:id', juryController.updateJury);
router.delete('/jury/:id', juryController.deleteJury);

// JuryClasse CRUD
router.post('/jury-classe', juryClasseController.createJuryClasse);
router.get('/jury-classe', juryClasseController.getJuryClasses);
router.get('/jury-classe/:id', juryClasseController.getJuryClasse);
router.put('/jury-classe/:id', juryClasseController.updateJuryClasse);
router.delete('/jury-classe/:id', juryClasseController.deleteJuryClasse);

module.exports = router;