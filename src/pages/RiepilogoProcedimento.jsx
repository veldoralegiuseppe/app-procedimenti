import React from 'react';
import { ProcedimentoContext } from '@context/Procedimento';
import {PersonaGiuridica} from '@model/personaGiuridica';
import {PersonaFisica} from '@model/personaFisica';

function formatImporto(importo) {
  const [integerPart, decimalPart] = importo.toString().split('.');
  const formattedIntegerPart = Number(
    integerPart.replace(/\./g, '')
  ).toLocaleString('it-IT');
  const formattedDecimalPart = decimalPart
    ? decimalPart.padEnd(2, '0')
    : '00';

  return (<span style={{ whiteSpace: 'nowrap' }}>€ {`${formattedIntegerPart},${formattedDecimalPart}`}</span>)
}

const Procedimento = ({ procedimento }) => {


  return (
    <div>
      <h2 style={{textAlign: 'left', }}>Procedimento</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center' }}>
        <div style={{ flex: '1 1 33%', padding: '10px 10px 5px 10px', }}>
          <strong>Numero Protocollo:</strong> {procedimento.getProtocollo()}
        </div>
        <div style={{ flex: '1 1 33%', padding: '10px 10px 5px 10px', }}>
          <strong>Data Deposito:</strong> {procedimento.dataDeposito}
        </div>
        <div style={{ flex: '1 1 33%', padding: '10px 10px 5px 10px', }}>
          <strong>Sede Caricamento:</strong> {procedimento.sede}
        </div>
        <div style={{ flex: '1 1 33%', padding: '10px 10px 0 10px', }}>
          <strong>Sede Svolgimento:</strong> {procedimento.sedeSvolgimento}
        </div>
        <div style={{ flex: '1 1 33%', padding: '10px 10px 0 10px', }}>
          <strong>Oggetto della Controversia:</strong> {procedimento.oggettoControversia}
        </div>
        <div style={{ flex: '1 1 33%', padding: '10px 10px 0 10px', }}>
          <strong>Valore della Lite:</strong> {formatImporto(procedimento.valoreControversia)}
        </div>
      </div>
    </div>
  );
};

