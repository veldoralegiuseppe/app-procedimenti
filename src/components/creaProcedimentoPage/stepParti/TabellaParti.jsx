import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
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
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';

const headerBackgroundColor2 = '#ffffff8f'
const footerBackgroundColor = '#4a769b'
const rowBackgroundColor = '#ffe5c89c'
const bodyTableCellSx = {borderColor: '#eeeeee', fontWeight: '500', color: 'inherit', borderBottom: 'none', padding: '4px'}

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
    id: 'importoMancatoAccordo',
    numeric: true,
    disablePadding: false,
    label: 'Mancato accordo',
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
    id: 'totale',
    numeric: true,
    disablePadding: false,
    label: 'Totale',
  },
];

export default function TabellaParti(props) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('anagrafica');
  const [selected, setSelected] = React.useState(-1);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isEmpty, setIsEmpty] = React.useState(false)
  var [rows, setRows] = React.useState(rows = isEmpty ? [createData(null)] : [
    createData(1, 'ROSSI', 'MARIO', 'PARTE', 1,1,1,1,1,1),
    createData(2, 'NERI', 'LUIGI', 'PARTE', 2,2,2,2,2,2),
  ].sort((a,b) => - descendingComparator(a,b,0)))
  const theme = useTheme()

  function formatImporto(value) {
    const [integerPart, decimalPart] = value.toString().split('.');
    const formattedIntegerPart = Number(integerPart.replace(/\./g, '')).toLocaleString('it-IT');
    const formattedDecimalPart = decimalPart ? decimalPart.padEnd(2, '0') : '00';
    return `€ ${formattedIntegerPart},${formattedDecimalPart}`;
  }

  function createData(id, cognome="", nome="", tipo="PARTE", speseAvvio=0, spesePostali=0, pagamentoIndennita=0, importoMancatoAccordo=0, importoPositivoPrimoIncontro=0, importoPositivoOltrePrimoIncontro=0) {
    
    if(!id) return {id: 1, anagrafica: 'Nessuna parte inserita', tipo: '', speseAvvio: '', spesePostali: '', pagamentoIndennita: '', importoMancatoAccordo: '', importoPositivoPrimoIncontro: '',importoPositivoOltrePrimoIncontro: '', open: false}
    
    let totale = 0
    let spese = [speseAvvio, spesePostali, pagamentoIndennita, importoMancatoAccordo, importoPositivoPrimoIncontro, importoPositivoOltrePrimoIncontro]
    
    spese.forEach(importo => {
        totale += Number(importo) 
    });
    
    return {
      id,
      anagrafica: `${nome} ${cognome}`,
      tipo,
      speseAvvio: formatImporto(speseAvvio),
      spesePostali: formatImporto(spesePostali),
      pagamentoIndennita: formatImporto(pagamentoIndennita),
      importoMancatoAccordo: formatImporto(importoMancatoAccordo),
      importoPositivoPrimoIncontro: formatImporto(importoPositivoPrimoIncontro),
      importoPositivoOltrePrimoIncontro: formatImporto(importoPositivoOltrePrimoIncontro),
      totale: formatImporto(totale),
      open: false
    };
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
    props.onSelect(id == selected ? -1 : id)
    console.log(`Tabella parti - id: ${id} riga selezionata: ${selected}`)
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

  const handleAdd = (event, row) => {
    setRows(rows.splice(rows.length, 0, row))
    console.log(`Gestisco l'aggiunta:\n${rows}`)
    setSelected(-1)
    props.onSelect(selected)
    setIsEmpty(false)
  }

  const isSelected = (id) => selected == id;

  const handleDelete = (event) => {
    
    let newRows = rows.filter((row, index) => row.id !== selected);

    console.log(`handleDelete: selected:${selected} - newRows: ${JSON.stringify(newRows)}`)
    if (newRows.length <= 0){
      newRows = [createData(null)]
      setIsEmpty(true)
    } 
    else 
      setIsEmpty(false)
    
    setRows(newRows)
    setSelected(-1)
    props.onSelect(-1)

  }

  function EnhancedTableHead(props) {
    const theme = useTheme()
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead sx={{color: theme.palette.background.default}}> 
        <TableRow>
          {/* Collapsible */}
          <TableCell sx={{color: theme.palette.logo.secondary, backgroundColor: headerBackgroundColor2,  borderBottom: '1px solid #3e678f4d'}}/>
          
          {/* Checkbox */}
          {/* <TableCell padding="checkbox" sx={{color: theme.palette.logo.secondary, backgroundColor: headerBackgroundColor2,  borderBottom: '1px solid #3e678f4d'}}/> */}
          
          {headCells.map((headCell) => {
          // Definire etichetta abbreviata
          let label = headCell.label;
          let displayLabel = label;  // Default: etichetta completa
          
          // Se la label è troppo lunga, abbreviare
          if (label.toLocaleLowerCase() === "positivo oltre primo incontro") {
            displayLabel = "Pos. Oltre 1°";  // Abbreviazione specifica
          }
          else if(label.toLocaleLowerCase() === "positivo primo incontro"){
            displayLabel = "Pos. 1°";  // Abbreviazione specifica
          }
          else if(label.toLocaleLowerCase() === "pagamento indennità"){
            displayLabel = "Indennità";  // Abbreviazione specifica
          }
          else if(label.toLocaleLowerCase() === "mancato accordo"){
            displayLabel = "Manc. accordo";  // Abbreviazione specifica
          }

          return (
            <TableCell
              sx={{
                color: footerBackgroundColor,
                backgroundColor: headerBackgroundColor2,
                borderBottom: '1px solid #3e678f4d',
                '& .MuiButtonBase-root:hover': { color: '#ff9f32a8' },
                '& .MuiButtonBase-root.Mui-active': { color: theme.palette.logo.secondary, '& svg': { color: theme.palette.logo.secondary } },
                padding: '4px'
              }}
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
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
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
    const theme = useTheme()
    const { numSelected } = props;
  
    return (
      <Toolbar
        variant='dense'
        sx={{
          minHeight: 'unset',
          height: '2rem',
          backgroundColor: theme.palette.background.default,
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) => theme.palette.background.default,
            borderBottom:  '1px solid #c72525cc'
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
            <IconButton sx={{'&:hover': {backgroundColor: 'unset',}}}>
              <DeleteIcon sx={{color: '#c72525cc', '&:hover': {color: '#e53636cc'}}}/>
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [rows, order, orderBy, page, rowsPerPage],
  );

  return (
    <Box sx={{ margin: '18px 0 0 1rem', width: 'calc(100% - 1rem)'}}>
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
            <TableBody sx={{backgroundColor: theme.palette.background.default,}}>
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
                    sx={{ color: isItemSelected ? '#ed9747' : '#656565', pointerEvents: isEmpty ? 'none' : 'auto', cursor: isEmpty ? 'default' : 'pointer', '&.MuiTableRow-hover:hover':{backgroundColor: rowBackgroundColor}, '&.Mui-selected':{backgroundColor: rowBackgroundColor, '&:hover':{backgroundColor: rowBackgroundColor}} }}
                  >
                    <TableCell sx={{ ...bodyTableCellSx }}>
                      {isEmpty ? <></> : (
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          id={labelId}
                          onClick={(event) => handleClick(event, row.id)}
                        >
                          {isItemSelected ? <KeyboardArrowUpIcon sx={{fill: isItemSelected ? '#ed9747' : '#656565' }}/> : <KeyboardArrowDownIcon sx={{fill: isItemSelected ? '#ed9747' : '#656565' }}/>}
                        </IconButton>
                      )}
                    </TableCell>

                    {/* <TableCell padding="checkbox" sx={bodyTableCellSx}>
                      {isEmpty ? <></> :
                        <Checkbox
                        sx={{'&:hover':{backgroundColor: 'unset'}}}
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    }
                    </TableCell> */}
                    <TableCell
                      sx={{transform: isEmpty ? 'translateX(260%)' : 'unset', color: isEmpty ? theme.palette.text.disabled : theme.palette.text.primary, ...bodyTableCellSx}}
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.anagrafica}
                    </TableCell>
                    
                    <TableCell sx={{...bodyTableCellSx,}} align="left">{row.tipo}</TableCell>
                    <TableCell sx={{...bodyTableCellSx,}} align="left">{row.speseAvvio}</TableCell>
                    <TableCell sx={{...bodyTableCellSx,}} align="left">{row.spesePostali}</TableCell>
                    <TableCell sx={{...bodyTableCellSx,}} align="left">{row.pagamentoIndennita}</TableCell>
                    <TableCell sx={{...bodyTableCellSx,}} align="left">{row.importoMancatoAccordo}</TableCell>
                    <TableCell sx={{...bodyTableCellSx,}} align="left">{row.importoPositivoPrimoIncontro}</TableCell>
                    <TableCell sx={{...bodyTableCellSx,}} align="left">{row.importoPositivoOltrePrimoIncontro}</TableCell>
                    <TableCell sx={{...bodyTableCellSx,}} align="left">{row.totale}</TableCell>
                    </TableRow>

                    {/* Collapsibile */}
                    <TableRow key={`${row.id}-collapse`} sx={{backgroundColor: 'rgb(245 209 178 / 8%)'}}>
                      <TableCell id={labelId + '-collapse'} style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                        <Collapse in={isItemSelected} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1}}>
                            <Typography variant="h6" gutterBottom component="div">
                              History
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={bodyTableCellSx}>Date</TableCell>
                                  <TableCell sx={bodyTableCellSx}>Customer</TableCell>
                                  <TableCell sx={bodyTableCellSx} align="right">Amount</TableCell>
                                  <TableCell sx={bodyTableCellSx} align="right">Total price ($)</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow key={`${row.id}-body-collapse`}>
                                  <TableCell sx={bodyTableCellSx}>Prova</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
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
          sx={{backgroundColor: footerBackgroundColor, color: theme.palette.background.default, height: '2rem', overflow: 'hidden', display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}
          labelRowsPerPage={"Elementi per pagina"}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>`${from}-${to} di ${count !== -1 ? count : `più di ${to}`}`}
        />
        <EnhancedTableToolbar numSelected={selected == -1 ? 0 : 1} />
      </Paper>
    </Box>

  );
}
