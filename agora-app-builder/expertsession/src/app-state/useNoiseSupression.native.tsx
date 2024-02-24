import React, {createContext, useState, useEffect} from 'react';
import {ToggleState} from '../../agora-rn-uikit';
import {createHook} from 'customization-implementation';

export interface NoiseSupressionContextInterface {
  isNoiseSupressionEnabled: ToggleState;
  setNoiseSupression: (
    p: (currentState: boolean) => boolean | boolean,
  ) => Promise<void>;
}

export const NoiseSupressionContext =
  createContext<NoiseSupressionContextInterface>({
    isNoiseSupressionEnabled: ToggleState.disabled,
    setNoiseSupression: async () => {},
  });

export function NoiseSupressionProvider(props) {
  const [isNoiseSupressionEnabled, setIsNoiseSupressionEnabled] = useState(
    ToggleState.disabled,
  );

  useEffect(() => {
    if ($config.ENABLE_NOISE_CANCELLATION) {
    }
  }, []);

  const enableNoiseSuppression = async () => {};

  const disableNoiseSuppression = async () => {};

  const setNoiseSupression: NoiseSupressionContextInterface['setNoiseSupression'] =
    async p => {
      if (
        isNoiseSupressionEnabled === ToggleState.disabling ||
        isNoiseSupressionEnabled === ToggleState.enabling
      ) {
        throw new Error('Cant change noise supression, already in transition');
      }
      let stateToBeSet =
        typeof p === 'function'
          ? p(isNoiseSupressionEnabled === ToggleState.enabled)
          : p;

      if (stateToBeSet) {
        setIsNoiseSupressionEnabled(ToggleState.enabling);
        await enableNoiseSuppression();
        setIsNoiseSupressionEnabled(ToggleState.enabled);
      } else {
        setIsNoiseSupressionEnabled(ToggleState.disabling);
        await disableNoiseSuppression();
        setIsNoiseSupressionEnabled(ToggleState.disabled);
      }
    };

  return (
    <NoiseSupressionContext.Provider
      value={{
        isNoiseSupressionEnabled,
        setNoiseSupression,
      }}>
      {props.children}
    </NoiseSupressionContext.Provider>
  );
}

export const useNoiseSupression = createHook(NoiseSupressionContext);
