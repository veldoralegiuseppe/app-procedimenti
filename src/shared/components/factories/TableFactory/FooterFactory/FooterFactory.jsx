import * as React from 'react';
import { TableFooter, TableRow, TablePagination } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';

const FooterFactoryComponent = ({
  pagination = false,
  dataLength = 0,
  page: pg = 0,
  rowsPerPage: rowPage = 5,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
  colSpan = 3,
  components = {},
  sx,
}) => {
  const theme = useTheme();
  const [rowsPerPage, setRowsPerPage] = React.useState(rowPage);
  const [page, setPage] = React.useState(pg);

  const handleRowPerPageChange = React.useCallback(
    (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onRowsPerPageChange?.(event);
    },
    [onRowsPerPageChange]
  );

  const handlePageChange = React.useCallback(
    (event, newPage) => {
      setPage(pg);
      onPageChange?.(event, newPage);
    },
    [onPageChange]
  );

  return (
    <TableFooter
      sx={{ '& .MuiToolbar-root': { minHeight: '2rem', ...sx, bottom: 0 } }}
    >
      {pagination && (
        <TableRow>
          <TablePagination
            sx={{
              backgroundColor: '#467bae',
              color: theme.palette.background.default,
            }}
            rowsPerPageOptions={[5, 10, 25]}
            colSpan={colSpan}
            count={dataLength}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowPerPageChange}
            labelRowsPerPage={'Elementi per pagina'}
            labelDisplayedRows={({ from, to, count }) =>
              `Visualizzati da ${from} a ${to} di ${
                count !== -1 ? count : `più di ${to}`
              } risultati`
            }
          />
        </TableRow>
      )}
    </TableFooter>
  );
};

const FooterFactory = React.memo(
  FooterFactoryComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.page === nextProps.page &&
      prevProps.rowsPerPage === nextProps.rowsPerPage &&
      prevProps.dataLength === nextProps.dataLength &&
      _.isEqual(prevProps.sx, nextProps.sx)
    );
  }
);

export default FooterFactory;
