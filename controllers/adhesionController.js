// le controller est chargé du traitement des routes
const moment = require('moment');
/////////////////////////////////////////////////
// GOOGLE SHEET PARAMETERS
/////////////////////////////////////////////////
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../testapi336520-3105cc3caa46.json');
// Initialize the sheet - doc ID is the long id in the sheets URL
// google sheet TestAPISheets
//const doc = new GoogleSpreadsheet('1gULmI-fWtc_32QOMjai9g5juQEVwCuh31qwqbBst5cY');
// google sheet aduzuki_DB
const doc = new GoogleSpreadsheet('1BhpYj-KtsyC8inXIDVl-zldDYRuhEqPwBFvP45FtJkI');

// test d'import d'un fichier externe
// const {
 //   traitement_apres_paiement,
//    traitement2
//} = require("../services/paiement");


/////////////////////////////////////////////////
// SAISIE DU MAIL
// VÉRIFIER SI DÉJÀ INSCRIT DANS GOOGLE
/////////////////////////////////////////////////
const checkMail = async function(req, res){
    console.log("======================================");
    console.log("======== FUNCTION checkMail ==========");
    console.log("======================================");

        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo(); // loads document properties and worksheets
        console.log("NOM FICHIER SHEET: ",doc.title); //nom du fichier
        
        //const sheet = doc.sheetsByIndex[1]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
        //var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("feuilleTOTO");
        // const sheet = doc.sheetsByTitle['feuilleTOTO']; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
        const sheet = doc.sheetsByTitle['adhesion_annuelle_web'];
        console.log("NOM DU TABLEAU (ONGLET): ",sheet.title); //NOM DU TABLEAU (ONGLET)
        console.log("NOMBRE DE LIGNE DU TABLEAU: ",sheet.rowCount); // NOMBRE DE LIGNE DU TABLEAU
    

  
        const rows = await sheet.getRows();
        //console.info(rows);
        console.log("rows[0].identifiant: ", rows[0].identifiant);
        console.log("nombre de row : " + sheet.rowCount);

        // mettre les mails dans un array
        let lesmails = new Array;
        let compteur = sheet.rowCount - 1;
        console.log("compteur: ",compteur);
        // ON RÉCUPÈRE LE MAIL (IDENTIFIANT) SAISIE DANS LE FORMULAIRE
        req.session.identifiant = req.body.identifiant;

        for (let i=0; i<compteur; i++) {
            
                lesmails[i] = rows[i].identifiant;
                console.log("rows[",i,"].identifiant: ",rows[i].identifiant);
                console.log("i = "+ i);
        }
        // afficher un array
        console.log("VOICI LA LISTE DES MAILS");
        console.info(lesmails);

        // recherche le mail saisi dans le array des tous les mails
        console.log("recherche le mail saisi dans le array des tous les mails: ",lesmails.includes(req.body.identifiant));

        
        if (lesmails.includes(req.body.identifiant) === true){
            req.session.err_mail_form_adhesion_1 = "Cette adresse Email est déjà inscrite pour les adhésions 2022/2023.";
            req.session.err_mail_form_adhesion_2 = "Si vous n'avez pas pu finaliser votre paiement veuillez nous envoyer un chèque ou un virement.";
            req.session.err_mail_form_adhesion_3 = "Pour tout problème veuillez contacter l’Association.";
            req.session.err_mail_form_adhesion_4 = "(L'ancien numéro d'adhérent est remplacé par le mail avec lequel vous vous êtes inscrit.)";
            res.redirect('/inscription/adhesion');
        } else {
            console.log("Etat case à coché: ",req.body.check_prof);
            if (req.body.check_prof){
                console.log("CASE A COCHÉ PROF : coché");
                res.redirect('/inscription/adhesion_prof');
            } else {
                console.log("CASE A COCHÉ PROF : NON coché");
                res.end();
            }
            // REDIRECTION PAGE ACCUEIL
            //req.session.err_mail_form_adhesion = 'Votre mail est absent, vous pouvez vous inscrire';
            
        }
}


