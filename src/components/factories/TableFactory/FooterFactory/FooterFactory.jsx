import * as React from 'react';
import { TableFooter, TableRow, TablePagination } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import _ from 'lodash';

const FooterFactoryComponent = ({
  pagination = false,
  data = [],
  page = 0,
  rowsPerPage = 5,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
  colSpan = 3,
  components = {},
  sx,
}) => {
  const theme = useTheme();

  return (
    <TableFooter sx={{ '& .MuiToolbar-root': { minHeight: '2rem' }, ...sx }}>
      {pagination && (
        <TableRow>
          <TablePagination
            sx={{
              backgroundColor: '#4a769b',
              color: theme.palette.background.default,
            }}
            rowsPerPageOptions={[5, 10, 25]}
            colSpan={colSpan}
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
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

const FooterFactory = React.memo(FooterFactoryComponent, (prevProps, nextProps) => {
  return (
    prevProps.page === nextProps.page &&
    prevProps.rowsPerPage === nextProps.rowsPerPage &&
    _.isEqual(prevProps.sx, nextProps.sx)
  );
});


export const footerFactoryPropTypes = {
  pagination: PropTypes.bool,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  sx: PropTypes.object,
  onPageChange: PropTypes.func,
  onRowPerPageChange: PropTypes.func,
  components: PropTypes.shape({
    TableFooter: PropTypes.elementType,
    TableRow: PropTypes.elementType,
    TablePagination: PropTypes.elementType,
  }),
};

FooterFactory.propTypes = footerFactoryPropTypes;
export default FooterFactory;
