import {StyleSheet, View} from 'react-native';
import React from 'react';

import {SidePanelType} from '../../subComponents/SidePanelEnum';

import {
  ChatHeader,
  PeopleHeader,
  SettingsHeader,
  TranscriptHeader,
} from './SidePanelHeader';

const ActionSheetHandle = (props: {sidePanel: SidePanelType}) => {
  const Header = null;

  const {sidePanel} = props;

  return (
    <View style={styles.container}>
      <View style={styles.handleIndicatorStyle} />

      {sidePanel === SidePanelType.Participants && <PeopleHeader />}
      {sidePanel === SidePanelType.Chat && <ChatHeader />}
      {sidePanel === SidePanelType.Settings && <SettingsHeader />}
      {sidePanel === SidePanelType.Transcript && <TranscriptHeader />}
    </View>
  );
};

export default ActionSheetHandle;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
  },
  handleIndicatorStyle: {
    backgroundColor: $config.SEMANTIC_NEUTRAL,
    width: 40,
    height: 4,
    alignSelf: 'center',
    borderRadius: 4,
    marginTop: 12,
  },
});
