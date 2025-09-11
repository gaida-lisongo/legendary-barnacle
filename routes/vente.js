const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');
const produitController = require('../controllers/produitController');

// Commande routes
router.post('/commande', commandeController.createCommande);
router.get('/commande', commandeController.getCommandes);
router.get('/commande/:id', commandeController.getCommande);
router.put('/commande/:id', commandeController.updateCommande);
router.delete('/commande/:id', commandeController.deleteCommande);

// Produit routes
router.post('/produit', produitController.createProduit);
router.get('/produit', produitController.getProduits);
router.get('/produit/:id', produitController.getProduit);
router.put('/produit/:id', produitController.updateProduit);
router.delete('/produit/:id', produitController.deleteProduit);

module.exports = router;
