import React from 'react';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { ProcedimentoContext } from '@context/Procedimento';
import { PersonaGiuridica } from '@model/personaGiuridica';
import { PersonaFisica } from '@model/personaFisica';

function formatImporto(importo) {
  const [integerPart, decimalPart] = importo.toString().split('.');
  const formattedIntegerPart = Number(
    integerPart.replace(/\./g, '')
  ).toLocaleString('it-IT');
  const formattedDecimalPart = decimalPart ? decimalPart.padEnd(2, '0') : '00';

  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      € {`${formattedIntegerPart},${formattedDecimalPart}`}
    </span>
  );
}

const Procedimento = ({ procedimento }) => {
  return (
    <div style={{ marginBottom: '2rem',}}>
      {/* Titolo principale */}
      <h1 style={{ textAlign: 'left', fontSize: '2rem', marginBottom: '0.3rem' }}>
        Procedimento di Mediazione
      </h1>

      {/* Numero Protocollo */}
      <h2 style={{ textAlign: 'left', fontSize: '1.8rem', marginBottom: '2rem' }}>
        {procedimento.getProtocollo()}
      </h2>

      {/* Informazioni disposte con il sistema a griglia di MUI */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} xl={2}>
          <strong>Data Deposito:</strong> {procedimento.dataDeposito}
        </Grid>
        <Grid item xs={12} md={6} xl={2}>
          <strong>Sede Caricamento:</strong> {procedimento.sede}
        </Grid>
        <Grid item xs={12} md={6} xl={2}>
          <strong>Sede Svolgimento:</strong> {procedimento.sedeSvolgimento}
        </Grid>
        <Grid item xs={12} md={6} xl={2}>
          <strong>Valore della Lite:</strong> {formatImporto(procedimento.valoreControversia)}
        </Grid>
        <Grid item xs={12} md={6} xl={2}>
          <strong>Oggetto della Controversia:</strong> {procedimento.oggettoControversia}
        </Grid>
      </Grid>
    </div>
  );
};

