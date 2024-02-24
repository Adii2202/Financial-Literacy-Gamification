import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ImageSourcePropType,
} from 'react-native';
import React from 'react';
import ThemeConfig from '../../theme';
import {IconsInterface} from '../../atoms/CustomIcon';
import {VBMode, useVB} from './useVB.native';
import ImageIcon from '../../atoms/ImageIcon';
import DocumentPicker from 'react-native-document-picker';
import Toast from '../../../react-native-toast-message';
import RNFS from 'react-native-fs';
import {saveImagesToAsyncStorage} from './VButils.native';
import getUniqueID from '../../../src/utils/getUniqueID';
import {useString} from '../../../src/utils/useString';
import {
  vbPanelImageSizeLimitErrorToastHeading,
  vbPanelImageSizeLimitErrorToastSubHeading,
  vbPanelImageTypeErrorToastHeading,
  vbPanelImageTypeErrorToastSubHeading,
  vbPanelImageUploadErrorToastHeading,
  vbPanelImageUploadErrorToastSubHeading,
} from '../../../src/language/default-labels/videoCallScreenLabels';
import {TextDataInterface} from 'customization-api';

interface VBCardProps {
  type: VBMode;
  icon: keyof IconsInterface;
  path?: ImageSourcePropType;
  label?: string;
  translationKey?: keyof TextDataInterface;
  position?: number;
  isOnPrecall?: boolean;
  isMobile?: boolean;
}

const TickIcon: React.FC = () => {
  return (
    <View style={styles.tickContainer}>
      <View style={styles.triangle} />
      <ImageIcon
        iconSize={14}
        base64={true}
        name="done"
        iconType="plain"
        base64TintColor={$config.SECONDARY_ACTION_COLOR}
      />
    </View>
  );
};

const VBCard: React.FC<VBCardProps> = ({
  type,
  icon,
  path,
  label,
  position,
  isOnPrecall,
  isMobile,
  translationKey,
}) => {
  const {
    setVBmode,
    setSelectedImage,
    selectedImage,
    vbMode,
    setSaveVB,
    options,
    setOptions,
  } = useVB();

  const typeErrorHeading = useString(vbPanelImageTypeErrorToastHeading)();
  const typeErrorSubheading = useString(vbPanelImageTypeErrorToastSubHeading)();
  const limitErrorHeading = useString(vbPanelImageSizeLimitErrorToastHeading)();
  const limitErrorSubHeading = useString(
    vbPanelImageSizeLimitErrorToastSubHeading,
  )();
  const uploadErrorHeading = useString(vbPanelImageUploadErrorToastHeading)();
  const uploadErrorSubHeading = useString(
    vbPanelImageUploadErrorToastSubHeading,
  )();
  const translation = useString(translationKey)();

  const isSelected = path ? path == selectedImage : vbMode === type;

  const readFile = async uri => {
    try {
      const base64Data = await RNFS.readFile(uri, 'base64');
      return base64Data;
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      if (
        !(result[0].type === 'image/jpeg' || result[0].type === 'image/jpeg')
      ) {
        Toast.show({
          leadingIconName: 'alert',
          type: 'error',
          text2: typeErrorSubheading,
          text1: typeErrorHeading,
          visibilityTime: 3000,
        });
        return;
      }

      if (result[0].size <= 1024 * 1024 * 1) {
        const base64Data = `data:${result[0].type};base64,${await readFile(
          result[0].uri,
        )}`;

        if (options.filter(option => option.path === base64Data).length > 0) {
          Toast.show({
            leadingIconName: 'alert',
            type: 'error',
            text2: uploadErrorSubHeading,
            text1: uploadErrorHeading,
            visibilityTime: 3000,
          });
          return;
        }

        const newCard = {
          type: 'image' as VBMode,
          icon: 'vb' as keyof IconsInterface,
          path: base64Data,
          id: getUniqueID(),
        };

        setOptions(prevOptions => {
          const updatedOptions = [...prevOptions];
          updatedOptions.splice(3, 0, newCard);
          return updatedOptions;
        });

        saveImagesToAsyncStorage(base64Data);
      } else {
        Toast.show({
          leadingIconName: 'alert',
          type: 'error',
          text2: limitErrorSubHeading,
          text1: limitErrorHeading,
          visibilityTime: 3000,
        });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        console.error(err);
      }
    }
  };

  const handleClick = async () => {
    setSaveVB(false);
    setVBmode(type);
    if (path) {
      setSelectedImage(path);
    } else {
      setSelectedImage(null);
    }
    if (type === 'custom') {
      await handleFileUpload();
    }
  };

  return (
    <Pressable
      style={[
        styles.card,
        isMobile ? styles.mobileCard : styles.desktopCard,
        isSelected && styles.active,
        isOnPrecall && !isMobile && position % 3 !== 0 ? {marginRight: 8} : {},
        isOnPrecall && !isMobile ? {marginBottom: 8, width: '31.8%'} : {},
      ]}
      onPress={handleClick}>
      {isSelected && type !== 'custom' && <TickIcon />}
      {path ? (
        <Image
          style={styles.img}
          source={typeof path === 'string' ? {uri: path} : path}
        />
      ) : (
        <View>
          <ImageIcon
            iconType="plain"
            iconSize={24}
            name={icon}
            tintColor={$config.SECONDARY_ACTION_COLOR}
          />
          {label && translation ? (
            <View>
              <Text
                style={{
                  fontSize: ThemeConfig.FontSize.tiny,
                  fontWeight: '400',
                  fontFamily: ThemeConfig.FontFamily.sansPro,
                  color: $config.SECONDARY_ACTION_COLOR,
                  paddingVertical: 4,
                }}>
                {translation}
              </Text>
            </View>
          ) : (
            <></>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default VBCard;

const styles = StyleSheet.create({
  tickContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderTopLeftRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 1,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 24,
    borderBottomWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    borderBottomColor: 'transparent',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  card: {
    backgroundColor: $config.CARD_LAYER_4_COLOR,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: $config.INPUT_FIELD_BORDER_COLOR,
  },
  desktopCard: {
    width: '48%',
    aspectRatio: 2 / 1,
    marginBottom: 12,
  },
  mobileCard: {
    width: 72,
    height: 72,
    marginRight: 6,
  },
  active: {
    borderWidth: 2,
    borderColor: $config.PRIMARY_ACTION_BRAND_COLOR,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 4,
  },
});
