import React from 'react';
import Grid from '@mui/material/Grid2';
import {ImportoUtils} from '@ui-shared/utils';

const RiepilogoDatiGenerali = ({ procedimento }) => {
  return (
    <div style={{ marginTop: '-4rem', marginBottom: '1rem' }}>
      {/* Titolo principale */}
      <h1
        style={{ textAlign: 'left', fontSize: '2rem', marginBottom: '0.3rem' }}
      >
        Procedimento di Mediazione
      </h1>

      {/* Numero Protocollo */}
      <h2
        style={{ textAlign: 'left', fontSize: '1.8rem', marginBottom: '2rem' }}
      >
        {procedimento?.numProtocollo}
      </h2>

      {/* Dati generali */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6, xl: 2 }}>
          <strong>Data Deposito:</strong> {procedimento?.dataDeposito}
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 2 }}>
          <strong>Sede Caricamento:</strong> {procedimento?.sedeDeposito}
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 2 }}>
          <strong>Sede Svolgimento:</strong> {procedimento?.sedeSvolgimento}
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 2 }}>
          <strong>Valore della Lite:</strong>{' '}
          {ImportoUtils.formattaImporto(procedimento?.valoreControversia)}
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 2 }}>
          <strong>Oggetto della Controversia:</strong>{' '}
          {procedimento?.oggettoControversia}
        </Grid>
      </Grid>
    </div>
  );
};

export default RiepilogoDatiGenerali;