const PartiControparti = ({ persone }) => {
  const parti = persone.filter((persona) => persona.isParteIstante);
  const controparti = persone.filter((persona) => !persona.isParteIstante);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('md')); // Rileva se lo schermo è xs


  const renderPersonaFisica = (persona, index) => (
    <Grid item size={{xs: 12, md: 6}} key={index} sx={{marginBottom: isXs ? '1.5rem' : '0'}}>
      <table className="result w100 shs2 rad10" style={{tableLayout: 'fixed' }}>
        <tbody>
          <tr>
            <td className="R U" style={{ paddingRight: '10px' }}>Persona Fisica:</td>
            <td className="L U" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <b>{`${persona.nome} ${persona.cognome} (CF: ${persona.codiceFiscale ? persona.codiceFiscale : " "})`}</b>
            </td>
          </tr>
          <tr>
            <td className="R U" style={{ paddingRight: '10px' }}>Data di nascita:</td>
            <td className="L U"><b>{persona.dataNascita ? persona.getDataNascitaLocale() : ""}</b></td>
          </tr>
          <tr>
            <td className="R U" style={{ paddingRight: '10px' }}>Luogo di nascita:</td>
            <td className="L U">
              <b>{persona.luogoDiNascita ?  `${persona.luogoDiNascita.nome} (${persona.luogoDiNascita.provincia.sigla})` : ""}</b>
            </td>
          </tr>
          <tr>
            <td className="R U" style={{ paddingRight: '10px' }}>Sesso:</td>
            <td className="L U"><b>{persona.sesso ? persona.sesso : ""}</b></td>
          </tr>
          <tr>
            <td className="R U" style={{ paddingRight: '10px' }}>Residenza:</td>
            <td className="L U">
              <b>{persona.residenza ? `${persona.indirizzo ? persona.indirizzo +' -' : ''}  ${persona.residenza.cap} ${persona.residenza.nome} (${persona.residenza.provincia.sigla})` : ""}</b>
            </td>
          </tr>
          <tr>
            <td className="R U" style={{ paddingRight: '10px' }}>Partita IVA:</td>
            <td className="L U" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <b>{persona.partitaIVA ? persona.partitaIVA : ""}</b>
            </td>
          </tr>
          <tr>
            <td className="R U" style={{ paddingRight: '10px' }}>PEC/Email:</td>
            <td className="L U"><b>{persona.pecEmail}</b></td>
          </tr>
          <tr>
            <td className="R U" style={{ paddingRight: '10px' }}>Rappresentante Legale:</td>
            <td className="L U"><b>{persona.rappresentanteLegale}</b></td>
          </tr>
          <tr>
            <td className="R U" style={{ paddingRight: '10px' }}>PEC/Email del Legale:</td>
            <td className="L U"><b>{persona.rappresentanteLegalePecEmail ? persona.rappresentanteLegalePecEmail : ""}</b></td>
          </tr>
        </tbody>
      </table>
    </Grid>
  );

  const renderPersonaGiuridica = (persona, index) => (
    <Grid item size={{xs: 12, md: 6}} key={index} sx={{marginBottom: isXs ? '1.5rem' : '0'}}>
      <table className="result w100 shs2 rad10" style={{ tableLayout: 'fixed' }}>
        <tbody>
          <tr>
            <td className="R U" style={{ paddingRight: '10px' }}>Persona Giuridica:</td>
            <td className="L U" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <b>{`${persona.denominazione} (P.IVA: ${persona.partitaIVA ? persona.partitaIVA : " "})`}</b>
            </td>
          </tr>
          <tr>
            <td className="R U" style={{ paddingRight: '10px' }}>Sede Legale:</td>
            <td className="L U">
              <b>{persona.sedeLegale ? `${persona.indirizzoSedeLegale ? persona.indirizzoSedeLegale +' -' : ''}  ${persona.sedeLegale.cap} ${persona.sedeLegale.nome} (${persona.sedeLegale.provincia.sigla})` : ""}</b>
            </td>
          </tr>
          <tr>
            <td className="R U" style={{ paddingRight: '10px' }}>PEC/Email:</td>
            <td className="L U"><b>{persona.pecEmail ? persona.pecEmail : ""}</b></td>
          </tr>
          <tr>
            <td className="R U" style={{ paddingRight: '10px' }}>Rappresentante Legale:</td>
            <td className="L U"><b>{persona.rappresentanteLegale ? persona.rappresentanteLegale : ""}</b></td>
          </tr>
          <tr>
            <td className="R U" style={{ paddingRight: '10px' }}>PEC/Email del Legale:</td>
            <td className="L U"><b>{persona.rappresentanteLegalePecEmail ? persona.rappresentanteLegalePecEmail : ""}</b></td>
          </tr>
        </tbody>
      </table>
    </Grid>
  );

  const renderSezione = (titolo, persone) => {
    const personeFisiche = persone.filter((persona) => persona instanceof PersonaFisica);
    const personeGiuridiche = persone.filter((persona) => persona instanceof PersonaGiuridica);

    return (
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{titolo}</h3>
        <Grid container >
          {personeFisiche.map(renderPersonaFisica)}
          {personeGiuridiche.map(renderPersonaGiuridica)}
        </Grid>
      </div>
    );
  };

  return (
    <div>
      {renderSezione('Parti istanti', parti)}
      {renderSezione('Controparti', controparti)}
    </div>
  );
};

