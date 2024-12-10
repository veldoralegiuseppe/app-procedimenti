import * as React from 'react';
import { useModelArrayStore, useModelStore } from '@shared/hooks';
import Grid from '@mui/material/Grid2';
import { ComponentFactory } from '@shared/factories';
import _ from 'lodash';
import {useStoreContext} from '@shared/context';

const FormComponentVanilla = ({index, propsArrayStore}) => {
  //console.log('index', index, 'propsArrayStore', propsArrayStore);
  const { getItem } = useModelArrayStore(propsArrayStore);
  const {size, component, owner, ...props} = getItem(index);

  const store = useStoreContext(owner);
  console.log('store', store?.getState(), 'fieldKey', props?.key, 'owner', owner);
  const {getProperty} = useModelStore(store);
  const value = getProperty(props?.key);
  
  const CustomComponent = component;
  const FieldComponent = CustomComponent
    ? React.createElement(CustomComponent, {...props, fieldKey: props?.key, value})
    : React.createElement(ComponentFactory.InputFactory, {...props, fieldKey: props?.key, value});

  return (
    <Grid
      key={props?.key}
      {...(size ? { size } : {})}
    >
      {FieldComponent}
    </Grid>
  );
};

const FormComponent = React.memo(FormComponentVanilla, (prevProps, nextProps) => {
    // Vengono assunte come dinamiche: sx, size
    return _.isEqual(
      prevProps.propsArrayStore.map(p => ({ sx: p.sx, size: p.size })),
      nextProps.propsArrayStore.map(p => ({ sx: p.sx, size: p.size }))
    );
});

export default FormComponent;
