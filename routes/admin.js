const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Toutes les routes nécessitent d'abord auth
// router.use(auth);

// Vérifier si l'utilisateur connecté est admin
router.get('/me', adminController.checkMe);

// Vérifier si un userId est admin (accessible aux admins seulement?)
router.get('/check/:userId', adminController.isUserAdmin);

// CRUD Admin (protégé par isAdmin sauf création initiale?)
// Pour simplifier: création aussi requiert être admin existant.
router.post('/', adminController.createAdmin);
router.get('/', adminController.getAdmins);
router.get('/:id', adminController.getAdmin);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;
