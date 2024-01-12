const Canvas = require('./canvas');
const Entity = require('./entity');
const Env = require('./env');
const Costumes = require('./costumes');
const Looks = require('./looks');
const MathUtils = require('./math-utils');
const Process = require('./process');
//const sounds = require('./sounds');
const StageLayering = require('./stageLayering');
const Utils = require('./utils');
const Sprite = class extends Entity {

    constructor(name, options = {}) {
        super(name, StageLayering.SPRITE_LAYER, options);
        const stage = Process.default.stage;
        this.stage = stage;
        this.costumes = new Costumes();
        this.skinId = null;
        this.skinIdx = -1;
        this.z = -1;
        this.clones = [];
        this.isClone;
        this.originalSprite;
        this.imageDatas = [];
        this.soundDatas = [];
        this.touchingEdge = false;
        stage.addSprite(this);
    }
    remove() {
        this.skinId = null;
        if(this.isClone === true) {
            const clones = this.originalSprite.clones;
            this.originalSprite.clones = clones.filter(s=> s.id !== this.id);
//            this.render.renderer.destroyDrawable(this.drawableID, StageLayering.SPRITE_LAYER);
        }
        this.stage.removeSprite(this);
        this.render.renderer.destroyDrawable(this.drawableID, StageLayering.SPRITE_LAYER);
    }
    async clone(options = {}) {
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
                'direction' : (this.direction)? this.direction: 90,
                COLOR : (this._effect.color)? this._effect.color: 0,
                FISHEYE : (this._effect.fisheye)? this._effect.fisheye: 0,
                WHIRL: (this._effect.whirl)? this._effect.whirl: 0,
                PIXELATE: (this._effect.pixelate)? this._effect.pixelate: 0,
                MOSAIC: (this._effect.mosaic)? this._effect.mosaic: 0,
                BRIGHTNESS: (this._effect.brightness)? this._effect.brightness: 0,
                GHOST: (this._effect.ghost)? this._effect.ghost: 0,
            };
            const newOptions = Object.assign(_options, options);
            const newSprite = new this.constructor(newName, newOptions);
            this.clones.push(newSprite);
            newSprite.isClone = true;
            for(const d of this.imageDatas) {
                // svg image の場合、createSVGSkin の中で非同期になることに注意すること
                await newSprite.addImage(d); 
            }
            for(const d of this.soundDatas) {
                const _soundData = {};
                _soundData.name = d.name;
                _soundData.data = d.data;
                const _options = d.options;
                await newSprite.addSound(_soundData, _options); // options引き継ぐ
            }
            newSprite.update(); // update() は不要かもしれない。
            newSprite.originalSprite = this;
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
        super.update();
        this._costumeProperties(this);
    }
    async moveSteps(steps) {
        const radians = MathUtils.degToRad(90 - this.direction);
        const dx = steps * Math.cos(radians);
        const dy = steps * Math.sin(radians);
        this.position.x += dx;
        this.position.y += dy;
        this.costumes._position.x += dx;
        this.costumes._position.y += dy;
    //this.update();
        //await P.Utils.wait(5);
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
    onEdgeBounds() {
        const drawable = this.render.renderer._allDrawables[this.drawableID];
        if( drawable == null || drawable.skin == null) return null;
        const bounds = this.render.renderer.getBounds(this.drawableID);
        if (!bounds) return null;
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
            return null// Not touching any edge
        }
        return {'minDist': minDist, 'nearestEdge':nearestEdge};
    }
    _ifOnEdgeBounds() {
        const judge = this.onEdgeBounds();
        if(judge &&  judge.minDist && judge.minDist == Infinity) return null;
        return judge;
    }
    async ifOnEdgeBounds() {
        const drawable = this.render.renderer._allDrawables[this.drawableID];
        if( drawable == null || drawable.skin == null) return;
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
        for(;;) {
            this.keepInFence(this.costumes._position.x, this.costumes._position.y);
            const touch = this.isTouchingEdge();
            if( touch === false ) break;
            await Utils.wait(0);
        }
        //console.log(`Sprite#ifOnEdgeBounds, keepInFence retry = ${_test} times.`)

    }
    keepInFence(x, y) {
        const fencedPosition = this._keepInFence(x, y);
        if(fencedPosition){
            //console.log(fencedPosition);
            this.position.x = fencedPosition[0];
            this.position.y = fencedPosition[1];
            this.costumes._position.x = fencedPosition[0];
            this.costumes._position.y = fencedPosition[1];
            this.moveSteps(1);
            this.update();
        }
    }
    _keepInFence(newX,newY){
        const drawable = this.render.renderer._allDrawables[this.drawableID];
        if( drawable == null || drawable.skin == null) return;
        const bounds = this.render.renderer.getBounds(this.drawableID);
        if(!bounds) return;
        const stageWidth = this.render.stageWidth;
        const stageHeight = this.render.stageHeight;
        // fence を bounds で調整する
        const distLeft = Math.max(0, (stageWidth / 2) + bounds.left);
        const distTop = Math.max(0, (stageHeight / 2) - bounds.top);
        const distRight = Math.max(0, (stageWidth / 2) - bounds.right);
        const distBottom = Math.max(0, (stageHeight / 2) + bounds.bottom);
        const fence = {
            left: -(stageWidth / 2),
            top: stageHeight / 2,
            right: stageWidth / 2,
            bottom: -(stageHeight / 2),
        };
        // Adjust the known bounds to the target position.
        bounds.left += (newX - this.costumes._position.x);
        bounds.right += (newX - this.costumes._position.x);
        bounds.top += (newY - this.costumes._position.y);
        bounds.bottom += (newY - this.costumes._position.y);
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
    isTouchingEdge (_callback){
        const judge = this.onEdgeBounds();
        if(judge  == null )  {
            if( this.touchingEdge === true) this.touchingEdge = false;
            return false;
        }
        const nearestEdge = judge.nearestEdge;
        if(nearestEdge == '') {
            if( this.touchingEdge === true) this.touchingEdge = false;
            return false;
        }
        if(this.touchingEdge === true) return false; 

        if(_callback) {
            const callback = _callback.bind(this);
            setTimeout(callback, 0);
        }

        return true;
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
        // TODO 他のスプライトの名前も使えるようにしたい。
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
        // 工事中
    }
    _foundSpriteByName(name){
        // 工事中

    }
    _gotoSprite(sprite) {
        // 工事中
    
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
        // 工事中

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
        // 工事中


    }



    nextCostume() {
        this.costumes.nextCostume();
        this.ifOnEdgeBounds();
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
    async addSound(soundData, options = {}) {
        const _soundData = soundData;
        _soundData.options = options;
        this.soundDatas.push(_soundData);
        const name = _soundData.name;
        const data = _soundData.data;
        await this._addSound(name, data, options);
    }
    async addImage(imageData) {
        this.imageDatas.push(imageData);
        const name = imageData.name;
        const data = imageData.data;
        await this._addImage(name, data, this.costumes);
    }

};
module.exports = Sprite;