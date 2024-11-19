import React from 'react';
import { TableRow, TableCell } from '@mui/material';
import PropTypes from 'prop-types';
import TooltipDecorator from './decorators/TooltipDecorator';
import SortableDecorator from './decorators/SortableDecorator';

const HeaderFactory = ({
  columns,
  onSort,
  collapsibleConfig,
  selectableConfig,
  components = {},
  sx,
  order,
  orderBy,
}) => {
  // Recupera i componenti sovrascrivibili o utilizza quelli di default
  const TableHeadComponent = components.TableHead || 'thead';
  const TableRowComponent = components.TableRow || TableRow;
  const TableCellComponent = components.TableCell || TableCell;

  const handleSort = (column) => {
    const isAsc = orderBy === column.field && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    onSort && onSort(column.field, newOrder);
  };

  return (
    <TableHeadComponent sx={{ ...sx }}>
      <TableRowComponent>
        {selectableConfig && Object.keys(selectableConfig).length > 0 && <TableCellComponent sx={{ width: '2.5rem' }} />}

        {columns.map((column) => {
          // Applica i decoratori condizionalmente
          let HeaderContent = (props) => <div style={{...props.sx}}>{props.children}</div>; // Componente base

          if (column.tooltip) {
            HeaderContent = TooltipDecorator(HeaderContent);
          }

          if (column.sortable) {
            HeaderContent = SortableDecorator(HeaderContent);
          }

          return (
            <TableCellComponent sx={column.sx} key={column.field} align={column.align || 'left'}>
              <HeaderContent
                tooltip={column.tooltip}
                sortable={column.sortable}
                active={orderBy === column.field}
                direction={orderBy === column.field ? order : 'asc'}
                onSort={() => handleSort(column)}
                sx={{ fontSize: '.9rem' }}
              >
                {column.headerName}
              </HeaderContent>
            </TableCellComponent>
          );
        })}

        {collapsibleConfig && Object.keys(collapsibleConfig).length > 0 && <TableCellComponent sx={{ width: '2.5rem' }} />}
      </TableRowComponent>
    </TableHeadComponent>
  );
};

export const headerFactoryPropTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      align: PropTypes.oneOf(['left', 'right', 'center']),
      tooltip: PropTypes.string,
    })
  ).isRequired,
  components: PropTypes.shape({
    TableHead: PropTypes.elementType,
    TableCell: PropTypes.elementType,
    TableRow: PropTypes.elementType,
  }),
  collapsibleConfig: PropTypes.object,
  selectableConfig: PropTypes.object,
  sx: PropTypes.object,
  onSort: PropTypes.func,
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
};

HeaderFactory.propTypes = headerFactoryPropTypes;
export default HeaderFactory;
