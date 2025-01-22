import React from 'react';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PersonaTable from './components/PersonaTable';
import { ModelTypes } from '@shared/metadata';
import {PersonaEnumsV1} from '@shared/metadata';

const personaFisicaFields = [
  { label: "Persona Fisica", key: (p) => `${p.nome || ''} ${p.cognome || ''} (CF: ${p.codiceFiscale || ''})` },
  { label: "Data di nascita", key: "dataNascita" },
  { label: "Luogo di nascita", key: (p) => `${p.comuneNascita || ''} ${p.capComuneNascita || ''}, (${p.provinciaNascita || ''})` },
  { label: "Sesso", key: "sesso" },
  { label: "Residenza", key: (p) => `${p.indirizzoResidenza || ''}, ${p.comuneResidenza || ''} ${p.capComuneResidenza || ''}, (${p.provinciaResidenza || ''})` },
  { label: "Partita IVA", key: "partitaIVA" },
  { label: "PEC/Email", key: "pecEmail" },
  { label: "Rappresentante Legale", key: (p) => `${p.nomeRappresentanteLegale || ''} ${p.cognomeRappresentanteLegale || ''}` },
  { label: "PEC/Email del Legale", key: "pecEmailRappresentanteLegale" },
];

const personaGiuridicaFields = [
  { label: "Persona Giuridica", key: (p) => `${p.denominazione || ''} (P.IVA: ${p.partitaIVA || ''})` },
  { label: "Sede Legale", key: (p) => `${p.indirizzoSedeLegale || ''}, ${p.comuneSedeLegale || ''} ${p.capComuneSedeLegale || ''}, (${p.provinciaSedeLegale || ''})` },
  { label: "PEC/Email", key: "pecEmail" },
  { label: "Rappresentante Legale", key: "rappresentanteLegale" },
  { label: "PEC/Email del Legale", key: "rappresentanteLegalePecEmail" },
];

const RiepilogoPartiControparti = ({ persone }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('md'));

  const renderSezione = (titolo, persone) => {
    const personeFisiche = persone.filter(
      (persona) => persona.type === ModelTypes.PERSONA_FISICA
    );
    const personeGiuridiche = persone.filter(
      (persona) => persona.type === ModelTypes.PERSONA_GIURIDICA
    );

    console.log('personeFisiche', personeFisiche);
    return (
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{titolo}</h3>
        <Grid container>
          {personeFisiche.map((persona, index) => (
            <PersonaTable
              key={index}
              persona={persona}
              fields={personaFisicaFields}
              isXs={isXs}
            />
          ))}
          {personeGiuridiche.map((persona, index) => (
            <PersonaTable
              key={index}
              persona={persona}
              fields={personaGiuridicaFields}
              isXs={isXs}
            />
          ))}
        </Grid>
      </div>
    );
  };

  const parti = persone.filter(
    (persona) => persona.ruolo === PersonaEnumsV1.ruolo.PARTE_ISTANTE
  );
  const controparti = persone.filter(
    (persona) => persona.ruolo === PersonaEnumsV1.ruolo.CONTROPARTE
  );

  return (
    <div style={{display: 'flex', flexDirection: 'column', rowGap: '1.5rem'}}>
      {renderSezione('Parti istanti', parti)}
      {renderSezione('Controparti', controparti)}
    </div>
  );
};

export default RiepilogoPartiControparti;
