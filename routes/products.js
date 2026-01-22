// routes/products.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

// --- CONFIGURATION DE L'UPLOAD (MULTER) ---
// On définit où et comment stocker les fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // On stocke dans le dossier 'uploads' créé
    },
    filename: (req, file, cb) => {
        // On renomme le fichier pour éviter les doublons (ex: mon-image.jpg devient 167234234-mon-image.jpg)
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// --- ROUTES ---

// 1. GET : Récupérer tous les produits (avec le nom de leur catégorie)
router.get('/', async (req, res) => {
    try {
        // On fait une JOINTURE (JOIN) pour récupérer le nom de la catégorie en même temps que le produit
        const sql = `
            SELECT products.*, categories.name as category_name 
            FROM products 
            LEFT JOIN categories ON products.category_id = categories.id
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. POST : Créer un produit AVEC une image
// 'upload.single("image")' signifie qu'on attend un fichier dans le champ nommé "image"
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        // Multer a traité l'image, on a accès à req.file
        // Express a traité le texte, on a accès à req.body
        const { name, description, price, stock_quantity, category_id } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        if (!name || !price || !category_id) {
            return res.status(400).json({ error: "Champs obligatoires manquants (Nom, Prix, Catégorie)" });
        }

        const sql = `
            INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [name, description, price, stock_quantity, category_id, image_url]);

        res.status(201).json({ message: "Produit créé !", productId: result.insertId });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;