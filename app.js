console.log('bonjour Julie');
console.log(__dirname);

/////////////////////////////////////////////////
// VARIABLES D'ENVIRONNEMENT
/////////////////////////////////////////////////

// dotenv
// Ne pas utiliser de fichiers .env dans votre environnement de production, 
// mais définir plutôt les valeurs directement sur l'hôte correspondant.
require('dotenv').config();
console.log(process.env.PORT);


/////////////////////////////////////////////////
// APPELS DES MODULES DANS DES VARIABLES
/////////////////////////////////////////////////

// EXPRESS
//// Appeler le module express
const express = require('express');

// BODY-PARSER
const bodyparser = require('body-parser');

// EXPRESS-SESSION
const session = require ('express-session');


/////////////////////////////////////////////////
// MIDDLEWARE 
// INITIALISER LES MODULES DANS LE PROJET APP
/////////////////////////////////////////////////

// EXPRESS
//// app etant la variable qui désigne le projet
const app = express();

// BODY-PARSER
//// Pour la méthode post du formulaire
app.use(bodyparser.urlencoded({ extended: false}));
app.use(bodyparser.json());

// EXPRESS-SESSION
//// cela créé un fichier dans la mémoire de l'ordi du user avec les informations saisies
//// variable "secure" pour définir l'environnement de prod ou non , car en prod on sera en https et on mettra "cookie" à secure: true
const secure = (process.env.ENVIR=="PROD");
app.use(session({
    secret: 'codesecret',
    resave: false,
    saveUninitialized: true,
    // si on était en httpS on devrait mettre secure à true
    cookie: {secure: secure}
}));

/////////////////////////////////////////////////
// MOTEUR DE TEMPLATE HTML
/////////////////////////////////////////////////

// appeler le moteur de template html ejs
app.set('view engine', 'ejs');
// le répertoire dans lequel se trouvent les fichiers modèles
app.set('views', './views')


/////////////////////////////////////////////////
// ASSETS (de Express)
/////////////////////////////////////////////////
// donner au programme le nom du dossier où sont les assets (css, image...)
// Le chemin d’accès que vous fournissez à la fonction express.static est en rapport 
// avec le répertoire à partir duquel vous lancez votre processus node. 
// Si vous exécutez l’application express à partir d’un autre répertoire, 
// il est plus sûr d’utiliser le chemin d’accès absolu que vous voulez servir
// ex : http://localhost:8080/assets/images/kitten.jpg
app.use('/public', express.static('public'));

/////////////////////////////////////////////////
// ROUTES
/////////////////////////////////////////////////
// localhost:8888/inscription/adhesion
// localhost:8888/inscription/concert8mai

// appeler la route pour les inscriptions
const inscriptionRouter = require("./routes/inscriptionRouter");

app.use("/inscription", inscriptionRouter);


/////////////////////////////////////////////////
// PORT D'ÉCOUTE WEB
/////////////////////////////////////////////////

// port dans variable d'environnement OU (||) par défaut 8888
const port = process.env.PORT || 8888;
app.listen(port);

