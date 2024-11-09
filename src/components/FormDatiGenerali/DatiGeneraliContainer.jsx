import * as React from 'react';
import DatiGeneraliForm from './DatiGeneraliForm';
import { ProcedimentoContext } from '@context/Procedimento';


const DatiGeneraliContainer = () => {
  const [errors, setErrors] = React.useState({});
  const [touchedFields, setTouchedFields] = React.useState({});

  const { procedimento, handleProcedimentoChange, setProcedimento } = React.useContext(ProcedimentoContext);
  
  return (
    <DatiGeneraliForm
      errors={errors}
      touchedFields={touchedFields}
      procedimento={procedimento}
      onChange={handleProcedimentoChange}
      sezione={'Istanza di mediazione'}
    />
  );
};

export default DatiGeneraliContainer;
