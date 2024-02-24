import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import React, {useRef, useCallback, useLayoutEffect, useEffect} from 'react';
import {BottomSheet, BottomSheetRef} from 'react-spring-bottom-sheet';
import './ActionSheetStyles.css';
import ActionSheetContent from './ActionSheetContent';
import {SpringEvent} from 'react-spring-bottom-sheet/dist/types';
import Chat from '../../components/Chat';
import ParticipantView from '../../components/ParticipantsView';
import SettingsView from '../../components/SettingsView';

import {SidePanelType} from '../../subComponents/SidePanelEnum';
import {useSidePanel} from '../../utils/useSidePanel';
import ToastComponent from '../../components/ToastComponent';
import {isMobileUA} from '../../utils/common';
import {useToast} from '../../components/useToast';
import ActionSheetHandle from './ActionSheetHandle';
import Spacer from '../../atoms/Spacer';
import Transcript from '../../subComponents/caption/Transcript';
import {ToolbarProvider} from '../../utils/useToolbar';
import {ActionSheetProvider} from '../../utils/useActionSheet';

const ActionSheet = props => {
  const {snapPointsMinMax = [100, 400]} = props;
  const {setActionSheetVisible} = useToast();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = React.useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = React.useState(false);
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const chatSheetRef = useRef<BottomSheetRef>(null);
  const participantsSheetRef = useRef<BottomSheetRef>(null);
  const settingsSheetRef = useRef<BottomSheetRef>(null);
  const transcriptSheetRef = useRef<BottomSheetRef>(null);
  const ToastComponentRender =
    isMobileUA() &&
    (isChatOpen || isSettingsOpen || isParticipantsOpen || isTranscriptOpen) ? (
      <ToastComponent />
    ) : (
      <></>
    );
  const {sidePanel, setSidePanel} = useSidePanel();
  const [showOverlay, setShowOverlay] = React.useState(false);
  const handleSheetChanges = useCallback((index: number) => {
    bottomSheetRef.current?.snapTo(({snapPoints}) => snapPoints[index]);
    index === 0 ? setIsExpanded(false) : setIsExpanded(true);
  }, []);

  const root = document.documentElement;

  useEffect(() => {
    root.style.setProperty('--sheet-background', $config.CARD_LAYER_1_COLOR);
    root.style.setProperty('--handle-background', $config.SEMANTIC_NEUTRAL);
  }, []);

  useEffect(() => {
    if (
      isChatOpen ||
      isSettingsOpen ||
      isParticipantsOpen ||
      isTranscriptOpen
    ) {
      setActionSheetVisible(true);
    } else {
      setActionSheetVisible(false);
    }
  }, [isChatOpen, isSettingsOpen, isParticipantsOpen, isTranscriptOpen]);

  // updating on sidepanel changes
  useEffect(() => {
    switch (sidePanel) {
      case SidePanelType.Participants: {
        setIsParticipantsOpen(true);
        break;
      }
      case SidePanelType.Chat: {
        setIsChatOpen(true);
        break;
      }
      case SidePanelType.Settings: {
        setIsSettingsOpen(true);
        break;
      }
      case SidePanelType.Transcript: {
        setIsTranscriptOpen(true);
        break;
      }
      case SidePanelType.None: {
        setIsChatOpen(false);
        setIsParticipantsOpen(false);
        setIsSettingsOpen(false);
        setIsTranscriptOpen(false);
        handleSheetChanges(0);
      }
      default:
    }
  }, [sidePanel]);

  function onDismiss() {
    setSidePanel(SidePanelType.None);
  }

  const handleSpringStart = (event: SpringEvent) => {
    if (event.type == 'SNAP') {
      setShowOverlay(true); // as soon drag start show overlay
    }
  };
  const handleSpringEnd = (event: SpringEvent) => {
    if (event.type == 'SNAP') {
      const isMinmized = bottomSheetRef.current.height === 100;
      isMinmized && setShowOverlay(false);
      if (event.source === 'dragging') {
        if (isMinmized) {
          setIsExpanded(false);
        } else {
          setIsExpanded(true);
        }
      }
    }
  };

  const updateActionSheet = (
    screenName: 'chat' | 'participants' | 'settings',
  ) => {
    switch (screenName) {
      case 'chat':
        setIsChatOpen(true);
        break;
      case 'participants':
        setIsParticipantsOpen(true);
        break;
      case 'settings':
        console.warn('settings selected');
        setIsSettingsOpen(true);
        break;
      default:
    }
  };
  return (
    <>
      {showOverlay && (
        <TouchableWithoutFeedback
          onPress={() => {
            handleSheetChanges(0);
          }}>
          <View style={[styles.backDrop]} />
        </TouchableWithoutFeedback>
      )}
      <View>
        {/* Controls Action Sheet */}

        <BottomSheet
          scrollLocking={false}
          ref={bottomSheetRef}
          open={true}
          onSpringStart={handleSpringStart}
          onSpringEnd={handleSpringEnd}
          // skipInitialTransition={true}
          expandOnContentDrag={true}
          snapPoints={({maxHeight}) => snapPointsMinMax}
          defaultSnap={({lastSnap, snapPoints}) =>
            lastSnap ?? Math.min(...snapPoints)
          }
          header={
            <>
              <ActionSheetHandle sidePanel={SidePanelType.None} />
              <Spacer size={12} />
            </>
          }
          blocking={false}>
          <ActionSheetContent
            handleSheetChanges={handleSheetChanges}
            isExpanded={isExpanded}
            native={false}
            {...props}
          />
        </BottomSheet>
        {/* Chat  Action Sheet */}
        <BottomSheet
          sibling={ToastComponentRender}
          ref={chatSheetRef}
          onDismiss={onDismiss}
          scrollLocking={false}
          open={isChatOpen}
          blocking={false}
          expandOnContentDrag={false}
          snapPoints={({maxHeight}) => [1 * maxHeight]}
          header={<ActionSheetHandle sidePanel={SidePanelType.Chat} />}
          defaultSnap={({lastSnap, snapPoints}) => snapPoints[0]}>
          <Chat showHeader={false} />
        </BottomSheet>
        {/* Participants Action Sheet */}
        {/** Toolbar and actionsheet wrapper added to hide the local mute button label*/}
        <ToolbarProvider value={{position: undefined}}>
          <ActionSheetProvider>
            <BottomSheet
              sibling={ToastComponentRender}
              ref={participantsSheetRef}
              onDismiss={onDismiss}
              open={isParticipantsOpen}
              expandOnContentDrag={false}
              snapPoints={({maxHeight}) => [1 * maxHeight]}
              defaultSnap={({lastSnap, snapPoints}) => snapPoints[0]}
              scrollLocking={false}
              header={
                <ActionSheetHandle sidePanel={SidePanelType.Participants} />
              }
              blocking={false}>
              <ParticipantView showHeader={false} />
            </BottomSheet>
          </ActionSheetProvider>
        </ToolbarProvider>
        {/* Settings  Action Sheet */}
        <BottomSheet
          sibling={ToastComponentRender}
          ref={settingsSheetRef}
          onDismiss={onDismiss}
          open={isSettingsOpen}
          expandOnContentDrag={false}
          snapPoints={({maxHeight}) => [1 * maxHeight]}
          defaultSnap={({lastSnap, snapPoints}) => snapPoints[0]}
          header={<ActionSheetHandle sidePanel={SidePanelType.Settings} />}
          blocking={false}>
          <SettingsView showHeader={false} />
        </BottomSheet>
        {/* Transcript  Action Sheet */}
        <BottomSheet
          sibling={ToastComponentRender}
          ref={transcriptSheetRef}
          onDismiss={onDismiss}
          open={isTranscriptOpen}
          expandOnContentDrag={false}
          snapPoints={({maxHeight}) => [1 * maxHeight]}
          defaultSnap={({lastSnap, snapPoints}) => snapPoints[0]}
          header={<ActionSheetHandle sidePanel={SidePanelType.Transcript} />}
          scrollLocking={false}
          blocking={false}>
          <Transcript showHeader={false} />
        </BottomSheet>
      </View>
    </>
  );
};

export default ActionSheet;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'red',
  },
  content: {
    borderWidth: 1,
    borderColor: 'yellow',
    flex: 1,
  },
  backDrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: $config.CARD_LAYER_1_COLOR,
    opacity: 0.5,
  },
});
