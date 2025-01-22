import { useState, useCallback, useRef, useEffect } from 'react';
import { ModelTypes } from '@shared/metadata';
import { useGenerateInputProps, useMetadata } from '@ui-shared/hooks';
import { debounce } from 'lodash';
import { StringUtils } from '@ui-shared/utils';
import { PersonaEnumsV1 } from '@shared/metadata';

const useFormPersona = () => {
  const [tipoPersona, setTipoPersona] = useState(ModelTypes.PERSONA_FISICA);
  const [ruoloPersona, setRuoloPersona] = useState(
    PersonaEnumsV1.ruolo.PARTE_ISTANTE
  );
  const [formSelected, setFormSelected] = useState(ModelTypes.PERSONA_FISICA);
  const containerRef = useRef(null);
  const { enums } = useMetadata();

  useEffect(() => {
    if (tipoPersona != null) setFormSelected(tipoPersona);
  }, [tipoPersona]);

  const radioTipoPersonaOptions = [
    ModelTypes.PERSONA_FISICA,
    ModelTypes.PERSONA_GIURIDICA,
  ].map((type) => ({
    label: StringUtils.fromCamelCase(type).toUpperCase(),
    value: type,
  }));

  const radioRuoloPersonaOptions = [
    PersonaEnumsV1.ruolo.PARTE_ISTANTE,
    PersonaEnumsV1.ruolo.CONTROPARTE,
  ].map((type) => ({
    label: type,
    value: type,
  }));

  const handleRadioChange = useCallback((event) => {
    let isTipo = Object.values(radioTipoPersonaOptions).some(
      (option) => option.value === event.target.value
    );

    if (isTipo) {
      setTipoPersona(null);

      debounce(() => {
        setTipoPersona(event.target.value);
      }, 150)();
    } else {
      setRuoloPersona(event.target.value);
    }
  }, []);

  const inputPropsGenerators = {
    [ModelTypes.PERSONA_FISICA]: useGenerateInputProps({
      modelType: ModelTypes.PERSONA_FISICA,
      overrides: { common: { required: false } },
    }).getInputPropsArray,
    [ModelTypes.PERSONA_GIURIDICA]: useGenerateInputProps({
      modelType: ModelTypes.PERSONA_GIURIDICA,
      overrides: { common: { required: false } },
    }).getInputPropsArray,
  };

  const renderForm = (type) => ({
    key: type,
    inputPropsArray: inputPropsGenerators[type](
      enums[type].sezione.RICERCA_AVANZATA
    ),
    type,
  });

  return {
    tipoPersona,
    ruoloPersona,
    formSelected,
    containerRef,
    radioTipoPersonaOptions,
    radioRuoloPersonaOptions,
    handleRadioChange,
    renderForm,
  };
};

export default useFormPersona;
