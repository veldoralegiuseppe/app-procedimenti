import mongoose from 'mongoose';
import { PersonaEnumsV1, ModelTypes } from '@shared/metadata';
import { getTransazioneSchema } from './Transazione';

const PersonaGiuridicaSchema = (version = '1.0') => {
  const TransazioneSchema = getTransazioneSchema(version);

  return new mongoose.Schema(
    {
      denominazione: {
        type: String,
        required: true,
      },
      comuneSedeLegale: { type: String },
      provinciaSedeLegale: { type: String },
      capComuneSedeLegale: { type: String },
      indirizzoSedeLegale: { type: String },
      partitaIVA: { type: String },
      pecEmail: { type: String, match: /.+@.+\..+/ },
      nomeRappresentanteLegale: {
        type: String,
      },
      cognomeRappresentanteLegale: {
        type: String,
      },
      pecEmailRappresentanteLegale: { type: String, match: /.+@.+\..+/ },
      note: { type: String },
      ruolo: { type: String, enum: Object.values(PersonaEnumsV1.ruolo) },

      // Riferimenti alle spese
      speseAvvio: {
        type: TransazioneSchema,
        required: true,
      },
      spesePostali: {
        type: TransazioneSchema,
        required: true,
      },
      speseIndennita: {
        type: TransazioneSchema,
        required: true,
      },
      speseMancatoAccordo: {
        type: TransazioneSchema,
        required: true,
      },
      spesePositivoPrimoIncontro: {
        type: TransazioneSchema,
        required: true,
      },
      spesePositivoOltrePrimoIncontro: {
        type: TransazioneSchema,
        required: true,
      },

      // Metadata
      type: {
        type: String,
        required: true,
        default: ModelTypes.PERSONA_GIURIDICA,
      },
      version: { type: String, required: true, default: version },
    },
    { timestamps: true } // Aggiunge campi createdAt e updatedAt automaticamente
  );
};

// Funzione per creare un modello specifico per la versione
const PersonaGiuridica = (version = '1.0') => {
  const modelName = `PersonaGiuridicaV${version.replace('.', '_')}`;
  
  if (mongoose.models[modelName]) {
    // Se il modello esiste già, lo restituisce
    return mongoose.models[modelName];
  }

  // Altrimenti, crea e registra un nuovo modello
  const schema = PersonaGiuridicaSchema(version);
  return mongoose.model(modelName, schema);
};


export {PersonaGiuridicaSchema as getPersonaGiuridicaSchema, PersonaGiuridica as getPersonaGiuridicaModel};
