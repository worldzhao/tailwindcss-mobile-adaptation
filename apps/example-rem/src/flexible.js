const UI_WIDTH = 375;
const baseFontSize = 100;

function setRootFontSize() {
  const width = document.documentElement?.clientWidth;
  const fontSize = ((parseFloat(width) / UI_WIDTH) * baseFontSize).toFixed(4);
  document.documentElement.style['fontSize'] = `${fontSize}px`;
  document.documentElement.style.setProperty('--tpx', '0.01rem');
}

setRootFontSize();

window.addEventListener('resize', setRootFontSize);
