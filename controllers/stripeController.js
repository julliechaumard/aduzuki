const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
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

const post_req_bank = async function(req, res, next){

  console.log("===============================================");
  console.log("======== FUNCTION post_req_bank ==========");
  console.log("===============================================");

    console.log ("req.session.montant_apayer_cent: ",req.session.montant_apayer_cent);
    console.log ("req.session.identifiant: ",req.session.identifiant);
    console.log ("req.session.adherent_type: ",req.session.adherent_type);
    console.log ("process.env.STRIPE_PRIVATE_KEY : ", process.env.STRIPE_PRIVATE_KEY);
   
    // STRIPE - ETAPE 1 - CREER l'INTENTION DE PAIEMENT
    const session = await stripe.checkout.sessions.create({
      metadata: {identifiant: req.session.identifiant, profil:req.session.adherent_type},
      customer_email: req.session.identifiant,
      //There are four different submit types.
      submit_type: 'pay',
      success_url: 'http://localhost:8888/inscription/adhesion_paiement/reussi?id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:8888/inscription/adhesion_paiement/annule?id={CHECKOUT_SESSION_ID}',
      payment_method_types: ['card'],
      line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Adhesion annuelle ' + req.session.adherent_type,
            },
            unit_amount: req.session.adherent_paiement_montant_adhesion * 100,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Don',
            },
            unit_amount: req.session.adherent_paiement_montant_don * 100,
          },
          quantity: 1,
        }],
      //Checkout has three modes: payment, subscription, or setup. 
      mode: 'payment'

    });


    // STRIPE - ETAPE 2 - RÉCUPÉRATION DES DONNÉES DE LA SESSION ET ENVOYER LE PAIEMENT

    // DANS LES INFOS DE LA SESSION ON A l'URL DE PAIEMENT POUR CETTE SESSION AVEC LE ID DE CE PAIEMENT
    // POUR RÉCUPÉRER LES INFOS DE SESSION ON UTILISE "session.[nom de la données]"
    console.log("session: ",session)
    console.log("session.id: ",session.id);
    console.log("session.url: ",session.url);

    //Ici pour les mettre en json
    //res.json({
      //   id: session.id,
      //   url: session.url
    //});

    // ON REDIRIGE L'INTERNAUTE VERS L'URL STRIPE POUR QU'IL FASSE LE PAIEMENT
    // POUR LE RETOUR C'EST DANS LES URL success_url et cancel_url sur lesquelles on fait un get dans le js du router et on fait un script 
    // pour continuer le process et récupérer les infos contenues dans le get et envoyé par Stripe, comme par ex le code retour de la banque
    




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

    rows[rowToBeUpdate].adherent_paiement_montant_don = req.session.adherent_paiement_montant_don;
    rows[rowToBeUpdate].adherent_paiement_montant_total = req.session.montant_apayer;
    rows[rowToBeUpdate].adherent_paiement_mode = "carte bancaire";
    
    await rows[rowToBeUpdate].save();






    let url_stripe = session.url

    res.redirect(session.url)
    
}


const get_res_bank = async function(req, res){

  console.log("===============================================");
  console.log("======== FUNCTION get_res_banq ==========");
  console.log("===============================================");

    console.log ("on est dans la ROUTE /adhesion_paiement/reussi");
    var id = req.query.id;
    //  type = req.params.type;
    console.log("id = ", id);
    const session = await stripe.checkout.sessions.retrieve(id);

    console.log("======================================");
    console.log("======== SESSION ==========");
    console.log("======================================");
    console.info(session);
    var customer_email = session.customer_email;
    var payment_status = session.payment_status;
    var amount_total = session.amount_total/100;
    var stripe_customer = session.customer;
    var stripe_payment_intent = session.payment_intent;
    var payment_method_types = session.payment_method_types;
    var stripe_status = session.status;
    var profil = session.metadata.profil;
    var identifiant = session.metadata.identifiant;
  
    var profil1, profil2, profil3;
    if (profil === "professeur") {
      profil1 = "Professeur";
    }
    if (profil === "prof_famille") {
      profil1 = "Professeur";
      profil2 = "Élève";
    }
    if (profil === "prof_stagiaire") {
      profil1 = "Professeur";
      profil2 = "Professeur stagiaire";
    }
    if (profil === "prof_stagiaire_famille") {
      profil1 = "Professeur";
      profil2 = "Professeur stagiaire";
      profil3 = "Élève";
    }
    if (profil === "prof_stagiaire1") {
      profil1 = "Professeur stagiaire";
    }
    if (profil === "prof_stagiaire1_famille") {
      profil1 = "Professeur stagiaire";
      profil2 = "Élève";
    }


    console.log("customer_email: ", customer_email);
    console.log("payment_status: ", payment_status);
    console.log("stripe_customer: ", stripe_customer);
    console.log("amount_total: ", amount_total);
    console.log("stripe_payment_intent: ", stripe_payment_intent);
    console.log("payment_method_types: ", payment_method_types);
    console.log("stripe_status: ", stripe_status);
    console.log("metadata.profil: ", profil);

    res.locals.customer_email = customer_email;
    res.locals.payment_status = payment_status;
    res.locals.amount_total = amount_total;
    res.locals.stripe_customer = stripe_customer;
    res.locals.stripe_payment_intent = stripe_payment_intent;
    res.locals.payment_method_types = "carte bancaire";
    res.locals.stripe_status = stripe_status;
    res.locals.identifiant = identifiant;
    res.locals.profil1 = profil1;
    res.locals.profil2 = profil2;
    res.locals.profil3 = profil3;

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
        if (rows[i].identifiant === customer_email){
            console.log("IDENTIFIANT TROUVÉ DANS LE ARRAY 'rows' à i = ",i);
            rowToBeUpdate = i;
        }
    }
    moment().format();
    moment.locale('fr');
    var date_formattee = moment().format('L')
    console.log("date_formattee:", date_formattee);
    res.locals.today = date_formattee;
    rows[rowToBeUpdate].adherent_paiement_date = date_formattee;
    rows[rowToBeUpdate].adherent_paiement_CB_retour = "payment_status:"+payment_status+",stripe_customer:"+stripe_customer+",stripe_payment_intent:"+stripe_payment_intent+",sessionID:"+session.id+",payment_method_types:"+payment_method_types+",amount_total:"+amount_total+",stripe_status:"+stripe_status;
    rows[rowToBeUpdate].Adhesion_paye = "paye";

    
    await rows[rowToBeUpdate].save();





    res.render('page_templates/adhesion_paiement_reussi.ejs');
}

