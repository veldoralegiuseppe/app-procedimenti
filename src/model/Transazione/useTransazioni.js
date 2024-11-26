import {create} from 'zustand';
import { useModelArray } from '@model/hooks/useModelArray';

const useTransazioni = (initialItems = []) => create((set, get) => ({
    model: {
        items: initialItems, 
    },
    ...useModelArray(set, get), 
}));

export { useTransazioni };
