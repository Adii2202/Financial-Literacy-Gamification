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

import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {hexToRgb, isMobileUA, isWeb, randomString} from '../../utils/common';
import {ApplianceNames} from 'white-web-sdk';
import StorageContext from '../../components/StorageContext';
import {useRoomInfo} from '../room-info/useRoomInfo';
import Toast from '../../../react-native-toast-message';
import {IconButton, whiteboardContext, useContent} from 'customization-api';
import LocalEventEmitter, {
  LocalEventsEnum,
} from '../../rtm-events-api/LocalEvents';
import {BoardColor} from './WhiteboardConfigure';
import hexadecimalTransparency from '../../utils/hexadecimalTransparency';
import StrokeWidthTool from './StrokeWidthTool';
import {useVideoCall} from '../../components/useVideoCall';
import {useString} from '../../utils/useString';
import {
  whiteboardFileUploadErrorToastHeading,
  whiteboardFileUploadInfoToastHeading,
  whiteboardFileUploadTypeErrorToastHeading,
  whiteboardFileUploadTypeErrorToastSubHeading,
  whiteboardToolboxClearAllText,
  whiteboardToolboxEraseText,
  whiteboardToolboxLaserText,
  whiteboardToolboxMoveText,
  whiteboardToolboxPxLabel,
  whiteboardToolboxSelectText,
  whiteboardToolboxTextFormatting,
  whiteboardToolboxUploadText,
  whiteboardToolboxWidthLabel,
} from '../../language/default-labels/videoCallScreenLabels';

const supportedDocTypes = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/pdf',
];
const supportedImageType = ['image/png', 'image/jpeg'];
interface ColorPickerValues {
  [key: string]: {
    hex: string;
    rgb: [number, number, number];
  };
}
const ColorPickerValues: ColorPickerValues = {
  white: {
    hex: '#FFFFFF',
    rgb: [255, 255, 255],
  },
  lightGrey: {
    hex: '#666666',
    rgb: [102, 102, 102],
  },
  lightBlue: {
    hex: '#86B7F9',
    rgb: [134, 183, 249],
  },
  lightGreen: {
    hex: '#A7DBB0',
    rgb: [167, 219, 176],
  },
  lightYellow: {
    hex: '#F7D686',
    rgb: [247, 214, 134],
  },
  lightOrange: {
    hex: '#F8C07C',
    rgb: [248, 192, 124],
  },
  pink: {
    hex: '#F7736E',
    rgb: [247, 115, 110],
  },
  lightPurple: {
    hex: '#B586F9',
    rgb: [181, 134, 249],
  },
  black: {
    hex: '#000000',
    rgb: [0, 0, 0],
  },
  darkGrey: {
    hex: '#333333',
    rgb: [51, 51, 51],
  },
  darkBlue: {
    hex: '#4689E3',
    rgb: [70, 137, 227],
  },
  darkGreen: {
    hex: '#428D57',
    rgb: [66, 141, 87],
  },
  darkYellow: {
    hex: '#EAC443',
    rgb: [234, 196, 67],
  },
  darkOrange: {
    hex: '#E99D3D',
    rgb: [233, 157, 61],
  },
  red: {
    hex: '#CF130C',
    rgb: [207, 19, 12],
  },
  darkPurple: {
    hex: '#843BEE',
    rgb: [132, 59, 238],
  },
};
//test image upload
const TEST_IMAGE_DATA = {
  '1': {
    width: 200,
    height: 300,
    url: 'https://picsum.photos/seed/1/200/300',
  },
  '2': {
    width: 200,
    height: 300,
    url: 'https://picsum.photos/seed/2/200/300',
  },
  '3': {
    width: 200,
    height: 300,
    url: 'https://picsum.photos/seed/3/200/300',
  },
  '4': {
    width: 200,
    height: 300,
    url: 'https://picsum.photos/seed/4/200/300',
  },
  '5': {
    width: 200,
    height: 300,
    url: 'https://picsum.photos/seed/5/200/300',
  },
  '6': {
    width: 200,
    height: 300,
    url: 'https://picsum.photos/seed/6/200/300',
  },
  '7': {
    width: 200,
    height: 300,
    url: 'https://picsum.photos/seed/7/200/300',
  },
  '8': {
    width: 200,
    height: 300,
    url: 'https://picsum.photos/seed/8/200/300',
  },
  '9': {
    width: 200,
    height: 300,
    url: 'https://picsum.photos/seed/9/200/300',
  },
  '10': {
    width: 200,
    height: 300,
    url: 'https://picsum.photos/seed/10/200/300',
  },
  '11': {
    width: 200,
    height: 300,
    url: 'https://picsum.photos/seed/11/200/300',
  },
  '12': {
    width: 200,
    height: 300,
    url: 'https://picsum.photos/seed/12/200/300',
  },
  '13': {
    width: 200,
    height: 300,
    url: 'https://picsum.photos/seed/13/200/300',
  },
  '14': {
    width: 200,
    height: 300,
    url: 'https://picsum.photos/seed/14/200/300',
  },
  '15': {
    width: 200,
    height: 300,
    url: 'https://picsum.photos/seed/15/200/300',
  },
  '16': {
    width: 200,
    height: 300,
    url: 'https://picsum.photos/seed/16/200/300',
  },
  '17': {
    width: 200,
    height: 300,
    url: 'https://picsum.photos/seed/17/200/300',
  },
};

