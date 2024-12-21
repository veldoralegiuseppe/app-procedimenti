import React from 'react';
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useTheme } from '@mui/material/styles';

const Accordion = ({ title, titleSx={}, sx={}, children, isDisabled, isExpanded, onClick, square=false }) => {
  const theme = useTheme();

  return (
    <MuiAccordion sx={sx} disabled={isDisabled} expanded={isExpanded} square={square}>
      <AccordionSummary
        onClick={onClick}
        expandIcon={<ArrowDownwardIcon sx={{ color: 'white' }} />}
        sx={{
          backgroundColor: '#467bae',
          color: 'white',
          height: '48px',
          '&.Mui-expanded': { minHeight: 'unset' },
        }}
      >
        <Typography style={{fontSize: '1.2rem', ...titleSx}}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ backgroundColor: theme.palette.background.default, marginTop: '1rem' }}
      >
        {children}
      </AccordionDetails>
    </MuiAccordion>
  );
};

export default Accordion;
