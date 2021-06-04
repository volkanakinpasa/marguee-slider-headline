import contentUtils from '../utils/contentUtils';

const contentLoad = () => {
  chrome.storage.sync.get(
    [
      'enabled',
      'favoritestocks',
      'allwebsites',
      'selectedwebsites',
      'dropshadow',
      'position',
    ],
    (items: any) => {
      const enabled = items['enabled'];
      const favoriteStocks = items['favoritestocks'];
      const allwebsites = items['allwebsites'];
      const selectedwebsites: string[] = items['selectedwebsites'];
      const dropshadow = items['dropshadow'];
      const position = items['position'];

      if (enabled && favoriteStocks && favoriteStocks.length > 0) {
        if (
          (allwebsites === 'selected' &&
            selectedwebsites.some(
              (selectedwebsite: string) =>
                location.href.indexOf(selectedwebsite) > -1,
            )) ||
          allwebsites === 'all'
        ) {
          contentUtils.removeMarquee();
          setTimeout(() => {
            contentUtils.addMarquee(dropshadow, position, 40);
          }, 500);
        } else {
          //todo add remove
          contentUtils.removeMarquee();
        }
      } else {
        contentUtils.removeMarquee();
      }
    },
  );
};

chrome.runtime.onMessage.addListener(function (message, sender, sendMessage) {
  if (message.type === 'refreshContent') {
    contentLoad();
  }
});

window.addEventListener('load', contentLoad, true);
