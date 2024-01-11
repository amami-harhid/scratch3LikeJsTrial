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
    createThread( func ) {
        setTimeout(func, 0);
    }
    async waitUntil( condition ) {
        for(;;) {
            if( condition() ) {
                break;
            }
            await Utils.wait(Env.pace);
        }
    }
    async _staging (render) {
        // ここで フラグとキャンバスを表示する
        const main = this.main;
        main.classList.remove(Element.DISPLAY_NONE);
        await this.staging(render);
        await P.Utils.wait(Env.pace);
        if(this._stage) {
            this._stage.update();
            this._stage.draw();    
        }
    }
    async staging (render) {

    }

    set flag ( flag ) {
        this._flag = flag;
    }

    get flag () {
        return this._flag;
    }
/*

    // これは使わない！
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
 */
    loadImage(imageUrl, name) {
        let _name ;
        if( name ) {
            _name = name;
        }else{
            _name = imageUrl.replace(/\.[^.]+$/)
        }
        const data = Importer.loadImage(imageUrl, _name);
        this._preloadImagePromise.push(data);
        return data;
    }
    loadSound(soundUrl, name) {
        let _name ;
        if( name ) {
            _name = name;
        }else{
            _name = imageUrl.replace(/\.[^.]+$/)
        }
        const data = Importer.loadSound(soundUrl, _name);
        this._preloadSoundPromise.push(data);
        return data;
    }
    async _waitUntilPreloadDone() {
        if(this._preloadImagePromise.length > 0 ) {
            const _images = await Promise.all(this._preloadImagePromise);
            for(const v of _images) {
                this._images[v.name] = {'name': v.name, 'data': v.data };
            }    
        }
        if( this._preloadSoundPromise.length > 0 ) {
            const _sounds = await Promise.all(this._preloadSoundPromise);
            for(const v of _sounds) {
                this._sounds[v.name] = {'name' : v.name, 'data': v.data };
            }    
        }


    }
    async _preload () {
        if( this.preload ) {
            this.preload();
        }
    }
    async _init() {
        this._preload();
        await this._waitUntilPreloadDone();
        await Element.init();
        const main = this.main;
        main.classList.add(Element.DISPLAY_NONE);
        this._render = new Render();
        if(this.setup) {
            await this.setup(this._render);
            await this._staging(this._render);
        }else{
            await this._staging(this._render);
        }

    }

    async _start () {
        console.log('---- start -----')
        this._start();
    }
    async drawLoop() {
        for(;;) {
            this._draw();
            await Utils.wait(Env.pace);
        }
    }
    async _start() {
        P.start();
        setInterval(P._draw,Env.pace);
        if(P._stage) {
            await P.Utils.wait(Env.pace);
            P._stage.update();
            P._stage.draw();    
        }

    }
    async start () {

    }
    _draw () {
        //console.log('_draw')
        P.draw();
    }

    draw () {
        if(this._stage) {
            this._stage.update();
            this.stage.draw();
        }
    }

}

//module.exports = {default: Process.getInstance()};
export default Process.getInstance();