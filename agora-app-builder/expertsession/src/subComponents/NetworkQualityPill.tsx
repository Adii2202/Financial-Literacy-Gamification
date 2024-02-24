import React, {useContext, useState} from 'react';
import {
  View,
  Image,
  Text,
  Pressable,
  Platform,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {useString} from '../utils/useString';
import {networkIconsObject} from '../components/NetworkQualityContext';
//import {NetworkQualities} from 'src/language/default-labels/videoCallScreenLabels';
import {isMobileUA, isWebInternal} from '../utils/common';
import NetworkQualityContext from '../components/NetworkQualityContext';
import {ContentInterface, UidType} from '../../agora-rn-uikit';
import ThemeConfig from '../theme';
import ImageIcon from '../atoms/ImageIcon';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import {useLayout, useContent} from 'customization-api';
import {getGridLayoutName} from '../pages/video-call/DefaultLayouts';
import {
  NetworkQualities,
  videoTileNetworkQuailtyLabel,
} from '../language/default-labels/videoCallScreenLabels';

/**
 *
 * @param networkStat - Network quality stat [ 0 - 8 ]
 * @param primaryColor - Primary color of the project
 * @param small - Reduced fontsize for pinned view min user panel
 * @param rootStyle - CSS style override primarily used for custom placement
 * @returns This component display overlay network quality indicator with an icon that expands on
 * hover to show network quality text [ ex. Excellent, Good, Bad etc ]
 *
 */
interface NetworkQualityPillProps {
  uid: UidType;
}
const NetworkQualityPill = (props: NetworkQualityPillProps) => {
  const {uid} = props;
  const {defaultContent} = useContent();
  const [networkTextVisible, setNetworkTextVisible] = useState(false);
  const getLabel = useString<NetworkQualities>(videoTileNetworkQuailtyLabel);

  const networkQualityStat = useContext(NetworkQualityContext);
  const networkStat = networkQualityStat[uid]
    ? networkQualityStat[uid]
    : defaultContent[uid]?.audio || defaultContent[uid]?.video
    ? 8
    : 7;
  const {activeUids, customContent} = useContent();
  const activeUidsLen = activeUids?.filter(i => !customContent[i])?.length;
  const {currentLayout} = useLayout();
  const reduceSpace =
    isMobileUA() && activeUidsLen > 4 && currentLayout === getGridLayoutName();
  return (
    <View
      testID="videocall-networkpill"
      style={[
        style.networkPill,
        style.rootStyle,
        {
          backgroundColor: networkTextVisible
            ? networkIconsObject[networkStat].tint +
              hexadecimalTransparency['50%']
            : $config.CARD_LAYER_5_COLOR + hexadecimalTransparency['10%'],
        },
        reduceSpace ? {top: 2, right: 2} : {},
      ]}>
      <PlatformSpecificWrapper
        {...{
          networkTextVisible,
          setNetworkTextVisible,
          reduceSpace,
          activeUidsLen,
        }}>
        <View>
          <ImageIcon
            iconType="plain"
            tintColor={
              networkTextVisible
                ? $config.PRIMARY_ACTION_TEXT_COLOR
                : networkIconsObject[networkStat].tint +
                  hexadecimalTransparency['30%']
            }
            name={networkIconsObject[networkStat].icon}
            iconSize={16}
          />
        </View>
        {networkTextVisible && (
          <Text textBreakStrategy={'simple'} style={style.networkPillText}>
            {getLabel(networkIconsObject[networkStat].text)}
          </Text>
        )}
      </PlatformSpecificWrapper>
    </View>
  );
};

const PlatformSpecificWrapper = ({
  networkTextVisible,
  setNetworkTextVisible,
  children,
  reduceSpace,
  activeUidsLen,
}: any) => {
  return !isWebInternal() ? (
    <Pressable
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: reduceSpace && activeUidsLen > 12 ? 2 : 8,
      }}
      onPress={() => {
        setNetworkTextVisible((visible: boolean) => !visible);
      }}>
      {children}
    </Pressable>
  ) : (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: reduceSpace && activeUidsLen > 12 ? 2 : 8,
      }}
      onClick={e => {
        e.preventDefault();
        setNetworkTextVisible((visible: boolean) => !visible);
      }}
      onMouseEnter={() => {
        setNetworkTextVisible(true);
      }}
      onMouseLeave={() => {
        setNetworkTextVisible(false);
      }}>
      {children}
    </div>
  );
};

const style = StyleSheet.create({
  networkPill: {
    position: 'absolute',
    zIndex: 2,
    borderRadius: 50,
  },
  rootStyle: {
    top: 8,
    right: 8,
  },
  networkPillContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkPillText: {
    color: $config.VIDEO_AUDIO_TILE_TEXT_COLOR,
    fontSize: ThemeConfig.FontSize.small,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default NetworkQualityPill;
