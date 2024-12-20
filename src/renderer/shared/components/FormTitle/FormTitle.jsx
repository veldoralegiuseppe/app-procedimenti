import React from 'react';
import { Box, Typography } from '@mui/material';

const FormTitle = ({ title, boxSx, titleSx }) => {
  return (
    <Box
      style={{ marginBottom: '1rem', width: '100%' }}
      sx={{
        height: '2rem',
        borderBottom: `1px solid #467bae`,
        ...boxSx,
      }}
    >
      <Typography sx={{ fontSize: '1.2rem', color: '#467bae', ...titleSx }}>
        {title}
      </Typography>
    </Box>
  );
};

export default FormTitle;
