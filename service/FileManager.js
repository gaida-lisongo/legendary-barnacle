const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class FileManager {
  constructor() {
    // Dossier de stockage des fichiers
    this.uploadDir = path.join(__dirname, '..', 'uploads');
    this.ensureUploadDirExists();
  }

  /**
   * S'assure que le dossier uploads existe
   */
  ensureUploadDirExists() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      console.log('📁 Dossier uploads créé:', this.uploadDir);
    }
  }

  /**
   * Génère un nom de fichier unique
   * @param {string} originalName - Nom original du fichier
   * @returns {string} - Nom de fichier unique
   */
  generateUniqueFilename(originalName) {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);
    return `${nameWithoutExt}_${timestamp}_${randomString}${ext}`;
  }

  /**
   * Persiste un fichier sur le serveur et retourne l'URL complète
   * @param {Object} file - Objet fichier de multer
   * @param {Object} req - Objet request Express pour obtenir le host
   * @returns {Promise<Object>} - Objet contenant l'URL et les infos du fichier
   */
  async persistFile(file, req) {
    try {
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      // Générer un nom de fichier unique
      const uniqueFilename = this.generateUniqueFilename(file.originalname);
      const filePath = path.join(this.uploadDir, uniqueFilename);

      // Écrire le fichier sur le disque
      if (file.buffer) {
        // Si le fichier est en mémoire (multer memoryStorage)
        fs.writeFileSync(filePath, file.buffer);
      } else if (file.path) {
        // Si le fichier est déjà sur le disque (multer diskStorage)
        fs.renameSync(file.path, filePath);
      } else {
        throw new Error('Format de fichier non supporté');
      }

      // Construire l'URL complète
      const protocol = req.protocol; // http ou https
      const host = req.get('host'); // localhost:4003 ou domaine
      const relativePath = `/uploads/${uniqueFilename}`;
      const fullUrl = `${protocol}://${host}${relativePath}`;

      return {
        success: true,
        url: fullUrl,
        filename: uniqueFilename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: relativePath
      };
    } catch (error) {
      console.error('❌ Erreur lors de la persistance du fichier:', error);
      throw error;
    }
  }

  /**
   * Persiste plusieurs fichiers
   * @param {Array} files - Tableau de fichiers
   * @param {Object} req - Objet request Express
   * @returns {Promise<Array>} - Tableau d'objets contenant les URLs
   */
  async persistFiles(files, req) {
    try {
      if (!files || files.length === 0) {
        throw new Error('Aucun fichier fourni');
      }

      const results = [];
      for (const file of files) {
        const result = await this.persistFile(file, req);
        results.push(result);
      }

      return results;
    } catch (error) {
      console.error('❌ Erreur lors de la persistance des fichiers:', error);
      throw error;
    }
  }

  /**
   * Supprime un fichier du serveur
   * @param {string} filename - Nom du fichier à supprimer
   * @returns {boolean} - True si supprimé avec succès
   */
  deleteFile(filename) {
    try {
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('🗑️ Fichier supprimé:', filename);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du fichier:', error);
      throw error;
    }
  }

  /**
   * Vérifie si un fichier existe
   * @param {string} filename - Nom du fichier
   * @returns {boolean}
   */
  fileExists(filename) {
    const filePath = path.join(this.uploadDir, filename);
    return fs.existsSync(filePath);
  }
}

module.exports = new FileManager();