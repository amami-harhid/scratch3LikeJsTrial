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

}

module.exports = Utils;