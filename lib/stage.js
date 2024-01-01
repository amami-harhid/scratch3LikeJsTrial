const Backdrops = require('./backdrops');
const Entity = require('./entity');
const Sensing = require('./sensing');
const Sounds = require('./sounds');
const Utils = require('./utils');
const Stage = class extends Entity {
    constructor(render, name, layer) {
        super(render, name, layer);    
        this.sprites = [];
        this.keysCode = [];
        this.keysKey = [];
        this.backdrops = new Backdrops(render);
        this.sprites = [];
        this.scale = {x:100, y:100};
        this.position = {x: 0, y:0};
        this.effect = {};
        this.skinIdx = -1;
        Sensing.enable(this);
    }

    addSprite (sprite) {
        const curSprite = sprite
        this.sprites.push(curSprite);
        curSprite.z = this.sprites.length
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
        //this.draw();
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
        //console.log("x,y=(",x,y,")")
        this.position.x = x;
        this.position.y = y;
        this.backdrops.setPosition(this.position.x, this.position.y);
    }
  
};

module.exports = Stage;