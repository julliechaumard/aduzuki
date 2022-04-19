let post_verification_mail = function(request, response){
    /* pour voir les informations générées par la requêtes */
    // si un champ du formulaire est vide ou est du vide
   if (request.body.email === undefined || request.body.email === '') {
        // message d'erreur si saisie de mail est vide
        console.log("email non saisi");
        // affichage de la page sans l'aide de session
        //response.render('index', {form_verification_mail_error: 'Vous n\'avez pas saisi d\'adresse électronique'});

        // avec l'aide de session
        request.session.form_verification_mail_error = 'Vous n\'avez pas saisi d\'adresse électronique';
        // retour à la page d'acueil
        response.redirect('/adhesion/formulaire_adhesion_annuelle');
        console.log("après le render");
        console.log(request.body);
    }
    else {
        console.log("email saisi");
        // affichage de la page sans l'aide de session
        // response.render('index', {test: 'FORMULAIRE COMPLÉTÉ'});

        //avec l'aide de session
        // avec l'aide de session
        request.session.form_verification_mail_saved = 'MAIL SAUVEGARDÉ';

        // Copie des informations saisie dans la google sheet
        const maFonction = async function accessSpreadsheet() {
            /* on appelle le module Google*/
            const { GoogleSpreadsheet } = require('google-spreadsheet');
            const creds = require('./testapi336520-3105cc3caa46.json');
        
            // Initialize the sheet - doc ID is the long id in the sheets URL
            // google sheet TestAPISheets
            // const doc = new GoogleSpreadsheet('1gULmI-fWtc_32QOMjai9g5juQEVwCuh31qwqbBst5cY');
            // google sheet aduzuki_DB
            const doc = new GoogleSpreadsheet('1BhpYj-KtsyC8inXIDVl-zldDYRuhEqPwBFvP45FtJkI');
        
            await doc.useServiceAccountAuth(creds);
        
            await doc.loadInfo(); // loads document properties and worksheets
            console.log(doc.title);
            
            const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
            console.log(sheet.title);
            console.log(sheet.rowCount);
        
            // adding feuilles
            /* const newSheet = await doc.addSheet({ title: 'onglet1' }); */
        
            const moreRows = await sheet.addRows([
                { 'ID': '888', 'Nom': request.body.name, 'Mail': request.body.email, 'Categorie': 'prof'  },
              ]);
            
            const rows = await sheet.getRows();
            //console.log(rows);
            console.log(rows[0].Mail);
            console.log("nombre de row : " + sheet.rowCount);

            // mettre les mails dans un array
            let lesmails = new Array;
            let compteur = sheet.rowCount - 1;
            console.log(compteur);
            for (let i=0; i<compteur; i++) {
                
                    lesmails[i] = rows[i].Mail;
                
                    console.log(rows[i].Mail);
                    console.log("i = "+ i);

            }
            // afficher un array
            console.info(lesmails);

            // recherche le mail saisi dans le array des tous les mails
            console.log(lesmails.includes(request.body.email));
            if (lesmails.includes(request.body.email) === true){
                request.session.form_verification_mail_error = 'Vous ètes défà inscrit';
                response.redirect('/adhesion/formulaire_adhesion_annuelle');
            } else {
                request.session.form_verification_mail_error = 'Votre mail est absent, vous pouvez vous inscrire';
                response.redirect('/adhesion/formulaire_adhesion_annuelle');
            }
            
        }
        
        maFonction();

        // retour à la page d'acueil
        //response.redirect('/adhesion/formulaire_adhesion_annuelle');
        console.log(request.body);
    }
    
    
}