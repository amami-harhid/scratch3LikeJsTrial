const Utils = require('./utils');
const Process = class{

    static get allowedToStart() {
        if( Process._allowedToStart ) {
            return Process._allowedToStart;
        }else{
            return false;
        }
    }
    static set allowedToStart(_allowedToStart) {
        Process._allowedToStart = _allowedToStart;
    }
    constructor() {

    }
    async _staging() {
        await this.staging();
    }
    async staging() {

    }
    async _start() {
        await this.start();
    }
    async start() {

    }
    _draw() {
        this.draw();
    }
    draw() {
    }

}

module.exports = Process;