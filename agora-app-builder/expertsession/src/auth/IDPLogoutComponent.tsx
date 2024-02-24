import React, {SetStateAction, useContext, useState} from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import Spacer from '../atoms/Spacer';
import Popup from '../atoms/Popup';
import PrimaryButton from '../atoms/PrimaryButton';
import ThemeConfig from '../theme';
import {isMobileUA, useIsDesktop} from '../utils/common';
import TertiaryButton from '../atoms/TertiaryButton';
import isSDK from '../utils/isSDK';
import {useAuth} from './AuthProvider';
import {useString} from '../utils/useString';
import {
  authLogoutPopupHeading,
  authLogoutPopupPrimaryBtnText,
  authLogoutPopupSubHeading,
  cancelText,
  logoutText,
} from '../language/default-labels/commonLabels';

interface LogoutPopupProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<SetStateAction<boolean>>;
  logout: () => void;
}
const LogoutPopup = (props: LogoutPopupProps) => {
  const isDesktop = useIsDesktop()('popup');
  const logoutLabelHeading = useString(authLogoutPopupHeading)();
  const logoutLabelSubHeading = useString(authLogoutPopupSubHeading)();

  const cancelBtnLabel = useString(cancelText)();
  const confirmBtnLabel = useString(authLogoutPopupPrimaryBtnText)();
  return (
    <Popup
      modalVisible={props.modalVisible}
      setModalVisible={props.setModalVisible}
      showCloseIcon={false}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.heading}>{logoutLabelHeading}</Text>
      <Spacer size={8} />
      <Text style={styles.subHeading}>{logoutLabelSubHeading}</Text>
      <Spacer size={32} />
      <View style={isDesktop ? styles.btnContainer : styles.btnContainerMobile}>
        <View style={isDesktop && {flex: 1}}>
          <TertiaryButton
            containerStyle={{
              minWidth: 'auto',
              width: isDesktop ? 90 : '100%',
              height: 48,
              paddingVertical: 12,
              paddingHorizontal: 12,
              borderRadius: ThemeConfig.BorderRadius.medium,
            }}
            textStyle={styles.btnText}
            text={cancelBtnLabel}
            onPress={() => {
              props.setModalVisible(false);
            }}
          />
        </View>
        <Spacer
          size={isDesktop ? 10 : 20}
          horizontal={isDesktop ? true : false}
        />
        <View style={isDesktop && {flex: 2}}>
          <PrimaryButton
            containerStyle={{
              minWidth: 'auto',
              width: '100%',
              borderRadius: ThemeConfig.BorderRadius.medium,
              height: 48,
              backgroundColor: $config.SEMANTIC_ERROR,
              paddingVertical: 12,
              paddingHorizontal: 12,
            }}
            textStyle={styles.btnText}
            text={confirmBtnLabel}
            onPress={props.logout}
          />
        </View>
      </View>
    </Popup>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
  },

  btnContainerMobile: {
    flexDirection: 'column-reverse',
  },
  contentContainer: {
    padding: 24,
    maxWidth: 342,
    minWidth: 342,
  },
  heading: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    fontSize: 22,
    color: $config.SEMANTIC_ERROR,
  },
  subHeading: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.small,
    color: $config.FONT_COLOR,
  },
});

interface IDPLogoutComponentProps {
  containerStyle?: ViewStyle;
}

const IDPLogoutComponent = (props?: IDPLogoutComponentProps) => {
  const logoutLabel = useString(logoutText)();
  const {authenticated, authLogout} = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  return authenticated && $config.ENABLE_IDP_AUTH && !isSDK() ? (
    <View
      style={[
        {
          zIndex: 999,
          maxWidth: 80,
          marginTop: isMobileUA() ? 16 : 32,
          marginRight: isMobileUA() ? 16 : 32,
          alignSelf: 'flex-end',
        },
        props?.containerStyle,
      ]}>
      <LogoutPopup
        logout={() => {
          authLogout();
        }}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <TertiaryButton
        text={logoutLabel}
        onPress={() => {
          setModalVisible(true);
        }}
      />
    </View>
  ) : (
    <></>
  );
};
export default IDPLogoutComponent;
