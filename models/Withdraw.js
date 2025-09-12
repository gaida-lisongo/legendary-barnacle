const mongoose = require('mongoose');

const withdrawSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent', // Référence vers le modèle User
        required: true,
        index: true
    },
    montant: {
        type: Number,
        required: true,
        min: [0.01, 'Le montant doit être supérieur à 0'],
        validate: {
            validator: function(value) {
                return Number.isFinite(value) && value > 0;
            },
            message: 'Le montant doit être un nombre valide et positif'
        }
    },
    orderNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    reference: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    status: {
        type: String,
        enum: {
            values: ['NO', 'PENDING', 'OK'],
            message: 'Le statut doit être NO, PENDING ou OK'
        },
        default: 'PENDING',
        required: true
    }
}, {
    timestamps: true // Ajoute createdAt et updatedAt
});

// Index composé pour améliorer les performances
withdrawSchema.index({ userId: 1, status: 1 });
withdrawSchema.index({ orderNumber: 1 });
withdrawSchema.index({ createdAt: -1 });

// Méthode virtuelle pour le montant formaté
withdrawSchema.virtual('montantFormate').get(function() {
    return `${this.montant.toFixed(2)} €`;
});

const Withdraw = mongoose.model('Withdraw', withdrawSchema);

module.exports = Withdraw;