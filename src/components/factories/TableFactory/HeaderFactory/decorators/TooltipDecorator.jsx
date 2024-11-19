import React from 'react';
import { Tooltip } from '@mui/material';

const TooltipDecorator = (WrappedComponent) => (props) => {
  const { tooltip, ...restProps } = props;

  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        <span>
          <WrappedComponent {...restProps} />
        </span>
      </Tooltip>
    );
  }

  return <WrappedComponent {...restProps} />;
};

TooltipDecorator.displayName = 'TooltipDecorator';

export default TooltipDecorator;
