// routes/categories.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. Route GET : on recupere toutes les categories
// url finale : http://localhost:3000/api/categories

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories');
        res.json(rows); // On renvoie les données au format JSON
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Route POST : creation de categories
// url finale : http://localhost:3000/api/categories
router.post('/', async (req, res) => {
    const { name } = req.body; // on recup le nom envoye par le frontend

    // Validation simple
    if (!name) {
        return res.status(400).json({ error: "Nom manquant"});
    }
    try {
        // requete avec ?
        const sql = 'INSERT INTO categories (name) VALUES (?)';

        // On exécute la requête en remplaçant le "?" par la variable "name"
        const [result] = await db.query(sql, [name]);

        // On revoie l'id de la categorie creee
        res.status(201).json({ id: result.insertId, name: name});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

module.exports = router; // On exporte ce routeur pour l'utiliser dans server.js