const EventEmitter = require('events').EventEmitter;

const ExcludingWords = ['Alphanumeric', 'Tab'];
const ReplaceWords = {
    ' ': 'Space',
}
const Keyboard = class extends EventEmitter {

    static getInstance() {
        if( Keyboard._instance == undefined ) {
            Keyboard._instance = new Keyboard();
        }
        return Keyboard._instance;
    }

    constructor() {
        super();
        this._keysPressed = [];
        this._watching = false;
    }
    get KEY_DOWN () {
        return 'keybord_key_down';
    }
    get KEY_UP () {
        return 'keybord_key_up';
    }
    startWatching() {
        if(this._watching === false) {
            document.addEventListener('keydown', this.whenKeyDown);
            document.addEventListener('keyup', this.whenKeyUp);
            this._watching = true;    
        }
    }
    stopWatching() {
        if( this._watching  === true) {
            const me = this;
            document.removeEventListener('keydown', this.whenKeyDown);
            document.removeEventListener('keyup', this.whenKeyUp ,);
            this._keysPressed = [];
            this._watching = false;    
        }
    }
    _keyReplacing( key ) {
        const wordsKey = Object.keys(ReplaceWords);
        if(wordsKey.indexOf(key) < 0) {
            return key;
        }
        return ReplaceWords[key];
    }
    whenKeyDown (e) {
        const me = Keyboard.getInstance();
        if( e.key ) {
            const key = e.key;
            if( ExcludingWords.indexOf( key ) < 0) {
                let _key = (key.length == 1)? key.toLowerCase() : key;
                _key = me._keyReplacing(_key);
                if( me._keysPressed.indexOf(_key) < 0 ) {
                    me.emit( me.KEY_DOWN, _key, e.code);
                    me._keysPressed.push(_key);
                }   
            }
        }
    }
    whenKeyUp (e) {
        if( e.key ) {
            const key = e.key;
            if( ExcludingWords.indexOf( key ) < 0) {
                const me = Keyboard.getInstance();
                let _key = (key.length == 1)? key.toLowerCase() : key;
                _key = me._keyReplacing(_key);
                me.emit( me.KEY_UP, _key, e.code);
                const _keysPressed = me._keysPressed;
                me._keysPressed = _keysPressed.filter((k)=>{ return k != _key });    
            }
        }
    }
    isKeyPressed( _key ) {
        if( _key ) {
            if( this._keysPressed.indexOf(_key) < 0 ) {
                // 指定したキーが押されていないとき
                return false;
            }
            return true;
        }else{
            // 何か押されているとき TRUE
            return this._keysPressed.length > 0
        }
    }
    isKeyNotPressed( _key ) {
        return !this.isKeyPressed(_key);
    }
}

export default Keyboard.getInstance();