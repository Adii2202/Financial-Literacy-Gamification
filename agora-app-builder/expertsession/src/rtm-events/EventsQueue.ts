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

interface IQueueEvent {
  data: any;
  uid: number | string;
  ts: number;
}

const EventsQueue = (function () {
  'use strict';

  let _eventsQueue: any = [];

  return {
    enqueue(q: IQueueEvent) {
      _eventsQueue.push(q);
    },
    dequeue() {
      if (_eventsQueue.length == 0) return;
      return _eventsQueue.pop();
    },
    isEmpty() {
      return _eventsQueue.length === 0;
    },
    size() {
      return _eventsQueue.length;
    },
    clear() {
      _eventsQueue = [];
    },
  };
})();

export default EventsQueue;
