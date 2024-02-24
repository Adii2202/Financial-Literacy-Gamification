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
import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import platform from '../subComponents/Platform';
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';
import {SHARE_LINK_CONTENT_TYPE, useShareLink} from './useShareLink';
import {useString} from '../utils/useString';
import isSDKCheck from '../utils/isSDK';
import Logo from '../components/common/Logo';
import {useRoomInfo} from './room-info/useRoomInfo';
import {useHistory} from '../components/Router';
import {useCustomization} from 'customization-implementation';
import {isMobileUA, isValidReactComponent, trimText} from '../utils/common';
import Card from '../atoms/Card';
import Spacer from '../atoms/Spacer';
import LinkButton from '../atoms/LinkButton';
import ImageIcon from '../atoms/ImageIcon';
import ThemeConfig from '../theme';
import Tooltip from '../atoms/Tooltip';
import IDPLogoutComponent from '../auth/IDPLogoutComponent';
import Clipboard from '../subComponents/Clipboard';
import {
  shareRoomAttendeeLinkLabel,
  shareRoomAttendeeLinkSubText,
  shareRoomCopyBtnText,
  shareRoomCopyBtnTooltipText,
  shareRoomHostLinkLabel,
  shareRoomHostLinkSubText,
  shareRoomPSTNLabel,
  shareRoomPSTNNumberLabel,
  shareRoomPSTNPinLabel,
  shareRoomPSTNSubText,
  shareRoomStartBtnText,
} from '../language/default-labels/shareLinkScreenLabels';

