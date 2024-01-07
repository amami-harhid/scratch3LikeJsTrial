const Backdrops = require('./backdrops');
//const Canvas = require('./canvas');
//const Css = require('./css');
const Costumes = require('./costumes');
const Element = require('./element');
const Env = require('./env');
const Looks = require('./looks');
const Render = require('./render');
const Sounds = require('./sounds');
const Stage = require('./stage');
const Sprite = require('./sprite');
const Utils = require('./utils');
const Process = class {

    static getInstance() {
        if( Process._instance == undefined ) {
            Process._instance = new Process();
        }
        return Process._instance;
    }

    constructor () {
        this._sprites = [];
        this._render = null;
        this.id = this._generateUUID();
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
    get Backdrops () {
        return Backdrops;
    }
    get Costumes () {
        return Costumes;
    }
    get Element () {
        return Element;
    }
    get Env () {
        return Env;
    }
    get Looks () {
        return Looks;
    }
    get Render () {
        return Render;
    }
    get Sounds () {
        return Sounds;
    }
    get Stage () {
        return Stage;
    }
    get Sprite () {
        return Sprite;
    }
    get Utils () {
        return Utils;
    }
    set render( render ) {
        this._render = render;
    }
    get sprites () {
        return this._sprites;
    }
    addSprite(_sprite) {
        this._sprites.push(_sprite);
    }
    _sortSprites() {
        const _sprites = this._sprites;
        this._sprites = _sprites.sort(function(a,b) {
            if (a.z > b.z) return -1;
            if (b.z > a.z) return  1;
            return 0;
        });
    }
    async _staging () {
        await this.staging();
    }
    async staging () {

    }

    set stage ( stage ) {
        this._stage = stage;
    }

    get stage () {
        return this._stage;
    }

    set flag ( flag ) {
        this._flag = flag;
    }

    get flag () {
        return this._flag;
    }

    waitImportAllDone () {

        const _p = this;
        return new Promise( async (resolve) => {
            for(;;){
                if( _p._stage._isImportAllDone ()) {
                    let _importAllDone = true;
                    for( let i=0; i<_p._sprites.length; i++ ){
                        const v = _p._sprites[i];
                        if( v._isImportAllDone () === false ) {
                            _importAllDone = false;
                        }
                    }
                    if(_importAllDone === true) {
                        break;
                    }
                }
                await Utils.wait(Env.pace);
            }
            resolve();
        });
    }
    async _start () {
        const _p = this;
        await _p.waitImportAllDone();

        this.start();
        for(;;) {
            _p._draw();
            await Utils.wait(Env.pace);
        }
    }
    async start () {

    }
    _draw () {
        this.draw();
    }

    draw () {
        console.log(' empty draw ')
    }

}

//module.exports = {default: Process.getInstance()};
export default Process.getInstance();