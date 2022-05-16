URL du formulaire d'adhésion annuelle

http://localhost:8888/inscription/adhesion






https://www.juliechaumard.paris/wopi/


http://www.adusuki.juliechaumard.paris/inscription/adhesion
http://www.adusuki.juliechaumard.paris/inscription/stage
http://www.adusuki.juliechaumard.paris/inscription/concert

https://www.juliechaumard.paris/
index

Adhérer http://www.adusuki.juliechaumard.paris/inscription/adhesion
s'inscrire au stage http://www.adusuki.juliechaumard.paris/inscription/stage2022



http://www.adusuki.juliechaumard.paris/
    https://www.juliechaumard.paris/




http://www.adusuki.juliechaumard.paris/inscription/adhesion/

prof



STRIPE
TEST CARD

ok normal
4242424242424242

ok 3DS
4000000000003063

pb
4000000000000002


EXEMPLE DE SESSION RETOUR

{ id:
   'cs_test_a1pEXcsXnrk5CLpDBHkOa7BYPCOvgHKiuZLXlnWWvNJe6CF64sZMjNX63g',
  object: 'checkout.session',
  after_expiration: null,
  allow_promotion_codes: null,
  amount_subtotal: 100,
  amount_total: 100,
  automatic_tax: { enabled: false, status: null },
  billing_address_collection: null,
  cancel_url:
   'http://localhost:8888/inscription/adhesion_paiement/annule?id={CHECKOUT_SESSION_ID}',
  client_reference_id: null,
  consent: null,
  consent_collection: null,
  currency: 'eur',
  customer: 'cus_LeUbVFqyYkcPLQ',
  customer_creation: 'always',
  customer_details:
   { address:
      { city: null,
        country: 'FR',
        line1: null,
        line2: null,
        postal_code: null,
        state: null },
     email: 'customer@example.com',
     name: 'julie',
     phone: null,
     tax_exempt: 'none',
     tax_ids: [] },
  customer_email: 'customer@example.com',
  expires_at: 1652108474,
  livemode: false,
  locale: null,
  metadata: {},
  mode: 'payment',
  payment_intent: 'pi_3KxBbiBAHsmvBJpQ0ifiEeAK',
  payment_link: null,
  payment_method_options: {},
  payment_method_types: [ 'card' ],
  payment_status: 'paid',
  phone_number_collection: { enabled: false },
  recovered_from: null,
  setup_intent: null,
  shipping: null,
  shipping_address_collection: null,
  shipping_options: [],
  shipping_rate: null,
  status: 'complete',
  submit_type: 'donate',
  subscription: null,
  success_url:
   'http://localhost:8888/inscription/adhesion_paiement/reussi?id={CHECKOUT_SESSION_ID}',
  total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
  url: null }



  router.get('/adhesion_paiement/reussi', async (req, res) => {
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
    console.log("customer_email: ", customer_email);
    console.log("payment_status: ", payment_status);

    res.render('page_templates/adhesion_paiement_reussi.ejs');
});