import {useModelFactory, ModelFactory} from '@shared/factories';
import ProcedimentoMetadata from '../factories/metadata/TransazioneMetadata';

const useProcedimentoFactory = (initialProcedimento = {}, version) => {
    return useModelFactory(initialProcedimento, new ModelFactory(version, ProcedimentoMetadata));
}

export default useProcedimentoFactory;