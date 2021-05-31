// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const setStorage = (key: string, value: any): void => {
  chrome.storage.sync.set({
    [key]: value,
  });
};

const storageUtils = {
  setStorage,
};

export default storageUtils;
