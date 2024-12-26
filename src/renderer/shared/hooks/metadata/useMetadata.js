import _ from 'lodash';
import { ModelFactory } from '@ui-shared/components';

const useMetadata = ({ type, version, keysOrSection, overrides } = {}) => {

  if(!type) {
    let allMetadata = ModelFactory.getMetadata();
    let metadata = {};
    let enums = {};

    Object.entries(allMetadata).forEach(([key, value]) => {
      //console.log('useMetadata', key, value);
      let version = Object.keys(value).pop();
      metadata[key] = value[version].metadata;
      enums[key] = value[version].enums;
    });

    return { metadata, enums };
  }

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