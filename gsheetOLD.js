const maFonction = async function accessSpreadsheet() {
    /* on appelle le module Google*/
    const { GoogleSpreadsheet } = require('google-spreadsheet');
    const creds = require('./testapi336520-3105cc3caa46.json');

    // Initialize the sheet - doc ID is the long id in the sheets URL
    // google sheet TestAPISheets
    //const doc = new GoogleSpreadsheet('1gULmI-fWtc_32QOMjai9g5juQEVwCuh31qwqbBst5cY');
    
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
        { 'ID adhérent': '888', 'Nom adhérent': 'serge', 'Mail adhérent': 'serge@mail.com', 'Catégorie adhérent': 'prof'  },
        { 'ID adhérent': '888', 'Nom adhérent': 'serge', 'Mail adhérent': 'serge@mail.com', 'Catégorie adhérent': ''  },
      ]);
    
    const rows = await sheet.getRows();
    console.log(rows);
}

maFonction();









