import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
} from 'react';
import {createHook} from 'customization-implementation';
import {UidType, useLocalUid} from '../../../agora-rn-uikit';
import {useRoomInfo} from '../room-info/useRoomInfo';
import events, {PersistanceLevel} from '../../rtm-events-api';
import {EventNames} from '../../rtm-events';
import ChatContext from '../ChatContext';
import {useContent} from 'customization-api';

export interface VideoMeetingDataInterface {
  hostUids: UidType[];
  attendeeUids: UidType[];
}
const VideoMeetingData = createContext<VideoMeetingDataInterface>({
  hostUids: [],
  attendeeUids: [],
});

interface VideoMeetingDataProviderProps {
  children: React.ReactNode;
}
const VideoMeetingDataProvider = (props: VideoMeetingDataProviderProps) => {
  const {
    data: {isHost},
  } = useRoomInfo();
  const {activeUids} = useContent();
  const {hasUserJoinedRTM} = useContext(ChatContext);
  const localUid = useLocalUid();
  const [hostUids, setHostUids] = useState<UidType[]>([]);
  const [attendeeUids, setAttendeeUids] = useState<UidType[]>([]);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const hostUidsRef = useRef({hostUids});
  const attendeeUidsRef = useRef({attendeeUids});

  useEffect(() => {
    hostUidsRef.current.hostUids = hostUids;
  }, [hostUids]);

  useEffect(() => {
    attendeeUidsRef.current.attendeeUids = attendeeUids;
  }, [attendeeUids]);

  useEffect(() => {
    //set local uid
    isHost ? setHostUids([localUid]) : setAttendeeUids([localUid]);

    //listen for remote user role
    //if remote user is host then add it in the hostUids
    events.on(EventNames.VIDEO_MEETING_HOST, (data) => {
      const payload = JSON.parse(data?.payload);
      const hostUid = payload?.uid;
      if (hostUid && hostUidsRef?.current?.hostUids.indexOf(hostUid) === -1) {
        setHostUids([...hostUidsRef?.current?.hostUids, hostUid]);
      }
    });

    //if remote user is not host then add it in the attendeeUids
    events.on(EventNames.VIDEO_MEETING_ATTENDEE, (data) => {
      const payload = JSON.parse(data?.payload);
      const attendeeUid = payload?.uid;
      if (
        attendeeUid &&
        attendeeUidsRef?.current?.attendeeUids?.indexOf(attendeeUid) === -1
      ) {
        setAttendeeUids([
          ...attendeeUidsRef?.current?.attendeeUids,
          attendeeUid,
        ]);
      }
    });

    return () => {
      events.off(EventNames.VIDEO_MEETING_HOST);
      events.off(EventNames.VIDEO_MEETING_ATTENDEE);
    };
  }, []);

  useEffect(() => {
    //hasUserJoinedRTM ensure that RTM login successful and events can be sent.
    if (hasUserJoinedRTM) {
      //send user role event so newly joining user will get the previous user role details
      events.send(
        isHost
          ? EventNames.VIDEO_MEETING_HOST
          : EventNames.VIDEO_MEETING_ATTENDEE,
        JSON.stringify({uid: localUid}),
        PersistanceLevel.Sender,
      );
    }
  }, [isHost, hasUserJoinedRTM]);

  useEffect(() => {
    forceUpdate();
  }, [activeUids]);

  return (
    <VideoMeetingData.Provider
      value={{
        hostUids: hostUids.filter((i) => activeUids.indexOf(i) !== -1),
        attendeeUids: attendeeUids.filter((i) => activeUids.indexOf(i) !== -1),
      }}>
      {props.children}
    </VideoMeetingData.Provider>
  );
};
const useVideoMeetingData = createHook(VideoMeetingData);

export {useVideoMeetingData, VideoMeetingDataProvider};
