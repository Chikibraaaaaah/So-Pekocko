const passwordValidator = require('password-validator');
const passwordSchema = new passwordValidator();

// Création du modèle de password

passwordSchema
.has().uppercase() // au moins 1 majuscule
.has().lowercase()  // au moins minuscule
.is().min(8) // longueur minimum de 8 caractères
.has().digits() // au moins un chiffre
.has().symbols()  // au moins un caractère spécial
.is().max(20) // longueur max 20 caractères

module.exports = passwordSchema;
