const Canvas = class{

    static createCanvas(main) {
        if( Canvas.canvas ) {
            return;
        }
        let canvas = document.getElementById('canvas');
        if( canvas == undefined) {
            canvas = document.createElement('canvas');
            canvas.id = 'canvas';
            main.appendChild(canvas);
        }
        Canvas.canvas = canvas;
        return canvas;
    }
}

module.exports = Canvas;