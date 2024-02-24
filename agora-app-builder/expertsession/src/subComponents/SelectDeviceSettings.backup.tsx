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
import React, {useContext, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {PropsContext, ClientRole} from '../../agora-rn-uikit';
import DeviceContext from '../components/DeviceContext';
import ColorContext from '../components/ColorContext';
import {useString} from '../utils/useString';
import Spacer from '../atoms/Spacer';
import Dropdown from '../atoms/Dropdown';
import {usePreCall} from '../components/precall/usePreCall';
import ThemeConfig from '../theme';
// import {dropdown} from '../../theme.json';
/**
 * A component to diplay a dropdown and select a device.
 * It will add the selected device to the device context.
 */
const useSelectDevice = (): [boolean, string] => {
  const {rtcProps} = useContext(PropsContext);
  const {primaryColor} = useContext(ColorContext);
  const [btnTheme, setBtnTheme] = React.useState<string>(primaryColor);
  const [isPickerDisabled, setPickerDisabled] = React.useState<boolean>(false);
  React.useEffect(() => {
    if ($config.EVENT_MODE && rtcProps.role === ClientRole.Audience) {
      setPickerDisabled(true);
      setBtnTheme('rgba(16, 16, 16, 0.3)');
    } else {
      setPickerDisabled(false);
      setBtnTheme(primaryColor);
    }
  }, [rtcProps?.role]);
  return [isPickerDisabled, btnTheme];
};

interface SelectVideoDeviceProps {
  render?: (
    selectedCam: string,
    setSelectedCam: (cam: string) => void,
    deviceList: MediaDeviceInfo[],
    isDisabled: boolean,
  ) => JSX.Element;
}

const SelectVideoDevice = (props: SelectVideoDeviceProps) => {
  const {selectedCam, setSelectedCam, deviceList} = useContext(DeviceContext);
  const [isPickerDisabled, btnTheme] = useSelectDevice();
  const [isFocussed, setIsFocussed] = React.useState(false);
  const data = deviceList
    .filter((device: any) => {
      if (device.kind === 'videoinput') {
        return true;
      }
    })
    ?.map((device) => {
      return {
        label: device.label,
        value: device.deviceId,
      };
    });

  return props?.render ? (
    props.render(selectedCam, setSelectedCam, deviceList, isPickerDisabled)
  ) : (
    <>
      <Text style={[style.label]}>Camera</Text>
      <Dropdown
        icon={'video-on'}
        enabled={!isPickerDisabled}
        label={!data || !data.length ? 'No Camera Detected' : ''}
        data={data}
        onSelect={({label, value}) => {
          setIsFocussed(true);
          setSelectedCam(value);
        }}
        selectedValue={selectedCam}
      />
    </>
  );
};

interface SelectAudioDeviceProps {
  render?: (
    selectedMic: string,
    setSelectedMic: (mic: string) => void,
    deviceList: MediaDeviceInfo[],
    isDisabled: boolean,
  ) => JSX.Element;
}

const SelectAudioDevice = (props: SelectAudioDeviceProps) => {
  const {selectedMic, setSelectedMic, deviceList} = useContext(DeviceContext);
  const [isPickerDisabled, btnTheme] = useSelectDevice();
  const [isFocussed, setIsFocussed] = React.useState(false);

  const data = deviceList
    .filter((device) => {
      if (device.kind === 'audioinput') {
        return true;
      }
    })
    ?.map((device: any) => {
      if (device.kind === 'audioinput') {
        return {
          label: device.label,
          value: device.deviceId,
        };
      }
    });
  return props?.render ? (
    props.render(selectedMic, setSelectedMic, deviceList, isPickerDisabled)
  ) : (
    <>
      <Text style={[style.label]}>Microphone</Text>
      <Dropdown
        icon="mic-on"
        enabled={!isPickerDisabled}
        selectedValue={selectedMic}
        label={!data || !data.length ? 'No Microphone Detected' : ''}
        data={data}
        onSelect={({label, value}) => {
          setIsFocussed(true);
          setSelectedMic(value);
        }}
      />
    </>
  );
};

const SelectDeviceSettings = () => {
  const [isPickerDisabled] = useSelectDevice();
  const {deviceList} = useContext(DeviceContext);
  const {setCameraAvailable, setMicAvailable} = usePreCall();

  const audioDevices = deviceList.filter((device) => {
    if (device.kind === 'audioinput') {
      return true;
    }
  });
  const videoDevices = deviceList.filter((device) => {
    if (device.kind === 'videoinput') {
      return true;
    }
  });

  useEffect(() => {
    if (audioDevices && audioDevices.length) {
      setMicAvailable(true);
    }
  }, [audioDevices]);

  useEffect(() => {
    if (videoDevices && videoDevices.length) {
      setCameraAvailable(true);
    }
  }, [videoDevices]);

  //commented for v1 release
  // const settingScreenInfoMessage = useString('settingScreenInfoMessage')();
  const settingScreenInfoMessage = $config.AUDIO_ROOM
    ? 'Audio sharing is disabled for attendees. Raise hand to request permission to share.'
    : 'Video and Audio sharing is disabled for attendees. Raise hand to request permission to share.';
  return (
    <View>
      <View>
        {!$config.AUDIO_ROOM && <SelectVideoDevice />}
        <Spacer size={20} />
        <SelectAudioDevice />
      </View>
      {$config.EVENT_MODE && isPickerDisabled && (
        <View>
          <Text style={style.infoTxt}>{settingScreenInfoMessage}</Text>
        </View>
      )}
    </View>
  );
};
export const SelectDeviceSettingsComponentsArray: [
  (props: SelectVideoDeviceProps) => JSX.Element,
  (props: SelectAudioDeviceProps) => JSX.Element,
] = [SelectVideoDevice, SelectAudioDevice];

const style = StyleSheet.create({
  infoTxt: {
    textAlign: 'center',
    fontSize: 12,
    color: '#FF0000',
  },
  label: {
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.small,
    color: $config.FONT_COLOR,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    marginBottom: 12,
    lineHeight: ThemeConfig.FontSize.small,
  },
});

export default SelectDeviceSettings;
