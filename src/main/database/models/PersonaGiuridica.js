import mongoose from 'mongoose';
import { PersonaGiuridicaMetadataV1, PersonaEnumsV1 } from '@features/persona';
import { FieldTypes } from '@ui-shared/metadata';

const PersonaGiuridicaSchema = (version = '1.0') => {
  const metadata = PersonaGiuridicaMetadataV1;

  if (!metadata || metadata.version !== version) {
    throw new Error(`Metadata for version ${version} not found`);
  }

  const { enums } = metadata;

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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TransazioneV1',
        required: true,
      },
      spesePostali: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TransazioneV1',
        required: true,
      },
      speseIndennita: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TransazioneV1',
        required: true,
      },
      speseMancatoAccordo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TransazioneV1',
        required: true,
      },
      spesePositivoPrimoIncontro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TransazioneV1',
        required: true,
      },
      spesePositivoOltrePrimoIncontro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TransazioneV1',
        required: true,
      },

      // Metadata
      type: {
        type: String,
        required: true,
        default: FieldTypes.PERSONA_GIURIDICA,
      },
      version: { type: String, required: true, default: version },
    },
    { timestamps: true } // Aggiunge campi createdAt e updatedAt automaticamente
  );
};

// Funzione per creare un modello specifico per la versione
const PersonaGiuridica = (version = '1.0') => {
  const schema = PersonaGiuridicaSchema(version);
  return mongoose.model(
    `PersonaGiuridicaV${version.replace('.', '_')}`,
    schema
  );
};

export default PersonaGiuridica;
