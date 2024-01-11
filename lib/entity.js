const Canvas = require('./canvas');
const Env = require('./env');
const Looks = require('./looks');
const Process = require('./process');
const Sounds = require('./sounds');
const Utils = require('./utils');
const Entity = class {
    constructor (render, name, layer,  options = {} ){
        this.pace = Env.pace;
        this.render = render;
        this.name = name;
        this.layer = layer;
        this.drawableID = this.render.createDrawable(this.layer);
        Entity.messageListeners = [];
        this.id = this._generateUUID();
        this.evented = [
            'whenFlag',
            'whenLoaded',
            'whenClicked',
            'whenKeyPressed',
            'whenEvent',
            'whenReceiveMessage',
            'whenCloned'
          ];
        this.canvas = Canvas.canvas;
        this.flag = Process.default.flag;
        this.position = {x:0, y:0}; // 意味なし
        this.scale = {x:100,y:100}; // 意味なし
        this.direction = 90; // 意味なし
        this.sound = null;
        this.importAllDone = [];
        this.importIdx = -1;

        const _effect = ('effect' in options )? options.effect: {};
        this._effect = {};
        this.setEffectsEachProperties(_effect);
        this.position =  ('position' in options)? {x: options.position.x, y: options.position.y} : {x:0, y:0};
        this.direction = ('direction' in options)? options.direction : 90;
        this.scale = ('scale' in options)? {x: options.scale.x, y: options.scale.y} : {x:100, y:100};

    }
    get effect() {
        return this._effect;
    }
    set effect(_effect) {
        this.setEffectsEachProperties(_effect);
    }
    setEffectsEachProperties(_effect) {
        if(Looks.COLOR in _effect ){
            this._effect.color = _effect.color;
        }
        if(Looks.FISHEYE in _effect ){
            this._effect.fisheye = _effect.fisheye;
        }
        if(Looks.WHIRL in _effect ){
            this._effect.whirl = _effect.whirl;
        }
        if(Looks.PIXELATE in _effect ){
            this._effect.pixelate = _effect.pixelate;
        }
        if(Looks.PIXELATE in _effect ){
            this._effect.pixelate = _effect.pixelate;
        }
        if(Looks.MOSAIC in _effect ){
            this._effect.mosaic = _effect.mosaic;
        }
        if(Looks.BRIGHTNESS in _effect ){
            this._effect.brightness = _effect.brightness;
        }
        if(Looks.GHOST in _effect ){
            this._effect.ghost = _effect.ghost;
        }
    }
    clearEffect() {
        this._effect.color = 0;
        this._effect.fisheye = 0;
        this._effect.mosaic = 0;
        this._effect.brightness = 0;
        this._effect.brightness = 0;
        this._effect.ghost = 0;
    }


    _isImportAllDone() {
        let _allDone = true;
        this.importAllDone.map(v => {
            if( v === false ) {
                _allDone = false;
            }
        })
        return _allDone;
    }
    async _addImage(name ,image, costume) {
//        console.log('Entity _addImage (1)costume.costumes=', costume.costumes);
        await costume.addImage(name, image);
//        console.log('Entity _addImage (2)costume.costumes=', costume.costumes);

    }
    async _loadImage(name, imageUrl, costume) {
        this.importIdx += 1;
        const _importIdx = this.importIdx;
        this.importAllDone.push(false);
        await costume.loadImage(name, imageUrl);
        this.importAllDone[_importIdx] = true;
    }
    async importSound( sound ) {
        if ( this.sounds == undefined ) this.sounds = new Sounds();
        const soundData = await this.sounds.importSound( sound );
        return soundData;
    }
    async _addSound(name, soundData, options={}) {
        if ( this.sounds == undefined ) this.sounds = new Sounds();
        await this.sounds.setSound(name, soundData, options);
    }
    async _loadSound(name, soundUrl, options={}) {
        this.importIdx += 1;
        const _importIdx = this.importIdx;
        this.importAllDone.push(false);
        if ( this.sounds == undefined ) this.sounds = new Sounds();
        await this.sounds.loadSound(name,soundUrl, options);
        this.importAllDone[_importIdx] = true;
    }
    soundSwitch(name){
        if ( this.sounds == undefined ) return;
        this.sound.switch(name);
    }
    nextSound() {
        if ( this.sounds == undefined ) return;
        this.soundStop();    
        this.sounds.nextSound();
    }
    soundPlay(name) {
        if ( this.sounds == undefined ) return;
        if( name ) {
            this.soundSwitch(name);
        } 
        this.sounds.play();
    }
    setSoundVolume(volume) {
        if ( this.sounds == undefined ) return;
        this.sounds.volume = volume;
    }
    setSoundVolumeByName(name, volume) {
        if ( this.sounds == undefined ) return;
        this.sounds.volume = volume;
    }
    setSoundPitch(pitch) {
        if ( this.sounds == undefined ) return;
        this.sounds.pitch = pitch;
    }
    soundStop() {
        if ( this.sounds == undefined ) return;
        this.sounds.stop();
    }
    soundStopImmediately() {
        if ( this.sounds == undefined ) return;
        this.sounds.soundStopImmediately();
    }
    async startSoundUntilDone() {
        if ( this.sounds ) await this.sounds.startSoundUntilDone();
        return;
    }
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }
    setScale(x, y) {
        this.scale.x = x;
        if( y == undefined) {
            this.scale.y = x;

        }else{
            this.scale.y = y;
        }
    }
    setDirection(direction) {
        this.direction = direction;
    }
    _generateUUID () {
        return Utils.generateUUID();
    }
    _releaseWaited (triggeringId) {
        const event = new window.CustomEvent(`blockLike.waited.${triggeringId}`, { detail: { value: 0 } })
        document.dispatchEvent(event)
    }
    _setToVar (varString, value) {
        try {
            eval(`${varString} = '${value}'`) // eslint-disable-line no-eval
        } catch (error) {
            throw ('BlockLike.js Error: Variables accepting a value must be declared in the global scope.') // eslint-disable-line no-throw-literal
        }
    }
    _exec (func, argsArr) {
        const me = this
        me.triggeringId = this._generateUUID()
        const f = rewrite.rewrite(func, me)
        return f.apply(me, argsArr)
    }
    invoke (func, argsArr, theVar = null, triggeringId = null) {
        // theVar and triggeringId are not user supplied, they are inserted by rewriter.
        let args = argsArr;
        !(argsArr instanceof Array) ? args = [argsArr] : null;
    
        this._exec(func, args).then((result) => {
            // this is the waited method listener. release it.
            this._releaseWaited(triggeringId)
            // set the user defined variable to the captured value.
            theVar ? this._setToVar(theVar, result) : null
        })
    }
    wait (sec, triggeringId = null) {
        // triggeringId is not user supplied, it is inserted by rewriter.
        setTimeout(() => {
            this._releaseWaited(triggeringId)
        }, sec * 1000)
    }
    async whenLoaded (func) {
        await func();
/*
        setTimeout(() => {
            this._exec(func, [])
        }, 0)
*/
    }
    async whenFlag (func) {
        const process = Process.default;
        const me = this;
        const _func = func.bind(this);
        if (me.flag) {
            // フラグエレメントへのイベント登録とするべき。
            this.flag.addEventListener('click', async (e) => {
                //me.flag.remove; // <--- フラグ要素があれば消すとしたい。
                if( process.preloadDone === true ) {
                    setTimeout(_func, 0);
//                    _func();
                }
                //me._exec(func, [e])
                e.stopPropagation();  // イベント伝播を停止
            })
        }
    }
    whenClicked (func) {
        const process = Process.default;
        const me = this;
        const _func = func.bind(this);
        Canvas.canvas.addEventListener('click', async(e) => {
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;
            const _touchDrawableId = me.render.renderer.pick(mouseX,mouseY);
            if(me.drawableID == _touchDrawableId){
                if( process.preloadDone === true ) {
                    _func();
                }
            }
            e.stopPropagation()
        }, {});        
    }
    whenTouchingTarget(targets, func) {
        const me = this;
        if( process.preloadDone === true ) {
            const _func = func.bind(this);
            setInterval(async function(){
                const touching = me.isTouchingTarget(me, targets);
                if(touching === true){
                    func();
                }
            },0);
        }
    }
    isTouchingTargetToTarget(src, targets) {
        const targetIds = [];
        if(Array.isArray(targets)){
            for(const _t of targets) {
                const _drawableId = _t.drawableID;
                if( src.render.renderer._allDrawables.includes(_drawableId)){
                    targetIds.push(_drawableId);
                }
            }    
        }else{
            const _drawableId = targets.drawableID;
            if( src.render.renderer._allDrawables.includes(_drawableId)){
                targetIds.push(_drawableId);
            }
        }
        if( targetIds.length > 0 ) {
            const touching = src.render.renderer.isTouchingDrawables(src.drawableID, targetIds);
            return touching;    
        }
        return false;
    }
    isTouchingTarget(targets) {
        const src = this;
        const touching = this.isTouchingTargetToTarget(src,targets);
        return touching;
    }
    whenCloned(func) {
        const me = this;

    }
    /**
    * whenEvent - adds the specified event listener to sprite/stage.
    * When triggered will invoke user supplied function.
    *
    * @example
    * let stage = new LS.Stage();
    * let sprite = new LS.Sprite();
    *
    * sprite.addTo(stage);
    * sprite.whenEvent('mouseover', (e) => {
    *   console.log(e);
    * });
    *
    * @param {string} eventStr - the named event (mosemove etc.).
    * @param {function} func - a function to rewrite and execute.
    */
    whenEvent( eventStr, func ) {
        const me = this;
        let attachTo = Canvas.canvas;
        let options = {};
        'keydown|keyup|keypress'.indexOf(eventStr) !== -1 ? attachTo = document : null;
        'touchstart|touchmove'.indexOf(eventStr) !== -1 ? options = { passive: true } : null;
        attachTo.addEventListener(eventStr, (e) => {
            func(e);
            e.stopPropagation()
        }, options);
    }

    updateVisible( visible ) {

        this.render.renderer.updateDrawableVisible(this.drawableID, visible);
    }

    setRotationStyle () {

    }
}

module.exports = Entity;
