function EventEmitter(this: any) {
  // key: eventName,
  // value: An array of callback functions with the same eventName
  this.events = new Map();

  return {
    on: (eventName: string, callback: Function) => {
      if (this.events.has(eventName)) {
        throw new Error(`Event with ${eventName} is already registered`);
      }
      //if eventName does not exist, add
      console.log('on', eventName, callback);
      this.events.set(eventName, callback);
    },
    emit: (eventName: string, args: any) => {
      console.log('emit', args, eventName);

      if (this.events.has(eventName)) {
        //if eventName exists, call the callback in events accordingly
        const registeredCallback = this.events.get(eventName);
        // handle for this context
        registeredCallback(args);
      }
    },
  };
}

const SDKEvents = new (EventEmitter as any)();
export {SDKEvents};
