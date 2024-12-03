import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Box } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ChipCell from './ChipCell';
import useChipState from './hooks/useChipState';

const InfoChipCell = ({ tooltipMessage, tooltipPlacement = 'right', nextMessageFn, ...chipProps }) => {
  const { label, chipStyles, handleNextState } = useChipState({
    value: chipProps.value,
    status: chipProps.status,
    nextStateFn: chipProps?.nextStateFn,
  });

  const [tooltip, setTooltip] = React.useState(tooltipMessage);

  const handleClick = () => {
    handleNextState();
    const nextMessage = nextMessageFn?.(chipProps.id, { [chipProps.columnField]: chipProps.status });
    if (nextMessage) {
      setTooltip(nextMessage);
    }
  };

  return (
    <Tooltip title={tooltip} placement={tooltipPlacement}>
      <Box>
        <ChipCell
          {...chipProps}
          value={
            <Box display="flex" alignItems="center" gap={0.5}>
              <InfoOutlinedIcon fontSize="small" />
              {label}
            </Box>
          }
          sx={chipStyles}
          onClick={handleClick}
        />
      </Box>
    </Tooltip>
  );
};

InfoChipCell.propTypes = {
  tooltipMessage: PropTypes.string.isRequired,
  tooltipPlacement: PropTypes.string,
  nextMessageFn: PropTypes.func,
  ...ChipCell.propTypes,
};

export default React.memo(InfoChipCell);
