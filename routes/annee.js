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
router.post('/', anneeController.createAnnee);
router.get('/', anneeController.getAnnees);
router.get('/:id', anneeController.getAnnee);
router.put('/:id', anneeController.updateAnnee);
router.delete('/:id', anneeController.deleteAnnee);

module.exports = router;
