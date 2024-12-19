import * as React from 'react';
import { useModelArrayStore, useStoreDependencies } from '@shared/hooks';
import Grid from '@mui/material/Grid2';
import { ComponentFactory } from '@shared/components';
import _ from 'lodash';

const FormComponentVanilla = ({index, propsArrayStore}) => {
  //console.log('index', index, 'propsArrayStore', propsArrayStore);
  const { getItem } = useModelArrayStore(propsArrayStore);
  const {size, component, owner, key: fieldKey, dependencies, ...props} = getItem(index);
 
  const [properties, setProperties] = React.useState(props);
  const {value} = useStoreDependencies({
    fieldKey,
    storeType: owner,
    dependencies,
    args: { props: properties },
    callback: ({changes}) => {
      if (changes && Object.entries(changes).some(([k, v]) => properties[k] !== v)) {
        setProperties((prev) => ({ ...prev, ...changes }));
      }
    },
  });
  
  //console.log('fiedlKey', fieldKey, 'value', value, 'properties', properties, 'owner', owner);
  const CustomComponent = component;
  const FieldComponent = React.useMemo(() => {
    return CustomComponent
      ? React.createElement(CustomComponent, {value, ...properties, fieldKey, owner})
      : React.createElement(ComponentFactory.InputFactory, {value, ...properties, fieldKey, owner});
  }, [CustomComponent, value, properties, fieldKey, owner]);

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
