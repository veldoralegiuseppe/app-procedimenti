import * as React from 'react';
import { useModelArrayStore, useStoreDependencies } from '@ui-shared/hooks';
import Grid from '@mui/material/Grid2';
import { ComponentFactory } from '@ui-shared/components';
import _ from 'lodash';

const FormComponentVanilla = ({index, propsArrayStore}) => {
  //console.log('index', index, 'propsArrayStore', propsArrayStore);
  const { getItem } = useModelArrayStore(propsArrayStore);
  const {size, component, owner, key: fieldKey, dependencies, ...properties} = getItem(index);
 
  const [overrideProps, setOverrideProps] = React.useState({});
  const mergedProps = React.useMemo(() => {
    console.log('ricalcolo mergedProps', 'properties', properties, 'overrideProps', overrideProps, 'merged', _.merge({}, properties, overrideProps));
    return _.merge({}, properties, overrideProps);
  }, [properties, overrideProps]);


  const {value} = useStoreDependencies({
    fieldKey,
    storeType: owner,
    dependencies,
    args: { properties: mergedProps },
    callback: ({changes}) => {
      const overrides = {}

      _.forOwn(changes, (v, k) =>  {
        if(!_.isEqual(properties[k], v)) _.merge(overrides, {[k]: v})
      });

      console.log('overrides', overrides);
      setOverrideProps((prev) => _.isEqual(overrides, prev) ? prev :  overrides);
    },
  });
  
  //console.log('fiedlKey', fieldKey, 'value', value, 'properties', properties, 'owner', owner);
  const CustomComponent = component;
  const FieldComponent = React.useMemo(() => {
    return CustomComponent
      ? React.createElement(CustomComponent, {value, ...mergedProps, fieldKey, owner})
      : React.createElement(ComponentFactory.InputFactory, {value, ...mergedProps, fieldKey, owner});
  }, [CustomComponent, value, mergedProps, fieldKey, owner]);

  return (
    <Grid
      key={properties?.key}
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
