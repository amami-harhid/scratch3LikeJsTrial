const Backdrops = require('../lib/backdrops');
const Costumes = require('../lib/costumes');
const Element = require('../lib/element');
const Env = require('../lib/env');
const Render = require('../lib/render');
const Stage = require('../lib/stage');
const Sprite = require('../lib/sprite');
const Utils = require('../lib/utils');

const LS = {};
LS.Backdrops = Backdrops;
LS.Costumes = Costumes;
LS.Element = Element;
LS.Env = Env;
LS.Render = Render;
LS.Stage = Stage;
LS.Sprite = Sprite;
LS.Utils = Utils;

window.LS = LS;

window.onload = function(){
    Element.init();
    LS.start();
};
