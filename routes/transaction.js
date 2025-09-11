const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const transactionController = require('../controllers/transactionController');
const flexPayManager = require('../service/MoneyManager');

const formatPhoneNumber = (number) => {
    //Recupère les 9 derniers chiffres
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(/(\d{9})$/);
    if (match) {
        return '243' + match[1];
    }
    return null;
}

router.use(auth);

// ============= ROUTES DEPOSITS =============
router.post('/payment', async (req, res) => {
    try {
        const { amount, phoneNumber, reference, currency } = req.body;
        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
        const result = await flexPayManager.createTransaction({ amount, phone: formattedPhoneNumber, reference, currency });

        console.log('Payment result:', result);
        if (!result) {
            return res.status(500).json({
                success: false,
                message: 'Erreur lors du traitement du paiement'
            });
        }

        res.status(result.code == "0" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors du traitement du paiement',
            error: error.message
        });
    }
});

router.get('/payment/:orderNumber', async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const result = await flexPayManager.checkTransaction({ orderNumber });
        res.status(result.code == "0" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la vérification du paiement',
            error: error.message
        });
    }
});

// Créer un nouveau dépôt
// POST /api/v1/transaction/deposit
router.post('/deposit', async (req, res) => {
    try {
        const result = await transactionController.createDeposit(req.body);
        const statusCode = result.success ? 201 : (result.message.includes('existe déjà') ? 400 : 500);
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la création du dépôt',
            error: error.message
        });
    }
});

// Lire tous les dépôts
// GET /api/v1/transaction/deposits
router.get('/deposits', async (req, res) => {
    try {
        const result = await transactionController.getAllDeposits();
        const statusCode = result.success ? 200 : 500;
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la récupération des dépôts',
            error: error.message
        });
    }
});

// Lire les dépôts par utilisateur
// GET /api/v1/transaction/deposits/user/:userId
router.get('/deposits/user/:userId', async (req, res) => {
    try {
        const result = await transactionController.getDepositsByUserId(req.params.userId);
        const statusCode = result.success ? 200 : 500;
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la récupération des dépôts utilisateur',
            error: error.message
        });
    }
});

// Lire un dépôt par ID
// GET /api/v1/transaction/deposit/:id
router.get('/deposit/:id', async (req, res) => {
    try {
        const result = await transactionController.getDepositById(req.params.id);
        const statusCode = result.success ? 200 : (result.message === 'Dépôt non trouvé' ? 404 : 500);
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la récupération du dépôt',
            error: error.message
        });
    }
});

// Modifier un dépôt
// PUT /api/v1/transaction/deposit/:id
router.put('/deposit/:id', async (req, res) => {
    try {
        const result = await transactionController.updateDeposit(req.params.id, req.body);
        const statusCode = result.success ? 200 : (result.message === 'Dépôt non trouvé' ? 404 : 500);
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la mise à jour du dépôt',
            error: error.message
        });
    }
});

// Supprimer un dépôt
// DELETE /api/v1/transaction/deposit/:id
router.delete('/deposit/:id', async (req, res) => {
    try {
        const result = await transactionController.deleteDeposit(req.params.id);
        const statusCode = result.success ? 200 : (result.message === 'Dépôt non trouvé' ? 404 : 500);
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la suppression du dépôt',
            error: error.message
        });
    }
});

// ============= ROUTES WITHDRAWALS =============

// Créer un nouveau retrait
// POST /api/v1/transaction/withdraw
router.post('/withdraw', async (req, res) => {
    try {
        const result = await transactionController.createWithdraw(req.body);
        const statusCode = result.success ? 201 : (result.message.includes('existe déjà') ? 400 : 500);
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la création du retrait',
            error: error.message
        });
    }
});

// Lire tous les retraits
// GET /api/v1/transaction/withdraws
router.get('/withdraws', async (req, res) => {
    try {
        const result = await transactionController.getAllWithdraws();
        const statusCode = result.success ? 200 : 500;
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la récupération des retraits',
            error: error.message
        });
    }
});

// Lire les retraits par utilisateur
// GET /api/v1/transaction/withdraws/user/:userId
router.get('/withdraws/user/:userId', async (req, res) => {
    try {
        const result = await transactionController.getWithdrawsByUserId(req.params.userId);
        const statusCode = result.success ? 200 : 500;
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la récupération des retraits utilisateur',
            error: error.message
        });
    }
});

// Lire un retrait par ID
// GET /api/v1/transaction/withdraw/:id
router.get('/withdraw/:id', async (req, res) => {
    try {
        const result = await transactionController.getWithdrawById(req.params.id);
        const statusCode = result.success ? 200 : (result.message === 'Retrait non trouvé' ? 404 : 500);
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la récupération du retrait',
            error: error.message
        });
    }
});

// Modifier un retrait
// PUT /api/v1/transaction/withdraw/:id
router.put('/withdraw/:id', async (req, res) => {
    try {
        const result = await transactionController.updateWithdraw(req.params.id, req.body);
        const statusCode = result.success ? 200 : (result.message === 'Retrait non trouvé' ? 404 : 500);
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la mise à jour du retrait',
            error: error.message
        });
    }
});

// Supprimer un retrait
// DELETE /api/v1/transaction/withdraw/:id
router.delete('/withdraw/:id', async (req, res) => {
    try {
        const result = await transactionController.deleteWithdraw(req.params.id);
        const statusCode = result.success ? 200 : (result.message === 'Retrait non trouvé' ? 404 : 500);
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la suppression du retrait',
            error: error.message
        });
    }
});

// ============= ROUTES UTILITAIRES =============

// Récupérer toutes les transactions d'un utilisateur (dépôts + retraits)
// GET /api/v1/transaction/user/:userId/all
router.get('/user/:userId/all', async (req, res) => {
    try {
        const result = await transactionController.getAllTransactionsByUserId(req.params.userId);
        const statusCode = result.success ? 200 : 500;
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la récupération des transactions',
            error: error.message
        });
    }
});

// Statistiques des transactions
// GET /api/v1/transaction/stats
router.get('/stats', async (req, res) => {
    try {
        const result = await transactionController.getTransactionStats();
        const statusCode = result.success ? 200 : 500;
        res.status(statusCode).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors du calcul des statistiques',
            error: error.message
        });
    }
});

module.exports = router;