import storageUtils from '../utils/storageUtils';

const { setStorage } = storageUtils;

import configJson from '../../defaultConfigs.json';

const messageListener = (message: any, serder: any, callback: any) => {
  switch (message.type) {
    case 'refreshContent':
      sendMessageToAllContentScript(message);
      break;
  }
};

const sendMessageToRuntime = (message: any) => {
  chrome.runtime.sendMessage({ ...message });
};

const sendMessageToContentScript = (tabId: number, message: any) => {
  chrome.tabs.sendMessage(tabId, { ...message });
};
const sendMessageToAllContentScript = (message: any) => {
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach((tab: any) => {
      sendMessageToContentScript(tab.id, { ...message });
    });
  });
};

const sendMessageToActiveContentScript = (message: any) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    tabs.forEach((tab: any) => {
      sendMessageToContentScript(tab.id, { ...message });
    });
  });
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  messageListener(message, sender, sendResponse);
});

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == 'install') {
    Object.keys(configJson).forEach(function (key) {
      setStorage(key, configJson[key]);
    });
  } else if (details.reason == 'update') {
    // Object.keys(configJson).forEach(function (key) {
    //   console.log(`${key}=${configJson[key]}`);
    //   setStorage(key, configJson[key]);
    // });
  }
});

const openTab = (url: string) => {
  //eslint-disable-next-line no-undef
  chrome.tabs.create({
    url,
  });
};

const browserActionClick = () => {
  openTab(`chrome-extension://${chrome.runtime.id}/options.html`);
};

chrome.browserAction.onClicked.addListener(() => {
  browserActionClick();
});
