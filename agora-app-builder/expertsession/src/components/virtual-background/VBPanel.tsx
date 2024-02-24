import React, {useContext} from 'react';
import {StyleSheet, Text, View, ScrollView, Dimensions} from 'react-native';

import {
  useIsSmall,
  isMobileUA,
  isWebInternal,
  isAndroid,
  isIOS,
} from '../../../src/utils/common';

import CommonStyles from '../CommonStyles';
import {useLayout} from '../../../src/utils/useLayout';
import {getGridLayoutName} from '../../pages/video-call/DefaultLayouts';
import {VBHeader} from '../../../src/pages/video-call/SidePanelHeader';
import useCaptionWidth from '../../subComponents/caption/useCaptionWidth';

import {useVB, VBMode} from './useVB';

import hexadecimalTransparency from '../../../src/utils/hexadecimalTransparency';
import VideoPreview from './VideoPreview';
import {useLocalUserInfo, usePreCall} from 'customization-api';
import ThemeConfig from '../../theme';
import PrimaryButton from '../../atoms/PrimaryButton';

import PropsContext, {
  ToggleState,
} from '../../../agora-rn-uikit/src/Contexts/PropsContext';
import {IconsInterface} from '../../atoms/CustomIcon';
import InlineNotification from '../../atoms/InlineNotification';
import VBCard from './VBCard';
import LocalSwitchCamera from '../../subComponents/LocalSwitchCamera';
import Spacer from '../../atoms/Spacer';
import {useString} from '../../utils/useString';
import {
  vbPanelHeading,
  vbPanelInfo,
} from '../../language/default-labels/precallScreenLabels';
import {
  vbPanelAppliedBtnText,
  vbPanelApplyBtnText,
} from '../../language/default-labels/videoCallScreenLabels';

const screenHeight = Dimensions.get('window').height;

interface VBCardProps {
  type: VBMode;
  icon: keyof IconsInterface;
  path?: string & {default?: string};
  label?: string;
  position?: number;
  isOnPrecall?: boolean;
  isMobile?: boolean;
}

const isNative = isAndroid() || isIOS();
const VBPanel = (props?: {isOnPrecall?: boolean}) => {
  const {isOnPrecall = false} = props;
  const isSmall = useIsSmall();

  const {currentLayout} = useLayout();
  const {transcriptHeight} = useCaptionWidth();
  const {saveVB, setSaveVB, options} = useVB();
  const {video: localVideoStatus} = useLocalUserInfo();
  const maxPanelHeight = isOnPrecall ? '100%' : screenHeight * 0.8;

  const isLocalVideoON = localVideoStatus === ToggleState.enabled;
  const isMobile = isMobileUA();
  const {isCameraAvailable} = usePreCall();
  const {
    rtcProps: {callActive},
  } = useContext(PropsContext);
  const fallbackText = useString<boolean>(vbPanelInfo)(isCameraAvailable);

  const vbLabel = useString(vbPanelHeading)();
  const applyLabel = useString(vbPanelApplyBtnText)();
  const appliedLabel = useString(vbPanelAppliedBtnText)();

  const PreCallVBHeader = () => (
    <Text
      style={{
        paddingHorizontal: 24,
        fontWeight: '400',
        fontSize: ThemeConfig.FontSize.small,
        color: $config.FONT_COLOR + hexadecimalTransparency['70%'],
        fontFamily: ThemeConfig.FontFamily.sansPro,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: $config.INPUT_FIELD_BORDER_COLOR,
      }}>
      {vbLabel}
    </Text>
  );

  return (
    <View
      style={[
        !callActive
          ? {height: maxPanelHeight}
          : isMobile
          ? CommonStyles.sidePanelContainerNative
          : isSmall()
          ? CommonStyles.sidePanelContainerWebMinimzed
          : CommonStyles.sidePanelContainerWeb,
        isWebInternal() && !isSmall() && currentLayout === getGridLayoutName()
          ? {marginVertical: 4}
          : {},
        //@ts-ignore
        transcriptHeight && !isMobile && {height: transcriptHeight},
        (!isOnPrecall || isMobile) && {
          backgroundColor: $config.CARD_LAYER_1_COLOR,
        },
      ]}>
      {/* VB Header */}
      {isMobile ? (
        <VBHeader />
      ) : isOnPrecall ? (
        <PreCallVBHeader />
      ) : (
        <VBHeader />
      )}

      {/* VB Notification */}
      {!callActive && !isLocalVideoON && !isMobile ? (
        <View style={{padding: 20, paddingBottom: 0}}>
          <InlineNotification text={fallbackText} />
        </View>
      ) : (
        <></>
      )}

      {/* VB Preview */}
      <View style={{justifyContent: 'space-between', flex: 1}}>
        {callActive || isMobile ? (
          <View style={isMobile ? styles.mobilePreviewContainer : {}}>
            {isMobile && isLocalVideoON ? (
              <View style={styles.switchCamera}>
                <LocalSwitchCamera
                  showText={false}
                  iconBackgroundColor={$config.CARD_LAYER_5_COLOR}
                  iconSize={20}
                  iconContainerStyle={{padding: 6}}
                />
              </View>
            ) : (
              <></>
            )}

            <VideoPreview isLocalVideoON={isLocalVideoON} />
          </View>
        ) : (
          <></>
        )}

        {/* Image List */}
        <ScrollView
          horizontal={isMobile}
          showsHorizontalScrollIndicator={isMobile ? false : true}
          style={isMobile ? {maxHeight: 104} : {flex: 1}}
          contentContainerStyle={
            isMobile ? styles.mobileListContainer : styles.desktopListContainer
          }
          decelerationRate={0}>
          {options.map((item, index) => (
            <VBCard
              key={item.id}
              type={item.type}
              icon={item.icon}
              path={item.path}
              label={item?.label}
              translationKey={item?.translationKey}
              position={index + 1}
              isOnPrecall={isOnPrecall}
              isMobile={isMobile}
            />
          ))}
        </ScrollView>
        {isMobile && <Spacer size={20} />}
      </View>

      {/* Save VB Btns */}
      {callActive && !isMobile ? (
        <View style={styles.btnContainer}>
          <View style={{flex: 1}}>
            <PrimaryButton
              textStyle={styles.btnText}
              disabled={saveVB}
              containerStyle={[
                styles.btn,
                {
                  backgroundColor: saveVB
                    ? $config.SEMANTIC_SUCCESS
                    : $config.PRIMARY_ACTION_BRAND_COLOR,
                },
              ]}
              onPress={() => {
                setSaveVB(true);
              }}
              text={saveVB ? appliedLabel : applyLabel}
            />
          </View>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default VBPanel;

const styles = StyleSheet.create({
  desktopListContainer: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mobileListContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  btnText: {
    fontWeight: '600',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: $config.CARD_LAYER_3_COLOR,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: ThemeConfig.BorderRadius.small,
    minWidth: 'auto',
  },
  text: {
    color: $config.SECONDARY_ACTION_COLOR,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
  },
  textContainer: {
    padding: 12,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 171, 0, 0.15)',
    margin: 20,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  iconStyleView: {
    marginRight: 4,
    width: 20,
    height: 20,
  },
  switchCamera: {
    position: 'absolute',
    zIndex: 1,
    elevation: 1,
    top: isNative ? 8 : 8,
    right: isNative ? 8 : 8,
    opacity: 0.7,
  },
  mobilePreviewContainer: {
    width: 250,
    alignSelf: 'center',
    flex: 1,
    marginVertical: 24,
  },
});
