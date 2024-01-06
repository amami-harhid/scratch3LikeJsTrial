const Element = require('./element');
const Env = require('./env');
const ScratchRenderer = require('scratch-render');
const StageLayering = require('./stageLayering');
const Render = class {

    static get W() {
        const Scratch3StageWidth = 240;
        const WHRate = 0.75; // ( 3/4 )
        const InnerWidthRate = 1;// 0.95; //0.8;
        const InnerHeightRate = 1;
        let w = innerWidth * InnerWidthRate;
        let h = w * WHRate;
        const hLimit = innerHeight * InnerHeightRate;
        if( h > hLimit ) {
            h = hLimit;
            w = h / WHRate;
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