/*
********************************************
 Copyright © 2021 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/
import React, {createContext, useState} from 'react';
import {UidType, useLocalUid} from '../../agora-rn-uikit';
import useMount from './useMount';
import {IconsInterface} from '../atoms/CustomIcon';
import {NetworkQualities} from '../language/default-labels/videoCallScreenLabels';
import {useRtc} from 'customization-api';

/**
 * Network Icons container object with color and string mapping to network quality stat [ 0 - 8]
 * 0 - Unpublished
 * 1 - Excellent
 * 2 - Good
 * 3 - Bad
 * 4 - Bad
 * 5 - Very Bad
 * 6 - Very Bad
 * 7 - Unsupported
 * 8 - Loading
 */
export const networkIconsObject: {
  [key: number]: {
    icon: keyof IconsInterface;
    tint: string;
    text: NetworkQualities;
  };
} = {
  0: {
    icon: 'connection-unsupported',
    tint: $config.SEMANTIC_NEUTRAL,
    text: 'unknown',
  },
  1: {
    icon: 'connection-good',
    tint: $config.SEMANTIC_SUCCESS,
    text: 'excellent',
  },
  2: {
    icon: 'connection-good',
    tint: $config.SEMANTIC_SUCCESS,
    text: 'good',
  },
  3: {
    icon: 'connection-bad',
    tint: $config.SEMANTIC_WARNING,
    text: 'bad',
  },
  4: {
    icon: 'connection-bad',
    tint: $config.SEMANTIC_WARNING,
    text: 'bad',
  },
  5: {
    icon: 'connection-very-bad',
    tint: $config.SEMANTIC_ERROR,
    text: 'veryBad',
  },
  6: {
    icon: 'connection-very-bad',
    tint: $config.SEMANTIC_ERROR,
    text: 'veryBad',
  },
  7: {
    icon: 'connection-unpublished',
    tint: $config.SEMANTIC_NEUTRAL,
    text: 'unpublished',
  },
  8: {
    icon: 'connection-loading',
    tint: $config.SEMANTIC_NEUTRAL,
    text: 'loading',
  },
};

interface NetworkQualityStatsInterface {
  [key: number]: number;
}

const initNewtorkQualityStats: NetworkQualityStatsInterface = {};

const NetworkQualityContext = createContext(initNewtorkQualityStats);

export default NetworkQualityContext;

export const NetworkQualityConsumer = NetworkQualityContext.Consumer;

export const NetworkQualityProvider: React.FC = (props: {
  children: React.ReactNode;
}) => {
  const localUid = useLocalUid();
  const [networkQualityStats, setNetworkQualityStats] =
    useState<NetworkQualityStatsInterface>({
      [localUid]: 0,
    });
  const {RtcEngineUnsafe} = useRtc();

  useMount(() => {
    function handleNetworkQuality(
      uid: UidType,
      downlinkQuality: number,
      // Currently unused , potential use might be to take weighted average
      // of this alongside the downlink quality.
      uplinkQuality: number,
    ) {
      setNetworkQualityStats((prevNetworkQualityStats) => {
        const updatedNetworkQualityStats = {...prevNetworkQualityStats};
        if (uid === 0) {
          const displayedNetworkQuality =
            // check if either are unsupported (0)
            // if not then display whichever is poorer
            downlinkQuality * uplinkQuality !== 0
              ? downlinkQuality < uplinkQuality
                ? uplinkQuality
                : downlinkQuality
              : 0;
          updatedNetworkQualityStats[localUid] = displayedNetworkQuality;
        } else {
          updatedNetworkQualityStats[uid] = downlinkQuality;
        }
        return updatedNetworkQualityStats;
      });
    }

    RtcEngineUnsafe.addListener('NetworkQuality', handleNetworkQuality);
  });

  return (
    <NetworkQualityContext.Provider value={networkQualityStats}>
      {props.children}
    </NetworkQualityContext.Provider>
  );
};
