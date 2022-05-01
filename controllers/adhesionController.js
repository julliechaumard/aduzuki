// le controller est chargé du traitement des routes

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
        //console.log(rows);
        console.log("rows[0].identifiant: ", rows[0].identifiant);
        console.log("nombre de row : " + sheet.rowCount);

        // mettre les mails dans un array
        let lesmails = new Array;
        let compteur = sheet.rowCount - 1;
        console.log("compteur: ",compteur);
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

        req.session.identifiant = req.body.identifiant;
        if (lesmails.includes(req.body.identifiant) === true){
            req.session.err_mail_form_adhesion_1 = "Cette adresse Email est déjà inscrite pour les adhésions 2022/2023.";
            req.session.err_mail_form_adhesion_2 = "Votre numéro identifiant est désormais le mail principal de la famille.";
            req.session.err_mail_form_adhesion_3 = "Pour tout problème veuillez contacter l’Association.";
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
// AJOUT DES INFORMATIONS SAISIES DU FORMULAIRE DANS LA GOOGLE SHEET
/////////////////////////////////////////////////
const post_form_adhesion = async function(req, res){

    // RÉCUPÉRATION DES DONNÉES DU FORMULAIRE DANS LA SESSION EN COURS
    req.session.adherent_nom = req.body.adherent_nom;
    req.session.adherent_prenom = req.body.adherent_prenom;
    req.session.adherent_datenaissance = req.body.adherent_datenaissance;
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
    req.session.adherent_prof_ecole2 = req.body.adherent_prof_ecole2;
    req.session.adherent_prof_ecole2_adresse = req.body.adherent_prof_ecole2_adresse;
    req.session.adherent_prof_ecole2_cp = req.body.adherent_prof_ecole2_cp;
    req.session.adherent_prof_ecole2_ville = req.body.adherent_prof_ecole2_ville;
    req.session.adherent_prof_ecole3 = req.body.adherent_prof_ecole3;
    req.session.adherent_prof_ecole3_cp = req.body.adherent_prof_ecole3_cp;
    req.session.adherent_prof_ecole3_ville = req.body.adherent_prof_ecole3_ville;
    req.session.adherent_prof_stagiaire_instrument1 = req.body.adherent_prof_stagiaire_instrument1,
    req.session.adherent_prof_stagiaire_instrument1_esa = req.body.adherent_prof_stagiaire_instrument1_esa,
    req.session.adherent_prof_stagiaire_instrument1_prof = req.body.adherent_prof_stagiaire_instrument1_prof,
    req.session.adherent_prof_stagiaire_instrument2 = req.body.adherent_prof_stagiaire_instrument2,
    req.session.adherent_prof_stagiaire_instrument2_esa = req.body.adherent_prof_stagiaire_instrument2_esa,
    req.session.adherent_prof_stagiaire_instrument2_prof = req.body.adherent_prof_stagiaire_instrument2_prof,
    req.session.adherent_eleve1_type = req.body.adherent_eleve1_type,
    req.session.adherent_eleve1_nom = req.body.adherent_eleve1_nom,
    req.session.adherent_eleve1_prenom = req.body.adherent_eleve1_prenom,
    req.session.adherent_eleve1_datenaissance = req.body.adherent_eleve1_datenaissance,
    req.session.adherent_eleve1_contactsup_nom = req.body.adherent_eleve1_contactsup_nom,
    req.session.adherent_eleve1_contactsup_prenom = req.body.adherent_eleve1_contactsup_prenom,
    req.session.adherent_eleve1_contactsup_mail = req.body.adherent_eleve1_contactsup_mail,
    req.session.adherent_eleve1_InstrumentA = req.body.adherent_eleve1_InstrumentA,
    req.session.adherent_eleve1_InstrumentA_prof = req.body.adherent_eleve1_InstrumentA_prof,
    req.session.adherent_eleve1_InstrumentA_cahie = req.body.adherent_eleve1_InstrumentA_cahierr,
    req.session.adherent_eleve1_InstrumentB = req.body.adherent_eleve1_InstrumentB,
    req.session.adherent_eleve1_InstrumentB_prof = req.body.adherent_eleve1_InstrumentB_prof,
    req.session.adherent_eleve1_InstrumentB_cahie = req.body.adherent_eleve1_InstrumentB_cahierr,
    req.session.adherent_eleve1_droitimage = req.body.adherent_eleve1_droitimage,
    req.session.adherent_eleve2_type = req.body.adherent_eleve2_type,
    req.session.adherent_eleve2_nom = req.body.adherent_eleve2_nom,
    req.session.adherent_eleve2_prenom = req.body.adherent_eleve2_prenom,
    req.session.adherent_eleve2_datenaissance = req.body.adherent_eleve2_datenaissance,
    req.session.adherent_eleve2_contactsup_nom = req.body.adherent_eleve2_contactsup_nom,
    req.session.adherent_eleve2_contactsup_prenom = req.body.adherent_eleve2_contactsup_prenom,
    req.session.adherent_eleve2_contactsup_mail = req.body.adherent_eleve2_contactsup_mail,
    req.session.adherent_eleve2_InstrumentA = req.body.adherent_eleve2_InstrumentA,
    req.session.adherent_eleve2_InstrumentA_prof = req.body.adherent_eleve2_InstrumentA_prof,
    req.session.adherent_eleve2_InstrumentA_cahie = req.body.adherent_eleve2_InstrumentA_cahierr,
    req.session.adherent_eleve2_InstrumentB = req.body.adherent_eleve2_InstrumentB,
    req.session.adherent_eleve2_InstrumentB_prof = req.body.adherent_eleve2_InstrumentB_prof,
    req.session.adherent_eleve2_InstrumentB_cahie = req.body.adherent_eleve2_InstrumentB_cahierr,
    req.session.adherent_eleve2_droitimage = req.body.adherent_eleve2_droitimage,
    req.session.adherent_eleve3_type = req.body.adherent_eleve3_type,
    req.session.adherent_eleve3_nom = req.body.adherent_eleve3_nom,
    req.session.adherent_eleve3_prenom = req.body.adherent_eleve3_prenom,
    req.session.adherent_eleve3_datenaissance = req.body.adherent_eleve3_datenaissance,
    req.session.adherent_eleve3_contactsup_nom = req.body.adherent_eleve3_contactsup_nom,
    req.session.adherent_eleve3_contactsup_prenom = req.body.adherent_eleve3_contactsup_prenom,
    req.session.adherent_eleve3_contactsup_mail = req.body.adherent_eleve3_contactsup_mail,
    req.session.adherent_eleve3_InstrumentA = req.body.adherent_eleve3_InstrumentA,
    req.session.adherent_eleve3_InstrumentA_prof = req.body.adherent_eleve3_InstrumentA_prof,
    req.session.adherent_eleve3_InstrumentA_cahie = req.body.adherent_eleve3_InstrumentA_cahierr,
    req.session.adherent_eleve3_InstrumentB = req.body.adherent_eleve3_InstrumentB,
    req.session.adherent_eleve3_InstrumentB_prof = req.body.adherent_eleve3_InstrumentB_prof,
    req.session.adherent_eleve3_InstrumentB_cahie = req.body.adherent_eleve3_InstrumentB_cahierr,
    req.session.adherent_eleve3_droitimage = req.body.adherent_eleve3_droitimage,
    req.session.adherent_eleve4_type = req.body.adherent_eleve4_type,
    req.session.adherent_eleve4_nom = req.body.adherent_eleve4_nom,
    req.session.adherent_eleve4_prenom = req.body.adherent_eleve4_prenom,
    req.session.adherent_eleve4_datenaissance = req.body.adherent_eleve4_datenaissance,
    req.session.adherent_eleve4_contactsup_nom = req.body.adherent_eleve4_contactsup_nom,
    req.session.adherent_eleve4_contactsup_prenom = req.body.adherent_eleve4_contactsup_prenom,
    req.session.adherent_eleve4_contactsup_mail = req.body.adherent_eleve4_contactsup_mail,
    req.session.adherent_eleve4_InstrumentA = req.body.adherent_eleve4_InstrumentA,
    req.session.adherent_eleve4_InstrumentA_prof = req.body.adherent_eleve4_InstrumentA_prof,
    req.session.adherent_eleve4_InstrumentA_cahie = req.body.adherent_eleve4_InstrumentA_cahierr,
    req.session.adherent_eleve4_InstrumentB = req.body.adherent_eleve4_InstrumentB,
    req.session.adherent_eleve4_InstrumentB_prof = req.body.adherent_eleve4_InstrumentB_prof,
    req.session.adherent_eleve4_InstrumentB_cahie = req.body.adherent_eleve4_InstrumentB_cahierr,
    req.session.adherent_eleve4_droitimage = req.body.adherent_eleve4_droitimage,
    req.session.adherent_eleve5_type = req.body.adherent_eleve5_type,
    req.session.adherent_eleve5_nom = req.body.adherent_eleve5_nom,
    req.session.adherent_eleve5_prenom = req.body.adherent_eleve5_prenom,
    req.session.adherent_eleve5_datenaissance = req.body.adherent_eleve5_datenaissance,
    req.session.adherent_eleve5_contactsup_nom = req.body.adherent_eleve5_contactsup_nom,
    req.session.adherent_eleve5_contactsup_prenom = req.body.adherent_eleve5_contactsup_prenom,
    req.session.adherent_eleve5_contactsup_mail = req.body.adherent_eleve5_contactsup_mail,
    req.session.adherent_eleve5_InstrumentA = req.body.adherent_eleve5_InstrumentA,
    req.session.adherent_eleve5_InstrumentA_prof = req.body.adherent_eleve5_InstrumentA_prof,
    req.session.adherent_eleve5_InstrumentA_cahie = req.body.adherent_eleve5_InstrumentA_cahierr,
    req.session.adherent_eleve5_InstrumentB = req.body.adherent_eleve5_InstrumentB,
    req.session.adherent_eleve5_InstrumentB_prof = req.body.adherent_eleve5_InstrumentB_prof,
    req.session.adherent_eleve5_InstrumentB_cahie = req.body.adherent_eleve5_InstrumentB_cahierr,
    req.session.adherent_eleve5_droitimage = req.body.adherent_eleve5_droitimage,


    console.log("===============================================");
    console.log("======== FUNCTION post_form_adhesion ==========");
    console.log("===============================================");
    
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo(); // loads document properties and worksheets
    console.log("NOM FICHIER SHEET: ",doc.title); //nom du fichier
    
    //const sheet = doc.sheetsByIndex[1]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    //var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("feuilleTOTO");
    // const sheet = doc.sheetsByTitle['feuilleTOTO']; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    const sheet = doc.sheetsByTitle['adhesion_annuelle_web'];
    console.log("NOM DU TABLEAU (ONGLET): ",sheet.title); //NOM DU TABLEAU (ONGLET)
    console.log("NOMBRE DE LIGNE DU TABLEAU: ",sheet.rowCount); // NOMBRE DE LIGNE DU TABLEAU

    // AJOUT DES INPUTS SAISIS DANS LA GOOGLE SHEET
    /* const newSheet = await doc.addSheet({ title: 'onglet1' }); */

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

    console.log("adherent_type: ", adherent_type);

    // DATE DE L'ADHÉSION
    //var today = new Date();
    var today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric'});

    //today.toLocaleDateString("fr-FR");
    //var today = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear() + "/" + today.getHours() + ":" + today.getMinutes();
    console.log("today:", today);

    

    // CALCUL DU PRIX
    
    if (adherent_type == "professeur" || adherent_type == "prof_famille" || adherent_type == "prof_stagiaire" || adherent_type == "prof_stagiaire_famille") {
        adherent_paiement_montant_adhesion = 42;
    };
    if (adherent_type == "prof_stagiaire1" || adherent_type == "prof_stagiaire1_famille") {
        adherent_paiement_montant_adhesion = 22;
    };
    console.log("CALCUL DU PRIX", adherent_paiement_montant_adhesion);
    //passer la variable dans la session pour la récupérer
    req.session.adherent_paiement_montant_adhesion = adherent_paiement_montant_adhesion;

    const moreRows = await sheet.addRows([
        //{ 'ID': '888', 'Nom': req.body.name, 'Mail': req.body.email, 'Categorie': 'prof'  },
        {
            'identifiant': req.session.identifiant,
            'adhesion_date': today,
            'adherent_type':adherent_type,
            'adherent_paiement_montant_adhesion':adherent_paiement_montant_adhesion,
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
            'adherent_prof_ecole1_ville': req.session.adherent_prof_ecole1_ville,
            'adherent_prof_ecole2': req.session.adherent_prof_ecole2,
            'adherent_prof_ecole2_adresse': req.session.adherent_prof_ecole2_adresse,
            'adherent_prof_ecole2_cp': req.session.adherent_prof_ecole2_cp,
            'adherent_prof_ecole2_ville': req.session.adherent_prof_ecole2_ville,
            'adherent_prof_ecole3': req.session.adherent_prof_ecole3,
            'adherent_prof_ecole3_cp': req.session.adherent_prof_ecole3_cp,
            'adherent_prof_ecole3_ville': req.session.adherent_prof_ecole3_ville,
            'adherent_prof_stagiaire_instrument1': req.session.adherent_prof_stagiaire_instrument1,
            'adherent_prof_stagiaire_instrument1_esa': req.session.adherent_prof_stagiaire_instrument1_esa,
            'adherent_prof_stagiaire_instrument1_prof': req.session.adherent_prof_stagiaire_instrument1_prof,
            'adherent_prof_stagiaire_instrument2': req.session.adherent_prof_stagiaire_instrument2,
            'adherent_prof_stagiaire_instrument2_esa': req.session.adherent_prof_stagiaire_instrument2_esa,
            'adherent_prof_stagiaire_instrument2': req.session.adherent_prof_stagiaire_instrument2_prof_prof,
            'adherent_eleve1_type': req.session.adherent_eleve1_type,
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
            'adherent_eleve2_type': req.session.adherent_eleve2_type,
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
            'adherent_eleve3_type': req.session.adherent_eleve3_type,
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
            'adherent_eleve4_type': req.session.adherent_eleve4_type,
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
            'adherent_eleve5_type': req.session.adherent_eleve5_type,
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
    
    const rows = await sheet.getRows();
    //console.log(rows);
    console.log("row: ", rows[0].identifiant);
    console.log("nombre de row : " + sheet.rowCount);



    // REDIRECTION VERS LA PAGE PAIEMENT
    res.redirect('/inscription/adhesion_paiement');
}

const post_form_montant_total = async function(req, res){
    // MONTANT TOTAL À PAYER

    //let montant_adhesion = req.session.adherent_paiement_montant_adhesion;
    req.session.adherent_paiement_montant_don = req.body.adherent_paiement_montant_don;
    console.log ("req.body.adherent_paiement_montant_don: ",req.body.adherent_paiement_montant_don);
    console.log ("req.session.adherent_paiement_montant_adhesion: ",req.session.adherent_paiement_montant_adhesion);
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
    res.redirect('/inscription/adhesion_paiement');
}




module.exports = {
    checkMail,
    post_form_adhesion,
    post_form_montant_total
}









