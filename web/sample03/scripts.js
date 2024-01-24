/**
 * Sample03
 *  非同期処理と await 
 * 「終わるまで音を鳴らす」をずっと繰り返す
 */

P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
}

P.prepare = async function() {
    P.stage = new P.Stage();
    P.stage.addImage( P.images.Jurassic );
}

P.setting = async function() {

    // ステージの動作（いますぐに）
    P.stage.whenRightNow(async function() {
        // 音を登録する
        this.addSound( P.sounds.Chill, { 'volume' : 100 } );
    });
    // フラグクリック時のステージの動作
    P.stage.whenFlag(async function() {
        // 「終わるまで音を鳴らす」をずっと繰り返す
        for(;;) {
            // 非同期処理に awaitをつけると、処理が終わるまで待つことができる
            await this.startSoundUntilDone();
        }
    });
}