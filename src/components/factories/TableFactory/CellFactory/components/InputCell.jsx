import * as React from 'react';
import ComponentFactory from '@components/factories/ComponentFactory';
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
  const { component: CustomComponent, ...restProps } = props;
 
  if (CustomComponent) {
    return <CustomComponent {...restProps} />;
  } else
    return <ComponentFactory.InputFactory {...restProps} />;
};

InputCell.propTypes = {
    component: PropTypes.elementType,
};
export default InputCell;
