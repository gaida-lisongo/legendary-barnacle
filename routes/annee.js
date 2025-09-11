const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const sessionController = require('../controllers/sessionController');
const anneeController = require('../controllers/anneeController');

// Session routes
router.use(auth);
router.post('/session', sessionController.createSession);
router.get('/session', sessionController.getSessions);
router.get('/session/:id', sessionController.getSession);
router.put('/session/:id', sessionController.updateSession);
router.delete('/session/:id', sessionController.deleteSession);

// Annee routes
router.post('/annee', anneeController.createAnnee);
router.get('/annee', anneeController.getAnnees);
router.get('/annee/:id', anneeController.getAnnee);
router.put('/annee/:id', anneeController.updateAnnee);
router.delete('/annee/:id', anneeController.deleteAnnee);

module.exports = router;
