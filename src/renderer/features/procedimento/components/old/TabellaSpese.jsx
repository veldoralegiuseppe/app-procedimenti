import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Chip,
  Button,
} from '@mui/material';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { ImportoInput, ImportoReadOnly } from '@ui-shared/components';
import { CssTextField } from '@ui-shared/theme';

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#4a769b',
  fontSize: '1rem',
  textTransform: 'uppercase',
  fontWeight: '500',
  backgroundColor: '#ecf6ff',
  borderBottom: '1px solid #3e678f4d',
  '& .MuiButtonBase-root:hover': { color: '#ff9f32a8' },
  '& .MuiButtonBase-root.Mui-active': {
    color: theme.palette.logo.secondary,
    '& svg': { color: theme.palette.logo.secondary },
  },
  padding: '4px',
}));

function TableHeader({ metadata }) {
  //console.log(metadata);
  return (
    <StyledTableHead>
      <TableRow>
        {metadata.map((row, index) => (
          <StyledTableCell align="left" key={`${row.columnName}-${index}`}>
            {row.columnName}
          </StyledTableCell>
        ))}
      </TableRow>
    </StyledTableHead>
  );
}

// Celle
function ImportoCell({ importo, onChange }) {
  const [localValue, setLocalValue] = React.useState(
    typeof importo === 'object' ? importo.value : importo
  );
  const isAutomated = typeof importo === 'object' ? importo.automated : false;

  const handleBlur = () => {
    // Trigger `onChange` only when the input loses focus
    console.log('handleBlur', localValue);
    if (
      localValue !== (typeof importo === 'object' ? importo.value : importo)
    ) {
      onChange(localValue);
    }
  };

  const handleChange = (event) => {
    const newValue = event?.target ? event.target.value : event;
    setLocalValue(newValue);
  };

  return (
    <TableCell sx={{ paddingLeft: '4px' }} align="left">
      {!isAutomated ? (
        <ImportoInput
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          sx={{ width: '100%', maxWidth: '168px' }}
        />
      ) : (
        <ImportoReadOnly
          value={localValue}
          isAutomated={isAutomated}
          backgroundColor="#c4c4c438"
          sx={{ width: '100%', maxWidth: '168px' }}
        />
      )}
    </TableCell>
  );
}

function StatoTransazioneCell({ stato }) {
  const [statoTransazione, setStatoTransazione] = React.useState(
    String(stato).toUpperCase() === 'DA SALDARE'
      ? 0
      : String(stato).toUpperCase() === 'PARZIALMENTE SALDATO'
      ? 1
      : 2
  );

  const status = ['DA SALDARE', 'PARZIALMENTE SALDATO', 'SALDATO'];

  const statusOptions = {
    0: { label: 'DA SALDARE', color: '#ffcccb', textColor: '#b71c1c' },
    1: {
      label: 'PARZIALMENTE SALDATO',
      color: '#fff3cd',
      textColor: '#856404',
    },
    2: { label: 'SALDATO', color: '#c8e6c9', textColor: '#2e7d32' },
  };

  const chipStyles = {
    backgroundColor: statusOptions[statoTransazione].color,
    color: statusOptions[statoTransazione].textColor,
    cursor: 'pointer',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: statusOptions[statoTransazione].color,
    },
  };

  const handleChipClick = () => {
    setStatoTransazione((prevStato) => (prevStato + 1) % 3);
  };

  return (
    <TableCell sx={{ paddingLeft: 0, maxWidth: '8rem' }} align="left">
      <Chip
        size="small"
        label={status[statoTransazione]}
        onClick={() => handleChipClick(stato)}
        sx={chipStyles}
      />
    </TableCell>
  );
}

function NomeTransazioneCell({ nome, tipo }) {
  let color;
  let icon;
  switch (tipo) {
    case 'entrata':
      color = '#176938';
      icon = (
        <TrendingUpIcon
          style={{ color: 'green', marginRight: '8px', marginBottom: '3px' }}
        />
      );
      break;
    case 'uscita':
      color = 'rgb(199 49 49)';
      icon = (
        <TrendingDownIcon
          style={{ color: 'inherit', marginRight: '8px', marginBottom: '3px' }}
        />
      );
      break;
    default:
      icon = null;
  }

  return (
    <TableCell align="left" sx={{ paddingLeft: '4px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          color: color,
          fontSize: '1rem',
        }}
      >
        {icon}
        <span>{nome}</span>
      </div>
    </TableCell>
  );
}

// Footer
function TotaliFooter({ metadata }) {
  return (
    <TableFooter>
      {Array.from({ length: 3 }).map((_, index) => (
        <TableRow key={`footer-row-${index}`}>
          <TableCell
            colSpan={metadata.length}
            sx={{ backgroundColor: '#426c92d6' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1rem',
                color: 'white',
              }}
            >
              {(() => {
                switch (index) {
                  case 0:
                    return (
                      <>
                        <span>Totale spese sede secondaria</span>
                        <span>0.00 €</span>
                      </>
                    );
                  case 1:
                    return (
                      <>
                        <span>Totale in uscita</span>
                        <span>0.00 €</span>
                      </>
                    );
                  case 2:
                    return (
                      <>
                        <span>Totale in entrata</span>
                        <span>0.00 €</span>
                      </>
                    );
                  default:
                    return null;
                }
              })()}
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableFooter>
  );
}

// Components
function Totali({ totali }) {
  const totaleTdStyle = { fontWeight: 'bold', color: '#467bae' };

  return (
    <table
      style={{ width: '100%', marginTop: '1rem', borderSpacing: '0 18px' }}
    >
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

// Righe
function RowCreazioneTransazione({ metadata }) {
  return (
    <TableRow>
      {metadata.map((col, index) => {
        switch (col.columnType) {
          case 'importo':
            return <ImportoCell key={`importo-${index}`} importo={0} />;
          case 'stato':
            return (
              <TableCell key={`stato-${index}`} align="left">
                <Button size="small">Aggiungi</Button>
              </TableCell>
            );
          default:
            return (
              <TableCell key={`cell-${index}`} align="left">
                <CssTextField size="small" label="Nome transazione" />
              </TableCell>
            );
        }
      })}
    </TableRow>
  );
}

export default function TabellaSpese({
  metadata,
  body,
  totali,
  onImportoChange,
}) {
  return (
    <React.Fragment>
      <TableContainer>
        <Table size="small">
          <TableHeader metadata={metadata} />
          <TableBody>
            {body.map((row, rowNumber) => (
              <TableRow key={`row-${rowNumber}`}>
                {row.map((col, index) => {
                  switch (metadata[index].columnType) {
                    case 'importo':
                      return (
                        <ImportoCell
                          onChange={(importo) => onImportoChange(row, importo)}
                          key={`${col}-${index}`}
                          importo={col}
                        />
                      );
                    case 'stato':
                      return (
                        <StatoTransazioneCell
                          key={`${col}-${index}`}
                          stato={col}
                        />
                      );
                    default: {
                      return (
                        <NomeTransazioneCell
                          key={`${col}-${index}`}
                          nome={typeof col === 'string' ? col : col.nome}
                          tipo={
                            typeof col === 'object' && col.tipo
                              ? col.tipo
                              : null
                          }
                        />
                      );
                    }
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Totali totali={totali} />
    </React.Fragment>
  );
}

TableHeader.propTypes = {
  metadata: PropTypes.arrayOf(
    PropTypes.shape({
      columnName: PropTypes.string,
      columnType: PropTypes.string,
    })
  ).isRequired,
};
