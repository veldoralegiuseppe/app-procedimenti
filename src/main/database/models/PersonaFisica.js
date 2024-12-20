import mongoose from 'mongoose';
import {
  PersonaFisicaEnumsV1 as enums,
  PersonaEnumsV1,
  ModelTypes,
} from '@shared/metadata';
import { getTransazioneSchema } from './Transazione';

const PersonaFisicaSchema = (version = '1.0') => {
  const TransazioneSchema = getTransazioneSchema(version);

  return new mongoose.Schema(
    {
      capComuneNascita: { type: Number },
      capComuneResidenza: { type: Number },
      codiceFiscale: { type: String },
      cognome: { type: String, required: true },
      nome: { type: String, required: true },
      comuneNascita: { type: String },
      comuneResidenza: { type: String },
      dataNascita: { type: Date },
      indirizzoResidenza: { type: String },
      provinciaNascita: { type: String },
      provinciaResidenza: { type: String },
      ruolo: {
        type: String,
        required: true,
        enum: Object.values(PersonaEnumsV1.ruolo),
      },
      sesso: { type: String, enum: enums.sesso },
      partitaIVA: { type: String },
      pecEmail: { type: String, match: /.+@.+\..+/ },
      cognomeRappresentanteLegale: { type: String },
      nomeRappresentanteLegale: { type: String },
      pecEmailRappresentanteLegale: { type: String, match: /.+@.+\..+/ },
      note: { type: String },

      // Riferimenti alle spese
      speseAvvio: {
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
      spesePositivoOltrePrimoIncontro: {
        type: TransazioneSchema,
        required: true,
      },
      spesePositivoPrimoIncontro: {
        type: TransazioneSchema,
        required: true,
      },
      spesePostali: {
        type: TransazioneSchema,
        required: true,
      },

      // Metadata
      type: {
        type: String,
        required: true,
        default: ModelTypes.PERSONA_FISICA,
      },
      version: { type: String, required: true },
    },
    { timestamps: true }
  );
};

const PersonaFisica = (version = '1.0') => {
  const schema = PersonaFisicaSchema(version);
  return mongoose.model(`PersonaFisicaV${version.replace('.', '_')}`, schema);
};

export default PersonaFisica;
