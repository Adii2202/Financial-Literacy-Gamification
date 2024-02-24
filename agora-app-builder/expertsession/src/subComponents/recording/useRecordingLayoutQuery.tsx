import React from 'react';
import {useParams} from '../../components/Router';

import {gql, useMutation} from '@apollo/client';
import {UidType} from '../../../agora-rn-uikit';

const SET_PRESENTER = gql`
  mutation setPresenter($uid: Int!, $passphrase: String!) {
    setPresenter(uid: $uid, passphrase: $passphrase)
  }
`;

const SET_NORMAL = gql`
  mutation setNormal($passphrase: String!) {
    setNormal(passphrase: $passphrase)
  }
`;

function useRecordingLayoutQuery() {
  const [setPresenterQuery] = useMutation(SET_PRESENTER);
  const [setNormalQuery] = useMutation(SET_NORMAL);
  const {phrase} = useParams<any>();
  /**
   * @param screenShareUid
   * Default : Grid
   * Below query changes the layout to vertical and passed UID is maxed view
   * This should be called only when screenshare is actively going on
   * and we want that as the main view
   * https://docs.agora.io/en/cloud-recording/cloud_recording_layout?platform=RESTful
   */
  const executePresenterQuery = (screenShareUid: UidType) => {
    setPresenterQuery({
      variables: {
        uid: screenShareUid,
        passphrase: phrase,
      },
    })
      .then((res) => {
        if (res.data.setPresenter === 'success') {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const executeNormalQuery = () => {
    setNormalQuery({variables: {passphrase: phrase}})
      .then((res) => {
        if (res.data.stopRecordingSession === 'success') {
          // Once the backend sucessfuly stops recording,
          // send a control message to everbody in the channel indicating that cloud recording is now inactive.
          // sendControlMessage(controlMessageEnum.cloudRecordingUnactive);
          // set the local recording state to false to update the UI
          // setScreenshareActive(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return {
    executeNormalQuery,
    executePresenterQuery,
  };
}

export default useRecordingLayoutQuery;
