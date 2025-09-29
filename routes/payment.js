const express = require('express');
const router = express.Router();
const Commande = require('../models/Commande');
const moneyManager = require('../service/MoneyManager');
const Fiche = require('../models/Fiche');
const Etudiant = require('../models/Etudiant');
const Resultat = require('../models/Resultat');
const Recours = require('../models/Recours');

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

router.post('/resultat/:classeId', async (req, res) => {
    try {
        const { matricule, telephone } = req.body;
        const { classeId } = req.params;
        
        const etudiant = await Etudiant.findOne({ matricule });
        if (!etudiant) {
            return res.status(404).json({ error: 'Not found' });
        }

        const data = await moneyManager.createTransaction({ 
          amount: 3000, 
          currency: "CDF", 
          reference: `${etudiant.nom}:${etudiant.email}`, 
          phone: telephone 
        });
        
        if (!data.orderNumber) {
          return res.status(501).json({ error: data.message });
        }

        const resultat = new Resultat({ 
          classeId,
          etudiantId: etudiant._id, 
          telephone,
          reference: data.orderNumber,
          montant: 3000,
          currency: "CDF", 
          status: "NO"
        });

        const resultatSave = await resultat.save();
        res.json({ 
          success: true, 
          message: 'Resultat created successfully', 
          data: {
            etudiant: etudiant.toObject(),
            resultat: resultatSave.toObject()
          } 
        });
        
    } catch (error) {
        console.error('Error when creating payment resultat :', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/recours/:etudiantId', async (req, res) => {
  try {
    const { etudiantId } = req.params;
    const { noteId, object, telephone } = req.body;
    
    const etudiant = await Etudiant.findById(etudiantId).lean();
    if (!etudiant) {
      return res.status(404).json({ error: 'Not found' });
    }

    const data = await moneyManager.createTransaction({ 
      amount: 1500, 
      currency: "CDF", 
      reference: `${etudiant.nom}:${etudiant.email}`, 
      phone: telephone 
    });
    
    if (!data.orderNumber) {
      return res.status(501).json({ error: data.message });
    }

    const recours = new Recours({ 
      etudiantId: etudiant._id, 
      noteId,
      reference: data.orderNumber,
      object
    });

    const recoursSave = await recours.save();
    res.json({ 
      success: true, 
      message: 'Recours created successfully', 
      data: recoursSave.toObject()
    });
    
  } catch (error) {
    console.error('Error when creating payment recours :', error);
    res.status(500).json({ error: error.message });
  }
})

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