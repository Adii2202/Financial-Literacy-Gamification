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
import React, {useContext, useEffect, useRef} from 'react';
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import ColorContext from '../components/ColorContext';
import TextInput from '../atoms/TextInput';
import {useString} from '../utils/useString';
import {useChatMessages} from '../components/chat-messages/useChatMessages';
import {isValidReactComponent, isWebInternal} from '../utils/common';
import {useCustomization} from 'customization-implementation';
import {
  ChatType,
  useChatUIControls,
} from '../components/chat-ui/useChatUIControls';
import {useContent, useUserName} from 'customization-api';
import ImageIcon from '../atoms/ImageIcon';
import ThemeConfig from '../theme';
import {
  groupChatInputPlaceHolderText,
  privateChatInputPlaceHolderText,
} from '../language/default-labels/videoCallScreenLabels';

export interface ChatSendButtonProps {
  render?: (onPress: () => void) => JSX.Element;
}

export const ChatSendButton = (props: ChatSendButtonProps) => {
  const {
    privateChatUser: selectedUserId,
    message,
    setMessage,
    inputActive,
  } = useChatUIControls();
  const {sendChatMessage} = useChatMessages();
  const onPress = () => {
    if (!selectedUserId) {
      sendChatMessage(message);
      setMessage && setMessage('');
    } else {
      sendChatMessage(message, selectedUserId);
      setMessage && setMessage('');
    }
  };
  return props?.render ? (
    props.render(onPress)
  ) : (
    <TouchableOpacity style={[style.chatInputButton]} onPress={onPress}>
      <ImageIcon
        iconType="plain"
        tintColor={
          inputActive
            ? $config.PRIMARY_ACTION_BRAND_COLOR
            : $config.SEMANTIC_NEUTRAL
        }
        name={'send'}
      />
    </TouchableOpacity>
  );
};
export interface ChatTextInputProps {
  render?: (
    message: string,
    onChangeText: (text: string) => void,
    onSubmitEditing: () => void,
    chatMessageInputPlaceholder: string,
  ) => JSX.Element;
}
export const ChatTextInput = (props: ChatTextInputProps) => {
  let chatInputRef = useRef(null);
  const {privateChatUser, message, setMessage, inputActive, chatType} =
    useChatUIControls();
  const {sendChatMessage} = useChatMessages();
  const {defaultContent} = useContent();
  //commented for v1 release
  // const chatMessageInputPlaceholder = useString(
  //   'chatMessageInputPlaceholder',
  // )();
  const [name] = useUserName();
  const groupChatInputPlaceHolder = useString(groupChatInputPlaceHolderText);
  const privateChatInputPlaceHolder = useString(
    privateChatInputPlaceHolderText,
  );

  const chatMessageInputPlaceholder =
    chatType === ChatType.Private
      ? privateChatInputPlaceHolder(defaultContent[privateChatUser]?.name)
      : groupChatInputPlaceHolder(name);
  const onChangeText = (text: string) => setMessage(text);
  const onSubmitEditing = () => {
    if (!privateChatUser) {
      sendChatMessage(message);
      setMessage('');
    } else {
      sendChatMessage(message, privateChatUser);
      setMessage('');
    }
  };
  const {setInputActive} = useChatUIControls();

  useEffect(() => {
    setTimeout(() => {
      if (isWebInternal()) {
        chatInputRef?.current?.focus();
      }
    });
  }, []);

  return props?.render ? (
    props.render(
      message,
      onChangeText,
      onSubmitEditing,
      chatMessageInputPlaceholder,
    )
  ) : (
    <TextInput
      setRef={ref => (chatInputRef.current = ref)}
      onFocus={() => setInputActive(true)}
      onBlur={() => setInputActive(false)}
      value={message}
      onChangeText={onChangeText}
      style={{
        minHeight: 56,
        borderRadius: 0,
        borderBottomLeftRadius: 12,
        borderWidth: 0,
        color: $config.FONT_COLOR,
        textAlign: 'left',
        paddingVertical: 21,
        paddingLeft: 20,
        flex: 1,
        alignSelf: 'center',
        fontFamily: ThemeConfig.FontFamily.sansPro,
        fontWeight: '400',
      }}
      blurOnSubmit={false}
      onSubmitEditing={onSubmitEditing}
      placeholder={chatMessageInputPlaceholder}
      placeholderTextColor={
        $config.FONT_COLOR + ThemeConfig.EmphasisPlus.disabled
      }
      autoCorrect={false}
    />
  );
};

/**
 * Input component for the Chat interface
 */
export const ChatInput = () => {
  const {inputActive} = useChatUIControls();
  return (
    <View style={[style.inputView, inputActive ? style.inputActiveView : {}]}>
      <ChatTextInput />
      <ChatSendButton />
    </View>
  );
};

const style = StyleSheet.create({
  inputActiveView: {
    borderTopWidth: 1,
    borderTopColor: $config.PRIMARY_ACTION_BRAND_COLOR,
  },
  inputView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: $config.CARD_LAYER_2_COLOR,
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
  chatInputButton: {
    flex: 0.1,
    borderBottomRightRadius: 12,
    alignSelf: 'center',
    marginRight: 16,
  },
});
export default ChatInput;
