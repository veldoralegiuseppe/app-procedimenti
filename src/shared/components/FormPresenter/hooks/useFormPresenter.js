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
  
  // // Memorizza il rendering della sezione personalizzata
  // // La memo dovrebbe essere indipendente dalle props che cambiano più spesso
  // const renderCustomSection = useMemo(() => {
  //   const override = renderOverrides.sezioni?.[sezione];
  //   if (!override?.component) return null;

  //   const CustomSectionComponent = override.component;
  //   return (
  //     <CustomSectionComponent
  //       key={sezione}
  //     />
  //   );
  // }, [renderOverrides.sezioni]);

  // // Memorizza il rendering dei campi
  // const renderFields = useMemo(() => {
  //   return inputPropsArray.map((props) => {
  //     const CustomComponent = renderOverrides.campi?.[props.key]?.component;
  //     const {
  //       size: responsiveSizeOverrides,
  //       options: optionsOverrides,
  //       ...restProps
  //     } = renderOverrides.campi?.[props.key] || {};

  //     const componentProps = {
  //       fieldKey: props.key,
  //       label: props.label,
  //       error: !!errors[props.key],
  //       helperText: errors[props.key],
  //       onChange,
  //       onBlur,
  //       options: optionsOverrides || props.options,
  //       theme,
  //       store,
  //       ...restProps,
  //     };

  //     // Usa InputFactory o un componente personalizzato
  //     const FieldComponent = CustomComponent
  //       ? React.createElement(CustomComponent, componentProps)
  //       : React.createElement(ComponentFactory.InputFactory, {
  //           ...componentProps,
  //         });

  //     if (!FieldComponent) return null;

  //     return (
  //       <Grid
  //         key={props.key}
  //         {...(responsiveSizeOverrides
  //           ? { size: responsiveSizeOverrides }
  //           : {})}
  //       >
  //         {FieldComponent}
  //       </Grid>
  //     );
  //   });
  // }, [inputPropsArray, renderOverrides.campi, errors, onChange, onBlur]);

  return {
    renderFields,
  };
};

export default useFormPresenter;
