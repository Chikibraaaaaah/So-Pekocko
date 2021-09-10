const jwt = require('jsonwebtoken');

// Création à l'aide de jsonwebtoken d'un token d'authentification qui sera nécessaire pour chaque requête

module.exports = (req, res, next) => {

    try{
        // Récupération du token d'authentification
        const token = req.headers.authorization.split(' ')[1];
        // Décryptage du token et comparaison de la clé 
        const decodedToken = jwt.verify(token, 'SeCrEtBlA');
        const userId = decodedToken.userId;

        if(req.body.userId && req.body.userId !== userId ){
            throw 'Requête non authentifiée'
        }else{
            next()
        }
    }catch{
        res.status(401).json({error : new Error ('Requête invalide')})
    }

};