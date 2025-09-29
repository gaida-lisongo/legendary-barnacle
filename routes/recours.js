const express = require('express');
const router = express.Router();
const Recours = require('../models/Recours');
const Fiche = require('../models/Fiche');

/**
 * Route pour récupérer tous les recours liés à une charge
 * GET /recours/:chargeId
 * 
 * @param {string} chargeId - L'ID de la charge
 * @returns {Array} Liste des recours avec détails de la fiche et de l'étudiant
 */
router.get('/charge/:chargeId', async (req, res) => {
    try {
        const { chargeId } = req.params;

        // Étape 1: Trouver toutes les fiches liées à cette charge
        const fiches = await Fiche.find({ chargeId: chargeId });
        
        if (!fiches || fiches.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Aucune fiche trouvée pour cette charge'
            });
        }

        // Étape 2: Extraire les IDs des fiches
        const ficheIds = fiches.map(fiche => fiche._id);

        // Étape 3: Trouver tous les recours liés à ces fiches
        const recours = await Recours.find({ 
            noteId: { $in: ficheIds } 
        })
        .populate({
            path: 'noteId',
            model: 'Fiche',
            populate: {
                path: 'chargeId',
                model: 'Charge'
            }
        })
        .populate({
            path: 'etudiantId',
            model: 'Etudiant',
            select: 'nom post_nom prenom matricule sexe nationalite photo'
        })
        .populate({
            path: 'agent',
            model: 'Agent',
            select: 'nom prenom email photo matricule'
        });

        if (!recours || recours.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Aucun recours trouvé pour cette charge'
            });
        }

        // Étape 4: Formater la réponse
        const recoursFormates = recours.map(recour => ({
            _id: recour._id,
            reference: recour.reference,
            object: recour.object,
            contenu: recour.contenu,
            status: recour.status,
            preuve: recour.preuve,
            agent: recour.agent,
            fiche: {
                _id: recour.noteId._id,
                reference: recour.noteId.reference,
                cmi: recour.noteId.cmi,
                examen: recour.noteId.examen,
                rattrapage: recour.noteId.rattrapage,
                status: recour.noteId.status,
                chargeId: recour.noteId.chargeId,
                author: recour.noteId.author,
                logs: recour.noteId.logs
            },
            etudiant: {
                _id: recour.etudiantId._id,
                nom: recour.etudiantId.nom,
                post_nom: recour.etudiantId.post_nom,
                prenom: recour.etudiantId.prenom,
                matricule: recour.etudiantId.matricule,
                sexe: recour.etudiantId.sexe,
                nationalite: recour.etudiantId.nationalite,
                photo: recour.etudiantId.photo
            },
            createdAt: recour.createdAt,
            updatedAt: recour.updatedAt
        }));

        res.status(200).json({
            success: true,
            message: `${recours.length} recours trouvé(s) pour la charge ${chargeId}`,
            data: recoursFormates,
            count: recours.length
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des recours:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: error.message
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const recours = await Recours.findByIdAndDelete(id);
        if (!recours) {
            return res.status(404).json({
                success: false,
                message: 'Recours non trouvé'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Recours supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression du recours:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: error.message
        });
    }
});
module.exports = router;
