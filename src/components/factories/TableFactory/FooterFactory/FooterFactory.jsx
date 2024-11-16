import React from 'react';
import { TableFooter, TableRow, TablePagination } from '@mui/material';
import PropTypes from 'prop-types';

const FooterFactory = ({
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
  return (
    <TableFooter sx={{ ...sx }}>
      {pagination && (
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            colSpan={colSpan}
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </TableRow>
      )}
    </TableFooter>
  );
};

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