/////////////////////////////////////////////////
// CAS MAIL NON DÉJA INSCRIT
// OU RETOUR ARRIÉRE SUR LA PAGE ET MODIFICATION DES INFORMATIONS PAR L'INTERNAUTE
// AJOUTER DES INFORMATIONS SAISIES DANS LE FORMULAIRE VERS LA GOOGLE SHEET
/////////////////////////////////////////////////
const post_form_adhesion = async function(req, res){

    console.log("===============================================");
    console.log("======== FUNCTION post_form_adhesion ==========");
    console.log("===============================================");

    // Controle que l'identifiant ne soit pas vide (en cas de rafraîchissement de la page)
    if (req.session.identifiant){

        // RÉCUPÉRATION DES DONNÉES DU FORMULAIRE DANS LA SESSION EN COURS
        req.session.adherent_nom = req.body.adherent_nom;
        req.session.adherent_prenom = req.body.adherent_prenom;
        moment.locale('fr');
        if (req.body.adherent_datenaissance) {req.session.adherent_datenaissance = moment(req.body.adherent_datenaissance).format('L')}; 
        req.session.adherent_adresse_rue = req.body.adherent_adresse_rue;
        req.session.adherent_adresse_complement = req.body.adherent_adresse_complement;
        req.session.adherent_adresse_codepostal = req.body.adherent_adresse_codepostal;
        req.session.adherent_adresse_ville = req.body.adherent_adresse_ville;
        req.session.adherent_adresse_pays = req.body.adherent_adresse_pays;
        req.session.adherent_telephone_mobile = req.body.adherent_telephone_mobile;
        req.session.adherent_telephone_fixe = req.body.adherent_telephone_fixe;
        req.session.adherent_prof_instrument1 = req.body.adherent_prof_instrument1;
        req.session.adherent_prof_instrument1_esa = req.body.adherent_prof_instrument1_esa;
        req.session.adherent_prof_instrument2 = req.body.adherent_prof_instrument2;
        req.session.adherent_prof_instrument2_esa = req.body.adherent_prof_instrument2_esa;
        req.session.adherent_prof_sece = req.body.adherent_prof_sece;
        req.session.adherent_prof_ecole1 = req.body.adherent_prof_ecole1;
        req.session.adherent_prof_ecole1_adresse = req.body.adherent_prof_ecole1_adresse;
        req.session.adherent_prof_ecole1_cp = req.body.adherent_prof_ecole1_cp;
        req.session.adherent_prof_ecole1_ville = req.body.adherent_prof_ecole1_ville;
        req.session.adherent_prof_ecole1_mail = req.body.adherent_prof_ecole1_mail;
        req.session.adherent_prof_ecole1_web = req.body.adherent_prof_ecole1_web;
        req.session.adherent_prof_ecole2 = req.body.adherent_prof_ecole2;
        req.session.adherent_prof_ecole2_adresse = req.body.adherent_prof_ecole2_adresse;
        req.session.adherent_prof_ecole2_cp = req.body.adherent_prof_ecole2_cp;
        req.session.adherent_prof_ecole2_ville = req.body.adherent_prof_ecole2_ville;
        req.session.adherent_prof_ecole2_mail = req.body.adherent_prof_ecole2_mail;
        req.session.adherent_prof_ecole2_web = req.body.adherent_prof_ecole2_web;
        req.session.adherent_prof_ecole3 = req.body.adherent_prof_ecole3;
        req.session.adherent_prof_ecole3_adresse = req.body.adherent_prof_ecole3_adresse;
        req.session.adherent_prof_ecole3_cp = req.body.adherent_prof_ecole3_cp;
        req.session.adherent_prof_ecole3_ville = req.body.adherent_prof_ecole3_ville;
        req.session.adherent_prof_ecole3_mail = req.body.adherent_prof_ecole3_mail;
        req.session.adherent_prof_ecole3_web = req.body.adherent_prof_ecole3_web;
        req.session.adherent_prof_stagiaire_instrument1 = req.body.adherent_prof_stagiaire_instrument1;
        req.session.adherent_prof_stagiaire_instrument1_esa = req.body.adherent_prof_stagiaire_instrument1_esa;
        if (req.body.adherent_prof_stagiaire_instrument1_prof[0]){req.session.adherent_prof_stagiaire_instrument1_prof = req.body.adherent_prof_stagiaire_instrument1_prof[0]};
        if (req.body.adherent_prof_stagiaire_instrument1_prof[1]){req.session.adherent_prof_stagiaire_instrument1_prof += ", "+req.body.adherent_prof_stagiaire_instrument1_prof[1]};
        if (req.body.adherent_prof_stagiaire_instrument1_prof[2]){req.session.adherent_prof_stagiaire_instrument1_prof += ", "+req.body.adherent_prof_stagiaire_instrument1_prof[2]};
        req.session.adherent_prof_stagiaire_instrument2 = req.body.adherent_prof_stagiaire_instrument2;
        req.session.adherent_prof_stagiaire_instrument2_esa = req.body.adherent_prof_stagiaire_instrument2_esa;
        if (req.body.adherent_prof_stagiaire_instrument2_prof[0]){req.session.adherent_prof_stagiaire_instrument2_prof = req.body.adherent_prof_stagiaire_instrument2_prof[0]};
        if (req.body.adherent_prof_stagiaire_instrument2_prof[1]){req.session.adherent_prof_stagiaire_instrument2_prof += ", "+req.body.adherent_prof_stagiaire_instrument2_prof[1]};
        if (req.body.adherent_prof_stagiaire_instrument2_prof[2]){req.session.adherent_prof_stagiaire_instrument2_prof += ", "+req.body.adherent_prof_stagiaire_instrument2_prof[2]};
        req.session.adherent_eleve1_nom = req.body.adherent_eleve1_nom;
        req.session.adherent_eleve1_prenom = req.body.adherent_eleve1_prenom;
        if (req.body.adherent_eleve1_datenaissance){req.session.adherent_eleve1_datenaissance = moment(req.body.adherent_eleve1_datenaissance).format('L')};
        req.session.adherent_eleve1_contactsup_nom = req.body.adherent_eleve1_contactsup_nom;
        req.session.adherent_eleve1_contactsup_prenom = req.body.adherent_eleve1_contactsup_prenom;
        req.session.adherent_eleve1_contactsup_mail = req.body.adherent_eleve1_contactsup_mail;
        req.session.adherent_eleve1_InstrumentA = req.body.adherent_eleve1_InstrumentA;
        req.session.adherent_eleve1_InstrumentA_prof = req.body.adherent_eleve1_InstrumentA_prof;
        req.session.adherent_eleve1_InstrumentA_cahier = req.body.adherent_eleve1_InstrumentA_cahier;
        req.session.adherent_eleve1_InstrumentB = req.body.adherent_eleve1_InstrumentB;
        req.session.adherent_eleve1_InstrumentB_prof = req.body.adherent_eleve1_InstrumentB_prof;
        req.session.adherent_eleve1_InstrumentB_cahier = req.body.adherent_eleve1_InstrumentB_cahier;
        req.session.adherent_eleve1_droitimage = req.body.adherent_eleve1_droitimage;
        req.session.adherent_eleve2_nom = req.body.adherent_eleve2_nom;
        req.session.adherent_eleve2_prenom = req.body.adherent_eleve2_prenom;
        if (req.body.adherent_eleve2_datenaissance){req.session.adherent_eleve2_datenaissance = moment(req.body.adherent_eleve2_datenaissance).format('L')};
        req.session.adherent_eleve2_contactsup_nom = req.body.adherent_eleve2_contactsup_nom;
        req.session.adherent_eleve2_contactsup_prenom = req.body.adherent_eleve2_contactsup_prenom;
        req.session.adherent_eleve2_contactsup_mail = req.body.adherent_eleve2_contactsup_mail;
        req.session.adherent_eleve2_InstrumentA = req.body.adherent_eleve2_InstrumentA;
        req.session.adherent_eleve2_InstrumentA_prof = req.body.adherent_eleve2_InstrumentA_prof;
        req.session.adherent_eleve2_InstrumentA_cahier = req.body.adherent_eleve2_InstrumentA_cahier;
        req.session.adherent_eleve2_InstrumentB = req.body.adherent_eleve2_InstrumentB;
        req.session.adherent_eleve2_InstrumentB_prof = req.body.adherent_eleve2_InstrumentB_prof;
        req.session.adherent_eleve2_InstrumentB_cahier = req.body.adherent_eleve2_InstrumentB_cahier;
        req.session.adherent_eleve2_droitimage = req.body.adherent_eleve2_droitimage;
        req.session.adherent_eleve3_nom = req.body.adherent_eleve3_nom;
        req.session.adherent_eleve3_prenom = req.body.adherent_eleve3_prenom;
        if (req.body.adherent_eleve3_datenaissance){req.session.adherent_eleve3_datenaissance = moment(req.body.adherent_eleve3_datenaissance).format('L')};
        req.session.adherent_eleve3_contactsup_nom = req.body.adherent_eleve3_contactsup_nom;
        req.session.adherent_eleve3_contactsup_prenom = req.body.adherent_eleve3_contactsup_prenom;
        req.session.adherent_eleve3_contactsup_mail = req.body.adherent_eleve3_contactsup_mail;
        req.session.adherent_eleve3_InstrumentA = req.body.adherent_eleve3_InstrumentA;
        req.session.adherent_eleve3_InstrumentA_prof = req.body.adherent_eleve3_InstrumentA_prof;
        req.session.adherent_eleve3_InstrumentA_cahier = req.body.adherent_eleve3_InstrumentA_cahier;
        req.session.adherent_eleve3_InstrumentB = req.body.adherent_eleve3_InstrumentB;
        req.session.adherent_eleve3_InstrumentB_prof = req.body.adherent_eleve3_InstrumentB_prof;
        req.session.adherent_eleve3_InstrumentB_cahier = req.body.adherent_eleve3_InstrumentB_cahier;
        req.session.adherent_eleve3_droitimage = req.body.adherent_eleve3_droitimage;
        req.session.adherent_eleve4_nom = req.body.adherent_eleve4_nom;
        req.session.adherent_eleve4_prenom = req.body.adherent_eleve4_prenom;
        if (req.body.adherent_eleve4_datenaissance){req.session.adherent_eleve4_datenaissance = moment(req.body.adherent_eleve4_datenaissance).format('L')};
        req.session.adherent_eleve4_contactsup_nom = req.body.adherent_eleve4_contactsup_nom;
        req.session.adherent_eleve4_contactsup_prenom = req.body.adherent_eleve4_contactsup_prenom;
        req.session.adherent_eleve4_contactsup_mail = req.body.adherent_eleve4_contactsup_mail;
        req.session.adherent_eleve4_InstrumentA = req.body.adherent_eleve4_InstrumentA;
        req.session.adherent_eleve4_InstrumentA_prof = req.body.adherent_eleve4_InstrumentA_prof;
        req.session.adherent_eleve4_InstrumentA_cahier = req.body.adherent_eleve4_InstrumentA_cahier;
        req.session.adherent_eleve4_InstrumentB = req.body.adherent_eleve4_InstrumentB;
        req.session.adherent_eleve4_InstrumentB_prof = req.body.adherent_eleve4_InstrumentB_prof;
        req.session.adherent_eleve4_InstrumentB_cahier = req.body.adherent_eleve4_InstrumentB_cahier;
        req.session.adherent_eleve4_droitimage = req.body.adherent_eleve4_droitimage;
        req.session.adherent_eleve5_nom = req.body.adherent_eleve5_nom;
        req.session.adherent_eleve5_prenom = req.body.adherent_eleve5_prenom;
        if (req.body.adherent_eleve5_datenaissance){req.session.adherent_eleve5_datenaissance = moment(req.body.adherent_eleve5_datenaissance).format('L')};
        req.session.adherent_eleve5_contactsup_nom = req.body.adherent_eleve5_contactsup_nom;
        req.session.adherent_eleve5_contactsup_prenom = req.body.adherent_eleve5_contactsup_prenom;
        req.session.adherent_eleve5_contactsup_mail = req.body.adherent_eleve5_contactsup_mail;
        req.session.adherent_eleve5_InstrumentA = req.body.adherent_eleve5_InstrumentA;
        req.session.adherent_eleve5_InstrumentA_prof = req.body.adherent_eleve5_InstrumentA_prof;
        req.session.adherent_eleve5_InstrumentA_cahier = req.body.adherent_eleve5_InstrumentA_cahier;
        req.session.adherent_eleve5_InstrumentB = req.body.adherent_eleve5_InstrumentB;
        req.session.adherent_eleve5_InstrumentB_prof = req.body.adherent_eleve5_InstrumentB_prof;
        req.session.adherent_eleve5_InstrumentB_cahier = req.body.adherent_eleve5_InstrumentB_cahier;
        req.session.adherent_eleve5_droitimage = req.body.adherent_eleve5_droitimage;



        
    

        console.log("req.body.adherent_nom: ",req.body.adherent_nom);
        console.log("req.session.identifiant: ",req.session.identifiant);
        
        console.log("req.session.adherent_nom: ",req.session.adherent_nom)



        // DÉTERMINER LE TYPE D'ADHÉRENT
        console.log("// DÉTERMINER LE TYPE D'ADHÉRENT");
        let adherent_type;

        console.log("req.session.adherent_prof_stagiaire_instrument1_esa: ",req.session.adherent_prof_stagiaire_instrument1_esa);

        if (req.session.adherent_prof_instrument1 && !req.session.adherent_prof_stagiaire_instrument1 && !req.session.adherent_eleve1_nom) {
            adherent_type = "professeur";
        }

        if (req.session.adherent_prof_instrument1 && !req.session.adherent_prof_stagiaire_instrument1 && req.session.adherent_eleve1_nom) {
            adherent_type = "prof_famille";
        }

        if (req.session.adherent_prof_stagiaire_instrument1 && req.session.adherent_prof_stagiaire_instrument1 && !req.session.adherent_eleve1_nom) {
            adherent_type = "prof_stagiaire";
        }

        if (req.session.adherent_prof_stagiaire_instrument1 && req.session.adherent_prof_stagiaire_instrument1  && req.session.adherent_eleve1_nom) {
            adherent_type = "prof_stagiaire_famille";
        }

        if (!req.session.adherent_prof_instrument1 && !req.session.adherent_prof_instrument1 && req.session.adherent_prof_stagiaire_instrument1_esa == 'Niveau 1' && !req.session.adherent_prof_stagiaire_instrument2 &&  !req.session.adherent_eleve1_nom) {
            adherent_type = "prof_stagiaire1";
        }

        if (!req.session.adherent_prof_instrument1 && !req.session.adherent_prof_instrument1 && req.session.adherent_prof_stagiaire_instrument1_esa == 'Niveau 1' && !req.session.adherent_prof_stagiaire_instrument2 && req.session.adherent_eleve1_nom) {
            adherent_type = "prof_stagiaire1_famille";
        }

        if (!adherent_type) {
            adherent_type = "non déterminé";
        }
        req.session.adherent_type = adherent_type;
        console.log("adherent_type: ", adherent_type);

        // DATE DE L'ADHÉSION
        moment().format();
        moment.locale('fr');
        var date_formattee = moment().format('L')
        console.log("date_formattee:", date_formattee);

        
        // CALCUL DU PRIX
        
        if (adherent_type == "professeur" || adherent_type == "prof_famille" || adherent_type == "prof_stagiaire" || adherent_type == "prof_stagiaire_famille") {
            adherent_paiement_montant_adhesion = 42;
        };
        if (adherent_type == "prof_stagiaire1" || adherent_type == "prof_stagiaire1_famille") {
            adherent_paiement_montant_adhesion = 22;
        };
        if (adherent_type == "non déterminé" || adherent_type == "") {
            adherent_paiement_montant_adhesion = 0;
        };
        console.log("CALCUL DU PRIX", adherent_paiement_montant_adhesion);
        //passer la variable dans la session pour la récupérer
        req.session.adherent_paiement_montant_adhesion = adherent_paiement_montant_adhesion;


        /////////////////////////////////////////////////
        // AJOUT DE l'ADHÉRENT
        // DANS LA GOOGLE SHEET
        /////////////////////////////////////////////////

        //const sheet = doc.sheetsByIndex[1]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
        //var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("feuilleTOTO");
        // const sheet = doc.sheetsByTitle['feuilleTOTO']; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo(); // loads document properties and worksheets
        console.log("NOM FICHIER SHEET: ",doc.title); //nom du fichier

        const sheet = doc.sheetsByTitle['adhesion_annuelle_web'];
        console.log("NOM DU TABLEAU (ONGLET): ",sheet.title); //NOM DU TABLEAU (ONGLET)
        console.log("NOMBRE DE LIGNE DU TABLEAU: ",sheet.rowCount); // NOMBRE DE LIGNE DU TABLEAU



        // SI IDENTIFIANT NON EXISTANT ON AJOUTE LA NOUVELLE LIGNE
        // SI IDENTIFIANT EXISTANT, cel aveut dire que l'internaute à faire retour arrière depuis la page paiement 
        // et va enregistrer de nouveau et donc cela ajouterai encore une ligne.
        // du coup on ne va pas ajouter une nouvelle ligne mais METTRE Â JOUR l'EXISTANTE au cas où il ait modifié des informations

        // ON CHECK DE NOUVEAU SI L'IDENTIFIANT EST DÉJA PRÉSENT

        const rows = await sheet.getRows();

        console.log("rows[0].identifiant: ", rows[0].identifiant);
        console.log("nombre de row : " + sheet.rowCount);

        // mettre les mails dans un array
        let lesmails = new Array;
        let compteur = sheet.rowCount - 1;
        let rowToBeUpdate;
        console.log("compteur: ",compteur);



        for (let i=0; i<compteur; i++) {
            
            lesmails[i] = rows[i].identifiant;
            if (rows[i].identifiant === req.session.identifiant){
                console.log("IDENTIFIANT TROUVÉ DANS LE ARRAY 'rows' à i = ",i);
                rowToBeUpdate = i;
            }

            console.log("rows[",i,"].identifiant: ",rows[i].identifiant);
            console.log("i = "+ i);
        }
    
        
        // METTRE Â JOUR l'EXISTANTE au cas où il ait modifié des informations
        if (lesmails.includes(req.session.identifiant) === true){
            console.log("ON MET A JOUR LA ROW NUMERO ",rowToBeUpdate);
            rows[rowToBeUpdate].adherent_type = adherent_type;
            rows[rowToBeUpdate].adherent_paiement_montant_adhesion = adherent_paiement_montant_adhesion;
            rows[rowToBeUpdate].adherent_nom = req.session.adherent_nom;
            rows[rowToBeUpdate].adherent_prenom = req.session.adherent_prenom;
            rows[rowToBeUpdate].adherent_datenaissance = req.session.adherent_datenaissance;
            rows[rowToBeUpdate].adherent_adresse_rue = req.session.adherent_adresse_rue;
            rows[rowToBeUpdate].adherent_adresse_complement = req.session.adherent_adresse_complement;
            rows[rowToBeUpdate].adherent_adresse_codepostal = req.session.adherent_adresse_codepostal;
            rows[rowToBeUpdate].adherent_adresse_ville = req.session.adherent_adresse_ville;
            rows[rowToBeUpdate].adherent_adresse_pays = req.session.adherent_adresse_pays;
            rows[rowToBeUpdate].adherent_telephone_mobile = req.session.adherent_telephone_mobile;
            rows[rowToBeUpdate].adherent_telephone_fixe = req.session.adherent_telephone_fixe;
            rows[rowToBeUpdate].adherent_mail = req.session.identifiant;
            rows[rowToBeUpdate].adherent_prof_instrument1 = req.session.adherent_prof_instrument1;
            rows[rowToBeUpdate].adherent_prof_instrument1_esa = req.session.adherent_prof_instrument1_esa;
            rows[rowToBeUpdate].adherent_prof_instrument2 = req.session.adherent_prof_instrument2;
            rows[rowToBeUpdate].adherent_prof_instrument2_esa = req.session.adherent_prof_instrument2_esa;
            rows[rowToBeUpdate].adherent_prof_sece = req.session.adherent_prof_sece;
            rows[rowToBeUpdate].adherent_prof_ecole1 = req.session.adherent_prof_ecole1;
            rows[rowToBeUpdate].adherent_prof_ecole1_adresse = req.session.adherent_prof_ecole1_adresse;
            rows[rowToBeUpdate].adherent_prof_ecole1_cp = req.session.adherent_prof_ecole1_cp;
            rows[rowToBeUpdate].adherent_prof_ecole1_ville = req.session.adherent_prof_ecole1_ville;
            rows[rowToBeUpdate].adherent_prof_ecole1_mail = req.session.adherent_prof_ecole1_mail;
            rows[rowToBeUpdate].adherent_prof_ecole1_web = req.session.adherent_prof_ecole1_web;
            rows[rowToBeUpdate].adherent_prof_ecole2 = req.session.adherent_prof_ecole2;
            rows[rowToBeUpdate].adherent_prof_ecole2_adresse = req.session.adherent_prof_ecole2_adresse;
            rows[rowToBeUpdate].adherent_prof_ecole2_cp = req.session.adherent_prof_ecole2_cp;
            rows[rowToBeUpdate].adherent_prof_ecole2_ville = req.session.adherent_prof_ecole2_ville;
            rows[rowToBeUpdate].adherent_prof_ecole2_mail = req.session.adherent_prof_ecole2_mail;
            rows[rowToBeUpdate].adherent_prof_ecole2_web = req.session.adherent_prof_ecole2_web;
            rows[rowToBeUpdate].adherent_prof_ecole3 = req.session.adherent_prof_ecole3;
            rows[rowToBeUpdate].adherent_prof_ecole3_adresse = req.session.adherent_prof_ecole3_adresse;
            rows[rowToBeUpdate].adherent_prof_ecole3_cp = req.session.adherent_prof_ecole3_cp;
            rows[rowToBeUpdate].adherent_prof_ecole3_ville = req.session.adherent_prof_ecole3_ville;
            rows[rowToBeUpdate].adherent_prof_ecole3_mail = req.session.adherent_prof_ecole3_mail;
            rows[rowToBeUpdate].adherent_prof_ecole3_web = req.session.adherent_prof_ecole3_web;
            rows[rowToBeUpdate].adherent_prof_stagiaire_instrument1 = req.session.adherent_prof_stagiaire_instrument1;
            rows[rowToBeUpdate].adherent_prof_stagiaire_instrument1_esa = req.session.adherent_prof_stagiaire_instrument1_esa;
            rows[rowToBeUpdate].adherent_prof_stagiaire_instrument1_prof = req.session.adherent_prof_stagiaire_instrument1_prof;
            rows[rowToBeUpdate].adherent_prof_stagiaire_instrument2 = req.session.adherent_prof_stagiaire_instrument2;
            rows[rowToBeUpdate].adherent_prof_stagiaire_instrument2_esa = req.session.adherent_prof_stagiaire_instrument2_esa;
            rows[rowToBeUpdate].adherent_prof_stagiaire_instrument2_prof = req.session.adherent_prof_stagiaire_instrument2_prof;
            rows[rowToBeUpdate].adherent_eleve1_nom = req.session.adherent_eleve1_nom;
            rows[rowToBeUpdate].adherent_eleve1_prenom = req.session.adherent_eleve1_prenom;
            rows[rowToBeUpdate].adherent_eleve1_datenaissance = req.session.adherent_eleve1_datenaissance;
            rows[rowToBeUpdate].adherent_eleve1_contactsup_nom = req.session.adherent_eleve1_contactsup_nom;
            rows[rowToBeUpdate].adherent_eleve1_contactsup_prenom = req.session.adherent_eleve1_contactsup_prenom;
            rows[rowToBeUpdate].adherent_eleve1_contactsup_mail = req.session.adherent_eleve1_contactsup_mail;
            rows[rowToBeUpdate].adherent_eleve1_InstrumentA = req.session.adherent_eleve1_InstrumentA;
            rows[rowToBeUpdate].adherent_eleve1_InstrumentA_prof = req.session.adherent_eleve1_InstrumentA_prof;
            rows[rowToBeUpdate].adherent_eleve1_InstrumentA_cahier = req.session.adherent_eleve1_InstrumentA_cahier;
            rows[rowToBeUpdate].adherent_eleve1_InstrumentB = req.session.adherent_eleve1_InstrumentB;
            rows[rowToBeUpdate].adherent_eleve1_InstrumentB_prof = req.session.adherent_eleve1_InstrumentB_prof;
            rows[rowToBeUpdate].adherent_eleve1_InstrumentB_cahier = req.session.adherent_eleve1_InstrumentB_cahier;
            rows[rowToBeUpdate].adherent_eleve1_droitimage = req.session.adherent_eleve1_droitimage;
            rows[rowToBeUpdate].adherent_eleve2_nom = req.session.adherent_eleve2_nom;
            rows[rowToBeUpdate].adherent_eleve2_prenom = req.session.adherent_eleve2_prenom;
            rows[rowToBeUpdate].adherent_eleve2_datenaissance = req.session.adherent_eleve2_datenaissance;
            rows[rowToBeUpdate].adherent_eleve2_contactsup_nom = req.session.adherent_eleve2_contactsup_nom;
            rows[rowToBeUpdate].adherent_eleve2_contactsup_prenom = req.session.adherent_eleve2_contactsup_prenom;
            rows[rowToBeUpdate].adherent_eleve2_contactsup_mail = req.session.adherent_eleve2_contactsup_mail;
            rows[rowToBeUpdate].adherent_eleve2_InstrumentA = req.session.adherent_eleve2_InstrumentA;
            rows[rowToBeUpdate].adherent_eleve2_InstrumentA_prof = req.session.adherent_eleve2_InstrumentA_prof;
            rows[rowToBeUpdate].adherent_eleve2_InstrumentA_cahier = req.session.adherent_eleve2_InstrumentA_cahier;
            rows[rowToBeUpdate].adherent_eleve2_InstrumentB = req.session.adherent_eleve2_InstrumentB;
            rows[rowToBeUpdate].adherent_eleve2_InstrumentB_prof = req.session.adherent_eleve2_InstrumentB_prof;
            rows[rowToBeUpdate].adherent_eleve2_InstrumentB_cahier = req.session.adherent_eleve2_InstrumentB_cahier;
            rows[rowToBeUpdate].adherent_eleve2_droitimage = req.session.adherent_eleve2_droitimage;
            rows[rowToBeUpdate].adherent_eleve3_nom = req.session.adherent_eleve3_nom;
            rows[rowToBeUpdate].adherent_eleve3_prenom = req.session.adherent_eleve3_prenom;
            rows[rowToBeUpdate].adherent_eleve3_datenaissance = req.session.adherent_eleve3_datenaissance;
            rows[rowToBeUpdate].adherent_eleve3_contactsup_nom = req.session.adherent_eleve3_contactsup_nom;
            rows[rowToBeUpdate].adherent_eleve3_contactsup_prenom = req.session.adherent_eleve3_contactsup_prenom;
            rows[rowToBeUpdate].adherent_eleve3_contactsup_mail = req.session.adherent_eleve3_contactsup_mail;
            rows[rowToBeUpdate].adherent_eleve3_InstrumentA = req.session.adherent_eleve3_InstrumentA;
            rows[rowToBeUpdate].adherent_eleve3_InstrumentA_prof = req.session.adherent_eleve3_InstrumentA_prof;
            rows[rowToBeUpdate].adherent_eleve3_InstrumentA_cahier = req.session.adherent_eleve3_InstrumentA_cahier;
            rows[rowToBeUpdate].adherent_eleve3_InstrumentB = req.session.adherent_eleve3_InstrumentB;
            rows[rowToBeUpdate].adherent_eleve3_InstrumentB_prof = req.session.adherent_eleve3_InstrumentB_prof;
            rows[rowToBeUpdate].adherent_eleve3_InstrumentB_cahier = req.session.adherent_eleve3_InstrumentB_cahier;
            rows[rowToBeUpdate].adherent_eleve3_droitimage = req.session.adherent_eleve3_droitimage;
            rows[rowToBeUpdate].adherent_eleve4_nom = req.session.adherent_eleve4_nom;
            rows[rowToBeUpdate].adherent_eleve4_prenom = req.session.adherent_eleve4_prenom;
            rows[rowToBeUpdate].adherent_eleve4_datenaissance = req.session.adherent_eleve4_datenaissance;
            rows[rowToBeUpdate].adherent_eleve4_contactsup_nom = req.session.adherent_eleve4_contactsup_nom;
            rows[rowToBeUpdate].adherent_eleve4_contactsup_prenom = req.session.adherent_eleve4_contactsup_prenom;
            rows[rowToBeUpdate].adherent_eleve4_contactsup_mail = req.session.adherent_eleve4_contactsup_mail;
            rows[rowToBeUpdate].adherent_eleve4_InstrumentA = req.session.adherent_eleve4_InstrumentA;
            rows[rowToBeUpdate].adherent_eleve4_InstrumentA_prof = req.session.adherent_eleve4_InstrumentA_prof;
            rows[rowToBeUpdate].adherent_eleve4_InstrumentA_cahier = req.session.adherent_eleve4_InstrumentA_cahier;
            rows[rowToBeUpdate].adherent_eleve4_InstrumentB = req.session.adherent_eleve4_InstrumentB;
            rows[rowToBeUpdate].adherent_eleve4_InstrumentB_prof = req.session.adherent_eleve4_InstrumentB_prof;
            rows[rowToBeUpdate].adherent_eleve4_InstrumentB_cahier = req.session.adherent_eleve4_InstrumentB_cahier;
            rows[rowToBeUpdate].adherent_eleve4_droitimage = req.session.adherent_eleve4_droitimage;
            rows[rowToBeUpdate].adherent_eleve5_nom = req.session.adherent_eleve5_nom;
            rows[rowToBeUpdate].adherent_eleve5_prenom = req.session.adherent_eleve5_prenom;
            rows[rowToBeUpdate].adherent_eleve5_datenaissance = req.session.adherent_eleve5_datenaissance;
            rows[rowToBeUpdate].adherent_eleve5_contactsup_nom = req.session.adherent_eleve5_contactsup_nom;
            rows[rowToBeUpdate].adherent_eleve5_contactsup_prenom = req.session.adherent_eleve5_contactsup_prenom;
            rows[rowToBeUpdate].adherent_eleve5_contactsup_mail = req.session.adherent_eleve5_contactsup_mail;
            rows[rowToBeUpdate].adherent_eleve5_InstrumentA = req.session.adherent_eleve5_InstrumentA;
            rows[rowToBeUpdate].adherent_eleve5_InstrumentA_prof = req.session.adherent_eleve5_InstrumentA_prof;
            rows[rowToBeUpdate].adherent_eleve5_InstrumentA_cahier = req.session.adherent_eleve5_InstrumentA_cahier;
            rows[rowToBeUpdate].adherent_eleve5_InstrumentB = req.session.adherent_eleve5_InstrumentB;
            rows[rowToBeUpdate].adherent_eleve5_InstrumentB_prof = req.session.adherent_eleve5_InstrumentB_prof;
            rows[rowToBeUpdate].adherent_eleve5_InstrumentB_cahier = req.session.adherent_eleve5_InstrumentB_cahier;
            rows[rowToBeUpdate].adherent_eleve5_droitimage = req.session.adherent_eleve5_droitimage;
            await rows[rowToBeUpdate].save(); // save updates
        } else {
            // SI IDENTIFIANT NON TROUVÉ => AJOUTER UNE LIGNE DANS LA GOOGLE SHEET
            const moreRows = await sheet.addRows([
                {
                    'identifiant': req.session.identifiant,
                    'saison': "2022/2023",
                    'adhesion_date': date_formattee,
                    'adherent_type': adherent_type,
                    'adherent_paiement_montant_adhesion': adherent_paiement_montant_adhesion,
                    'adherent_nom': req.session.adherent_nom,
                    'adherent_prenom': req.session.adherent_prenom,
                    'adherent_datenaissance': req.session.adherent_datenaissance,
                    'adherent_adresse_rue': req.session.adherent_adresse_rue,
                    'adherent_adresse_complement': req.session.adherent_adresse_complement,
                    'adherent_adresse_codepostal': req.session.adherent_adresse_codepostal,
                    'adherent_adresse_ville': req.session.adherent_adresse_ville,
                    'adherent_adresse_pays': req.session.adherent_adresse_pays,
                    'adherent_telephone_mobile': req.session.adherent_telephone_mobile,
                    'adherent_telephone_fixe': req.session.adherent_telephone_fixe,
                    'adherent_mail': req.session.identifiant,
                    'adherent_prof_instrument1': req.session.adherent_prof_instrument1,
                    'adherent_prof_instrument1_esa': req.session.adherent_prof_instrument1_esa,
                    'adherent_prof_instrument2': req.session.adherent_prof_instrument2,
                    'adherent_prof_instrument2_esa': req.session.adherent_prof_instrument2_esa,
                    'adherent_prof_sece': req.session.adherent_prof_sece,
                    'adherent_prof_ecole1': req.session.adherent_prof_ecole1,
                    'adherent_prof_ecole1_adresse': req.session.adherent_prof_ecole1_adresse,
                    'adherent_prof_ecole1_cp': req.session.adherent_prof_ecole1_cp,
                    'adherent_prof_ecole1_mail': req.session.adherent_prof_ecole1_mail,
                    'adherent_prof_ecole1_ville': req.session.adherent_prof_ecole1_ville,
                    'adherent_prof_ecole1_web': req.session.adherent_prof_ecole1_web,
                    'adherent_prof_ecole2': req.session.adherent_prof_ecole2,
                    'adherent_prof_ecole2_adresse': req.session.adherent_prof_ecole2_adresse,
                    'adherent_prof_ecole2_cp': req.session.adherent_prof_ecole2_cp,
                    'adherent_prof_ecole2_ville': req.session.adherent_prof_ecole2_ville,
                    'adherent_prof_ecole2_mail': req.session.adherent_prof_ecole2_mail,
                    'adherent_prof_ecole2_web': req.session.adherent_prof_ecole2_web,
                    'adherent_prof_ecole3': req.session.adherent_prof_ecole3,
                    'adherent_prof_ecole3_adresse': req.session.adherent_prof_ecole3_adresse,
                    'adherent_prof_ecole3_cp': req.session.adherent_prof_ecole3_cp,
                    'adherent_prof_ecole3_ville': req.session.adherent_prof_ecole3_ville,
                    'adherent_prof_ecole3_mail': req.session.adherent_prof_ecole3_mail,
                    'adherent_prof_ecole3_web': req.session.adherent_prof_ecole3_web,
                    'adherent_prof_stagiaire_instrument1': req.session.adherent_prof_stagiaire_instrument1,
                    'adherent_prof_stagiaire_instrument1_esa': req.session.adherent_prof_stagiaire_instrument1_esa,
                    'adherent_prof_stagiaire_instrument1_prof': req.session.adherent_prof_stagiaire_instrument1_prof,
                    'adherent_prof_stagiaire_instrument2': req.session.adherent_prof_stagiaire_instrument2,
                    'adherent_prof_stagiaire_instrument2_esa': req.session.adherent_prof_stagiaire_instrument2_esa,
                    'adherent_prof_stagiaire_instrument2_prof': req.session.adherent_prof_stagiaire_instrument2_prof,
                    'adherent_eleve1_nom': req.session.adherent_eleve1_nom,
                    'adherent_eleve1_prenom': req.session.adherent_eleve1_prenom,
                    'adherent_eleve1_datenaissance': req.session.adherent_eleve1_datenaissance,
                    'adherent_eleve1_contactsup_nom': req.session.adherent_eleve1_contactsup_nom,
                    'adherent_eleve1_contactsup_prenom': req.session.adherent_eleve1_contactsup_prenom,
                    'adherent_eleve1_contactsup_mail': req.session.adherent_eleve1_contactsup_mail,
                    'adherent_eleve1_InstrumentA': req.session.adherent_eleve1_InstrumentA,
                    'adherent_eleve1_InstrumentA_prof': req.session.adherent_eleve1_InstrumentA_prof,
                    'adherent_eleve1_InstrumentA_cahier': req.session.adherent_eleve1_InstrumentA_cahier,
                    'adherent_eleve1_InstrumentB': req.session.adherent_eleve1_InstrumentB,
                    'adherent_eleve1_InstrumentB_prof': req.session.adherent_eleve1_InstrumentB_prof,
                    'adherent_eleve1_InstrumentB_cahier': req.session.adherent_eleve1_InstrumentB_cahier,
                    'adherent_eleve1_droitimage': req.session.adherent_eleve1_droitimage,
                    'adherent_eleve2_nom': req.session.adherent_eleve2_nom,
                    'adherent_eleve2_prenom': req.session.adherent_eleve2_prenom,
                    'adherent_eleve2_datenaissance': req.session.adherent_eleve2_datenaissance,
                    'adherent_eleve2_contactsup_nom': req.session.adherent_eleve2_contactsup_nom,
                    'adherent_eleve2_contactsup_prenom': req.session.adherent_eleve2_contactsup_prenom,
                    'adherent_eleve2_contactsup_mail': req.session.adherent_eleve2_contactsup_mail,
                    'adherent_eleve2_InstrumentA': req.session.adherent_eleve2_InstrumentA,
                    'adherent_eleve2_InstrumentA_prof': req.session.adherent_eleve2_InstrumentA_prof,
                    'adherent_eleve2_InstrumentA_cahier': req.session.adherent_eleve2_InstrumentA_cahier,
                    'adherent_eleve2_InstrumentB': req.session.adherent_eleve2_InstrumentB,
                    'adherent_eleve2_InstrumentB_prof': req.session.adherent_eleve2_InstrumentB_prof,
                    'adherent_eleve2_InstrumentB_cahier': req.session.adherent_eleve2_InstrumentB_cahier,
                    'adherent_eleve2_droitimage': req.session.adherent_eleve2_droitimage,
                    'adherent_eleve3_nom': req.session.adherent_eleve3_nom,
                    'adherent_eleve3_prenom': req.session.adherent_eleve3_prenom,
                    'adherent_eleve3_datenaissance': req.session.adherent_eleve3_datenaissance,
                    'adherent_eleve3_contactsup_nom': req.session.adherent_eleve3_contactsup_nom,
                    'adherent_eleve3_contactsup_prenom': req.session.adherent_eleve3_contactsup_prenom,
                    'adherent_eleve3_contactsup_mail': req.session.adherent_eleve3_contactsup_mail,
                    'adherent_eleve3_InstrumentA': req.session.adherent_eleve3_InstrumentA,
                    'adherent_eleve3_InstrumentA_prof': req.session.adherent_eleve3_InstrumentA_prof,
                    'adherent_eleve3_InstrumentA_cahier': req.session.adherent_eleve3_InstrumentA_cahier,
                    'adherent_eleve3_InstrumentB': req.session.adherent_eleve3_InstrumentB,
                    'adherent_eleve3_InstrumentB_prof': req.session.adherent_eleve3_InstrumentB_prof,
                    'adherent_eleve3_InstrumentB_cahier': req.session.adherent_eleve3_InstrumentB_cahier,
                    'adherent_eleve3_droitimage': req.session.adherent_eleve3_droitimage,
                    'adherent_eleve4_nom': req.session.adherent_eleve4_nom,
                    'adherent_eleve4_prenom': req.session.adherent_eleve4_prenom,
                    'adherent_eleve4_datenaissance': req.session.adherent_eleve4_datenaissance,
                    'adherent_eleve4_contactsup_nom': req.session.adherent_eleve4_contactsup_nom,
                    'adherent_eleve4_contactsup_prenom': req.session.adherent_eleve4_contactsup_prenom,
                    'adherent_eleve4_contactsup_mail': req.session.adherent_eleve4_contactsup_mail,
                    'adherent_eleve4_InstrumentA': req.session.adherent_eleve4_InstrumentA,
                    'adherent_eleve4_InstrumentA_prof': req.session.adherent_eleve4_InstrumentA_prof,
                    'adherent_eleve4_InstrumentA_cahier': req.session.adherent_eleve4_InstrumentA_cahier,
                    'adherent_eleve4_InstrumentB': req.session.adherent_eleve4_InstrumentB,
                    'adherent_eleve4_InstrumentB_prof': req.session.adherent_eleve4_InstrumentB_prof,
                    'adherent_eleve4_InstrumentB_cahier': req.session.adherent_eleve4_InstrumentB_cahier,
                    'adherent_eleve4_droitimage': req.session.adherent_eleve4_droitimage,
                    'adherent_eleve5_nom': req.session.adherent_eleve5_nom,
                    'adherent_eleve5_prenom': req.session.adherent_eleve5_prenom,
                    'adherent_eleve5_datenaissance': req.session.adherent_eleve5_datenaissance,
                    'adherent_eleve5_contactsup_nom': req.session.adherent_eleve5_contactsup_nom,
                    'adherent_eleve5_contactsup_prenom': req.session.adherent_eleve5_contactsup_prenom,
                    'adherent_eleve5_contactsup_mail': req.session.adherent_eleve5_contactsup_mail,
                    'adherent_eleve5_InstrumentA': req.session.adherent_eleve5_InstrumentA,
                    'adherent_eleve5_InstrumentA_prof': req.session.adherent_eleve5_InstrumentA_prof,
                    'adherent_eleve5_InstrumentA_cahier': req.session.adherent_eleve5_InstrumentA_cahier,
                    'adherent_eleve5_InstrumentB': req.session.adherent_eleve5_InstrumentB,
                    'adherent_eleve5_InstrumentB_prof': req.session.adherent_eleve5_InstrumentB_prof,
                    'adherent_eleve5_InstrumentB_cahier': req.session.adherent_eleve5_InstrumentB_cahier,
                    'adherent_eleve5_droitimage': req.session.adherent_eleve5_droitimage,
                },
            ]);
            
        }

        // REDIRECTION VERS LA PAGE PAIEMENT
        res.redirect('/inscription/adhesion_paiement_total');


    } else {
        console.log("Identifiant vide, retour page accueil");
        req.session.err_mail_form_adhesion_1 = "La page a perdu les informations, veuillez les saisir de nouveau.";
        res.redirect('/inscription/adhesion');
    }


}

