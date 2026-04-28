const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/products.json');

const readData = () => {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
};

// C la route pour récupérer TOUTES les cartes
router.get('/products', (req, res) => {
    const products = readData();
    res.json(products);
});

// la 2eme route pour récupérer UNE seule carte par ID
router.get('/products/:id', (req, res) => {
    const products = readData();
    const product = products.find(p => p.id === req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: "Carte non trouvée" });
});

// la 3eme route pour ACHETER 
router.post('/buy', (req, res) => {
    const { id, quantity } = req.body;
    let products = readData();
    
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex !== -1) {
        if (products[productIndex].stock >= quantity) {
            products[productIndex].stock -= quantity;
            
            fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
            
            res.json({ message: "Achat réussi !", newStock: products[productIndex].stock });
        } else {
            res.status(400).json({ message: "Stock insuffisant mon vitoSan !" });
        }
    } else {
        res.status(404).json({ message: "Produit introuvable VitoSan pardonnez moi pitié" });
    }
});

module.exports = router;