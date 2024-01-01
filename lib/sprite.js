const Canvas = require('./canvas');
const Entity = require('./entity');
const Costumes = require('./costumes');
const sounds = require('./sounds');
const Utils = require('./utils');
const Sprite = class extends Entity {

    constructor(render, name, layer, options = {}) {
        super(render, name, layer);
        let actual = (typeof options === 'object')? options : {};
        this.costumes = new Costumes(render);
        this.skinId = null;
        this.skinIdx = -1;
        this.effect = {
            color : ('color' in actual)? actual.color : 0,
            mosaic : ('mosaic' in actual)? actual.mosaic : 0,
            fisheye : ('fisheye' in actual)? actual.fisheye : 0,
        };
        this.position = ('position' in actual)? {x: actual.position.x, y: actual.position.y} : {x:0, y:0};
        this.direction = ('direction' in actual)? actual.direction : 90;
        this.scale = ('scale' in actual)? {x: actual.scale.x, y: actual.scale.y} : {x:100, y:100};
        this.z = -1;
    }
    update() {
        this.costumes.setPosition(this.position.x, this.position.y);
        this.costumes.setScale(this.scale.x, this.scale.y);
        this.costumes.setDirection(this.direction);
        this.costumes.update(this.drawableID);
    }
    _costumeUpdate() {
        if( this.skinId < 0) return;
        if( this.costumes.length > this.skinIdx ) {
            let _currentCostume = this.costumes[this.skinIdx];
            _currentCostume.setScale(this.scale.x, this.scale.y);
            _currentCostume.setPosition(this.position.x, this.position.y);
            _currentCostume.update(this.drawableID, this.effect);
        }
    }
    async _svgText(url) {
        let svg = await fetch(url);
        let _text = await svg.text();
        return _text;
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
        const _radian = (_degree / 180.0) * Math.PI;
        const _x = Math.sin(_radian) * _step;
        const _y = Math.cos(_radian) * _step;
        this.position.x += _x;
        this.position.y += _y;
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
        if( this.costumes.length > 0) {
            if( this.skinIdx+1 < this.costumes.length ) {
                this.skinIdx += 1;
            }else{
                this.skinIdx = 0;
            }
            this._costumeUpdate();
        }
    }
    switchCostume( val ) {
        if( val ){
            if( typeof val === 'string') {
                const _name = val;
                const _r = this.costumes.map((e)=>{
                    return e.name === _name;
                });
                const _this = this;
                _r.map((value,idx)=>{
                    _this.skinIdx = idx;
                    _this._costumeUpdate();
                });
 
            }else if( Number.isInteger(val)) {
                const _idx = val;
                if( _idx < this.costumes.length ) {
                    this.skinIdx = _idx;
                    this._costumeUpdate();
                }
            }    
        }
    }
};
module.exports = Sprite;