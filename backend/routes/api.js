const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/products.json');

const readData = () => {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
};

router.get('/products', (req, res) => {
    const products = readData();
    res.json(products);
});

router.get('/products/:id', (req, res) => {
    const products = readData();
    const product = products.find(p => p.id === req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: "Carte non trouvée" });
});

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

router.post('/checkout', (req, res) => {
    const cart = req.body.cart;
    let products = readData();
    let allValid = true;

    for (let item of cart) {
        const product = products.find(p => p.id === item.id);
        if (!product || product.stock < item.quantity) {
            allValid = false;
            break;
        }
    }

    if (allValid) {
        for (let item of cart) {
            const productIndex = products.findIndex(p => p.id === item.id);
            products[productIndex].stock -= item.quantity;
        }
        fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
        res.json({ message: "Commande validée avec succès !" });
    } else {
        res.status(400).json({ message: "Erreur de stock lors de la validation." });
    }
});

module.exports = router;