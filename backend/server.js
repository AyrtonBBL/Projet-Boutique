const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 3000;

// Autorise Kyky à se connecter à l' API
app.use(cors());

app.use(express.json());

// Utilise les routes définies dans api.js
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});