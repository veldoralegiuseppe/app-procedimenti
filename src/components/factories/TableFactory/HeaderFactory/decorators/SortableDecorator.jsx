import React from 'react';
import { TableSortLabel } from '@mui/material';

const SortableDecorator =
  (WrappedComponent) =>
  ({ sortable, active, direction, onSort, ...props }) => {
    if (!sortable) {
      return <WrappedComponent {...props} />;
    }

    return (
      <TableSortLabel
        active={active}
        direction={direction}
        onClick={onSort}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'left',
          '& .MuiTableSortLabel-icon': {
            marginLeft: '4px', // Margine tra il testo e l'icona
            fontSize: '1rem', // Dimensione dell'icona
            alignSelf: 'left', // Allinea verticalmente al centro rispetto alla riga attuale
          },
        }}
      >
        <WrappedComponent {...props} />
      </TableSortLabel>
    );
  };

SortableDecorator.displayName = 'SortableDecorator';

export default SortableDecorator;
