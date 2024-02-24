import React from 'react';
import {useWindowDimensions} from 'react-native';
import {useCaption} from './useCaption';
import {useSidePanel, SidePanelType} from 'customization-api';
import {CAPTION_CONTAINER_HEIGHT} from '../../../src/components/CommonStyles';

interface CaptionWidthReturnType {
  isCaptionNotFullWidth: boolean;
  transcriptHeight: string;
}

const useCaptionWidth = (): CaptionWidthReturnType => {
  const {isCaptionON} = useCaption();
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();
  const {sidePanel} = useSidePanel();

  const isCaptionNotFullWidth =
    isCaptionON && sidePanel !== SidePanelType.None && windowWidth > 1200;

  const transcriptHeight = isCaptionNotFullWidth
    ? `calc(100% + ${CAPTION_CONTAINER_HEIGHT}px + 4px)` //10px is gap b/w <Video> & <Caption/>
    : '';

  return {isCaptionNotFullWidth, transcriptHeight};
};

export default useCaptionWidth;
