const express = require('express');
const router = express.Router();
const Resolution = require('../models/Resolution');
const auth = require('../middleware/auth');

router.get('/travail/:travailId', auth, async (req, res) => {
    try {
        const resolution = await Resolution.find({ travailId: req.params.travailId }).populate('etudiantId').populate('travailId').lean();
        if (!resolution) {
            return res.status(404).json({ message: 'Resolution not found' });
        }
        res.json({
            success: true,
            message: 'Resolution retrieved successfully',
            data: resolution
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Failed to retrieve resolution',
            error: error.message
         });
    }
});

router.get('/etudiant/:etudiantId', auth, async (req, res) => {
    try {
        const resolution = await Resolution.find({ etudiantId: req.params.etudiantId }).populate('etudiantId').populate('travailId').lean();
        if (!resolution) {
            return res.status(404).json({ message: 'Resolution not found' });
        }
        res.json({
            success: true,
            message: 'Resolution retrieved successfully',
            data: resolution
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Failed to retrieve resolution',
            error: error.message
         });
    }
});

router.get('/exist/:travailId/:etudiantId', auth, async (req, res) => {
    try {
        const resolution = await Resolution.findOne({ travailId: req.params.travailId, etudiantId: req.params.etudiantId }).populate('etudiantId').populate('travailId').lean();
        if (!resolution) {
            return res.json({ 
                success: false,
                message: 'Resolution not found' 
            });
        }
        res.json({
            success: true,
            message: 'Resolution retrieved successfully',
            data: resolution
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Failed to retrieve resolution',
            error: error.message
         });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        console.log("Payload : ", req.body);
        const resolution = await Resolution.create(req.body);
        res.json({
            success: true,
            message: 'Resolution created successfully',
            data: resolution
        });
    } catch (error) {
        console.log("Error : ", error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to create resolution',
            error: error.message
         });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const resolution = await Resolution.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('etudiantId').populate('travailId').lean();
        if (!resolution) {
            return res.status(404).json({ message: 'Resolution not found' });
        }
        res.json({
            success: true,
            message: 'Resolution updated successfully',
            data: resolution
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Failed to update resolution',
            error: error.message
         });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const resolution = await Resolution.findByIdAndDelete(req.params.id).populate('etudiantId').populate('travailId').lean();
        if (!resolution) {
            return res.status(404).json({ message: 'Resolution not found' });
        }
        res.json({
            success: true,
            message: 'Resolution deleted successfully',
            data: resolution
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Failed to delete resolution',
            error: error.message
         });
    }
});

module.exports = router;