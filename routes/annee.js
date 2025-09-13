const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const sessionController = require('../controllers/sessionController');
const anneeController = require('../controllers/anneeController');

// Session routes
router.get('/session', sessionController.getSessions);
router.get('/session/:id', sessionController.getSession);
router.get('/', anneeController.getAnnees);
router.get('/:id', anneeController.getAnnee);

router.use(auth);
router.post('/session', sessionController.createSession);
router.put('/session/:id', sessionController.updateSession);
router.delete('/session/:id', sessionController.deleteSession);

// Annee routes
router.post('/', anneeController.createAnnee);
router.put('/:id', anneeController.updateAnnee);
router.delete('/:id', anneeController.deleteAnnee);

module.exports = router;
