const {fromCamelCase} = require('@shared/utils')

const mapErrorToMessage = (error, type) => {
    let errorMessage;

    switch (error?.name) {
        case 'ValidationError':
          errorMessage = 'Errore di validazione dei dati.';
          break;
        case 'MongoNetworkError':
          errorMessage = 'Errore di rete durante la connessione a MongoDB.';
          break;
        case 'MongoServerError':
          if (error.code === 11000) {
            errorMessage = `${fromCamelCase(type)} già presente in archivio.`;
          } else {
            errorMessage = 'Errore del server MongoDB.';
          }
          break;
        case 'MongoParseError':
          errorMessage = 'Errore di parsing della query MongoDB.';
          break;
        default:
          errorMessage = error?.message || error || 'Errore sconosciuto';
      }

      return errorMessage;
}

module.exports = {
  mapErrorToMessage,
};