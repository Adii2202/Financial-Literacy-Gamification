import React, {SetStateAction, useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Spacer from '../atoms/Spacer';
import Popup from '../atoms/Popup';
import TertiaryButton from '../atoms/TertiaryButton';
import PrimaryButton from '../atoms/PrimaryButton';
import ThemeConfig from '../theme';
import {useIsDesktop} from '../utils/common';
import {useString} from '../utils/useString';
import {
  removeScreenshareFromRoomPopupHeading,
  removeScreenshareFromRoomPopupPrimaryBtnText,
  removeScreenshareFromRoomPopupSubHeading,
} from '../language/default-labels/videoCallScreenLabels';
import {cancelText} from '../language/default-labels/commonLabels';

interface RemoveScreensharePopupProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<SetStateAction<boolean>>;
  removeScreenShareFromMeeting: () => void;
  username: string;
}
const RemoveScreensharePopup = (props: RemoveScreensharePopupProps) => {
  const isDesktop = useIsDesktop()('popup');
  const removeMeetingLabelHeading = useString(
    removeScreenshareFromRoomPopupHeading,
  )();
  const removeMeetingLabelSubHeading = useString(
    removeScreenshareFromRoomPopupSubHeading,
  );

  const cancelBtnLabel = useString(cancelText)();
  const removeBtnLabel = useString(
    removeScreenshareFromRoomPopupPrimaryBtnText,
  )();
  return (
    <Popup
      modalVisible={props.modalVisible}
      setModalVisible={props.setModalVisible}
      showCloseIcon={false}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.heading}>{removeMeetingLabelHeading}</Text>
      <Spacer size={8} />
      <Text style={styles.subHeading}>
        {removeMeetingLabelSubHeading(props?.username)}
      </Text>
      <Spacer size={32} />
      <View style={isDesktop ? styles.btnContainer : styles.btnContainerMobile}>
        <View style={isDesktop && {flex: 1}}>
          <TertiaryButton
            containerStyle={{
              width: '100%',
              height: 48,
              paddingVertical: 12,
              paddingHorizontal: 12,
              borderRadius: ThemeConfig.BorderRadius.medium,
            }}
            textStyle={styles.btnText}
            text={cancelBtnLabel}
            onPress={() => props.setModalVisible(false)}
          />
        </View>
        <Spacer
          size={isDesktop ? 10 : 20}
          horizontal={isDesktop ? true : false}
        />
        <View style={isDesktop && {flex: 1}}>
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
            text={removeBtnLabel}
            onPress={() => {
              props.removeScreenShareFromMeeting();
              props.setModalVisible(false);
            }}
          />
        </View>
      </View>
    </Popup>
  );
};

export default RemoveScreensharePopup;

const styles = StyleSheet.create({
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 24,
    maxWidth: 342,
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
    fontSize: 22,
    color: $config.SEMANTIC_ERROR,
  },
  subHeading: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: 14,
    color: $config.FONT_COLOR,
  },
});
