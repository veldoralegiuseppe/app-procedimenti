const simpleGit = require('simple-git');
const axios = require('axios');

const jiraDomain = ''; // Modifica con il tuo dominio Jira
const email = ''; // Modifica con la tua email Jira
const apiToken = ''; // Modifica con il tuo token API
const transitionIdToClose = '31'; // Imposta l'ID della transizione per chiudere il task Jira

// Configura Simple Git per ottenere i commit
const git = simpleGit();

// Funzione per chiudere il task Jira
const closeJiraTask = async (issueId) => {
  try {
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

// Funzione principale per processare i commit e chiudere il task
const processCommits = async () => {
  try {
    // Ottieni gli ultimi commit
    const log = await git.log();
    const lastCommit = log.latest;
    const commitMessage = lastCommit.message;

    console.log('Ultimo messaggio di commit:', commitMessage);

    // Cerca il pattern "Closes <id task jira>"
    const regex = /Closes (\w+-\d+)/i;
    const match = commitMessage.match(regex);

    if (match) {
      const jiraTaskId = match[1]; // Es. "PROJ-123"
      console.log(`Task Jira trovato: ${jiraTaskId}`);
      await closeJiraTask(jiraTaskId); // Chiudi il task Jira
    } else {
      console.log('Nessun task Jira da chiudere trovato nel commit.');
    }
  } catch (error) {
    console.error('Errore nell\'analisi del commit:', error);
  }
};

// Esegui la funzione
processCommits();
