import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';
import PrimaryButton from '../atoms/PrimaryButton';
import TertiaryButton from '../atoms/TertiaryButton';
import Spacer from '../atoms/Spacer';
import {Logo} from '../components/common';
import {useHistory} from '../components/Router';
import StorageContext from '../components/StorageContext';
import ThemeConfig from '../theme';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import CircularProgress from '../atoms/CircularProgress';
import {useIsDesktop} from '../utils/common';

/* For android only, bg audio */
const StopForegroundService = () => {
  if (Platform.OS === 'android') {
    ReactNativeForegroundService.stop();
    console.log('stopping foreground service');
  }
};

const Endcall = () => {
  const leftMeetingLabel = 'You have left the room.';
  const rejoinBtnLabel = 'REJOIN';
  const createMeetingLabel = 'START NEW ROOM';
  const returnToHomeLabel = 'Returning to the home screen';
  const {store} = useContext(StorageContext);
  const history = useHistory();

  const onComplete = React.useCallback(() => {
    history.push('/');
    StopForegroundService();
  }, []);

  const isDesktop = useIsDesktop();

  const reJoin = () => {
    StopForegroundService();
  };
  const goToCreate = () => {
    history.push('/');
    StopForegroundService();
  };
  return (
    <View style={styles.main}>
      <View
        style={[
          styles.contentContainer,
          isDesktop() && {alignItems: 'center'},
        ]}>
        <View style={{alignSelf: 'center'}}>
          <Logo />
        </View>
        <Spacer size={20} />
        <Text
          style={[
            styles.heading,
            !isDesktop() && {fontSize: 20, lineHeight: 25},
          ]}>
          {leftMeetingLabel}
        </Text>
        <Spacer size={40} />
        <View
          style={isDesktop() ? styles.btnContainer : styles.btnContainerMobile}>
          <TertiaryButton
            containerStyle={{
              height: 60,
              paddingHorizontal: 34,
              paddingVertical: 20,
              borderRadius: 8,
              minWidth: isDesktop() ? 'auto' : '100%',
              marginRight: isDesktop() ? 12 : 0,
            }}
            textStyle={styles.btnText}
            text={rejoinBtnLabel}
            onPress={() => {
              reJoin();
            }}
          />

          <PrimaryButton
            containerStyle={{
              height: 60,
              minWidth: isDesktop() ? 'auto' : '100%',
              marginBottom: isDesktop() ? 0 : 20,
              paddingHorizontal: 30,
              paddingVertical: 20,
            }}
            text={createMeetingLabel}
            textStyle={styles.btnText}
            onPress={() => {
              goToCreate();
            }}
          />
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <CircularProgress onComplete={onComplete} timer={60} />
        <Spacer size={10} />
        <Text style={styles.returnHomeText}>{returnToHomeLabel}</Text>
      </View>
    </View>
  );
};

export default Endcall;

const styles = StyleSheet.create({
  returnHomeText: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.small,
    lineHeight: 18,
    color: $config.FONT_COLOR,
    textAlign: 'center',
  },
  bottomContainer: {
    marginBottom: 28,
  },
  main: {
    flex: 1,
    paddingHorizontal: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnText: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
  },
  btnContainerMobile: {
    flexDirection: 'column-reverse',
  },
  heading: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    fontSize: 40,
    lineHeight: 40,
    color: $config.FONT_COLOR,
    alignSelf: 'center',
  },
});
