import { ModelFactory } from '@shared/factories';
import { FieldTypes } from '@shared/metadata';
import _ from 'lodash';

const useTransazioneConstants = () => {

    const { metadati, enums } = ModelFactory.getMetadata(FieldTypes.TRANSAZIONE);
    const statoEnums = enums.stato;

    const statoChipFlagMap = {
        [statoEnums.SALDATO]: 'green',
        [statoEnums.PARZIALMENTE_SALDATO]: 'yellow',
        [statoEnums.DA_SALDARE]: 'red',
    };

    const flagColorToStatoMap = _.invert(statoChipFlagMap);

    return {
        metadati,
        flagColorToStatoMap,
        statoChipFlagMap,
        statoEnums,
    };
};

export default useTransazioneConstants;