const Canvas = require('./canvas');
const Env = require('./env');
const Element = require('./element');
const Entity = class {
    constructor (render, name, layer){
        this.pace = Env.pace;
        this.render = render;
        this.name = name;
        this.layer = layer;
        this.drawableID = this.render.createDrawable(this.layer);
        Entity.messageListeners = [];
        this.sounds = []; // sound-player の配列
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
        this.flag = Element.flag;
        this.position = {x:0, y:0};
        this.scale = {x:100,y:100};
        this.direction = 90;
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
    whenLoaded (func) {
        setTimeout(() => {
            this._exec(func, [])
        }, 0)
    }
    whenFlag (func) {
        const me = this;
    
        if (me.flag) {
            // フラグエレメントへのイベント登録とするべき。
            this.flag.addEventListener('click', (e) => {
                me.flag.remove; // <--- フラグ要素があれば消すとしたい。
                func();
                //me._exec(func, [e])
                e.stopPropagation();  // イベント伝播を停止
            })
        }
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
    whenClicked (func) {
        const me = this;
        // this.renderer#pick() で判定すること。
    }
}

module.exports = Entity;
