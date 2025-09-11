const Produit = require('../models/Produit');

exports.createProduit = async (req, res) => {
  try {
    const produit = new Produit(req.body);
    await produit.save();
    res.status(201).json(produit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProduits = async (req, res) => {
  try {
    const produits = await Produit.find();
    res.json(produits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProduit = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ error: 'Not found' });
    res.json(produit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduit = async (req, res) => {
  try {
    const produit = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!produit) return res.status(404).json({ error: 'Not found' });
    res.json(produit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProduit = async (req, res) => {
  try {
    const produit = await Produit.findByIdAndDelete(req.params.id);
    if (!produit) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
