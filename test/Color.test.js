import browserEnv from 'browser-env';
import Color from '../dist/color';
import test from 'ava';

browserEnv();

const mock = new Color('../img/flag.jpg');
