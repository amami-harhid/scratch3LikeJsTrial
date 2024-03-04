const Canvas = require('./canvas');
const Env = require('./env');
const Entity = require('./entity');
const Process = require('./process');
const StageLayering = require('./stageLayering');
const Utils = require('./utils');
const Text = class  {
    constructor( name='text' ) {
        this.render = Process.default.render;
        this.drawableID = this.render.createDrawable( StageLayering.TEXT_LAYER );
        this.id = Utils.generateUUID();
    }
    drawText( text ) {

    }
};

module.exports = Text;