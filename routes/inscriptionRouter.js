console.log('fichier inscriptionRouter.js');

const express = require('express');
const router = express.Router();


const {
    checkMail,
    post_form_adhesion,
    post_form_montant_total
} = require("../controllers/adhesionController");


/////////////////////////////////////////////////
// GET URL http://localhost:8888/inscription/adhesion
/////////////////////////////////////////////////
// si l'URL est appelé on lui envoie la page html formulaire_adhesion_mail.ejs (c'est un template)
// GET est la "req" (la requête)
router.get('/adhesion', function(req, res) {

    if (req.session.err_mail_form_adhesion_1) {
        res.locals.err_mail_form_adhesion_1 = req.session.err_mail_form_adhesion_1;
        res.locals.err_mail_form_adhesion_2 = req.session.err_mail_form_adhesion_2;
        res.locals.err_mail_form_adhesion_3 = req.session.err_mail_form_adhesion_3;
        // on peut supprimer le contenu après affichage
        req.session.err_mail_form_adhesion = undefined;
    }

    if (req.session.identifiant) {
        res.locals.identifiant = req.session.identifiant;
    }

    res.render('page_templates/formulaire_adhesion_mail');
});


/////////////////////////////////////////////////
// VERIFICATION DU MAILcheckMail
// METHODE HTTP POST
/////////////////////////////////////////////////
router.post('/adhesion', checkMail);

/////////////////////////////////////////////////
// OUVRIR LA PAGE DE SAISIE DES INFORMATIONS
// APRÈS VALIDATION DU MAIL
/////////////////////////////////////////////////
router.get('/adhesion_prof', function(req, res) {
    res.locals.identifiant = req.session.identifiant;
    res.locals.adherent_nom = req.session.adherent_nom;
    res.render('page_templates/formulaire_adhesion_prof');
});

/////////////////////////////////////////////////
// POST ENREGISTRER INFOS DANS GOOGLE SHEET
/////////////////////////////////////////////////
router.post('/adhesion_prof', post_form_adhesion);



/////////////////////////////////////////////////
// PAGE DE PAIEMENT
// 
/////////////////////////////////////////////////
router.get('/adhesion_paiement', function(req, res) {
    console.log ("on est dans la ROUTE /adhesion page_templates/adhesion_paiement.ejs");
    res.locals.identifiant = req.session.identifiant;
    res.locals.adherent_paiement_montant_adhesion = req.session.adherent_paiement_montant_adhesion
    res.locals.montant_apayer = req.session.montant_apayer
    console.log("ROUTER req.session.montant_apayer: ", req.session.montant_apayer)
    res.render('page_templates/adhesion_paiement.ejs');
});
router.post('/adhesion_paiement', post_form_montant_total);




module.exports = router;

