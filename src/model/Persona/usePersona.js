import {create} from 'zustand';
import { Persona } from '@model/persona';
import { useModel } from '@model/hooks/useModel';

const usePersona = create((set, get) => ({
  model: new Persona(),
  ...useModel(set, get),
}));
