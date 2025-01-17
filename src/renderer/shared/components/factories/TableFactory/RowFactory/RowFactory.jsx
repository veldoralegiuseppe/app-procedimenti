import React, {useMemo} from 'react';
import { TableRow, TableCell } from '@mui/material';
import BaseRow from './BaseRow';
import CollapsibleDecorator from './decorators/CollapsibleDecorator';
import SelectableDecorator from './decorators/SelectableDecorator';
import _ from 'lodash';

const RowFactory = React.memo(
  ({
    data,
    columns,
    onRowClick,
    collapsibleConfig,
    selectableConfig,
    totalColumns,
    store,
    components = {},
    sx,
  }) => {

    const RowComponent = useMemo(() => {
      let Component = BaseRow;
      if (collapsibleConfig) {
        Component = CollapsibleDecorator(Component);
      }
      if (selectableConfig) {
        Component = SelectableDecorator(Component);
      }
      return Component;
    }, [collapsibleConfig, selectableConfig]);

    const renderedRows = useMemo(() => {
      if (data.length === 0) {
        return (
          <TableRow>
            <TableCell
              colSpan={totalColumns}
              sx={{
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}
            >
              Nessun elemento da visualizzare
            </TableCell>
          </TableRow>
        );
      }

      return data.map((row, index) => (
        <RowComponent
          sx={{
            '& td': {
              borderBottom: collapsibleConfig
                ? 'none'
                : '1px solid rgba(224, 224, 224, 1)',
            },
            ...sx,
          }}
          key={'row-'+index}
          id={row.id}
          row={row}
          columns={columns}
          store={store}
          onRowClick={onRowClick}
          collapsibleConfig={collapsibleConfig}
          selectableConfig={selectableConfig}
          totalColumns={totalColumns}
        />
      ));
    }, [
      data,
      RowComponent,
      columns,
      onRowClick,
      collapsibleConfig,
      selectableConfig,
      totalColumns,
      sx,
    ]);

    return <tbody>{renderedRows}</tbody>;
  },
  (prevProps, nextProps) => {
    return (
      prevProps.data === nextProps.data &&
      _.isEqual(prevProps.sx, nextProps.sx)
    );
  }
);

export default RowFactory;
