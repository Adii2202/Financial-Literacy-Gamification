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
import React, {useContext, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  SHARE_LINK_CONTENT_TYPE,
  useShareLink,
} from '../../components/useShareLink';
import Popup from '../../atoms/Popup';
import Spacer from '../../atoms/Spacer';
import PrimaryButton from '../../atoms/PrimaryButton';
import TertiaryButton from '../../atoms/TertiaryButton';
import ThemeConfig from '../../theme';
import {CopyMeetingInfo} from '../../components/Share';
import {
  isMobileUA,
  isValidReactComponent,
  useIsDesktop,
} from '../../utils/common';
import {useVideoCall} from '../useVideoCall';
import {useParams} from '../Router';
import useGetMeetingPhrase from '../../utils/useGetMeetingPhrase';
import {ErrorContext} from '../common';
import {useCustomization} from 'customization-implementation';
import {useString} from '../../utils/useString';
import {
  invitePopupPrimaryBtnText,
  invitePopupHeading,
} from '../../language/default-labels/videoCallScreenLabels';
import {cancelText} from '../../language/default-labels/commonLabels';

const InvitePopup = () => {
  const {setShowInvitePopup, showInvitePopup} = useVideoCall();
  const isDesktop = useIsDesktop();
  const {copyShareLinkToClipboard} = useShareLink();
  const {phrase} = useParams<{phrase: string}>();
  const {setGlobalErrorMessage} = useContext(ErrorContext);
  const getMeeting = useGetMeetingPhrase();
  useEffect(() => {
    getMeeting(phrase).catch(error => {
      setGlobalErrorMessage(error);
    });
  }, [phrase]);

  const {InvitePopupContent, InvitePopupTitle} = useCustomization(data => {
    let components: {
      InvitePopupContent?: React.ComponentType;
      InvitePopupTitle?: string;
    } = {
      InvitePopupContent: null,
      InvitePopupTitle: null,
    };
    if (
      data?.components?.videoCall &&
      typeof data?.components?.videoCall === 'object'
    ) {
      if (
        data?.components?.videoCall.invitePopup.renderComponent &&
        typeof data?.components?.videoCall.invitePopup.renderComponent !==
          'object' &&
        isValidReactComponent(
          data?.components?.videoCall.invitePopup.renderComponent,
        )
      ) {
        components.InvitePopupContent =
          data?.components?.videoCall.invitePopup.renderComponent;
      }
      if (data?.components?.videoCall.invitePopup.title) {
        components.InvitePopupTitle =
          data?.components?.videoCall.invitePopup.title;
      }
    }
    return components;
  });
  const inviteOtherToJoinRoomInfo = useString(invitePopupHeading)();
  const copyInvitationButton = useString(invitePopupPrimaryBtnText)();
  const cancelLabel = useString(cancelText)();
  return (
    <Popup
      modalVisible={showInvitePopup}
      setModalVisible={setShowInvitePopup}
      title={InvitePopupTitle ? InvitePopupTitle : inviteOtherToJoinRoomInfo}
      showCloseIcon={true}
      containerStyle={{alignItems: isDesktop('popup') ? 'center' : 'stretch'}}
      contentContainerStyle={style.contentContainer}>
      {InvitePopupContent ? (
        <>
          <Spacer size={10} />
          <InvitePopupContent />
          <Spacer size={10} />
        </>
      ) : (
        <>
          <CopyMeetingInfo showSubLabel={false} />
          <View
            style={
              isDesktop('popup') ? style.btnContainer : style.btnContainerMobile
            }>
            {isDesktop('popup') ? (
              <View style={{flex: 1}}>
                <TertiaryButton
                  text={cancelLabel}
                  textStyle={style.btnText}
                  containerStyle={{
                    width: '100%',
                    height: 48,
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    borderRadius: ThemeConfig.BorderRadius.medium,
                  }}
                  onPress={() => {
                    setShowInvitePopup(false);
                  }}
                />
              </View>
            ) : null}
            {isDesktop('popup') ? (
              <Spacer size={10} horizontal={true} />
            ) : (
              <></>
            )}
            <View style={{flex: 1}}>
              <PrimaryButton
                textStyle={style.btnText}
                containerStyle={{
                  minWidth: 'auto',
                  width: '100%',
                  borderRadius: ThemeConfig.BorderRadius.medium,
                  height: 48,
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                }}
                onPress={() => {
                  copyShareLinkToClipboard(
                    SHARE_LINK_CONTENT_TYPE.MEETING_INVITE,
                  );
                }}
                text={copyInvitationButton}
              />
            </View>
          </View>
        </>
      )}
    </Popup>
  );
};

export default InvitePopup;

const style = StyleSheet.create({
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
  },
  btnContainerMobile: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  btnText: {
    fontWeight: '600',
    fontSize: 16,
  },
  contentContainer: {
    padding: isMobileUA() ? 24 : 40,
    minWidth: 342,
  },
});
