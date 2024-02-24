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
import RtcEngine from './RtcEngine';
import SurfaceView from './SurfaceView';
import LocalView from './LocalView';
import * as Types from './Types';

export const RtcLocalView = {
  SurfaceView: LocalView,
  TextureView: LocalView,
};

export const RtcRemoteView = {
  SurfaceView: SurfaceView as any,
  TextureView: SurfaceView as any,
};

export const VideoRenderMode = {...Types.VideoRenderMode};
export const VideoMirrorMode = {...Types.VideoRenderMode};

export {RnEncryptionEnum as EncryptionMode} from './RtcEngine';
export {AREAS as AreaCode} from './RtcEngine';
export type VideoEncoderConfiguration = any;
export declare enum AudioScenario {
  /**
   * 0: Default audio scenario.
   *
   * **Note**
   *  If you run the iOS app on an M1 Mac, due to the hardware differences between M1 Macs, iPhones, and iPads,
   * the default audio scenario of the Agora iOS SDK is the same as that of the Agora macOS SDK.
   */
  Default = 0,
  /**
   * 1: Entertainment scenario where users need to frequently switch the user role.
   */
  ChatRoomEntertainment = 1,
  /**
   * 2: Education scenario where users want smoothness and stability.
   */
  Education = 2,
  /**
   * 3: High-quality audio chatroom scenario where hosts mainly play music.
   */
  GameStreaming = 3,
  /**
   * 4: Showroom scenario where a single host wants high-quality audio.
   */
  ShowRoom = 4,
  /**
   * 5: Gaming scenario for group chat that only contains the human voice.
   */
  ChatRoomGaming = 5,
  /**
   * IoT (Internet of Things) scenario where users use IoT devices with low power consumption.
   *
   * @since v3.2.0.
   */
  IOT = 6,
  /**
   * Meeting scenario that mainly contains the human voice.
   *
   * @since v3.2.0.
   */
  MEETING = 8,
}
export declare enum AudioProfile {
  /**
   * 0: Default audio profile.
   * - In the `Communication` profile: A sample rate of 32 KHz, audio encoding, mono, and a bitrate of up to 18 Kbps.
   * - In the `LiveBroadcasting` profile: A sample rate of 48 KHz, music encoding, mono, and a bitrate of up to 64 Kbps.
   */
  Default = 0,
  /**
   * 1: A sample rate of 32 KHz, audio encoding, mono, and a bitrate of up to 18 Kbps.
   */
  SpeechStandard = 1,
  /**
   * 2: A sample rate of 48 KHz, music encoding, mono, and a bitrate of up to 64 Kbps.
   */
  MusicStandard = 2,
  /**
   * 3: A sample rate of 48 KHz, music encoding, stereo, and a bitrate of up to 80 Kbps.
   */
  MusicStandardStereo = 3,
  /**
   * 4: A sample rate of 48 KHz, music encoding, mono, and a bitrate of up to 96 Kbps.
   */
  MusicHighQuality = 4,
  /**
   * 5: A sample rate of 48 KHz, music encoding, stereo, and a bitrate of up to 128 Kbps.
   */
  MusicHighQualityStereo = 5,
}
export default RtcEngine;
