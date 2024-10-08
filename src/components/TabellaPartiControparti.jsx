import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import { ProcedimentoContext } from '@context/Procedimento';
import { PersonaFisica } from '../model/personaFisica';
import { PersonaGiuridica } from '../model/personaGiuridica';

const headerBackgroundColor2 = '#ecf6ff';
const footerBackgroundColor = '#4a769b';
const rowBackgroundColor = '#ffe5c89c';
const collapsibleSectionBackgroundColor = '#ecf6ff2e';
const bodyTableCellSx = {
  borderColor: '#eeeeee',
  color: 'inherit',
  borderBottom: 'none',
  padding: '4px',
};

function descendingComparator(a, b, orderBy) {
  //console.log(`a: ${JSON.stringify(a)}, b: ${JSON.stringify(b)}, orderBy: ${orderBy}`)
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'anagrafica',
    numeric: false,
    disablePadding: true,
    label: 'Anagrafica',
  },
  {
    id: 'tipo',
    numeric: false,
    disablePadding: false,
    label: 'Ruolo',
  },
  {
    id: 'speseAvvio',
    numeric: true,
    disablePadding: false,
    label: 'Spese avvio',
  },
  {
    id: 'spesePostali',
    numeric: true,
    disablePadding: false,
    label: 'Spese postali',
  },
  {
    id: 'pagamentoIndennita',
    numeric: true,
    disablePadding: false,
    label: 'Pagamento indennità',
  },
  {
    id: 'importoPositivoPrimoIncontro',
    numeric: true,
    disablePadding: false,
    label: 'Positivo primo incontro',
  },
  {
    id: 'importoPositivoOltrePrimoIncontro',
    numeric: true,
    disablePadding: false,
    label: 'Positivo oltre primo incontro',
  },
  {
    id: 'importoMancatoAccordo',
    numeric: true,
    disablePadding: false,
    label: 'Mancato accordo',
  },
  {
    id: 'totale',
    numeric: true,
    disablePadding: false,
    label: 'Totale',
  },
];

