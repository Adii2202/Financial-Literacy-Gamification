import {StyleSheet, Text, View} from 'react-native';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import React from 'react';

const Ring = ({isMobileView}) => {
  const css = `.ring {
    width: ${isMobileView ? '60px' : '100px'};
    height: ${isMobileView ? '60px' : '100px'};
    border-radius: 50%;
    position: absolute;
    background-color: transparent;
    border: 3px ${$config.PRIMARY_ACTION_BRAND_COLOR} solid;
    -webkit-animation-name: ani; 
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
    -webkit-animation-duration: 3s;
    -webkit-animation-direction: normal;
   
}

@-webkit-keyframes ani {
    0% {-webkit-transform: scale(0.5); opacity: 0} 
    1% {-webkit-transform: scale(0.5); opacity: 1} 
    95% {-webkit-transform: scale(1.5); opacity: .5;}
    100% {-webkit-transform: scale(1.5); opacity: 0;}
}
#r2 { -webkit-animation-delay: -1s;}
#r3 { -webkit-animation-delay: -2s;}
`;
  return (
    <div>
      <style type="text/css">{css}</style>
      <div id="r1" className="ring"></div>
      <div id="r2" className="ring"></div>
      <div id="r3" className="ring"></div>
    </div>
  );
};

const AnimatedRings = ({isActiveSpeaker, children, isMobileView}) => {
  return (
    <View
      style={{
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      {isActiveSpeaker ? (
        <View style={{position: 'relative', left: -2, top: -2}}>
          <Ring isMobileView={isMobileView} />
        </View>
      ) : (
        <></>
      )}
      {children}
    </View>
  );
};

export default AnimatedRings;

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 140,
    borderRadius: 80,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
