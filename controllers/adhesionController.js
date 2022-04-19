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

/////////////////////////////////////////////////
// SAISIE DU MAIL
// VÉRIFIER SI DÉJÀ INSCRIT DANS GOOGLE
/////////////////////////////////////////////////
const checkMail = async function(req, res){

    console.log("Fonction checkMail");

        console.log("email saisi");


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
        console.log("lesmails.includes(req.body.email):",lesmails.includes(req.body.email));

        req.session.mail = req.body.email;
        if (lesmails.includes(req.body.email) === true){
            req.session.err_mail_form_adhesion = 'Vous êtes déjà inscrit';
            res.redirect('/inscription/adhesion');
        } else {
            console.log(req.body.check_prof);
            if (req.body.check_prof){
                console.log("true");
                console.log("true");
                res.redirect('/inscription/adhesion_prof');
            } else {
                console.log("false");
                res.end();
            }
            // REDICTION PAGE ACCUEIL
            //req.session.err_mail_form_adhesion = 'Votre mail est absent, vous pouvez vous inscrire';
            
        }
}



/////////////////////////////////////////////////
// CAS MAIL NON DÉJA INSCRIT
// AJOUT DES INFORMATIONS SAISIES DU FORMULAIRE DANS LA GOOGLE SHEET
/////////////////////////////////////////////////
const post_form_adhesion = async function(req, res){
        console.log("email saisi");

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
    
        console.log("req.body.nom: ",req.body.nom);
        console.log("req.session.mail: ",req.session.mail)

        req.session.nom = req.body.nom;
        const moreRows = await sheet.addRows([
            //{ 'ID': '888', 'Nom': req.body.name, 'Mail': req.body.email, 'Categorie': 'prof'  },
            {
                'identifiant': req.session.mail,
                'adherent_nom': req.session.nom,
                'adherent_prenom': req.session.prenom,
                'adherent_datenaissance': req.session.datenaiss,
                'adherent_adresse_rue': req.session.rue,
                'adherent_adresse_complement': req.session.complementadresse,
                'adherent_adresse_codepostal': req.session.codepostal,
                'adherent_adresse_ville': req.session.ville,
                'adherent_adresse_pays': req.session.pays,
                'adherent_telephone_mobile': req.session.telmobile,
                'adherent_telephone_fixe': req.session.telfixe,
                'adherent_mail': req.session.mail
            },
        ]);
        
        const rows = await sheet.getRows();
        //console.log(rows);
        console.log(rows[0].identifiant);
        console.log("nombre de row : " + sheet.rowCount);

        // mettre les mails dans un array
        let lesmails = new Array;
        let compteur = sheet.rowCount - 1;
        console.log(compteur);
        for (let i=0; i<compteur; i++) {
                lesmails[i] = rows[i].identifiant;
                console.log(rows[i].identifiant);
                console.log("i = "+ i);
        }
        // afficher un array
        console.info(lesmails);
        res.end();

}

module.exports = {
    checkMail,
    post_form_adhesion
}









