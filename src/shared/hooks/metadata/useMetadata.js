import _ from 'lodash';
import { ModelFactory } from '@shared/factories';

const useMetadata = ({ type, version, keysOrSection, overrides }) => {
  let metadataEnums = ModelFactory.getMetadata(type, version);
  let metadata = metadataEnums.metadata;
  
  if (Array.isArray(keysOrSection)) {
    metadata = keysOrSection.reduce((acc, key) => {
      return { ...acc, [key]:metadata[key] };
    }, {});
    metadata.type = type
  }

  console.log('useMetadata', metadata)
  return {
    enums: metadataEnums.enums,
    metadata: _.merge(metadata, overrides),
  };
};
 

export default useMetadata;