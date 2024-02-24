import React, {useState, useRef} from 'react';

import LayoutIconDropdown from './LayoutIconDropdown';
import useLayoutsData from '../pages/video-call/useLayoutsData';
import {useChangeDefaultLayout} from '../pages/video-call/DefaultLayouts';
import {useLayout} from '../utils/useLayout';
import IconButton, {IconButtonProps} from '../atoms/IconButton';
import {isMobileUA} from '../utils/common';
import isMobileOrTablet from '../utils/isMobileOrTablet';
import {useWindowDimensions} from 'react-native';
import {useContent} from 'customization-api';
import {useActionSheet} from '../utils/useActionSheet';
import {useString} from '../utils/useString';
import {toolbarItemLayoutText} from '../language/default-labels/videoCallScreenLabels';

export interface LayoutIconButtonInterface {
  render?: (onPress: () => void) => JSX.Element;
}

const LayoutIconButton = (props: LayoutIconButtonInterface) => {
  const {activeUids, customContent} = useContent();
  //const activeUidsLen = activeUids?.filter((i) => !customContent[i])?.length;
  const {height: windowHeight} = useWindowDimensions();
  const [modalPosition, setModalPosition] = useState(null);
  const layoutBtnRef = useRef();
  const [isHovered, setIsHoveredLocal] = useState(false);
  const [isHoveredOnModal, setIsHoveredOnModal] = useState(false);
  const isMobileView = isMobileUA();
  const {isOnActionSheet} = useActionSheet();
  const showLabel = $config.ICON_TEXT ? true : false;
  const setIsHovered = (hovered: boolean) => {
    if (layoutBtnRef && layoutBtnRef.current) {
      //@ts-ignore
      layoutBtnRef?.current?.measure((_fx, _fy, _w, h, _px, _py) => {
        setModalPosition({
          bottom: isMobileOrTablet()
            ? windowHeight - _py + 10
            : windowHeight - _py - 10,
          left: isMobileOrTablet() ? _px - 10 : -10,
        });
        setIsHoveredLocal(hovered);
      });
    }
  };
  const layoutLabel = useString(toolbarItemLayoutText)('');
  const layouts = useLayoutsData();
  const changeLayout = useChangeDefaultLayout();
  const {currentLayout, setLayout} = useLayout();

  const layout = layouts.findIndex(item => item.name === currentLayout);
  const renderLayoutIcon = (showDropdown?: boolean) => {
    let onPress = () => {};
    let renderContent = [];
    if (!showDropdown) {
      onPress = () => {
        changeLayout();
      };
    } else {
      onPress = () => {
        //desktop web don't need onpress
        if (isMobileUA()) {
          setIsHovered(!isHovered);
        }
      };
    }
    let iconButtonProps: Partial<IconButtonProps> = {
      onPress: onPress,
      btnTextProps: {
        text: showLabel ? layoutLabel : '',
        textColor: $config.FONT_COLOR,
      },
    };
    iconButtonProps.isOnActionSheet = isOnActionSheet;
    if (isOnActionSheet) {
      // iconButtonProps.containerStyle = {
      //   backgroundColor: $config.CARD_LAYER_2_COLOR,
      //   width: 52,
      //   height: 52,
      //   borderRadius: 26,
      //   justifyContent: 'center',
      //   alignItems: 'center',
      // };
      iconButtonProps.btnTextProps.textStyle = {
        color: $config.FONT_COLOR,
        marginTop: 8,
        fontSize: 12,
        fontWeight: '400',
        fontFamily: 'Source Sans Pro',
        textAlign: 'center',
      };
    }
    const iconName = renderContent.push(
      props?.render ? (
        props.render(onPress)
      ) : (
        <PlatformWrapper
          key={'layout-icon-btn'}
          //showDropdown={isHovered}
          setIsHovered={
            setIsHovered
            // (flag) => {
            //   if (flag) {
            //     setIsHovered(true);
            //   } else {
            //     if (isMobileOrTablet()) {
            //       setIsHovered(false);
            //     } else {
            //       setTimeout(() => {
            //         setIsHovered(false);
            //       }, 100);
            //     }
            //   }
            // }
          }>
          <IconButton
            disabled={!activeUids || activeUids.length === 0}
            containerStyle={{
              opacity: !activeUids || activeUids.length === 0 ? 0.6 : 1,
            }}
            setRef={ref => {
              layoutBtnRef.current = ref;
            }}
            key={'defaultLayoutIconWithName'}
            iconProps={{
              icon: layouts[layout]?.icon,
              tintColor: $config.SECONDARY_ACTION_COLOR,
            }}
            {...iconButtonProps}
          />
        </PlatformWrapper>
      ),
    );
    return renderContent;
  };
  return (
    <>
      {/**
       * Based on the flag. it will render the dropdown
       */}
      {activeUids && activeUids.length ? (
        <PlatformWrapperPopup
          setIsHovered={
            isMobileOrTablet()
              ? setIsHovered
              : (isHoveredOnPopup: boolean) => {
                  if (isHoveredOnPopup) {
                    setIsHoveredOnModal(isHoveredOnPopup);
                  } else {
                    if (isMobileUA()) {
                      setIsHoveredOnModal(isHoveredOnPopup);
                    } else {
                      setTimeout(() => {
                        if (!isHovered) {
                          setIsHoveredOnModal(isHoveredOnPopup);
                        }
                      }, 100);
                    }
                  }
                }
          }>
          <LayoutIconDropdown
            caretPosition={{
              bottom: isMobileOrTablet() ? -8 : -10,
              left: isMobileOrTablet() ? 26 : 26,
            }}
            modalPosition={modalPosition}
            showDropdown={
              isMobileOrTablet() ? isHovered : isHovered || isHoveredOnModal
            }
            setShowDropdown={
              isMobileOrTablet() ? setIsHovered : setIsHoveredOnModal
            }
          />
        </PlatformWrapperPopup>
      ) : (
        <></>
      )}
      {/**
       * If layout contains more than 2 data. it will render the dropdown.
       */}
      {layouts && Array.isArray(layouts) && layouts.length > 1
        ? renderLayoutIcon(true)
        : renderLayoutIcon(false)}
    </>
  );
};
const PlatformWrapper = ({children, ...props}) => {
  return !isMobileOrTablet() ? (
    <div
      onMouseEnter={() => {
        props?.setIsHovered(true);
      }}
      onMouseLeave={() => {
        props?.setIsHovered(false);
      }}>
      {children}
    </div>
  ) : (
    children
  );
};
const PlatformWrapperPopup = ({children, ...props}) => {
  return !isMobileOrTablet() ? (
    <div
      onMouseEnter={() => {
        props?.setIsHovered(true);
      }}
      onMouseLeave={() => {
        props?.setIsHovered(false);
      }}>
      {children}
    </div>
  ) : (
    children
  );
};

export default LayoutIconButton;
