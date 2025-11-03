const express = requie('express');
const router = express.Router();
const Resolution = require('../models/Resolution');
const auth = require('../middleware/auth');

router.get('/travail/:travailId', auth, async (req, res) => {
    try {
        const resolution = await Resolution.find({ travailId: req.params.travailId }).populate('etudiantId').lean();
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

router.get()

module.exports = router;