// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const setStorage = (key: string, value: any): void => {
  chrome.storage.sync.set({
    [key]: value,
  });
};

const removeStorage = (key: string): void => {
  chrome.storage.sync.remove(key);
};

const storageUtils = {
  setStorage,
  removeStorage,
};

export default storageUtils;
