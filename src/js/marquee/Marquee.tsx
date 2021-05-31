import React, { FC, useEffect, useState } from 'react';
import Ticker from 'react-ticker';
import {
  CACHE_STOCKS_EXPIRED_MS,
  MAX_STOCKS_TO_FETCH,
} from '../utils/constants';
import './marquee.css';
import storageUtils from '../utils/storageUtils';
import { Button } from 'antd';

const { setStorage } = storageUtils;

interface Props {}

const Marquee: FC<Props> = (props: Props) => {
  const [isReady, setIsRead] = useState(false);
  const [move, setMove] = useState(true);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [lightcolor, setLightcolor] = useState<string>('');
  const [redcolor, setRedcolor] = useState<string>('');
  const [greencolor, setGreencolor] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('');
  const [favoriteStocks, setFavoriteStocks] = useState<string[]>([]);
  const [stocks, setStocks] = useState<any[]>([]);
  const [
    favoriteStocksSearching,
    setFavoriteStocksSearching,
  ] = useState<boolean>(false);
  const [typeBar, setTypeBar] = useState<string>('');
  const [allwebsites, setAllwebsites] = useState<string>('');
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([]);
  const [marqueeBehaviour, setMarqueeBehaviour] = useState<string>('');
  const [marqueeDirection, setMarqueeDirection] = useState<string>('');
  const [marqueeSpeed, setMarqueeSpeed] = useState<number>(null);
  const [fontName, setFontName] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(null);
  const [dropShadow, setDropShadow] = useState<boolean>(true);
  const [position, setPosition] = useState<string>('');
  const [isFullName, setIsFullName] = useState<boolean>(false);
  const [apiUrl, setApiUrl] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');

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

          let stocksInStorage: any = [];
          if (items['stocks']) {
            stocksInStorage = items['stocks'];
          }

          let reFetchAllStocks = false;
          favsLimited.forEach((fav) => {
            const exist = stocksInStorage.some((stock: any) => {
              return stock && stock.ticker === fav;
            });
            if (!exist) {
              console.log(`${fav} not exist in stock`);
              // newStocks.push(fav);
              reFetchAllStocks = true;
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
            newStocks = stocksInStorage;
          }
          setStocks(newStocks);
        },
      );
    }
  };

  const load = () => {
    loadFont();
    chrome.storage.sync.get(
      [
        'enabled',
        'lightcolor',
        'redcolor',
        'greencolor',
        'textcolor',
        'favoritestocks',
        'typeBar',
        'allwebsites',
        'selectedwebsites',
        'marqueebehaviour',
        'marqueedirection',
        'marqueespeed',
        'fontname',
        'fontsize',
        'dropshadow',
        'position',
        'isfullname',
        'apiurl',
        'apikey',
      ],
      (items: any) => {
        //todo: hide all
        setEnabled(items['enabled']);
        setLightcolor(items['lightcolor']);
        setRedcolor(items['redcolor']);
        setGreencolor(items['greencolor']);
        setTextColor(items['textcolor']);

        if (items['favoritestocks']) setFavoriteStocks(items['favoritestocks']);
        if (items['typeBar']) setTypeBar(items['typeBar']);
        if (items['allwebsites']) setAllwebsites(items['allwebsites']);
        if (items['selectedwebsites'])
          setSelectedWebsites(items['selectedwebsites']);

        if (items['marqueebehaviour'])
          setMarqueeBehaviour(items['marqueebehaviour']);
        if (items['marqueedirection'])
          setMarqueeDirection(items['marqueedirection']);
        if (items['marqueespeed']) setMarqueeSpeed(items['marqueespeed']);
        if (items['fontname']) setFontName(items['fontname']);
        if (items['fontsize']) setFontSize(items['fontsize']);
        if (items['dropshadow']) setDropShadow(items['dropshadow']);
        if (items['position']) setPosition(items['position']);
        if (items['isfullname']) setIsFullName(items['isfullname']);
        if (items['apiurl']) setApiUrl(items['apiurl']);
        if (items['apikey']) setApiKey(items['apikey']);
        //todo: show all

        // document.body.style.backgroundColor = `${lightcolor}`;
      },
    );
  };
  useEffect(() => {
    // loadFont();
    load();

    chrome.runtime.onMessage.addListener(function (event) {
      if (event.type === 'apply') {
        setTimeout(() => {
          load();
        }, 1000);
      }
    });
  }, []);

  useEffect(() => {
    if (
      apiUrl &&
      apiKey &&
      favoriteStocks &&
      favoriteStocks.length > 0 &&
      lightcolor &&
      redcolor &&
      greencolor &&
      textColor
    )
      try {
        setIsRead(false);
        fetchAndPopulateStocks(favoriteStocks);
      } catch (error) {
        console.log('fetchAndPopulateStocks ', error);
      } finally {
        setIsRead(true);
      }
  }, [
    apiUrl,
    apiKey,
    favoriteStocks,
    lightcolor,
    redcolor,
    greencolor,
    textColor,
  ]);

  const style = {
    fontSize: fontSize,
    backgroundColor: lightcolor,
  };

  const tickerSpanStyle = {
    height: '30px',
  };
  return (
    <>
      {isReady && (
        <div
          onMouseEnter={() => setMove(false)}
          onMouseLeave={() => setMove(true)}
          style={style}
          className="marqueContainer"
        >
          {stocks && stocks.length > 0 && (
            <>
              <div className="arrow">{'<'}</div>
              <Ticker
                move={move}
                mode="await"
                speed={
                  typeBar === 'static' ? 0 : marqueeSpeed ? marqueeSpeed : 0
                }
                direction={marqueeDirection === 'right' ? 'toRight' : 'toLeft'}
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
              </Ticker>

              <div className="arrow">{'>'}</div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Marquee;
