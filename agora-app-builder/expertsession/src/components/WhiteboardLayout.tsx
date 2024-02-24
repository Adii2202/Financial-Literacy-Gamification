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
import React, {useContext, useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  useWindowDimensions,
  Text,
} from 'react-native';
import {layoutProps} from '../../theme.json';
import {useLocalUid, useContent} from 'customization-api';
import RenderComponent from '../pages/video-call/RenderComponent';
import IconButton from '../atoms/IconButton';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import {BREAKPOINTS, isMobileUA} from '../utils/common';
import {DispatchContext} from '../../agora-rn-uikit';
import WhiteboardConfigure, {
  whiteboardContext,
} from './whiteboard/WhiteboardConfigure';
import WhiteboardView from './whiteboard/WhiteboardView';

const {topPinned} = layoutProps;

const WhiteboardLayout = ({renderData}) => {
  const {pinnedUid, defaultContent, activeUids} = useContent();
  const activeSpeaker = undefined;
  const [collapse, setCollapse] = useState(false);
  const localUid = useLocalUid();
  const {width, height} = useWindowDimensions();
  const isDesktop = width > BREAKPOINTS.xl;
  const isSidePinnedlayout = topPinned === true ? false : isDesktop; // if either explicity set to false or auto evaluation
  //const [maxUid, ...minUids] = renderData;
  const {dispatch} = useContext(DispatchContext);
  const [uids, setUids] = useState(renderData);

  const [screenShareOn, setScreenShareOn] = useState(false);

  useEffect(() => {
    const nonPinnedUids = activeUids.filter(uid => uid !== pinnedUid);

    const nonActiveSpeakerUids = nonPinnedUids.filter(
      uid => uid !== activeSpeaker,
    );

    const remoteScreenShareUids = nonActiveSpeakerUids.filter(uid => {
      return (
        defaultContent[uid]?.type === 'screenshare' &&
        defaultContent[uid]?.parentUid !== localUid
      );
    });

    const localScreenShareUids = nonActiveSpeakerUids.filter(uid => {
      return (
        defaultContent[uid]?.type === 'screenshare' &&
        defaultContent[uid]?.parentUid === localUid
      );
    });
    if (remoteScreenShareUids?.length || localScreenShareUids?.length) {
      setScreenShareOn(true);
    }

    const restOfTheUids = nonActiveSpeakerUids.filter(
      uid => defaultContent[uid]?.type !== 'screenshare',
    );

    /**
     * Order for pinned layout -
     * - [1] means only one user
     * - [N] means multiple users
     * 1.Pinned User[1]
     * 2.Remote screenshare users[N]
     * 3.Active Speaker[1]
     * 4.Local Screenshare[1]
     * 5 and etc.Other Users[N]
     */

    const updatedOrder = [
      pinnedUid,
      ...remoteScreenShareUids,
      pinnedUid !== activeSpeaker ? activeSpeaker : 0,
      ...localScreenShareUids,
      ...restOfTheUids,
    ].filter(uid => uid !== undefined && uid !== 0);

    setUids(updatedOrder);
  }, [activeUids, defaultContent, activeSpeaker, pinnedUid]);

  //whiteboard changes
  const {whiteboardActive} = useContext(whiteboardContext);
  //whiteboard changes

  if (!whiteboardActive) {
    return (
      <View style={style.infoTextContainer}>
        <Text style={style.infoTextStyle}>No Active Whiteboard.</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: isSidePinnedlayout ? 'row' : 'column',
        flex: 1,
      }}>
      {!collapse && (
        <ScrollView
          horizontal={!isSidePinnedlayout}
          showsHorizontalScrollIndicator={isMobileUA() ? false : true}
          decelerationRate={0}
          style={
            isSidePinnedlayout
              ? {
                  width: '20%',
                  paddingRight: 8,
                }
              : {
                  flex: 1,
                  minHeight: 160,
                  marginBottom: 8,
                }
          }>
          {/* Pinned Video Top View(Desktop minimized and Mobile native and Mobile web) / Side View(Desktop maximized)*/}
          {uids?.map((minUid, i) => {
            //first item -> maximized view so returning null
            if (i === 0 && !whiteboardActive) return null;
            //remaining items -> minimized view
            {
              /**Rendering minimized views */
            }
            return (
              <Pressable
                //old
                //if user pinned somebody then side panel items should not be clickable - swap video should be called
                //instead we will show replace pin button on hovering the video tile
                //old
                disabled={
                  //old fix
                  //activeSpeaker || pinnedUid || screenShareOn ? true : false
                  //old fix

                  //latest fix : pinned video sidepanel layout should not be clickable
                  //if user hover on it we will show pin for me/replace pin(if someone already pinned) button
                  true
                }
                style={
                  isSidePinnedlayout
                    ? {
                        width: '100%',
                        height: width * 0.1125 + 2, // width * 20/100 * 9/16 + 2
                        zIndex: 40,
                        paddingBottom: 8,
                      }
                    : {
                        // width: ((height / 3) * 16) / 9 / 2 + 12, //dim[1] /4.3
                        width: 254,
                        height: '100%',
                        zIndex: 40,
                        marginRight: 8,
                      }
                }
                key={'minVideo' + i}
                onPress={() => {}}>
                <RenderComponent uid={minUid} />
              </Pressable>
            );
          })}
        </ScrollView>
      )}
      {uids && uids?.length && (
        <View
          style={
            isSidePinnedlayout
              ? collapse
                ? style.width100
                : style.width80
              : style.flex8
          }>
          <View style={style.flex1} key={'maxVideo' + uids[0]}>
            {isSidePinnedlayout && (
              <IconButton
                containerStyle={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  zIndex: 999,
                  elevation: 999,
                }}
                onPress={() => setCollapse(!collapse)}
                iconProps={{
                  iconContainerStyle: {
                    padding: 8,
                    backgroundColor:
                      $config.CARD_LAYER_5_COLOR +
                      hexadecimalTransparency['10%'],
                  },
                  name: collapse ? 'collapse' : 'expand',
                  tintColor: $config.SECONDARY_ACTION_COLOR,
                  iconSize: 24,
                }}
              />
            )}
            {pinnedUid ? (
              <IconButton
                containerStyle={{
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  backgroundColor: $config.VIDEO_AUDIO_TILE_OVERLAY_COLOR,
                  borderRadius: 8,
                  flexDirection: 'row',
                  position: 'absolute',
                  top: 8,
                  left: 8 + (isSidePinnedlayout ? 32 + 12 + 8 : 0),
                  zIndex: 999,
                  elevation: 999,
                }}
                iconProps={{
                  iconType: 'plain',
                  iconContainerStyle: {
                    padding: 0,
                  },
                  name: 'unpin-filled',
                  iconSize: 20,
                  tintColor: $config.VIDEO_AUDIO_TILE_TEXT_COLOR,
                }}
                onPress={() => {
                  dispatch({type: 'UserPin', value: [0]});
                }}
                btnTextProps={{
                  text: 'Unpin',
                  textColor: $config.VIDEO_AUDIO_TILE_TEXT_COLOR,
                  textStyle: {
                    marginTop: 0,
                    marginLeft: 6,
                    marginRight: 2,
                    fontWeight: '700',
                  },
                }}
              />
            ) : (
              <></>
            )}
            {/** Render the maximized view */}
            {whiteboardActive ? (
              <WhiteboardView showToolbox={true} />
            ) : (
              <RenderComponent uid={uids[0]} isMax={true} />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  width80: {width: '80%'},
  width100: {width: '100%'},
  flex2: {flex: 2},
  flex8: {flex: 8},
  flex1: {flex: 1},
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

export default WhiteboardLayout;
