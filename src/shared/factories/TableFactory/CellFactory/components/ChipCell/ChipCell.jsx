import React from 'react';
import PropTypes from 'prop-types';
import { Chip, Box, Tooltip } from '@mui/material';
import useChipState from './hooks/useChipState';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useModelArrayStore } from '@shared/hooks';

const ChipCell = ({
  columnField,
  id: rowId,
  store,
  onClick,
  nextStateFn,
  sx,
  ...props
}) => {
  const { updateItemById } = useModelArrayStore(store);
  const { label, chipStyles, status, message, handleNextState } = useChipState({
    value: props.value,
    status: props.status,
    nextStateFn,
  });

  const handleClick = () => {
    const {status} = handleNextState();
    updateItemById(rowId, { [columnField]: status });
    onClick?.(rowId, { [columnField]: status });
  };

  return (
    <Chip
      size="small"
      label={
        message ? (
          <Tooltip title={message} placement={props?.tooltipPlacement || 'right'}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <InfoOutlinedIcon fontSize="small" />
              {label}
            </Box>
          </Tooltip>
        ) : (
          label
        )
      }
      onClick={handleClick}
      sx={{ ...chipStyles, ...sx }}
    />
  );
};

ChipCell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  status: PropTypes.oneOf(['red', 'yellow', 'green']).isRequired,
  onClick: PropTypes.func,
  columnField: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  store: PropTypes.object.isRequired,
  nextStateFn: PropTypes.func.isRequired,
  sx: PropTypes.object,
};

export default React.memo(ChipCell);
