const Deposit = require('../models/Deposit');
const Withdraw = require('../models/Withdraw');

class TransactionController {

    // ============= DEPOSITS =============

    // Créer un nouveau dépôt
    async createDeposit(depositData) {
        try {
            const newDeposit = new Deposit(depositData);
            const savedDeposit = await newDeposit.save();
            
            return {
                success: true,
                message: 'Dépôt créé avec succès',
                data: savedDeposit
            };
        } catch (error) {
            if (error.code === 11000) {
                return {
                    success: false,
                    message: 'Le numéro de commande existe déjà',
                    error: error.message
                };
            }
            
            return {
                success: false,
                message: 'Erreur lors de la création du dépôt',
                error: error.message
            };
        }
    }

    // Lire tous les dépôts
    async getAllDeposits() {
        try {
            const deposits = await Deposit.find().populate('userId', 'name email').sort({ createdAt: -1 });
            
            return {
                success: true,
                message: 'Dépôts récupérés avec succès',
                count: deposits.length,
                data: deposits
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la récupération des dépôts',
                error: error.message
            };
        }
    }

    // Lire les dépôts par utilisateur
    async getDepositsByUserId(userId) {
        try {
            const deposits = await Deposit.find({ userId }).populate('userId', 'name email').sort({ createdAt: -1 });
            
            return {
                success: true,
                message: 'Dépôts de l\'utilisateur récupérés avec succès',
                count: deposits.length,
                data: deposits
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la récupération des dépôts utilisateur',
                error: error.message
            };
        }
    }

    // Lire un dépôt par ID
    async getDepositById(id) {
        try {
            const deposit = await Deposit.findById(id).populate('userId', 'name email');
            
            if (!deposit) {
                return {
                    success: false,
                    message: 'Dépôt non trouvé'
                };
            }
            
            return {
                success: true,
                message: 'Dépôt récupéré avec succès',
                data: deposit
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la récupération du dépôt',
                error: error.message
            };
        }
    }

    // Modifier un dépôt
    async updateDeposit(id, updateData) {
        try {
            const updatedDeposit = await Deposit.findByIdAndUpdate(
                id,
                updateData,
                { 
                    new: true,
                    runValidators: true
                }
            ).populate('userId', 'name email');
            
            if (!updatedDeposit) {
                return {
                    success: false,
                    message: 'Dépôt non trouvé'
                };
            }
            
            return {
                success: true,
                message: 'Dépôt mis à jour avec succès',
                data: updatedDeposit
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la mise à jour du dépôt',
                error: error.message
            };
        }
    }

    // Supprimer un dépôt
    async deleteDeposit(id) {
        try {
            const deletedDeposit = await Deposit.findByIdAndDelete(id);
            
            if (!deletedDeposit) {
                return {
                    success: false,
                    message: 'Dépôt non trouvé'
                };
            }
            
            return {
                success: true,
                message: 'Dépôt supprimé avec succès',
                data: deletedDeposit
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la suppression du dépôt',
                error: error.message
            };
        }
    }

    // ============= WITHDRAWALS =============

    // Créer un nouveau retrait
    async createWithdraw(withdrawData) {
        try {
            const newWithdraw = new Withdraw(withdrawData);
            const savedWithdraw = await newWithdraw.save();
            
            return {
                success: true,
                message: 'Retrait créé avec succès',
                data: savedWithdraw
            };
        } catch (error) {
            if (error.code === 11000) {
                return {
                    success: false,
                    message: 'Le numéro de commande existe déjà',
                    error: error.message
                };
            }
            
            return {
                success: false,
                message: 'Erreur lors de la création du retrait',
                error: error.message
            };
        }
    }

    // Lire tous les retraits
    async getAllWithdraws() {
        try {
            const withdraws = await Withdraw.find().populate('userId', 'photo matricule nom telephone email').sort({ createdAt: -1 });
            
            return {
                success: true,
                message: 'Retraits récupérés avec succès',
                count: withdraws.length,
                data: withdraws
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la récupération des retraits',
                error: error.message
            };
        }
    }

    // Lire les retraits par utilisateur
    async getWithdrawsByUserId(userId) {
        try {
            const withdraws = await Withdraw.find({ userId }).populate('userId', 'name email').sort({ createdAt: -1 });
            
            return {
                success: true,
                message: 'Retraits de l\'utilisateur récupérés avec succès',
                count: withdraws.length,
                data: withdraws
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la récupération des retraits utilisateur',
                error: error.message
            };
        }
    }

    // Lire un retrait par ID
    async getWithdrawById(id) {
        try {
            const withdraw = await Withdraw.findById(id).populate('userId', 'name email');
            
            if (!withdraw) {
                return {
                    success: false,
                    message: 'Retrait non trouvé'
                };
            }
            
            return {
                success: true,
                message: 'Retrait récupéré avec succès',
                data: withdraw
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la récupération du retrait',
                error: error.message
            };
        }
    }

    // Modifier un retrait
    async updateWithdraw(id, updateData) {
        try {
            const updatedWithdraw = await Withdraw.findByIdAndUpdate(
                id,
                updateData,
                { 
                    new: true,
                    runValidators: true
                }
            ).populate('userId', 'name email');
            
            if (!updatedWithdraw) {
                return {
                    success: false,
                    message: 'Retrait non trouvé'
                };
            }
            
            return {
                success: true,
                message: 'Retrait mis à jour avec succès',
                data: updatedWithdraw
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la mise à jour du retrait',
                error: error.message
            };
        }
    }

    // Supprimer un retrait
    async deleteWithdraw(id) {
        try {
            const deletedWithdraw = await Withdraw.findByIdAndDelete(id);
            
            if (!deletedWithdraw) {
                return {
                    success: false,
                    message: 'Retrait non trouvé'
                };
            }
            
            return {
                success: true,
                message: 'Retrait supprimé avec succès',
                data: deletedWithdraw
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la suppression du retrait',
                error: error.message
            };
        }
    }

    // ============= MÉTHODES UTILITAIRES =============

    // Récupérer toutes les transactions d'un utilisateur (dépôts + retraits)
    async getAllTransactionsByUserId(userId) {
        try {
            const deposits = await Deposit.find({ userId }).sort({ createdAt: -1 });
            const withdraws = await Withdraw.find({ userId }).sort({ createdAt: -1 });
            
            // Ajouter un type pour différencier les transactions
            const depositsWithType = deposits.map(d => ({ ...d.toObject(), type: 'deposit' }));
            const withdrawsWithType = withdraws.map(w => ({ ...w.toObject(), type: 'withdraw' }));
            
            // Fusionner et trier par date
            const allTransactions = [...depositsWithType, ...withdrawsWithType]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            return {
                success: true,
                message: 'Transactions de l\'utilisateur récupérées avec succès',
                count: allTransactions.length,
                data: allTransactions
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la récupération des transactions',
                error: error.message
            };
        }
    }

    // Statistiques des transactions par statut
    async getTransactionStats() {
        try {
            const depositStats = await Deposit.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$montant' } } }
            ]);
            
            const withdrawStats = await Withdraw.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$montant' } } }
            ]);
            
            return {
                success: true,
                message: 'Statistiques récupérées avec succès',
                data: {
                    deposits: depositStats,
                    withdraws: withdrawStats
                }
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors du calcul des statistiques',
                error: error.message
            };
        }
    }
}

module.exports = new TransactionController();