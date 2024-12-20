import mongoose from 'mongoose';
import { TransazioneEnumsV1 as enums } from '@shared/metadata';
import { ModelTypes } from '@shared/metadata';

const TransazioneSchema = (version = '1.0') => {
 
  return new mongoose.Schema({
    nome: { type: String, required: true },
    key: { type: String, required: true },
    stato: { type: String, required: true, enum: Object.values(enums.stato) },
    tipo: { type: String, enum: Object.values(enums.tipo) },
    importoDovuto: { type: Number, required: true, default: 0 },
    importoCorrisposto: { type: Number, required: true, default: 0 },
    type: { type: String, required: true, default: ModelTypes.TRANSAZIONE },
    version: { type: String, required: true, default: version },
  });
};

// Funzione per creare il modello basato sulla versione
const Transazione = (version = '1.0') => {
  const schema = TransazioneSchema(version);
  return mongoose.model(`TransazioneV${version.replace('.', '_')}`, schema);
};

export { TransazioneSchema as getTransazioneSchema, Transazione as getTransazioneModel };
