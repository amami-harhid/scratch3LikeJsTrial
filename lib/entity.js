const Canvas = require('./canvas');
const Env = require('./env');
const Element = require('./element');
const Process = require('./process');
const Sounds = require('./sounds');
const Entity = class {
    constructor (render, name, layer){
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
        this.position = {x:0, y:0};
        this.scale = {x:100,y:100};
        this.direction = 90;
        this.sound = null;
        this.importAllDone = [];
        this.importIdx = -1;
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
    async _loadImage(name, imageUrl, costume) {
        this.importIdx += 1;
        const _importIdx = this.importIdx;
        this.importAllDone.push(false);
        await costume.loadImage(name, imageUrl);
        this.importAllDone[_importIdx] = true;
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
        if ( this.sounds == undefined ) return;
        await this.sounds.startSoundUntilDone();
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
        let d
        let r
    
        d = new Date().getTime()
    
        if (window.performance && typeof window.performance.now === 'function') {
            d += window.performance.now() // use high-precision timer if available
        }
    
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            r = (d + Math.random() * 16) % 16 | 0 // eslint-disable-line no-mixed-operators, no-bitwise
            d = Math.floor(d / 16)
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16) // eslint-disable-line no-mixed-operators, no-bitwise
        })
    
        return uuid;  
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
    async whenFlagDirect (func) {
        this.whenFlag(func, false);
    }
    async whenFlag (func, waitImportAllDone = true) {
        const process = Process.default;
        console.log('Entity whenFlag, process id=', process.id);
        const me = this;
        console.log('Entity whenFlag ');
        if (me.flag) {
            console.log('Entity whenFlag me flag exist ');
            // フラグエレメントへのイベント登録とするべき。
            this.flag.addEventListener('click', async (e) => {
                console.log('Entity whenFlag  clicked ');
                //me.flag.remove; // <--- フラグ要素があれば消すとしたい。
                if(waitImportAllDone === true){
                    await process.waitImportAllDone();
                }
                console.log('Entity whenFlag  waitImportAllDone  ');
                func();
                //me._exec(func, [e])
                e.stopPropagation();  // イベント伝播を停止
            })
        }
    }
    whenClicked (func) {
        const process = window.process;
        const me = this;
        Canvas.canvas.addEventListener('click', async(e) => {
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;
            const _touchDrawableId = me.render.renderer.pick(mouseX,mouseY);
            if(me.drawableID == _touchDrawableId){
                await process.waitImportAllDone();
                func();
            }
            e.stopPropagation()
        }, {});        
    }
    whenTouchingTarget(targets, func) {
        const me = this;
        setInterval(async function(){
            await process.waitImportAllDone();
            const touching = me.isTouchingTarget(me, targets);
            if(touching === true){
                func();
            }
        },0);
    }
    isTouchingTargetToTarget(src, targets) {
        const targetIds = [];
        if(Array.isArray(targets)){
            for(const _t of targets) {
                targetIds.push(_t.drawableID);
            }    
        }else{
            targetIds.push(targets.drawableID);
        }
        const touching = src.render.renderer.isTouchingDrawables(src.drawableID, targetIds);
        return touching;
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
}

module.exports = Entity;
