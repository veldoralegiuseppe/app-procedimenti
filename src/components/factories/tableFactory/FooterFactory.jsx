import React from 'react';
import { TableFooter, TableRow, TablePagination } from '@mui/material';

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
    <TableFooter sx={{...sx}}>
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

export default FooterFactory;
