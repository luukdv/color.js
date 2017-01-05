import browserEnv from 'browser-env';
import Color from '../dist/color';
import test from 'ava';

browserEnv();

const mock = new Color('../img/flag.jpg');

test('RGB to HEX', t => {
  t.is(mock._rgbToHex(255, 150, 50), '#ff9632');
  t.is(mock._rgbToHex(136, 127, 118), '#887f76');
  t.is(mock._rgbToHex(94, 0, 0), '#5e0000');
});
