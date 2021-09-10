
const passwordSchema = require('../models/Password');

// Création d'un modèle de password afin de limiter les attaques par injection

module.exports = (req, res, next) => {
    if(!passwordSchema.validate(req.body.password)){
        res.writeHead(400, "{'message' : 'Votre mot de passe doit comporter au moins 8 caractères, dont 1 chiffre, une majuscule, un caractère spécial, et aucun espace'}", 
        {'content-type' : 'application/json'});
        res.end('Format de mot de passe incorrect')
    }else{
        next()
    }
};