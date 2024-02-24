// 1. Import Events
import Events from '../src/rtm-events-api/Events';
import {
  EventSource,
  PersistanceLevel,
  EventCallback,
} from '../src/rtm-events-api';

// 2. Initialize with source "fpe"
const customEvents = new Events(EventSource.fpe);

// 3. export
export {customEvents, PersistanceLevel};
export type {EventCallback};
