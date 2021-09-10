const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.createYourSauce = (req, res, next) => {

    // Création d'un objet sauce avec les infos transmises par le front. Parmi ces infos, il y aura un id qui est diiférent de celui généré par le back. On va donc le supprimer

    const sauceObject = JSON.parse(req.body.sauce);

    delete sauceObject._id;

    // Utilisation du spread pour remplir les champs requis, dont les infos proviennent du front
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    // Sauvegarde de l'utilisateur
    sauce.save()
    .then( () => res.status(201).json({message: 'Utilisateur créé'}))
    .catch( error => res.status(400).json({ error }))
};

exports.modifyYourSauce = (req, res, next) => {

    // Recherchons la sauce que l'on souhaite modifier
    Sauce.findOne({_id: req.params.id})
    .then( sauce => {
        
        // Suite aux modifications, l'objet sauce contient-il un nouveau fichier ? 
        const sauceObject = req.file ?
        
        {...JSON.parse(req.body.sauce),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
         } : {...req.body} 

         // Si oui, alors on va délier l'ancien afin de ne pas stocker d'images encombrantes et on récupère les infos au cas où le texte ait également changé.
         if(sauceObject.imageUrl !== undefined){
            const imageSauce = sauce.imageUrl.split('/images')[1];
            fs.unlink(`images/${imageSauce}`, () => {
                Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
         .then( () => res.status(200).json({message: "Sauce modifiée"}))
         .catch( error => res.status(400).json({ error }))
            })
            // Sinon, on met à jour les infos avec les nouvelles infos du front
         }else{
            Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
         .then( () => res.status(200).json({message: "Sauce modifiée"}))
         .catch( error => res.status(400).json({ error }))
         }
    })
    .catch( error => res.status(404).json({ error }))
};

exports.deleteYourSauce = (req, res, next) => {
    // Récupération de la sauce à supprimer grâce à son id
    Sauce.findOne({_id: req.params.id})
    .then( sauce => {
        // Récupération de son visuel pour le supprimer également
        const imageSauce = sauce.imageUrl.split('/images')[1];
        fs.unlink(`images/${imageSauce}`, () => {
            Sauce.deleteOne({_id: req.params.id})
            .then( () => res.status(200).json({message: 'Sauce supprimée avec succès'}))
            .catch( error => res.status(500).json( error ))
        })
    })
    .catch( error => res.status(400).json({ error }))
};

exports.getOneSauce = (req, res, next) => {
    // Récupération de la sauce via son id
    Sauce.findOne({_id: req.params.id})
    .then( sauce => {
        res.status(200).json( sauce )
    })
    .catch( error => res.status(404).json({ error }))
};

exports.getAllSauces = (req, res, next) => {
    //  Sans paramètres, retourne tous les éléments 
    Sauce.find()
    .then( sauces => {
        res.status(200).json( sauces );
    })
    .catch( error => res.status(400).json({ error }))
};

exports.likeCtrl = (req, res, next) => {

    // Il faut retrouver la sauce concernée par like/dislike
    Sauce.findOne({_id: req.params.id})
    .then( sauce => {

        /* Plusieurs possibilités:

        -1 =  dislike,

        0 => deux possibilités 
        -1 => 0 : L'utilisateur enlève son dislike,
        1 => 0 : l'utilisateur enlève son like

        1 = ajout d'un like */

        switch(req.body.like){

            // L'utilisateur ajoute un dislike à la sauce
            case -1:
                Sauce.updateOne({_id: req.params.id}, {
                    $inc: {dislikes: 1},
                    $push: {usersDisliked: req.body.userId},
                    _id: req.params.id
                })
                .then( () => res.status(201).json({message: "Vous n'aimez pas " + sauce.name}))
                .catch( error => res.status(400).json({ error }));
                break;

                // L'utilisateur enlève son dislike
                case 0 :
                // Il faut également le retiré du tableau usersDisliked
                    if(sauce.usersDisliked.find( user => user == req.body.userId)){
                        Sauce.updateOne({_id: req.params.id}, {
                            $inc: {dislikes: -1},
                            $pull: {usersDisliked: req.body.userId},
                            _id: req.params.id
                        })
                        .then( () => res.status(200).json({message: "Dislike retiré de " + sauce.name}))
                        .catch( error => res.status(500).json({ error }))
                    };

                    // L'utilisateur enlève son like, le retirer du tableau usersLiked
                    if(sauce.usersLiked.find( user => user == req.body.userId)){
                        Sauce.updateOne({_id: req.params.id}, {
                            $inc: {likes: -1},
                            $pull: {usersLiked: req.body.userId},
                            _id: req.params.id
                        })
                        .then( () => res.status(200).json({message: "Vous n'aimez plus " + sauce.name}))
                        .catch( error => res.status(500).json({ error }))
                    };

                    break;

                    // Ajout d'un like
                    case 1: 
                    Sauce.updateOne({_id: req.params.id}, {
                        $inc: {likes: 1},
                        $push: {usersLiked: req.body.userId},
                        _id: req.params.id
                    })
                    .then( () => res.status(200).json({message: 'Vous aimez ' + sauce.name}))
                    .catch( error => res.status(500).json({ error }))

                    break;

                    default:
                        return res.status(400).json({message: "Action non possible"});
        }
    }) 
    .catch( error => res.status(404).json({ error }))
};