import React, { FC, useEffect, useState } from 'react';
import '../../css/index.css';
import './option.css';
import 'antd/dist/antd.less';
import Marquee from '../marquee/Marquee';
import {
  SettingTwoTone,
  HighlightTwoTone,
  CheckOutlined,
  CloseOutlined,
  DeleteTwoTone,
  VerticalAlignMiddleOutlined,
} from '@ant-design/icons';

import {
  Tabs,
  Switch,
  Divider,
  Input,
  Radio,
  Space,
  Select,
  Slider,
  Checkbox,
  Button,
} from 'antd';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import storageUtils from '../utils/storageUtils';

const { setStorage } = storageUtils;

const Options: FC = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [lightcolor, setLightcolor] = useState<string>('');
  const [redcolor, setRedcolor] = useState<string>('');
  const [greencolor, setGreencolor] = useState<string>('');
  const [textcolor, setTextcolor] = useState<string>('');
  const [favoriteStocks, setFavoriteStocks] = useState<string[]>([]);
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

  const applyMarqueeRealTime = () => {
    chrome.runtime.sendMessage({ type: 'apply' });
  };

  const validURL = (str: string): boolean => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator
    return !!pattern.test(str);
  };

  const DragHandle = SortableHandle(() => (
    <span style={{ marginRight: '10px' }}>
      <VerticalAlignMiddleOutlined />
    </span>
  ));

  const SortableItem = SortableElement(
    ({ value, sortIndex, onDelete }: any) => (
      <li>
        <Space direction="horizontal" align="center" style={{ height: '35px' }}>
          <DragHandle />
          {value} - #{sortIndex}
          <button
            onClick={() => {
              onDelete();
            }}
          >
            <DeleteTwoTone style={{ fontSize: '16px' }} />
          </button>
        </Space>
      </li>
    ),
  );
  const CustomSortableContainer = SortableContainer(({ children }: any) => {
    return <ul>{children}</ul>;
  });
  const { TabPane } = Tabs;
  const { Search } = Input;
  const { Option } = Select;

  useEffect(() => {
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
        setTextcolor(items['textcolor']);

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
      },
    );
  }, []);

  const refreshContent = () => {
    chrome.runtime.sendMessage({ type: 'refreshContent' });
  };

  const renderMarquee = () => {
    return (
      <div>
        <Divider orientation="left">Example</Divider>
        <iframe
          scrolling="no"
          style={{ width: '100%', height: '30px', border: 'none' }}
          src={chrome.runtime.getURL('marquee.html')}
        />
      </div>
    );
  };

  const renderEnableExtension = () => {
    return (
      <div>
        <Divider orientation="left">Enable/Disable Extension</Divider>
        <div>
          <Switch
            // checkedChildren={<CheckOutlined />}
            // unCheckedChildren={<CloseOutlined />}
            checked={enabled}
            onClick={(checked: boolean) => {
              setStorage('enabled', checked);
              setEnabled(checked);
              refreshContent();
            }}
          />
        </div>
      </div>
    );
  };

  const renderColor = () => {
    return (
      <div>
        <Divider orientation="left">Color</Divider>
        <datalist id="datalightcolor">
          <option>#FFFFFF</option>
          <option>#FF0000</option>
          <option>#FF7700</option>
          <option>#FFEE00</option>
          <option>#00FF00</option>
          <option>#008000</option>
          <option>#3CB4FE</option>
          <option>#0000FF</option>
          <option>#808080</option>
          <option>#000000</option>
        </datalist>
        <div className="md-color">
          <div className="input-color-container">
            <input
              id="lightcolor"
              type="color"
              className="color"
              list="datalightcolor"
              value={lightcolor}
              onChange={(e) => {
                setLightcolor(e.target.value);
                setStorage('lightcolor', e.target.value);
              }}
            />
          </div>
          <label htmlFor="lightcolor">
            <div>
              <span data-i18n="descolor">
                The background color of the toolbar
              </span>
            </div>
          </label>
        </div>
        <div className="md-color">
          <div className="input-color-container">
            <input
              id="redcolor"
              type="color"
              className="color"
              list="datalightcolor"
              value={redcolor}
              onChange={(e) => {
                setRedcolor(e.target.value);
                setStorage('redcolor', e.target.value);
              }}
            />
          </div>
          <label htmlFor="redcolor">
            <div>
              <span data-i18n="desredcolor">The red color of the toolbar</span>
            </div>
          </label>
        </div>
        <div className="md-color">
          <div className="input-color-container">
            <input
              id="greencolor"
              type="color"
              className="color"
              list="datalightcolor"
              value={greencolor}
              onChange={(e) => {
                setGreencolor(e.target.value);
                setStorage('greencolor', e.target.value);
              }}
            />
          </div>
          <label htmlFor="greencolor">
            <div>
              <span data-i18n="desgreencolor">
                The green color of the toolbar
              </span>
            </div>
          </label>
        </div>
        <div className="md-color">
          <div className="input-color-container">
            <input
              id="textcolor"
              type="color"
              className="color"
              list="datalightcolor"
              value={textcolor}
              onChange={(e) => {
                setTextcolor(e.target.value);
                setStorage('textcolor', e.target.value);
              }}
            />
          </div>
          <label htmlFor="textcolor">
            <div>
              <span data-i18n="destextcolor">
                The text color of the toolbar
              </span>
            </div>
          </label>
        </div>
      </div>
    );
  };

  const renderQuotes = () => {
    return (
      <div>
        <Divider orientation="left">Quotes</Divider>
        <Space direction="vertical">
          <Space direction="horizontal">
            <div>Stocks</div>
            <div>
              <Search
                placeholder="enter stock name and press add"
                allowClear
                enterButton="Add"
                loading={favoriteStocksSearching}
                onSearch={(value) => {
                  if (!value) return;

                  setFavoriteStocksSearching(true);
                  const stocks = [...favoriteStocks];

                  if (stocks.includes(value)) {
                    alert(`${value} already exists`);
                    setFavoriteStocksSearching(false);
                    return;
                  }
                  fetch(`${apiUrl}/stock/${value}/verify?apikey=${apiKey}`, {
                    method: 'GET', // *GET, POST, PUT, DELETE, etc.

                    headers: {
                      'Content-Type': 'application/json',
                    },
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      if (data.success && data.code === 200) {
                        stocks.push(value);
                        setFavoriteStocks(stocks);
                        setStorage('favoritestocks', stocks);
                      } else {
                        alert(data.message);
                      }
                    })
                    .catch((error) => {
                      console.error('Error:', error);
                    })
                    .finally(() => {
                      setFavoriteStocksSearching(false);
                      value = '';
                    });
                }}
                style={{ width: 400 }}
              />
            </div>
          </Space>

          <CustomSortableContainer
            // items={favoriteStocks ? favoriteStocks : []}
            onSortEnd={({ oldIndex, newIndex }: any) => {
              const itemsUpdated: any = arrayMove(
                favoriteStocks,
                oldIndex,
                newIndex,
              );
              setFavoriteStocks(itemsUpdated);
              setStorage('favoritestocks', itemsUpdated);
            }}
            useDragHandle
          >
            {favoriteStocks.map((value, index) => (
              <SortableItem
                key={`item-${value}`}
                index={index}
                value={value}
                sortIndex={index}
                onDelete={() => {
                  const tempData = favoriteStocks.filter((e) => e !== value);
                  setFavoriteStocks(tempData);
                  setStorage('favoritestocks', tempData);
                }}
              />
            ))}
          </CustomSortableContainer>
        </Space>
      </div>
    );
  };

  const renderTypeBar = () => (
    <div>
      <Divider orientation="left">Type Bar</Divider>
      <Radio.Group
        onChange={(e) => {
          setTypeBar(e.target.value);
          setStorage('typeBar', e.target.value);
        }}
        value={typeBar}
      >
        <Space direction="vertical">
          <Radio value={'scrolling'}>Scrolling Bar</Radio>
          <Radio value={'static'}>Static Bar</Radio>
        </Space>
      </Radio.Group>
    </div>
  );

  const renderAllWebsites = () => {
    return (
      <div>
        <Divider orientation="left">All Websites</Divider>
        <Space direction="vertical">
          <Space direction="vertical">
            <Radio.Group
              onChange={(e) => {
                setAllwebsites(e.target.value);
                setStorage('allwebsites', e.target.value);
              }}
              value={allwebsites}
            >
              <Space direction="vertical">
                <Radio value={'all'}>Visible on all websites</Radio>
                <Radio value={'selected'}>
                  Only visible on selected webnsites
                </Radio>
              </Space>
            </Radio.Group>
          </Space>
          <Space direction="horizontal">
            <div>Website</div>
            <div>
              <Search
                placeholder="enter website address and press add"
                allowClear
                enterButton="Add"
                onSearch={(value) => {
                  if (!value) return;

                  if (!validURL(value)) alert('please enter a valid url');

                  const websites = [...selectedWebsites];
                  if (websites.includes(value)) {
                    alert(`${value} already exists`);
                    return;
                  }

                  websites.push(value);
                  setSelectedWebsites(websites);
                  setStorage('selectedwebsites', websites);
                }}
                style={{ width: 400 }}
                disabled={allwebsites !== 'selected'}
              />
            </div>
          </Space>

          <CustomSortableContainer
            onSortEnd={({ oldIndex, newIndex }: any) => {
              const itemsUpdated: any = arrayMove(
                selectedWebsites,
                oldIndex,
                newIndex,
              );
              setSelectedWebsites(itemsUpdated);
              setStorage('selectedwebsites', itemsUpdated);
            }}
            useDragHandle
          >
            {selectedWebsites.map((value, index) => (
              <SortableItem
                key={`item-${value}`}
                index={index}
                value={value}
                sortIndex={index}
                onDelete={() => {
                  const tempData = selectedWebsites.filter((e) => e !== value);
                  setSelectedWebsites(tempData);
                  setStorage('selectedwebsites', tempData);
                }}
              />
            ))}
          </CustomSortableContainer>
        </Space>
      </div>
    );
  };

  const marqueeOptions = () => {
    return (
      <div>
        <Divider orientation="left">Marquee</Divider>
        <Space direction="vertical">
          {/* <Space direction="vertical">
            <div>Behaviour</div>
            <div>
              <Select
                value={marqueeBehaviour}
                showSearch
                style={{ width: 200 }}
                placeholder="Select a behaviour"
                onChange={(value: string) => {
                  setMarqueeBehaviour(value);
                  setStorage('marqueebehaviour', value);
                }}
              >
                <Option value="scroll">Scroll</Option>
                <Option value="bouce">Bounce</Option>
              </Select>
            </div>
          </Space> */}
          <Space direction="vertical">
            <div>Direction</div>
            <div>
              <Select
                value={marqueeDirection}
                showSearch
                style={{ width: 200 }}
                placeholder="Select a direction"
                onChange={(value: string) => {
                  setMarqueeDirection(value);
                  setStorage('marqueedirection', value);
                }}
              >
                <Option value="left">Left</Option>
                <Option value="right">Right</Option>
              </Select>
            </div>
          </Space>
          <Space direction="vertical">
            <div>Speed</div>
            <div>
              <Space direction="horizontal" size="middle">
                <Slider
                  value={marqueeSpeed}
                  onChange={(value: number) => {
                    setMarqueeSpeed(value);
                    setStorage('marqueespeed', value);
                  }}
                  min={0}
                  max={10}
                  defaultValue={3}
                  marks={{ 1: '1', 3: '3', '7': '7' }}
                  style={{ width: 300 }}
                />
                {`${marqueeSpeed}`}
              </Space>
            </div>
          </Space>
        </Space>
      </div>
    );
  };
  const renderFontOptionns = () => {
    return (
      <div>
        <Divider orientation="left">Font</Divider>
        <Space direction="vertical">
          <Space direction="vertical">
            <div>Font name</div>
            <div>
              <Select
                value={fontName}
                showSearch
                style={{ width: 200 }}
                placeholder="Select a font name"
                onChange={(value: string) => {
                  setFontName(value);
                  setStorage('fontname', value);
                }}
              >
                <Option value="jd_lcd_roundedregular">
                  jd_lcd_roundedregular
                </Option>
                <Option value="Arial">Arial</Option>
                <Option value="Impact">Impact</Option>
                <Option value="Sans-serif">Sans-serif</Option>
                <Option value="Times New Roman">Times New Roman</Option>
                <Option value="verdana">Verdana</Option>
                <Option value="wallstreet">Wallstreet</Option>
              </Select>
            </div>
          </Space>
          <Space direction="vertical">
            <div>Font size</div>
            <div>
              <Space direction="horizontal" size="middle">
                <Slider
                  marks={{
                    16: '16px',
                    30: '30px',
                    50: '50px',
                    80: '80px',
                  }}
                  value={fontSize}
                  onChange={(value: number) => {
                    setFontSize(value);
                    setStorage('fontsize', value);
                  }}
                  style={{ width: 300 }}
                  min={14}
                  max={100}
                />
                {`${fontSize}px`}
              </Space>
            </div>
          </Space>
        </Space>
      </div>
    );
  };
  const rendeDropShadowOptions = () => {
    return (
      <div>
        <Divider orientation="left">Drop Shadow</Divider>
        <Checkbox
          checked={dropShadow}
          onChange={(e) => {
            setDropShadow(e.target.checked);
            setStorage('dropshadow', e.target.checked);
          }}
        >
          Shadow effect below
        </Checkbox>
      </div>
    );
  };
  const renderPositonOptions = () => {
    return (
      <div>
        <Divider orientation="left">Position</Divider>
        <Space direction="vertical">
          <Radio.Group
            onChange={(e) => {
              setPosition(e.target.value);
              setStorage('position', e.target.value);
            }}
            value={position}
          >
            <Space direction="vertical">
              <Radio value={'top'}>Top</Radio>
              <Radio value={'bottom'}>Bottom</Radio>
            </Space>
          </Radio.Group>
        </Space>
      </div>
    );
  };
  const renderFullName = () => {
    return (
      <div>
        <Divider orientation="left">Fullname</Divider>
        <Checkbox
          checked={isFullName}
          onChange={(e) => {
            setIsFullName(e.target.checked);
            setStorage('isfullname', e.target.checked);
          }}
        >
          Show full name of the stock
        </Checkbox>
      </div>
    );
  };

  const renderBasic = () => {
    return (
      <Space direction="vertical" size="middle" className="w-full">
        {renderMarquee()}
        {renderEnableExtension()}
        {renderColor()}
        {renderQuotes()}
        {renderTypeBar()}
        {renderAllWebsites()}
      </Space>
    );
  };

  const renderDesign = () => {
    return (
      <Space direction="vertical" size="middle" className="w-full">
        {marqueeOptions()}
        {renderFontOptionns()}
        {rendeDropShadowOptions()}
        {renderPositonOptions()}
        {renderFullName()}
      </Space>
    );
  };
  return (
    <>
      <div className="container">
        <Tabs defaultActiveKey="1" tabPosition={'left'}>
          <TabPane
            tab={
              <Space direction="horizontal">
                <SettingTwoTone />
                Basics
              </Space>
            }
            key="1"
          >
            <div className="tab-item">{renderBasic()}</div>
          </TabPane>
          <TabPane
            tab={
              <Space direction="horizontal">
                <HighlightTwoTone />
                Design
              </Space>
            }
            key="2"
          >
            <div className="tab-item">{renderDesign()}</div>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default Options;
