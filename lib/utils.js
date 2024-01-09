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
    static generateUUID () {
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

}

module.exports = Utils;