/**
 * Sample05
 * ステージをクリック（タッチ）したときに音を鳴らす（ずっと繰り返し）
 * 再度クリックしたときに音を止める。
 */
P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
}


P.prepare = async function() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );
}

P.setting = async function() {

    P.stage.whenFlag(async function() {
        // 音を登録する
        this.addSound( P.sounds.Chill, { 'volume' : 100 } );
    });

    // クリックフラグ変数を定義する
    let clickFlag = false;

    // ステージをクリックしたときの動作
    P.stage.whenClicked(async function () {
        
        if( clickFlag == false) {
            // 「終わるまで音を鳴らす」をずっと繰り返す、スレッドを起動する
            this.startThread( async function() {
                for(;;) {
                    await this.startSoundUntilDone();
                    if( clickFlag == true) {
                        break;
                    }
                    await P.Utils.wait(P.Env.pace);
                }
                clickFlag = false;
            });
            clickFlag = true;
        } else {
            this.soundStop(); // 鳴っている音を止める。
        }
    })

}