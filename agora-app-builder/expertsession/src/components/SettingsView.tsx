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
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import SelectDevice from '../subComponents/SelectDevice';
import LanguageSelector from '../subComponents/LanguageSelector';
import {
  isMobileUA,
  isWebInternal,
  maxInputLimit,
  useIsSmall,
} from '../utils/common';
import {useSidePanel} from '../utils/useSidePanel';
import {SidePanelType} from '../subComponents/SidePanelEnum';
import ThemeConfig from '../theme';
import SidePanelHeader, {
  SidePanelStyles,
} from '../subComponents/SidePanelHeader';
import useGetName from '../utils/useGetName';
import useSetName from '../utils/useSetName';
import ImageIcon from '../atoms/ImageIcon';
import Spacer from '../atoms/Spacer';
import CommonStyles from './CommonStyles';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import {useLayout} from '../utils/useLayout';
import {getGridLayoutName} from '../pages/video-call/DefaultLayouts';
import {useFocus} from '../utils/useFocus';
import {SettingsHeader} from '../pages/video-call/SidePanelHeader';
import {useUserPreference} from './useUserPreference';
import useCaptionWidth from '../../src/subComponents/caption/useCaptionWidth';
import {whiteboardContext} from './whiteboard/WhiteboardConfigure';
import InlineNotification from '../../src/atoms/InlineNotification';
import {useRoomInfo} from './room-info/useRoomInfo';
import {useString} from '../../src/utils/useString';
import {
  settingPanelNameCantbeChangedInfo,
  settingPanelNameInputLabel,
} from '../../src/language/default-labels/videoCallScreenLabels';

interface EditNameProps {}
const EditName: React.FC = (props?: EditNameProps) => {
  const yournameLabel = useString(settingPanelNameInputLabel)();
  const nameCantbeChangedInfo = useString(settingPanelNameCantbeChangedInfo)();
  const {
    data: {isHost},
  } = useRoomInfo();
  const {saveName} = useUserPreference();
  const {whiteboardActive} = useContext(whiteboardContext);
  const [saved, setSaved] = useState(false);
  const username = useGetName();
  const [newName, setNewName] = useState(username);
  const [editable, setEditable] = useState(true);
  const [disabled, setDisabled] = useState(
    !newName ||
      newName.length === 0 ||
      newName.trim() == '' ||
      newName === username,
  );
  const setUsername = useSetName();

  useEffect(() => {
    setDisabled(
      !newName ||
        newName.length === 0 ||
        newName.trim() == '' ||
        newName === username,
    );
  }, [newName]);

  const inputRef = useRef(null);
  const onPress = () => {
    //true -> prev editable variable
    if (true) {
      const trimmedText = newName?.trim();
      if (trimmedText) {
        setUsername(trimmedText);
        setNewName(trimmedText);
      } else {
        setNewName(username);
      }
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 2000);
      setEditable(false);
      saveName(trimmedText ? trimmedText : username);
    } else {
      setEditable(true);
      inputRef.current.focus();
    }
  };

  const {currentFocus, setFocus} = useFocus();

  useEffect(() => {
    if (currentFocus.editName) {
      setEditable(true);
      setTimeout(() => {
        inputRef.current.focus();
        setFocus(prevState => {
          return {
            ...prevState,
            editName: false,
          };
        });
      }, 500);
    }
  }, [currentFocus?.editName]);

  return (
    <>
      <Text style={editNameStyle.yournameText}>{yournameLabel}</Text>
      <Spacer size={12} />
      {whiteboardActive && isHost ? (
        <>
          <InlineNotification
            text={nameCantbeChangedInfo}
            customStyle={{
              alignItems: 'center',
              backgroundColor: 'rgba(255, 171, 0, 0.15)',
            }}
            warning={true}
          />
          <Spacer size={12} />
        </>
      ) : (
        <></>
      )}
      <View style={editNameStyle.container}>
        <View style={editNameStyle.nameContainer}>
          <ImageIcon
            name="person"
            iconSize={20}
            iconType="plain"
            tintColor={$config.SEMANTIC_NEUTRAL}
          />
          <TextInput
            maxLength={maxInputLimit}
            ref={inputRef}
            style={[
              editNameStyle.inputStyle,
              //true -> previously editable variable
              //!true
              whiteboardActive && isHost
                ? {
                    color:
                      $config.FONT_COLOR + ThemeConfig.EmphasisPlus.disabled,
                  }
                : {},
            ]}
            onBlur={onPress}
            placeholder={username}
            value={newName}
            editable={whiteboardActive && isHost ? false : true}
            onChangeText={text => setNewName(text)}
            onSubmitEditing={onPress}
            placeholderTextColor={
              $config.FONT_COLOR + ThemeConfig.EmphasisPlus.disabled
            }
          />
        </View>
        {/* <PlatformWrapper>
          <TouchableOpacity
            disabled={saved ? true : editable ? disabled : false}
            style={[
              editNameStyle.editBtn,
              editable
                ? disabled
                  ? {opacity: ThemeConfig.EmphasisOpacity.disabled}
                  : {}
                : {},
            ]}
            onPress={onPress}>
            <Text style={editNameStyle.editBtnText}>
              {saved ? 'Saved' : editable ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </PlatformWrapper> */}
      </View>
    </>
  );
};

const PlatformWrapper = ({children}) => {
  const [isHovered, setIsHovered] = useState(false);
  return isWebInternal() ? (
    <div
      style={
        isHovered
          ? {
              background:
                $config.CARD_LAYER_5_COLOR + hexadecimalTransparency['15%'],
            }
          : {}
      }
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}>
      {children}
    </div>
  ) : (
    children
  );
};

const editNameStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: $config.INPUT_FIELD_BORDER_COLOR,
    backgroundColor: $config.INPUT_FIELD_BACKGROUND_COLOR,
    borderRadius: 8,
    paddingLeft: 20,
    overflow: 'hidden',
  },
  editBtn: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderLeftWidth: 1,
    borderLeftColor: $config.INPUT_FIELD_BORDER_COLOR,
  },
  nameContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  inputStyle: {
    color: $config.FONT_COLOR,
    fontWeight: '600',
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontSize: ThemeConfig.FontSize.medium,
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 18,
    borderWidth: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  editBtnText: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontSize: ThemeConfig.FontSize.normal,
    fontWeight: '600',
    color: $config.SECONDARY_ACTION_COLOR,
  },
  yournameText: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.small,
    color: $config.FONT_COLOR,
  },
});
const SettingsView = props => {
  const {hideName = false, showHeader = true} = props;
  const isSmall = useIsSmall();
  const {currentLayout} = useLayout();
  const {transcriptHeight} = useCaptionWidth();

  return (
    <View
      style={[
        isMobileUA()
          ? //mobile and mobile web
            CommonStyles.sidePanelContainerNative
          : isSmall()
          ? // desktop minimized
            CommonStyles.sidePanelContainerWebMinimzed
          : // desktop maximized
            CommonStyles.sidePanelContainerWeb,
        isWebInternal() && !isSmall() && currentLayout === getGridLayoutName()
          ? {marginVertical: 4}
          : {},
        //@ts-ignore
        transcriptHeight && !isMobileUA() && {height: transcriptHeight},
      ]}>
      {showHeader && <SettingsHeader {...props} />}
      <ScrollView style={style.contentContainer}>
        {hideName ? <></> : <EditName />}
        {isWebInternal() && <SelectDevice isIconDropdown />}
        <LanguageSelector />
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  contentContainer: {
    padding: 20,
  },
});

export default SettingsView;
