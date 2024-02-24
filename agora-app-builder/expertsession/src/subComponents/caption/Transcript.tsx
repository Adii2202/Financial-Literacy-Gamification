import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
  VirtualizedList,
} from 'react-native';
import React from 'react';
import CommonStyles from '../../components/CommonStyles';
import {getGridLayoutName} from '../../pages/video-call/DefaultLayouts';
import {useLayout} from '../../utils/useLayout';
import {
  calculatePosition,
  debounceFn,
  isMobileUA,
  isWebInternal,
  useIsSmall,
} from '../../utils/common';
import {TranscriptHeader} from '../../pages/video-call/SidePanelHeader';
import {useRtc, useContent} from 'customization-api';
import {useCaption} from './useCaption';
import {TranscriptText} from './TranscriptText';
import PrimaryButton from '../../atoms/PrimaryButton';
import ThemeConfig from '../../theme';
import Loading from '../Loading';
import ImageIcon from '../../atoms/ImageIcon';
import hexadecimalTransparency from '../../../src/utils/hexadecimalTransparency';
import Spacer from '../../atoms/Spacer';
import useStreamMessageUtils from './useStreamMessageUtils';
import {StreamMessageCallback} from 'react-native-agora/lib/typescript/common/RtcEvents';
import useCaptionWidth from './useCaptionWidth';
import DownloadTranscriptBtn from './DownloadTranscriptBtn';
import {useString} from '../../../src/utils/useString';
import {
  sttSettingSpokenLanguageText,
  sttTranscriptPanelNoSearchResultsFoundText,
  sttTranscriptPanelSearchText,
  sttTranscriptPanelViewLatestText,
} from '../../../src/language/default-labels/videoCallScreenLabels';

interface TranscriptProps {
  showHeader?: boolean;
}
const Transcript = (props: TranscriptProps) => {
  const settingSpokenLanguageLabel = useString(sttSettingSpokenLanguageText)();
  const searchText = useString(sttTranscriptPanelSearchText)();
  const noresults = useString(sttTranscriptPanelNoSearchResultsFoundText)();
  const viewlatest = useString(sttTranscriptPanelViewLatestText)();

  const isSmall = useIsSmall();
  const {currentLayout} = useLayout();
  const {showHeader = true} = props;
  const {
    meetingTranscript,
    isLangChangeInProgress,
    isSTTListenerAdded,
    setIsSTTListenerAdded,
  } = useCaption();

  const data = meetingTranscript; // Object.entries(transcript);

  const [showButton, setShowButton] = React.useState(false);

  const contentHeightRef = React.useRef(0);
  const flatListRef = React.useRef(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const {RtcEngineUnsafe} = useRtc();
  const {defaultContent} = useContent();
  const {streamMessageCallback} = useStreamMessageUtils();

  const [isFocused, setIsFocused] = React.useState(false);

  const {transcriptHeight} = useCaptionWidth();
  const isScrolledToEnd = React.useRef(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleLayout = () => {
    if (flatListRef.current && !isWebInternal()) {
      flatListRef.current.scrollToOffset({
        offset: contentHeightRef.current,
        animated: false,
      });

      isScrolledToEnd.current = true;
    }
  };

  const renderItem = ({item}) => {
    return item.uid.toString().indexOf('langUpdate') !== -1 ? (
      <View style={styles.langChangeContainer}>
        <ImageIcon
          iconType="plain"
          iconSize={20}
          tintColor={$config.PRIMARY_ACTION_BRAND_COLOR}
          name={'lang-select'}
        />

        <Text style={styles.langChange}>
          {defaultContent[item?.uid?.split('-')[1]].name + ' ' + item.text}
        </Text>
      </View>
    ) : (
      <TranscriptText
        user={defaultContent[item.uid].name}
        time={item?.time}
        value={item.text}
        searchQuery={searchQuery}
      />
    );
  };

  const handleViewLatest = () => {
    // flatListRef.current.scrollToOffset({
    //   offset: contentHeightRef.current,
    //   animated: false,
    // });
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: false});
      setShowButton(false);
      isScrolledToEnd.current = true;
    }
  };

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    contentHeightRef.current = contentHeight;
    if (!showButton && searchQuery.length === 0) {
      flatListRef.current.scrollToOffset({
        offset: contentHeightRef.current,
        animated: false,
      });

      isScrolledToEnd.current = true;
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isScrolledToEnd.current) {
      isScrolledToEnd.current = false;
      return;
    }

    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;
    const isAtBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 1; // -1 threshold when the exact bottom position not calcualted , diff ~.5
    setShowButton(!isAtBottom);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Filter the data based on the search query
    const filteredResults = meetingTranscript.filter(item =>
      item.text.toLowerCase().includes(text.toLowerCase()),
    );
    setShowButton(false);
    setSearchResults(filteredResults);
    // Scroll to the top of the FlatList when searching
    flatListRef.current.scrollToOffset({offset: 0, animated: false});
  };

  const renderedData = searchQuery ? searchResults : data;

  const NoResultsMsg = () => {
    return <Text style={styles.emptyMsg}>{noresults}</Text>;
  };

  const handleStreamMessageCallback = (
    ...args: [number, Uint8Array] | [number, string, Uint8Array]
  ) => {
    setIsSTTListenerAdded(true);
    if (isWebInternal()) {
      streamMessageCallback(args as [number, Uint8Array]);
    } else {
      const [uid, , data] = args;
      const streamBuffer = Object.values(data);
      streamMessageCallback([uid, new Uint8Array(streamBuffer)]);
    }
  };

  React.useEffect(() => {
    if (!isSTTListenerAdded) {
      RtcEngineUnsafe.addListener(
        'StreamMessage',
        handleStreamMessageCallback as unknown as StreamMessageCallback,
      );
    }
  }, []);

  return (
    <View
      // onLayout={handleLayout}
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
        {paddingBottom: 20},
      ]}>
      {showHeader && <TranscriptHeader />}
      <View style={[styles.searchContainer, isFocused && styles.inputFocused]}>
        {!searchQuery && (
          <>
            <ImageIcon
              name="search"
              iconSize={20}
              iconType="plain"
              tintColor={$config.FONT_COLOR + hexadecimalTransparency['30%']}
            />
            <Spacer size={4} horizontal />
          </>
        )}
        <TextInput
          style={styles.searchInput}
          placeholder={searchText}
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={
            $config.FONT_COLOR + hexadecimalTransparency['30%']
          }
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery('');
            }}>
            <ImageIcon
              name="close"
              iconSize={20}
              iconType="plain"
              tintColor={$config.FONT_COLOR + hexadecimalTransparency['30%']}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {isLangChangeInProgress ? (
        <View style={{flex: 1}}>
          <Loading
            text={settingSpokenLanguageLabel}
            background="transparent"
            indicatorColor={$config.FONT_COLOR + hexadecimalTransparency['70%']}
            textColor={$config.FONT_COLOR + hexadecimalTransparency['70%']}
          />
        </View>
      ) : (
        <>
          <View style={{flex: 1}}>
            {/* <FlatList
              ref={flatListRef}
              style={styles.contentContainer}
              data={renderedData}
              renderItem={renderItem}
              keyExtractor={item => item.uid + '-' + item.time}
              onContentSizeChange={handleContentSizeChange}
              onScroll={handleScroll}
              onLayout={handleLayout}
              ListEmptyComponent={searchQuery && <NoResultsMsg />}
              ListFooterComponent={DownloadTranscriptBtn}
              ListFooterComponentStyle={styles.footer}
              contentContainerStyle={styles.content}
            /> */}
            <VirtualizedList
              ref={flatListRef}
              style={styles.contentContainer}
              data={renderedData}
              renderItem={renderItem}
              keyExtractor={item => item.uid + '-' + item?.time}
              onContentSizeChange={handleContentSizeChange}
              onScroll={
                isWebInternal()
                  ? debounceFn(handleScroll, isMobileUA() ? 500 : 300)
                  : handleScroll
              }
              onLayout={handleLayout}
              ListEmptyComponent={searchQuery && <NoResultsMsg />}
              ListFooterComponent={DownloadTranscriptBtn}
              ListFooterComponentStyle={styles.footer}
              contentContainerStyle={styles.content}
              getItemCount={() => renderedData.length}
              getItem={(data, index) => renderedData[index]}
            />

            {showButton ? (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  alignItems: 'center',
                  zIndex: 9999,
                }}>
                <PrimaryButton
                  iconName={'view-last'}
                  containerStyle={styles.showLatestBtn}
                  textStyle={styles.textStyleBtn}
                  onPress={handleViewLatest}
                  iconSize={20}
                  text={viewlatest}
                />
              </View>
            ) : null}
          </View>
        </>
      )}
    </View>
  );
};

