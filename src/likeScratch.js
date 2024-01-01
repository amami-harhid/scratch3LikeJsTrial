const Backdrops = require('../lib/backdrops');
const Css = require('../lib/css');
const Costumes = require('../lib/costumes');
const Element = require('../lib/element');
const Env = require('../lib/env');
const Process = require('../lib/process');
const Render = require('../lib/render');
const Sounds = require('../lib/sounds');
const Stage = require('../lib/stage');
const Sprite = require('../lib/sprite');
const Utils = require('../lib/utils');

//const AudioEngine = require('scratch-audio');

const LS = {};
LS.Backdrops = Backdrops;
LS.Costumes = Costumes;
LS.Element = Element;
LS.Env = Env;
LS.Process = Process;
LS.Render = Render;
LS.Sounds = Sounds;
LS.Stage = Stage;
LS.Sprite = Sprite;
LS.Utils = Utils;
//LS.AudioEngine = AudioEngine;

window.LS = LS;
Element.insertCss();

LS.process = new Process();
window.onload = async function(){
    await Element.init();
    //LS.start();
    Process.allowedToStart = false;
};
