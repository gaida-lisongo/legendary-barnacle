const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');

// Créer une nouvelle section
// POST /api/sections
router.post('/', async (req, res) => {
    try {
        const result = await sectionController.createSection(req.body);
        const statusCode = result.success ? 201 : (result.message.includes('existe déjà') ? 400 : 500);
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la création',
            error: error.message
        });
    }
});

// Lire toutes les sections
// GET /api/sections
router.get('/', async (req, res) => {
    try {
        const result = await sectionController.getAllSections();
        const statusCode = result.success ? 200 : 500;
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la récupération',
            error: error.message
        });
    }
});

// Rechercher des sections avec pagination
// GET /api/sections/search?page=1&limit=10&search=terme
router.get('/search', async (req, res) => {
    try {
        const searchOptions = {
            page: req.query.page,
            limit: req.query.limit,
            search: req.query.search
        };
        const result = await sectionController.searchSections(searchOptions);
        const statusCode = result.success ? 200 : 500;
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la recherche',
            error: error.message
        });
    }
});

// Lire une section par ID
// GET /api/sections/:id
router.get('/:id', async (req, res) => {
    try {
        const result = await sectionController.getSectionById(req.params.id);
        const statusCode = result.success ? 200 : (result.message === 'Section non trouvée' ? 404 : 500);
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la récupération',
            error: error.message
        });
    }
});

// Lire une section par nom (sigle ou designation)
// GET /api/sections/name/:name
router.get('/name/:name', async (req, res) => {
    try {
        const result = await sectionController.getSectionByName(req.params.name);
        const statusCode = result.success ? 200 : (result.message.includes('non trouvée') ? 404 : 500);
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la recherche par nom',
            error: error.message
        });
    }
});

// Modifier une section
// PUT /api/sections/:id
router.put('/:id', async (req, res) => {
    try {
        const result = await sectionController.updateSection(req.params.id, req.body);
        const statusCode = result.success ? 200 : (result.message === 'Section non trouvée' ? 404 : (result.message.includes('existe déjà') ? 400 : 500));
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la mise à jour',
            error: error.message
        });
    }
});

// Supprimer une section
// DELETE /api/sections/:id
router.delete('/:id', async (req, res) => {
    try {
        const result = await sectionController.deleteSection(req.params.id);
        const statusCode = result.success ? 200 : (result.message === 'Section non trouvée' ? 404 : 500);
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la suppression',
            error: error.message
        });
    }
});

module.exports = router;