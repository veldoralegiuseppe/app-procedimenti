import React from 'react';
import { Table, TableContainer } from '@mui/material';
import HeaderFactory, {
  headerFactoryPropTypes,
} from './HeaderFactory/HeaderFactory';
import RowFactory, { rowFactoryPropTypes } from './RowFactory/RowFactory';
import FooterFactory, {
  footerFactoryPropTypes,
} from './FooterFactory/FooterFactory';
import { SelectableProvider } from './RowFactory/decorators/hooks/useSelectableRows';
import PropTypes from 'prop-types';
import { useSortableRows, useTableRows } from './hooks';
import _ from 'lodash';

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
const TableFactoryComponent = ({
  columns,
  data,
  headerConfig,
  rowConfig,
  footerConfig,
  size = 'small',
  sx,
}) => {

  const { rows: tableRows } = useTableRows(columns, data);
  const { rows, handleSort, order, orderBy } = useSortableRows(tableRows || []);

  const totalColumns = React.useMemo(() => 
    columns.length +
    (rowConfig?.collapsibleConfig ? 1 : 0) +
    (rowConfig?.selectableConfig ? 1 : 0), 
    [columns, rowConfig]
  );

  return (
    <SelectableProvider {...rowConfig?.selectableConfig}>
      <TableContainer sx={{ ...sx }}>
        <Table size={size}>
          {/* Header */}
          <HeaderFactory
            {...headerConfig}
            collapsibleConfig={{...rowConfig?.collapsibleConfig}}
            selectableConfig={{...rowConfig?.selectableConfig}}
            totalColumns={totalColumns}
            onSort={handleSort}
            order={order}
            orderBy={orderBy}
            columns={columns}
          />

          {/* Rows */}
          <RowFactory
            {...rowConfig}
            columns={columns}
            data={rows}
            totalColumns={totalColumns}
          />

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

const TableFactory = React.memo(TableFactoryComponent, (prevProps, nextProps) => {
  return (
    _.isEqual(prevProps.columns, nextProps.columns) &&
    _.isEqual(prevProps.data, nextProps.data) &&
    _.isEqual(prevProps.headerConfig, nextProps.headerConfig) &&
    _.isEqual(prevProps.rowConfig, nextProps.rowConfig) &&
    _.isEqual(prevProps.footerConfig, nextProps.footerConfig) &&
    _.isEqual(prevProps.sx, nextProps.sx)
  );
});

TableFactory.whyDidYouRender = true;

TableFactory.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      align: PropTypes.oneOf(['left', 'right', 'center']),
      sortable: PropTypes.bool,
      type: PropTypes.oneOf(['text', 'chip', 'input', 'custom', 'infoChip']),
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
