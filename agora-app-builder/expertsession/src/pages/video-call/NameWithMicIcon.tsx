import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import ThemeConfig from '../../theme';
import ImageIcon from '../../atoms/ImageIcon';
import {useLayout, useContent} from 'customization-api';
import {isMobileUA, isWeb, useIsSmall} from '../../utils/common';
import {getGridLayoutName} from './DefaultLayouts';
import {useVideoContainer} from './VideoRenderer';
import hexadecimalTransparency from '../../utils/hexadecimalTransparency';
import {useString} from '../../utils/useString';
import {videoRoomUserFallbackText} from '../../language/default-labels/videoCallScreenLabels';

export interface NameWithMicIconProps {
  name: string;
  muted?: boolean;
  customBgColor?: string;
  customTextColor?: string;
}

const NameWithMicIcon = (props: NameWithMicIconProps) => {
  const {activeUids, customContent} = useContent();
  const {videoTileWidth} = useVideoContainer();
  const {currentLayout} = useLayout();
  const activeUidsLen = activeUids?.filter(i => !customContent[i])?.length;
  const reduceSpace =
    isMobileUA() &&
    activeUids.length > 4 &&
    currentLayout === getGridLayoutName();
  const {name, muted} = props;
  const remoteUserDefaultLabel = useString(videoRoomUserFallbackText)();
  const isSmall = useIsSmall();
  return (
    <View
      style={[
        style.container,
        {
          maxWidth: videoTileWidth * 0.6 > 180 ? 180 : videoTileWidth * 0.6,
        },
        reduceSpace ? {left: 2, bottom: 2} : {},
        reduceSpace && activeUidsLen > 12 ? {padding: 2} : {},
        props?.customBgColor ? {backgroundColor: props?.customBgColor} : {},
      ]}>
      {muted !== undefined ? (
        <ImageIcon
          iconType="plain"
          name={!muted ? 'mic-on' : 'mic-off'}
          tintColor={
            !muted ? $config.PRIMARY_ACTION_BRAND_COLOR : $config.SEMANTIC_ERROR
          }
          iconSize={20}
        />
      ) : (
        <></>
      )}
      {(isMobileUA() || (!isMobileUA() && isSmall())) &&
      currentLayout === getGridLayoutName() &&
      activeUidsLen > 6 ? (
        <></>
      ) : (
        <PlatformWrapper>
          <Text
            numberOfLines={1}
            textBreakStrategy="simple"
            ellipsizeMode="tail"
            style={[
              style.name,
              props?.customTextColor ? {color: props?.customTextColor} : {},
            ]}>
            {name || remoteUserDefaultLabel}
          </Text>
        </PlatformWrapper>
      )}
    </View>
  );
};
const PlatformWrapper = ({children}) => {
  return isWeb() ? (
    <div
      style={{
        userSelect: 'none',
        MozUserSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
        alignSelf: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: $config.VIDEO_AUDIO_TILE_TEXT_COLOR,
      }}>
      {children}
    </div>
  ) : (
    <>{children}</>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor:
      $config.VIDEO_AUDIO_TILE_OVERLAY_COLOR + hexadecimalTransparency['25%'],
    position: 'absolute',
    alignItems: 'center',
    padding: 8,
    // height: 34,
    left: 8,
    bottom: 8,
    borderRadius: 4,
    flexDirection: 'row',
    zIndex: 5,
  },
  name: {
    color: $config.VIDEO_AUDIO_TILE_TEXT_COLOR,
    fontSize: ThemeConfig.FontSize.small,
    fontWeight: '600',
    fontFamily: ThemeConfig.FontFamily.sansPro,
    flexShrink: 1,
    marginLeft: 4,
    marginRight: 2,
  },
});

export default NameWithMicIcon;