const WhiteboardToolBox = ({whiteboardRoom}) => {
  const whiteboardFileUploadErrorToastHeadingTT = useString<'File' | 'Image'>(
    whiteboardFileUploadErrorToastHeading,
  );
  const whiteboardFileUploadInfoToastHeadingTT = useString<'File' | 'Image'>(
    whiteboardFileUploadInfoToastHeading,
  );
  const whiteboardFileUploadTypeErrorToastHeadingTT = useString(
    whiteboardFileUploadTypeErrorToastHeading,
  )();
  const whiteboardFileUploadTypeErrorToastSubHeadingTT = useString(
    whiteboardFileUploadTypeErrorToastSubHeading,
  )();

  const selectLabel = useString(whiteboardToolboxSelectText)();
  const textLabel = useString(whiteboardToolboxTextFormatting)();
  const moveLabel = useString(whiteboardToolboxMoveText)();
  const laserLabel = useString(whiteboardToolboxLaserText)();
  const eraserLabel = useString(whiteboardToolboxEraseText)();
  const uploadLabel = useString(whiteboardToolboxUploadText)();
  const clearAllLabel = useString(whiteboardToolboxClearAllText)();

  const toolWidthLabel = useString(whiteboardToolboxWidthLabel)();
  const toolPxLabel = useString(whiteboardToolboxPxLabel)();
  const [selectedTool, setSelectedTool] = useState(ApplianceNames.pencil);
  const {setShowWhiteboardClearAllPopup} = useVideoCall();
  const [roomState, setRoomState] = useState(whiteboardRoom?.current?.state);
  const [showShapes, setShowShapes] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('black');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const {
    data: {roomId},
  } = useRoomInfo();
  const {store} = useContext(StorageContext);
  const {
    setUploadRef,
    insertImageIntoWhiteboard,
    boardColor,
    getWhiteboardUid,
    clearAllCallback,
  } = useContext(whiteboardContext);
  const [isShapeBtnHovered, setShapeBtnHovered] = useState(false);
  const [isShapeContainerHovered, setShapeContainerHovered] = useState(false);
  const [isColorBtnHovered, setColorBtnHovered] = useState(false);
  const [isColorContainerHovered, setColorContainerHovered] = useState(false);
  const [isPencilBtnHovered, setPencilBtnHovered] = useState(false);
  const [isPencilContainerHovered, setPencilContainerHovered] = useState(false);
  const handleSelect = (applicanceName: ApplianceNames) => {
    if (applicanceName !== ApplianceNames.selector) {
      setCursorColor(ColorPickerValues[selectedColor].rgb);
    }
    setSelectedTool(applicanceName);
    whiteboardRoom.current?.setMemberState({
      currentApplianceName: applicanceName,
    });
  };

  useEffect(() => {
    whiteboardRoom?.current?.callbacks.on('onRoomStateChanged', modifyState => {
      setRoomState({
        ...whiteboardRoom?.current?.state,
        ...modifyState,
      });
    });
    LocalEventEmitter.on(LocalEventsEnum.CLEAR_WHITEBOARD, () => {
      whiteboardRoom.current?.cleanCurrentScene();
      setShowWhiteboardClearAllPopup(false);
      clearAllCallback();
    });
  }, []);

  useEffect(() => {
    if (boardColor === BoardColor.Black) {
      setCursorColor(ColorPickerValues['white'].rgb);
      setSelectedColor('white');
    } else {
      setCursorColor(ColorPickerValues['black'].rgb);
      setSelectedColor('black');
    }
  }, [boardColor]);

  const handleClear = () => {
    //whiteboardRoom.current?.cleanCurrentScene();
    setShowWhiteboardClearAllPopup(true);
  };

  const setCursorColor = (value: [number, number, number]) => {
    whiteboardRoom.current?.setMemberState({
      strokeColor: value,
    });
  };

  /**
   * After file upload and conversation, we will get list of image via RTM message
   * @param data
   * @param selectedFile
   */
  const fileUploadAndConvert = (data, selectedFile) => {
    if (data?.url) {
      const url = data?.url?.replaceAll('\u0026', '&');
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', selectedFile?.type);
      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: selectedFile,
      };
      fetch(url, requestOptions)
        .then(() => {
          const myHeaders2 = new Headers();
          myHeaders2.append('Content-Type', 'application/json');
          myHeaders2.append('Authorization', `Bearer ${store?.token}`);
          const body = JSON.stringify({
            resource_url: url,
            passphrase: roomId?.host,
            conversion_type: 'static',
            conversion_scale: 3,
          });
          fetch(`${$config.BACKEND_ENDPOINT}/v1/whiteboard/fileconvert`, {
            method: 'POST',
            headers: myHeaders2,
            body: body,
          })
            .then(res2 => {
              console.log('debugging file convert success', res2);
              //updating upload flag as true
              //once we got RTM message we will proceed to insert image into whiteboard
              setUploadRef();
            })
            .catch(err2 => {
              console.log('debugging file convert failed', err2);
              Toast.show({
                type: 'error',
                text1: whiteboardFileUploadErrorToastHeadingTT('File'),
                visibilityTime: 10000,
              });
            });
        })
        .catch(() => {
          Toast.show({
            type: 'error',
            text1: whiteboardFileUploadErrorToastHeadingTT('File'),
            visibilityTime: 10000,
          });
        });
    } else {
      console.log('debugging upload url is empty');
      Toast.show({
        type: 'error',
        text1: whiteboardFileUploadErrorToastHeadingTT('File'),
        visibilityTime: 10000,
      });
    }
  };

  /**
   * After image upload we need to call whiteboard/image url to for GET url for image
   * @param data
   * @param selectedFile
   */
  const imageUpload = (data, selectedFile) => {
    if (data?.url) {
      const url = data?.url?.replaceAll('\u0026', '&');
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', selectedFile?.type);
      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: selectedFile,
      };
      fetch(url, requestOptions)
        .then(() => {
          const myHeaders2 = new Headers();
          myHeaders2.append('Content-Type', 'application/json');
          myHeaders2.append('Authorization', `Bearer ${store?.token}`);
          const body = JSON.stringify({
            resource_url: url,
          });
          fetch(`${$config.BACKEND_ENDPOINT}/v1/whiteboard/image`, {
            method: 'POST',
            headers: myHeaders2,
            body: body,
          })
            .then(async res2 => {
              const jsonData = await res2.json();
              if (jsonData && jsonData?.url) {
                const imageUrl = jsonData?.url?.replaceAll('\u0026', '&');
                insertImageIntoWhiteboard(imageUrl);
              }
              console.log('debugging image upload success', res2);
            })
            .catch(err2 => {
              console.log('debugging error get image url', err2);
              Toast.show({
                type: 'error',
                text1: whiteboardFileUploadErrorToastHeadingTT('Image'),
                visibilityTime: 10000,
              });
            });
        })
        .catch(() => {
          Toast.show({
            type: 'error',
            text1: whiteboardFileUploadErrorToastHeadingTT('Image'),
            visibilityTime: 10000,
          });
        });
    } else {
      console.log('debugging image upload url is empty');
      Toast.show({
        type: 'error',
        text1: whiteboardFileUploadErrorToastHeadingTT('Image'),
        visibilityTime: 10000,
      });
    }
  };

  const onFileChange = event => {
    try {
      const selectedFile = event.target.files[0];
      if (
        supportedDocTypes.indexOf(selectedFile?.type) !== -1 ||
        supportedImageType?.indexOf(selectedFile?.type) !== -1
      ) {
        /**
         * Get URL to upload the file
         */
        fetch(`${$config.BACKEND_ENDPOINT}/v1/whiteboard/upload`, {
          method: 'GET',
          headers: {
            authorization: store?.token ? `Bearer ${store?.token}` : '',
          },
        })
          .then(async res => {
            const data = await res.json();

            if (supportedImageType?.indexOf(selectedFile?.type) !== -1) {
              Toast.show({
                type: 'info',
                text1: whiteboardFileUploadInfoToastHeadingTT('Image'),
                visibilityTime: 5000,
                primaryBtn: null,
                secondaryBtn: null,
              });
              imageUpload(data, selectedFile);
            } else {
              Toast.show({
                type: 'info',
                text1: whiteboardFileUploadInfoToastHeadingTT('File'),
                visibilityTime: 5000,
                primaryBtn: null,
                secondaryBtn: null,
              });
              fileUploadAndConvert(data, selectedFile);
            }
          })
          .catch(err => {
            console.log('debugging upload api failed', err);
            Toast.show({
              type: 'error',
              text1: whiteboardFileUploadErrorToastHeadingTT('File'),
              visibilityTime: 10000,
            });
          });
      } else {
        console.log('debugging unsupported file');
        Toast.show({
          type: 'error',
          text1: whiteboardFileUploadTypeErrorToastHeadingTT,
          text2: whiteboardFileUploadTypeErrorToastSubHeadingTT,
          visibilityTime: 10000,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: whiteboardFileUploadErrorToastHeadingTT('File'),
        visibilityTime: 10000,
      });
    }
  };

  const renderShapesMenu = () => {
    return (
      <>
        {isShapeBtnHovered || isShapeContainerHovered ? (
          <div
            onMouseEnter={() => {
              setShapeContainerHovered(true);
            }}
            onMouseLeave={() => {
              setTimeout(() => {
                setShapeContainerHovered(false);
              }, 250);
            }}>
            <View style={style.toolboxShapesContainer}>
              <View style={style.toolboxNew}>
                <IconButton
                  onPress={() => {
                    handleSelect(ApplianceNames.rectangle);
                    setShowShapes(false);
                    setShapeContainerHovered(false);
                    setShapeBtnHovered(false);
                    whiteboardRoom?.current?.setMemberState({strokeWidth: 4});
                  }}
                  hoverEffect={true}
                  hoverEffectStyle={style.itemHoverStyle}
                  containerStyle={
                    selectedTool === ApplianceNames.rectangle
                      ? style.itemSelectedStyle
                      : style.itemDefaultStyle
                  }
                  iconProps={{
                    name: 'square',
                    iconSize: 24,
                    iconType: 'plain',
                    tintColor: $config.FONT_COLOR,
                  }}
                />
                <IconButton
                  onPress={() => {
                    handleSelect(ApplianceNames.ellipse);
                    setShowShapes(false);
                    setShapeContainerHovered(false);
                    setShapeBtnHovered(false);
                    whiteboardRoom?.current?.setMemberState({strokeWidth: 4});
                  }}
                  hoverEffect={true}
                  hoverEffectStyle={style.itemHoverStyle}
                  containerStyle={
                    selectedTool === ApplianceNames.ellipse
                      ? style.itemSelectedStyle
                      : style.itemDefaultStyle
                  }
                  iconProps={{
                    name: 'circle',
                    iconSize: 24,
                    iconType: 'plain',
                    tintColor: $config.FONT_COLOR,
                  }}
                />

                <IconButton
                  onPress={() => {
                    handleSelect(ApplianceNames.straight);
                    setShowShapes(false);
                    setShapeContainerHovered(false);
                    setShapeBtnHovered(false);
                    whiteboardRoom?.current?.setMemberState({strokeWidth: 4});
                  }}
                  hoverEffect={true}
                  hoverEffectStyle={style.itemHoverStyle}
                  containerStyle={
                    selectedTool === ApplianceNames.straight
                      ? style.itemSelectedStyle
                      : style.itemDefaultStyle
                  }
                  iconProps={{
                    name: 'line',
                    iconSize: 24,
                    iconType: 'plain',
                    tintColor: $config.FONT_COLOR,
                  }}
                />

                <IconButton
                  onPress={() => {
                    handleSelect(ApplianceNames.arrow);
                    setShowShapes(false);
                    setShapeContainerHovered(false);
                    setShapeBtnHovered(false);
                    whiteboardRoom?.current?.setMemberState({strokeWidth: 4});
                  }}
                  hoverEffect={true}
                  hoverEffectStyle={style.itemHoverStyle}
                  containerStyle={
                    selectedTool === ApplianceNames.arrow
                      ? style.itemSelectedStyle
                      : style.itemDefaultStyle
                  }
                  iconProps={{
                    name: 'arrow',
                    iconSize: 24,
                    iconType: 'plain',
                    tintColor: $config.FONT_COLOR,
                  }}
                />
              </View>
            </View>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  };

  const renderColorMenu = () => {
    // if (!showColorPicker) {
    //   return null;
    // }

    if (isColorBtnHovered || isColorContainerHovered) {
      const renderItemsRow1 = [];
      const renderItemsRow2 = [];
      let count = 0;
      for (const key in ColorPickerValues) {
        if (Object.prototype.hasOwnProperty.call(ColorPickerValues, key)) {
          const element = ColorPickerValues[key];
          let iconButtonColor = (
            <IconButton
              onPress={() => {
                setCursorColor(element.rgb);
                setSelectedColor(key);
                setShowColorPicker(false);
                setColorBtnHovered(false);
                setColorContainerHovered(false);
              }}
              hoverEffect={selectedColor === key ? false : true}
              hoverEffectStyle={{
                backgroundColor: $config.CARD_LAYER_4_COLOR,
                borderRadius: 50,
              }}
              containerStyle={
                selectedColor === key
                  ? style.colorSelectedStyle
                  : style.itemDefaultStyleColor
              }
              iconProps={
                selectedColor === key
                  ? {
                      name: 'gradient',
                      iconSize: 12,
                      iconType: 'plain',
                      tintColor: element.hex,
                    }
                  : {
                      name: 'gradient',
                      iconSize: 16,
                      iconType: 'plain',
                      tintColor: element.hex,
                    }
              }
            />
          );
          iconButtonColor =
            selectedColor === key ? (
              <View
                style={{
                  borderRadius: 50,
                  backgroundColor: element.hex,
                  padding: 2,
                  justifyContent: 'center',
                  marginRight: 8,
                }}>
                {iconButtonColor}
              </View>
            ) : (
              <View
                style={{
                  paddingRight: 8,
                }}>
                {iconButtonColor}
              </View>
            );
          if (count >= 0 && count <= 7) renderItemsRow1.push(iconButtonColor);
          if (count >= 8 && count <= 15) renderItemsRow2.push(iconButtonColor);

          count = count + 1;
        }
      }
      return (
        <div
          onMouseEnter={() => {
            setColorContainerHovered(true);
          }}
          onMouseLeave={() => {
            setTimeout(() => {
              setColorContainerHovered(false);
            }, 250);
          }}>
          <View style={style.toolboxColorsContainer}>
            <View style={style.toolboxNewColor}>
              <View style={[style.toolboxRow, {paddingBottom: 8}]}>
                {renderItemsRow1}
              </View>
              <View style={[style.toolboxRow]}>{renderItemsRow2}</View>
            </View>
          </View>
        </div>
      );
    }
    return null;
  };

  const testImageUpload = () => {
    setUploadRef();
    LocalEventEmitter.emit(
      LocalEventsEnum.WHITEBOARD_FILE_UPLOAD,
      TEST_IMAGE_DATA,
    );
  };

  const renderPencilSize = () => {
    if (isPencilBtnHovered || isPencilContainerHovered) {
      return (
        <div
          onMouseEnter={() => {
            setPencilContainerHovered(true);
          }}
          onMouseLeave={() => {
            setTimeout(() => {
              setPencilContainerHovered(false);
            }, 250);
          }}>
          <View style={style.toolboxPencilContainer}>
            <View style={style.toolboxPencilColor}>
              <StrokeWidthTool
                widthLabel={toolWidthLabel}
                pxLabel={toolPxLabel}
                room={whiteboardRoom?.current}
                roomState={roomState}
                setPrevValue={value => {
                  handleSelect(ApplianceNames.pencil);
                  setStrokeWidth(value);
                }}
              />
            </View>
          </View>
        </div>
      );
    }
  };

  const {activeUids} = useContent();

  if (activeUids && activeUids[0] !== getWhiteboardUid()) {
    return null;
  }

  return (
    <>
      {renderPencilSize()}
      {renderShapesMenu()}
      {renderColorMenu()}
      <View
        style={
          isMobileUA() ? style.toolboxContainerMobile : style.toolboxContainer
        }>
        <View style={style.toolboxNew} nativeID="toolbox">
          <IconButton
            toolTipMessage={selectLabel}
            placement={'right'}
            showTooltipArrow={false}
            onPress={() => {
              const arr = hexToRgb($config.PRIMARY_ACTION_BRAND_COLOR);
              if (arr && arr?.length) {
                setCursorColor(arr);
              }
              handleSelect(ApplianceNames.selector);
            }}
            hoverEffect={
              selectedTool === ApplianceNames.selector ? false : true
            }
            hoverEffectStyle={style.itemHoverStyle}
            containerStyle={
              selectedTool === ApplianceNames.selector
                ? style.itemSelectedStyle
                : style.itemDefaultStyle
            }
            iconProps={{
              name: 'selector',
              iconSize: 24,
              iconType: 'plain',
              tintColor: $config.FONT_COLOR,
            }}
          />
          <IconButton
            toolTipMessage={textLabel}
            placement={'right'}
            showTooltipArrow={false}
            onPress={() => {
              handleSelect(ApplianceNames.text);
            }}
            hoverEffect={selectedTool === ApplianceNames.text ? false : true}
            hoverEffectStyle={style.itemHoverStyle}
            containerStyle={
              selectedTool === ApplianceNames.text
                ? style.itemSelectedStyle
                : style.itemDefaultStyle
            }
            iconProps={{
              name: 'text',
              iconSize: 24,
              iconType: 'plain',
              tintColor: $config.FONT_COLOR,
            }}
          />
          <div
            onMouseEnter={() => {
              setPencilBtnHovered(true);
            }}
            onMouseLeave={() => {
              setTimeout(() => {
                setPencilBtnHovered(false);
              }, 250);
            }}>
            <IconButton
              // toolTipMessage="Pencil"
              // placement={'right'}
              // showTooltipArrow={false}
              onHoverCallBack={isHovered => {
                if (isHovered) {
                  whiteboardRoom?.current?.setMemberState({
                    strokeWidth: strokeWidth,
                  });
                }
              }}
              onPress={() => {
                handleSelect(ApplianceNames.pencil);
              }}
              hoverEffect={
                selectedTool === ApplianceNames.pencil ? false : true
              }
              hoverEffectStyle={style.itemHoverStyle}
              containerStyle={
                selectedTool === ApplianceNames.pencil
                  ? style.itemSelectedStyle
                  : style.itemDefaultStyle
              }
              iconProps={{
                name: 'pen',
                iconSize: 24,
                iconType: 'plain',
                tintColor: $config.FONT_COLOR,
              }}
            />
          </div>
          <div
            onMouseEnter={() => {
              setShapeBtnHovered(true);
            }}
            onMouseLeave={() => {
              setTimeout(() => {
                setShapeBtnHovered(false);
              }, 250);
            }}>
            <IconButton
              //toolTipMessage={showShapes ? '' : 'Shapes'}
              //placement={'right'}
              //showTooltipArrow={false}
              onPress={() => {
                // //open submenu
                // setShowColorPicker(false);
                // setShowShapes(!showShapes);
              }}
              hoverEffect={true}
              hoverEffectStyle={style.itemHoverStyle}
              containerStyle={
                selectedTool === ApplianceNames.rectangle ||
                selectedTool === ApplianceNames.arrow ||
                selectedTool === ApplianceNames.ellipse ||
                selectedTool === ApplianceNames.straight
                  ? style.itemSelectedStyle
                  : style.itemDefaultStyle
              }
              iconProps={{
                name: 'shapes',
                iconSize: 24,
                iconType: 'plain',
                tintColor: $config.FONT_COLOR,
              }}
            />
          </div>
          <div
            onMouseEnter={() => {
              setColorBtnHovered(true);
            }}
            onMouseLeave={() => {
              setTimeout(() => {
                setColorBtnHovered(false);
              }, 250);
            }}>
            <IconButton
              //toolTipMessage={showColorPicker ? '' : 'Colors'}
              placement={'right'}
              showTooltipArrow={false}
              onPress={() => {
                //opensubmenu
                // setShowShapes(false);
                // setShowColorPicker(!showColorPicker);
              }}
              hoverEffect={true}
              hoverEffectStyle={style.itemHoverStyle}
              containerStyle={style.itemDefaultStyle}
              iconProps={{
                //name: 'gradient',
                name: 'color-picker',
                iconSize: 24,
                iconType: 'plain',
                tintColor: $config.FONT_COLOR,
                //tintColor: ColorPickerValues[selectedColor]?.hex,
              }}
            />
          </div>
          <IconButton
            toolTipMessage={moveLabel}
            placement={'right'}
            showTooltipArrow={false}
            onPress={() => {
              handleSelect(ApplianceNames.hand);
            }}
            hoverEffect={selectedTool === ApplianceNames.hand ? false : true}
            hoverEffectStyle={style.itemHoverStyle}
            containerStyle={
              selectedTool === ApplianceNames.hand
                ? style.itemSelectedStyle
                : style.itemDefaultStyle
            }
            iconProps={{
              name: 'move',
              iconSize: 24,
              iconType: 'plain',
              tintColor: $config.FONT_COLOR,
            }}
          />
          <IconButton
            toolTipMessage={laserLabel}
            placement={'right'}
            showTooltipArrow={false}
            onPress={() => {
              handleSelect(ApplianceNames.laserPointer);
            }}
            hoverEffect={
              selectedTool === ApplianceNames.laserPointer ? false : true
            }
            hoverEffectStyle={style.itemHoverStyle}
            containerStyle={
              selectedTool === ApplianceNames.laserPointer
                ? style.itemSelectedStyle
                : style.itemDefaultStyle
            }
            iconProps={{
              name: 'highlight',
              iconSize: 24,
              iconType: 'plain',
              tintColor: $config.FONT_COLOR,
            }}
          />
          {/* <IconButton
            toolTipMessage="Pencil Eraser"
            placement={'right'}
            showTooltipArrow={false}
            onPress={() => {
              handleSelect(ApplianceNames.pencilEraser);
            }}
            hoverEffect={true}
            hoverEffectStyle={style.itemHoverStyle}
            containerStyle={
              selectedTool === ApplianceNames.pencilEraser
                ? style.itemSelectedStyle
                : style.itemDefaultStyle
            }
            iconProps={{
              name: 'erasor',
              iconSize: 24,
              iconType: 'plain',
              tintColor: $config.FONT_COLOR,
            }}
          /> */}
          <IconButton
            toolTipMessage={eraserLabel}
            placement={'right'}
            showTooltipArrow={false}
            onPress={() => {
              handleSelect(ApplianceNames.eraser);
            }}
            hoverEffect={selectedTool === ApplianceNames.eraser ? false : true}
            hoverEffectStyle={style.itemHoverStyle}
            containerStyle={
              selectedTool === ApplianceNames.eraser
                ? style.itemSelectedStyle
                : style.itemDefaultStyle
            }
            iconProps={{
              name: 'erasor',
              iconSize: 24,
              iconType: 'plain',
              tintColor: $config.FONT_COLOR,
            }}
          />

          {$config.ENABLE_WHITEBOARD_FILE_UPLOAD && isWeb() ? (
            <>
              <input
                type="file"
                id="docpicker"
                accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf,image/png,image/jpeg"
                hidden
                onInput={onFileChange}
              />
              <IconButton
                onPress={() => {
                  try {
                    //to clear prev selected file
                    //@ts-ignore
                    document.getElementById('docpicker').value = null;
                  } catch (error) {
                    console.log('debugging error on setting null');
                  }
                  document.getElementById('docpicker').click();
                }}
                toolTipMessage={uploadLabel}
                placement={'right'}
                showTooltipArrow={false}
                hoverEffect={true}
                hoverEffectStyle={style.itemHoverStyle}
                containerStyle={style.itemDefaultStyle}
                iconProps={{
                  name: 'upload-new',
                  iconSize: 24,
                  iconType: 'plain',
                  tintColor: $config.FONT_COLOR,
                }}
              />
            </>
          ) : (
            <></>
          )}
          <IconButton
            toolTipMessage={clearAllLabel}
            placement={'right'}
            showTooltipArrow={false}
            onPress={() => {
              handleClear();
            }}
            hoverEffect={true}
            hoverEffectStyle={style.itemHoverStyle}
            containerStyle={style.itemDefaultStyle}
            iconProps={{
              name: 'clear-all',
              iconSize: 24,
              iconType: 'plain',
              tintColor: $config.FONT_COLOR,
            }}
          />
          {/* <IconButton
            onPress={() => {
              testImageUpload();
            }}
            toolTipMessage="Test upload"
            placement={'right'}
            showTooltipArrow={false}
            hoverEffect={true}
            hoverEffectStyle={style.itemHoverStyle}
            containerStyle={style.itemDefaultStyle}
            iconProps={{
              name: 'upload-new',
              iconSize: 24,
              iconType: 'plain',
              tintColor: $config.FONT_COLOR,
            }}
          /> */}
        </View>
      </View>
    </>
  );
};

const style = StyleSheet.create({
  itemSelectedStyle: {
    backgroundColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    padding: 4,
    borderRadius: 4,
  },

  itemDefaultStyle: {
    padding: 4,
    borderRadius: 4,
  },
  itemHoverStyle: {
    backgroundColor: $config.CARD_LAYER_4_COLOR,
    borderRadius: 4,
  },
  toolboxContainer: {
    position: 'absolute',
    top: '25%',
    left: 12,
    zIndex: 10,
  },
  toolboxShapesContainer: {
    position: 'absolute',
    top: '35%',
    left: 58,
    zIndex: 10,
  },
  toolboxColorsContainer: {
    position: 'absolute',
    top: '42%',
    left: 58,
    zIndex: 10,
  },
  colorSelectedStyle: {
    padding: 2,
    backgroundColor: $config.CARD_LAYER_2_COLOR,
    borderRadius: 50,
  },
  itemDefaultStyleColor: {
    padding: 2,
    borderRadius: 4,
  },
  toolboxPencilContainer: {
    position: 'absolute',
    top: '33%',
    left: 58,
    zIndex: 10,
  },
  toolboxContainerMobile: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  toolbox: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 'auto',
    padding: 5,
    height: 320,
    width: 80,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5.22,
    elevation: 10,
    zIndex: 10,
  },
  toolboxNew: {
    backgroundColor: $config.CARD_LAYER_2_COLOR,
    borderRadius: 4,
    marginRight: 'auto',
    padding: 4,
    height: 'auto',
    width: 40,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    elevation: 10,
    zIndex: 10,
  },
  toolboxNewColor: {
    backgroundColor: $config.CARD_LAYER_2_COLOR,
    borderRadius: 4,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 0,
    height: 'auto',
    width: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    zIndex: 10,
  },
  toolboxPencilColor: {
    backgroundColor: $config.CARD_LAYER_2_COLOR,
    borderRadius: 4,
    padding: 8,
    height: 'auto',
    maxWidth: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    elevation: 10,
    zIndex: 10,
  },
  toolboxRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  toolActive: {
    height: 30,
    width: 30,
    borderRadius: 20,
    padding: 3,
    borderColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    borderWidth: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tool: {
    height: 30,
    width: 30,
    borderRadius: 20,
    padding: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolIconActive: {
    height: 24,
    width: 24,
    borderRadius: 20,
    padding: 3,
    borderColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    borderWidth: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolIcon: {
    height: 24,
    width: 24,
    borderRadius: 20,
    padding: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WhiteboardToolBox;
