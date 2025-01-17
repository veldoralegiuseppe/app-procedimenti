import * as React from 'react';
import { ComponentFactory } from '@ui-shared/components';
import { useStoreDependencies } from '@ui-shared/hooks';

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

  React.useEffect(() => {
    if(Object.entries(restProps).some(([k, v]) => properties[k] !== v)) {
      setProperties((prev) => {
        return { ...prev, ...restProps }
      });
    }
  }, [restProps]);

  const {value} = useStoreDependencies({
    fieldKey,
    storeType: owner,
    dependencies,
    args: { properties },
    callback: ({changes}) => {
      console.log('changes', changes);
      if (Object.entries(changes || {}).some(([k, v]) => properties[k] !== v)) {
        setProperties((prev) => {
          console.log('newProperties', { ...prev, ...changes });
          return { ...prev, ...changes }
        });
      }
    },
  });

  

  const FieldComponent = React.useMemo(() => {
    console.log('useStoreDependencies', properties, 'value', value);
    
    return CustomComponent
      ? React.createElement(CustomComponent, {
          fieldKey,
          value,
          ...properties
        })
      : React.createElement(ComponentFactory.InputFactory, {
          fieldKey,
          value,
          ...properties
        });
  }, [CustomComponent, fieldKey, value, properties]);

  return FieldComponent;
};

export default InputCell;
