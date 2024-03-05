const Canvas2D = "canvas-text2D";
function create2DContext() {
    const stageCanvasWrapper = document.getElementById('stageCanvasWrapper');
    const canvas3D = document.getElementById('canvas');
    const canvas2D = document.createElement('canvas')
//    canvas3D.insert( { after: canvas2D } );
    stageCanvasWrapper.appendChild(canvas2D)
    canvas2D.id = 'canvas-2d';
    canvas2D.className = 'canvas-2d';
    canvas2D.style.position = 'absolute'
    canvas2D.style.border = 'solid 10px red'
    canvas2D.style.zIndex = 90
    resize2DContext();
}

function resize2DContext() {
    const canvas3D = document.getElementById('canvas');
    const canvas2D = document.getElementById(Canvas2D)
    canvas2D.style.left = '0px';// `${(innerWidth / 2) + x}px`;
    canvas2D.style.top = '0px'; //`${(innerHeight / 2) + y}px`;
    canvas2D.width = canvas3D.width;
    canvas2D.height = canvas3D.height;
}

async function loadFont(name , url) {
    const font = new FontFace(name, `url(${url})`);
    const _font = await font.load();
    document.fonts.add(_font);
    console.log(document.fonts)
}

function textDrawer( text, x, y, fontSize, fontName, color) {
    const canvas2D = document.getElementById(Canvas2D)
    const width = canvas2D.width;
    const height = canvas2D.height;
    const maxSize = width;
    const ctx = canvas2D.getContext('2d');
    ctx.font = `${fontSize}px ${fontName}` //"150px serif";
    ctx.fillStyle = color; //'#6080A0';
    ctx.shadowColor ="black";
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 10;
    const m = ctx.measureText(text);
    const _x = width / 2 + x - ((maxSize > m.width)? m.width / 2 : maxSize/2);
    const _y = height / 2 - y + m.fontBoundingBoxAscent / 2;
    ctx.fillText(text, _x, _y, maxSize);
    //ctx.strokeText(text, _x, _y)
}
