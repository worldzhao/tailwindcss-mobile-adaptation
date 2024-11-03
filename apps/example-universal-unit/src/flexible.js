import { isMobile } from 'is-mobile';

const UI_WIDTH = 375;
const baseFontSize = 100;

function setRootFontSize() {
  const width = document.documentElement?.clientWidth;
  const fontSize = ((parseFloat(width) / UI_WIDTH) * baseFontSize).toFixed(4);
  document.documentElement.style['fontSize'] = `${fontSize}px`;
}

if (isMobile()) {
  setRootFontSize();
  document.documentElement.style.setProperty('--tpx', '0.01rem');
  window.addEventListener('resize', setRootFontSize);
} else {
  document.documentElement.style['fontSize'] = `16px`;
  document.documentElement.style.setProperty('--tpx', '1px');
}
