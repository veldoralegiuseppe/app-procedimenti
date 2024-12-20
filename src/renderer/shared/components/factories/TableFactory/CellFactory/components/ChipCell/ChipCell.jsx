import React from 'react';
import { Chip, Box, Tooltip } from '@mui/material';
import useChipState from './hooks/useChipState';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useModelArrayStore, useStoreDependencies } from '@ui-shared/hooks';
import _ from 'lodash';

const ChipCell = ({
  columnField,
  id: rowId,
  onClick,
  nextStateFn,
  statusLabelMap,
  sx,
  disabled,
  owner,
  fieldKey,
  dependencies,
  ...props
}) => {
  //const { updateItemById } = useModelArrayStore(store);
  const { label, chipStyles, status, message, handleNextState, setMessage, setLabel, setStatus } =
    useChipState({
      value: props.value,
      status: props.status,
      nextStateFn,
    });

  const { value, notifyAll } = useStoreDependencies({
    fieldKey,
    storeType: owner,
    dependencies,
    callback: ({ changes: message }) => {
      setMessage(message);
    },
  });

  React.useEffect(() => {
    if(_.isEqual(value, label) && _.isEqual(status, statusLabelMap?.[value])) return;
    
    if(value && statusLabelMap && statusLabelMap[value]){
      setLabel(value);
      setStatus(statusLabelMap[value]);
      notifyAll(fieldKey, label, value);
    } 
  }, [value]);

  const handleClick = () => {
    if (disabled) return;
    const { status } = handleNextState();
    //updateItemById(rowId, { [columnField]: status });
    onClick?.({ [columnField]: status });
  };

  return (
    <Chip
      size="small"
      label={
        message ? (
          <Tooltip
            title={message}
            placement={props?.tooltipPlacement || 'right'}
          >
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

export default React.memo(ChipCell);
