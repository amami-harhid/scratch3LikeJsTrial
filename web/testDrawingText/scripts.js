/**
 * test drawing text
 *  非同期処理と await 
 * 「終わるまで音を鳴らす」をずっと繰り返す
 */

P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadFont('./fonts/PottaOne-Regular.ttf', 'myFont');
}

P.prepare = async function() {
    P.stage = new P.Stage();
    P.stage.addImage( P.images.Jurassic );
}

P.setting = async function() {
    const textDraw = new P.TextDraw();

    // フラグクリック時のステージの動作
    P.stage.whenFlag(async function() {
        const textDraw = new P.TextDraw();
        const textOption = new P.TextOption();
        textOption.fontName = 'myFont'
        textOption.fontSize = 300;
        let x = 0;
        let y = 0;
        let colorR = 10;
        let colorG = 10;
        let colorB = 10;
        for(let count in Array(10).fill()) {
            y -= 1;
            colorR -= 2;
            colorG -= 2;
            colorB -= 2;
            textDraw.clear()
            textDraw.textDraw("Game Start", x, y, textOption);    
            //textDraw.textDraw("Game Start", x, y, 60, "myFont", `#${colorR}${colorG}${colorB}`);    
            await P.wait( )
        }
        for(;;){
            for(let count in Array(20).fill()) {
                y += 1;
                colorR += 2;
                colorG += 2;
                colorB += 2;
                textDraw.clear()
                textDraw.textDraw("Game Start", x, y, textOption);    
//                textDraw.textDraw("Game Start", x, y, 60, "myFont", `#${colorR}${colorG}${colorB}`);    
                await P.wait( )
            }
            for(let count in Array(20).fill()) {
                y -= 1;
                colorR -= 2;
                colorG -= 2;
                colorB -= 2;
                textDraw.clear()
                textDraw.textDraw("Game Start", x, y, textOption);    
//                textDraw.textDraw("Game Start", x, y, 60, "myFont", `#${colorR}${colorG}${colorB}`);    
                await P.wait( )
            }
        }
    });
}


