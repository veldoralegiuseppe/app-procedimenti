import { create } from 'zustand';

const useCreateStore = ({storeInterface, ...rest}) =>
    create((set, get) => storeInterface({ set, get, ...rest }));

export default useCreateStore;
