import contentUtils from '../utils/contentUtils';
import React from 'react';
import { render } from 'react-dom';
import Marquee from '../marquee/Marquee';

const contentLoad = () => {
  const divblock = document.createElement('div');
  divblock.id = 'volkanakin';

  const root = divblock.attachShadow({ mode: 'closed' });
  divblock.style.cssText = `position: fixed;
  top: 0;
  height: 40px;
  width: 100%;
  z-index: 9999999999;`;
  // root.innerHTML = `<!DOCTYPE html>
  // <html lang="en">
  //   <head>
  //     <meta charset="UTF-8" />
  //     <title></title>
  //   </head>
  //   <body>
  //     <div id="app-container"></div>
  //   </body>
  // </html>
  // `;
  document.body.appendChild(divblock);
  render(<Marquee />, root, () => {});
  return;
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