const post_form_montant_total = async function(req, res){
    console.log("===============================================");
    console.log("======== FUNCTION post_form_montant_total ==========");
    console.log("===============================================");
    // MONTANT TOTAL À PAYER
    console.log("on est dans post_form_montant_total");
    //let montant_adhesion = req.session.adherent_paiement_montant_adhesion;
    req.session.adherent_paiement_montant_don = req.body.adherent_paiement_montant_don;
    console.log ("req.body.adherent_paiement_montant_don: ",req.body.adherent_paiement_montant_don);
    console.log ("req.session.adherent_paiement_montant_adhesion: ",req.session.adherent_paiement_montant_adhesion);
    // parseInt pour rendre la variable en type interger et faire l'addition
    let montant_adhesion = parseInt(req.session.adherent_paiement_montant_adhesion);
    let montant_don = parseInt(req.session.adherent_paiement_montant_don);
    let montant_apayer;
    if (montant_don>0){
        montant_apayer = montant_adhesion + montant_don;
        console.log ("if (montant_don>0)");
    } else {
        console.log("montant_adhesion: ",montant_adhesion);
        montant_apayer = montant_adhesion;
        console.log ("else (montant_don>0)");
    };
    req.session.montant_apayer = montant_apayer;
    console.log ("montant_apayer: ", montant_apayer);
    let montant_apayer_cent;
    montant_apayer_cent = montant_apayer * 100;
    req.session.montant_apayer_cent = montant_apayer_cent;
    console.log ("montant_apayer_cent: ", montant_apayer_cent);
    res.redirect('/inscription/adhesion_paiement_mode_paiement');
}


