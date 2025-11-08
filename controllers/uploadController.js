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
};

/**
 * Upload d'un chunk de fichier
 */
exports.uploadChunk = async (req, res) => {
  try {
    const { uploadId, chunkIndex, totalChunks, fileName, fileType } = req.body;
    const chunk = req.file;

    if (!chunk) {
      return res.status(400).json({
        success: false,
        message: 'Aucun chunk fourni'
      });
    }

    if (!uploadId || chunkIndex === undefined || !totalChunks || !fileName) {
      return res.status(400).json({
        success: false,
        message: 'Paramètres manquants (uploadId, chunkIndex, totalChunks, fileName)'
      });
    }

    const chunkIndexNum = parseInt(chunkIndex);
    const totalChunksNum = parseInt(totalChunks);

    // Sauvegarder le chunk
    fileManager.saveChunk(chunk.buffer, uploadId, chunkIndexNum, fileName);

    console.log(`📦 Chunk ${chunkIndexNum + 1}/${totalChunksNum} reçu pour ${fileName}`);

    // Si c'est le dernier chunk, assembler le fichier
    if (chunkIndexNum === totalChunksNum - 1) {
      console.log('🔨 Assemblage du fichier...');
      const result = await fileManager.assembleChunks(
        uploadId,
        totalChunksNum,
        fileName,
        fileType || 'application/octet-stream',
        req
      );

      return res.status(201).json({
        success: true,
        message: 'Fichier uploadé et assemblé avec succès',
        data: result,
        completed: true
      });
    }

    // Sinon, confirmer la réception du chunk
    res.json({
      success: true,
      message: `Chunk ${chunkIndexNum + 1}/${totalChunksNum} reçu`,
      chunkIndex: chunkIndexNum,
      completed: false
    });
  } catch (error) {
    console.error('❌ Erreur upload chunk:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload du chunk',
      error: error.message
    });
  }
};