const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    // UserId du createur généré par le back
    userId: {type: String, required: true},
    // Nom de la sauce reçue par le front
    name: {type: String, required: true,},
    // Créateur de la sauce par le front
    manufacturer: {type: String, required: true,},
    // description de la sauce par le front
    description: {type: String, required: true,},
    // Ingredients qui pimentent la sauce par le front
    mainPepper: {type: String, required: true,},
    // Adresse de l'image de presentation de la sauce par le front
    imageUrl: {type: String, required: true},
    // Force le piquant de la sauce généré par le back
    heat: {type: Number, required: true},
    // nombre de Like reçu généré par le back
    likes: {type: Number},
    // nombre de dislike reçu généré par le back
    dislikes: {type: Number},
    // Utilisateurs qui Like la sauce généré par le back
    usersLiked: {type: [String]},
    // Utilisateur qui DisLike la sauce généré par le back
    usersDisliked: {type: [String]},
})

module.exports = mongoose.model('Sauce', sauceSchema);