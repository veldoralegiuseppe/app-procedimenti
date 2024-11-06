import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Chip,
} from '@mui/material';
import { styled } from '@mui/system';
import * as React from 'react';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const borderBottomStyle = '1px solid rgba(224, 224, 224, 1)';
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
      <TableRow key={'header-row'}>
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
function SwitchCell({ stato, onChange }) {
  const [localStato, setLocalStato] = React.useState(stato || 'DISATTIVA');

  const handleStatusChange = () => {
    const newStatus = localStato === 'ATTIVA' ? 'DISATTIVA' : 'ATTIVA';
    setLocalStato(newStatus);
    if (onChange) onChange(newStatus);
    //console.log(newStatus);
  };

  return (
    <TableCell sx={{ paddingLeft: 0, maxWidth: '8rem' }} align="left">
      <Switch
        size="small"
        checked={localStato === 'ATTIVA'}
        onChange={handleStatusChange}
      />
    </TableCell>
  );
}

function TextCell({ nome }) {
  return (
    <TableCell align="left" sx={{ paddingLeft: '4px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '.9rem',
        }}
      >
        <span>{nome}</span>
      </div>
    </TableCell>
  );
}

function ActionCell({ onDelete, onModify }) {
  return (
    <TableCell align="left" sx={{ paddingLeft: '4px' }}>
      <IconButton aria-label="expand row" size="small" onClick={onDelete}>
        <DeleteIcon />
      </IconButton>

      <IconButton aria-label="expand row" size="small" onClick={onModify}>
        <EditIcon />
      </IconButton>
    </TableCell>
  );
}

function ChipCell({ stato }) {
  const [localStato, setLocalStato] = React.useState(stato || 'NON APPLICATA');

  const statusOptions = {
    'NON APPLICATA': {
      label: 'DA SALDARE',
      color: '#e0e0e0',
      textColor: '#616161',
    },
    APPLICATA: { label: 'SALDATO', color: '#c8e6c9', textColor: '#2e7d32' },
  };

  const chipStyles = {
    backgroundColor: statusOptions[localStato].color,
    color: statusOptions[localStato].textColor,
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: statusOptions[localStato].color,
    },
  };

  return (
    <TableCell sx={{ paddingLeft: 0, maxWidth: '8rem' }} align="left">
      <Chip size="small" label={localStato} sx={chipStyles} />
    </TableCell>
  );
}

// Righe
function EmptyRow({ metadata }) {
  return (
    <TableRow key={'empty-row'}>
      <TableCell key={'empty-cell'} colSpan={metadata?.length} align="center">
        Nessun dato presente
      </TableCell>
    </TableRow>
  );
}

function Row({
  metadata,
  row,
  index,
  getCollapsibleComponent,
  handleDelete,
  handleModify,
  handleAttivoChange,
}) {
  const isCollapsible = metadata.some(
    (row) => row.columnType === 'collapsible'
  );
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment key={`fragment-row-${index}`}>
      <TableRow
        key={`main-row-${index}`}
        sx={{
          '& > *': {
            borderBottom: isCollapsible ? 'unset' : borderBottomStyle,
          },
        }}
      >
        {row.map((col, cellIndex) => {
          const cellKey = `main-${col}-${cellIndex}-${index}`;
          switch (metadata[cellIndex].columnType) {
            case 'switch':
              return (
                <SwitchCell
                  key={cellKey}
                  stato={col}
                  onChange={(status) => handleAttivoChange(index, status)}
                />
              );
            case 'chip':
              return <ChipCell key={cellKey} stato={col} />;
            case 'azioni':
              return (
                <ActionCell
                  key={cellKey}
                  onDelete={() => handleDelete(index)}
                  onModify={() => handleModify(index)}
                />
              );
            case 'collapsible':
              return (
                <TableCell key={cellKey} sx={{ borderBottom: 'unset' }}>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                  >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
              );
            default:
              return (
                <TextCell
                  key={cellKey}
                  nome={typeof col === 'string' ? col : col.nome}
                />
              );
          }
        })}
      </TableRow>

      {/* Collapsible */}
      {isCollapsible && (
        <TableRow key={`collapsible-row-${index}`}>
          <TableCell
            key={`collapsible-cell-${index}`}
            style={{
              paddingBottom: 0,
              paddingTop: 0,
              borderBottom: borderBottomStyle,
            }}
            colSpan={metadata.length}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {getCollapsibleComponent && getCollapsibleComponent(row, index)}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}

// Body
export default function RuleTable({
  metadata,
  body,
  getCollapsibleComponent,
  onDelete,
  onModify,
  onError,
  onSuccess,
  handleAttivoChange,
  sx,
}) {
  const [localBody, setLocalBody] = React.useState(() => {
    if (metadata.some((col) => col.columnType === 'collapsible')) {
      const collapsibleIndex = metadata.findIndex(
        (col) => col.columnType === 'collapsible'
      );
      return body.map((row) => {
        const newRow = [...row];
        newRow.splice(collapsibleIndex, 0, '');
        return newRow;
      });
    }
    return body;
  });

  // Aggiungi questo effetto per aggiornare `localBody` quando `body` cambia
  React.useEffect(() => {
    setLocalBody(() => {
      if (metadata.some((col) => col.columnType === 'collapsible')) {
        const collapsibleIndex = metadata.findIndex(
          (col) => col.columnType === 'collapsible'
        );
        return body.map((row) => {
          const newRow = [...row];
          newRow.splice(collapsibleIndex, 0, '');
          return newRow;
        });
      }
      return body;
    });
  }, [body, metadata]);

  const handleDelete = (index) => {
    console.log('delete', index);
    if (onDelete) {
      const result = onDelete(index);
      if (result) {
        onSuccess('Elemento eliminato correttamente');
        setLocalBody((prev) => prev.filter((_, i) => i !== index));
      }
    }
  };

  const handleModify = (index) => {
    console.log('modify', index);
    if (onModify) onModify(index);
  };

  return (
    <TableContainer sx={{ ...sx }}>
      <Table size="small">
        <TableHeader metadata={metadata} />
        <TableBody>
          {localBody.length === 0 ? (
            <EmptyRow metadata={metadata} />
          ) : (
            localBody.map((row, index) => (
              <Row
                key={`render-row-${index}`}
                row={row}
                metadata={metadata}
                index={index}
                getCollapsibleComponent={getCollapsibleComponent}
                handleDelete={handleDelete}
                handleModify={handleModify}
                handleAttivoChange={handleAttivoChange}
              />
            ))
          )}
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
