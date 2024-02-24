import {StyleSheet, Text, View} from 'react-native';
import isSDKCheck from '../utils/isSDK';
import platform from '../subComponents/Platform';
import {useRoomInfo} from '../components/room-info/useRoomInfo';
import {
  SHARE_LINK_CONTENT_TYPE,
  useShareLink,
} from '../components/useShareLink';
import Spacer from './Spacer';

import React from 'react';
import IconButton from './IconButton';

const InviteInfo = () => {
  const meetingUrlText = 'Room Link';
  const meetingIdText = 'Room ID';
  const hostIdText = 'Host ID';
  const attendeeUrlLabel = 'Attendee Link';
  const attendeeIdLabel = 'Attendee ID';
  const hostUrlLabel = 'Host Link';
  const pstnLabel = 'PSTN';
  const pstnNumberLabel = 'Number';
  const pinLabel = 'Pin';
  const urlWeb = {wordBreak: 'break-all'};

  const {copyShareLinkToClipboard, getShareLink} = useShareLink();
  const {
    data: {isSeparateHostLink},
  } = useRoomInfo();

  const isSDK = isSDKCheck();
  const isWeb = $config.FRONTEND_ENDPOINT || (platform === 'web' && !isSDK);
  const getAttendeeLabel = () => (isWeb ? attendeeUrlLabel : attendeeIdLabel);
  const getHostLabel = () => {
    if (isSeparateHostLink) {
      if (isWeb) {
        return hostUrlLabel;
      }
      return hostIdText;
    } else {
      if (isWeb) {
        return meetingUrlText;
      }
      return meetingIdText;
    }
  };
  return (
    <>
      {isSeparateHostLink ? (
        <>
          <Text style={style.urlTitle}>{getAttendeeLabel()}</Text>
          <View style={style.urlContainer}>
            <View style={{width: '90%'}}>
              <View style={style.urlHolder}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[style.url, isWeb ? urlWeb : {opacity: 1}]}>
                  {getShareLink(SHARE_LINK_CONTENT_TYPE.ATTENDEE)}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginLeft: 'auto',
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
              <IconButton
                iconProps={{
                  name: 'clipboard',
                }}
                onPress={() =>
                  copyShareLinkToClipboard(SHARE_LINK_CONTENT_TYPE.ATTENDEE)
                }
              />
              {/* </View> */}
            </View>
          </View>
          <Text style={style.helpText}>
            Copy the invite and share it with attendees you want to invite.
          </Text>
          <Spacer size={20} />
        </>
      ) : (
        <></>
      )}
      <>
        <Text style={style.urlTitle}>{getHostLabel()}</Text>
        <View style={style.urlContainer}>
          <View style={{width: '90%'}}>
            <View style={style.urlHolder}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[style.url, isWeb ? urlWeb : {opacity: 1}]}>
                {getShareLink(SHARE_LINK_CONTENT_TYPE.HOST)}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginLeft: 'auto',
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <IconButton
              iconProps={{
                name: 'clipboard',
                tintColor: $config.PRIMARY_ACTION_BRAND_COLOR,
              }}
              onPress={() =>
                copyShareLinkToClipboard(SHARE_LINK_CONTENT_TYPE.HOST)
              }
            />
          </View>
        </View>
        <Text style={style.helpText}>
          Copy the invite and share it with other co-hosts you want to invite
        </Text>
      </>
    </>
  );
};

export default InviteInfo;

const style = StyleSheet.create({
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F2',
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  urlTitle: {
    color: $config.FONT_COLOR,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Source Sans Pro',
    textAlign: 'left',
    marginBottom: 8,
  },
  urlHolder: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 30,
  },
  helpText: {
    color: '#CCCCCC',
    marginTop: 10,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Source Sans Pro',
  },
  url: {
    color: $config.FONT_COLOR,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Source Sans Pro',
  },
});
