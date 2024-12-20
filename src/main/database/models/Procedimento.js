import mongoose from 'mongoose';
import { ProcedimentoMetadata } from '@features/procedimento';
import { FieldTypes } from '@shared/metadata';

const ProcedimentoSchema = (version = '1.0') => {
  const metadata = ProcedimentoMetadata[version];

  if (!metadata) {
    throw new Error(`Metadata for version ${version} not found`);
  }

  const { enums } = metadata;

  // Funzione per risolvere riferimenti dinamici
  const getSpesaRef = (version) => `TransazioneV${version.replace('.', '_')}`;

  return new mongoose.Schema(
    {
      numProtocollo: { type: String, required: true },
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
      dataOraIncontro: { type: Date, default: null },
      modalitaSvolgimento: { type: String, enum: enums.modalitaSvolgimento },
      titoloMediatore: { type: String },
      nomeMediatore: { type: String },
      cognomeMediatore: { type: String },

      // Riferimenti dinamici alle spese
      compensoMediatore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: getSpesaRef(version),
        required: true,
      },
      speseAvvioSedeSecondaria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: getSpesaRef(version),
        required: true,
      },
      speseIndennitaSedeSecondaria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: getSpesaRef(version),
        required: true,
      },

      // Persone (dinamiche)
      persone: [
        {
          type: {
            type: String,
            required: true,
            enum: [FieldTypes.PERSONA_FISICA, FieldTypes.PERSONA_GIURIDICA],
          },
          data: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
            validate: {
              validator: function (value) {
                if (this.type === FieldTypes.PERSONA_FISICA) {
                  const PersonaFisicaSchema = mongoose.model(
                    `PersonaFisicaV${version.replace('.', '_')}`
                  ).schema;
                  return (
                    PersonaFisicaSchema.validate(value).error === undefined
                  );
                }
                if (this.type === FieldTypes.PERSONA_GIURIDICA) {
                  const PersonaGiuridicaSchema = mongoose.model(
                    `PersonaGiuridicaV${version.replace('.', '_')}`
                  ).schema;
                  return (
                    PersonaGiuridicaSchema.validate(value).error === undefined
                  );
                }
                return false;
              },
              message: (props) =>
                `Persona non valida per il tipo ${props.value.type}`,
            },
          },
        },
      ],

      // Metadata
      type: { type: String, required: true, default: 'procedimento' },
      version: { type: String, required: true, default: version },
    },
    { timestamps: true }
  );
};

const Procedimento = (version = '1.0') => {
  const schema = ProcedimentoSchema(version);
  return mongoose.model(`ProcedimentoV${version.replace('.', '_')}`, schema);
};

export default Procedimento;
