/**
 * Sample05
 * ステージをクリック（タッチ）したときに音を鳴らす（ずっと繰り返し）
 * 再度クリックしたときに音を止める。
 * 自前でクリック制御をしないといけない。
 * クリック制御に使う変数のスコープに留意すること！。
 */
P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
}


P.prepare = async function() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );
}


let threadStartFlag = false;

P.setting = async function() {

    P.stage.whenRightNow(async function() {
        // 音を登録する
        this.addSound( P.sounds.Chill, { 'volume' : 100 } );
    });

    // ステージをクリックしたときの動作
    P.stage.whenClicked(async function () {
        // クリックフラグをみて実行中でないときに音をならす
        if( threadStartFlag == false) {
            // 「終わるまで音を鳴らす」をずっと繰り返す
            threadStartFlag = true;
            for(;;) {
                await this.startSoundUntilDone();
                // トップスコープにて定義しているので参照可能。
                if( threadStartFlag == false) {
                    break;
                }
            }
            threadStartFlag = false;
        } else {
            threadStartFlag = false;
            this.soundStop(); // 鳴っている音を止める。
        }
    })
    console.log('setting final')
}