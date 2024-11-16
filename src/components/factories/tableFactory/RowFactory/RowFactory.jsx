import React from 'react';
import BaseRow from './BaseRow';
import CollapsibleDecorator from './decorators/CollapsibleDecorator';
import SelectableDecorator from './decorators/SelectableDecorator';

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
          sx={{...sx}}
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

export default RowFactory;
