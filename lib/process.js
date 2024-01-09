const Backdrops = require('./backdrops');
//const Canvas = require('./canvas');
//const Css = require('./css');
const Costumes = require('./costumes');
const Element = require('./element');
const Env = require('./env');
const Importer = require('./importer');
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
        this._render = null;
        this._id = this._generateUUID();
        this._preloadImagePromise = [];
        this._preloadSoundPromise = [];
        this._sounds = {}
        this._images = {};
    }
    get images() {
        return this._images;
    }
    get sounds() {
        return this._sounds;
    }
    _generateUUID () {
        return Utils.generateUUID();
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
    get Importer () {
        return Importer;
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
    set stage ( stage ) {
        this._stage = stage;
    }

    get stage () {
        return this._stage;
    }

    async _staging () {
        // ここで フラグとキャンバスを表示する
        const main = this.main;
        main.classList.remove(Element.DISPLAY_NONE);
        const render = new Render();
        await this.staging(render);
        await P.Utils.wait(Env.pace);
        this._stage.update();
        this._stage.draw();
    }
    async staging () {

    }

    set flag ( flag ) {
        this._flag = flag;
    }

    get flag () {
        return this._flag;
    }

    waitImportAllDone () {

        return new Promise( async (resolve) => {
            for(;;){
                if( this._stage._isImportAllDone ()) {
                    let _importAllDone = true;
                    for( let i=0; i< this._stage._sprites.length; i++ ){
                        const v = this._stage._sprites[i];
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

    loadImage(name, imageUrl) {
        const data = Importer.loadImage(imageUrl, name);
        this._preloadImagePromise.push(data);
        return data;
    }
    async loadSound(name, soundUrl) {
        const data = Importer.loadSound(soundUrl, name);
        this._preloadSoundPromise.push(data);
        return data;
    }
    async _waitUntilPreloadDone() {
        if(this._preloadImagePromise.length > 0 ) {
            const _images = await Promise.all(this._preloadImagePromise);
            for(const v of _images) {
                this._images[v.name] = v.data;
            }    
        }
        if( this._preloadSoundPromise.length > 0 ) {
            const _sounds = await Promise.all(this._preloadSoundPromise);
            for(const v of _sounds) {
                this._sounds[v.name] = v.data;
            }    
        }


    }
    async _preload () {
        this.preload();
    }
    async preload () {

    }
    async _init() {
        this._preload();
        await this._waitUntilPreloadDone();
        await Element.init();
        const main = this.main;
        main.classList.add(Element.DISPLAY_NONE);
        if(this.setup) {
            await this.setup();
            await this._staging();
        }else{
            await this._staging();
        }

    }

    async _start () {
        this.start();
        for(;;) {
            this._draw();
            await Utils.wait(Env.pace);
        }
    }
    async start () {

    }
    _draw () {
        this.draw();
    }

    draw () {
        this.stage.draw();
    }

}

//module.exports = {default: Process.getInstance()};
export default Process.getInstance();