import React, {createRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';
const USE_NATIVE_DRIVER = false;
//nesting touch handler with native animated driver is not supported yet.
export class PinchableView extends React.Component {
  _pinchRef = createRef();
  _panRef = createRef();

  //pan
  _translateX = new Animated.Value(0);
  _translateY = new Animated.Value(0);
  _lastOffset = {x: 0, y: 0};
  _onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: this._translateX,
          translationY: this._translateY,
        },
      },
    ],
    {useNativeDriver: USE_NATIVE_DRIVER},
  );
  _onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastOffset.x += event.nativeEvent.translationX;
      this._lastOffset.y += event.nativeEvent.translationY;
      this._translateX.setOffset(this._lastOffset.x);
      this._translateX.setValue(0);
      this._translateY.setOffset(this._lastOffset.y);
      this._translateY.setValue(0);
    }
  };
  //pan

  //pinch
  _baseScale = new Animated.Value(1);
  _pinchScale = new Animated.Value(1);
  _scale = Animated.multiply(this._baseScale, this._pinchScale);
  _lastScale = 1;
  _onPinchGestureEvent = Animated.event(
    [{nativeEvent: {scale: this._pinchScale}}],
    {
      useNativeDriver: USE_NATIVE_DRIVER,
    },
  );
  _onPinchHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastScale *= event.nativeEvent.scale;
      this._baseScale.setValue(this._lastScale);
      this._pinchScale.setValue(1);
    }
  };
  //pinch

  render() {
    return (
      <View style={styles.mainContainer}>
        <PanGestureHandler
          ref={this._panRef}
          onGestureEvent={this._onGestureEvent}
          onHandlerStateChange={this._onHandlerStateChange}>
          <View style={styles.wrapper}>
            <PinchGestureHandler
              ref={this._pinchRef}
              simultaneousHandlers={this._panRef}
              onGestureEvent={this._onPinchGestureEvent}
              onHandlerStateChange={this._onPinchHandlerStateChange}>
              <Animated.View style={styles.viewContainer} collapsable={false}>
                <Animated.View
                  style={[
                    styles.pinchableView,
                    {
                      transform: [
                        {perspective: 200},
                        {scale: this._scale},
                        {translateX: this._translateX},
                        {translateY: this._translateY},
                      ],
                    },
                  ]}>
                  {this.props.children}
                </Animated.View>
              </Animated.View>
            </PinchGestureHandler>
          </View>
        </PanGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
  },
  viewContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    overflow: 'hidden',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  pinchableView: {
    width: '100%',
    height: '100%',
  },
  wrapper: {
    flex: 1,
  },
});
