import {
  individualUnreadMessageCount,
  useChatNotification,
} from '../components/chat-notification/useChatNotification';
import {
  messageStoreInterface,
  useChatMessages,
} from '../components/chat-messages/useChatMessages';

export interface messageInterface {
  groupMessages: messageStoreInterface[];
  privateMessages: {
    [key: string]: messageStoreInterface[];
  };
  sendMessage: (msg: string, toUid?: number) => void;
  editMessage: (msgId: string, msg: string, toUid?: number) => void;
  deleteMessage: (msgId: string, toUid?: number) => void;
  groupUnreadCount: number;
  individualUnreadCount: individualUnreadMessageCount;
  setGroupUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  setIndividualUnreadCount: React.Dispatch<
    React.SetStateAction<individualUnreadMessageCount>
  >;
}

/**
 * The Messages app state governs the chat messages.
 */
export const useMessages: () => messageInterface = () => {
  const {
    deleteChatMessage: deleteMessage,
    editChatMessage: editMessage,
    messageStore: groupMessages,
    privateMessageStore: privateMessages,
    sendChatMessage: sendMessage,
  } = useChatMessages();
  const {
    setUnreadIndividualMessageCount: setIndividualUnreadCount,
    setUnreadGroupMessageCount: setGroupUnreadCount,
    unreadGroupMessageCount: groupUnreadCount,
    unreadIndividualMessageCount: individualUnreadCount,
  } = useChatNotification();

  return {
    groupMessages,
    privateMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    groupUnreadCount,
    individualUnreadCount,
    setGroupUnreadCount,
    setIndividualUnreadCount,
  };
};
