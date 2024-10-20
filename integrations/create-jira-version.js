require('dotenv').config(); // Carica il file .env
const axios = require('axios');

const jiraDomain = process.env.JIRA_DOMAIN; // Modifica con il tuo dominio Jira
const projectId = 'MEDSUITE'; // Modifica con l'ID del progetto Jira
const email = process.env.ATLASSIAN_EMAIL; // Modifica con la tua email Jira
const apiToken = process.env.ATLASSIAN_API_TOKEN;
const newVersionName = require('./package.json').version; // Ottieni la versione dal package.json

// Crea una nuova versione su Jira
const createVersionOnJira = async () => {
  try {
    const response = await axios.post(
      `${jiraDomain}/rest/api/3/version`,
      {
        name: newVersionName,
        projectId: projectId,
        description: `Versione ${newVersionName} rilasciata automaticamente`,
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
    console.log(`Nuova versione ${newVersionName} creata su Jira:`, response.data);
  } catch (error) {
    console.error('Errore nella creazione della versione su Jira:', error);
  }
};

// Esegui la funzione
createVersionOnJira();
