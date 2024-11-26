import React from 'react';
import whyDidYouRender from '@welldone-software/why-did-you-render';

if (process.env.NODE_ENV === 'development') {
  whyDidYouRender(React, {
    trackAllPureComponents: false, // Traccia solo i componenti con la proprietà whyDidYouRender
    trackExtraHooks: [[React, 'useMemo'], [React, 'useCallback'], [React, 'useState']],
  });
}
