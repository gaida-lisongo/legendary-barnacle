const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const chargeController = require('../controllers/chargeController');
const ficheController = require('../controllers/ficheController');
const auth = require('../middleware/auth');

// Agent routes
router.get('/agent', agentController.getAgents);
router.get('/agent/:id', agentController.getAgent);
router.get('/charge', chargeController.getCharges);
router.get('/charge/:id', chargeController.getCharge);
router.get('/fiche', ficheController.getFiches);
router.get('/fiche/:id', ficheController.getFiche);
router.post('/agent/login', agentController.loginAgent);

// Middleware pour sécuriser les routes agent (sauf login et création)
router.use('/agent', auth);
router.post('/agent', agentController.createAgent);
router.put('/agent/:id', agentController.updateAgent);
router.delete('/agent/:id', agentController.deleteAgent);
router.post('/agent/:id/credit', agentController.creditSolde);

// Charge routes
router.post('/charge', chargeController.createCharge);
router.put('/charge/:id', chargeController.updateCharge);
router.delete('/charge/:id', chargeController.deleteCharge);

// Fiche routes
router.post('/fiche', ficheController.createFiche);
router.put('/fiche/:id', ficheController.updateFiche);
router.delete('/fiche/:id', ficheController.deleteFiche);

module.exports = router;
