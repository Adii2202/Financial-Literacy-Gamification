//Common components
export {default as TextInput} from '../src/atoms/TextInput';
//Icons
//export {Icons} from '../agora-rn-uikit';

// commented for v1 release
//create screen
//export {default as Create} from '../src/pages/Create';

// commented for v1 release
//share screen
//export {default as Share} from '../src/components/Share';

// commented for v1 release
//Precall components
export * from '../src/components/precall/index';

//video call components
export {
  ParticipantsView,
  ChatBubble,
  ChatInput,
  Chat,
  SettingsView,
  ToolbarComponents,
} from '../src/pages/video-call/index';
export {default as GridLayout} from '../src/components/GridVideo';
export {default as PinnedLayout} from '../src/components/PinnedVideo';
export {default as VideoComponent} from '../src/pages/video-call/VideoComponent';
export {default as MaxVideoView} from '../src/pages/video-call/VideoRenderer';
export {default as NameWithMicIcon} from '../src/pages/video-call/NameWithMicIcon';
export {default as NetworkQualityPill} from '../src/subComponents/NetworkQualityPill';
//videocall screen
export {default as VideocallScreen} from '../src/pages/video-call/VideoCallScreen';
export {default as PrecallScreen} from '../src/components/Precall';
export {default as VBPanel} from '../src/components/virtual-background/VBPanel';
export {WhiteboardListener} from '../src/components/Controls';

// commented for v1 release
//Settings screen
//export {default as HostControlView} from '../src/components/HostControlView';
// export {
//   default as SelectDevice,
//   SelectDeviceComponentsArray,
// } from '../src/subComponents/SelectDevice';
//export {default as LanguageSelector} from '../src/subComponents/LanguageSelector';

//Sidepanel buttons
//export {SidePanelButtonsArray} from '../src/subComponents/SidePanelButtons';
export {
  MaxVideoView as UiKitMaxVideoView,
  ClientRole as UikitClientRole,
  ChannelProfile as UikitChannelProfile,
  PropsContext as UikitPropsContext,
} from '../agora-rn-uikit';
export {default as Toolbar} from '../src/atoms/Toolbar';
export {default as ToolbarItem} from '../src/atoms/ToolbarItem';
export {default as ToolbarPreset} from '../src/atoms/ToolbarPreset';
export {default as ToolbarMenu} from '../src/atoms/ToolbarMenu';
export type {
  ToolbarCustomItem,
  ToolbarPresetProps,
} from '../src/atoms/ToolbarPreset';
