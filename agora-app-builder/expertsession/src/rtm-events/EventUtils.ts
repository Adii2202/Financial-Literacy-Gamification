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
import {EventSource} from '../rtm-events-api/types';
type TListener = <T>(t: T) => void;
type TListenerMetaData = {once: boolean; listener: TListener};
type TEventList = Map<string, TListenerMetaData[]>;
type TEvents = Record<EventSource, TEventList> | Record<string, never>;

const EventUtils = (function () {
  'use strict';

  let _events: TEvents = {};

  /**
   * Checks if the callback passed is valid listener or not
   * @return {Boolean} true if callback passed is a function
   * @api private
   * @example : () => {} (or) {once: false, listener: () => {}}
   */
  const _isValidListener = function (
    listener: TListener | TListenerMetaData,
  ): boolean {
    if (typeof listener === 'function') {
      return true;
    } else if (listener && typeof listener === 'object') {
      // If listener is passed with additional meta data (addOnceListener API below), it will be of type object
      return _isValidListener(listener.listener);
    } else {
      return false;
    }
  };

  /**
   * Returns the listener array for the specified event.
   * Will initialise the event object and listener arrays if required.
   * Each property in the object response is an array of listener functions.
   *
   * @param {String} evt Name of the event to return the listeners from.
   * @param {String} source Name of the bucket to search events from
   * @return {Function[]} All listener functions for the event with meta data.
   * @api private
   * @example : [] (or) [{once: false, listener: f}, {once: false, listener: f}...so on and so forth]
   */
  const _getListeners = function (
    evt: string,
    source: EventSource,
  ): TListenerMetaData[] | [] {
    let response: TListenerMetaData[] | [];
    if (_events.hasOwnProperty(source)) {
      if (_events[source].get(evt)) {
        response = _events[source].get(evt);
      } else {
        _events[source].set(evt, []);
        response = _events[source].get(evt);
      }
    } else {
      _events[source] = new Map();
      _events[source].set(evt, []);
      response = _events[source].get(evt);
    }
    return response;
  };

  /**
   * Fetches the requested listeners via getListeners but will always return the results inside an object.
   * This is mainly for internal use but others may find it useful.
   *
   * @param {String} evt Name of the event to return the listeners from.
   * @param {EventSource} source Name of the bucket to search events from
   * @return {Object} All listener functions for an event in an object.
   * @api private
   * @example : {evt-name: [{once: false, listener: f}, {once: false, listener: f}...so on and so forth]
   */
  const _getListenersAsObject = function (
    evt: string,
    source: EventSource,
  ): object {
    const listeners = _getListeners(evt, source);
    let response: any;

    if (listeners instanceof Array) {
      response = {};
      response[evt] = listeners;
    }

    return response || listeners;
  };

  /**
   * Finds the index of the listener for the event in its storage array.
   *
   * @param {Function[]} listeners Array of listeners to search through.
   * @param {Function} listener Method to look for.
   * @return {Number} Index of the specified listener, -1 if not found
   * @api private
   */
  const _indexOfListener = function (listeners: any, listener: any): number {
    var i = listeners.length;
    while (i--) {
      if (listeners[i].listener.toString() === listener.toString()) {
        return i;
      }
    }
    return -1;
  };

  return {
    getEvents(source: EventSource): TEvents | {} {
      return _events[source] || (_events[source] = new Map());
    },
    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     *
     * @param {String} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted.
     * @param {EventSource} source Name of the bucket to search events from
     * @return {Object} Current instance of EventUtils
     */
    addListener(evt: string, listener: any, source: EventSource): object {
      if (!_isValidListener(listener)) {
        throw new Error('Listener must be a function');
      }
      const listeners = _getListenersAsObject(evt, source);
      const listenerIsWrapped = typeof listener === 'object';

      for (let key in listeners) {
        if (
          listeners.hasOwnProperty(key) &&
          _indexOfListener(listeners[key], listener) === -1
        ) {
          listeners[key].push(
            listenerIsWrapped
              ? listener
              : {
                  listener: listener,
                  once: false,
                },
          );
        }
      }
      return this;
    },

    /**
     * Removes a listener function from the specified event.
     *
     * @param {String} evt Name of the event to remove the listener from.
     * @param {Function} listenerToRemove Method to remove from the event.
     * @param {EventSource} source Name of the bucket to search events from
     * @return {Object} Current instance of EventUtils for chaining.
     */
    removeListener(
      evt: string,
      listenerToRemove: TListener,
      source: EventSource,
    ): Object {
      let listeners = _getListenersAsObject(evt, source);
      for (let key in listeners) {
        if (listeners.hasOwnProperty(key)) {
          let index = _indexOfListener(listeners[key], listenerToRemove);
          if (index !== -1) {
            listeners[key].splice(index, 1);
          }
        }
      }
      return this;
    },

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     *
     * @param {String} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @param {EventSource} source Name of the bucket to search events from
     * @return {Object} Current instance of EventUtils
     */
    removeAllListeners(evt: string, source: EventSource): object {
      let type = typeof evt;
      let events = this.getEvents(source);
      if (type === 'string') {
        if (events.has(evt)) {
          events.delete(evt);
        }
      }
      return this;
    },

    /**
     * Removes all events and resets the state.
     * That means every event will be emptied.
     *
     * @param {source} source source Name of the bucket to search events from
     * @return {Object} Current instance of EventUtils
     */
    removeAll(source: EventSource): object {
      _events[source] = new Map();
      return this;
    },

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     *
     * @param {String} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventUtils
     */
    emitEvent(evt: string, source: EventSource, args: any): object {
      let listenersMap = _getListenersAsObject(evt, source);
      let listeners: TListenerMetaData[];
      let listener: TListenerMetaData;
      for (let key in listenersMap) {
        if (listenersMap.hasOwnProperty(key)) {
          listeners = listenersMap[key].slice(0);
          for (let i = 0; i < listeners.length; i++) {
            // If the listener returns true then it shall be removed from the event
            // The function is executed either with a basic call or an apply if there is an args array
            listener = listeners[i];

            if (listener.once === true) {
              this.removeListener(evt, source, listener.listener);
            }

            const newargs = [].slice.call(arguments, 2);
            listener.listener.apply(this, newargs || []);
          }
        }
      }
      return this;
    },
    clear() {
      _events = {};
    },
    // 1. To add multiple listeners
    // addListeners(evt: string, listeners: any) {
    //   if (Array.isArray(listeners)) {
    //     let i = listeners.length;
    //     while (i--) {
    //       this.addListener.call(this, evt, listeners[i]);
    //     }
    //   }
    // },
    // 2. To add only once listener
    // addOnceListener(evt: string, listener: TListener) {
    //   return this.addListener(evt, {
    //     listener: listener,
    //     once: true,
    //   });
    // },
  };
})();

export default EventUtils;
