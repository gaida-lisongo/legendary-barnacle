const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const etudiantController = require('../controllers/etudiantController');
const Rapport = require('../models/Rapport');
router.get('/', etudiantController.getEtudiants);
router.get('/:id', etudiantController.getEtudiant);
router.post('/', etudiantController.createEtudiant);
router.post('/login', etudiantController.loginEtudiant);

// Etudiant routes
router.use(auth);
router.post('/rapport', async (req, res) => {
  try {
    const rapport = new Rapport(req.body);
    await rapport.save();
    res.status(201).json({
        success: true,
        message: "Rapport created successfully",
        data: rapport
    });
  } catch (err) {
    res.status(400).json({
        success: false,
        message: "Rapport creation failed",
        error: err.message
    });
  }
});

router.get('/rapport/:etudiantId', async (req, res) => {
  try {
    const rapports = await Rapport.find({ etudiantId: req.params.etudiantId }).populate('produitId');
    res.status(200).json({
        success: true,
        message: "Rapports retrieved successfully",
        data: rapports
    });
  } catch (err) {
    res.status(500).json({
        success: false,
        message: "Rapports retrieval failed",
        error: err.message
    });
  }
});
router.put('/:id', etudiantController.updateEtudiant);
router.delete('/:id', etudiantController.deleteEtudiant);


module.exports = router;
