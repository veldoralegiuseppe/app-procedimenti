import * as React from 'react';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useModelArrayStore } from '@shared/hooks';

const TransazioneCellRender = ({rowId, store, ...props}) => {
 
  let color;
  let icon;
  
  const {findItem} = useModelArrayStore(store);
  const row = findItem((row) => row.id === rowId);

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
      <span>{rowId?.nome || row?.nome || ''}</span>
    </div>
  );
};

export default TransazioneCellRender;
