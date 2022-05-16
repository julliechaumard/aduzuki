console.log('fichier inscriptionRouter.js');

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const moment = require('moment');


const {
    checkMail,
    post_form_adhesion,
    post_form_montant_total,
    post_paiement_cheque_save,
    post_paiement_virement_save
} = require("../controllers/adhesionController");

const {
    post_req_bank,
    get_res_bank,
    get_res_bank_annul
} = require("../controllers/stripeController");

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
        res.locals.err_mail_form_adhesion_4 = req.session.err_mail_form_adhesion_4;
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
router.get('/adhesion_paiement_total', function(req, res) {
    console.log ("on est dans la ROUTE /adhesion page_templates/adhesion_paiement_total.ejs");
    res.locals.identifiant = req.session.identifiant;
    res.locals.adherent_paiement_montant_adhesion = req.session.adherent_paiement_montant_adhesion

    res.render('page_templates/adhesion_paiement_total.ejs');
});
router.post('/calcul_total', post_form_montant_total);

router.get('/adhesion_paiement_mode_paiement', function(req, res) {
    console.log ("on est dans la ROUTE /adhesion page_templates/adhesion_paiement/mode_paiement.ejs");
    res.locals.identifiant = req.session.identifiant;
    res.locals.adherent_paiement_montant_adhesion = req.session.adherent_paiement_montant_adhesion
    res.locals.montant_apayer = req.session.montant_apayer;
    res.locals.montant_apayer_cent = req.session.montant_apayer_cent;
    res.locals.adherent_paiement_montant_don = req.session.adherent_paiement_montant_don;
    console.log("ROUTER req.session.montant_apayer: ", req.session.montant_apayer)
    res.render('page_templates/adhesion_paiement_mode_paiement.ejs');
});

//router.post('/adhesion_paiement/total', post_form_montant_total);
router.post('/goto_bank', post_req_bank);
router.post('/paiement_cheque_save', post_paiement_cheque_save);
router.post('/paiement_virement_save', post_paiement_virement_save);



router.get('/adhesion_paiement/attente', function(req, res) {
    console.log ("on est dans la ROUTE /adhesion_paiement/attente");
    moment().format();
    moment.locale('fr');
    var date_formattee = moment().format('L')
    res.locals.today = date_formattee;
    res.locals.identifiant = req.session.identifiant;
    res.locals.profil1 = req.session.profil1;
    res.locals.profil2 = req.session.profil2;
    res.locals.profil3 = req.session.profil3;
    res.locals.adherent_paiement_mode = req.session.adherent_paiement_mode;
    res.locals.adherent_paiement_montant_total = req.session.montant_apayer
    res.render('page_templates/adhesion_paiement_attente.ejs');
});


router.get('/adhesion_paiement/reussi', get_res_bank);
router.get('/adhesion_paiement/annule', get_res_bank_annul);


router.get('/adhesion_paiement/attente', function(req, res) {
    console.log ("on est dans la ROUTE /adhesion_paiement/attente"); 
    res.render('page_templates/adhesion_paiement_attente.ejs');
});

router.get('/adhesion_paiement/traitement', function(req, res) {
    console.log ("on est dans la ROUTE /adhesion_paiement/traitement");
    
    res.render('page_templates/formulaire_adhesion_mail.ejs');
});

module.exports = router;

