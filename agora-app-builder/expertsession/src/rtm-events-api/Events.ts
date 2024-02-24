/*
********************************************
 Copyright © 2022 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/

('use strict');
import RtmEngine from 'agora-react-native-rtm';
import RTMEngine from '../rtm/RTMEngine';
import {EventUtils} from '../rtm-events';
import {
  ReceiverUid,
  EventCallback,
  EventSource,
  PersistanceLevel,
} from './types';
import {adjustUID} from '../rtm/utils';

class Events {
  private source: EventSource = EventSource.core;

  constructor(source?: EventSource) {
    if (source) {
      this.source = source;
    }
  }

  /**
   * Persists the data in the local attributes of the user
   *
   * @param {String} evt  to be stored in rtm Attribute key
   * @param {String} payload to be stored in rtm Attribute value
   * @api private
   */
  private _persist = async (evt: string, payload: string) => {
    const rtmEngine: RtmEngine = RTMEngine.getInstance().engine;
    try {
      const rtmAttribute = {key: evt, value: payload};
      // Step 1: Call RTM API to update local attributes
      await rtmEngine.addOrUpdateLocalUserAttributes([rtmAttribute]);
    } catch (error) {
      console.log(
        'CUSTOM_EVENT_API error occured while updating the value ',
        error,
      );
    }
  };

  /**
   * event type validator.
   *
   * @api private
   * @returns {boolean}
   */
  private _validateEvt = (evt: string): boolean => {
    if (typeof evt !== 'string') {
      throw Error(
        `CUSTOM_EVENT_API Event name cannot be of type ${typeof evt}`,
      );
    }
    if (evt.trim() == '') {
      throw Error(`CUSTOM_EVENT_API Name or function cannot be empty`);
    }
    return true;
  };

  /**
   * event listener validator
   *
   * @api private
   * @returns {boolean}
   */
  private _validateListener = (listener: EventCallback): boolean => {
    if (typeof listener !== 'function') {
      throw Error(
        `CUSTOM_EVENT_API Function cannot be of type ${typeof listener}`,
      );
    }
    return true;
  };

  /**
   * Sets the local attribute of user if persist level is 2 or 3.
   * If param 'toUid' is not provided, message is sent in the channel.
   * If param 'toUid' is provided message is sent to that individual.
   * If param 'toUid' is an array of uids is provided then message is sent to all the individual uids in loop.
   *
   * @param {Object} rtmPayload payload to be sent across
   * @param {ReceiverUid} toUid uid or uids[] of user
   * @api private
   */
  private _send = async (rtmPayload: any, toUid?: ReceiverUid) => {
    const to = typeof toUid == 'string' ? parseInt(toUid) : toUid;
    const rtmEngine: RtmEngine = RTMEngine.getInstance().engine;

    const text = JSON.stringify(rtmPayload);
    // Case 1: send to channel
    if (
      typeof to === 'undefined' ||
      (typeof to === 'number' && to <= 0) ||
      (Array.isArray(to) && to?.length === 0)
    ) {
      console.log('CUSTOM_EVENT_API: case 1 executed');
      try {
        const channelId = RTMEngine.getInstance().channelUid;
        await rtmEngine.sendMessageByChannelId(channelId, text);
      } catch (error) {
        console.log('CUSTOM_EVENT_API: send event case 1 error : ', error);
        throw error;
      }
    }
    // Case 2: send to indivdual
    if (typeof to === 'number' && to !== 0) {
      console.log('CUSTOM_EVENT_API: case 2 executed', to);
      const adjustedUID = adjustUID(to);
      try {
        await rtmEngine.sendMessageToPeer({
          peerId: `${adjustedUID}`,
          offline: false,
          text,
        });
      } catch (error) {
        console.log('CUSTOM_EVENT_API: send event case 2 error : ', error);
        throw error;
      }
    }
    // Case 3: send to multiple individuals
    if (typeof to === 'object' && Array.isArray(to)) {
      console.log('CUSTOM_EVENT_API: case 3 executed', to);

      try {
        for (const uid of to) {
          const adjustedUID = adjustUID(uid);
          await rtmEngine.sendMessageToPeer({
            peerId: `${adjustedUID}`,
            offline: false,
            text,
          });
        }
      } catch (error) {
        console.log('CUSTOM_EVENT_API: send event case 3 error : ', error);
        throw error;
      }
    }
  };

  /**
   * Listen on a new event by eventName and listener.
   * When the specified event happens, the Events API triggers the callback that you pass.
   * The listener will not be added/listened if it is a duplicate.
   *
   * @param {String} eventName Name of the event. It must be a unique string.
   * @param {Function} listener Method to be called when the event is emitted.
   * @returns {Function} Returns function, call it and this listener will be removed from event
   * @api public
   */
  on = (eventName: string, listener: EventCallback): Function => {
    try {
      if (!this._validateEvt(eventName) || !this._validateListener(listener))
        return;
      EventUtils.addListener(eventName, listener, this.source);
      console.log('CUSTOM_EVENT_API event listener registered', eventName);
      return () => {
        //@ts-ignore
        EventUtils.removeListener(eventName, listener, this.source);
      };
    } catch (error) {
      console.log('CUSTOM_EVENT_API on error: ', error);
    }
  };

  /**
   * Listen off an event by eventName and listener
   * or listen off events by eventName, when if only eventName argument is passed.
   * or listen off all events, when if no arguments are passed.
   *
   * @param {String} eventName Name of the event to remove the listener from.
   * @param {Function} listener Listener to remove from the event.
   * @api public
   */
  off = (eventName?: string, listener?: EventCallback) => {
    try {
      if (listener) {
        if (this._validateListener(listener) && this._validateEvt(eventName)) {
          // listen off an event by eventName and listener
          //@ts-ignore
          EventUtils.removeListener(eventName, listener, this.source);
        }
      } else if (eventName) {
        // listen off events by name, when if only name is passed.
        if (this._validateEvt(eventName)) {
          EventUtils.removeAllListeners(eventName, this.source);
        }
      } else {
        // listen off all events, that means every event will be emptied.
        EventUtils.removeAll(this.source);
      }
    } catch (error) {
      console.log('CUSTOM_EVENT_API off error: ', error);
    }
  };

  /**
   * This method sends p2p or channel message depending upon the 'receiver' value.
   *  - If 'receiver' is provided this method sends p2p message.
   *  - If 'receiver' is empty this method sends channel message.
   *
   *
   * @param {String} eventName  Name of the event to send.
   * @param {String} payload (optional) Additional data to be sent along with the event.
   * @param {Enum} persistLevel (optional) set different levels of persistance. Default value is Level 1
   * @param {ReceiverUid} receiver (optional) uid or uid array. Default mode sends message in channel.
   * @api public
   * */
  send = async (
    eventName: string = '',
    payload: string = '',
    persistLevel: PersistanceLevel = PersistanceLevel.None,
    receiver: ReceiverUid = -1,
  ) => {
    if (!this._validateEvt(eventName)) return;

    const persistValue = JSON.stringify({
      payload,
      persistLevel,
      source: this.source,
    });

    const rtmPayload = {
      evt: eventName,
      value: persistValue,
    };

    if (
      persistLevel === PersistanceLevel.Sender ||
      persistLevel === PersistanceLevel.Session
    ) {
      try {
        await this._persist(eventName, persistValue);
      } catch (error) {
        console.log('CUSTOM_EVENT_API persist error: ', error);
      }
    }
    try {
      await this._send(rtmPayload, receiver);
    } catch (error) {
      console.log('CUSTOM_EVENT_API: sending failed. ', error);
    }
  };
}

export default Events;
