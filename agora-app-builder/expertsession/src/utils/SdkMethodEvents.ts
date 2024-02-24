import {createNanoEvents, Emitter} from 'nanoevents';
import {
  CustomizationApiInterface,
  RoomInfoContextInterface,
} from 'customization-api';
import {deviceId} from '../components/DeviceConfigure';

export interface SdkMethodEvents {
  customize: (customization: CustomizationApiInterface) => void;
  join(
    roomid: string | Partial<RoomInfoContextInterface['data']>,
    skipPrecall?: boolean,
    username?: string,
  ): RoomInfoContextInterface['data'];
  microphoneDevice: (deviceId: deviceId) => void;
  speakerDevice: (deviceId: deviceId) => void;
  cameraDevice: (deviceId: deviceId) => void;
  muteAudio: (mute: boolean | ((currentMute: boolean) => boolean)) => void;
  muteVideo: (mute: boolean | ((currentMute: boolean) => boolean)) => void;
  login: (token: string) => void;
  logout: () => void;
}

type EventParameterHelper<T extends keyof SdkMethodEvents> = Parameters<
  SdkMethodEvents[T]
>;

type EventReturnTypeHelper<T extends keyof SdkMethodEvents> = ReturnType<
  SdkMethodEvents[T]
>;

type EventKeyNameHelper = keyof SdkMethodEvents;

type injectAsync<T extends (...p: any) => any> = (
  res: (result?: ReturnType<T> | PromiseLike<ReturnType<T>>) => void,
  rej: (reason?: any) => void,
  ...params: Parameters<T>
) => void;

export type _InternalSDKMethodEventsMap = {
  [K in EventKeyNameHelper]: injectAsync<SdkMethodEvents[K]>;
};

type emitCacheType = {
  [K in EventKeyNameHelper]?: Parameters<_InternalSDKMethodEventsMap[K]>;
};

type emitCacheEnabledType = {
  [K in EventKeyNameHelper]?: boolean;
};

class SDKMethodEvents {
  constructor() {
    this.emitter = createNanoEvents();
  }

  emitter: Emitter;

  emitCache: emitCacheType = {};
  emitCacheDisabled: emitCacheEnabledType = {};

  async emit<T extends EventKeyNameHelper>(
    event: T,
    ...params: EventParameterHelper<T>
  ) {
    if (this.emitCache[event]) {
      throw new Error(`Event: ${event} already in callstack`);
    }

    const result = await new Promise<EventReturnTypeHelper<T>>((res, rej) => {
      this.emitCache[event] = [res, rej, ...params] as any;
      this.emitter.emit(event, res, rej, ...params);
    })
      .then(res => {
        delete this.emitCache[event];
        return res;
      })
      .catch(e => {
        delete this.emitCache[event];
        throw e;
      });

    return result;
  }

  on<T extends EventKeyNameHelper>(
    event: T,
    callback: _InternalSDKMethodEventsMap[T],
  ) {
    const unsub = this.emitter.on(event, callback);
    if (this.emitCache[event] && !this.emitCacheDisabled[event]) {
      this.emitter.emit(event, ...this.emitCache[event]);
    }
    this.emitCacheDisabled[event] = true;
    return unsub;
  }
}

const SDKMethodEventsManager = new SDKMethodEvents();

export default SDKMethodEventsManager;
