import _ from 'lodash';
import { ModelFactory } from '@shared/components';

const useMetadata = ({ type, version, keysOrSection, overrides }) => {
  let metadataEntry = ModelFactory.getMetadata(type, version);
  let metadata = metadataEntry.metadata;
  
  if (Array.isArray(keysOrSection)) {
    metadata = keysOrSection.reduce((acc, key) => {
      return { ...acc, [key]:metadata[key] };
    }, {});
    metadata.type = type
  }

  return {
    enums: metadataEntry.enums,
    metadata: _.merge(metadata, overrides),
  };
};
 

export default useMetadata;