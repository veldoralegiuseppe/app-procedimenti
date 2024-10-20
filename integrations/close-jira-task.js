require('dotenv').config(); // Carica il file .env
const simpleGit = require('simple-git');
const axios = require('axios');

const jiraDomain = process.env.JIRA_DOMAIN; 
const email = process.env.ATLASSIAN_EMAIL; ; // Modifica con la tua email Jira
const apiToken = process.env.ATLASSIAN_API_TOKEN;
const transitionIdToClose = '31'; // Imposta l'ID della transizione per chiudere il task Jira
const currentVersion = require('./package.json').version; // Ottieni la versione dal package.json

// Configura Simple Git per ottenere i commit
const git = simpleGit();

// Funzione per chiudere il task Jira
const closeJiraTask = async (issueId, componente) => {
  try {

    // Aggiorna i campi personalizzati (Componente, Versione)
    await updateJiraTask(issueId, componente);

    // Chiude il task 
    const response = await axios.post(
      `${jiraDomain}/rest/api/3/issue/${issueId}/transitions`,
      {
        transition: {
          id: transitionIdToClose,
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

    console.log(`Task Jira ${issueId} chiuso con successo.`);
  } catch (error) {
    console.error(`Errore nella chiusura del task Jira ${issueId}:`, error);
  }
};

// Funzione per trovare l'ID del campo personalizzato in base al nome (case insensitive)
const getCustomFieldId = async (fieldName) => {
  try {
    // Fai una richiesta all'API di Jira per ottenere tutti i campi
    const fieldsResponse = await axios.get(`${jiraDomain}/rest/api/3/field`, {
      auth: {
        username: email,
        password: apiToken,
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const fields = fieldsResponse.data;

    // Trova il campo con il nome corrispondente (case insensitive)
    const field = fields.find(f => f.name.toLowerCase() === fieldName.toLowerCase());

    if (field) {
      return field.id; // Restituisci l'ID del campo
    } else {
      throw new Error(`Campo personalizzato "${fieldName}" non trovato.`);
    }
  } catch (error) {
    console.error('Errore nella ricerca del campo personalizzato:', error);
    throw error;
  }
};

// Funzione aggiornata per aggiornare i campi di un task Jira, incluso il campo "componente"
const updateJiraTask = async (issueId, componente) => {
  try {
    // Trova l'ID del campi personalizzati
    const componenteId = await getCustomFieldId('Componente');
    const versioneId = await getCustomFieldId('Versione');

    // Gestisco i valori in input
    const componentArray = Array.isArray(componente) ? componente : [componente];
    
    // Aggiorna il campo "Componente" con il valore fornito
    const response = await axios.put(
      `${jiraDomain}/rest/api/3/issue/${issueId}`,
      {
        fields: {
          [componenteId]: componentArray, 
          [versioneId]: [currentVersion], 
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
    console.log(`Task Jira ${issueId} aggiornato con successo con il componente: ${componente}`);
  } catch (error) {
    console.error(`Errore nell'aggiornamento del task Jira ${issueId}:`, error.response ? error.response.data : error.message);
  }
};

// Funzione principale per processare i commit e chiudere il task
const processCommits = async () => {
  try {
    // Ottieni gli ultimi commit
    const log = await git.log();
    const lastCommit = log.latest;
    const commitMessage = lastCommit.message;

    console.log('Ultimo messaggio di commit:', commitMessage);

    // Cerca il pattern Standard Version "<tipo>(scope1,scope2,...,scopeN): descrizione"
    const regex = /^(?<type>\w+)(\((?<scopes>[^\)]+)\))?: (?<description>.+)/;
    const match = commitMessage.match(regex);

    if (match) {
      const { type, scopes, description } = match.groups;
      console.log(`Tipo: ${type}`);
      
      let scopeArray = [];
      if (scopes) {
        // Dividi gli scope separati da virgola in un array
        scopeArray = scopes.split(',').map(scope => scope.trim());
        console.log(`Scopes: ${scopeArray.join(', ')}`);
      } else {
        console.log('Nessuno scope trovato.');
      }
      
      console.log(`Descrizione: ${description}`);

      // Cerca anche il pattern "Closes <id task jira>"
      const footerRegex = /Closes (\w+-\d+)/i;
      const footerMatch = commitMessage.match(footerRegex);

      if (footerMatch) {
        const jiraTaskId = footerMatch[1]; // Es. "PROJ-123"
        console.log(`Task Jira trovato: ${jiraTaskId}`);
        await closeJiraTask(jiraTaskId, scopeArray); // Chiudi il task Jira
      } else {
        console.log('Nessun task Jira da chiudere trovato nel commit.');
      }
    } else {
      console.log('Il commit non è nel formato standard version.');
    }
  } catch (error) {
    console.error('Errore nell\'analisi del commit:', error);
  }
};

// Esegui la funzione
processCommits();
