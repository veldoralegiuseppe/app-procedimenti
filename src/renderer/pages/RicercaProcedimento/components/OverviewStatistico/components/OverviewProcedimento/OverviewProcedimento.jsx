import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import useStatistiche from '../../hooks/useStatistiche';
import { TabellaTransazioni } from '@features/transazione';
import { ModeTypes } from '@ui-shared/metadata';

const PieChartComponent = ({ data, width = 200, height = 100 }) => (
  <div style={{ width, height }}>
    <PieChart series={[{ data }]} width={width} height={height} />
  </div>
);

const OverviewProcedimento = ({ procedimenti = [] }) => {
  const {
    getDistribuzioneEsitoProcedimento,
    getDistribuzioneStatoTransazioni,
    getPieChartData,
    getTransazioniAggregate,
  } = useStatistiche();

  const distribuzioneEsito = React.useMemo(
    () => getPieChartData(getDistribuzioneEsitoProcedimento(procedimenti)),
    [procedimenti]
  );

  const distribuzioneStato = React.useMemo(
    () => getPieChartData(getDistribuzioneStatoTransazioni(procedimenti)),
    [procedimenti]
  );

  const transazioniAggregate = React.useMemo(
    () => getTransazioniAggregate(procedimenti),
    [procedimenti]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '1.5rem' }}>
      {/* Grafici  */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
        }}
      >
        <PieChartComponent data={distribuzioneEsito} />
        <PieChartComponent data={distribuzioneStato} />
      </div>

      {/* Tabella transazioni */}
      <TabellaTransazioni
        transazioni={transazioniAggregate}
        mode={ModeTypes.DETAIL}
      />
    </div>
  );
};

export default OverviewProcedimento;
