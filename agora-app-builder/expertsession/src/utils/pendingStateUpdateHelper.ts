/**
 * Wrapper around 200ms buffered updates.
 * @param action - The asynchronous action that causes update
 * @param cb - Callback method called with true if 200ms exceeded in performing 
   * provided action and called with false after action completed
 */
const pendingStateUpdateHelper = async (
  action: () => Promise<any>,
  cb: (exceeded200ms: boolean) => void,
) => {
  const pendingTimeout = setTimeout(() => {
    cb(true);
  }, 200);
  await action();
  clearTimeout(pendingTimeout);
  cb(false);
};

export default pendingStateUpdateHelper;
