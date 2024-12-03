import _ from 'lodash';
import { ModelFactory } from '@shared/factories';

const useMetadata = ({ type, version, keysOrSection, overrides }) => {
  let metadataEnums = ModelFactory.getMetadata(type, version);

  // Supposto che keysOrSection sia un array di chiavi
  let metadata = metadataEnums.metadata;

  if (Array.isArray(keysOrSection)) {
    metadata = keysOrSection.reduce((acc, key) => {
      return { ...acc, [key]:metadata[key] };
    }, {});
  }

  return {
    enums: metadataEnums.enums,
    metadata: _.merge(metadata, overrides),
  };
};
 

export default useMetadata;