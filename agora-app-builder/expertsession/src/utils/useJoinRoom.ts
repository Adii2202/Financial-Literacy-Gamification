import {useContext} from 'react';
import {gql} from '@apollo/client';
import StorageContext from '../components/StorageContext';
import {RoomInfoContextInterface} from '../components/room-info/useRoomInfo';
import {useSetRoomInfo} from '../components/room-info/useSetRoomInfo';
import {GraphQLContext} from '../components/GraphQLProvider';
import useGetName from './useGetName';
import useWaitingRoomAPI from '../subComponents/waiting-rooms/useWaitingRoomAPI';

const JOIN_CHANNEL_PHRASE_AND_GET_USER = gql`
  query JoinChannel($passphrase: String!) {
    joinChannel(passphrase: $passphrase) {
      channel
      title
      isHost
      secret
      mainUser {
        rtc
        rtm
        uid
      }
      whiteboard {
        room_uuid
        room_token
      }
      screenShare {
        rtc
        rtm
        uid
      }
    }
    getUser {
      name
      email
    }
  }
`;

const JOIN_CHANNEL_PHRASE = gql`
  query JoinChannel($passphrase: String!) {
    joinChannel(passphrase: $passphrase) {
      channel
      title
      isHost
      secret
      mainUser {
        rtc
        rtm
        uid
      }
      whiteboard {
        room_uuid
        room_token
      }
      screenShare {
        rtc
        rtm
        uid
      }
    }
  }
`;
/**
 * Returns an asynchronous function to join a meeting with the given phrase.
 */
export default function useJoinRoom() {
  const {store} = useContext(StorageContext);
  const {setRoomInfo} = useSetRoomInfo();

  const {client} = useContext(GraphQLContext);
  const username = useGetName();
  const {request: requestToJoin} = useWaitingRoomAPI();
  const isWaitingRoomEnabled = $config.ENABLE_WAITING_ROOM;

  return async (phrase: string) => {
    setRoomInfo(prevState => {
      return {
        ...prevState,
        isJoinDataFetched: false,
      };
    });
    try {
      let response = null;
      if (isWaitingRoomEnabled) {
        response = await requestToJoin({
          meetingPhrase: phrase,
          send_event: false,
        });
      } else {
        response = await client.query({
          query:
            store.token === null
              ? JOIN_CHANNEL_PHRASE
              : JOIN_CHANNEL_PHRASE_AND_GET_USER,
          variables: {
            passphrase: phrase,
            //userName: username,
          },
        });
      }
      if (response?.error) {
        throw response.error;
      } else {
        if ((response && response.data) || isWaitingRoomEnabled) {
          let data = isWaitingRoomEnabled ? response : response.data;
          let roomInfo: Partial<RoomInfoContextInterface['data']> = {};

          if (data?.joinChannel?.channel || data?.channel) {
            roomInfo.channel = isWaitingRoomEnabled
              ? data.channel
              : data.joinChannel.channel;
          }
          if (data?.joinChannel?.mainUser?.uid || data?.mainUser?.uid) {
            roomInfo.uid = isWaitingRoomEnabled
              ? data.mainUser.uid
              : data.joinChannel.mainUser.uid;
          }
          if (data?.joinChannel?.mainUser?.rtc || data?.mainUser?.rtc) {
            roomInfo.token = isWaitingRoomEnabled
              ? data.mainUser.rtc
              : data.joinChannel.mainUser.rtc;
          }
          if (data?.joinChannel?.mainUser?.rtm || data?.mainUser?.rtm) {
            roomInfo.rtmToken = isWaitingRoomEnabled
              ? data.mainUser.rtm
              : data.joinChannel.mainUser.rtm;
          }
          if (data?.joinChannel?.secret || data?.secret) {
            roomInfo.encryptionSecret = isWaitingRoomEnabled
              ? data.secret
              : data.joinChannel.secret;
          }
          if (data?.joinChannel?.screenShare?.uid || data?.screenShare?.uid) {
            roomInfo.screenShareUid = isWaitingRoomEnabled
              ? data.screenShare.uid
              : data.joinChannel.screenShare.uid;
          }
          if (data?.joinChannel?.screenShare?.rtc || data?.screenShare?.rtc) {
            roomInfo.screenShareToken = isWaitingRoomEnabled
              ? data.screenShare.rtc
              : data.joinChannel.screenShare.rtc;
          }
          roomInfo.isHost = isWaitingRoomEnabled
            ? data.isHost
            : data.joinChannel.isHost;

          if (data?.joinChannel?.title || data?.title) {
            roomInfo.meetingTitle = isWaitingRoomEnabled
              ? data.title
              : data.joinChannel.title;
          }
          if (data?.joinChannel?.whiteboard || data?.whiteboard) {
            const whiteboard: RoomInfoContextInterface['data']['whiteboard'] = {
              room_token: isWaitingRoomEnabled
                ? data.whiteboard.room_token
                : data?.joinChannel?.whiteboard?.room_token,
              room_uuid: isWaitingRoomEnabled
                ? data.whiteboard.room_uuid
                : data?.joinChannel?.whiteboard?.room_uuid,
            };
            if (whiteboard?.room_token && whiteboard?.room_uuid) {
              roomInfo.whiteboard = whiteboard;
            }
          }
          //getUser is not available from backend
          // if (data?.getUser?.name) {
          //   roomInfo.username = data.getUser.name;
          // }
          setRoomInfo(prevState => {
            let compiledMeetingInfo = {
              ...prevState.data,
              ...roomInfo,
            };
            return {
              ...prevState,
              isJoinDataFetched: true,
              data: compiledMeetingInfo,
            };
          });
          return roomInfo;
        } else {
          throw new Error('An error occurred in parsing the channel data.');
        }
      }
    } catch (error) {
      throw error;
    }
  };
}
