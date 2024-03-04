const Canvas = class{

    static createCanvas(main) {
        if( Canvas.canvas ) {
            return;
        }
        const stageCanvasWrapper = Canvas.getStageCanvasWrapper();
//        const stageCanvasWrapper = document.createElement('div');
//        stageCanvasWrapper.id = 'stageCanvasWrapper';
//        stageCanvasWrapper.style.position = 'relative';
//        main.appendChild(stageCanvasWrapper);

        let canvas = document.getElementById('canvas');
        if( canvas == undefined) {
            canvas = document.createElement('canvas');
            canvas.id = 'canvas';
            stageCanvasWrapper.appendChild(canvas);
        }
        Canvas.canvas = canvas;
        return canvas;
    }
    static createTextCanvas(main) {
        if( Canvas.textCanvas ) {
            return;
        }
        const stageCanvasWrapper = Canvas.getStageCanvasWrapper();
//        const stageCanvasWrapper = document.createElement('div');
//        stageCanvasWrapper.id = 'stageCanvasWrapper';
//        stageCanvasWrapper.style.position = 'relative';
//        main.appendChild(stageCanvasWrapper);

        let canvas = document.getElementById('textCanvas');
        if( canvas == undefined) {
            canvas = document.createElement('canvas');
            canvas.id = 'textCanvas';
            stageCanvasWrapper.appendChild(canvas);
        }
        Canvas.textCanvas = canvas;
        return canvas;
    }
    static getStageCanvasWrapper() {
        let stageCanvasWrapper = document.getElementById('stageCanvasWrapper');
        if( stageCanvasWrapper ) {
            return stageCanvasWrapper;
        }
        stageCanvasWrapper = document.createElement('div');
        stageCanvasWrapper.id = 'stageCanvasWrapper';
        stageCanvasWrapper.style.position = 'relative';
        main.appendChild(stageCanvasWrapper);

        return stageCanvasWrapper;
    }
}

module.exports = Canvas;