const get_res_bank_annul = async function(req, res){

  console.log("===============================================");
  console.log("======== FUNCTION get_res_bank_annul ==========");
  console.log("===============================================");

  console.log ("on est dans la ROUTE /adhesion_paiement/annule");
  var id = req.query.id;
  //  type = req.params.type;
  console.log("id = ", id);
  const session = await stripe.checkout.sessions.retrieve(id);

  console.log("======================================");
  console.log("======== SESSION ==========");
  console.log("======================================");
  console.info(session);
  var customer_email = session.customer_email;
  var payment_status = session.payment_status;
  var amount_total = session.amount_total/100;
  var stripe_customer = session.customer;
  var stripe_payment_intent = session.payment_intent;
  var payment_method_types = session.payment_method_types;
  var stripe_status = session.status;
  var profil = session.metadata.profil;
  var identifiant = session.metadata.identifiant;

  var profil1, profil2, profil3;
  if (profil === "professeur") {
    profil1 = "Professeur";
  }
  if (profil === "prof_famille") {
    profil1 = "Professeur";
    profil2 = "Élève";
  }
  if (profil === "prof_stagiaire") {
    profil1 = "Professeur";
    profil2 = "Professeur stagiaire";
  }
  if (profil === "prof_stagiaire_famille") {
    profil1 = "Professeur";
    profil2 = "Professeur stagiaire";
    profil3 = "Élève";
  }
  if (profil === "prof_stagiaire1") {
    profil1 = "Professeur stagiaire";
  }
  if (profil === "prof_stagiaire1_famille") {
    profil1 = "Professeur stagiaire";
    profil2 = "Élève";
  }

  console.log("customer_email: ", customer_email);
  console.log("payment_status: ", payment_status);
  console.log("stripe_customer: ", stripe_customer);
  console.log("amount_total: ", amount_total);
  console.log("stripe_payment_intent: ", stripe_payment_intent);
  console.log("payment_method_types: ", payment_method_types);
  console.log("stripe_status: ", stripe_status);
  console.log("metadata.profil: ", profil);

  res.locals.customer_email = customer_email;
  res.locals.payment_status = payment_status;
  res.locals.amount_total = amount_total;
  res.locals.stripe_customer = stripe_customer;
  res.locals.stripe_payment_intent = stripe_payment_intent;
  res.locals.payment_method_types = payment_method_types;
  res.locals.stripe_status = stripe_status;
  res.locals.identifiant = req.session.identifiant;
      res.locals.profil1 = profil1;
    res.locals.profil2 = profil2;
    res.locals.profil3 = profil3;

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
      if (rows[i].identifiant === customer_email){
          console.log("IDENTIFIANT TROUVÉ DANS LE ARRAY 'rows' à i = ",i);
          rowToBeUpdate = i;
      }
  }
  moment().format();
  moment.locale('fr');
  var date_formattee = moment().format('L')
  res.locals.today = date_formattee;
  rows[rowToBeUpdate].adherent_paiement_date = date_formattee;
  rows[rowToBeUpdate].adherent_paiement_CB_retour = "payment_status:"+payment_status+",stripe_customer:"+stripe_customer+",stripe_payment_intent:"+stripe_payment_intent+",sessionID:"+session.id+",payment_method_types:"+payment_method_types+",amount_total:"+amount_total+",stripe_status:"+stripe_status;
  rows[rowToBeUpdate].Adhesion_paye = "impaye";

  
  await rows[rowToBeUpdate].save();





  res.render('page_templates/adhesion_paiement_annule.ejs');
}


module.exports = {
    post_req_bank,
    get_res_bank,
    get_res_bank_annul
}