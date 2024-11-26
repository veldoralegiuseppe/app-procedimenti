import {create} from 'zustand';
import { usePersona } from './usePersona';
import { useModelArray } from '@model/hooks/useModelArray';

const usePersone = create((set, get) => ({
  model: {
    items: [], 
  },
  ...usePersona(set, get),
  ...useModelArray(set, get), 
}));
