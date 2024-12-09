import React, { useMemo } from 'react';
import {useCreateStore, useModelArray} from '@shared/hooks'
import FormComponent from '../components/FormComponent/FormComponent';

const useFormPresenter = (inputPropsArray) => {
  
  // Creazione dello store 
  const propsArrayStore = useCreateStore({storeInterface: useModelArray, initialItems: inputPropsArray});
  //console.log('propsArrayStore', propsArrayStore.getState());

  // Calcolo dei componenti 
  const renderFields = useMemo(() => {
    return inputPropsArray.map((props, index) => (
      <FormComponent key={`form-component-${props.fieldKey}-${index}`} index={index} propsArrayStore={propsArrayStore} />
    )) || null;
  }, [inputPropsArray]);
  
  return {
    renderFields,
  };
};

export default useFormPresenter;
