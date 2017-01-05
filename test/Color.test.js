import browserEnv from 'browser-env';
import Color from '../dist/color';
import imageData from '../mock/image-data';
import test from 'ava';

browserEnv();

const mock = new Color('fake');
const rgb = '0, 128, 255';

mock._data = imageData;

test('Call without arguments', t => {
  const error = t.throws(() => {
    new Color();
  });

  t.is(error.name, 'TypeError');
});

test('Call with arguments', t => {
  const amount = 5;
  const blocks = 30;

  const color = new Color('fake', {
    amount: amount,
    blocks: blocks,
  });

  t.is(color.amount, amount);
  t.is(color.blocks, blocks);
});

test('Call with return value', t => {
  t.notThrows(() => {
    new Color(() => 'fake');
  });
});

test('RGB to HEX', t => {
  t.is(mock._rgbToHex(255, 150, 50), '#ff9632');
  t.is(mock._rgbToHex(136, 127, 118), '#887f76');
  t.is(mock._rgbToHex(94, 0, 0), '#5e0000');
});

test('Array format', t => {
  const mock = new Color('fake', {
    format: 'array',
  });

  t.deepEqual(mock._format([rgb]), rgb.split(', '));
});

test('HEX format', t => {
  const mock = new Color('fake', {
    format: 'hex',
  });

  t.is(mock._format([rgb]), '#0080ff');
});

test('RGB format', t => {
  const mock = new Color('fake', {
    format: 'rgb',
  });

  t.is(mock._format([rgb]), 'rgb(' + rgb + ')');
});
