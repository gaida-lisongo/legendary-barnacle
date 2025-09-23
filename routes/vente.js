const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commandeController = require('../controllers/commandeController');
const produitController = require('../controllers/produitController');

// Commande routes
router.get('/commande', commandeController.getCommandes);
router.get('/commande/:id', commandeController.getCommande);
router.get('/commande/key/:key/value/:value', commandeController.getCommandesByKeys);
router.get('/produit', produitController.getProduits);
router.get('/produit/:id', produitController.getProduit);
router.get('/produit/categorie/:categorie', produitController.getProduitsByCategorie);
router.get('/produit/annee/:anneeId/section/:sectionId', produitController.getProduitByAnneeAndSection);
router.post('/commande', commandeController.createCommande);


router.use(auth);
router.put('/commande/:id', commandeController.updateCommande);
router.delete('/commande/:id', commandeController.deleteCommande);

// Produit routes
router.post('/produit', produitController.createProduit);
router.put('/produit/:id', produitController.updateProduit);
router.delete('/produit/:id', produitController.deleteProduit);

module.exports = router;
