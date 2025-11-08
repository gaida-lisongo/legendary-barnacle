const fileManager = require('../service/FileManager');

/**
 * Upload d'un seul fichier
 */
exports.uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const result = await fileManager.persistFile(req.file, req);

    res.status(201).json({
      success: true,
      message: 'Fichier uploadé avec succès',
      data: result
    });
  } catch (error) {
    console.error('❌ Erreur upload single:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload du fichier',
      error: error.message
    });
  }
};

/**
 * Upload de plusieurs fichiers
 */
exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const results = await fileManager.persistFiles(req.files, req);

    res.status(201).json({
      success: true,
      message: `${results.length} fichier(s) uploadé(s) avec succès`,
      data: results
    });
  } catch (error) {
    console.error('❌ Erreur upload multiple:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload des fichiers',
      error: error.message
    });
  }
};

/**
 * Suppression d'un fichier
 */
exports.deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Nom de fichier requis'
      });
    }

    const deleted = fileManager.deleteFile(filename);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Fichier non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Fichier supprimé avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur suppression fichier:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du fichier',
      error: error.message
    });
  }
};

exports.getFile = async (req, res) => {
    try {
        const { filename } = req.params;

        if (!filename) {
            return res.status(400).json({
                success: false,
                message: 'Nom de fichier requis'
            });
        }

        const file = fileManager.getFile(filename);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'Fichier non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Fichier récupéré avec succès',
            data: file
        });
        
    } catch (error) {
        console.error('❌ Erreur récupération fichier:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du fichier',
            error: error.message
        });
    }
}