const Backdrops = require('./backdrops');
//const Canvas = require('./canvas');
//const Css = require('./css');
const Costumes = require('./costumes');
const Element = require('./element');
const Env = require('./env');
const EventEmitter = require('events').EventEmitter;
const Importer = require('./importer');
const js_beautify = require('js-beautify');
const Keyboard = require('./io/keyboard');
const Looks = require('./looks');
const MathUtils = require('./math-utils');
const moment = require('moment');
const NowLoading = require('./nowLoading');
const Render = require('./render');
const Rewrite = require('./rewrite');
const RotationStyle = require('./rotationStyle');
const Runtime = require('./engine/runtime');
const Sensing = require('./sensing');
const Sounds = require('./sounds');
const Sprite = require('./sprite');
const Stage = require('./stage');
const StageLayering = require('./stageLayering');
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
        this._preloadDone = false;
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
    get EventEmitter () {
        return EventEmitter;
    }
    get Importer () {
        return Importer;
    }
    get js_beautify () {
        return js_beautify;
    }
    get keyboard () {
        return Keyboard;
    }
    get Looks () {
        return Looks;
    }
    get NowLoading () {
        return NowLoading;
    }
    get MathUtils () {
        return MathUtils;
    }
    get moment () {
        return moment;
    }
    get Render () {
        return Render;
    }
    get Rewrite () {
        return Rewrite.default;
    }
    get RotationStyle () {
        return RotationStyle;
    }
    get Sounds () {
        return Sounds;
    }
    get Stage () {
        return Stage;
    }
    get StageLayering () {
        return StageLayering;
    }
    get Sprite () {
        return Sprite;
    }
    get Utils () {
        return Utils;
    }
    get render () {
        return this._render;
    }
    set render( render ) {
        // _init() の中で設定される。
        this._render = render;
    }
    set stage ( stage ) {
        this._stage = stage;
    }

    get stage () {
        return this._stage;
    }

    get stageWidth () {
        return this._render.stageWidth;
    }

    get stageHeight () {
        return this._render.stageHeight;
    }

    get mousePosition () {
        const _rateX = this._render.stageWidth / this.canvas.width;
        const _rateY = this._render.stageHeight / this.canvas.height;
        const _mouseX = (this.stage.mouse.x - this.canvas.width/2 ) * _rateX;
        const _mouseY = (this.canvas.height/2 - this.stage.mouse.y) * _rateY;
        return {x: _mouseX, y: _mouseY};
    }

    get randomPoint () {
        const randomPointX = (Math.random()-0.5)*this.stageWidth;
        const randomPointY = (Math.random()-0.5)*this.stageHeight;
        return { x: randomPointX, y: randomPointY };
    }

    get randomDirection () {
        const direction = (Math.random()-0.5)* 2 * 360;
        if( direction > 180 ){
            return direction - 180;
        }
        return direction;
    }

    set flag ( flag ) {
        this._flag = flag;
    }

    get flag () {
        return this._flag;
    }

    get wait () {
        return Utils.wait;
    }
    async _init() {
//        const keyboard = Keyboard.default;
//        keyboard.startWatching();
        // Now Loading 準備 START
        const mainTmp = document.createElement('main');
        this.mainTmp = mainTmp;
        mainTmp.id = 'mainTmp';
        mainTmp.classList.add('nowLoading');
        mainTmp.style.zIndex = -1;
        mainTmp.style.position = 'absolute'
        mainTmp.style.touchAction = 'manipulation'
        mainTmp.style.width = `${innerWidth}px`
        mainTmp.style.height = `${innerHeight}px`

        document.body.appendChild(mainTmp);
        // ちょっとだけ待つ（ Now Loading を見せたいため )
        await Utils.wait(1000);
        // Now Loading 準備 OWARI

        this._preload();
        await this._waitUntilPreloadDone();
        await Element.init();
        const main = this.main;
        main.classList.add(Element.DISPLAY_NONE);
        this._render = new Render();
        this.runtime = new Runtime();
        this.runtime.attachRenderer(this._render.renderer);
        this._prepareReload();

        await this._prepare();
        await this._setting();
    }

    async _preload () {
        if( P.preload ) {
            P.preload();
        }
    }

    async _prepare () {
        // この時点で各種ローディングは終わっているので、NowLoadingを消す。
        this.mainTmp.remove();

        // Mainタグから非表示のクラスを除去しフラグとキャンバスを表示する
        const main = this.main;
        main.classList.remove(Element.DISPLAY_NONE);
        // prepareメソッドの実行を開始する
        if( P.prepare ) {
            await P.prepare();
            await P.Utils.wait(Env.pace);
            if( this._stage ) {
                this._stage.update();
                this._stage.draw();
            }    
        }
    }
    async _setting () {
        if( P.setting ) {
            await P.setting ();
        }
    }
    // Element.init() 内から呼び出される。
    _drawingStart() {
        if( this._stage ) {
            const me = this;
            const pace = this.Env.pace;
            this._stage.update();
            setTimeout(async function(){
                for(;;) {
                    me._draw();
                    await me.Utils.wait(pace);
                }
            }, pace);
        }
    }
    _draw () {
        if( this._stage ) {
            this._stage.update ();
            P._stage.draw();
            if( P.draw ) {
                P.draw();
            }
        }
    }
    getKeyIsDown(key) {
        return this.runtime.getKeyIsDown(key);
    }
    _prepareReload() {
        const _reloadKickBinded = this._reloadKick.bind(this);
        this.runtime.on('KEY_PRESSED', _reloadKickBinded);
    }
    _reloadKick( key ) {
        if( key == 'Escape') {
            // 別スレッドからリロードすると一発でリロードできる
            setTimeout(function(){
                window.location.reload( ); // ページの再読み込み
            },10);            
        }
    }

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

    spriteClone( src, callback ) {
        if( src instanceof P.Sprite ) {
            src.clone().then( async( c ) =>{
                if( callback ) {
                    const _callback = callback.bind( c );
                    _callback();
                }
            });
        }
    }

    get preloadDone() {
        return this._preloadDone;
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

        this._preloadDone = true;
    }
    async waitUntil( condition ) {
        for(;;) {
            if( condition() ) {
                break;
            }
            await Utils.wait(Env.pace);
        }
    }

    


}

export default Process.getInstance();