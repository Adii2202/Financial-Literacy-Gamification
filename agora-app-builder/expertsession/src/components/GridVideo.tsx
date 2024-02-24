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
import {LayoutComponent, useContent} from 'customization-api';
import React, {useContext, useMemo, useState} from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import {isWebInternal, useIsDesktop} from '../utils/common';
import {useSetPinnedLayout} from '../pages/video-call/DefaultLayouts';
import RenderComponent from '../pages/video-call/RenderComponent';
import {ClientRole, DispatchContext, PropsContext} from '../../agora-rn-uikit';
import LiveStreamAttendeeLandingTile from './livestream/views/LiveStreamAttendeeLandingTile';

const layout = (len: number, isDesktop: boolean = true) => {
  const rows = Math.round(Math.sqrt(len));
  const cols = Math.ceil(len / rows);
  let [r, c] = isDesktop ? [rows, cols] : [cols, rows];
  return {
    matrix:
      len > 0
        ? [
            ...Array(r - 1)
              .fill(null)
              .map(() => Array(c).fill('X')),
            Array(len - (r - 1) * c).fill('X'),
          ]
        : [],
    dims: {r, c},
  };
};

const GridVideo: LayoutComponent = ({renderData}) => {
  const {dispatch} = useContext(DispatchContext);
  const {rtcProps} = useContext(PropsContext);
  const {activeUids, customContent, pinnedUid, secondaryPinnedUid} =
    useContent();
  const isDesktop = useIsDesktop();

  let {matrix, dims} = useMemo(
    () => layout(renderData.length, isDesktop()),
    [renderData.length, isDesktop()],
  );

  const setPinnedLayout = useSetPinnedLayout();

  //livestreaming audience will see this if no host joined the call
  if (
    $config.EVENT_MODE &&
    rtcProps?.role === ClientRole.Audience &&
    activeUids.filter(i => !customContent[i]).length === 0
  ) {
    return <LiveStreamAttendeeLandingTile />;
  }

  return (
    <View style={[style.full]}>
      {matrix.map((r, ridx) => (
        <View
          style={[
            style.gridRow,
            {paddingBottom: ridx === matrix.length - 1 ? 0 : 4},
          ]}
          key={ridx}>
          {r.map((c, cidx) => (
            <Pressable
              disabled={renderData.length === 1}
              onPress={() => {
                //if (!(ridx === 0 && cidx === 0)) {
                const currentUid = renderData[ridx * dims.c + cidx];
                if (
                  currentUid !== pinnedUid &&
                  currentUid !== secondaryPinnedUid
                ) {
                  dispatch({
                    type: 'ActiveSpeaker',
                    value: [renderData[ridx * dims.c + cidx]],
                  });
                }
                //}
                setPinnedLayout();
              }}
              style={{
                flex: isWebInternal() ? 1 / dims.c : 1,
                marginHorizontal: 'auto',
              }}
              key={cidx}>
              <View
                style={[
                  style.gridVideoContainerInner,
                  //if only one item no margin required
                  r?.length > 1
                    ? //first item will have marginRight in the row
                      cidx === 0
                      ? {marginRight: 4}
                      : //last item will have marginLeft in the row
                      cidx === r?.length - 1
                      ? {marginLeft: 4}
                      : //middle item will have marginHorizontal
                        {marginHorizontal: 4}
                    : //if more than one row than add marginHorizontal
                    //for ex: 7 people in the call with 3 column layout. last person tile should be aligned propert
                    ridx > 1
                    ? {marginHorizontal: 4}
                    : {},
                ]}>
                <RenderComponent uid={renderData[ridx * dims.c + cidx]} />
              </View>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
};

const style = StyleSheet.create({
  full: {
    flex: 1,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    paddingTop: 4,
  },
  gridVideoContainerInner: {
    //borderRadius: 12,
    flex: 1,
    overflow: 'hidden',
  },
  infoTextContainer: {
    flex: 1,
    backgroundColor: $config.VIDEO_AUDIO_TILE_COLOR,
    justifyContent: 'center',
    marginHorizontal: 'auto',
    marginVertical: 4,
  },
  infoTextStyle: {
    fontFamily: 'Source Sans Pro',
    fontWeight: '600',
    fontSize: 32,
    color: $config.VIDEO_AUDIO_TILE_AVATAR_COLOR,
    textAlign: 'center',
    padding: 12,
  },
});
export default GridVideo;