const RiepilogoSpese = ({ persone }) => {
  const fontSize = '0.9em';

  const colonneSpese = [
    { nome: 'Avvio', campo: 'speseAvvio' },
    { nome: 'Postali', campo: 'spesePostali' },
    { nome: 'Indennità', campo: 'pagamentoIndennita' },
    { nome: 'Mancato Accordo', campo: 'importoMancatoAccordo' },
    { nome: 'Positivo primo incontro', campo: 'importoPositivoPrimoIncontro' },
    {
      nome: 'Positivo oltre primo incontro',
      campo: 'importoPositivoOltrePrimoIncontro',
    },
  ];

  const totaleSpeseComplessivo = persone.reduce(
    (acc, persona) => acc + persona.getTotaleSpese(),
    0
  );

  return (
    <div>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Riepilogo Spese</h3>
      <div style={{ fontSize, padding: '.5rem 0' }}>
        <table
          className="result w95 shs2 rad10 mt30"
          style={{
            width: '100%',
            tableLayout: 'auto',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr>
              <th
                className="L UT"
                style={{
                  textAlign: 'left',
                  padding: '12px 5px',
                  backgroundColor: '#467bae', // Blu sobrio per l'header
                  color: 'white', // Testo bianco per contrasto
                  fontWeight: 'bold',
                  borderBottom: '2px solid #ddd', // Bordo inferiore più evidente
                }}
              >
                Nome/Denominazione
              </th>
              {colonneSpese.map((colonna, index) => (
                <th
                  key={index}
                  className="L UT"
                  style={{
                    textAlign: 'left',
                    padding: '12px 5px',
                    backgroundColor: '#467bae', // Blu sobrio
                    color: 'white', // Testo bianco
                    fontWeight: 'bold',
                    borderBottom: '2px solid #ddd', // Bordo inferiore
                  }}
                >
                  {colonna.nome}
                </th>
              ))}
              <th
                className="L UT"
                style={{
                  textAlign: 'left',
                  padding: '12px 5px',
                  backgroundColor: '#467bae', // Blu sobrio
                  color: 'white', // Testo bianco
                  fontWeight: 'bold',
                  borderBottom: '2px solid #ddd', // Bordo inferiore
                }}
              >
                <b>Totale</b>
              </th>
            </tr>
          </thead>
          <tbody>
            {persone.map((persona, index) => (
              <tr key={index}>
                <td
                  className="L U"
                  style={{
                    wordWrap: 'break-word',
                    whiteSpace: 'normal',
                    padding: '10px 5px',
                    borderBottom: '1px solid #ddd', // Bordi sottili per le righe
                  }}
                >
                  <b>
                    {persona instanceof PersonaGiuridica
                      ? persona.denominazione
                      : `${persona.nome} ${persona.cognome}`}
                  </b>
                </td>
                {colonneSpese.map((colonna, colIndex) => (
                  <td
                    key={colIndex}
                    className="L U"
                    style={{
                      wordWrap: 'break-word',
                      padding: '10px 5px',
                      borderBottom: '1px solid #ddd', // Bordi sottili per le righe
                    }}
                  >
                    {formatImporto(persona[colonna.campo].toFixed(2))}
                  </td>
                ))}
                <td
                  className="L U"
                  style={{
                    wordWrap: 'break-word',
                    padding: '10px 5px',
                    borderBottom: '1px solid #ddd', // Bordi sottili per le righe
                  }}
                >
                  <b>{formatImporto(persona.getTotaleSpese().toFixed(2))}</b>
                </td>
              </tr>
            ))}
            <tr>
              <td
                className="L UT"
                colSpan={colonneSpese.length + 1}
                style={{
                  padding: '10px 5px',
                  backgroundColor: '#e1f0ff59', // Colore di sfondo per il totale
                  fontWeight: 'bold',
                  color: '#3a6c9d', // Colore del testo
                }}
              >
                Totale Complessivo:
              </td>
              <td
                className="L UT"
                style={{
                  wordWrap: 'break-word',
                  padding: '10px 5px',
                  backgroundColor: '#e1f0ff59', // Colore di sfondo per il totale
                  fontWeight: 'bold',
                  color: '#3a6c9d', // Colore del testo
                }}
              >
                <b>{formatImporto(totaleSpeseComplessivo.toFixed(2))}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function RiepilogoProcedimento() {
  let { procedimento, persone } = React.useContext(ProcedimentoContext);
  return (
    <div style={{marginTop: '2rem'}}>
      <Procedimento procedimento={procedimento} />
      <PartiControparti persone={persone} />
      <RiepilogoSpese persone={persone} />
    </div>
  );
}
