import * as React from 'react';
import { ComponentFactory } from '@shared/factories';
import { useStoreDependencies } from '@shared/hooks';
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
  useStoreDependencies({
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
