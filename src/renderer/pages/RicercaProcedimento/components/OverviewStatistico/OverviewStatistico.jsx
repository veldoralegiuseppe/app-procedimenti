import React from 'react';
import OverviewProcedimento from './components/OverviewProcedimento/OverviewProcedimento';

const OverviewStatistico = ({ queryStore = {} }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '1.5rem',
      }}
    >
      <OverviewProcedimento procedimenti={[]} />
    </div>
  );
};

export default OverviewStatistico;
