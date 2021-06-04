import React, { FC, useEffect, useRef, useState } from 'react';
// import Ticker from 'react-ticker';
import {
  CACHE_STOCKS_EXPIRED_MS,
  MAX_STOCKS_TO_FETCH,
} from '../utils/constants';
import './marquee.css';
import storageUtils from '../utils/storageUtils';
import { Stock } from '../interfaces';
import $ from 'jquery';
import 'jquery.marquee';

interface JQuery {
  printArea(): void;
}

const { setStorage } = storageUtils;

const Marquee: FC = () => {
  const [isReady, setIsReady] = useState(false);
  // const [move, setMove] = useState(true);
  // const [enabled, setEnabled] = useState<boolean>(false);
  const [lightcolor, setLightcolor] = useState<string>(null);
  const [redcolor, setRedcolor] = useState<string>(null);
  const [greencolor, setGreencolor] = useState<string>(null);
  const [textColor, setTextColor] = useState<string>(null);
  const [favoriteStocks, setFavoriteStocks] = useState<string[]>(null);
  const [stocks, setStocks] = useState<any[]>(null);
  const [typeBar, setTypeBar] = useState<string>(null);
  const [marqueeDirection, setMarqueeDirection] = useState<string>(null);
  const [marqueeSpeed, setMarqueeSpeed] = useState<number>(null);
  const [fontName, setFontName] = useState<string>(null);
  const [fontSize, setFontSize] = useState<number>(null);
  const [isFullName, setIsFullName] = useState<boolean>(false);
  const [apiUrl, setApiUrl] = useState<string>(null);
  const [apiKey, setApiKey] = useState<string>(null);
  const [showInitMarquee, setShowInitMarquee] = useState<any>(false);

  const el = useRef();

  const style = {
    backgroundColor: lightcolor,
  };

  const styleMarquee = {
    fontSize: fontSize,
  };

  const styleMarqueeItem = {
    display: showInitMarquee ? '' : 'none',
  };

  const tickerSpanStyle = {
    height: '30px',
  };

  const loadFont = () => {
    const totlvideovolume =
      "@font-face{font-family:'Wallstreet';src:url('" +
      chrome.runtime.getURL('wallstreet.eot') +
      "');src:url('" +
      chrome.runtime.getURL('wallstreet.ttf') +
      "')format('truetype');font-weight:normal;font-style:normal}@font-face{font-family:'jd_lcd_roundedregular';src:url('" +
      chrome.runtime.getURL('jdlcdrounded-webfont.eot') +
      "');src:url('" +
      chrome.runtime.getURL('jdlcdrounded-webfont.eot') +
      "?#iefix') format('embedded-opentype'),url('" +
      chrome.runtime.getURL('jdlcdrounded-webfont.woff') +
      "')format('woff'),url('" +
      chrome.runtime.getURL('jdlcdrounded-webfont.ttf') +
      "')format('truetype'),url('" +
      chrome.runtime.getURL('jdlcdrounded-webfont.svg') +
      "#jd_lcd_roundedregular')format('svg');font-weight:normal;font-style:normal}";

    const css = document.createElement('style');
    css.setAttribute('id', 'cssfinancetoolbar');
    css.type = 'text/css';
    css.appendChild(document.createTextNode(totlvideovolume));
    document.getElementsByTagName('head')[0].appendChild(css);
  };

  const fetchAllStocksAndUpdateStorage = async (favs: string[]) => {
    const promises = favs.map((fav) => {
      return new Promise(function (resolve, reject) {
        fetch(`${apiUrl}/stock/${fav}/quote?apikey=${apiKey}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success && data.code === 200) {
              resolve(data.data);
            } else {
              resolve(null);
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          })
          .finally(() => {
            resolve(null);
          });
      });
    });

    const stocks = await Promise.all(promises);
    setStorage('stocks', stocks);
    return stocks;
  };

  const fetchAndPopulateStocks = (favs: string[]) => {
    if (favs && favs.length > 0) {
      let favsLimited: string[] = [];
      if (favs.length > MAX_STOCKS_TO_FETCH) {
        favsLimited = favs.slice(0, MAX_STOCKS_TO_FETCH);
      } else {
        favsLimited = favs;
      }

      chrome.storage.sync.get(
        ['cacheexpiredatenow', 'stocks'],
        async (items: any) => {
          let cacheexpiredatenow = 0;
          if (items['cacheexpiredatenow']) {
            cacheexpiredatenow = items['cacheexpiredatenow'];
          }

          let stocksInStorage: Array<Stock> = [];
          if (items['stocks']) {
            stocksInStorage = items['stocks'];
          }

          let reFetchAllStocks = false;
          favsLimited.forEach((fav) => {
            const exist = stocksInStorage.some((stock: Stock) => {
              return stock && stock.ticker === fav;
            });

            if (!exist) {
              console.log(`${fav} not exist in stock`);
              // newStocks.push(fav);
              reFetchAllStocks = true;
              return;
            }
          });

          const now = Date.now();
          let newStocks;
          if (
            reFetchAllStocks ||
            now - cacheexpiredatenow > CACHE_STOCKS_EXPIRED_MS
          ) {
            newStocks = await fetchAllStocksAndUpdateStorage(favsLimited);

            setStorage('cacheexpiredatenow', now);
          } else {
            if (stocksInStorage && stocksInStorage.length > 0)
              newStocks = stocksInStorage.filter((stockInStorage) =>
                favsLimited.includes(stockInStorage.ticker),
              );
          }
          setStocks(newStocks);
        },
      );
    }
  };

  const load = () => {
    chrome.storage.sync.get(
      [
        // 'enabled',
        'lightcolor',
        'redcolor',
        'greencolor',
        'textcolor',
        'favoritestocks',
        'typeBar',
        'marqueedirection',
        'marqueespeed',
        'fontname',
        'fontsize',
        'isfullname',
        'apiurl',
        'apikey',
      ],
      (items: any) => {
        // setEnabled(items['enabled']);
        setLightcolor(items['lightcolor']);
        setRedcolor(items['redcolor']);
        setGreencolor(items['greencolor']);
        setTextColor(items['textcolor']);

        if (items['favoritestocks']) setFavoriteStocks(items['favoritestocks']);
        if (items['typeBar']) setTypeBar(items['typeBar']);
        if (items['marqueedirection'])
          setMarqueeDirection(items['marqueedirection']);
        if (items['marqueespeed']) setMarqueeSpeed(items['marqueespeed']);
        if (items['fontname']) setFontName(items['fontname']);
        if (items['fontsize']) setFontSize(items['fontsize']);
        if (items['isfullname']) setIsFullName(items['isfullname']);
        if (items['apiurl']) setApiUrl(items['apiurl']);
        if (items['apikey']) setApiKey(items['apikey']);
      },
    );
  };

  useEffect(() => {
    if (
      isReady === true &&
      stocks &&
      stocks.length > 0 &&
      typeBar &&
      marqueeDirection &&
      marqueeSpeed
    ) {
      if (typeBar === 'scrolling') {
        setTimeout(() => {
          setShowInitMarquee(true);
          const $el = $(el.current) as any;
          $el.marquee({
            speed: marqueeSpeed * 20,
            gap: 50,
            pauseOnHover: true,
            delayBeforeStart: 0,
            direction: marqueeDirection,
          });
        }, 500);
      } else {
        setShowInitMarquee(true);
      }
    }
  }, [isReady, stocks, typeBar, marqueeDirection, marqueeSpeed]);

  useEffect(() => {
    if (
      apiUrl &&
      apiKey &&
      favoriteStocks &&
      favoriteStocks.length > 0 &&
      lightcolor &&
      redcolor &&
      greencolor &&
      textColor &&
      typeBar &&
      marqueeDirection
    )
      try {
        setIsReady(false);
        fetchAndPopulateStocks(favoriteStocks);
      } catch (error) {
        console.log('fetchAndPopulateStocks ', error);
      } finally {
        setIsReady(true);
      }
  }, [
    apiUrl,
    apiKey,
    favoriteStocks,
    lightcolor,
    redcolor,
    greencolor,
    textColor,
    typeBar,
    marqueeDirection,
  ]);

  useEffect(() => {
    loadFont();
    load();

    chrome.runtime.onMessage.addListener(function (event) {
      if (event.type === 'apply') {
        setTimeout(() => {
          location.href = location.href;
        }, 1000);
      }
    });
  }, []);
  return (
    <>
      {isReady && (
        <div style={style} className="marqueContainer">
          <div className="logo">
            <a
              href="https://www.theimpeccablestocksoftware.com/free-trial"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={chrome.runtime.getURL('logo-is2.png')}
                width="30"
                height="30"
              />
            </a>
          </div>
          {stocks && stocks.length > 0 && (
            <>
              <div className="arrow">{'<'}</div>
              <div ref={el} className="marquee" style={styleMarquee}>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    height: '30px',
                    alignContent: 'center',
                  }}
                >
                  {stocks.map((stock: any, i) => {
                    return (
                      <span
                        className="ticker"
                        key={i}
                        style={{ fontFamily: fontName }}
                      >
                        <span
                          style={{
                            ...tickerSpanStyle,
                            ...styleMarqueeItem,
                            color: textColor,
                          }}
                        >
                          <a
                            className="link"
                            href={`https://www.google.com/search?site=finance&tbm=fin&q=${stock.ticker}`}
                            target="_blank"
                            rel="noreferrer"
                            // onMouseEnter={() => setMove(false)}
                            // onMouseLeave={() => setMove(true)}
                          >
                            {isFullName
                              ? `${stock.company} (${stock.ticker})`
                              : stock.ticker}
                          </a>
                        </span>
                        <span
                          style={{
                            ...tickerSpanStyle,
                            ...styleMarqueeItem,
                            color: textColor,
                          }}
                        >
                          {stock.price}
                        </span>
                        {stock.change !== 0 && (
                          <span
                            style={{
                              ...tickerSpanStyle,
                              ...styleMarqueeItem,
                              color: stock.change > 0 ? greencolor : redcolor,
                            }}
                          >
                            {stock.change > 0
                              ? `+${
                                  Math.round(stock.change * 100 * 100) / 100
                                }%`
                              : `${
                                  Math.round(stock.change * 100 * 100) / 100
                                }%`}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="arrow">{'>'}</div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Marquee;

// {stocks.map((stock: any, i) => {
//   return (
//     <span
//       className="ticker"
//       key={i}
//       style={{ fontFamily: fontName }}
//     >
//       <span style={{ ...tickerSpanStyle, color: textColor }}>
//         <a
//           className="link"
//           href={`https://www.google.com/search?site=finance&tbm=fin&q=${stock.ticker}`}
//           target="_blank"
//           rel="noreferrer"
//           onMouseEnter={() => setMove(false)}
//           onMouseLeave={() => setMove(true)}
//         >
//           {isFullName ? stock.company : stock.ticker}
//         </a>
//       </span>
//       <span style={{ ...tickerSpanStyle, color: textColor }}>
//         {stock.price}
//       </span>
//       {stock.change !== 0 && (
//         <span
//           style={{
//             ...tickerSpanStyle,
//             color: stock.change > 0 ? greencolor : redcolor,
//           }}
//         >
//           {stock.change > 0 ? `+${stock.change}` : stock.change}
//         </span>
//       )}
//     </span>
//   );
// })}

{
  /* <Ticker
                move={move}
                mode="await"
                speed={
                  typeBar === 'static' ? 0 : marqueeSpeed ? marqueeSpeed : 0
                }
                direction={marqueeDirection === 'right' ? 'toRight' : 'toLeft'}
                // offset={
                //   typeBar === 'static'
                //     ? 0
                //     : // : marqueeDirection === 'right'
                //       // ? 1
                //       '100'
                // }
              >
                {({ index }: { index: number }) => (
                  <>
                    {stocks.map((stock: any, i) => {
                      return (
                        <span
                          className="ticker"
                          key={i}
                          style={{ fontFamily: fontName }}
                        >
                          <span
                            style={{ ...tickerSpanStyle, color: textColor }}
                          >
                            <a
                              className="link"
                              href={`https://www.google.com/search?site=finance&tbm=fin&q=${stock.ticker}`}
                              target="_blank"
                              rel="noreferrer"
                              onMouseEnter={() => setMove(false)}
                              onMouseLeave={() => setMove(true)}
                            >
                              {isFullName ? stock.company : stock.ticker}
                            </a>
                          </span>
                          <span
                            style={{ ...tickerSpanStyle, color: textColor }}
                          >
                            {stock.price}
                          </span>
                          {stock.change !== 0 && (
                            <span
                              style={{
                                ...tickerSpanStyle,
                                color: stock.change > 0 ? greencolor : redcolor,
                              }}
                            >
                              {stock.change > 0
                                ? `+${stock.change}`
                                : stock.change}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </>
                )}
              </Ticker> */
}
