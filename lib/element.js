const Canvas = require('./canvas');
const Env = require('./env');
const Process = require('./process');
const Utils = require('./utils');
const Element = class {
    static createMain (zIndex) {
        let main = document.getElementById('main');
        if(main == undefined) {
            main = document.createElement('main');
            main.id = 'main';
            document.body.appendChild(main);
        }
        main.style.width = `${innerWidth}px`
        main.style.height = `${innerHeight}px`
        main.style.zIndex = zIndex
        main.style.position = 'absolute'
        main.style.touchAction = 'manipulation'
        return main
    }
    static createCanvas(main) {
        const canvas = Canvas.createCanvas(main);
        canvas.classList.add("likeScratch-canvas");
        Element.canvas = canvas;
        return canvas;
    }
    static createFlag (main) {
        if (Element.flag) {
            return Element.flag;
        }
        const flagSize = 130;
        let flag = document.getElementById('start-flag');
        if( flag ) {
            main.removeChild(flag);
        }
        flag = document.createElement('div')
        flag.id = 'start-flag';
        main.appendChild(flag);
        // Convert the center based x coordinate to a left based one.
        const x = -(flagSize / 2);
        // Convert the center based y coordinate to a left based one.
        const y = -(flagSize / 2)  ;
        // looks
        flag.style.width = `${flagSize}px`;
        flag.style.height = `${flagSize}px`;
        flag.style.position = 'absolute';
        flag.innerHTML = '&#9873;'; // 旗マーク
  
        flag.style.left = `${(innerWidth / 2) + x}px`;
        flag.style.top = `${(innerHeight / 2) + y}px`;
        flag.className = 'likeScratch-flag';
        //fel.style.display = 'none'
        Element.flag = flag;
        return flag;
    }
    static async init() {
        const main = Element.createMain(999);
        Element.createCanvas(main);
        const flag = Element.createFlag(main);
        const DISPLAY_NONE = "displayNone";
        await LS.process._staging();
        await LS.process._draw();
        flag.addEventListener('click', async function() {
            flag.classList.add(DISPLAY_NONE);
            flag.remove();
            Process.allowedToStart = true;
            LS.process._start();
            for(;;) {
                LS.process._draw();
                await Utils.wait(33);
            }
        });
    }
}

module.exports = Element;
