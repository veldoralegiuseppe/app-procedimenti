import mongoose from 'mongoose';
import { PersonaFisicaMetadata, PersonaEnumsV1 } from '@features/persona';
import { FieldTypes } from '@ui-shared/metadata';

const PersonaFisicaSchema = (version = '1.0') => {
  const metadata = PersonaFisicaMetadata[version];

  if (!metadata) {
    throw new Error(`Metadata for version ${version} not found`);
  }

  const { enums } = metadata;

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
      spesePositivoOltrePrimoIncontro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TransazioneV1',
        required: true,
      },
      spesePositivoPrimoIncontro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TransazioneV1',
        required: true,
      },
      spesePostali: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TransazioneV1',
        required: true,
      },

      // Metadata
      type: {
        type: String,
        required: true,
        default: FieldTypes.PERSONA_FISICA,
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
