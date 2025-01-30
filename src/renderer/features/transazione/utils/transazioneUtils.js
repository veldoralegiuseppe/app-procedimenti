import { ModelTypes } from '@shared/metadata';
import { ModelFactory } from '@ui-shared/components';
import _ from 'lodash';

const extractTransazioni = (obj) => {
    let transazioni = _.values(obj)
    .filter((value) => _.isEqual(value?.type, ModelTypes.TRANSAZIONE))
    .map((t) =>
      ModelFactory.create({
        type: ModelTypes.TRANSAZIONE,
        initialValues: t,
        version: t.version,
      })
    )

    return transazioni || [];
}

export { extractTransazioni };