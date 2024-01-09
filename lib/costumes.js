const Env = require('./env');
const Importer = require('./importer');
const Utils = require('./utils');
const Costumes = class {

    constructor(render) {
        this.render = render;
        this.skinId = null;
        this.costumes = new Map();
        this.skinIdDone = new Map();
        this._position = {x:0, y:0};
        this._direction = 90;
        this._scale = {x:100, y:100};
   }
   async addImage(name, image) {
        await this._setSkin(name, image);
        await P.Utils.wait(Env.pace);
    }
    async loadImage(name, image) {
//        this.name = name;
        const _img = await Importer.loadImage(image);
        this.addImage(name,_img);
//        await this._setSkin(_img);
//        await P.Utils.wait(Env.pace);
    }
    async _setSkin(name,_img) {
        if(Importer.isSVG(_img)) {
            //console.log('costumes _setSkin is Svg')
            // 複数回ロードしたら、その都度 skinId は変わるのか？（変わるはず！）
            const _svgText = _img;
            const _skinId = await this._setSvgSkin(_svgText);
            //console.log('Costumes _setSkin skinId=',_skinId)
            this.costumes.set( name , _skinId);
            if( this.skinId == null) {
                this.skinId = _skinId; // 初回のSkinId 
            }
        }else{
            const _bitmap = _img;
            const _skinId = await this._setBitmapSkin(_bitmap);        
            this.costumes.set( name , _skinId);
            if( this.skinId == null) {
                this.skinId = _skinId; // 初回のSkinId 
            }
        }
    }
    async _setSvgSkin(_svgText) {
        const skinId = this.render.renderer.createSVGSkin(_svgText);
        await Utils.wait(10)
        this.skinIdDone.set(skinId, true);
        return skinId;
    }
    async _setBitmapSkin(_bitmap) {
        const skinId = await this.render.renderer.createBitmapSkin(_bitmap);
        this.skinIdDone.set(skinId, true);
        return skinId;        
    }
    setDirection(_direction) {
        this._direction = _direction;
    }
    setPosition(x, y) {
        this._position.x = x;
        this._position.y = y;
    }
    setScale(x,y) {
        this._scale.x = x;
        this._scale.y = y;
    }
    switchCostumeByName(name) {
        if( this.costumes.has(name)) {
            this.skinId = this.costumes.get(name);
        }
        // do nothing
    }
    switchCostumeByNumber(idx) {
        if(Utils.isInteger(idx)) {
            const _keys = this.costumes.keys;
            if( 0 > idx  || idx == _keys.length || idx > _keys.length ) {
                // do nothing
            }else{
                const _name =  _keys[idx];       
                this.skinId = this.costumes.get(_name);
            }    
        }
        // do nothing
    }
    nextCostume() {
        const costumesKeys = Array.from(this.costumes.keys());
        if(costumesKeys.length == 0) {
            return; // do nothing
        }
        if(this.skinId == null) {
            const name = costumesKeys[0];
            const _skinId = this.costumes.get(name);
            this.skinId == _skinId;
            return;
        }
        // search next skinId
        let _idx = 0;
        for(const _name of costumesKeys) {
            const _skinId = this.costumes.get(_name);
            if(_skinId == this.skinId) {
                if( _idx == (costumesKeys.length - 1) ){
                    const nextName = costumesKeys[0];
                    this.skinId = this.costumes.get(nextName);
                }else{
                    const nextName = costumesKeys[_idx+1];
                    this.skinId = this.costumes.get(nextName);
                }
                return;
            }
            _idx += 1;
        }
        // do nothing

    }

    update(drawableID, effect = {}) {
        if(!this.skinIdDone.has(this.skinId)) return;
        const me = this;
        const properties = {};
        const skinObj = {skinId: this.skinId};
        const directionObj = {direction: this._direction};
        const scaleObj = {scale: [this._scale.x, this._scale.y]};
                        //scale: [this.scale.x, this.scale.y],
        const positionObj = {position: [this._position.x, this._position.y]};
        Object.assign(properties, skinObj, directionObj, scaleObj, positionObj, effect);
        this.render.renderer.updateDrawableProperties(drawableID, properties);
    }
};

module.exports = Costumes;