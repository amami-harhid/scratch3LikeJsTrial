/**
 * Sample06
 * スプライトを作る
 */
P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}

P.prepare = async function() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );
    P.cat = new P.Sprite("Cat");
    P.cat.addImage( P.images.Cat );
}

P.setting = async function() {

    P.stage.whenRightNow(async function() {
        // 音を登録する
        this.addSound( P.sounds.Chill, { 'volume' : 100 } );
    });
    P.stage.whenFlag(async function() {
        // 「終わるまで音を鳴らす」をずっと繰り返す、スレッドを起動する
        this.startThread( async function() {
            for(;;) {
                await this.startSoundUntilDone();
            }
        });
    });
}