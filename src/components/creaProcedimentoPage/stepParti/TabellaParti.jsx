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

const headerBackgroundColor = '#4a769b'
const headerBackgroundColor2 = '#ffffff8f'
const footerBackgroundColor = '#4a769b'
const bodyTableCellSx = {borderColor: '#eeeeee', fontWeight: '500', color: '#707070'}


function descendingComparator(a, b, orderBy) {
  console.log(`a: ${JSON.stringify(a)}, b: ${JSON.stringify(b)}, orderBy: ${orderBy}`)
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

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
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
    id: 'cognome',
    numeric: false,
    disablePadding: true,
    label: 'Cognome',
  },
  {
    id: 'nome',
    numeric: false,
    disablePadding: false,
    label: 'Nome',
  },
  {
    id: 'cf',
    numeric: false,
    disablePadding: false,
    label: 'Codice fiscale',
  },
  {
    id: 'speseAvvio',
    numeric: false,
    disablePadding: false,
    label: 'Spese avvio',
  },
  {
    id: 'spesePostali',
    numeric: false,
    disablePadding: false,
    label: 'Spese postali',
  },
  {
    id: 'pagamentoIndennita',
    numeric: false,
    disablePadding: false,
    label: 'Pagamento indennità',
  },
  {
    id: 'totale',
    numeric: false,
    disablePadding: false,
    label: 'Totale',
  },
];

function EnhancedTableHead(props) {
  const theme = useTheme()
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead sx={{color: theme.palette.background.default}}> 
      {/* <TableRow sx={{backgroundColor: headerBackgroundColor, fontFamily: 'Public Sans'}}>
        <TableCell align="center" colSpan={4} sx={{color: 'white', borderBottom: 'none', fontFamily: 'Public Sans', lineHeight: '1rem'}}>
          REFERENZE
        </TableCell>
        <TableCell align="center" colSpan={3} sx={{color: 'white', borderBottom: 'none', fontFamily: 'Public Sans', lineHeight: '1rem'}}>
          IMPORTI
        </TableCell>
      </TableRow> */}
      <TableRow>
        <TableCell padding="checkbox" sx={{color: theme.palette.logo.secondary, backgroundColor: headerBackgroundColor2,  borderBottom: '1px solid #3e678f4d'}}>
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            sx={{
              color: footerBackgroundColor, 
              backgroundColor: headerBackgroundColor2,  
              borderBottom: '1px solid #3e678f4d',
              '& .MuiButtonBase-root:hover':{ color: '#ff9f32a8'},
              '& .MuiButtonBase-root.Mui-active':{ color: theme.palette.logo.secondary, '& svg':{color: theme.palette.logo.secondary}},
            }}
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
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
        <Tooltip title="Elimina">
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

export default function TabellaParti() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('cognome');
  const [selected, setSelected] = React.useState(-1);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isEmpty, setIsEmpty] = React.useState(false)
  const theme = useTheme()

  function createData(id, cognome, nome, cf, speseAvvio, spesePostali, pagamentoIndennita) {
    let totale = Number(speseAvvio.replace('€','').replaceAll('.','').replace(',','.')) + Number(spesePostali.replace('€','').replaceAll('.','').replace(',','.')) + Number(pagamentoIndennita.replace('€','').replaceAll('.','').replace(',','.'))
    totale = '€' + totale.toLocaleString('it-IT',{
      style: 'decimal', 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

    return {
      id,
      cognome,
      nome,
      cf,
      speseAvvio,
      spesePostali,
      pagamentoIndennita,
      totale
    };
  }
  
  const rows = isEmpty ? [createData(1, 'Nessuna parte inserita', '', '', '', '','')] : [
    createData(1, 'ROSSI', 'MARIO', 'ALDGPP97E16F138C', '€10,00', '€10,00','€10,00'),
    createData(2, 'NERI', 'LUIGI', 'VLDGPP97E16F138C', '€100,00', '€100,00','€100,00'),
  ];

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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage],
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
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ pointerEvents: isEmpty ? 'none' : 'auto', cursor: isEmpty ? 'default' : 'pointer', '&.MuiTableRow-hover:hover':{backgroundColor: '#f6dbbc52'}, '&.Mui-selected':{backgroundColor: '#ffe5c8', '&:hover':{backgroundColor: '#ffe5c8'}} }}
                  >
                    <TableCell padding="checkbox" sx={bodyTableCellSx}>
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
                    </TableCell>
                    <TableCell
                      sx={{transform: isEmpty ? 'translateX(244%)' : 'unset',...bodyTableCellSx}}
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.cognome}
                    </TableCell>
                    
                    <TableCell sx={bodyTableCellSx} align="left">{row.nome}</TableCell>
                    <TableCell sx={bodyTableCellSx} align="left">{row.cf}</TableCell>
                    <TableCell sx={bodyTableCellSx} align="left">{row.speseAvvio}</TableCell>
                    <TableCell sx={bodyTableCellSx} align="left">{row.spesePostali}</TableCell>
                    <TableCell sx={bodyTableCellSx} align="left">{row.pagamentoIndennita}</TableCell>
                    <TableCell sx={bodyTableCellSx} align="left">{row.totale}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={8} />
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
