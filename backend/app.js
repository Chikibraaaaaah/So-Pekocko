// Importation des différents modules, fichiers

// Création de l'app
const express = require('express');
const app = express();

// Permet d'intercepter les données envoyées par le front
const bodyParser = require('body-parser');

//BDD
const mongoose = require('mongoose');

// Routes
const userRoutes = require('./routers/user');
const sauceRoutes = require('./routers/sauce');

// Path va permettre de créer un chemin vers un fichier défini, pour stocker les images transmises via multer

const path = require('path');

//  --------------------------------------------- SECU

// Protection des en-têtes
const helmet = require('helmet');

// Création de cookies de session avec id
const session = require('express-session');
const cookieParser= require('cookie-parser');

// Ajout d'un token au cookie
const csrf = require('csurf');

// Limiter les actions contre force brute
const rateLimit = require('express-rate-limit');

// Configuration pour utiliser les infos du fichier .env
require('dotenv').config();

// Connexion à la BDD
mongoose.connect(`mongodb+srv://${process.env.DB_userName}:${process.env.DB_password}@cluster0.mjwgh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  // Définition des headers.
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  // Nous allons interagir avec les données envoyées par le front, il faut donc pouvoir les interpreter
  app.use(bodyParser.json());

  // Configuration de la limitation du nb d'actions pour force brute
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  // Création d'une session de navigation
  app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SECRET,
      cookie: {
        httpOnly: true, 
        secure: false, 
        maxAge: 7200000,
        sameSite: true
      }
  }));
  // ajout du token a cookie
  csrfProtection = csrf({ cookie: true })

  // il faut parser le cookie pour verifier le token
  app.use(cookieParser())

  app.get('/signup', csrfProtection, function (req, res) {
    // pass the csrfToken to the view
    res.render('send', { csrfToken: req.csrfToken() })
  })

  app.set('trust proxy', 1);
  app.use(helmet());
  // Liaison entre le fichier créé localement 'Images', et les images reçues via l'application
  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use('/api/auth', userRoutes);
  app.use('/api/sauces', sauceRoutes);

module.exports = app;