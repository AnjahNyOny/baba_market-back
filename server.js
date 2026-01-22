// server.js
const express = require('express');
const cors = require('cors');

const path = require('path');

const db = require('./db'); // On importe notre connexion db.js
const app = express();
const PORT = process.env.PORT || 3000;


const categoriesRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');


// Middleware
app.use(cors()); // Autorise le frontend à nous parler
app.use(express.json()); // Permet de lire le JSON envoyé dans le corps des requêtes (req.body)

// Si quelqu'un demande "http://localhost:3000/uploads/image.jpg", le serveur va chercher dans le dossier
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/products', productRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});