export default Transcript;

export const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
  },
  container: {
    alignItems: 'flex-start',
  },
  btnContainerStyle: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    borderRadius: 4,
  },
  btnContainer: {
    // margin: 20,
  },

  btnTxtStyle: {
    fontSize: ThemeConfig.FontSize.small,
    lineHeight: ThemeConfig.FontSize.small,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  showLatestBtn: {
    backgroundColor: $config.CARD_LAYER_5_COLOR,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 16,
    minWidth: 'auto',
    borderRadius: 28,
  },
  textStyleBtn: {
    color: $config.SECONDARY_ACTION_COLOR,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontSize: ThemeConfig.FontSize.small,
    lineHeight: 19,
    fontWeight: '400',
    textTransform: 'capitalize',
  },
  /* search results*/
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,

    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 4,
    height: 40,
    borderWidth: 1,

    borderColor: $config.INPUT_FIELD_BORDER_COLOR,
    backgroundColor: $config.INPUT_FIELD_BACKGROUND_COLOR,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
    color: $config.FONT_COLOR,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.small,
    lineHeight: ThemeConfig.FontSize.medium,
    width: '100%',
    borderWidth: 0,

    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  inputFocused: {
    borderColor: $config.PRIMARY_ACTION_BRAND_COLOR,
  },
  searchButton: {
    backgroundColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  searchButtonText: {
    color: $config.FONT_COLOR,
    fontSize: 14,
  },
  emptyMsg: {
    color: $config.FONT_COLOR + hexadecimalTransparency['40%'],
    alignSelf: 'center',
    fontSize: 14,
    fontStyle: 'italic',
  },
  langChange: {
    marginLeft: 4,
    color: $config.PRIMARY_ACTION_BRAND_COLOR,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  langChangeContainer: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  footer: {
    borderWidth: 1,
    paddingVertical: 8,
    borderColor: $config.SECONDARY_ACTION_COLOR,
    borderRadius: 4,
    marginTop: 'auto',
  },
  content: {
    flexGrow: 1,
  },
});
