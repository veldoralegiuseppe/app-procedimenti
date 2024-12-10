import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

/**
 * Componente Totali
 *
 * Questo componente visualizza i totali con etichette e valori formattati in euro.
 *
 * @component
 * @param {Object[]} totali - Array di oggetti contenenti le informazioni sui totali.
 * @param {string} totali[].label - Etichetta del totale.
 * @param {number} totali[].value - Valore del totale.
 *
 * @example
 * const totali = [
 *   { label: 'Totale 1', value: 100 },
 *   { label: 'Totale 2', value: 200 },
 * ];
 *
 * <Totali totali={totali} />
 */
function Totali({ totali: tot }) {
  const tableStyle = {
    width: '100%',
    borderSpacing: '0 18px',
  };

  const totaleTdStyle = {
    fontWeight: 'bold',
    color: '#467bae',
  };

  const [totali, setTotali] = React.useState(tot);

  React.useEffect(() => {
    if(_.isEqual(tot, totali)) return;
    setTotali(tot);
  }, [tot]);

  return (
    <table style={tableStyle}>
      <tbody>
        {totali.map((totale, index) => (
          <tr key={index} style={totaleTdStyle}>
            <td>{totale.label}</td>
            <td style={{ textAlign: 'center' }}>
              €{' '}
              {totale.value
                .toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'EUR',
                })
                .replace('€', '')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

Totali.propTypes = {
  totali: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Totali;
