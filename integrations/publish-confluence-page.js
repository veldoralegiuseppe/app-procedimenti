const axios = require('axios');
const fs = require('fs');

const confluenceDomain = ''; // Modifica con il tuo dominio Confluence
const spaceKey = 'MedSuite'; // Modifica con il key dello spazio Confluence
const parentPageId = '1998871'; // Modifica con l'ID della pagina genitore
const email = ''; // Modifica con la tua email Confluence
const apiToken = ''; // Modifica con il tuo token API
const newVersionName = require('./package.json').version; // Ottieni la versione dal package.json

// Leggi il changelog generato da Standard Version
const changelog = fs.readFileSync('./CHANGELOG.md', 'utf8');

// Crea una nuova pagina su Confluence
const publishPageToConfluence = async () => {
  try {
    const response = await axios.post(
      `${confluenceDomain}/rest/api/content`,
      {
        title: `Release Notes - Versione ${newVersionName}`,
        type: 'page',
        space: {
          key: spaceKey,
        },
        ancestors: [
          {
            id: parentPageId,
          },
        ],
        body: {
          storage: {
            value: `<h1>Note di rilascio - Versione ${newVersionName}</h1><pre>${changelog}</pre>`,
            representation: 'storage',
          },
        },
      },
      {
        auth: {
          username: email,
          password: apiToken,
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`Nuova pagina su Confluence per la versione ${newVersionName} creata:`, response.data);
  } catch (error) {
    console.error('Errore nella creazione della pagina su Confluence:', error);
  }
};

// Esegui la funzione
publishPageToConfluence();
