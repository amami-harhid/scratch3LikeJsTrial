/**
 * test drawing text
 *  非同期処理と await 
 * 「終わるまで音を鳴らす」をずっと繰り返す
 */

P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    await loadFont('myFont', "./fonts/PottaOne-Regular.ttf")
}

P.prepare = async function() {
    P.stage = new P.Stage();
    P.stage.addImage( P.images.Jurassic );
    create2DContext() 
}

P.setting = async function() {

    // フラグクリック時のステージの動作
    P.stage.whenFlag(async function() {
        textDrawer("Game Start", 0, 0, 550, "myFont", "#6080A0");
        textDrawer("愛うえお", 0, -50, 100, "myFont", "red");
        textDrawer("愛うえお", 0, -50, 95, "myFont", "white");
    });
}


