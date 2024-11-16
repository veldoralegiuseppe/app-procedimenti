import React from 'react';
import { Paper, Table, TableContainer } from '@mui/material';
import HeaderFactory from './HeaderFactory';
import RowFactory from './RowFactory/RowFactory';
import FooterFactory from './FooterFactory';

const TableFactory = ({
  headerConfig,
  rowConfig,
  footerConfig,
  size = 'small',
  sx,
}) => {
  // Calcola il numero totale di colonne
  const totalColumns =
    headerConfig.columns.length +
    (rowConfig.collapsibleConfig ? 1 : 0) +
    (rowConfig.selectableConfig ? 1 : 0);

  return (
      <TableContainer sx={{...sx}} component={Paper}>
        <Table style={{ tableLayout: 'fixed' }} size={size}>
          {/* Header */}
          {headerConfig && (
            <HeaderFactory
              {...headerConfig}
              collapsibleConfig={rowConfig.collapsibleConfig}
              selectableConfig={rowConfig.selectableConfig}
              totalColumns={totalColumns}
            />
          )}

          {/* Rows */}
          {rowConfig && (
            <RowFactory {...rowConfig} totalColumns={totalColumns} />
          )}

          {/* Footer (opzionale) */}
          {footerConfig && (
            <FooterFactory {...footerConfig} colSpan={totalColumns} />
          )}
        </Table>
      </TableContainer>
  );
};

export default TableFactory;
