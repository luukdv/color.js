import browserEnv from 'browser-env';
import Color from '../dist/color';
import imageData from '../mock/image-data';
import test from 'ava';

browserEnv();

function createMock() {
  const mock = new Color('fake');

  mock._running = false;
  mock._data = imageData;

  return mock;
}

/**
 * General
 */

test('Call without arguments', t => {
  const error = t.throws(() => {
    new Color();
  });

  t.is(error.name, 'TypeError');
});

test('Call with arguments', t => {
  const amount = 5;
  const group = 30;
  const sample = 20;

  const color = new Color('fake', {
    amount: amount,
    group: group,
    sample: sample,
  });

  t.is(color.amount, amount);
  t.is(color.group, group);
  t.is(color.sample, sample);
});

test('Call with return value', t => {
  t.notThrows(() => {
    new Color(() => 'fake');
  });
});

/**
 * Helpers
 */

const mock = createMock();
const rgb = '0, 128, 255';

test('RGB to HEX', t => {
  t.is(mock._rgbToHex(255, 150, 50), '#ff9632');
  t.is(mock._rgbToHex(136, 127, 118), '#887f76');
  t.is(mock._rgbToHex(0, 194, 0), '#00c200');
  t.is(mock._rgbToHex(10, 0, 0), '#0a0000');
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

test('Round to groups', t => {
  t.is(mock._roundToGroups(96), 100);
});

/**
 * Color extraction
 */

test('Extract channels', t => {
  t.deepEqual(mock._extractChannels(), {
    amount: 240,
    colors: {
      r: 20606,
      g: 20465,
      b: 22918,
    },
  });
});

test('Extract color groups', t => {
  const colors = mock._extractColorGroups();

  t.deepEqual(colors[0], {
    color: '0, 60, 140',
    count: 71,
  });

  t.deepEqual(colors[colors.length - 1], {
    color: '220, 20, 40',
    count: 1,
  });
});

/**
 * API
 */

test('API without callback', t => {
  const error = t.throws(() => {
    mock.average();
  });

  t.is(error.name, 'ReferenceError');
});

test('API with callback', t => {
  t.notThrows(() => {
    mock.average(() => {});
  });
});

test.cb('Average', t => {
  mock.average(result => {
    t.is(result, 'rgb(86, 85, 95)');
    t.end();
  });
});

test.cb('Most used', t => {
  mock.mostUsed(result => {
    t.deepEqual(result, [
      'rgb(0, 60, 140)',
      'rgb(220, 0, 40)',
      'rgb(0, 160, 60)',
    ]);
    t.end();
  });
});

test.cb('Least used', t => {
  mock.leastUsed(result => {
    t.deepEqual(result, [
      'rgb(220, 20, 40)',
      'rgb(40, 160, 100)',
      'rgb(240, 255, 240)',
    ]);
    t.end();
  });
});

const singular = createMock();
singular.amount = 1;

test.cb('Most used: singular', t => {
  singular.mostUsed(result => {
    t.is(result, 'rgb(0, 60, 140)');
    t.end();
  });
});

test.cb('Least used: singular', t => {
  singular.leastUsed(result => {
    t.is(result, 'rgb(220, 20, 40)');
    t.end();
  });
});
