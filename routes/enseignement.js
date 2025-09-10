const express = require('express');
const router = express.Router();
const coursController = require('../controllers/coursController');
const uniteController = require('../controllers/uniteController');
const semestreController = require('../controllers/semestreController');
const cycleController = require('../controllers/cycleController');

// Cours routes
router.post('/cours', coursController.createCours);
router.get('/cours', coursController.getCoursList);
router.get('/cours/:id', coursController.getCours);
router.put('/cours/:id', coursController.updateCours);
router.delete('/cours/:id', coursController.deleteCours);

// Unite routes
router.post('/unite', uniteController.createUnite);
router.get('/unite', uniteController.getUnites);
router.get('/unite/:id', uniteController.getUnite);
router.put('/unite/:id', uniteController.updateUnite);
router.delete('/unite/:id', uniteController.deleteUnite);

// Semestre routes
router.post('/semestre', semestreController.createSemestre);
router.get('/semestre', semestreController.getSemestres);
router.get('/semestre/:id', semestreController.getSemestre);
router.put('/semestre/:id', semestreController.updateSemestre);
router.delete('/semestre/:id', semestreController.deleteSemestre);

// Cycle routes
router.post('/cycle', cycleController.createCycle);
router.get('/cycle', cycleController.getCycles);
router.get('/cycle/:id', cycleController.getCycle);
router.put('/cycle/:id', cycleController.updateCycle);
router.delete('/cycle/:id', cycleController.deleteCycle);

module.exports = router;
