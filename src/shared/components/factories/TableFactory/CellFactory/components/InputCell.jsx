import * as React from 'react';
import { ComponentFactory } from '@shared/components';
import { useStoreDependencies } from '@shared/hooks';

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
  const {value} = useStoreDependencies({
    fieldKey,
    storeType: owner,
    dependencies,
    args: { properties },
    callback: ({changes}) => {
      if (Object.entries(changes).some(([k, v]) => properties[k] !== v)) {
        setProperties((prev) => ({ ...prev, ...changes }));
      }
    },
  });

  const FieldComponent = CustomComponent
    ? React.createElement(CustomComponent, {
        fieldKey,
        ...properties,
        value,
      })
    : React.createElement(ComponentFactory.InputFactory, {
        fieldKey,
        ...properties,
        value,
      });

  return FieldComponent;
};

export default InputCell;
