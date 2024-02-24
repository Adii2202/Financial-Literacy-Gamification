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

import React, {useContext, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {Room, RoomState} from 'white-web-sdk';
import {
  IconButton,
  useContent,
  useLayout,
  useRoomInfo,
} from 'customization-api';
import {whiteboardContext, BoardColor} from './WhiteboardConfigure';
import events, {PersistanceLevel} from '../../rtm-events-api';
import {EventNames} from '../../rtm-events';
import {isMobileUA, isWebInternal, randomString} from '../../utils/common';
import Toast from '../../../react-native-toast-message';
import ThemeConfig from '../../theme';
import {DefaultLayouts} from '../../pages/video-call/DefaultLayouts';
import ImageIcon from '../../atoms/ImageIcon';
import StorageContext from '../StorageContext';
import Clipboard from '../../subComponents/Clipboard';
import {useString} from '../../utils/useString';
import {
  whiteboardExportErrorToastHeading,
  whiteboardExportInfoToastHeading,
  whiteboardExportSuccessToastHeading,
  whiteboardWidgetExportToCloudText,
  whiteboardWidgetFitToScreenText,
  whiteboardWidgetRedoText,
  whiteboardWidgetUndoText,
  whiteboardWidgetViewOnlyText,
  whiteboardWidgetZoomInText,
  whiteboardWidgetZoomOutText,
} from '../../language/default-labels/videoCallScreenLabels';

const Seperator = () => {
  return (
    <View
      style={{
        marginHorizontal: 4,
        width: 2,
        height: 24,
        backgroundColor: $config.CARD_LAYER_4_COLOR,
      }}
    />
  );
};

const WhiteboardWidget = ({whiteboardRoom}) => {
  const viewonlylabel = useString(whiteboardWidgetViewOnlyText)();
  const zoominlabel = useString(whiteboardWidgetZoomInText)();
  const zoomoutlabel = useString(whiteboardWidgetZoomOutText)();
  const fittoscreenlabel = useString(whiteboardWidgetFitToScreenText)();
  const redolabel = useString(whiteboardWidgetRedoText)();
  const undolabel = useString(whiteboardWidgetUndoText)();
  const exportlabel = useString(whiteboardWidgetExportToCloudText)();
  const exportError = useString(whiteboardExportErrorToastHeading)();
  const exportInfo = useString(whiteboardExportInfoToastHeading)();
  const exportsuccess = useString(whiteboardExportSuccessToastHeading)();

  const [isInProgress, setIsInProgress] = useState(false);
  const {setBoardColor, boardColor, getWhiteboardUid} =
    useContext(whiteboardContext);
  const {
    data: {whiteboard: {room_uuid} = {}},
  } = useRoomInfo();
  const {store} = useContext(StorageContext);

  const {activeUids, pinnedUid} = useContent();
  const {currentLayout} = useLayout();

  if (
    !(
      currentLayout === DefaultLayouts[1].name &&
      activeUids &&
      activeUids?.length &&
      (activeUids[0] === getWhiteboardUid() || pinnedUid === getWhiteboardUid())
    )
  ) {
    return null;
  }

  const showWhiteboardError = () => {
    setIsInProgress(false);
    Toast.show({
      leadingIconName: 'alert',
      type: 'error',
      text1: exportError,
      visibilityTime: 3000,
      primaryBtn: null,
      secondaryBtn: null,
    });
  };

  const exportWhiteboard = () => {
    try {
      setIsInProgress(true);
      Toast.show({
        leadingIconName: 'info',
        type: 'info',
        text1: exportInfo,
        visibilityTime: 3000,
        primaryBtn: null,
        secondaryBtn: null,
      });
      const myHeaders2 = new Headers();
      myHeaders2.append('Content-Type', 'application/json');
      myHeaders2.append('Authorization', `Bearer ${store?.token}`);
      const body = JSON.stringify({
        room_uuid: room_uuid,
        path: '/init',
        width: 3840,
        height: 2160,
      });
      fetch(`${$config.BACKEND_ENDPOINT}/v1/whiteboard/screenshot`, {
        method: 'POST',
        headers: myHeaders2,
        body: body,
      })
        .then(async res2 => {
          const data = await res2.json();
          const parsedUrl = data?.url?.replaceAll('\u0026', '&');
          if (parsedUrl) {
            Toast.show({
              leadingIconName: 'tick-fill',
              type: 'success',
              text1: exportsuccess,
              visibilityTime: 3000,
              primaryBtn: null,
              secondaryBtn: null,
            });
            Clipboard.setString(parsedUrl);
            setTimeout(() => {
              window.open(parsedUrl, '_blank');
            });
            setIsInProgress(false);
          } else {
            showWhiteboardError();
          }
        })
        .catch(() => {
          showWhiteboardError();
        });
    } catch (error) {
      showWhiteboardError();
    }

    /* local download file
    try {
      var srcCanvas = document.querySelector(
        '#whiteboard-div-ref > div > div > canvas:nth-child(2)',
      );
      var destinationCanvas = document.createElement('canvas');
      //@ts-ignore
      destinationCanvas.width = srcCanvas.width;
      //@ts-ignore
      destinationCanvas.height = srcCanvas.height;

      var destCtx = destinationCanvas.getContext('2d');

      //create a rectangle with the desired color
      destCtx.fillStyle =
        boardColor === BoardColor.Black ? '#000000' : '#FFFFFF';
      //@ts-ignore
      destCtx.fillRect(0, 0, srcCanvas.width, srcCanvas.height);

      //draw the original canvas onto the destination canvas
      //@ts-ignore
      destCtx.drawImage(srcCanvas, 0, 0);

      //finally use the destinationCanvas.toDataURL() method to get the desired output;
      var link = document.createElement('a');
      link.download = 'whiteboard_' + randomString() + '.png';
      link.href = destinationCanvas.toDataURL();
      link.click();
    } catch (error) {
      Toast.show({
        leadingIconName: 'alert',
        type: 'error',
        text1: 'Sorry, Failed to export the whiteboard',
        visibilityTime: 3000,
      });
      console.log('debugging error on export whiteboard', error);
    }
    */
  };

  return (
    <>
      <View style={style.toolboxContainer}>
        <View style={style.toolboxNew} nativeID="toolbox">
          {!whiteboardRoom.current?.isWritable ? (
            <View style={style.viewOnlyContainerStyle}>
              <ImageIcon
                name="view-only"
                iconSize={24}
                iconType="plain"
                tintColor={$config.CARD_LAYER_5_COLOR}
              />
              <Text style={style.viewOnlyTextStyle}>{viewonlylabel}</Text>
            </View>
          ) : (
            <></>
          )}
          {isWebInternal() && !isMobileUA() ? (
            <View style={style.widgetContainer}>
              {whiteboardRoom.current?.isWritable ? (
                <>
                  {/** <IconButton
                  toolTipMessage={
                    boardColor === BoardColor.Black
                      ? 'Whiteboard'
                      : 'Blackboard'
                  }
                  placement={'bottom'}
                  showTooltipArrow={false}
                  onPress={() => {
                    const color =
                      boardColor === BoardColor.Black
                        ? BoardColor.White
                        : BoardColor.Black;
                    setBoardColor(color);
                    events.send(
                      EventNames.BOARD_COLOR_CHANGED,
                      JSON.stringify({boardColor: color}),
                      PersistanceLevel.Session,
                    );
                  }}
                  hoverEffect={true}
                  hoverEffectStyle={style.itemHoverStyle}
                  containerStyle={style.itemDefaultStyle}
                  iconProps={{
                    name: boardColor === BoardColor.Black ? 'light' : 'dark',
                    iconSize: 24,
                    iconType: 'plain',
                    tintColor: $config.FONT_COLOR,
                  }}
                />
                <Seperator /> */}
                  <RedoUndo
                    room={whiteboardRoom.current}
                    undoLabel={undolabel}
                    redoLabel={redolabel}
                  />
                  <Seperator />
                </>
              ) : (
                <></>
              )}
              <ScaleController
                room={whiteboardRoom.current}
                zoomInLabel={zoominlabel}
                zoomOutLabel={zoomoutlabel}
                fitToScreenLabel={fittoscreenlabel}
              />
              {whiteboardRoom.current?.isWritable &&
              $config.ENABLE_WHITEBOARD_FILE_UPLOAD ? (
                <>
                  <Seperator />
                  <TouchableOpacity
                    disabled={isInProgress}
                    style={[
                      style.btnContainerStyle,
                      isInProgress ? {opacity: 0.6} : {},
                    ]}
                    onPress={exportWhiteboard}>
                    <Text style={style.btnTextStyle}>{exportlabel}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <></>
              )}
            </View>
          ) : (
            <></>
          )}
        </View>
      </View>
    </>
  );
};

export type ScaleControllerState = {
  scaleAnimation: boolean;
  reverseState: boolean;
  isMouseOn: boolean;
  roomState: RoomState;
};

export type ScaleControllerProps = {
  room: Room;
  zoomInLabel: string;
  zoomOutLabel: string;
  fitToScreenLabel: string;
};

class ScaleController extends React.Component<
  ScaleControllerProps,
  ScaleControllerState
> {
  private static readonly syncDuration: number = 200;
  private static readonly dividingRule: ReadonlyArray<number> = Object.freeze([
    0.10737418240000011, 0.13421772800000012, 0.16777216000000014,
    0.20971520000000016, 0.26214400000000015, 0.3276800000000002,
    0.4096000000000002, 0.5120000000000001, 0.6400000000000001, 0.8, 1, 1.26,
    1.5876000000000001, 2.000376, 2.5204737600000002, 3.1757969376000004,
    4.001504141376, 5.041895218133761, 6.352787974848539, 8.00451284830916, 10,
  ]);

  private tempRuleIndex?: number;
  private syncRuleIndexTimer: any = null;

  public constructor(props: ScaleControllerProps) {
    super(props);
    this.state = {
      scaleAnimation: true,
      reverseState: false,
      isMouseOn: false,
      roomState: props.room.state,
    };
    this.arrowControllerHotKey = this.arrowControllerHotKey.bind(this);
  }

  private delaySyncRuleIndex(): void {
    if (this.syncRuleIndexTimer !== null) {
      clearTimeout(this.syncRuleIndexTimer);
      this.syncRuleIndexTimer = null;
    }
    this.syncRuleIndexTimer = setTimeout(() => {
      this.syncRuleIndexTimer = null;
      this.tempRuleIndex = undefined;
    }, ScaleController.syncDuration);
  }

  private static readRuleIndexByScale(scale: number): number {
    const {dividingRule} = ScaleController;

    if (scale < dividingRule[0]) {
      return 0;
    }
    for (let i = 0; i < dividingRule.length; ++i) {
      const prePoint = dividingRule[i - 1];
      const point = dividingRule[i];
      const nextPoint = dividingRule[i + 1];

      const begin =
        prePoint === undefined
          ? Number.MIN_SAFE_INTEGER
          : (prePoint + point) / 2;
      const end =
        nextPoint === undefined
          ? Number.MAX_SAFE_INTEGER
          : (nextPoint + point) / 2;

      if (scale >= begin && scale <= end) {
        return i;
      }
    }
    return dividingRule.length - 1;
  }

  private zoomChange = (scale: number): void => {
    const {room} = this.props;
    room.moveCamera({
      centerX: 0,
      centerY: 0,
      scale: scale,
    });
  };
  private arrowControllerHotKey(evt: KeyboardEvent): void {
    if (evt.key === '=' && evt.ctrlKey) {
      this.moveRuleIndex(+1);
    } else if (evt.key === '-' && evt.ctrlKey) {
      this.moveRuleIndex(-1);
    }
  }

  public componentDidMount(): void {
    const {room} = this.props;
    if (room.isWritable) {
      room.disableSerialization = false;
    }
    room.callbacks.on('onRoomStateChanged', this.onRoomStateChanged);
    document.body.addEventListener('keydown', this.arrowControllerHotKey);
  }

  private onRoomStateChanged = (modifyState: Partial<RoomState>): void => {
    const {room} = this.props;
    this.setState({roomState: {...room.state, ...modifyState}});
  };

  public componentWillUnmount(): void {
    const {room} = this.props;
    room.callbacks.off('onRoomStateChanged', this.onRoomStateChanged);
    document.body.removeEventListener('keydown', this.arrowControllerHotKey);
  }

  private moveRuleIndex(deltaIndex: number): void {
    if (this.tempRuleIndex === undefined) {
      this.tempRuleIndex = ScaleController.readRuleIndexByScale(
        this.state.roomState.cameraState.scale,
      );
    }
    this.tempRuleIndex += deltaIndex;

    if (this.tempRuleIndex > ScaleController.dividingRule.length - 1) {
      this.tempRuleIndex = ScaleController.dividingRule.length - 1;
    } else if (this.tempRuleIndex < 0) {
      this.tempRuleIndex = 0;
    }
    const targetScale = ScaleController.dividingRule[this.tempRuleIndex];

    this.delaySyncRuleIndex();
    this.zoomChange(targetScale);
  }

  public render(): React.ReactNode {
    return (
      <>
        <IconButton
          toolTipMessage={this.props.fitToScreenLabel}
          placement={'bottom'}
          showTooltipArrow={false}
          onPress={() => {
            //open submenu
            this.zoomChange(1);
          }}
          hoverEffect={true}
          hoverEffectStyle={style.itemHoverStyle}
          containerStyle={style.itemDefaultStyle}
          iconProps={{
            name: 'fit-to-screen',
            iconSize: 24,
            iconType: 'plain',
            tintColor: $config.FONT_COLOR,
          }}
        />
        <Seperator />
        <IconButton
          toolTipMessage={this.props.zoomOutLabel}
          placement={'bottom'}
          showTooltipArrow={false}
          onPress={() => {
            this.moveRuleIndex(-1);
          }}
          hoverEffect={true}
          hoverEffectStyle={style.itemHoverStyle}
          containerStyle={style.itemDefaultStyle}
          iconProps={{
            name: 'zoom-out',
            iconSize: 24,
            iconType: 'plain',
            tintColor: $config.FONT_COLOR,
          }}
        />

        <IconButton
          toolTipMessage={this.props.zoomInLabel}
          placement={'bottom'}
          showTooltipArrow={false}
          onPress={() => {
            //open submenu
            this.moveRuleIndex(+1);
          }}
          hoverEffect={true}
          hoverEffectStyle={style.itemHoverStyle}
          containerStyle={style.itemDefaultStyle}
          iconProps={{
            name: 'zoom-in',
            iconSize: 24,
            iconType: 'plain',
            tintColor: $config.FONT_COLOR,
          }}
        />
      </>
    );
  }
}

export type RedoUndoProps = {
  room: Room;
  undoLabel: string;
  redoLabel: string;
};
export type RedoUndoStates = {
  undoSteps: number;
  redoSteps: number;
};
class RedoUndo extends React.Component<RedoUndoProps, RedoUndoStates> {
  public constructor(props: RedoUndoProps) {
    super(props);
    this.state = {
      undoSteps: 0,
      redoSteps: 0,
    };
  }
  public componentDidMount(): void {
    const {room} = this.props;
    if (room.isWritable) {
      room.disableSerialization = false;
    }
    room.callbacks.on('onCanUndoStepsUpdate', this.setUndoSteps);
    room.callbacks.on('onCanRedoStepsUpdate', this.setRedoSteps);
  }

  public componentWillUnmount(): void {
    const {room} = this.props;
    room.callbacks.off('onCanUndoStepsUpdate', this.setUndoSteps);
    room.callbacks.off('onCanRedoStepsUpdate', this.setRedoSteps);
  }

  private setUndoSteps = (steps: number): void => {
    this.setState({
      undoSteps: steps,
    });
  };

  private setRedoSteps = (steps: number): void => {
    this.setState({
      redoSteps: steps,
    });
  };

  private handleUndo = (): void => {
    const {room} = this.props;
    room.undo();
  };

  private handleRedo = (): void => {
    const {room} = this.props;
    room.redo();
  };

  public render(): React.ReactNode {
    const {redoSteps, undoSteps} = this.state;
    const undoDisabled = undoSteps === 0 ? true : false;
    const redoDisabled = redoSteps === 0 ? true : false;
    return (
      <>
        <IconButton
          disabled={undoDisabled}
          toolTipMessage={this.props.undoLabel}
          placement={'bottom'}
          showTooltipArrow={false}
          onPress={this.handleUndo}
          hoverEffect={true}
          hoverEffectStyle={style.itemHoverStyle}
          containerStyle={
            undoDisabled
              ? style.itemDefaultStyleDisabled
              : style.itemDefaultStyle
          }
          iconProps={{
            name: 'undo',
            iconSize: 24,
            iconType: 'plain',
            tintColor: $config.FONT_COLOR,
          }}
        />
        <IconButton
          disabled={redoDisabled}
          toolTipMessage={this.props.redoLabel}
          placement={'bottom'}
          showTooltipArrow={false}
          onPress={this.handleRedo}
          hoverEffect={true}
          hoverEffectStyle={style.itemHoverStyle}
          containerStyle={
            redoDisabled
              ? style.itemDefaultStyleDisabled
              : style.itemDefaultStyle
          }
          iconProps={{
            name: 'redo',
            iconSize: 24,
            iconType: 'plain',
            tintColor: $config.FONT_COLOR,
          }}
        />
      </>
    );
  }
}

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
  itemDefaultStyleDisabled: {
    padding: 4,
    borderRadius: 4,
    opacity: 0.6,
  },
  itemHoverStyle: {
    backgroundColor: $config.CARD_LAYER_4_COLOR,
    borderRadius: 4,
  },
  toolboxContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  toolboxNew: {
    marginRight: 'auto',
    height: 40,
    width: 'auto',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 10,
    zIndex: 10,
  },
  btnContainerStyle: {
    borderRadius: 4,
    backgroundColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 4,
  },
  btnTextStyle: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    fontSize: 14,
    color: $config.FONT_COLOR,
  },
  viewOnlyTextStyle: {
    marginLeft: 4,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 22,
    color: $config.CARD_LAYER_5_COLOR,
  },
  viewOnlyContainerStyle: {
    backgroundColor: $config.CARD_LAYER_3_COLOR,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 4,
  },
  widgetContainer: {
    borderRadius: 4,
    backgroundColor: $config.CARD_LAYER_3_COLOR,
    marginLeft: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    height: 40,
    width: 'auto',
    display: 'flex',
    alignItems: 'center',
    elevation: 10,
    zIndex: 10,
  },
});

export default WhiteboardWidget;
