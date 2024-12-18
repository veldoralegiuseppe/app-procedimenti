import React, { useState, useCallback } from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import {
  RadioGroup,
  Accordion,
  FormTitle,
  ButtonFactory,
} from '@shared/components';
import { useStoreContext } from '@shared/context';
import { usePersonaStore, usePersoneStore } from '@features/persona';
import {
  FormPersonaFisicaContainer,
  FormPersonaGiuridicaContainer,
} from '@features/persona';
import { ButtonTypes, FieldTypes } from '@shared/metadata';


const FormParteControparte = ({handleClose}) => {
  const personaFisicaStore = useStoreContext(FieldTypes.PERSONA_FISICA);
  const personaGiuridicaStore = useStoreContext(FieldTypes.PERSONA_GIURIDICA);
  const personeStore = useStoreContext(FieldTypes.PERSONE);

  const {resetModel: resetPersonaFisica} = usePersonaStore(personaFisicaStore);
  const {resetModel: resetPersonaGiuridica} = usePersonaStore(personaGiuridicaStore);
  const {addItem} = usePersoneStore(personeStore)

  const ruoloGroupOptions = [
    { value: 'PARTE_ISTANTE', label: 'PARTE ISTANTE' },
    { value: 'CONTROPARTE', label: 'CONTROPARTE' },
  ];
  const tipoPersonaGroupOptions = [
    { value: 'PERSONA_FISICA', label: 'PERSONA FISICA' },
    { value: 'PERSONA_GIURIDICA', label: 'PERSONA GIURIDICA' },
  ];

  const [ruolo, setRuolo] = useState('PARTE_ISTANTE');
  const [tipoPersona, setTipoPersona] = useState('PERSONA_FISICA');

  const handleSubmit = useCallback(() => {
    const newPersonaStore = tipoPersona === 'PERSONA_FISICA' ? personaFisicaStore : personaGiuridicaStore;
    newPersonaStore.getState().setProperty('ruolo', ruoloGroupOptions.find((option) => option.value === ruolo).label);
    const newPersona = newPersonaStore.getState().getModel();
    
    addItem(newPersona);
    resetPersonaFisica();
    resetPersonaGiuridica();
    handleClose();
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
            isDisabled={tipoPersona !== 'PERSONA_FISICA'}
            isExpanded={tipoPersona === 'PERSONA_FISICA'}
          >
            <FormPersonaFisicaContainer />
          </Accordion>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Accordion
            title={'Persona giuridica'}
            isDisabled={tipoPersona !== 'PERSONA_GIURIDICA'}
            isExpanded={tipoPersona === 'PERSONA_GIURIDICA'}
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
        <ButtonFactory type={ButtonTypes.OUTLINED} text="Indietro" onClick={handleClose}/>
        <ButtonFactory type={ButtonTypes.CREATE} text="Crea" onClick={handleSubmit}/>
      </Box>
    </Grid>
  );
};

export default FormParteControparte;
