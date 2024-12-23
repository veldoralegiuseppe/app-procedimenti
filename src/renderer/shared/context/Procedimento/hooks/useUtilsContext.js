import { useContext } from 'react';
import {ProcedimentoContext} from '../Procedimento';

const useUtilsContext = () => {
    const utils = useContext(ProcedimentoContext);
    
    return {...utils};
}

export default useUtilsContext;