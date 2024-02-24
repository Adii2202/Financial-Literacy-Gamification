import React, {useEffect} from 'react';
import VideoRenderer from './VideoRenderer';
import {UidType} from '../../../agora-rn-uikit';
import {useContent} from 'customization-api';
import {useCustomization} from 'customization-implementation';
import {isValidReactComponent} from '../../utils/common';

export type RenderComponentType = {[key: string]: React.FC<any>};

const DefaultRenderComponent: RenderComponentType = {
  rtc: VideoRenderer,
  screenshare: VideoRenderer,
};
interface RenderComponentProps {
  uid: UidType;
  isMax?: boolean;
}
const RenderComponent = ({uid, isMax = false}: RenderComponentProps) => {
  const {defaultContent, customContent, activeUids} = useContent();
  const RenderComp = DefaultRenderComponent['rtc'];

  if (customContent && customContent[uid] && customContent[uid]?.component) {
    const CustomComponent = customContent[uid]?.component;
    const CustomComponentProps = customContent[uid]?.props;
    //@ts-ignore
    return <CustomComponent {...CustomComponentProps} />;
  } else if (defaultContent[uid]) {
    return <RenderComp user={defaultContent[uid]} isMax={isMax} />;
  } else {
    return null;
  }
};

export default RenderComponent;
