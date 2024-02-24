import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';
import {isAndroid} from '../../utils/common';
import React from 'react';
import {View} from 'react-native';
import {PinchableView} from './PinchableView';

const ZoomableWrapper = (props) => {
  if (!props?.enableZoom) {
    return <>{props.children}</>;
  }

  if (isAndroid()) {
    return (
      <View
        style={{
          flexShrink: 1,
          height: '100%',
          width: '100%',
        }}>
        <ReactNativeZoomableView
          maxZoom={30}
          zoomStep={1}
          initialZoom={1}
          style={{
            flex: 1,
          }}>
          {props.children}
        </ReactNativeZoomableView>
      </View>
    );
  }
  return <PinchableView>{props.children}</PinchableView>;
};
export default ZoomableWrapper;
