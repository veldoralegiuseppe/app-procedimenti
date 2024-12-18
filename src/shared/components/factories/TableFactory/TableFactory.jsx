import React from 'react';
import { Table, TableContainer } from '@mui/material';
import HeaderFactory from './HeaderFactory/HeaderFactory';
import RowFactory from './RowFactory/RowFactory';
import FooterFactory from './FooterFactory/FooterFactory';
import { SelectableProvider } from './RowFactory/decorators/hooks/useSelectableRows';
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
  data = [],
  headerConfig: hConfig,
  rowConfig: rConfig,
  footerConfig: fConfig,
  size = 'small',
  sx,
}) => {
  // State 
  const columnsMeta = React.useMemo(() => columns, [columns]);
  const headerConfig = React.useMemo(() => hConfig, [hConfig]);
  const rowConfig = React.useMemo(() => rConfig, [rConfig]);
  const footerConfig = React.useMemo(() => fConfig, [fConfig]);

  const { tableStore, rows: items } = useTableRows(columnsMeta, data);
  //console.log('tableStore', tableStore.getState());
  const { rows, handleSort, order, orderBy } = useSortableRows(items);


  const totalColumns = React.useMemo(
    () =>
      columnsMeta.length +
      (rowConfig?.collapsibleConfig ? 1 : 0) +
      (rowConfig?.selectableConfig ? 1 : 0),
    [columnsMeta, rowConfig]
  );

  return (
    <SelectableProvider {...rowConfig?.selectableConfig}>
      <TableContainer sx={{ ...sx }}>
        <Table size={size}>
          {/* Header */}
          <HeaderFactory
            {...headerConfig}
            collapsibleConfig={{ ...rowConfig?.collapsibleConfig }}
            selectableConfig={{ ...rowConfig?.selectableConfig }}
            totalColumns={totalColumns}
            onSort={handleSort}
            order={order}
            orderBy={orderBy}
            columns={columnsMeta}
          />

          {/* Rows */}
          <RowFactory
            {...rowConfig}
            columns={columnsMeta}
            data={rows}
            store={tableStore}
            totalColumns={totalColumns}
          />

          {/* Footer (opzionale) */}
          {footerConfig && (
            <FooterFactory
              {...footerConfig}
              colSpan={totalColumns}
              dataLength={rows.length}
            />
          )}
        </Table>
      </TableContainer>
    </SelectableProvider>
  );
};

const TableFactory = React.memo(
  TableFactoryComponent,
  (prevProps, nextProps) => {
    return (
      _.isEqual(prevProps.sx, nextProps.sx) &&
      _.isEqual(prevProps.data, nextProps.data) 
    );
  }
);

TableFactory.whyDidYouRender = true;
export default TableFactory;
