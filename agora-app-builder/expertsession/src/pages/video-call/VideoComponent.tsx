import React, {useContext, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import useLayoutsData from './useLayoutsData';
import {isArray, useIsDesktop, isValidReactComponent} from '../../utils/common';
import {PropsContext, ClientRole} from '../../../agora-rn-uikit';
import {useLayout} from '../../utils/useLayout';
import {useContent} from 'customization-api';
import {getGridLayoutName} from './DefaultLayouts';
import {DispatchContext} from '../../../agora-rn-uikit';
import MeetingInfoGridTile from '../../components/meeting-info-invite/MeetingInfoGridTile';
import Spacer from '../../atoms/Spacer';
import {useLiveStreamDataContext} from '../../components/contexts/LiveStreamDataContext';

const VideoComponent = () => {
  const {dispatch} = useContext(DispatchContext);
  const [layout, setLayoutIndex] = useState(0);
  const layoutsData = useLayoutsData();
  const {currentLayout, setLayout} = useLayout();
  const {activeUids, pinnedUid} = useContent();
  const {rtcProps} = useContext(PropsContext);
  const isDesktop = useIsDesktop();
  const {audienceUids, hostUids} = useLiveStreamDataContext();
  const [showNoUserInfo, setShowNoUserInfo] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowNoUserInfo(true);
    }, 2500);
  }, []);

  const currentLayoutRef = useRef(currentLayout);
  const gridLayoutName = getGridLayoutName();
  useEffect(() => {
    if (activeUids && activeUids.length === 1) {
      if (pinnedUid) {
        dispatch({type: 'UserPin', value: [0]});
        dispatch({type: 'UserSecondaryPin', value: [0]});
      }
      if (currentLayoutRef.current != gridLayoutName) {
        setLayout(gridLayoutName);
      }
    }
  }, [activeUids]);

  useEffect(() => {
    currentLayoutRef.current = currentLayout;
    if (isArray(layoutsData)) {
      let index = layoutsData.findIndex(item => item.name === currentLayout);
      if (index >= 0) {
        setLayoutIndex(index);
      }
    }
  }, [currentLayout]);

  const showInviteTile = () => {
    if ($config.EVENT_MODE && rtcProps.role == ClientRole.Audience) {
      return false;
    }
    if (activeUids.length == 1) return true;
    return false;
  };

  if (
    layoutsData &&
    layoutsData[layout] &&
    isValidReactComponent(layoutsData[layout].component)
  ) {
    const CurrentLayout = layoutsData[layout].component;
    if (showInviteTile() && showNoUserInfo) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: isDesktop() ? 'row' : 'column',
            justifyContent: 'space-between',
          }}>
          <CurrentLayout renderData={activeUids} />
          {(!$config.EVENT_MODE && activeUids.length === 1) ||
          ($config.EVENT_MODE &&
            hostUids.concat(audienceUids)?.length === 1) ? (
            <>
              <Spacer size={8} horizontal={isDesktop() ? true : false} />
              <MeetingInfoGridTile />
            </>
          ) : (
            <></>
          )}
        </View>
      );
    }
    return <CurrentLayout renderData={activeUids} />;
  } else {
    return <></>;
  }
};
export default VideoComponent;
