export interface AttributesMap {
  [key: string]: string;
}

export interface ChannelAttributeOptions {
  /**
   * Indicates whether or not to notify all channel members of a channel attribute change
   * This flag is valid only within the current method call:
   * true:  Notify all channel members of a channel attribute change.
   * false: (Default) Do not notify all channel members of a channel attribute change.
   */
  enableNotificationToChannelMembers?: undefined | false | true;
}
