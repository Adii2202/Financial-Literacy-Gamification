import {
  useLocalUid,
  useLocalUserInfo,
  useContent,
  useRtc,
  UidType,
} from 'customization-api';
import {useContext, useEffect, useRef} from 'react';
import events, {PersistanceLevel} from '../rtm-events-api';
import useIsLocalUserSpeaking from './useIsLocalUserSpeaking';
import {filterObject} from '../utils/index';
import ChatContext from '../components/ChatContext';
import LocalEventEmitter, {
  LocalEventsEnum,
} from '../rtm-events-api/LocalEvents';

enum volumeEnum {
  IS_SPEAKING = 'IS_SPEAKING',
  SPEAKING_VOLUME = 'SPEAKING_VOLUME',
  NON_SPEAKING_VOLUME = 'NON_SPEAKING_VOLUME',
}
const useFindActiveSpeaker = () => {
  const localUid = useLocalUid();
  const isLocalUserSpeaking = useIsLocalUserSpeaking();
  const {hasUserJoinedRTM} = useContext(ChatContext);
  const {RtcEngineUnsafe} = useRtc();
  const {defaultContent} = useContent();
  const {uid} = useLocalUserInfo();
  const defaultContentRef = useRef(defaultContent);
  const maxSpeakingVolumeRef = useRef(0);
  const minNonSpeakingVolumeRef = useRef(100);
  const usersVolume = useRef({});
  const activeSpeakerUid = useRef(undefined);

  const emitActiveSpeaker = (uid: UidType) => {
    if (uid !== activeSpeakerUid.current) {
      activeSpeakerUid.current = uid;
      LocalEventEmitter.emit(LocalEventsEnum.ACTIVE_SPEAKER, uid);
    }
  };

  useEffect(() => {
    defaultContentRef.current = defaultContent;
  }, [defaultContent]);

  const normalize = (value, min, max) => {
    return (value - min) / (max - min);
  };

  const log: (arg1: string, ...args: any[]) => void = (arg1, ...args) => {
    console.log('[ActiveSpeaker]' + arg1, ...args);
  };

  useEffect(() => {
    if ($config.ACTIVE_SPEAKER) {
      isLocalUserSpeaking
        ? log(' %cLocal user started speaking', 'color:green')
        : log(' %cLocal user stopped speaking', 'color:red');

      //sending local user speaking and non speaking volume to remote users
      let volume = 0;
      //@ts-ignore
      const volumes = RtcEngineUnsafe?.getUsersVolumeLevel();

      const localUserData = volumes.find(i => i.uid == uid);
      if (localUserData && localUserData.level) {
        volume = Math.round(localUserData.level * 100) / 100;
      }
      if (volume) {
        if (isLocalUserSpeaking && volume > maxSpeakingVolumeRef.current) {
          //for remote users
          maxSpeakingVolumeRef.current = volume;
          hasUserJoinedRTM &&
            events.send(
              volumeEnum.SPEAKING_VOLUME,
              volume.toString(),
              PersistanceLevel.Sender,
            );
          //for local user
          speakingVolumeEventCallBack({
            payload: volume.toString(),
            sender: uid,
          });
        } else if (
          !isLocalUserSpeaking &&
          volume < minNonSpeakingVolumeRef.current
        ) {
          //for remote users
          minNonSpeakingVolumeRef.current = volume;
          hasUserJoinedRTM &&
            events.send(
              volumeEnum.NON_SPEAKING_VOLUME,
              volume.toString(),
              PersistanceLevel.Sender,
            );
          //for local user
          nonSpeakingVolumeEventCallback({
            payload: volume.toString(),
            sender: uid,
          });
        }
      }

      //inform local user is speaking
      if (isLocalUserSpeaking) {
        //inform remote users
        hasUserJoinedRTM &&
          events.send(volumeEnum.IS_SPEAKING, 'true', PersistanceLevel.Sender);
        //for local usage
        isSpeakingEventCallback({payload: 'true', sender: uid});
      } else {
        //inform remote users
        hasUserJoinedRTM &&
          events.send(volumeEnum.IS_SPEAKING, 'false', PersistanceLevel.Sender);
        //for local usage
        isSpeakingEventCallback({payload: 'false', sender: uid});
      }
    }
  }, [isLocalUserSpeaking, hasUserJoinedRTM]);

  //findout who is active speaker using usersVolume(speaking and non speaking volume) and current user volume
  const findActiveSpeaker = () => {
    //filter the user id who are all speaking
    const speakingUids = Object.keys(
      //@ts-ignore
      filterObject(usersVolume.current, ([k, v]) => {
        //@ts-ignore
        return v?.isSpeaking && defaultContentRef.current[k]?.audio;
      }),
    );
    if (!speakingUids || speakingUids?.length == 0) {
      log(' %cFinal No Active speaker', 'color:red');
      emitActiveSpeaker(0);
    } else {
      if (speakingUids?.length === 1) {
        log(
          ' %cFinal Active Speaker - Only one user is speaking',
          'color:green',
          defaultContentRef.current[speakingUids[0]]?.name,
        );
        emitActiveSpeaker(parseInt(speakingUids[0]));
      } else {
        //for logging
        let speakerNames = '';

        //get current volume levels for users
        //@ts-ignore
        const currentUsersVolume = RtcEngineUnsafe?.getUsersVolumeLevel();

        const normalizedValues = {};
        speakingUids?.forEach(speakerUid => {
          //for logging
          speakerNames =
            speakerNames + ' ' + defaultContentRef.current[speakerUid]?.name;

          const uuid = parseInt(speakerUid);
          const data = currentUsersVolume?.find(i => i.uid === uuid);
          const returnVal = normalize(
            data?.level || usersVolume.current[uuid]?.speakingVolume, //current level
            usersVolume.current[uuid]?.nonSpeakingVolume || 0,
            usersVolume.current[uuid]?.speakingVolume || 100,
          );
          normalizedValues[uuid] = returnVal;
        });

        log(
          ' %cFinal Multiple users are speaking',
          'color:green',
          speakerNames,
        );

        const sorted = Object.keys(normalizedValues).sort((a, b) => {
          return normalizedValues[b] - normalizedValues[a];
        });

        log(
          ' %cFinal Active Speaker',
          'color:green',
          defaultContentRef.current[sorted[0]]?.name,
        );

        emitActiveSpeaker(parseInt(sorted[0]));

        //for logging purpose
        let obj = {};
        sorted.map(i => {
          let id = parseInt(i);
          const curtdata = currentUsersVolume.find(i => i.uid === id);
          const cl =
            curtdata && curtdata?.level
              ? Math.round(curtdata?.level * 100) / 100
              : 0;
          obj[id] = {
            name: defaultContentRef.current[id]?.name,
            normalizedVolume: normalizedValues[id],
            currentVolume: cl || usersVolume.current[id]?.speakingVolume,
            minNonSpeakingVolume: usersVolume.current[id]?.nonSpeakingVolume,
            speakingVolume: usersVolume.current[id]?.speakingVolume,
            isSpeaking: usersVolume.current[id]?.isSpeaking,
          };
        });
        log(' %cFinal Active speaker data', 'color:green', JSON.stringify(obj));
        //for logging purpose
      }
    }

    /*
    //get current volume levels for users
    //@ts-ignore
    const currentUsersVolume = RtcEngineUnsafe?.getUsersVolumeLevel();

    const normalizedValues = {};

    currentUsersVolume.forEach((i) => {
      //validation
      if (
        defaultContentRef.current[i.uid]?.audio &&
        usersVolume.current[i.uid]?.isSpeaking
      ) {
        const returnVal = normalize(
          i.level, //current level
          usersVolume.current[i.uid]?.nonSpeakingVolume || 0,
          usersVolume.current[i.uid]?.speakingVolume || 100,
        );
        normalizedValues[i.uid] = returnVal;
      }
    });

    const sorted = Object.keys(normalizedValues).sort((a, b) => {
      return normalizedValues[b] - normalizedValues[a];
    });

    if (!sorted || !sorted?.length) {
      console.log('debugging no active speaker');
      setActiveSpeaker(0);
    } else if (
      sorted &&
      sorted.length &&
      parseInt(sorted[0]) !== activeSpeaker
    ) {
      setActiveSpeaker(parseInt(sorted[0]));

      //for logging purpose
      let obj = {};
      sorted.map((i) => {
        let id = parseInt(i);
        const curtdata = currentUsersVolume.find((i) => i.uid === id);
        const cl =
          curtdata && curtdata?.level
            ? Math.round(curtdata?.level * 100) / 100
            : 'no vol';
        obj[id] = {
          name: defaultContentRef.current[id]?.name,
          normalizedVolume: normalizedValues[id],
          currentVolume: cl,
          minNonSpeakingVolume: usersVolume.current[id]?.nonSpeakingVolume,
          speakingVolume: usersVolume.current[id]?.speakingVolume,
          isSpeaking: usersVolume.current[id]?.isSpeaking,
        };
      });
      console.log('debugging active speaker data', JSON.stringify(obj));
      //for logging purpose
    }*/
  };

  const isSpeakingEventCallback = ({payload, sender}) => {
    if (sender == localUid) {
      // log(' local user speaking stauts', sender, '=', payload);
    } else {
      log(' remote user speaking status ', sender, '=', payload);
    }

    usersVolume.current = {
      ...usersVolume.current,
      [sender]: {
        ...usersVolume.current[sender],
        isSpeaking: payload === 'true' ? true : false,
      },
    };
    findActiveSpeaker();
  };

  const speakingVolumeEventCallBack = ({payload, sender}) => {
    if (sender == localUid) {
      log(' local user speaking volume ', sender, '=', payload);
    } else {
      log(' remote user speaking volume ', sender, '=', payload);
    }

    usersVolume.current = {
      ...usersVolume.current,
      [sender]: {
        ...usersVolume.current[sender],
        speakingVolume: parseFloat(payload),
      },
    };
  };

  const nonSpeakingVolumeEventCallback = ({payload, sender}) => {
    if (sender == localUid) {
      log(' local user non speaking volume ', sender, '=', payload);
    } else {
      log(' remote user non speaking volume ', sender, '=', payload);
    }

    usersVolume.current = {
      ...usersVolume.current,
      [sender]: {
        ...usersVolume.current[sender],
        nonSpeakingVolume: parseFloat(payload),
      },
    };
  };
  useEffect(() => {
    if ($config.ACTIVE_SPEAKER) {
      events.on(volumeEnum.SPEAKING_VOLUME, speakingVolumeEventCallBack);
      events.on(volumeEnum.NON_SPEAKING_VOLUME, nonSpeakingVolumeEventCallback);
      events.on(volumeEnum.IS_SPEAKING, isSpeakingEventCallback);
    }

    return () => {
      if ($config.ACTIVE_SPEAKER) {
        events.off(volumeEnum.SPEAKING_VOLUME, speakingVolumeEventCallBack);
        events.off(
          volumeEnum.NON_SPEAKING_VOLUME,
          nonSpeakingVolumeEventCallback,
        );
        events.off(volumeEnum.IS_SPEAKING, isSpeakingEventCallback);
      }
    };
  }, []);

  return null;
};
export default useFindActiveSpeaker;
