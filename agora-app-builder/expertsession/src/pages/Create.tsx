/*
********************************************
 Copyright © 2021 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/
import React, {useEffect, useState, useContext} from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import {useHistory} from '../components/Router';
import PrimaryButton from '../atoms/PrimaryButton';
import Toast from '../../react-native-toast-message';
import {ErrorContext} from '../components/common';
import ShareLink from '../components/Share';
import Logo from '../components/common/Logo';
import {
  isWebInternal,
  maxInputLimit,
  isMobileUA,
  trimText,
} from '../utils/common';
import {useCustomization} from 'customization-implementation';
import {useString} from '../utils/useString';
import useCreateRoom from '../utils/useCreateRoom';
import {CreateProvider} from './create/useCreate';
import useJoinRoom from '../utils/useJoinRoom';
import {RoomInfoDefaultValue} from '../components/room-info/useRoomInfo';
import Input from '../atoms/Input';
import Toggle from '../atoms/Toggle';
import Card from '../atoms/Card';
import Spacer from '../atoms/Spacer';
import LinkButton from '../atoms/LinkButton';
import StorageContext from '../components/StorageContext';
import ThemeConfig from '../theme';
import Tooltip from '../atoms/Tooltip';
import ImageIcon from '../atoms/ImageIcon';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import {randomNameGenerator} from '../utils';
import {useSetRoomInfo} from '../components/room-info/useSetRoomInfo';
import IDPLogoutComponent from '../auth/IDPLogoutComponent';
import isSDK from '../utils/isSDK';
import {
  createRoomAllowPhoneNumberJoining,
  createRoomAllowPhoneNumberJoiningTooltipText,
  createRoomBtnText,
  createRoomErrorToastHeading,
  createRoomErrorToastSubHeading,
  createRoomHeading,
  createRoomInputLabel,
  createRoomInputPlaceholderText,
  createRoomJoinWithID,
  createRoomMakeEveryOneCoHost,
  createRoomMakeEveryOneCoHostTooltipText,
  createRoomSuccessToastHeading,
  createRoomSuccessToastSubHeading,
} from '../language/default-labels/createScreenLabels';

const Create = () => {
  const {CreateComponent} = useCustomization(data => {
    let components: {
      CreateComponent?: React.ElementType;
    } = {};
    // commented for v1 release
    // if (
    //   data?.components?.create &&
    //   typeof data?.components?.create !== 'object'
    // ) {
    //   if (
    //     data?.components?.create &&
    //     isValidReactComponent(data?.components?.create)
    //   )
    //     components.CreateComponent = data?.components?.create;
    // }
    return components;
  });

  const useJoin = useJoinRoom();
  const {setStore} = useContext(StorageContext);
  const {setGlobalErrorMessage} = useContext(ErrorContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [roomTitle, onChangeRoomTitle] = useState('');
  // const [randomRoomTitle, setRandomRoomTitle] = useState('');
  const [pstnToggle, setPstnToggle] = useState(false);
  const [coHostToggle, setCoHostToggle] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const createRoomFun = useCreateRoom();
  const {setRoomInfo} = useSetRoomInfo();

  const loadingText = useString('loadingText')();

  //heading
  const headingText = useString<any>(createRoomHeading)({
    audioRoom: $config.AUDIO_ROOM,
    eventMode: $config.EVENT_MODE,
  });
  //heading

  //input label
  const inputLabel = useString<any>(createRoomInputLabel)({
    audioRoom: $config.AUDIO_ROOM,
    eventMode: $config.EVENT_MODE,
  });
  //input label

  //placeholder
  const placeHolderText = useString(createRoomInputPlaceholderText)();
  //placeholder

  //toggle
  const everyoneCoHost = useString(createRoomMakeEveryOneCoHost)();
  const everyoneCoHostTooltip = useString(
    createRoomMakeEveryOneCoHostTooltipText,
  )();
  const allowPhoneNumberJoining = useString(
    createRoomAllowPhoneNumberJoining,
  )();
  const allowPhoneNumberJoiningToolTip = useString(
    createRoomAllowPhoneNumberJoiningTooltipText,
  )();
  //toggle

  //create button
  const createBtnText = useString<any>(createRoomBtnText)({
    audioRoom: $config.AUDIO_ROOM,
    eventMode: $config.EVENT_MODE,
  });
  //create button

  const joinWithRoomID = useString(createRoomJoinWithID)();

  //toast
  const createRoomSuccessToastHeadingText = useString(
    createRoomSuccessToastHeading,
  );
  const createRoomSuccessToastSubHeadingText = useString(
    createRoomSuccessToastSubHeading,
  )();
  //toast

  const createRoomErrorToastHeadingText = useString(
    createRoomErrorToastHeading,
  )();
  const createRoomErrorToastSubHeadingText = useString(
    createRoomErrorToastSubHeading,
  )();

  const isDesktop = !isMobileUA();
  useEffect(() => {
    //Generating the random room title for placeholder
    // setRandomRoomTitle(
    //   `${randomNameGenerator(3)}-${randomNameGenerator(
    //     3,
    //   )}-${randomNameGenerator(3)}`,
    // );

    if (isWebInternal() && !isSDK) {
      document.title = $config.APP_NAME;
    }
    console.log('[SDKEvents] Join listener registered');
    return () => {};
  }, []);

  const showShareScreen = () => {
    setRoomCreated(true);
  };

  const createRoomAndNavigateToShare = async (
    roomTitle: string,
    enablePSTN: boolean,
    isSeparateHostLink: boolean,
  ) => {
    if (roomTitle !== '') {
      setLoading(true);
      try {
        setRoomInfo(RoomInfoDefaultValue);
        //@ts-ignore
        //isSeparateHostLink will be for internal usage since backend integration is not there
        await createRoomFun(roomTitle, enablePSTN, isSeparateHostLink);
        setLoading(false);
        Toast.show({
          leadingIconName: 'tick-fill',
          type: 'success',
          text1: createRoomSuccessToastHeadingText(trimText(roomTitle)),
          text2: createRoomSuccessToastSubHeadingText,
          visibilityTime: 3000,
          primaryBtn: null,
          secondaryBtn: null,
          leadingIcon: null,
        });
        showShareScreen();
      } catch (error) {
        setLoading(false);
        if (
          createRoomErrorToastHeadingText ||
          createRoomErrorToastSubHeadingText
        ) {
          setGlobalErrorMessage({
            name: createRoomErrorToastHeadingText,
            message: createRoomErrorToastSubHeadingText,
          });
        } else {
          setGlobalErrorMessage(error);
        }
      }
    }
  };

  const renderInfoIcon = (isToolTipVisible, setToolTipVisible) => {
    return (
      <Pressable onPress={() => setToolTipVisible(true)}>
        <ImageIcon
          iconType="plain"
          name="info"
          iconSize={20}
          tintColor={
            isToolTipVisible
              ? $config.SECONDARY_ACTION_COLOR
              : $config.SEMANTIC_NEUTRAL
          }
        />
      </Pressable>
    );
  };

  const showError = () => {
    Toast.show({
      leadingIconName: 'alert',
      type: 'error',
      text1: 'Backend endpoint not configured',
      text2: 'Please configure backend endpoint config.json',
      visibilityTime: 1000 * 10,
      primaryBtn: null,
      secondaryBtn: null,
      leadingIcon: null,
    });
  };

  return (
    <CreateProvider
      value={{
        showShareScreen,
      }}>
      {!roomCreated ? (
        CreateComponent ? (
          <CreateComponent />
        ) : (
          <View style={style.root}>
            {!isMobileUA() ? (
              <IDPLogoutComponent containerStyle={{marginBottom: -100}} />
            ) : (
              <></>
            )}
            <ScrollView contentContainerStyle={style.main}>
              <Card>
                <View>
                  <View style={style.logoContainerStyle}>
                    <Logo />
                    {isMobileUA() ? (
                      <IDPLogoutComponent
                        containerStyle={{marginTop: 0, marginRight: 0}}
                      />
                    ) : (
                      <></>
                    )}
                  </View>
                  <Spacer size={isDesktop ? 20 : 16} />
                  <Text style={style.heading}>{headingText}</Text>
                  <Spacer size={40} />
                  <Input
                    maxLength={maxInputLimit}
                    labelStyle={style.inputLabelStyle}
                    label={inputLabel}
                    value={roomTitle}
                    placeholder={placeHolderText}
                    onChangeText={text => onChangeRoomTitle(text)}
                    onSubmitEditing={() => {
                      if (!roomTitle?.trim()) {
                        return;
                      } else {
                        if (!$config.BACKEND_ENDPOINT) {
                          showError();
                        } else {
                          // !roomTitle?.trim() &&
                          //   onChangeRoomTitle(randomRoomTitle);
                          createRoomAndNavigateToShare(
                            roomTitle?.trim(),
                            pstnToggle,
                            !coHostToggle,
                          );
                        }
                      }
                    }}
                  />
                  <Spacer size={40} />
                  {$config.EVENT_MODE ? (
                    <></>
                  ) : (
                    <View
                      style={[
                        style.toggleContainer,
                        style.upper,
                        !$config.PSTN ? style.lower : {},
                      ]}>
                      <View style={style.infoContainer}>
                        <Text numberOfLines={1} style={style.toggleLabel}>
                          {everyoneCoHost}
                        </Text>
                        <Tooltip
                          activeBgStyle={style.tooltipActiveBgStyle}
                          defaultBgStyle={style.tooltipDefaultBgStyle}
                          toolTipMessage={everyoneCoHostTooltip}
                          renderContent={(
                            isToolTipVisible,
                            setToolTipVisible,
                          ) =>
                            renderInfoIcon(isToolTipVisible, setToolTipVisible)
                          }
                        />
                      </View>
                      <View style={style.infoToggleContainer}>
                        <Toggle
                          disabled={$config.EVENT_MODE}
                          isEnabled={coHostToggle}
                          toggleSwitch={setCoHostToggle}
                        />
                      </View>
                    </View>
                  )}
                  {$config.PSTN ? (
                    <>
                      <View style={style.separator} />
                      <View
                        style={[
                          style.toggleContainer,
                          style.lower,
                          $config.EVENT_MODE ? style.upper : {},
                        ]}>
                        <View style={style.infoContainer}>
                          <Text numberOfLines={1} style={style.toggleLabel}>
                            {allowPhoneNumberJoining}
                          </Text>
                          <Tooltip
                            activeBgStyle={style.tooltipActiveBgStyle}
                            defaultBgStyle={style.tooltipDefaultBgStyle}
                            toolTipMessage={allowPhoneNumberJoiningToolTip}
                            renderContent={(
                              isToolTipVisible,
                              setToolTipVisible,
                            ) =>
                              renderInfoIcon(
                                isToolTipVisible,
                                setToolTipVisible,
                              )
                            }
                          />
                        </View>
                        <View style={style.infoToggleContainer}>
                          <Toggle
                            isEnabled={pstnToggle}
                            toggleSwitch={setPstnToggle}
                          />
                        </View>
                      </View>
                    </>
                  ) : (
                    <></>
                  )}
                  <Spacer size={isDesktop ? 60 : 125} />
                </View>
                <View style={[style.btnContainer]}>
                  <PrimaryButton
                    iconName={'video-plus'}
                    disabled={loading || !roomTitle?.trim()}
                    containerStyle={!isDesktop && {width: '100%'}}
                    onPress={() => {
                      if (!$config.BACKEND_ENDPOINT) {
                        showError();
                      } else {
                        // !roomTitle?.trim() &&
                        //   onChangeRoomTitle(randomRoomTitle);
                        createRoomAndNavigateToShare(
                          roomTitle?.trim(),
                          pstnToggle,
                          !coHostToggle,
                        );
                      }
                    }}
                    text={loading ? loadingText : createBtnText}
                  />
                  <Spacer size={16} />
                  <LinkButton
                    text={joinWithRoomID}
                    onPress={() => history.push('/join')}
                  />
                </View>
              </Card>
            </ScrollView>
          </View>
        )
      ) : (
        <></>
      )}
      {roomCreated ? <ShareLink /> : <></>}
    </CreateProvider>
  );
};

const style = StyleSheet.create({
  logoContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  root: {
    flex: 1,
  },
  inputLabelStyle: {
    paddingLeft: 8,
  },
  main: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  heading: {
    fontSize: ThemeConfig.FontSize.extraLarge,
    fontWeight: '700',
    lineHeight: ThemeConfig.FontSize.extraLarge,
    color: $config.FONT_COLOR,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    opacity: ThemeConfig.EmphasisOpacity.high,
  },
  headline: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    color: $config.FONT_COLOR,
    marginBottom: 40,
  },
  btnContainer: {
    width: '100%',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: $config.CARD_LAYER_2_COLOR,
    paddingVertical: 22,
    paddingHorizontal: 20,
  },
  upper: {
    borderTopLeftRadius: ThemeConfig.BorderRadius.medium,
    borderTopRightRadius: ThemeConfig.BorderRadius.medium,
  },
  lower: {
    borderBottomLeftRadius: ThemeConfig.BorderRadius.medium,
    borderBottomRightRadius: ThemeConfig.BorderRadius.medium,
  },
  toggleLabel: {
    color: $config.FONT_COLOR,
    fontSize: ThemeConfig.FontSize.normal,
    marginRight: 4,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    alignSelf: 'center',
  },
  separator: {
    height: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    flex: 0.8,
  },
  infoToggleContainer: {
    flex: 0.2,
    alignItems: 'flex-end',
    alignSelf: 'center',
  },
  tooltipActiveBgStyle: {
    backgroundColor:
      $config.CARD_LAYER_5_COLOR + hexadecimalTransparency['20%'],
    borderRadius: 14,
    padding: 5,
  },
  tooltipDefaultBgStyle: {
    padding: 5,
  },
});

export default Create;