export interface CopyMeetingInfoProps {
  showSubLabel?: boolean;
}
export const CopyMeetingInfo = (props?: CopyMeetingInfoProps) => {
  const {copyShareLinkToClipboard, getShareLink} = useShareLink();
  const {
    data: {roomId, isHost, pstn, isSeparateHostLink},
  } = useRoomInfo();
  const {showSubLabel = true} = props;

  const isSDK = isSDKCheck();
  const isWebCheck =
    $config.FRONTEND_ENDPOINT || (platform === 'web' && !isSDK);

  const shareRoomHostLink = useString<any>(shareRoomHostLinkLabel)(isWebCheck);
  const shareRoomHostLinkSubTextLocal = useString<any>(
    shareRoomHostLinkSubText,
  )();
  const shareRoomAttendeeLink = useString<any>(shareRoomAttendeeLinkLabel)(
    isWebCheck,
  );
  const shareRoomAttendeeLinkSubTextLocal = useString<any>(
    shareRoomAttendeeLinkSubText,
  )();
  const shareRoomPSTN = useString<any>(shareRoomPSTNLabel)();
  const shareRoomPSTNNumber = useString<any>(shareRoomPSTNNumberLabel)();
  const shareRoomPSTNPin = useString<any>(shareRoomPSTNPinLabel)();
  const shareRoomPSTNSubTextLocal = useString<any>(shareRoomPSTNSubText)();

  const copiedToClipboard = useString(shareRoomCopyBtnTooltipText)();

  const getAttendeeLabel = () => shareRoomAttendeeLink;

  const getHostLabel = () => shareRoomHostLink;

  const clipboardIconButton = (type: SHARE_LINK_CONTENT_TYPE) => {
    return (
      <View style={style.iconContainer}>
        <Tooltip
          isClickable
          onPress={() => {
            copyShareLinkToClipboard(type);
          }}
          toolTipIcon={
            <>
              <ImageIcon
                iconType="plain"
                name="tick-fill"
                tintColor={$config.SEMANTIC_SUCCESS}
              />
              <Spacer size={8} horizontal={true} />
            </>
          }
          toolTipMessage={copiedToClipboard}
          renderContent={(isToolTipVisible, setToolTipVisible) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  copyShareLinkToClipboard(type, () => {
                    setToolTipVisible(true);
                  });
                  //setToolTipVisible(true);
                }}>
                <ImageIcon
                  iconType="plain"
                  name="clipboard"
                  tintColor={$config.PRIMARY_ACTION_BRAND_COLOR}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };
  return (
    <>
      {isSeparateHostLink ? (
        <>
          <Text style={style.urlTitle}>{getAttendeeLabel()}</Text>
          <Spacer size={11} />
          <View style={style.container}>
            <View style={style.urlContainer}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  style.url,
                  style.urlPadding,
                  //@ts-ignore
                  isWebCheck ? urlWeb : {opacity: 1},
                ]}>
                {getShareLink(SHARE_LINK_CONTENT_TYPE.ATTENDEE)}
              </Text>
            </View>
            {clipboardIconButton(SHARE_LINK_CONTENT_TYPE.ATTENDEE)}
          </View>

          {showSubLabel && (
            <>
              <Spacer size={14} />
              <Text style={style.helpText}>
                {shareRoomAttendeeLinkSubTextLocal}
              </Text>
            </>
          )}
          <Spacer size={25} />
        </>
      ) : (
        <></>
      )}
      {isHost ? (
        <>
          <Text style={style.urlTitle}>{getHostLabel()}</Text>
          <Spacer size={11} />
          <View style={style.container}>
            <View style={style.urlContainer}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  style.url,
                  style.urlPadding,
                  //@ts-ignore
                  isWebCheck ? urlWeb : {opacity: 1},
                ]}>
                {getShareLink(SHARE_LINK_CONTENT_TYPE.HOST)}
              </Text>
            </View>
            {clipboardIconButton(SHARE_LINK_CONTENT_TYPE.HOST)}
          </View>

          {showSubLabel && (
            <>
              <Spacer size={14} />
              <Text style={style.helpText}>
                {shareRoomHostLinkSubTextLocal}
              </Text>
            </>
          )}
          <Spacer size={25} />
        </>
      ) : (
        <></>
      )}
      {$config.PSTN && pstn && pstn?.number && pstn?.pin ? (
        <>
          <Text style={style.urlTitle}>{shareRoomPSTN}</Text>
          <Spacer size={11} />
          <View style={style.container}>
            <View style={[style.urlContainer, style.urlPadding]}>
              <View>
                <Text
                  style={[
                    style.url,
                    //@ts-ignore
                    isWebCheck ? urlWeb : {opacity: 1},
                  ]}>
                  {shareRoomPSTNNumber} - {pstn?.number} {' | '}{' '}
                  {shareRoomPSTNPin} - {pstn?.pin}
                </Text>
              </View>
            </View>
            {clipboardIconButton(SHARE_LINK_CONTENT_TYPE.PSTN)}
          </View>

          {showSubLabel && (
            <>
              <Spacer size={14} />
              <Text style={style.helpText}>{shareRoomPSTNSubTextLocal}</Text>
            </>
          )}
          {/* <Spacer size={25} /> */}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

const ClipboardIconButtonURL = ({url}) => {
  const copiedToClipboard = useString(shareRoomCopyBtnTooltipText)();
  return (
    <View style={style.iconContainer}>
      <Tooltip
        isClickable
        onPress={() => {
          Clipboard.setString(url);
        }}
        toolTipIcon={
          <>
            <ImageIcon
              iconType="plain"
              name="tick-fill"
              tintColor={$config.SEMANTIC_SUCCESS}
            />
            <Spacer size={8} horizontal={true} />
          </>
        }
        toolTipMessage={copiedToClipboard}
        renderContent={(isToolTipVisible, setToolTipVisible) => {
          return (
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(url);
                setToolTipVisible(true);
              }}>
              <ImageIcon
                iconType="plain"
                name="clipboard"
                tintColor={$config.PRIMARY_ACTION_BRAND_COLOR}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};
export interface ShowInputURLProps {
  label: string;
  url: string;
}
export const ShowInputURL = (props: ShowInputURLProps) => {
  const {label, url} = props;
  if (!url) {
    return null;
  }
  return (
    <>
      {label ? (
        <>
          <Text style={style.urlTitle}>{label}</Text>
          <Spacer size={11} />
        </>
      ) : (
        <></>
      )}
      <View style={style.container}>
        <View style={style.urlContainer}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              style.url,
              style.urlPadding,
              //@ts-ignore
              urlWeb,
            ]}>
            {url}
          </Text>
        </View>
        <ClipboardIconButtonURL url={url} />
      </View>
    </>
  );
};

const Share = () => {
  const {FpeShareComponent} = useCustomization(data => {
    let components: {
      FpeShareComponent?: React.ElementType;
    } = {};
    // commented for v1 release
    // if (
    //   data?.components?.share &&
    //   typeof data?.components?.share !== 'object'
    // ) {
    //   if (
    //     data?.components?.share &&
    //     isValidReactComponent(data?.components?.share)
    //   ) {
    //     components.FpeShareComponent = data?.components?.share;
    //   }
    // }
    return components;
  });
  const {copyShareLinkToClipboard} = useShareLink();
  const {
    data: {roomId, meetingTitle},
  } = useRoomInfo();

  const shareRoomStartBtnTextLocal = useString<any>(shareRoomStartBtnText)({
    eventMode: $config.EVENT_MODE,
  });

  const copyInviteButton = useString(shareRoomCopyBtnText)();
  const history = useHistory();
  const enterMeeting = () => {
    if (roomId?.host) {
      history.push(roomId.host);
    }
  };

  return FpeShareComponent ? (
    <FpeShareComponent />
  ) : (
    <View style={style.root}>
      {!isMobileUA() ? (
        <IDPLogoutComponent containerStyle={{marginBottom: -100}} />
      ) : (
        <></>
      )}
      <ScrollView contentContainerStyle={style.scrollMain}>
        <Card>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Logo />
              {isMobileUA() ? (
                <IDPLogoutComponent
                  containerStyle={{marginTop: 0, marginRight: 0}}
                />
              ) : (
                <></>
              )}
            </View>
            <Spacer size={20} />
            <Text style={style.heading} numberOfLines={1}>
              {trimText(meetingTitle)}
            </Text>
            <Spacer size={40} />
            <CopyMeetingInfo />
            <Spacer size={60} />
          </View>
          <View style={style.btnContainer}>
            <PrimaryButton
              iconName="video-on"
              onPress={() => enterMeeting()}
              containerStyle={isMobileUA() && {width: '100%'}}
              text={shareRoomStartBtnTextLocal}
            />
            <Spacer size={16} />
            <LinkButton
              text={copyInviteButton}
              onPress={() =>
                copyShareLinkToClipboard(SHARE_LINK_CONTENT_TYPE.MEETING_INVITE)
              }
            />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};
const urlWeb = {wordBreak: 'break-all'};

const style = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollMain: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  heading: {
    fontSize: ThemeConfig.FontSize.extraLarge,
    fontWeight: '700',
    lineHeight: ThemeConfig.FontSize.extraLarge,
    color: $config.FONT_COLOR,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    paddingVertical: 2,
  },
  container: {
    flexDirection: 'row',
  },
  urlTitle: {
    color: $config.FONT_COLOR,
    fontSize: ThemeConfig.FontSize.medium,
    fontWeight: '600',
    fontFamily: ThemeConfig.FontFamily.sansPro,
    paddingLeft: 8,
  },
  urlContainer: {
    flex: 0.9,
    backgroundColor: $config.INPUT_FIELD_BACKGROUND_COLOR,
    borderColor: $config.INPUT_FIELD_BORDER_COLOR,
    borderWidth: 1,
    borderTopLeftRadius: ThemeConfig.BorderRadius.medium,
    borderBottomLeftRadius: ThemeConfig.BorderRadius.medium,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  iconContainer: {
    flex: 0.1,
    minWidth: 25,
    backgroundColor: $config.INPUT_FIELD_BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: $config.INPUT_FIELD_BORDER_COLOR,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopRightRadius: ThemeConfig.BorderRadius.medium,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: ThemeConfig.BorderRadius.medium,
    borderTopLeftRadius: 0,
  },
  url: {
    color: $config.FONT_COLOR + ThemeConfig.EmphasisPlus.medium,
    fontSize: ThemeConfig.FontSize.small,
    fontWeight: '600',
    fontFamily: ThemeConfig.FontFamily.sansPro,
  },
  urlPadding: {
    paddingHorizontal: 20,
    paddingVertical: 21,
  },
  clipboardIcon: {
    width: 17,
    height: 20,
  },
  btnContainer: {
    width: '100%',
    alignItems: 'center',
  },
  helpText: {
    color: $config.FONT_COLOR + ThemeConfig.EmphasisPlus.disabled,
    fontSize: ThemeConfig.FontSize.small,
    lineHeight: ThemeConfig.FontSize.small,
    fontWeight: '400',
    fontFamily: ThemeConfig.FontFamily.sansPro,
    paddingLeft: 8,
  },
});

export default Share;
