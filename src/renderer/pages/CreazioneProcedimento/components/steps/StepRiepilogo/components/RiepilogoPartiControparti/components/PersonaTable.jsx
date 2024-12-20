import React from 'react';
import Grid from '@mui/material/Grid2';

const PersonaTable = ({ persona, fields, isXs }) => (
  <Grid
    size={{ xs: 12, md: 6 }}
    sx={{ marginBottom: isXs ? '1.5rem' : '0' }}
  >
    <table
      className="result w100 shs2 rad10"
      style={{ tableLayout: 'fixed' }}
    >
      <tbody>
        {fields.map((field, index) => (
          <tr key={index}>
            <td className="R U" style={{ paddingRight: '10px' }}>
              {field.label}:
            </td>
            <td
              className="L U"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              <b>
                {typeof field.key === 'function' ? field.key(persona) : persona[field.key] || ''}
              </b>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Grid>
);

export default PersonaTable;
