import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  SHARE_LINK_CONTENT_TYPE,
  useShareLink,
} from '../components/useShareLink';
import platform from '../subComponents/Platform';
import Spacer from './Spacer';
import isSDKCheck from '../utils/isSDK';
import ClipboardIconButton from './ClipboardIconButton';
import ThemeConfig, {FontSizes} from '../theme';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';

interface MeetingLinkStyleProps {
  size?: keyof FontSizes;
  linkFontSize?: keyof FontSizes;
  variant?: 'primary' | 'secondary';
}

interface MeetingLinkProps {
  label: string;
  link: SHARE_LINK_CONTENT_TYPE | string;
  linkToCopy?: SHARE_LINK_CONTENT_TYPE;
  helperText?: string;
  styleProps?: MeetingLinkStyleProps;
  gutterBottom?: boolean;
}
const urlWeb = {wordBreak: 'break-all'};

const MeetingLink = (props: MeetingLinkProps) => {
  const {
    label = '',
    link,
    helperText = '',
    linkToCopy,
    styleProps = {
      size: 'medium',
      variant: 'primary',
    },
    gutterBottom = false,
  } = props;

  const style = useStyles(styleProps);

  const {getShareLink} = useShareLink();

  const isSDK = isSDKCheck();
  const isWebCheck =
    $config.FRONTEND_ENDPOINT || (platform === 'web' && !isSDK);

  return (
    <>
      {label ? <Text style={style.label}>{label}</Text> : <></>}
      <Spacer size={5} />
      <View style={style.linkContainer}>
        <View style={style.linkTextBox}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              style.linkText,
              //@ts-ignore
              isWebCheck ? urlWeb : {opacity: 1},
            ]}>
            {link}
          </Text>
        </View>
        <ClipboardIconButton text={linkToCopy} variant="secondary" size={20} />
      </View>
      {helperText && (
        <>
          <Text style={style.linkHelperText}>{helperText}</Text>{' '}
        </>
      )}
      {gutterBottom && <Spacer size={25} />}
    </>
  );
};

export default MeetingLink;

const useStyles = (styleProps: MeetingLinkStyleProps) => {
  let customStyles = {
    label: {},
    linkTextBox: {},
    linkText: {},
    linkContainer: {},
  };
  if (styleProps.size === 'tiny') {
    customStyles.label = {
      fontSize: ThemeConfig.FontSize.tiny,
    };
    customStyles.linkContainer = {
      borderRadius: ThemeConfig.BorderRadius[styleProps.size],
    };
    customStyles.linkTextBox = {
      paddingVertical: 18,
    };
    customStyles.linkText = {
      fontSize: ThemeConfig.FontSize.small,
    };
  }
  if (styleProps?.linkFontSize === 'tiny') {
    customStyles.linkText = {
      fontSize: ThemeConfig.FontSize.tiny,
    };
  }
  if (styleProps.variant === 'secondary') {
    customStyles.linkText = {
      ...customStyles.linkText,
      color: $config.FONT_COLOR + hexadecimalTransparency['70%'],
    };
  }
  return StyleSheet.create({
    linkContainer: {
      flexDirection: 'row',
    },
    label: {
      color: $config.FONT_COLOR,
      fontSize: ThemeConfig.FontSize.medium,
      fontWeight: '600',
      fontFamily: 'Source Sans Pro',
      textAlign: 'left',
      marginBottom: 8,
      ...customStyles.label,
    },
    linkTextBox: {
      flex: 0.9,
      width: 0,
      backgroundColor: $config.INPUT_FIELD_BACKGROUND_COLOR,
      borderColor: $config.INPUT_FIELD_BORDER_COLOR,
      borderWidth: 1,
      borderTopLeftRadius: ThemeConfig.BorderRadius.medium,
      borderBottomLeftRadius: ThemeConfig.BorderRadius.medium,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      paddingHorizontal: 20,
      paddingVertical: 21,
      ...customStyles.linkTextBox,
    },
    linkText: {
      color: $config.FONT_COLOR + ThemeConfig.EmphasisPlus.medium,
      fontSize: ThemeConfig.FontSize.small,
      fontFamily: ThemeConfig.FontFamily.sansPro,
      ...customStyles.linkText,
    },
    linkIcon: {
      marginLeft: 'auto',
      flexDirection: 'row',
      alignSelf: 'center',
    },
    linkHelperText: {
      color: '#CCCCCC',
      marginTop: 10,
      fontSize: 14,
      fontWeight: '400',
      fontFamily: 'Source Sans Pro',
    },
  });
};
