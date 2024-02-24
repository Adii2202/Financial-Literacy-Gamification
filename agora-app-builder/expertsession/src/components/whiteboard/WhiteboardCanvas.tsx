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

import React, {useRef, useEffect, useContext} from 'react';
import {
  BoardColor,
  whiteboardContext,
  whiteboardPaper,
} from './WhiteboardConfigure';
import {StyleSheet, View, Text} from 'react-native';
import {RoomPhase, ApplianceNames} from 'white-web-sdk';
import WhiteboardToolBox from './WhiteboardToolBox';
import WhiteboardWidget from './WhiteboardWidget';

interface WhiteboardCanvasInterface {
  showToolbox: boolean | undefined;
}
const WhiteboardCanvas: React.FC<WhiteboardCanvasInterface> = ({
  showToolbox,
}) => {
  const wbSurfaceRef = useRef();
  const {whiteboardRoom, boardColor} = useContext(whiteboardContext);

  useEffect(function () {
    if (whiteboardPaper) {
      //@ts-ignore
      wbSurfaceRef.current.appendChild(whiteboardPaper);
    }

    return () => {
      // unBindRoom();
    };
  }, []);

  return (
    <>
      <WhiteboardWidget whiteboardRoom={whiteboardRoom} />
      {showToolbox &&
      //@ts-ignore
      whiteboardRoom.current.isWritable ? (
        <WhiteboardToolBox whiteboardRoom={whiteboardRoom} />
      ) : (
        // <div
        //   style={{
        //     position: 'absolute',
        //     width: '100%',
        //     height: '100%',
        //     zIndex: 10,
        //   }}
        // />
        <></>
      )}
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: boardColor === BoardColor.Black ? 'black' : 'white',
          borderRadius: 4,
        }}
        ref={wbSurfaceRef}
        id="whiteboard-div-ref"
      />
    </>
  );
};

const style = StyleSheet.create({
  WhiteBoardContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  placeholder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#00000008',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolboxContainer: {
    position: 'absolute',
    paddingTop: 50,
    paddingLeft: 20,
  },
});

export default WhiteboardCanvas;
