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
import React, {useContext} from 'react';
import {View, Text, StyleSheet, Linking} from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import {useString} from '../utils/useString';
import {ChatBubbleProps} from '../components/ChatContext';
import ColorContext from '../components/ColorContext';
import {isWebInternal, trimText} from '../utils/common';
import {useChatUIControls, useContent} from 'customization-api';
import ThemeConfig from '../theme';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import Spacer from '../atoms/Spacer';
import {formatAMPM, isURL} from '../utils';
import {ChatType} from '../components/chat-ui/useChatUIControls';
import {videoRoomUserFallbackText} from '../language/default-labels/videoCallScreenLabels';

const ChatBubble = (props: ChatBubbleProps) => {
  const {defaultContent} = useContent();
  const {primaryColor} = useContext(ColorContext);
  const {chatType, privateChatUser} = useChatUIControls();
  let {
    isLocal,
    isSameUser,
    message,
    createdTimestamp,
    uid,
    isDeleted,
    msgId,
    updatedTimestamp,
    previousMessageCreatedTimestamp,
  } = props;

  let time = formatAMPM(new Date(parseInt(createdTimestamp)));

  let forceShowUserNameandTimeStamp = false;
  //calculate time difference between current message and last message
  //if difference over 2 minutes passed from previous message
  //then show the user and timestamp again even if same user
  if (previousMessageCreatedTimestamp && createdTimestamp) {
    try {
      const startTime = new Date(parseInt(previousMessageCreatedTimestamp));
      const endTime = new Date(parseInt(createdTimestamp));
      let resultInMinutes = 0;
      if (startTime && endTime) {
        const difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
        resultInMinutes = Math.round(difference / 60000);
      }
      forceShowUserNameandTimeStamp =
        resultInMinutes && !isNaN(resultInMinutes) && resultInMinutes >= 2
          ? true
          : false;
    } catch (e) {}
  }

  const handleUrl = (url: string) => {
    if (isWebInternal()) {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };
  const remoteUserDefaultLabel = useString(videoRoomUserFallbackText)();

  return props?.render ? (
    props.render(
      isLocal,
      message,
      createdTimestamp,
      uid,
      msgId,
      isDeleted,
      updatedTimestamp,
      isSameUser,
      previousMessageCreatedTimestamp,
    )
  ) : (
    <>
      {(!isSameUser || forceShowUserNameandTimeStamp) &&
      !(chatType === ChatType.Private && privateChatUser) ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: isLocal ? 'flex-end' : 'flex-start',
            marginBottom: 8,
            marginTop: 14,
            marginHorizontal: 20,
          }}>
          <Text style={style.userNameStyle}>
            {isLocal
              ? 'You'
              : defaultContent[uid]?.name
              ? trimText(defaultContent[uid].name)
              : remoteUserDefaultLabel}
          </Text>
          <Text style={style.timestampStyle}>{time}</Text>
        </View>
      ) : (!isSameUser || forceShowUserNameandTimeStamp) &&
        chatType === ChatType.Private &&
        privateChatUser ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: isLocal ? 'flex-end' : 'flex-start',
            marginBottom: 8,
            marginTop: 14,
            marginHorizontal: 20,
          }}>
          <Text style={style.timestampStyle}>{time}</Text>
        </View>
      ) : (
        <></>
      )}
      <View
        style={[
          isLocal ? style.chatBubbleLocalView : style.chatBubbleRemoteView,
          isURL(message) ? {maxWidth: '88%'} : {},
        ]}>
        <View
          style={
            isLocal
              ? style.chatBubbleLocalViewLayer2
              : style.chatBubbleRemoteViewLayer2
          }>
          <Hyperlink
            onPress={handleUrl}
            linkStyle={{
              color: $config.FONT_COLOR,
              textDecorationLine: 'underline',
            }}>
            <Text style={style.messageStyle} selectable={true}>
              {message}
            </Text>
          </Hyperlink>
        </View>
      </View>
    </>
  );
};

const style = StyleSheet.create({
  userNameStyle: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    fontSize: ThemeConfig.FontSize.tiny,
    color: $config.FONT_COLOR + hexadecimalTransparency['70%'],
  },
  timestampStyle: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.tiny,
    color: $config.FONT_COLOR + hexadecimalTransparency['30%'],
    marginLeft: 4,
  },
  chatBubbleRemoteView: {
    backgroundColor: $config.CARD_LAYER_2_COLOR,
    alignSelf: 'flex-start',
    marginVertical: 2,
    marginHorizontal: 20,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 8,
  },
  chatBubbleRemoteViewLayer2: {
    backgroundColor: 'transparent',
    //  width: '100%',
    // height: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 0,
  },
  chatBubbleLocalViewLayer2: {
    //width: '100%',
    //height: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 0,
    backgroundColor:
      $config.PRIMARY_ACTION_BRAND_COLOR + hexadecimalTransparency['10%'],
  },
  chatBubbleLocalView: {
    backgroundColor:
      $config.CARD_LAYER_5_COLOR + hexadecimalTransparency['20%'],
    alignSelf: 'flex-end',
    marginVertical: 2,
    marginHorizontal: 20,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 0,
  },
  messageStyle: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.small,
    lineHeight: ThemeConfig.FontSize.small * 1.45,
    color: $config.FONT_COLOR,
  },
});

export default ChatBubble;
