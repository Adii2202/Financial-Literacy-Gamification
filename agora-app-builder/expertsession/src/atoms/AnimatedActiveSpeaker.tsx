import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

interface AnimatedActiveSpeakerProps {
  isSpeaking: boolean;
}
const AnimatedActiveSpeaker = ({isSpeaking}: AnimatedActiveSpeakerProps) => {
  const css = `
    .container-sk {
    flex: 1;
    display:flex;
    flex-direction: row;
    align-items: center
    }
    .line {
        width: 2.5px;
        background-color: ${$config.PRIMARY_ACTION_BRAND_COLOR};
        border-radius: 25px;
        height:6px;
        animation: wave 1s ease-in-out  infinite normal;
        animation-play-state: ${isSpeaking ? 'running' : 'paused'}

    }
    @keyframes wave{

        0%{
         
            height:6px
        }
      
        50%{
         
            height:12px
        }
      
        100%{
    
            height:6px
        }
      
      }
      .line:nth-child(2){
        animation-delay: .2s;
      }
      
      .line:nth-child(3){
        animation-delay: .5s;
      }
    #line1 {
        margin-right:2.5px
    }
    #line2 {
        margin-right:2.5px;
        height:12px
    }

    `;
  return (
    <>
      <style type="text/css">{css}</style>
      <div className="container-sk">
        <div className="line" id="line1" />
        <div className="line" id="line2" />
        <div className="line" id="line3" />
      </div>
    </>
  );
};

export default AnimatedActiveSpeaker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  line: {
    width: 2.5,
    backgroundColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    borderRadius: 25,
  },
});
