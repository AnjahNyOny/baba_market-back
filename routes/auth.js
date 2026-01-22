// routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. ROUTE REGISTER (Inscription - À utiliser juste une fois pour créer ton compte)
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    try {
        // Hachage du mot de passe (10 tours de mélange)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertion dans la base
        const sql = 'INSERT INTO admins (email, password_hash) VALUES (?, ?)';
        await db.query(sql, [email, hashedPassword]);

        res.status(201).json({ message: "Admin créé avec succès !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. ROUTE LOGIN (Connexion)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // A. On cherche l'utilisateur par son email
        const [users] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        const user = users[0];

        // B. On compare le mot de passe envoyé avec le hash en base
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        // C. Si tout est bon, on génère le TOKEN (Le badge)
        const token = jwt.sign(
            { id: user.id, email: user.email }, // Ce qu'il y a dans le badge
            process.env.JWT_SECRET,             // La clé de signature
            { expiresIn: '24h' }                // Validité du badge
        );

        res.json({ message: "Connexion réussie", token: token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;