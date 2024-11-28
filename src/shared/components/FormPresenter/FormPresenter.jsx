import React from 'react';
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import useFormPresenter from './hooks/useFormPresenter';
import _ from 'lodash';

const FormPresenterComponent = ({
  errors,
  campi = [],
  onChange,
  onBlur,
  sezione = '',
  renderOverrides = {},
  store,
}) => {
  const { renderCustomSection, renderFields } = useFormPresenter({
    errors,
    campi,
    renderOverrides,
    onChange,
    onBlur,
    sezione,
    store
  });

  return (
    <Grid
      container
      sx={{ columnGap: '1rem', rowGap: '1.7rem' }}
      size={{ xs: 12 }}
    >
      {/* Titolo della form */}
      <Grid
        size={{ xs: 12 }}
        sx={{
          height: '2rem',
          borderBottom: `1px solid #467bae`,
        }}
      >
        <Typography sx={{ fontSize: '1.2rem', color: '#467bae' }}>
          {sezione}
        </Typography>
      </Grid>

      {/* Render di una sezione personalizzata o dei campi standard */}
      {renderCustomSection || renderFields}
    </Grid>
  );
};
const FormPresenter = React.memo(FormPresenterComponent, (prevProps, nextProps) => {
  // Evita re-render se le props non cambiano
  return (
    _.isEqual(prevProps.errors, nextProps.errors) &&
    _.isEqual(prevProps.campi, nextProps.campi) &&
    _.isEqual(prevProps.model, nextProps.model) &&
    _.isEqual(prevProps.renderOverrides, nextProps.renderOverrides)
  );
});

FormPresenter.propTypes = {
  errors: PropTypes.object.isRequired,
  campi: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  renderOverrides: PropTypes.shape({
    campi: PropTypes.objectOf(
      PropTypes.shape({
        component: PropTypes.elementType,
        size: PropTypes.object,
        options: PropTypes.array,
      })
    ),
    sezioni: PropTypes.objectOf(
      PropTypes.shape({
        component: PropTypes.elementType,
      })
    ),
  }),
};

FormPresenter.whyDidYouRender = true;

export default FormPresenter;
