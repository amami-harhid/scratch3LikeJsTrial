const Utils = class {

    static isNumber( val ){
        if( val && typeof val === 'number' && isFinite(val)) {
            return true;
        }
        return false;
    }
    static isInteger( val ){
        if(Number.isInteger(val)){
            return true;
        }
        return false;
    }
    static async wait (milliSecond = Utils.WAIT_TIME) {
        return new Promise(resolve => setTimeout(resolve, milliSecond));
      }
    static get WAIT_TIME () {
        return 0.05;
    }    

    static mapDeepCopy(src) {
        const dist = new Map();
        for(const k of src.keys()) {
            const v = src.get(k);
            dist.set(k, v);
        }
        return dist;
    }
}

module.exports = Utils;