const post_paiement_cheque_save = async function(req, res){

    console.log("===============================================");
    console.log("======== FUNCTION post_paiement_cheque_save ==========");
    console.log("===============================================");
    
    //////////////////////////////////////////////////////////////////////////////
    // RÉCUPÉRATION DES DONNÉES DU FORMULAIRE DANS LA SESSION EN COURS
    req.session.adherent_paiement_cheque_banque = req.body.adherent_paiement_cheque_banque;
    req.session.adherent_paiement_cheque_numero = req.body.adherent_paiement_cheque_numero;


    //////////////////////////////////////////////////////////////////////////////
    // MISE À JOUR DES INFORMATIONS SUR LE PAIEMENT DANS LA BASE DE DONNÉES GSHEET
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByTitle['adhesion_annuelle_web'];

    // on récupère le contenu de la GSheet dans un array nommé "rows"
    const rows = await sheet.getRows();
    // on récupère quelle ligne contient l'identifiant concerné pour mettre à jour cette ligne
    let lesmails = new Array;
    let compteur = sheet.rowCount - 1;
    let rowToBeUpdate;
    for (let i=0; i<compteur; i++) {
        lesmails[i] = rows[i].identifiant;
        if (rows[i].identifiant === req.session.identifiant){
            console.log("IDENTIFIANT TROUVÉ DANS LE ARRAY 'rows' à i = ",i);
            rowToBeUpdate = i;
        }
    }

    rows[rowToBeUpdate].adherent_paiement_cheque_banque = req.session.adherent_paiement_cheque_banque;
    rows[rowToBeUpdate].adherent_paiement_cheque_numero = req.session.adherent_paiement_cheque_numero;
    rows[rowToBeUpdate].adherent_paiement_montant_don = req.session.adherent_paiement_montant_don;
    rows[rowToBeUpdate].adherent_paiement_montant_total = req.session.montant_apayer;
    rows[rowToBeUpdate].adherent_paiement_mode = "cheque";
    rows[rowToBeUpdate].Adhesion_paye = "attente";
    
    await rows[rowToBeUpdate].save();

    console.log ("req.session.adherent_type: ", req.session.adherent_type)
    var profil1, profil2, profil3;
    if (req.session.adherent_type === "professeur") {
      profil1 = "Professeur";
      console.log("profil1 : ", profil1);
    }
    if (req.session.adherent_type === "prof_famille") {
      profil1 = "Professeur";
      profil2 = "Élève";
      console.log("profil1 : ", profil1);
      console.log("profil2 : ", profil2);
    }
    if (req.session.adherent_type === "prof_stagiaire") {
      profil1 = "Professeur";
      profil2 = "Professeur stagiaire";
      console.log("profil1 : ", profil1);
      console.log("profil2 : ", profil2);
    }
    if (req.session.adherent_type === "prof_stagiaire_famille") {
      profil1 = "Professeur";
      profil2 = "Professeur stagiaire";
      profil3 = "Élève";
      console.log("profil1 : ", profil1);
      console.log("profil2 : ", profil2);
      console.log("profil3 : ", profil3);
    }
    if (req.session.adherent_type === "prof_stagiaire1") {
      profil1 = "Professeur stagiaire";
      console.log("profil1 : ", profil1);
    }
    if (req.session.adherent_type === "prof_stagiaire1_famille") {
      profil1 = "Professeur stagiaire";
      profil2 = "Élève";
      console.log("profil1 : ", profil1);
      console.log("profil2 : ", profil2);
    }
    req.session.profil1 = profil1;
    req.session.profil2 = profil2;
    req.session.profil3 = profil3;

    req.session.adherent_paiement_mode = "chèque";

    // REDIRECTION VERS LA PAGE DE CONFIRMATION PAIEMENT VIREMENT
    res.redirect('/inscription/adhesion_paiement/attente');

}

