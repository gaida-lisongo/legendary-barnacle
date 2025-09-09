const express = require('express');
const router = express.Router();

// Importer les routes de section
const sectionRoutes = require('./section');

// Utiliser les routes de section sous le path /section
router.use('/section', sectionRoutes);

module.exports = router;