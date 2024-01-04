const Backdrops = require('./backdrops');
const Canvas = require('./canvas');
const Entity = require('./entity');
const Sensing = require('./sensing');
const Sounds = require('./sounds');
const StageLayering = require('./stageLayering');
const Utils = require('./utils');
const Stage = class extends Entity {
    constructor(render, name, options={}) {
        super(render, name, StageLayering.BACKGROUND_LAYER);    
        this.effect = {
            color : ('effect' in options)? (('color' in options.effect)? options.effect.color : 0) : 0,
            mosaic : ('effect' in options)? (('mosaic' in options.effect)? options.effect.mosaic : 0) : 0,
            fisheye : ('effect' in options)? (('fisheye' in options.effect)? options.effect.fisheye : 0) : 0,
        };
        this.position =  ('position' in options)? {x: options.position.x, y: options.position.y} : {x:0, y:0};
        this.direction = ('direction' in options)? options.direction : 90;
        this.scale = ('scale' in options)? {x: options.scale.x, y: options.scale.y} : {x:100, y:100};

        this.sprites = [];
        this.keysCode = [];
        this.keysKey = [];
        this.backdrops = new Backdrops(render);
        this.sprites = [];
        this.skinIdx = -1;
        this.mouse = {x:0, y:0};
        Sensing.enable(this);
        const me = this;
        Canvas.canvas.addEventListener('mousemove', (e) => {
            me.mouse.x = e.offsetX - Canvas.canvas.clientWidth/2;
            me.mouse.y = e.offsetY - Canvas.canvas.clientHeight/2;
            e.stopPropagation()
        }, {});    
}

    addSprite (sprite) {
        const curSprite = sprite
        this.sprites.push(curSprite);
        curSprite.z = this.sprites.length
        curSprite.setStage(this);
        this._sortSprites();
    }
    removeSprite (sprite) {
        const curSprite = sprite
        this.sprites = this.sprites.filter((item) => item !== curSprite);
        this._sortSprites();
    }
    _sortSprites() {
        const _sprites = this.sprites;
        this.sprites = _sprites.sort(function(a,b) {
            if (a.z > b.z) return -1;
            if (b.z > a.z) return  1;
            return 0;
        });
    }
    update() {
        this.backdrops.setPosition(this.position.x, this.position.y);
        this.backdrops.setScale(this.scale.x, this.scale.y);
        this.backdrops.setDirection(this.direction);
        this.backdrops.update(this.drawableID);
        for(const _sprite of this.sprites){
            _sprite.update();
        }
    }
    draw() {
        this.render.renderer.draw();
    }
    sendSpriteBackwards (sprite) {
    
    }
    sendSpriteForward (sprite) {
    }
    sendSpriteToFront (sprite) {
    }
    sendSpriteToBack (sprite) {
    }
    isKeyPressed (userKey) {
        let match = false
        let check
    
        typeof userKey === 'string' ? check = userKey.toLowerCase() : check = userKey
        this.keysKey.indexOf(check) !== -1 ? match = true : null
        this.keysCode.indexOf(check) !== -1 ? match = true : null
    
        return match
    }
    move(x,y) {
        this.position.x = x;
        this.position.y = y;
        this.backdrops.setPosition(this.position.x, this.position.y);
    }

  
};

module.exports = Stage;