const post_paiement_virement_save = async function(req, res){

    console.log("===============================================");
    console.log("======== FUNCTION post_paiement_virement_save ==========");
    console.log("===============================================");
    
    console.log("on est dans paiement_virement_save")

    //////////////////////////////////////////////////////////////////////////////
    // MISE À JOUR DES INFORMATIONS SUR LE PAIEMENT DANS LA BASE DE DONNÉES GSHEET
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByTitle['adhesion_annuelle_web'];

    // on récupère le contenu de la GSheet dans un array nommé "rows"
    const rows = await sheet.getRows();
    // on récupère quelle ligne contient l'identifiant concerné pour mettre à jour cette ligne
    let lesmails = new Array;
    let compteur = sheet.rowCount - 1;
    let rowToBeUpdate;
    for (let i=0; i<compteur; i++) {
        lesmails[i] = rows[i].identifiant;
        if (rows[i].identifiant === req.session.identifiant){
            console.log("IDENTIFIANT TROUVÉ DANS LE ARRAY 'rows' à i = ",i);
            rowToBeUpdate = i;
        }
    }

    if (req.session.adherent_paiement_montant_don){rows[rowToBeUpdate].adherent_paiement_montant_don = req.session.adherent_paiement_montant_don};
    rows[rowToBeUpdate].adherent_paiement_montant_total = req.session.montant_apayer;
    rows[rowToBeUpdate].adherent_paiement_mode = "virement";
    rows[rowToBeUpdate].Adhesion_paye = "attente";
    
    await rows[rowToBeUpdate].save();

    console.log ("req.session.adherent_type: ", req.session.adherent_type)
    var profil1, profil2, profil3;
    if (req.session.adherent_type === "professeur") {
      profil1 = "Professeur";
      console.log("profil1 : ", profil1);
    }
    if (req.session.adherent_type === "prof_famille") {
      profil1 = "Professeur";
      profil2 = "Élève";
      console.log("profil1 : ", profil1);
      console.log("profil2 : ", profil2);
    }
    if (req.session.adherent_type === "prof_stagiaire") {
      profil1 = "Professeur";
      profil2 = "Professeur stagiaire";
      console.log("profil1 : ", profil1);
      console.log("profil2 : ", profil2);
    }
    if (req.session.adherent_type === "prof_stagiaire_famille") {
      profil1 = "Professeur";
      profil2 = "Professeur stagiaire";
      profil3 = "Élève";
      console.log("profil1 : ", profil1);
      console.log("profil2 : ", profil2);
      console.log("profil3 : ", profil3);
    }
    if (req.session.adherent_type === "prof_stagiaire1") {
      profil1 = "Professeur stagiaire";
      console.log("profil1 : ", profil1);
    }
    if (req.session.adherent_type === "prof_stagiaire1_famille") {
      profil1 = "Professeur stagiaire";
      profil2 = "Élève";
      console.log("profil1 : ", profil1);
      console.log("profil2 : ", profil2);
    }
    req.session.profil1 = profil1;
    req.session.profil2 = profil2;
    req.session.profil3 = profil3;

    req.session.adherent_paiement_mode = "virement";
    

    // REDIRECTION VERS LA PAGE DE CONFIRMATION PAIEMENT VIREMENT
    res.redirect('/inscription/adhesion_paiement/attente');

}


module.exports = {
    checkMail,
    post_form_adhesion,
    post_form_montant_total,
    post_paiement_cheque_save,
    post_paiement_virement_save
}









