const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Serveur Y-Shop lancé sur : http://localhost:${PORT}`);
    console.log(`les images accessibles ici : http://localhost:3000/images/nom_de_ton_image.png`);
});