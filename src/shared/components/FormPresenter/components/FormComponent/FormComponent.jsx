import * as React from 'react';
import { useModelArrayStore } from '@shared/hooks';
import Grid from '@mui/material/Grid2';
import { ComponentFactory } from '@shared/factories';
import _ from 'lodash';

const FormComponentVanilla = ({index, propsArrayStore}) => {
  //console.log('index', index, 'propsArrayStore', propsArrayStore);
  const { getItem } = useModelArrayStore(propsArrayStore);
  
  const {size, component, value, ...props} = getItem(index);

  const CustomComponent = component;
  const FieldComponent = CustomComponent
    ? React.createElement(CustomComponent, props)
    : React.createElement(ComponentFactory.InputFactory, props);

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
