import React, {useMemo} from 'react';
import { TableRow, TableCell } from '@mui/material';
import BaseRow from './BaseRow';
import CollapsibleDecorator from './decorators/CollapsibleDecorator';
import SelectableDecorator from './decorators/SelectableDecorator';
import PropTypes from 'prop-types';

const RowFactory = React.memo(
  ({
    data,
    columns,
    onRowClick,
    collapsibleConfig,
    selectableConfig,
    totalColumns,
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
          key={index}
          row={row}
          columns={columns}
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
      _.isEqual(prevProps.data, nextProps.data) &&
      _.isEqual(prevProps.sx, nextProps.sx)
    );
  }
);

export const rowFactoryPropTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  components: PropTypes.shape({
    TableHead: PropTypes.elementType,
    TableCell: PropTypes.elementType,
    TableRow: PropTypes.elementType,
  }),
  sx: PropTypes.object,
  collapsibleConfig: PropTypes.shape({
    renderComponent: PropTypes.func,
  }),
  selectableConfig: PropTypes.shape({
    isMultiSelect: PropTypes.bool,
    initialSelected: PropTypes.arrayOf(PropTypes.number),
    onSelected: PropTypes.func,
  }),
  onRowClick: PropTypes.func,
  totalColumns: PropTypes.number,
};

RowFactory.propTypes = rowFactoryPropTypes;
export default RowFactory;
