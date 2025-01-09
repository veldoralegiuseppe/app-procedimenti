import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import TabellaTransazioni from '../../../../features/transazione/components/TabellaTransazioni/TabellaTransazioni';

const pieChartData = [
  { id: 0, value: 10, label: 'series A' },
  { id: 1, value: 15, label: 'series B' },
  { id: 2, value: 20, label: 'series C' },
];

const PieChartComponent = ({ data, width=200, height=100 }) => (
  <div style={{ width, height }}>
    <PieChart
      series={[{ data }]}
      width={width}
      height={height}
    />
  </div>
);

const OverviewStatistico = () => {
  return (
    <React.Fragment>
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      }}
    >
      <PieChartComponent data={pieChartData} />
      <PieChartComponent data={pieChartData} />
      <PieChartComponent data={pieChartData} />
    </div>

    {/* <TabellaTransazioni /> */}
    </React.Fragment>
  );
};

export default OverviewStatistico;
