const Element = require('./element');
const Env = require('./env');
const ScratchRenderer = require('scratch-render');
const StageLayering = require('./stageLayering');
const Render = class {

    static get W() {
        let w = Math.max(innerWidth * 0.8, 240);
        let h = w * 0.75;
        const hLimit = innerHeight * 0.95;
        if( h > hLimit ) {
            h = hLimit;
            w = h / 0.75
        }
        return w;
    }
    static get H() {
        return Render.W * 0.75;
    }
    constructor(layerGroups = StageLayering.LAYER_GROUPS) {
        this.layerGroups = layerGroups;
        this.stageWidth = 0;
        this.stageHeight = 0;
        this.createRenderer();
        const me = this;
        const main = Element.main;
        const flag = Element.flag;
        const resizeWindow = function() {
            Element.mainPositioning(main);
            if(flag){
                Element.flagPositioning(flag);
            }

            me.stageResize();
        };
        window.addEventListener('resize', resizeWindow);
    }
    stageResize(w = Render.W , h = Render.H) {
        this.renderer.resize( w, h );
        // ↓ ないほうがよい。理由は追及していない。
        //this.renderer.setStageSize( - w/2, w/2, - h/2, h/2 );
        const _nativeSize = this.renderer.getNativeSize ();
        this.stageWidth = _nativeSize[0];
        this.stageHeight = _nativeSize[1];

    }
    createRenderer (w = Render.W , h = Render.H ) {
        this.canvas = Element.canvas;
        this.renderer = new ScratchRenderer(canvas);
        this.renderer.setLayerGroupOrdering(this.layerGroups);
        this.stageResize(w,h);
    }

    createDrawable(layer) {
        const drawableID = this.renderer.createDrawable(layer);
        return drawableID;
    }
};

module.exports = Render;