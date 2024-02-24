import * as React from 'react';
//import './StrokeWidthTool.less';
import {Color, Room, RoomState} from 'white-web-sdk';
import {View, Text} from 'react-native';
import ThemeConfig from '../../theme';
import hexadecimalTransparency from '../../utils/hexadecimalTransparency';
//import mask from './image/mask.svg';

export type StrokeWidthToolProps = {
  room: Room;
  roomState: RoomState;
  setPrevValue: any;
  widthLabel: string;
  pxLabel: string;
};

export type StrokeWidthToolStates = {
  percentage: number;
};

const css2 = `
.range-slider{
  -webkit-appearance: none;
  background: ${$config.CARD_LAYER_1_COLOR};
  outline: none;
  border-radius: 15px;
  overflow: hidden;  
}
.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${$config.CARD_LAYER_4_COLOR};
  cursor: pointer;
  border: 4px solid ${$config.FONT_COLOR};
  box-shadow: -407px 0 0 400px ${$config.CARD_LAYER_4_COLOR};
}
.range-slider::-moz-range-thumb {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${$config.CARD_LAYER_4_COLOR};
  cursor: pointer;
  border: 4px solid ${$config.FONT_COLOR};
  box-shadow: -407px 0 0 400px ${$config.CARD_LAYER_4_COLOR};
}

`;

export default class StrokeWidthTool extends React.PureComponent<
  StrokeWidthToolProps,
  StrokeWidthToolStates
> {
  public constructor(props: StrokeWidthToolProps) {
    super(props);
    this.state = {
      percentage: props.room.state.memberState.strokeWidth / 32,
    };
  }

  private rgbToHex = (rgb: Color): string => {
    return (
      '#' +
      this.componentToHex(rgb[0]) +
      this.componentToHex(rgb[1]) +
      this.componentToHex(rgb[2])
    );
  };

  private setStrokeWidth = (event: any): void => {
    const {room, setPrevValue} = this.props;
    const percentage = event.target.value / 32;
    const strokeWidth = parseInt(event.target.value);
    this.setState({percentage: percentage});
    room.setMemberState({strokeWidth: strokeWidth});
    setPrevValue(strokeWidth);
  };

  private componentToHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  };

  public render(): React.ReactNode {
    const {room, roomState, setPrevValue} = this.props;
    const strokeColor = room.state.memberState.strokeColor;

    return (
      <>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 12,
          }}>
          <Text
            style={{
              color: $config.FONT_COLOR + hexadecimalTransparency['40%'],
              fontFamily: ThemeConfig.FontFamily.sansPro,
              fontSize: 14,
              fontWeight: '600',
            }}>
            {this.props.widthLabel}
          </Text>
          <Text
            style={{
              color: $config.FONT_COLOR + hexadecimalTransparency['40%'],
              fontFamily: ThemeConfig.FontFamily.sansPro,
              fontSize: 14,
              fontWeight: '600',
            }}>
            {roomState.memberState.strokeWidth}
            {this.props.pxLabel}
          </Text>
        </View>
        <style type="text/css">{css2}</style>
        <input
          className="range-slider"
          type="range"
          min={1}
          max={32}
          onChange={this.setStrokeWidth}
          defaultValue={roomState.memberState.strokeWidth}
          value={roomState.memberState.strokeWidth}
          onMouseUp={() => {
            room.setMemberState({
              strokeWidth: roomState.memberState.strokeWidth,
            });
            setPrevValue(roomState.memberState.strokeWidth);
          }}
        />
      </>
    );
  }
}
