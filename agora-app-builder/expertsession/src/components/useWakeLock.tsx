import NoSleep from 'nosleep.js';
import React from 'react';
import isMobileOrTablet from '../utils/isMobileOrTablet';
import {isWebInternal} from '../utils/common';

const useWakeLock = () => {
  if (isMobileOrTablet() && isWebInternal()) {
    const noSleep = React.useMemo(() => new NoSleep(), []);
    const [awake, set] = React.useState(noSleep.isEnabled);

    const request = React.useCallback(() => {
      noSleep
        .enable()
        .then(() => {
          console.log('enabled sleep successfully');
          set(noSleep.isEnabled);
        })
        .catch((e) => {
          console.log('error enabling sleep', e);
        });
    }, []);

    const release = React.useCallback(() => {
      noSleep.disable();
      set(noSleep.isEnabled);
      console.log('disabled sleep successfully');
    }, []);

    return {
      awake,
      request,
      release,
    };
  }
  return {
    awake: false,
    request: () => {},
    release: () => {},
  };
};

export {useWakeLock};
