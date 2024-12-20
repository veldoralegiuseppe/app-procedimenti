import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useCreateStore = ({ storeInterface, ...rest }) =>
  create(subscribeWithSelector((set, get, api) => 
    storeInterface({ set, get, subscribe: api.subscribe, ...rest })
  ));

export default useCreateStore;
