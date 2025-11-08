const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

// Configuration de multer pour stocker les fichiers en mémoire
const storage = multer.memoryStorage();

// Configuration des limites et filtres
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10MB
  },
  fileFilter: (req, file, cb) => {
    // Vous pouvez ajouter des filtres de type de fichier ici si nécessaire
    // Pour l'instant, on accepte tous les types de fichiers
    cb(null, true);
  }
});

/**
 * POST /api/v1/upload/single
 * Upload d'un seul fichier
 */
router.post('/', upload.single('file'), uploadController.uploadSingle);

/**
 * POST /api/v1/upload/multiple
 * Upload de plusieurs fichiers
 */
router.post('/multiple', upload.array('files', 10), uploadController.uploadMultiple);

/**
 * DELETE /api/v1/upload/:filename
 * Suppression d'un fichier
 */
router.delete('/:filename', uploadController.deleteFile);

module.exports = router;