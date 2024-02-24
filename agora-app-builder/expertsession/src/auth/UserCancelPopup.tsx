import React, {SetStateAction} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Spacer from '../atoms/Spacer';
import Popup from '../atoms/Popup';
import PrimaryButton from '../atoms/PrimaryButton';
import ThemeConfig from '../theme';
import {useIsDesktop} from '../utils/common';
import TertiaryButton from '../atoms/TertiaryButton';
import {useString} from '../utils/useString';
import {
  authLogInRequiredPopupHeading,
  authLogInRequiredPopupPrimaryBtnText,
  authLogInRequiredPopupSecondaryBtnText,
  authLogInRequiredPopupSubHeading,
} from '../language/default-labels/commonLabels';

interface UserCancelPopupProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<SetStateAction<boolean>>;
  login: () => void;
  exitApp: () => void;
}
const UserCancelPopup = (props: UserCancelPopupProps) => {
  const isDesktop = useIsDesktop()('popup');
  const logoutLabelHeading = useString(authLogInRequiredPopupHeading)();
  const logoutLabelSubHeading = useString(authLogInRequiredPopupSubHeading)();

  const loginBtnLabel = useString(authLogInRequiredPopupPrimaryBtnText)();
  const closeAppBtnLabel = useString(authLogInRequiredPopupSecondaryBtnText)();
  return (
    <Popup
      cancelable={false}
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
            text={closeAppBtnLabel}
            onPress={props.exitApp}
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
            text={loginBtnLabel}
            onPress={props.login}
          />
        </View>
      </View>
    </Popup>
  );
};
export default UserCancelPopup;
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
