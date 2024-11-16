import React, { useState } from 'react';
import { TableCell, IconButton, Collapse, Box, TableRow } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const CollapsibleDecorator = (WrappedRow) => ({ collapsibleConfig, row, columns, totalColumns, children, ...props }) => {
  const [open, setOpen] = useState(false);

  const handleToggle = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <>
      <WrappedRow {...props} open={open} row={row} columns={columns}>
        {React.Children.toArray(children)}
        {collapsibleConfig && (
          <TableCell data-type="collapsible" style={{ width: '50px' }}>
            <IconButton aria-label="expand row" size="small" onClick={handleToggle}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
        )}
      </WrappedRow>
      {collapsibleConfig && (
        <TableRow>
          <TableCell colSpan={totalColumns} style={{ paddingBottom: 0, paddingTop: 0 }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={2}>
                {collapsibleConfig.renderComponent && collapsibleConfig.renderComponent(row)}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
CollapsibleDecorator.displayName = 'CollapsibleDecorator';

export default CollapsibleDecorator;
