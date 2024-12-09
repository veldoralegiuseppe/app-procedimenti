import * as React from 'react';
import { ComponentFactory } from '@shared/factories';
import { useModelStore } from '@shared/hooks';
import { useStoreContext } from '@shared/context';
import PropTypes from 'prop-types';

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

  const store = useStoreContext(owner);
  const { getPropertyAndDependencies } = useModelStore(store);
  const wrappedDep = React.useMemo(() => {
    if (!dependencies) return {};

    return Object.entries(dependencies).reduce((acc, [key, value]) => {
      acc[key] = {
        namespace: value.namespace,
        callback: (key, oldValue, newValue) => {
          const changes = value.callback(key, oldValue, newValue, properties, store);
          if (Object.entries(changes).some(([k, v]) => properties[k] !== v)) {
            setProperties((prev) => ({ ...prev, ...changes }));
          }
        },
      };
      return acc;
    }, {});
  }, [dependencies, properties]);

  getPropertyAndDependencies(fieldKey, wrappedDep);

  const FieldComponent = CustomComponent
    ? React.createElement(CustomComponent, {
        fieldKey,
        ...properties,
      })
    : React.createElement(ComponentFactory.InputFactory, {
        fieldKey,
        ...properties,
      });

  return FieldComponent;
};

InputCell.propTypes = {
  component: PropTypes.elementType,
};
export default InputCell;
