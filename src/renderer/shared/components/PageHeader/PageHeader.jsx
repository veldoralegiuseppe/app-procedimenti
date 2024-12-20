import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Breadcrumbs } from '@shared/components';

const PageHeaderComponent = ({ title: titolo = '', helperText: helperTxt }) => {
  const theme = useTheme();
  const [title] = React.useState(titolo);
  const [helperText] = React.useState(helperTxt);

  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '56px',
          padding: '0',
        }}
      >
        {title && (
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
              fontSize: '2rem',
              fontWeight: 700,
            }}
          >
            {title}
          </Typography>
        )}
        <Breadcrumbs />
      </Box>

      {helperText && (
        <Typography
          variant="body1"
          sx={{ padding: '16px 0', fontSize: '1.1rem' }}
        >
          {helperText}
        </Typography>
      )}
    </React.Fragment>
  );
};

const PageHeader = React.memo(PageHeaderComponent);
export default PageHeader;
