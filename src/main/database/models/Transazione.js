import mongoose from 'mongoose';
import { TransazioneMetadata } from '@features/transazione';
import { FieldTypes } from '@ui-shared/metadata';

const TransazioneSchema = (version = '1.0') => {
  const metadata = TransazioneMetadata[version];

  if (!metadata) {
    throw new Error(`Metadata for version ${version} not found`);
  }

  const { enums } = metadata;

  return new mongoose.Schema({
    nome: { type: String, required: true },
    key: { type: String, required: true },
    stato: { type: String, required: true, enum: Object.values(enums.stato) },
    tipo: { type: String, enum: Object.values(enums.tipo) },
    importoDovuto: { type: Number, required: true, default: 0 },
    importoCorrisposto: { type: Number, required: true, default: 0 },
    type: { type: String, required: true, default: FieldTypes.TRANSAZIONE },
    version: { type: String, required: true, default: version },
  });
};

// Funzione per creare il modello basato sulla versione
const Transazione = (version = '1.0') => {
  const schema = TransazioneSchema(version);
  return mongoose.model(`TransazioneV${version.replace('.', '_')}`, schema);
};

export default Transazione;
