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
import React from 'react';
export type {ChatBubbleProps} from '../src/components/ChatContext';
import {ChatBubbleProps} from '../src/components/ChatContext';
import {
  ContentInterface,
  ContentStateInterface,
  UidType,
} from '../agora-rn-uikit';
import {I18nInterface} from '../src/language/i18nTypes';
import {IconsInterface} from '../src/atoms/CustomIcon';
import {ToolbarCustomItem} from './sub-components';
import {TextDataInterface} from '../src/language/default-labels';

export const CUSTOM_ROUTES_PREFIX = '/r/';

interface BeforeAndAfterInterface {
  // commented for v1 release
  // before?: React.ComponentType;
  // after?: React.ComponentType;
}

export interface PreCallInterface extends BeforeAndAfterInterface {
  preview?: React.ComponentType;
  audioMute?: React.ComponentType;
  videoMute?: React.ComponentType;
  meetingName?: React.ComponentType;
  deviceSelect?: React.ComponentType;
  joinButton?: React.ComponentType;
  textBox?: React.ComponentType;
}
export interface ChatCmpInterface {
  //commented for v1 release
  //extends BeforeAndAfterInterface
  chatBubble?: React.ComponentType<ChatBubbleProps>;
  chatInput?: React.ComponentType;
}

export type LayoutComponent = React.ComponentType<{
  renderData: ContentStateInterface['activeUids'];
}>;

export interface LayoutItem {
  name: string;
  label: string;
  translationKey?: keyof TextDataInterface;
  icon: string;
  component: LayoutComponent;
}

export type ToolbarType = React.ComponentType | Array<ToolbarCustomItem>;
export interface VideoCallInterface extends BeforeAndAfterInterface {
  // commented for v1 release
  topToolBar?: ToolbarType;
  bottomToolBar?: ToolbarType;
  leftToolBar?: ToolbarType;
  rightToolBar?: ToolbarType;
  //settingsPanel?: React.ComponentType;
  participantsPanel?: React.ComponentType;
  chat?: ChatCmpInterface;
  customLayout?: (layouts: LayoutItem[]) => LayoutItem[];
  wrapper?: React.ComponentType;
  invitePopup?: {
    title: string;
    renderComponent?: React.ComponentType;
  };
}

export type ComponentsInterface = {
  /**
   * Custom context/api provider wrapped in root level
   */
  appRoot?: React.ComponentType;
  // commented for v1 release
  // precall?: PreCallInterface | React.ComponentType;
  precall?: React.ComponentType;
  //create?: React.ComponentType;
  //share?: React.ComponentType;
  //join?: React.ComponentType;
  videoCall?: VideoCallInterface | React.ComponentType;
};

export interface CustomRoutesInterface {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  componentProps?: object;
  isPrivateRoute?: boolean;
  routeProps?: object;
  failureRedirectTo?: string;
}

export type CustomHookType = () => () => Promise<void>;

export interface CustomizationApiInterface {
  /**
   * components used to replace whole screen or subcomponents
   */
  components?: ComponentsInterface;
  /**
   * custom routes used to add new page/routes
   */
  // commented for v1 release
  //customRoutes?: CustomRoutesInterface[];
  /**
   * Internationlization
   */
  i18n?: I18nInterface[];
  /**
   * Life cycle events
   */
  // commented for v1 release
  // lifecycle?: {
  //   useBeforeJoin?: CustomHookType;
  //   useBeforeCreate?: CustomHookType;
  // };
}
