import * as React from 'react';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const TransazioneCellRender = (cellData, row) => {
 
  let color;
  let icon;

  switch (row.tipo.toLowerCase()) {
    case 'entrata':
      color = '#176938';
      icon = (
        <TrendingUpIcon
          style={{ color: 'green', marginRight: '8px', marginBottom: '3px' }}
        />
      );
      break;
    case 'uscita':
      color = 'rgb(199 49 49)';
      icon = (
        <TrendingDownIcon
          style={{ color: 'inherit', marginRight: '8px', marginBottom: '3px' }}
        />
      );
      break;
    default:
      icon = null;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        color: color,
        fontSize: '1rem',
      }}
    >
      {icon}
      <span>{row?.id.nome || ''}</span>
    </div>
  );
};

export default TransazioneCellRender;
