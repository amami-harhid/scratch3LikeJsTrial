//const Backdrops = require('../lib/backdrops');
//const Canvas = require('../lib/canvas');
//const Css = require('../lib/css');
//const Costumes = require('../lib/costumes');
//const Env = require('../lib/env');
//const Looks = require('../lib/looks');

//import Process from '../lib/process';
const Process = require('../lib/process');
//const Render = require('../lib/render');
//const Sounds = require('../lib/sounds');
//const Stage = require('../lib/stage');
//const Sprite = require('../lib/sprite');
//const Utils = require('../lib/utils');

//const AudioEngine = require('scratch-audio');

/*
const LS = {};
LS.Backdrops = Backdrops;
//LS.Canvas = Canvas;
LS.Costumes = Costumes;
LS.Element = Element;
LS.Env = Env;
LS.Looks = Looks;
LS.Render = Render;
LS.Sounds = Sounds;
LS.Stage = Stage;
LS.Sprite = Sprite;
LS.Utils = Utils;
//LS.AudioEngine = AudioEngine;

window.LS = LS;
*/
window.P = Process.default; //.getInstance();
const Element = P.Element;
Element.insertCss();

//LS.process = Process.instance;
window.onload = async function(){
    await Element.init();
};
