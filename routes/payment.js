const express = require('express');
const router = express.Router();
const Commande = require('../models/Commande');
const moneyManager = require('../service/MoneyManager');
const Fiche = require('../models/Fiche');
const Etudiant = require('../models/Etudiant');

router.post('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { matricule, nom, telephone, email } = req.body;
  
      const commande = await Commande.findById(id);
      if (!commande) {
        return res.status(404).json({ error: 'Not found' });
      }
      console.log("Current commande:", commande.toObject());
  
      const data = await moneyManager.createTransaction({
        amount: commande.montant,
        currency: commande.currency,
        reference: `${nom}:${email}`,
        phone: telephone
      });
  
      console.log("Response Data : ", data);
  
      if (!data.orderNumber) {
        return res.status(501).json({ error: data.message });
      }
  
      const commandeUpdate = await Commande.findByIdAndUpdate(
        id,
        {
          reference: data.orderNumber,
          matricule,
          telephone,
          status: "PENDING"
        },
        { new: true }
      );
  
      console.log("CommandeUpdate :", commandeUpdate.toObject());
  
      res.json({
        success: true,
        data: commandeUpdate.toObject()
      });
    } catch (error) {
      console.error('Error when creating payment commande :', error);
      res.status(500).json({ error: error.message });
    }
});
  
router.post('/fiche/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { matricule, nom, telephone, email } = req.body;

    const fiche = await Fiche.findById(id);
    if (!fiche) {
      return res.status(404).json({ error: 'Not found' });
    }
    console.log("Current fiche:", fiche.toObject());

    const data = await moneyManager.createTransaction({
      amount: 1500,
      currency: "CDF",
      reference: `${nom}:${email}`,
      phone: telephone
    });

    console.log("Response Data : ", data);

    if (!data.orderNumber) {
      return res.status(501).json({ error: data.message });
    }

    const etudiant = await Etudiant.findOne({ matricule });
    if (!etudiant) {
      return res.status(404).json({ error: 'Not found' });
    }

    const ficheUpdate = await Fiche.findByIdAndUpdate(
      id,
      {
        reference: data.orderNumber,
        etudiantId: etudiant._id,
        status: "PENDING"
      },
      { new: true }
    );

    console.log("FicheUpdate :", ficheUpdate.toObject());

    res.json({
      success: true,
      data: ficheUpdate.toObject()
    });
  } catch (error) {
    console.error('Error when creating payment fiche :', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/success', async (req, res) => {
    try {
        console.log("Request data", req)
    } catch (error) {
        console.error('Error when getting info payment commande :', error);
        res.status(500).json({ error: error.message})
        
    }
})

router.get('/:orderNumber', async (req, res) => {
    try {
        const { orderNumber } = req.params;

        const data = await moneyManager.checkTransaction({
            orderNumber
        });

        console.log("Response Data : ", data);

        res.status(200).json({success: true, message: data.message, data: data.transaction});
    } catch (error) {
        console.error('Error when creating payment commande :', error);
        res.status(500).json({ error: error.message})
        
    }
});

module.exports = router