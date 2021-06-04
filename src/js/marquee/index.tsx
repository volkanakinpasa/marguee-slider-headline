import React from 'react';
import { render } from 'react-dom';
import Marquee from './Marquee';

window.addEventListener('load', () => {
  render(<Marquee />, window.document.getElementById('app-container'));
});
