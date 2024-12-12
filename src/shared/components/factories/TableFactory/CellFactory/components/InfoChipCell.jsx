import * as React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Box } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ChipCell from './ChipCell';
import _ from 'lodash';

/**
 * InfoChipCell: Un'estensione di ChipCell con un'icona di info a sinistra e un tooltip.
 * @param {Object} props - Le proprietà del componente.
 * @param {string} props.tooltipMessage - Il messaggio da visualizzare nel tooltip.
 * @param {Object} props.chipProps - Le props da passare a ChipCell.
 */
const InfoChipCellComponent = ({
  tooltipMessage,
  tooltipPlacement = 'right',
  ...chipProps
}) => {
  // Modifichiamo il label di ChipCell per includere l'icona a sinistra
  const modifiedChipProps = tooltipMessage
    ? {
        ...chipProps,
        value: (
          <Box display="flex" alignItems="center" gap={0.5}>
            <InfoOutlinedIcon fontSize="small" />
            {chipProps.value}
          </Box>
        ),
      }
    : chipProps;

  // Ritorniamo ChipCell all'interno di un Tooltip
  return tooltipMessage ? (
    <Tooltip title={tooltipMessage} placement={tooltipPlacement}>
      <span>
        <ChipCell {...modifiedChipProps} />
      </span>
    </Tooltip>
  ) : (
    <ChipCell {...modifiedChipProps} />
  );
};

const InfoChipCell = React.memo(InfoChipCellComponent, (prevProps, nextProps) => {
  return (
    _.isEqual(prevProps.tooltipMessage, nextProps.tooltipMessage) &&
    _.isEqual(prevProps.tooltipPlacement, nextProps.tooltipPlacement) &&
    _.isEqual(prevProps.chipProps, nextProps.chipProps)
  );
}
);

InfoChipCell.propTypes = {
  tooltipMessage: PropTypes.string,
  tooltipPlacement: PropTypes.string,
  chipProps: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired, // Può essere un elemento React (per includere l'icona)
    status: PropTypes.oneOf(['red', 'yellow', 'green']).isRequired,
    onClick: PropTypes.func,
    row: PropTypes.object,
  }),
};

export default InfoChipCell;
