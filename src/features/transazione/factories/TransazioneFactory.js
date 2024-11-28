import TransazioneMetadata from './metadata/TransazioneMetadata';

class TransazioneFactory{
    #version;
    #metadata;

    constructor(version = Object.keys(TransazioneMetadata).pop()){
        if(!TransazioneMetadata[version]){
            throw new Error(`Versione ${version} della transazione non supportata`);
        }
        this.#version = version;
        this.#metadata = TransazioneMetadata[version];
    }

    create(initialValues = {}){
        const transazione = {};

        Object.entries(this.#metadata).forEach(([key, value]) => {
            
            transazione[key] = initialValues[key] || value.default;
            const validations = value.validations?.[initialValues[key] ? 'onRetrieval' : 'onConstruction'] || {};

            validations.forEach((validation) => {
                const error = validation(transazione[key]);
                if(error){
                    throw new Error(`Errore di validazione per ${key}: ${error}`);
                }
            });
        });

        transazione.version = this.#version;
        return transazione;
    }

    get metadata(){
        return this.#metadata;
    }
}

export default TransazioneFactory;