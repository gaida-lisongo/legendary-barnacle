const express = require('express');
const router = express.Router();

// Importer les routes de section
const sectionRoutes = require('./section');
const transactionRoutes = require('./transaction');

// Utiliser les routes de section sous le path /section
router.use('/section', sectionRoutes);
router.use('/transaction', transactionRoutes);

module.exports = router;