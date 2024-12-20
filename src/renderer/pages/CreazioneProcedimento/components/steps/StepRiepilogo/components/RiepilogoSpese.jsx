import React from 'react';
import { ImportoUtils } from '@ui-shared/utils';
import { FieldTypes } from '@ui-shared/metadata';

const RiepilogoSpese = ({ persone }) => {
  const fontSize = '0.9em';

  const colonneSpese = [
    { nome: 'Avvio', campo: 'speseAvvio' },
    { nome: 'Postali', campo: 'spesePostali' },
    { nome: 'Indennità', campo: 'speseIndennita' },
    { nome: 'Mancato Accordo', campo: 'speseMancatoAccordo' },
    { nome: 'Positivo primo incontro', campo: 'spesePositivoPrimoIncontro' },
    {
      nome: 'Positivo oltre primo incontro',
      campo: 'spesePositivoOltrePrimoIncontro',
    },
  ];

  const totaleSpeseComplessivo = persone.reduce(
    (acc, persona) =>
      acc +
      colonneSpese
        .map((colonna) => persona[colonna.campo].importoDovuto)
        .reduce((acc, curr) => acc + curr, 0),
    0
  );

  return (
    <div>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Riepilogo Spese
      </h3>
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
                  backgroundColor: '#467bae',
                  color: 'white',
                  fontWeight: 'bold',
                  borderBottom: '2px solid #ddd',
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
                    backgroundColor: '#467bae',
                    color: 'white',
                    fontWeight: 'bold',
                    borderBottom: '2px solid #ddd',
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
                  backgroundColor: '#467bae',
                  color: 'white',
                  fontWeight: 'bold',
                  borderBottom: '2px solid #ddd',
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
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  <b>
                    {persona.type === FieldTypes.PERSONA_GIURIDICA
                      ? `${persona.denominazione || ''}`
                      : `${persona.nome || ''} ${persona.cognome || ''}`}
                  </b>
                </td>
                {colonneSpese.map((colonna, colIndex) => (
                  <td
                    key={colIndex}
                    className="L U"
                    style={{
                      wordWrap: 'break-word',
                      padding: '10px 5px',
                      borderBottom: '1px solid #ddd',
                    }}
                  >
                    {ImportoUtils.formattaImporto(
                      persona[colonna.campo].importoDovuto
                    )}
                  </td>
                ))}
                <td
                  className="L U"
                  style={{
                    wordWrap: 'break-word',
                    padding: '10px 5px',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  <b>
                    {ImportoUtils.formattaImporto(
                      Object.values(persona).filter(field => colonneSpese.map(col => col.campo).includes(field?.key)).reduce((acc, curr) => acc + curr.importoDovuto, 0)
                    )}
                  </b>
                </td>
              </tr>
            ))}
            <tr>
              <td
                className="L UT"
                colSpan={colonneSpese.length + 1}
                style={{
                  padding: '10px 5px',
                  backgroundColor: '#e1f0ff59',
                  fontWeight: 'bold',
                  color: '#3a6c9d',
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
                <b>
                  {ImportoUtils.formattaImporto(
                    totaleSpeseComplessivo
                  )}
                </b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiepilogoSpese;
