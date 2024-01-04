const Element = require('./element');
const Env = require('./env');
const ScratchRenderer = require('scratch-render');
const StageLayering = require('./stageLayering');
const Render = class {

    static get W() {
        return innerWidth;
    }
    static get H() {
        return innerHeight;
    }
    constructor(layerGroups = StageLayering.LAYER_GROUPS) {
        this.layerGroups = layerGroups;
        this.stageWidth = 0;
        this.stageHeight = 0;
        this.createRenderer();
    }

    createRenderer (w = Render.W , h = Render.H ) {
        this.canvas = Element.canvas;
        this.renderer = new ScratchRenderer(canvas);
        this.renderer.setLayerGroupOrdering(this.layerGroups);
        this.renderer.resize( w, h );
        // ↓ ないほうがよい。理由は追及していない。
        //this.renderer.setStageSize( - w/2, w/2, - h/2, h/2 );
        const _nativeSize = this.renderer.getNativeSize ();
        this.stageWidth = _nativeSize[0];
        this.stageHeight = _nativeSize[1];
    }

    createDrawable(layer) {
        const drawableID = this.renderer.createDrawable(layer);
        return drawableID;
    }
};

module.exports = Render;