import React, {
  FC,
  ReactElement,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
  Image,
} from 'react-native';
import {isWebInternal} from '../utils/common';
import ThemeConfig from '../theme';
import ImageIcon from './ImageIcon';
import {IconsInterface} from './CustomIcon';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import {LanguageType, langData as data} from '../subComponents/caption/utils';
import IconButton from './IconButton';
import Checkbox from './Checkbox';

interface Props {
  icon?: keyof IconsInterface;

  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  selectedValues: LanguageType[];
  setSelectedValues: React.Dispatch<React.SetStateAction<LanguageType[]>>;
  defaultSelectedValues?: LanguageType[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownMulti: FC<Props> = ({
  defaultSelectedValues,
  selectedValues,
  setSelectedValues,
  error,
  setError,
  icon,
  isOpen,
  setIsOpen,
}) => {
  const DropdownButton = useRef();
  const maxHeight = 170;

  useEffect(() => {
    setSelectedValues(defaultSelectedValues);
    setIsOpen(() => false);
    if (isWebInternal()) {
      window.addEventListener('resize', () => {
        setIsOpen(false);
      });
    }
  }, []);

  const toggleDropdown = (): void => {
    isOpen ? closeDropdown() : openDropdown();
  };

  const openDropdown = (): void => {
    setIsOpen(true);
  };

  const closeDropdown = (): void => {
    setIsOpen(false);
  };

  const onItemPress = (item): void => {
    // // Dropdown should rely on the provided
    // setSelected(item);
    //onSelect(item);
    //setIsOpen(false);

    const isSelected = selectedValues.includes(item.value);
    let updatedValues = [...selectedValues];

    if (isSelected) {
      // Item is already selected, remove it if there are more than one selected languages
      if (selectedValues.length > 0) {
        updatedValues = selectedValues.filter((value) => value !== item.value);
      }
    } else {
      // Item is not selected, add it
      if (selectedValues.length < 2) {
        updatedValues = [...selectedValues, item.value];
      } else {
        // Max selection limit reached, replace the second selected value
        //  updatedValues = [selectedValues[1], item.value];
      }
    }

    setSelectedValues(updatedValues);
    // onSelect(updatedValues);
  };

  // renders each lang checkbox row
  const renderItem = ({item}): ReactElement<any, any> => {
    const isSelected = selectedValues.includes(item.value);
    const isUSEngLangSelected = selectedValues.includes('en-US');
    const isINEngLangSelected = selectedValues.includes('en-IN');

    const isDisabled =
      (!isSelected && selectedValues.length === 2) ||
      (item.value === 'en-US' && isINEngLangSelected) ||
      (item.value === 'en-IN' && isUSEngLangSelected);

    setError(isDisabled || selectedValues.length === 0);

    return (
      <PlatformWrapper>
        <View style={styles.itemContainer}>
          <View style={styles.itemTextContainer}>
            <Checkbox
              disabled={isDisabled}
              checked={isSelected}
              label={item.label}
              labelStye={styles.itemText}
              onChange={() => onItemPress(item)}
            />
          </View>
        </View>
      </PlatformWrapper>
    );
  };

  // renders multiselect lang dropdown
  const renderDropdown = (): ReactElement<any, any> => {
    return (
      <View style={[styles.dropdown]}>
        <FlatList
          showsVerticalScrollIndicator={true}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={{maxHeight}}
        />
      </View>
    );
  };

  const selectedLabels = selectedValues.map((value) => {
    const selectedLanguage = data.find((item) => item.value === value);
    return selectedLanguage ? (
      <View style={styles.selectedLang}>
        <TouchableOpacity
          onPress={() => {
            const updatedValues = selectedValues.filter(
              (value) => value !== selectedLanguage.value,
            );
            setSelectedValues(updatedValues);
          }}>
          <ImageIcon
            iconType="plain"
            name={'close'}
            iconSize={20}
            tintColor={$config.CARD_LAYER_5_COLOR}
          />
        </TouchableOpacity>

        <Text numberOfLines={1} style={styles.dropdownOptionText}>
          {selectedLanguage.label}
        </Text>
      </View>
    ) : (
      <></>
    );
  });
  const formattedSelectedLanguages = selectedLabels; //selectedLabels.join(', ');

  return (
    <View>
      {/* Dropdown Header */}
      <TouchableOpacity
        disabled={!data || !data.length}
        ref={DropdownButton}
        style={[
          styles.dropdownOptionContainer,
          !data || !data.length
            ? {opacity: ThemeConfig.EmphasisOpacity.disabled}
            : {},
          isOpen
            ? {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderBottomWidth: 0,
                borderBottomColor: 'transparent',
              }
            : {},
        ]}
        onPress={toggleDropdown}>
        <View
          style={{flex: 1, justifyContent: 'flex-start', flexDirection: 'row'}}>
          {/* Dropdown start Icon */}
          {icon ? (
            <View style={styles.dropdownIconContainer}>
              <ImageIcon
                iconType="plain"
                name={icon}
                iconSize={20}
                tintColor={$config.SEMANTIC_NEUTRAL}
              />
            </View>
          ) : (
            <></>
          )}
          {/* Dropdown Text */}
          <View
            style={[
              styles.dropdownOptionTextContainer,
              selectedValues.length === 2 && {flex: 0.9},
            ]}>
            {formattedSelectedLanguages}
          </View>
        </View>
        {/* Dropdown end Icon */}
        <View style={styles.dropdownIconContainer}>
          <ImageIcon
            iconType="plain"
            name={isOpen ? 'arrow-up' : 'arrow-down'}
            tintColor={$config.SECONDARY_ACTION_COLOR}
          />
        </View>
      </TouchableOpacity>
      {/* Dropdown Body */}
      {isOpen ? renderDropdown() : <></>}
    </View>
  );
};

const PlatformWrapper = ({children}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  return isWebInternal() ? (
    <div
      style={{
        backgroundColor: isHovered
          ? $config.CARD_LAYER_5_COLOR + hexadecimalTransparency['20%']
          : 'transparent',
        cursor: isHovered ? 'pointer' : 'auto',
      }}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}>
      {children}
    </div>
  ) : (
    <TouchableOpacity>{children}</TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dropdownOptionContainer: {
    flexDirection: 'row',
    backgroundColor: $config.INPUT_FIELD_BACKGROUND_COLOR,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: $config.INPUT_FIELD_BORDER_COLOR,
    borderRadius: ThemeConfig.BorderRadius.medium,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  dropdownOptionTextContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
  dropdownOptionText: {
    textAlign: 'left',
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.normal,
    color: $config.FONT_COLOR,
    marginLeft: 4,
    flex: 1,
  },
  dropdownIconContainer: {
    alignSelf: 'center',
  },
  dropdown: {
    // position: 'relative',
    backgroundColor: $config.INPUT_FIELD_BACKGROUND_COLOR,
    borderBottomColor: $config.INPUT_FIELD_BORDER_COLOR,
    borderLeftColor: $config.INPUT_FIELD_BORDER_COLOR,
    borderRightColor: $config.INPUT_FIELD_BORDER_COLOR,
    borderTopColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    borderBottomLeftRadius: ThemeConfig.BorderRadius.medium,
    borderBottomRightRadius: ThemeConfig.BorderRadius.medium,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 2,
    shadowColor: $config.HARD_CODED_BLACK_COLOR,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedLang: {
    paddingVertical: 4,
    paddingRight: 16,
    paddingLeft: 8,
    backgroundColor: $config.CARD_LAYER_4_COLOR,
    borderRadius: 6,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 8,
  },

  overlay: {
    width: '100%',
    height: '100%',
  },
  itemContainer: {
    minHeight: 40,
    flex: 1,
    flexDirection: 'row',
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingLeft: 16,
  },
  itemText: {
    paddingVertical: 12,
  },
  itemTextSelected: {
    color: $config.PRIMARY_ACTION_BRAND_COLOR,
  },
  itemTextSelectedContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DropdownMulti;