const PartiControparti = ({ persone }) => {
  // Separiamo le persone tra parti e controparti
  const parti = persone.filter(persona => persona.isParteIstante);
  const controparti = persone.filter(persona => !persona.isParteIstante);

  // Funzione per renderizzare persone fisiche
  const renderPersonaFisica = (persona, index) => (
    <div key={index} style={{ flex: '1 1 300px', padding: '10px', boxSizing: 'border-box' }}>
      <table className="result w100 shs2 rad10">
        <tbody>
          <tr>
            <td className="R U" width="35%">Persona Fisica:</td>
            <td className="L U" width="65%">
              <b>{`${persona.nome} ${persona.cognome} (CF: ${persona.codiceFiscale})`}</b>
            </td>
          </tr>
          <tr>
            <td className="R U">Data di nascita:</td>
            <td className="L U"><b>{persona.dataNascitaLocale}</b></td>
          </tr>
          <tr>
            <td className="R U">Luogo di nascita:</td>
            <td className="L U">
              <b>{`${persona.luogoDiNascita.nome} (${persona.luogoDiNascita.provincia.sigla})`}</b>
            </td>
          </tr>
          <tr>
            <td className="R U">Sesso:</td>
            <td className="L U"><b>{persona.sesso}</b></td>
          </tr>
          <tr>
            <td className="R U">Residenza:</td>
            <td className="L U">
              <b>{`${persona.indirizzo}, ${persona.residenza.nome} (${persona.residenza.provincia.sigla})`}</b>
            </td>
          </tr>
          <tr>
            <td className="R U">PEC Email:</td>
            <td className="L U"><b>{persona.pecEmail}</b></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  // Funzione per renderizzare persone giuridiche
  const renderPersonaGiuridica = (persona, index) => (
    <div key={index} style={{ flex: '1 1 300px', padding: '10px', boxSizing: 'border-box' }}>
      <table className="result w100 shs2 rad10">
        <tbody>
          <tr>
            <td className="R U" width="35%">Persona Giuridica:</td>
            <td className="L U" width="65%">
              <b>{`${persona.denominazione} (P.IVA: ${persona.partitaIVA})`}</b>
            </td>
          </tr>
          <tr>
            <td className="R U">Indirizzo Sede Legale:</td>
            <td className="L U">
              <b>{`${persona.indirizzoSedeLegale}, ${persona.sedeLegale.nome} (${persona.sedeLegale.provincia.sigla})`}</b>
            </td>
          </tr>
          <tr>
            <td className="R U">PEC Email:</td>
            <td className="L U"><b>{persona.pecEmail}</b></td>
          </tr>
          <tr>
            <td className="R U">Rappresentante Legale:</td>
            <td className="L U"><b>{persona.rappresentanteLegale}</b></td>
          </tr>
          <tr>
            <td className="R U">Rappresentante Legale PEC Email:</td>
            <td className="L U"><b>{persona.rappresentanteLegalePecEmail}</b></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  // Funzione per renderizzare una sezione (Parti o Controparti) suddivisa tra fisiche e giuridiche
  const renderSezione = (titolo, persone) => {
    const personeFisiche = persone.filter(persona => persona instanceof PersonaFisica);
    const personeGiuridiche = persone.filter(persona => persona instanceof PersonaGiuridica);

    return (
      <div style={{marginTop: '10px'}}>
        <h2>{titolo}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* Renderizza sia persone fisiche che giuridiche insieme */}
          {personeFisiche.map(renderPersonaFisica)}
          {personeGiuridiche.map(renderPersonaGiuridica)}
        </div>
      </div>
    );
  };

  return (
    <div style={{marginTop: '10px'}}>
      {/* Sezione Parti */}
      {renderSezione('Parti istanti', parti)}

      {/* Sezione Controparti */}
      {renderSezione('Controparti', controparti)}
    </div>
  );
};

const RiepilogoSpese = ({ persone }) => {
  // Variabile globale per il fontSize
  const fontSize = '0.9em';
  
  // Etichette delle colonne per le spese
  const colonneSpese = [
    { nome: 'Avvio', campo: 'speseAvvio' },
    { nome: 'Postali', campo: 'spesePostali' },
    { nome: 'Indennità', campo: 'pagamentoIndennita' },
    { nome: 'Mancato Accordo', campo: 'importoMancatoAccordo' },
    { nome: 'Positivo primo incontro', campo: 'importoPositivoPrimoIncontro' },
    { nome: 'Oltre primo incontro', campo: 'importoPositivoOltrePrimoIncontro' },
  ];

  // Calcolo del totale complessivo delle spese
  const totaleSpeseComplessivo = persone.reduce((acc, persona) => acc + persona.getTotaleSpese(), 0);

  return (
    <div style={{marginTop: '10px'}}>
      <h2>Riepilogo Spese</h2>
      <div style={{ fontSize, padding: '10px 0 0 10px' }}>
        <table className="result w95 shs2 rad10 mt30" style={{ width: '100%', tableLayout: 'auto', borderSpacing: '0px' }}>
          <thead>
            <tr>
              <th className="L UT" style={{ textAlign: 'left', padding: '5px' }}>Nome/Denominazione</th>
              {colonneSpese.map((colonna, index) => (
                <th key={index} className="L UT" style={{ textAlign: 'left', padding: '5px' }}>
                  {colonna.nome}
                </th>
              ))}
              <th className="L UT" style={{ textAlign: 'left', padding: '5px' }}><b>Totale</b></th>
            </tr>
          </thead>
          <tbody>
            {persone.map((persona, index) => (
              <tr key={index}>
                <td className="L U" style={{ wordWrap: 'break-word', whiteSpace: 'normal', padding: '5px' }}>
                  <b>{persona instanceof PersonaGiuridica ? persona.denominazione : `${persona.nome} ${persona.cognome}`}</b>
                </td>
                {colonneSpese.map((colonna, colIndex) => (
                  <td key={colIndex} className="L U" style={{ wordWrap: 'break-word', padding: '5px' }}>
                    {formatImporto(persona[colonna.campo].toFixed(2))}
                  </td>
                ))}
                <td className="L U" style={{ wordWrap: 'break-word', padding: '5px' }}>
                  <b>{formatImporto(persona.getTotaleSpese().toFixed(2))}</b>
                </td>
              </tr>
            ))}
            <tr>
              <td className="L UT" colSpan="7" style={{ padding: '5px' }}><b>Totale Spese Complessivo:</b></td>
              <td className="L UT" style={{ wordWrap: 'break-word', padding: '5px' }}>
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
  let {procedimento, persone} = React.useContext(ProcedimentoContext)
  return (
    <React.Fragment>
       <Procedimento procedimento={procedimento} />
       <PartiControparti persone={persone} />
       <RiepilogoSpese persone={persone}/>
    </React.Fragment>
  );
}
