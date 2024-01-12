/**
 * Sample01
 * 画像をロードして ステージに表示する
 */
P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
}

P.prepare = async function() {
    P.stage = new P.Stage();
    P.stage.addImage( P.images.Jurassic );
}