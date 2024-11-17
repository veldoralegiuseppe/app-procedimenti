import React from 'react';
import BaseRow from './BaseRow';
import CollapsibleDecorator from './decorators/CollapsibleDecorator';
import SelectableDecorator from './decorators/SelectableDecorator';
import PropTypes from 'prop-types';

const RowFactory = ({
  data,
  columns,
  onRowClick,
  collapsibleConfig,
  selectableConfig,
  totalColumns,
  components = {},
  sx,
}) => {
  let RowComponent = BaseRow;

  // Applica i decoratori in ordine
  if (collapsibleConfig) {
    RowComponent = CollapsibleDecorator(RowComponent);
  }

  if (selectableConfig) {
    RowComponent = SelectableDecorator(RowComponent);
  }

  return (
    <tbody>
      {data.map((row, index) => (
        <RowComponent
          sx={{ ...sx }}
          key={index}
          row={row}
          columns={columns}
          onRowClick={onRowClick}
          collapsibleConfig={collapsibleConfig}
          selectableConfig={selectableConfig}
          totalColumns={totalColumns}
        />
      ))}
    </tbody>
  );
};
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
