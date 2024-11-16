import React from 'react';
import { Paper, Table, TableContainer } from '@mui/material';
import HeaderFactory, {
  headerFactoryPropTypes,
} from './HeaderFactory/HeaderFactory';
import RowFactory, { rowFactoryPropTypes } from './RowFactory/RowFactory';
import FooterFactory, {
  footerFactoryPropTypes,
} from './FooterFactory/FooterFactory';
import { SelectableProvider } from './RowFactory/decorators/hooks/useSelectableRows';
import PropTypes from 'prop-types';
import useSortableRows from './hooks/useSortableRows';

/**
 * Componente TableFactory
 *
 * Questo componente genera una tabella con header, body e footer.
 *
 * @param {Object} props - Le proprietà del componente.
 * @param {Array} props.columns - Le colonne della tabella.
 * @param {string} props.columns[].field - Il campo della colonna.
 * @param {string} props.columns[].headerName - Il nome dell'intestazione della colonna.
 * @param {('left'|'right'|'center')} [props.columns[].align] - L'allineamento del contenuto della colonna.
 * @param {boolean} [props.columns[].sortable] - Se la colonna è ordinabile.
 * @param {('text'|'chip'|'input'|'custom')} [props.columns[].type] - Il tipo di contenuto della colonna.
 * @param {function} [props.columns[].render] - Funzione di rendering personalizzata per la colonna.
 * @param {Array} props.data - I dati da visualizzare nella tabella.
 * @param {Object} props.headerConfig - Configurazione per l'intestazione della tabella.
 * @param {Object} props.rowConfig - Configurazione per le righe della tabella.
 * @param {Object} [props.footerConfig] - Configurazione opzionale per il piè di pagina della tabella.
 * @param {('small'|'medium')} [props.size='small'] - Dimensione della tabella (es. 'small', 'medium').
 * @param {Object} [props.sx] - Stili aggiuntivi per il contenitore della tabella.
 *
 * @returns {JSX.Element} Il componente TableFactory.
 */
const TableFactory = ({
  columns,
  data,
  headerConfig,
  rowConfig,
  footerConfig,
  size = 'small',
  sx,
}) => {
  const { rows, handleSort, order, orderBy } = useSortableRows(data || []);

  const totalColumns =
    columns.length +
    (rowConfig.collapsibleConfig ? 1 : 0) +
    (rowConfig.selectableConfig ? 1 : 0);

  return (
    <SelectableProvider {...rowConfig?.selectableConfig}>
      <TableContainer sx={{ ...sx }} component={Paper}>
        <Table style={{ tableLayout: 'fixed' }} size={size}>
          {/* Header */}
          {headerConfig && (
            <HeaderFactory
              {...headerConfig}
              collapsibleConfig={rowConfig.collapsibleConfig}
              selectableConfig={rowConfig.selectableConfig}
              totalColumns={totalColumns}
              onSort={handleSort}
              order={order}
              orderBy={orderBy}
              columns={columns}
            />
          )}

          {/* Rows */}
          {rowConfig && (
            <RowFactory
              {...rowConfig}
              columns={columns}
              data={rows}
              totalColumns={totalColumns}
            />
          )}

          {/* Footer (opzionale) */}
          {footerConfig && (
            <FooterFactory
              {...footerConfig}
              colSpan={totalColumns}
              data={rows}
            />
          )}
        </Table>
      </TableContainer>
    </SelectableProvider>
  );
};

TableFactory.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      align: PropTypes.oneOf(['left', 'right', 'center']),
      sortable: PropTypes.bool,
      type: PropTypes.oneOf(['text', 'chip', 'input', 'custom']),
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  headerConfig: PropTypes.shape(headerFactoryPropTypes.isRequired),
  rowConfig: PropTypes.shape(rowFactoryPropTypes.isRequired),
  footerConfig: PropTypes.shape(footerFactoryPropTypes),
  size: PropTypes.oneOf(['small', 'medium']),
  sx: PropTypes.object,
};
export default TableFactory;
