import * as React from 'react';
import { ComponentFactory } from '@ui-shared/components';
import { useStoreDependencies } from '@ui-shared/hooks';
import _ from 'lodash';

/**
 * Componente InputCell
 *
 * Questo componente rende un componente personalizzato se fornito, altrimenti utilizza il componente InputFactory di ComponentFactory.
 *
 * @param {Object} props - Le proprietà passate al componente.
 * @param {React.Component} [props.component] - Componente personalizzato da renderizzare.
 * @param {...Object} restProps - Altre proprietà passate al componente.
 *
 * @returns {JSX.Element} - Il componente renderizzato.
 */
const InputCell = (props) => {
  const {
    component: CustomComponent,
    owner,
    fieldKey,
    dependencies,
    ...restProps
  } = props;

  const [properties, setProperties] = React.useState(restProps);
  const [overrideProps, setOverrideProps] = React.useState({});

  React.useEffect(() => {
    if (
      Object.entries(restProps).some(([k, v]) => !_.isEqual(properties[k], v))
    ) {
      console.log('aggiorno properties', restProps);
      setProperties((prev) => {
        return { ...prev, ...restProps };
      });
    }
  }, [restProps]);

  const mergedProps = React.useMemo(() => {
    console.log('ricalcolo mergedProps', 'properties', properties, 'overrideProps', overrideProps, 'merged', _.merge({}, properties, overrideProps));
    return _.merge({}, properties, overrideProps);
  }, [properties, overrideProps]);

  const { value } = useStoreDependencies({
    fieldKey,
    storeType: owner,
    dependencies,
    args: { properties: mergedProps },
    callback: ({ changes }) => {
      const overrides = {};

      _.forOwn(changes, (v, k) => {
        if (!_.isEqual(properties[k], v)) _.merge(overrides, { [k]: v });
      });

      console.log('overrides', mergedProps, overrides, _.isEqual(overrides, overrideProps));
      setOverrideProps((prev) => _.isEqual(overrides, prev) ? prev :  overrides);
    },
  });

  console.log('useStoreDependencies valuue', { fieldKey, value });
  const FieldComponent = React.useMemo(() => {
    console.log(
      'useStoreDependencies',
      'properties',
      properties,
      'overrideProps',
      overrideProps,
      'value',
      value
    );

    return CustomComponent
      ? React.createElement(CustomComponent, {
          fieldKey,
          value,
          ...mergedProps,
        })
      : React.createElement(ComponentFactory.InputFactory, {
          fieldKey,
          value,
          ...mergedProps,
        });
  }, [CustomComponent, fieldKey, value, mergedProps]);

  return FieldComponent;
};

export default InputCell;
