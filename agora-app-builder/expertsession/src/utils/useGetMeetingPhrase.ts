import {useContext} from 'react';
import {gql} from '@apollo/client';
import {RoomInfoContextInterface} from '../components/room-info/useRoomInfo';
import {useSetRoomInfo} from '../components/room-info/useSetRoomInfo';
import {GraphQLContext} from '../components/GraphQLProvider';

const SHARE = gql`
  query share($passphrase: String!) {
    share(passphrase: $passphrase) {
      passphrase {
        host
        view
      }
      channel
      title
      pstn {
        number
        dtmf
      }
    }
  }
`;

export default function useGetMeetingPhrase() {
  const {setRoomInfo} = useSetRoomInfo();
  const {client} = useContext(GraphQLContext);
  return async (phrase: string) => {
    const response = await client.query({
      query: SHARE,
      variables: {
        passphrase: phrase,
      },
    });
    if (response.error) {
      throw response.error;
    } else {
      try {
        if (response && response.data) {
          let data = response.data;
          let roomInfo: Partial<RoomInfoContextInterface['data']> = {
            roomId: {attendee: ''},
          };
          if (data?.share?.passphrase?.view) {
            roomInfo.roomId.attendee = data.share.passphrase.view;
          }
          if (data?.share?.passphrase?.host) {
            roomInfo.roomId.host = data.share.passphrase.host;
          }
          if (data?.share?.pstn) {
            roomInfo.pstn = {
              number: data.share.pstn.number,
              pin: data.share.pstn.dtmf,
            };
          }
          setRoomInfo((prevState) => {
            return {
              ...prevState,
              data: {
                ...prevState.data,
                roomId: roomInfo.roomId,
                pstn: roomInfo?.pstn,
              },
            };
          });
        }
      } catch (error) {
        throw new Error('An error occurred in parsing the channel data.');
      }
    }
  };
}
