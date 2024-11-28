import {useModelFactory, ModelFactory} from '@shared/factories';
import TransazioneMetadata from '../factories/metadata/TransazioneMetadata';

const useTransazioneFactory = (initialTransazione = {}, version) => {
    return useModelFactory(initialTransazione, new ModelFactory(version, TransazioneMetadata));
}

export default useTransazioneFactory;