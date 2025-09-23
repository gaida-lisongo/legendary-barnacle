const express = require('express');
const router = express.Router();

// Importer les routes de section
const sectionRoutes = require('./section');
const transactionRoutes = require('./transaction');
const anneeRoutes = require('./annee');
const enseignementRoutes = require('./enseignement');
const etudiantRoutes = require('./etudiant');
const venteRoutes = require('./vente');
const agentRoutes = require('./agent');
const adminRoutes = require('./admin');
const messageRoutes = require('./message');
const privilegeRoutes = require('./privilege');
const juryRoutes = require('./jury');
const paymentRoutes = require('./payment');


// Utiliser les routes de section sous le path /section
router.use('/section', sectionRoutes);
router.use('/transaction', transactionRoutes);
router.use('/annee', anneeRoutes);
router.use('/enseignement', enseignementRoutes);
router.use('/etudiant', etudiantRoutes);
router.use('/vente', venteRoutes);
router.use('/user', agentRoutes);
router.use('/admin', adminRoutes);
router.use('/message', messageRoutes);
router.use('/privilege', privilegeRoutes);
router.use('/jury', juryRoutes);
router.use('/payment', paymentRoutes);

module.exports = router;