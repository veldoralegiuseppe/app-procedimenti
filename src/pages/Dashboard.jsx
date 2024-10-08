import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography } from '@mui/material';

export default function Dashboard() {
  // Dati di esempio per i fatturati degli ultimi 3 mesi
  const mesi = ['Luglio', 'Agosto', 'Settembre'];
  const fatturatoServizioA = [4500, 5200, 4800]; // Fatturato per Servizio A
  const fatturatoServizioB = [3000, 4000, 3500]; // Fatturato per Servizio B
  const fatturatoServizioC = [6000, 6200, 6100]; // Fatturato per Servizio C

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Fatturato Ultimi 3 Mesi
      </Typography>
      {/* <BarChart
        xAxis={[{ scaleType: 'band', data: mesi }]} // Etichette degli assi (mesi)
        tooltip={{ enabled: false }} 
    
        series={[
          { label: 'Servizio A', data: fatturatoServizioA },
          { label: 'Servizio B', data: fatturatoServizioB },
          { label: 'Servizio C', data: fatturatoServizioC },
        ]}
        width={600}
        height={400}
      /> */}
    </Box>
  );
}