export default function TabellaPartiControparti() {
  const { persone, setPersone } = React.useContext(ProcedimentoContext);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('anagrafica');
  const [selected, setSelected] = React.useState(-1);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isEmpty, setIsEmpty] = React.useState(
    persone && persone.length == 0 ? true : false
  );
  var [rows, setRows] = React.useState(
    (rows = isEmpty
      ? createRowFromModel(null)
      : createRowFromModel(persone).sort(
          (a, b) => -descendingComparator(a, b, 0)
        ))
  );
  const theme = useTheme();

  
   React.useEffect(() => {
    if (persone && persone.length > 0) {
      setRows(createRowFromModel(persone));
      setSelected(-1);
      setIsEmpty(false);
    } else {
      setRows(createRowFromModel(null)); 
      setSelected(-1);
      setIsEmpty(true);
    }
  }, [persone]);  


  function formatImporto(value) {
    const [integerPart, decimalPart] = value.toString().split('.');
    const formattedIntegerPart = Number(
      integerPart.replace(/\./g, '')
    ).toLocaleString('it-IT');
    const formattedDecimalPart = decimalPart
      ? decimalPart.padEnd(2, '0')
      : '00';
    return `€ ${formattedIntegerPart},${formattedDecimalPart}`;
  }

  function createRowFromModel(persone) {
    if (persone && !Array.isArray(persone)) {
      console.error('Il parametro in input non è nel formato opportuno');
      return [];
    }

    let rows = [];

    if (!persone || persone.length === 0) {
      rows.push({
        id: 1,
        anagrafica: 'Nessuna parte inserita',
        tipo: '',
        speseAvvio: '',
        spesePostali: '',
        pagamentoIndennita: '',
        importoMancatoAccordo: '',
        importoPositivoPrimoIncontro: '',
        importoPositivoOltrePrimoIncontro: '',
        totale: '',
        open: false,
      });
      return rows;
    }

    persone.forEach((persona, index) => {
      if (!persona || !(persona instanceof PersonaFisica || persona instanceof PersonaGiuridica)) {
        console.error(`L'elemento ${JSON.stringify(persona)} non è una persona fisica o giuridica`);
      } else {
        let commonFields = {
          id: index + 1,
          tipo: persona.isParteIstante ? 'PARTE' : 'CONTROPARTE',
          speseAvvio: formatImporto(persona.speseAvvio),
          spesePostali: formatImporto(persona.spesePostali),
          pagamentoIndennita: formatImporto(persona.pagamentoIndennita),
          importoMancatoAccordo: formatImporto(persona.importoMancatoAccordo),
          importoPositivoPrimoIncontro: formatImporto(persona.importoPositivoPrimoIncontro),
          importoPositivoOltrePrimoIncontro: formatImporto(persona.importoPositivoOltrePrimoIncontro),
          totale: formatImporto(persona.getTotaleSpese()),
          open: false,
          note: persona.note || '',
          pecEmail: persona.pecEmail || '',
          rappresentanteLegale: persona.rappresentanteLegale,
          rappresentanteLegalePecEmail: persona.rappresentanteLegalePecEmail || '',
          partitaIVA: persona.partitaIVA || '',
        };

        if (persona instanceof PersonaFisica) {
         
          rows.push({
            ...commonFields,
            isPersonaFisica: true,
            anagrafica: `${persona.nome || ''} ${persona.cognome || ''}`,
            codiceFiscale: persona.codiceFiscale || '',
            dataNascita: persona.getDataNascitaLocale() || '',
            luogoDiNascita: persona.luogoDiNascita && persona.luogoDiNascita.provincia ? 
                            `${persona.luogoDiNascita.nome} (${persona.luogoDiNascita.provincia.sigla})` : '',
            sesso: persona.sesso === 'M' ? 'UOMO' : (persona.sesso === 'F' ? 'DONNA' : ''),
            residenza: persona.residenza && persona.residenza.provincia ? 
                       `${persona.indirizzoResidenza ? persona.indirizzoResidenza + ' -' : ''} ${persona.residenza.cap} ${persona.residenza.nome} (${persona.residenza.provincia.sigla})` : '',
          });
        }

        if (persona instanceof PersonaGiuridica) {
          rows.push({
            ...commonFields,
            isPersonaFisica: false,
            anagrafica: persona.denominazione,
            sedeLegale: persona.sedeLegale && persona.sedeLegale.provincia ? 
                        `${persona.indirizzoSedeLegale ? persona.indirizzoSedeLegale + ' -' : ''} ${persona.sedeLegale.cap} ${persona.sedeLegale.nome} (${persona.sedeLegale.provincia.sigla})` : '',
          });
        }
      }
    });

    return rows;
  }


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    id == selected ? setSelected(-1) : setSelected(id);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected == id;

  const handleDelete = (event) => {
    let newRows = rows.filter((row, index) => row.id !== selected);

    if (newRows.length <= 0) {
      newRows = createRowFromModel(null);
      setIsEmpty(true);
    } else setIsEmpty(false);

    setRows(newRows);
    setSelected(-1);
  };

  function EnhancedTableHead(props) {
    const theme = useTheme();
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead sx={{ color: theme.palette.background.default }}>
        <TableRow>
          {/* Collapsible */}
          <TableCell
            sx={{
              color: theme.palette.logo.secondary,
              backgroundColor: headerBackgroundColor2,
              borderBottom: '1px solid #3e678f4d',
            }}
          />

          {headCells.map((headCell) => {
            // Definire etichetta abbreviata
            let label = headCell.label;
            let displayLabel = label; // Default: etichetta completa

            // Se la label è troppo lunga, abbreviare
            if (label.toLocaleLowerCase() === 'positivo oltre primo incontro') {
              displayLabel = 'Pos. Oltre 1°'; // Abbreviazione specifica
            } else if (
              label.toLocaleLowerCase() === 'positivo primo incontro'
            ) {
              displayLabel = 'Pos. 1°'; // Abbreviazione specifica
            } else if (label.toLocaleLowerCase() === 'pagamento indennità') {
              displayLabel = 'Indennità'; // Abbreviazione specifica
            } else if (label.toLocaleLowerCase() === 'mancato accordo') {
              displayLabel = 'Manc. accordo'; // Abbreviazione specifica
            }

            displayLabel = displayLabel.toLocaleUpperCase()

            return (
              <TableCell
                sx={{
                  color: footerBackgroundColor,
                  backgroundColor: headerBackgroundColor2,
                  borderBottom: '1px solid #3e678f4d',
                  '& .MuiButtonBase-root:hover': { color: '#ff9f32a8' },
                  '& .MuiButtonBase-root.Mui-active': {
                    color: theme.palette.logo.secondary,
                    '& svg': { color: theme.palette.logo.secondary },
                  },
                  padding: '4px',
                }}
                key={headCell.id}
                align={headCell.numeric ? 'left' : 'left'}
                padding={headCell.disablePadding ? 'none' : 'normal'}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <Tooltip title={label} arrow>
                  {/* Usa un singolo span come contenitore per garantire che Tooltip riceva un solo figlio */}
                  <span>
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={createSortHandler(headCell.id)}
                    >
                      {displayLabel} {/* Mostra l'etichetta abbreviata */}
                      {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc'
                            ? 'sorted descending'
                            : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </span>
                </Tooltip>
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  function EnhancedTableToolbar(props) {
    const theme = useTheme();
    const { numSelected } = props;

    return (
      <Toolbar
        variant="dense"
        sx={{
          minHeight: 'unset',
          height: '2rem',
          backgroundColor: theme.palette.background.default,
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) => theme.palette.background.default,
            borderBottom: '1px solid #c72525cc',
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%', color: '#c72525cc' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            Vuoi eliminare la parte selezionata ?
          </Typography>
        ) : (
          <></>
        )}

        {numSelected > 0 ? (
          <Tooltip onClick={handleDelete} title="Elimina">
            <IconButton sx={{ '&:hover': { backgroundColor: 'unset' } }}>
              <DeleteIcon
                sx={{ color: '#c72525cc', '&:hover': { color: '#e53636cc' } }}
              />
            </IconButton>
          </Tooltip>
        ) : (
          <></>
        )}
      </Toolbar>
    );
  }

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [rows, order, orderBy, page, rowsPerPage]
  );

  function CollapsibleContent({ row }) {

    const collapsibleLabelCellSx = {color: '#4a769b'}
    const collapsibleValueCellSx = {color: '#inherit'}
    
    return (
      <Box sx={{ margin: 1 }}>
        <Typography variant="h6" gutterBottom component="div" sx={{...bodyTableCellSx, ...collapsibleLabelCellSx}}>
          Dettagli{' '}
          {row.isPersonaFisica ? 'Persona Fisica' : 'Persona Giuridica'}
        </Typography>
        <Table size="small" aria-label="details">
          <TableHead>
            <TableRow>
              <TableCell sx={bodyTableCellSx}></TableCell>
              <TableCell sx={bodyTableCellSx}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Se persona fisica */}
            {row.isPersonaFisica ? (
              <>
                <TableRow>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleLabelCellSx}}>Codice Fiscale</TableCell>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleValueCellSx}}>
                    {row.codiceFiscale}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleLabelCellSx}}>Partita IVA</TableCell>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleValueCellSx}}>
                    {row.partitaIVA}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleLabelCellSx}}>Data di Nascita</TableCell>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleValueCellSx}}>{row.dataNascita}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleLabelCellSx}}>Luogo di Nascita</TableCell>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleValueCellSx}}>
                    {row.luogoDiNascita}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleLabelCellSx}}>Sesso</TableCell>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleValueCellSx}}>{row.sesso}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleLabelCellSx}}>Residenza</TableCell>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleValueCellSx}}>
                    {row.residenza}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleLabelCellSx}}>Email/PEC</TableCell>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleValueCellSx}}>
                    {row.pecEmail}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleLabelCellSx}}>Rappresentante Legale</TableCell>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleValueCellSx}}>
                    {row.rappresentanteLegale}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleLabelCellSx}}>Email/PEC del Rappresentante Legale</TableCell>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleValueCellSx}}>
                    {row.rappresentanteLegalePecEmail}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleLabelCellSx}}>Note</TableCell>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleValueCellSx}}>
                    {row.note}
                  </TableCell>
                </TableRow>
                {/* Altri campi per persona fisica */}
              </>
            ) : (
              <>
                {/* Se persona giuridica */}
                <TableRow>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleLabelCellSx}}>Partita IVA</TableCell>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleValueCellSx}}>{row.partitaIVA}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleLabelCellSx}}>Sede Legale</TableCell>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleValueCellSx}}>
                    {row.sedeLegale}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleLabelCellSx}}>Email/PEC</TableCell>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleValueCellSx}}>
                    {row.pecEmail}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleLabelCellSx}}>Rappresentante Legale</TableCell>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleValueCellSx}}>
                    {row.rappresentanteLegale}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleLabelCellSx}}>Email/PEC del Rappresentante Legale</TableCell>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleValueCellSx}}>
                    {row.rappresentanteLegalePecEmail}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleLabelCellSx}}>Note</TableCell>
                  <TableCell sx={{...bodyTableCellSx, ...collapsibleValueCellSx}}>
                    {row.note}
                  </TableCell>
                </TableRow>
                {/* Altri campi per persona giuridica */}
              </>
            )}
          </TableBody>
        </Table>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, boxShadow: 'unset' }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected == -1 ? 0 : 1}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody
              sx={{ backgroundColor: theme.palette.background.default }}
            >
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <React.Fragment key={labelId + 'fragment'}>
                    {/* Table row */}
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{
                        color: isItemSelected ? '#ed9747' : '#656565',
                        pointerEvents: isEmpty ? 'none' : 'auto',
                        cursor: isEmpty ? 'default' : 'pointer',
                        '&.MuiTableRow-hover:hover': {
                          backgroundColor: rowBackgroundColor,
                        },
                        '&.Mui-selected': {
                          backgroundColor: rowBackgroundColor,
                          '&:hover': { backgroundColor: rowBackgroundColor },
                        },
                      }}
                    >
                      <TableCell sx={{ ...bodyTableCellSx }}>
                        {isEmpty ? (
                          <></>
                        ) : (
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            id={labelId}
                            onClick={(event) => handleClick(event, row.id)}
                          >
                            {isItemSelected ? (
                              <KeyboardArrowUpIcon
                                sx={{
                                  fill: isItemSelected ? '#ed9747' : '#656565',
                                }}
                              />
                            ) : (
                              <KeyboardArrowDownIcon
                                sx={{
                                  fill: isItemSelected ? '#ed9747' : '#656565',
                                }}
                              />
                            )}
                          </IconButton>
                        )}
                      </TableCell>

                      <TableCell
                        sx={{
                          transform: isEmpty ? 'translateX(260%)' : 'unset',
                          color: isEmpty
                            ? theme.palette.text.disabled
                            : theme.palette.text.primary,
                          ...bodyTableCellSx,
                        }}
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.anagrafica}
                      </TableCell>

                      <TableCell sx={{ ...bodyTableCellSx }} align="left">
                        {row.tipo}
                      </TableCell>
                      <TableCell sx={{ ...bodyTableCellSx }} align="left">
                        {row.speseAvvio}
                      </TableCell>
                      <TableCell sx={{ ...bodyTableCellSx }} align="left">
                        {row.spesePostali}
                      </TableCell>
                      <TableCell sx={{ ...bodyTableCellSx }} align="left">
                        {row.pagamentoIndennita}
                      </TableCell>
                      <TableCell sx={{ ...bodyTableCellSx }} align="left">
                        {row.importoMancatoAccordo}
                      </TableCell>
                      <TableCell sx={{ ...bodyTableCellSx }} align="left">
                        {row.importoPositivoPrimoIncontro}
                      </TableCell>
                      <TableCell sx={{ ...bodyTableCellSx }} align="left">
                        {row.importoPositivoOltrePrimoIncontro}
                      </TableCell>
                      <TableCell sx={{ ...bodyTableCellSx }} align="left">
                        {row.totale}
                      </TableCell>
                    </TableRow>

                    {/* Collapsibile */}
                    <TableRow
                      key={`${row.id}-collapse`}
                      sx={{ backgroundColor: collapsibleSectionBackgroundColor }}
                    >
                      <TableCell
                        id={labelId + '-collapse'}
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={10}
                      >
                        <Collapse
                          in={isItemSelected}
                          timeout="auto"
                          unmountOnExit
                        >
                          <CollapsibleContent row={row} />{' '}
                          {/* Usa il nuovo componente */}
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={10} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{
            backgroundColor: footerBackgroundColor,
            color: theme.palette.background.default,
            height: '2rem',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          labelRowsPerPage={'Elementi per pagina'}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} di ${count !== -1 ? count : `più di ${to}`}`
          }
        />
        <EnhancedTableToolbar numSelected={selected == -1 ? 0 : 1} />
      </Paper>
    </Box>
  );
}
