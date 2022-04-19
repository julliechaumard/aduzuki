console.log('fichier inscriptionRouter.js');

const express = require('express');
const router = express.Router();


const {
    checkMail,
    post_form_adhesion
} = require("../controllers/adhesionController");


/////////////////////////////////////////////////
// GET URL http://localhost:8888/inscription/adhesion
/////////////////////////////////////////////////
// si l'URL est appelé on lui envoie la page html formulaire_adhesion_mail.ejs (c'est un template)
// GET est la "req" (la requête)
router.get('/adhesion', function(req, res) {

    if (req.session.err_mail_form_adhesion) {
        res.locals.err_mail_form_adhesion = req.session.err_mail_form_adhesion;
        // on peut supprimer le contenu après affichage
        req.session.err_mail_form_adhesion = undefined;
    }
    if (req.session.complete_mail_form_adhesion) {
        res.locals.complete_mail_form_adhesion = req.session.complete_mail_form_adhesion;
        // on peut supprimer le contenu après affichage
        req.session.complete_mail_form_adhesion = undefined;
    }
    if (req.session.mail) {
        res.locals.mail = req.session.mail;
        // on peut supprimer le contenu après affichage
        req.session.mail = undefined;
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
    

    res.locals.mail = req.session.mail;
    res.render('page_templates/formulaire_adhesion_prof');
});

/////////////////////////////////////////////////
// POST ENREGISTRER INFOS DANS GOOGLE SHEET
/////////////////////////////////////////////////
router.post('/adhesion_prof', post_form_adhesion);

module.exports = router;

