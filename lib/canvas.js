const Canvas = class{

    static createCanvas(main) {
        if( Canvas.canvas ) {
            return;
        }
        const stageCanvasWrapper = document.createElement('div');
        stageCanvasWrapper.id = 'stageCanvasWrapper';
        stageCanvasWrapper.style.position = 'relative';
        main.appendChild(stageCanvasWrapper);

        let canvas = document.getElementById('canvas');
        if( canvas == undefined) {
            canvas = document.createElement('canvas');
            canvas.id = 'canvas';
            stageCanvasWrapper.appendChild(canvas);
        }
        Canvas.canvas = canvas;
        return canvas;
    }
}

module.exports = Canvas;