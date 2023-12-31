const Element = require('./element');
const Env = require('./env');
const ScratchRenderer = require('scratch-render');
const Render = class {

    static get W() {
        return innerWidth;
    }
    static get H() {
        return innerHeight;
    }
    constructor(layerGroups = Env.LayerGroup) {
        this.layerGroups = layerGroups;
        this.createRenderer();
    }

    createRenderer (w = Render.W , h = Render.H ) {
        this.canvas = Element.canvas;
        this.renderer = new ScratchRenderer(canvas);
        this.renderer.setLayerGroupOrdering(this.layerGroups);
        this.renderer.resize( w, h );
        //this.renderer.setStageSize( - w/2, w/2, - h/2, h/2 );
        console.log(`w=${w}, h=${h}`);
        console.log(`canvas w=${canvas.width}`);
    }

    createDrawable(layer) {
        const drawableID = this.renderer.createDrawable(layer);
        return drawableID;
    }
};

module.exports = Render;