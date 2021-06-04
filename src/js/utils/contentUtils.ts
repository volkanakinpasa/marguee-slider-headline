const hasPositionedParent = function (node: any): any {
  if (node.tagName === 'BODY') return false;
  const parent = node.parentNode;
  const position = getComputedStyle(parent).position;
  if (position !== 'static') {
    return true;
  }
  return hasPositionedParent(parent);
};

const skipPositionedChild = function (node: any) {
  if (node.offsetParent && node.offsetParent.tagName !== 'BODY') return true;
  if (hasPositionedParent(node)) return true;
  return false;
};

const addMarquee = (
  dropshadow: boolean,
  position: string,
  height: number,
): void => {
  const Children = document.body.getElementsByTagName(
    '*',
  ) as HTMLCollectionOf<HTMLElement>;
  for (let i = 0, len = Children.length; i < len; i++) {
    const st = document.defaultView.getComputedStyle(Children[i], null);
    const x = st.getPropertyValue('position');
    const y = st.getPropertyValue('top');
    const z = st.getPropertyValue('bottom');
    const q = st.getPropertyValue('height');

    if (position !== 'bottom') {
      if ((x == 'absolute' || x == 'fixed') && y !== 'auto') {
        if (x === 'absolute' && skipPositionedChild(Children[i])) {
        } else {
          if (y == '0px') {
            Children[i].setAttribute('data-financetoolbar', 'true');
            Children[i].setAttribute('data-sfttop', Children[i].style.top);
            Children[i].style.top = parseInt(y, 10) + height.toString() + 'px';
            // if "top" and "bottom" is 0 => then calc height
            if (q != 'auto' && y == '0px' && z == '0px') {
              Children[i].setAttribute('data-sftheight', q);
              Children[i].style.height =
                'calc(100% - ' + height.toString() + ')';
            }
          } else if (z == '0px') {
            //Children[i].setAttribute("data-financetoolbar",true);
            //Children[i].setAttribute("data-sftbottom",Children[i].style.bottom);
            //Children[i].style.bottom = parseInt(z, 10) + parseInt(height, 10) + "px";
          }
        }
      }
    } else {
      if ((x == 'absolute' || x == 'fixed') && z !== 'auto') {
        if (x === 'absolute' && skipPositionedChild(Children[i])) {
        } else {
          if (z == '0px') {
            Children[i].setAttribute('data-financetoolbar', 'true');
            Children[i].setAttribute(
              'data-sftbottom',
              Children[i].style.bottom,
            );
            Children[i].style.bottom =
              parseInt(z, 10) + height.toString() + 'px';
            // if "top" and "bottom" is 0 => then calc height
            if (q != 'auto' && y == '0px' && z == '0px') {
              Children[i].setAttribute('data-sftheight', q);
              Children[i].style.height = 'calc(100% - ' + height + ')';
            }
          } else if (y == '0px') {
            //Children[i].setAttribute("data-financetoolbar",true);
            //Children[i].setAttribute("data-sftbottom",Children[i].style.bottom);
            //Children[i].style.bottom = parseInt(y, 10) + parseInt(height, 10) + "px";
          }
        }
      }
    }
  }
  const divblock = document.createElement('div');
  divblock.setAttribute('id', 'finance-marquee');
  if (position === 'top') {
    document.body.insertBefore(divblock, document.body.firstChild);
  } else {
    document.body.appendChild(divblock);
  }

  const frame = document.createElement('iframe');
  frame.setAttribute('src', '' + chrome.runtime.getURL('marquee.html') + '');
  frame.setAttribute('id', 'marquee');
  frame.setAttribute('allowtransparency', 'true');
  frame.setAttribute('scrolling', 'no');
  frame.setAttribute('width', '100%');

  frame.style.height = height.toString() + 'px';
  divblock.style.height = height.toString() + 'px';

  frame.style.border = 'none';
  // frame.style.position = 'fixed';
  divblock.style.position = 'fixed';

  if (position !== 'bottom') {
    frame.style.top = '0px';
    divblock.style.top = '0px';
  } else {
    frame.style.bottom = '0px';
    divblock.style.bottom = '0px';
  }
  frame.style.left = '0px';
  divblock.style.left = '0px';

  divblock.style.marginBottom = '0px';
  divblock.style.marginTop = '0px';

  frame.style.marginBottom = '0px';
  frame.style.marginTop = '0px';
  divblock.style.marginLeft = '0px';
  frame.style.marginLeft = '0px';
  divblock.style.zIndex = '9999999999';
  frame.style.zIndex = '9999999999';
  divblock.style.width = '100%';
  frame.style.width = '100%';
  divblock.style.boxSizing = 'border-box';
  frame.style.boxSizing = 'border-box';
  if (dropshadow == true) {
    if (position !== 'bottom') {
      frame.style.boxShadow = '0px 2px 10px rgba(0,0,0,.2)';
    } else {
      frame.style.boxShadow = '0px -2px 10px rgba(0,0,0,.2)';
    }
  }

  divblock.appendChild(frame);
  // divblock.addEventListener('mouseover', (e) => {
  //   chrome.runtime.sendMessage({ type: 'pause' });
  // });
  // divblock.addEventListener('mouseout', (e) => {
  //   chrome.runtime.sendMessage({ type: 'resume' });
  // });
  // document.body.appendChild(frame);
};

const removeMarquee = (): void => {
  const marquees = document.querySelectorAll('#finance-marquee');
  if (marquees) {
    marquees.forEach((marquee) => {
      document.body.removeChild(marquee);
    });
  }
  const iframes = document.querySelectorAll('#marquee');
  if (iframes) {
    iframes.forEach((iframe) => {
      document.body.removeChild(iframe);
    });
  }
};

const contentUtils = {
  addMarquee,
  removeMarquee,
};

export default contentUtils;
