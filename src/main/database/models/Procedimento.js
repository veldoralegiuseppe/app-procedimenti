import mongoose from 'mongoose';
import { ProcedimentoEnumsV1 as enums, ModelTypes } from '@shared/metadata';
import { getTransazioneSchema } from './Transazione';

const ProcedimentoSchema = (version = '1.0') => {
  // Funzione per risolvere riferimenti dinamici
  const TransazioneSchema = getTransazioneSchema(version);

  return new mongoose.Schema(
    {
      _id: {
        type: String, // Usa `numProtocollo` come `_id`
      },
      numProtocollo: {
        type: String,
        required: true,
        unique: true, // Deve essere unico
      },
      dataDeposito: { type: Date, required: true },
      valoreControversia: { type: Number, required: true, min: 0 },
      oggettoControversia: {
        type: String,
        required: true,
        enum: enums.oggettoControversia,
      },
      sedeDeposito: { type: String },
      sedeSvolgimento: { type: String },
      causaleDemandata: { type: String },
      esitoMediazione: { type: String, enum: enums.esitoMediazione },
      dataOraIncontro: { type: Date },
      modalitaSvolgimento: { type: String, enum: enums.modalitaSvolgimento },
      titoloMediatore: { type: String },
      nomeMediatore: { type: String },
      cognomeMediatore: { type: String },

      // Riferimenti dinamici alle spese
      compensoMediatore: {
        type: TransazioneSchema,
        required: true,
      },
      speseAvvioSedeSecondaria: {
        type: TransazioneSchema,
        required: true,
      },
      speseIndennitaSedeSecondaria: {
        type: TransazioneSchema,
        required: true,
      },

      // Persone (dinamiche)
      persone: [
        {
          type: Object, 
          required: true,
        },
      ],
      
      // Metadata
      type: { type: String, required: true, default: ModelTypes.PROCEDIMENTO },
      version: { type: String, required: true, default: version },
    },
    { timestamps: true, id: false }
  );
};

const Procedimento = (version = '1.0') => {
  const schema = ProcedimentoSchema(version);
  return mongoose.model(`ProcedimentoV${version.replace('.', '_')}`, schema);
};

export default Procedimento;
