const Canvas = require('./canvas');
const Entity = require('./entity');
const Costumes = require('./costumes');
const Looks = require('./looks');
const MathUtils = require('./math-utils');
const Process = require('./process');
//const sounds = require('./sounds');
const StageLayering = require('./stageLayering');
const Utils = require('./utils');
const Sprite = class extends Entity {

    constructor(stage, name, options = {}) {
        const render = stage.render;
        super(render, name, StageLayering.SPRITE_LAYER);
        this.stage = stage;
        this.costumes = new Costumes(render);
        this.skinId = null;
        this.skinIdx = -1;
//        this._effect = ('effect' in options )? options.effect: {};
//        this.position =  ('position' in options)? {x: options.position.x, y: options.position.y} : {x:0, y:0};
//        this.direction = ('direction' in options)? options.direction : 90;
//        this.scale = ('scale' in options)? {x: options.scale.x, y: options.scale.y} : {x:100, y:100};
        this.z = -1;
        this.clones = [];
        this.isClone;
        this.originalSprite;
        stage.addSprite(this);
    }
/*
    get effect() {
        return this._effect;
    }
    set effect(_effect) {
        if(Looks.COLOR in _effect ){
            this._effect.color = _effect.color;    
        }
        if(Looks.MOSAIC in _effect ){
            this._effect.mosaic = _effect.mosaic;    
        }
        if(Looks.FISHEYE in _effect ){
            this._effect.fisheye = _effect.fisheye;    
        }
    }
    clearEffect() {
        this._effect.color = 0;    
        this._effect.mosaic = 0;    
        this._effect.fisheye = 0; 
    }
 */
    remove() {
        if(this.isClone === true) {
            const clones = this.originalSprite.clones;
            this.originalSprite.clones = clones.filter(s=> s.id !== this.id);
            this.render.renderer.destroyDrawable(this.drawableID, StageLayering.SPRITE_LAYER);
        }else{
            this.stage.removeSprite(this);
            this.render.renderer.destroyDrawable(this.drawableID, StageLayering.SPRITE_LAYER);
        }
    }
    clone(options = {}) {
        if(this.isClone == undefined){
            const newName = `${this.name}_${this.clones.length+1}`;
            // クローン時にエフェクトを引き継ぐ。
            // クローン別にエフェクトを設定したいときは
            // clone() 実行後に 個別に設定すること。
            const COLOR = Looks.COLOR;
            const FISHEYE = Looks.FISHEYE;
            const WHIRL = Looks.WHIRL;
            const PIXELATE = Looks.PIXELATE;
            const MOSAIC = Looks.MOSAIC;
            const BRIGHTNESS = Looks.BRIGHTNESS;
            const GHOST = Looks.GHOST;
            const _options = {
                'position' : {x: this.position.x, y:this.position.y}, 
                'scale' : this.scale,
                'direction' : this.direction,
                COLOR : this._effect.color,
                FISHEYE : this._effect.fisheye,
                WHIRL: this._effect.whirl,
                PIXELATE: this._effect.pixelate,
                MOSAIC: this._effect.mosaic,
                BRIGHTNESS: this._effect.brightness,
                GHOST: this._effect.ghost,
            };
            const newOptions = Object.assign(_options, options);
//            const newSprite = new Sprite(this.render, newName, newOptions);
            const newSprite = new this.constructor(this.stage, newName, newOptions);
            newSprite.isClone = true;
            // 連想配列のDeepCopy
            newSprite.costumes.costumes = Utils.mapDeepCopy(this.costumes.costumes);
            newSprite.costumes.skinId = this.costumes.skinId;
            newSprite.costumes.name = this.costumes.name;
            newSprite.originalSprite = this;
            this._costumeProperties(newSprite);
            newSprite.skinIdx = this.skinIdx;
            newSprite.skinId = this.skinId;
            this.clones.push(newSprite);
            return newSprite;
        }
    }
    _costumeProperties(target) {
        target.costumes.setPosition(target.position.x, target.position.y);
        target.costumes.setScale(target.scale.x, target.scale.y);
        target.costumes.setDirection(target.direction);
        target.costumes.update(target.drawableID, this._effect);

    }
    update() {
        this._costumeProperties(this);
/* 
        if(this.isClone == undefined){
            for(const _sprite of this.clones) {
                _sprite.update();
            }    
        }
*/
    }
    // 呼び出し元がないけど？
    _costumeUpdate() {
        if( this.skinId < 0) return;
        if( this.costumes.length > this.skinIdx ) {
            let _currentCostume = this.costumes[this.skinIdx];
            _currentCostume.setScale(this.scale.x, this.scale.y);
            _currentCostume.setPosition(this.position.x, this.position.y);
            _currentCostume.update(this.drawableID, this._effect);
        }
    }
    // これは不要！
    async _svgText(url) {
        let svg = await fetch(url);
        let _text = await svg.text();
        return _text;
    }
    moveSteps(steps) {
        const radians = MathUtils.degToRad(90 - this.direction);
        const dx = steps * Math.cos(radians);
        const dy = steps * Math.sin(radians);
        this.position.x += dx;
        this.position.y += dy;
    }
    move( _step ) {
        if ( !Number.isNumber(_step)) {
            return;
        }
        let _degree = this._direction;
        
        if ( _degree  == 90) {
            this.x += _step;
            return;
        }
        if ( _degree == -90 ) {
            this.x -= _step;
            return;
        }
        if ( _degree == 0) {
            this.y += _step;
            return;
        }
        if ( _degree == 180) {
            this.y -= _step;
            return;
        }
        const _radian = MathUtils.degToRad(_degree);
        const _x = Math.sin(_radian) * _step;
        const _y = Math.cos(_radian) * _step;
        this.position.x += _x;
        this.position.y += _y;
    }
    ifOnEdgeBounds() {
        const bounds = this.render.renderer.getBounds(this.drawableID);
        if (!bounds) return;
        const stageWidth = this.render.stageWidth;
        const stageHeight = this.render.stageHeight;
        const distLeft = Math.max(0, (stageWidth / 2) + bounds.left);
        const distTop = Math.max(0, (stageHeight / 2) - bounds.top);
        const distRight = Math.max(0, (stageWidth / 2) - bounds.right);
        const distBottom = Math.max(0, (stageHeight / 2) + bounds.bottom);
        // find nearest edge
        let nearestEdge = '';
        let minDist = Infinity;
        if (distLeft < minDist) {
            minDist = distLeft;
            nearestEdge = 'left';
        }
        if (distTop < minDist) {
            minDist = distTop;
            nearestEdge = 'top';
        }
        if (distRight < minDist) {
            minDist = distRight;
            nearestEdge = 'right';
        }
        if (distBottom < minDist) {
            minDist = distBottom;
            nearestEdge = 'bottom';
        }
        if (minDist > 0) {
            return;// Not touching any edge
        }
        // Point away from the nearest edge.
        const radians = MathUtils.degToRad(90 - this.direction);
        let dx = Math.cos(radians);
        let dy = -Math.sin(radians);
        if (nearestEdge === 'left') {
            dx = Math.max(0.2, Math.abs(dx));
        } else if (nearestEdge === 'top') {
            dy = Math.max(0.2, Math.abs(dy));
        } else if (nearestEdge === 'right') {
            dx = 0 - Math.max(0.2, Math.abs(dx));
        } else if (nearestEdge === 'bottom') {
            dy = 0 - Math.max(0.2, Math.abs(dy));
        }
        const newDirection = MathUtils.radToDeg(Math.atan2(dy, dx)) + 90;
        this.direction = newDirection;
        // Keep within the stage.
        const fencedPosition = this._keepInFence(this.position.x, this.position.y);
        if(fencedPosition){
            this.position.x = fencedPosition[0];
            this.position.y = fencedPosition[1];    
        }

    }
    isTouchingEdge (){
        const stageWidth = this.render.stageWidth;
        const stageHeight = this.render.stageHeight;
        const bounds = this.render.renderer.getBounds(this.drawableID);
        if (bounds.left < -stageWidth / 2 ||
            bounds.right > stageWidth / 2 ||
            bounds.top > stageHeight / 2 ||
            bounds.bottom < -stageHeight / 2) {
            return true;
        }
        return false;
    }
    _keepInFence(newX,newY){
        const bounds = this.render.renderer.getBounds(this.drawableID);
        if(!bounds) return;
        const stageWidth = this.render.stageWidth;
        const stageHeight = this.render.stageHeight;
        const fence = {
            left: -stageWidth / 2,
            right: stageWidth / 2,
            top: stageHeight / 2,
            bottom: -stageHeight / 2
        };
        // Adjust the known bounds to the target position.
        bounds.left += (newX - this.x);
        bounds.right += (newX - this.x);
        bounds.top += (newY - this.y);
        bounds.bottom += (newY - this.y);
        // Find how far we need to move the target position.
        let dx = 0;
        let dy = 0;
        if (bounds.left < fence.left) {
            dx += fence.left - bounds.left;
        }
        if (bounds.right > fence.right) {
            dx += fence.right - bounds.right;
        }
        if (bounds.top > fence.top) {
            dy += fence.top - bounds.top;
        }
        if (bounds.bottom < fence.bottom) {
            dy += fence.bottom - bounds.bottom;
        }
        return [newX + dx, newY + dy];
    }
    turnRight( _degree ) {
        let _d = this.direction;
        _d += _degree;
        this.direction = _calcDegree(_d % 360);
    }

    turnLeft( _degree ) {
        let _d = this.direction;
        _d -= _degree;
        this.direction = _calcDegree(_d % 360);
    }
    _calcDegree(_degree) {
        const _d = _degree % 360;
        if( _d > 0) {
            if( _d > 180) {
                _d = _d - 360;
            }
            return _d;
        }else if( _d < 0) {
            if( _d < -180) {
                _d = _d + 360;
            }
            return _d;
        }
        return _d;
    }
    goto( option = 'random_position') {
        // 他のスプライトの名前も使えるようにしたい。
        if( typeof option === 'string') {
            if( option === 'random_position') {
                this._gotoRandomPosition();
            }else if(option === 'mouse_position'){
                this._gotoMousePosition();
            }else{
                // ステージからスプライト配列を取り出し、名前が一致するスプライトを特定する。
                const name = option;
                const targetSprite = _foundSpriteByName(name);
                this._gotoSprite(targetSprite);
            }
        }else if(option instanceof Sprite) {
            const _targetSprite = option;
            this._position.x = _targetSprite.position.x;
            this._position.y = _targetSprite.position.y;

        }else {
            if('x' in option ) {
                this._position.x = option.x;
            }
            if('y' in option ) {
                this._position.y = option.y;
            }

        }
    }
    _gotoRandomPosition() {
        const _x = (Math.random() * 2 - 1) * Canvas.canvas.width;
        const _y = (Math.random() * 2 - 1) * Canvas.canvas.Height;
        this.position.x = _x;
        this.position.y = _y;

    }
    _gotoMousePosition() {
    
    }
    _foundSpriteByName(name){

    }
    _gotoSprite(sprite) {
    
    }

    glideToPosition(glidingSec, position){
        const _position = {x: position.x - this.position.x, y: position.y - this.position.y};
        const _radian = _calcRadianToPosition(_position);
        const _distance = Math.sqrt((_position.x**2)+(_position.y**2));
        const _times = Math.ceil( glidingSec * 1000 / this.pace); // 端数切り上げ

    }
    _calcRadianToPosition(position) {
        const _x = position.x;
        const _y = position.y;
        let radian = 0;
        if( _y == 0) {
          if(_x > 0) {
            radian = Math.PI / 2;    
          }else if(_x < 0){
            radian = -Math.PI / 2;    
          }
        }else{
          radian = Math.atan(_x/_y);
          if( _y < 0) {
            radian += Math.PI;
          }
        }
        return radian;
    }

    glide(glidingSec, option = 'random_position'){

    }
    pointInDerection( _d ) {

        if(_d < 0) {
            let _direction = _d % 360;
            if( _direction < -180) {
                _direction = 180 + _direction;
            }
            this._direction = _direction;
        }else{
            // _derection 0 以上 
            let _direction = _d % 360;
            if( _direction > 180) {
                _direction = 180 - _direction;
            }
            this._direction = _direction;
        }
    }
    pointTowardsMouseCursol( ) {


    }



    nextCostume() {
        this.costumes.nextCostume();
    }
    switchCostume( val ) {
        if( val ){
            if( typeof val === 'string') {
                const _name = val;
                this.costumes.switchCostumeByName(_name);
 
            }else if( Number.isInteger(val)) {
                const _idx = val;
                this.costumes.switchCostumeByNumber(_idx);
            }    
        }
    }

    async loadSound(name,soundUrl, options={}) {
        this._loadSound(name, soundUrl, options);
    }
    async loadImage(name, imageUrl) {
        this._loadImage(name, imageUrl, this.costumes);
    }
    async addImage(name ,image) {
        this._addImage(name, image, this.costumes);
    }

};
module.exports = Sprite;