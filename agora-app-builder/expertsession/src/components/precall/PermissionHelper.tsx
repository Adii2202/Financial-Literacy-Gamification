import {useLocalUserInfo} from 'customization-api';
import React, {useContext, useEffect, useState} from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Popup from '../../atoms/Popup';
import ThemeConfig from '../../theme';
//@ts-ignore
import permissionHelper from '../../assets/permission.png';
import {DispatchContext, PermissionState} from '../../../agora-rn-uikit';
import {useString} from '../../utils/useString';
import {
  permissionPopupDismissBtnText,
  permissionPopupHeading,
  permissionPopupSubHeading,
} from '../../language/default-labels/precallScreenLabels';

const PermissionHelper = () => {
  const heading = useString<any>(permissionPopupHeading)({
    audioRoom: $config.AUDIO_ROOM,
  });
  const subheading = useString<any>(permissionPopupSubHeading)({
    audioRoom: $config.AUDIO_ROOM,
  });
  const dismiss = useString(permissionPopupDismissBtnText)();

  const {dispatch} = useContext(DispatchContext);
  const {permissionStatus} = useLocalUserInfo();
  const [showPopup, setShowPopup] = useState(false);

  const closePopup = () => {
    dispatch({
      type: 'LocalPermissionState',
      value: [PermissionState.CANCELLED],
    });
  };
  useEffect(() => {
    Promise.all([
      navigator.permissions.query(
        //@ts-ignore
        {name: 'camera'},
      ),
      navigator.permissions.query(
        //@ts-ignore
        {name: 'microphone'},
      ),
    ])
      .then(([cameraResult, micResult]) => {
        // Chrome
        if (cameraResult.state !== 'granted' || micResult.state !== 'granted') {
          setShowPopup(true);
          const onChangeFunc = () => {
            if (
              cameraResult.state === 'granted' &&
              micResult.state === 'granted'
            )
              setShowPopup(false);
          };
          micResult.onchange = onChangeFunc;
          cameraResult.onchange = onChangeFunc;
        }
      })
      .catch(e => {
        // Firefox
        setTimeout(() => {
          setShowPopup(true);
        }, 1000);
      });
    //If permission already given it will take few milliseconds to resolve the promise. it will show the popup which not required. so added timeout
    // setTimeout(() => {
    //   setShowPopup(true);
    // }, 1000);
  }, []);
  //todo hari update the modal message based the veritical
  return (
    showPopup && (
      <Popup
        modalVisible={permissionStatus === PermissionState.REQUESTED}
        setModalVisible={closePopup}
        showCloseIcon={false}
        contentContainerStyle={styles.modal}>
        <View style={styles.modalImageContainer}>
          <Image
            style={styles.modalImage}
            resizeMode={'contain'}
            source={{uri: permissionHelper}}
          />
        </View>
        <View style={styles.modalContent}>
          <Text style={styles.infoMessage1}>{heading}</Text>
          <Text style={styles.infoMessage2}>{subheading}</Text>
          <TouchableOpacity
            onPress={() => {
              closePopup();
            }}>
            <Text style={styles.dismissBtn}>{dismiss}</Text>
          </TouchableOpacity>
        </View>
      </Popup>
    )
  );
};

const styles = StyleSheet.create({
  dismissBtn: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    fontSize: ThemeConfig.FontSize.normal,
    color: $config.PRIMARY_ACTION_BRAND_COLOR,
    paddingVertical: 32,
  },
  infoMessage1: {
    paddingHorizontal: 76,
    paddingTop: 32,
    paddingBottom: 12,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '700',
    fontSize: ThemeConfig.FontSize.large,
    textAlign: 'center',
    color: $config.FONT_COLOR,
  },
  infoMessage2: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.small,
    color: $config.FONT_COLOR + ThemeConfig.EmphasisPlus.medium,
  },
  infoMessage2Highlight: {
    fontWeight: '700',
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontSize: ThemeConfig.FontSize.small,
  },
  modal: {
    flex: 1,
    flexDirection: 'column',
    maxHeight: 386,
    width: 441,
    borderRadius: 20,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
  },
  modalImageContainer: {
    minHeight: 190,
  },
  modalImage: {width: '100%', height: '100%'},
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: $config.CARD_LAYER_1_COLOR,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
export default PermissionHelper;
