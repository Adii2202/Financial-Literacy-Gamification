import {I18nBaseType} from '../i18nTypes';
import {room} from './createScreenLabels';
import {MeetingInviteInterface} from './videoCallScreenLabels';

export const shareRoomAttendeeLinkLabel = `share${room}AttendeeLinkLabel`;
export const shareRoomAttendeeLinkSubText = `share${room}AttendeeLinkSubText`;
export const shareRoomHostLinkLabel = `share${room}HostLinkLabel`;
export const shareRoomHostLinkSubText = `share${room}HostLinkSubText`;
export const shareRoomPSTNLabel = `share${room}PSTNLabel`;
export const shareRoomPSTNNumberLabel = `share${room}PSTNNumberLabel`;
export const shareRoomPSTNPinLabel = `share${room}PSTNPinLabel`;
export const shareRoomPSTNSubText = `share${room}PSTNSubText`;
export const shareRoomCopyBtnText = `share${room}CopyBtnText`;
export const shareRoomCopyBtnTooltipText = `share${room}CopyBtnTooltipText`;
export const shareRoomStartBtnText = `share${room}StartBtnText`;
export const shareRoomCopyInviteToClipboardContent = `share${room}CopyInviteToClipboardContent`;
export interface I18nShareLinkScreenLabelsInterface {
  [shareRoomAttendeeLinkLabel]?: I18nBaseType;
  [shareRoomAttendeeLinkSubText]?: I18nBaseType;
  [shareRoomHostLinkLabel]?: I18nBaseType;
  [shareRoomHostLinkSubText]?: I18nBaseType;
  [shareRoomPSTNLabel]?: I18nBaseType;
  [shareRoomPSTNNumberLabel]?: I18nBaseType;
  [shareRoomPSTNPinLabel]?: I18nBaseType;
  [shareRoomPSTNSubText]?: I18nBaseType;
  [shareRoomCopyBtnText]?: I18nBaseType; // need to discuss
  [shareRoomCopyBtnTooltipText]?: I18nBaseType; // need to discuss
  [shareRoomStartBtnText]?: I18nBaseType;
  [shareRoomCopyInviteToClipboardContent]?: I18nBaseType<MeetingInviteInterface>; //
}

export const ShareLinkScreenLabels: I18nShareLinkScreenLabelsInterface = {
  [shareRoomAttendeeLinkLabel]: isWeb =>
    isWeb ? 'Attendee Link' : 'Attendee ID',
  [shareRoomAttendeeLinkSubText]:
    'Share this with attendees you want to invite.',
  [shareRoomHostLinkLabel]: isWeb => (isWeb ? 'Host Link' : 'Host ID'),
  [shareRoomHostLinkSubText]:
    'Share this with other co-hosts you want to invite.',
  [shareRoomPSTNLabel]: 'PSTN',
  [shareRoomPSTNNumberLabel]: 'Number',
  [shareRoomPSTNPinLabel]: 'Pin',
  [shareRoomPSTNSubText]: 'Share this phone number and pin to dial from phone.',

  [shareRoomCopyBtnText]: 'Copy invite to clipboard',
  [shareRoomCopyBtnTooltipText]: 'Copied to clipboard',
  [shareRoomStartBtnText]: ({eventMode}) =>
    eventMode ? 'Start Stream (as host)' : 'Start Room (as host)',

  [shareRoomCopyInviteToClipboardContent]: ({
    meetingName,
    id,
    url,
    pstn,
    isHost,
    isSeparateHostLink,
  }) => {
    let inviteContent = '';
    if (url) {
      //for host
      if (isHost) {
        if (isSeparateHostLink) {
          //seperate link for host and attendee
          inviteContent += `Room: ${meetingName}\n\nAttendee Link:\n${url?.attendee}\n\nHost Link:\n${url?.host}`;
        } else {
          //single link for everyone
          inviteContent += `Room: ${meetingName}\n\nMeeting Link:\n${url?.host}`;
        }
      }
      //for attendee
      else {
        inviteContent += `Room: ${meetingName}\n\nAttendee Link:\n${url?.attendee}`;
      }
    } else {
      if (isHost) {
        if (isSeparateHostLink) {
          inviteContent += `Room: ${meetingName}\n\nAttendee Room ID:\n${id?.attendee}\n\nHost Room ID:\n${id?.host}`;
        } else {
          inviteContent += `Room: ${meetingName}\n\nRoom ID:\n${id?.host}`;
        }
      } else {
        //copy this label on videocall screen
        inviteContent += `Room: ${meetingName}\n\nAttendee Room ID:\n${id?.attendee}`;
      }
    }
    // Adding pstn data into meeting data if present
    if (pstn?.number && pstn?.pin) {
      inviteContent += `\n\nPSTN Number:\n${pstn.number}\n\nPSTN Pin:\n${pstn.pin}`;
    }
    return inviteContent;
  },
};
