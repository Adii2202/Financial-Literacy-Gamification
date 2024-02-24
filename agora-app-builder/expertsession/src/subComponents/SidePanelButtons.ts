import {
  RemoteLiveStreamApprovedRequestRecall,
  RemoteLiveStreamRequestApprove,
  RemoteLiveStreamRequestReject,
  RemoteLiveStreamApprovedRequestRecallProps,
  RemoteLiveStreamControlProps,
} from './livestream';
import RemoteAudioMute, {RemoteAudioMuteProps} from './RemoteAudioMute';
import RemoteVideoMute, {RemoteVideoMuteProps} from './RemoteVideoMute';
import RemoteEndCall, {RemoteEndCallProps} from './RemoteEndCall';
import {
  MuteAllAudioButton,
  MuteAllAudioButtonProps,
  MuteAllVideoButton,
  MuteAllVideoButtonProps,
} from '../components/HostControlView';

type SidePanelButtonsArrayProps = [
  (props: RemoteAudioMuteProps) => JSX.Element,
  (props: RemoteVideoMuteProps) => JSX.Element,
  (props: RemoteEndCallProps) => JSX.Element,
  (props: RemoteLiveStreamApprovedRequestRecallProps) => JSX.Element,
  (props: RemoteLiveStreamControlProps) => JSX.Element,
  (props: RemoteLiveStreamControlProps) => JSX.Element,
  (props: MuteAllAudioButtonProps) => JSX.Element,
  (props: MuteAllVideoButtonProps) => JSX.Element,
];
export const SidePanelButtonsArray: SidePanelButtonsArrayProps = [
  RemoteAudioMute,
  RemoteVideoMute,
  RemoteEndCall,
  RemoteLiveStreamApprovedRequestRecall,
  RemoteLiveStreamRequestApprove,
  RemoteLiveStreamRequestReject,
  MuteAllAudioButton,
  MuteAllVideoButton,
];
