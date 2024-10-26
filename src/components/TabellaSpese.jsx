import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { styled } from '@mui/system';
import * as React from 'react';
import PropTypes from 'prop-types';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ImportoInput from '@components/ImportoInput';

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
  console.log(metadata);
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

function ImportoCell({ importo }) {
  return (
    <TableCell sx={{ paddingLeft: '4px' }} align="left">
      <ImportoInput value={importo} sx={{ width: '100%', maxWidth: '168px' }} />
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
      color = '#176938'
      icon = (
        <TrendingUpIcon style={{ color: 'green', marginRight: '8px', marginBottom: '3px' }} />
      );
      break;
    case 'uscita':
      color = 'rgb(199 49 49)'
      icon = <TrendingDownIcon style={{ color: 'inherit', marginRight: '8px', marginBottom: '3px'}} />;
      break;
    default:
      icon = null;
  }

  return (
    <TableCell align="left" sx={{ paddingLeft: '4px' }}>
      <div style={{display: 'flex', alignItems: 'center', color: color, fontSize: '1rem'}}>
        {icon}
        <span>{nome}</span>
      </div>
    </TableCell>
  );
}

export default function TabellaSpese({ metadata, body }) {
  return (
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
                      <ImportoCell key={`${col}-${index}`} importo={col} />
                    );
                  case 'stato':
                    return (
                      <StatoTransazioneCell
                        key={`${col}-${index}`}
                        stato={col}
                      />
                    );
                  default:
                    return (
                      <NomeTransazioneCell
                        key={`${col}-${index}`}
                        nome={typeof col === 'string' ? col : col.nome}
                        tipo={
                          typeof col === 'object' && col.tipo ? col.tipo : null
                        }
                      />
                    );
                }
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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
