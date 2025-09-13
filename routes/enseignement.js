const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const coursController = require('../controllers/coursController');
const uniteController = require('../controllers/uniteController');
const semestreController = require('../controllers/semestreController');
const cycleController = require('../controllers/cycleController');

// Cours routes
router.get('/cours', coursController.getCoursList);
router.get('/cours/:id', coursController.getCours);
router.get('/unite', uniteController.getUnites);
router.get('/unite/:id', uniteController.getUnite);
router.get('/semestre', semestreController.getSemestres);
router.get('/semestre/:id', semestreController.getSemestre);
router.get('/cycle', cycleController.getCycles);
router.get('/cycle/:id', cycleController.getCycle);


router.use(auth);
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
router.delete('/cycle/:id', cycleController.deleteCycle);

module.exports = router;
