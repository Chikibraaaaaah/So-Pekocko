const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sign } = require('crypto');

exports.signup = (req, res, next) => {
    // Utilisattion de bcrypt pour hasher le mot de passe
    bcrypt.hash(req.body.password, 10)
    // Va nous retourner un hash qui nous ervira de mot de passe pour l'objet user créé
    .then( hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        // Sauvegarde du user 
        user.save()
        .then( () => res.status(201).json({message: 'Utilisateur créé'}))
        .catch( error => res.status(401).json({ error }))
    })
    .catch( error => res.status(400).json({ error }))
};

exports.login = (req, res, next) => {
    // email unique, donc recherche par cette clé
    User.findOne({email: req.body.email})
    .then( user => {
        // Si aucun user avec ce mail
        if(!user){
            return res.status(401).json({message: "Adresse mail inconnue"})
        }
        // Comparaison à l'aide de bcrypt du mp
        bcrypt.compare(req.body.password, user.password)
        .then( valid => {
            // Si l'element ne correspond pas, mot de passe incorrect
            if(!valid){
                return res.status(401).json({message: "Mot de passe incorrect"});
            }
            // mot de passe est bon, on lui ajoute d'un token d'authentifacation qui sera requis pour le requete
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id},
                    'SeCrEtBlA',
                    {expiresIn: '24h'}
                )
            })
        })
        .catch( error => res.status(401).json({ error }))
    })
    .catch( error => res.status(401).json({ error }))
};