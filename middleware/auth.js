// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // 1. On récupère le token dans l'en-tête de la requête
        // Le format standard est : "Authorization: Bearer <TOKEN>"
        const token = req.headers.authorization.split(' ')[1];

        // 2. On vérifie si le token est valide avec notre clé secrète
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // 3. On ajoute les infos de l'utilisateur à la requête (req.auth)
        // Comme ça, les routes suivantes sauront qui est connecté
        req.auth = { userId: decodedToken.id };

        // 4. Tout est bon, on laisse passer !
        next();
    } catch (error) {
        // Si le token est faux, expiré ou absent : 401 (Non autorisé)
        res.status(401).json({ error: 'Requête non authentifiée !' });
    }
};