import React, { useState, useCallback, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import {
  RadioGroup,
  Accordion,
  FormTitle,
  ButtonFactory,
} from '@shared/components';
import {
  FormPersonaFisicaContainer,
  FormPersonaGiuridicaContainer,
  PersonaEnumsV1,
} from '@features/persona';
import { useStoreContext } from '@shared/context';
import { ButtonTypes, FieldTypes } from '@shared/metadata';
import {subscribeToLocalStorage } from '@shared/utils';
import { LOCAL_STORAGE_KEY } from '../../constants';
import _ from 'lodash';


const FormParteControparte = ({ handleClose, onSubmit, ruolo: role, tipo: type }) => {
  
  const ruoloGroupOptions = Object.entries(PersonaEnumsV1.ruolo).map(([key, value]) => ({value, label: value}));

  const tipoPersonaGroupOptions = [
    { value: FieldTypes.PERSONA_FISICA, label: 'PERSONA FISICA' },
    { value:  FieldTypes.PERSONA_GIURIDICA, label: 'PERSONA GIURIDICA' },
  ];

  const [ruolo, setRuolo] = useState(() => role || PersonaEnumsV1.ruolo.PARTE_ISTANTE);
  const [tipoPersona, setTipoPersona] = useState(() => type || FieldTypes.PERSONA_FISICA);

  const storePersonaFisica = useStoreContext(FieldTypes.PERSONA_FISICA);
  const storePersonaGiuridica = useStoreContext(FieldTypes.PERSONA_GIURIDICA);

  const handleSubmit = useCallback(() => {
    const newPersona =
      tipoPersona === FieldTypes.PERSONA_FISICA
        ? storePersonaFisica.getState().getModel()
        : storePersonaGiuridica.getState().getModel();

        
    onSubmit?.({
      ...newPersona,
      ruolo,
    });
    handleClose();
  }, [tipoPersona, ruolo]);

  useEffect(() => {
    const unsubscribe = subscribeToLocalStorage(LOCAL_STORAGE_KEY, (newContext) => {
      if (newContext) {
        console.log('subscribeToLocalStorage newContext:', newContext);
        setRuolo(newContext.ruoloPersona);
        setTipoPersona(newContext.tipoPersona);
      }
    });

    return () => {
      unsubscribe();
    }
  }, []);

  return (
    <Grid container size={{ xs: 12 }} rowGap="3rem">
      {/* Ruolo */}
      <Grid size={{ xs: 12 }} style={{ marginTop: '1rem' }}>
        <FormTitle title="Ruolo" />

        <RadioGroup
          options={ruoloGroupOptions}
          value={ruolo}
          onChange={(e) => setRuolo(e.target.value)}
        />
      </Grid>

      {/* Tipo */}
      <Grid size={{ xs: 12 }}>
        <FormTitle title="Tipo" />

        <RadioGroup
          options={tipoPersonaGroupOptions}
          value={tipoPersona}
          onChange={(e) => setTipoPersona(e.target.value)}
        />
      </Grid>

      {/* Form persona */}
      <Grid size={{ xs: 12 }} container rowGap="8rem">
        <Grid size={{ xs: 12 }}>
          <Accordion
            title={'Persona fisica'}
            isDisabled={tipoPersona !== FieldTypes.PERSONA_FISICA}
            isExpanded={tipoPersona === FieldTypes.PERSONA_FISICA}
          >
            <FormPersonaFisicaContainer />
          </Accordion>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Accordion
            title={'Persona giuridica'}
            isDisabled={tipoPersona !== FieldTypes.PERSONA_GIURIDICA}
            isExpanded={tipoPersona === FieldTypes.PERSONA_GIURIDICA}
          >
            <FormPersonaGiuridicaContainer />
          </Accordion>
        </Grid>
      </Grid>

      {/* Buttons */}
      <Box
        sx={{
          width: '100%',
          paddingTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '3rem',
          borderTop: '1px solid #f1f1f1',
        }}
      >
        <ButtonFactory
          type={ButtonTypes.OUTLINED}
          text="Indietro"
          onClick={handleClose}
        />
        <ButtonFactory
          type={ButtonTypes.CREATE}
          text="Salva"
          onClick={handleSubmit}
        />
      </Box>
    </Grid>
  );
};

export default FormParteControparte;
