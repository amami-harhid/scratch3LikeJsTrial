/**
 * Sample07
 * スプライトを 動かす ( 端に触れたら )
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

    P.stage.whenFlag(async function() {
        // 音を登録する
        this.addSound( P.sounds.Chill, { 'volume' : 50 } );
    });
    P.stage.whenFlag(async function() {
        // 「終わるまで音を鳴らす」をずっと繰り返す、スレッドを起動する
        this.startThread( async function() {
            for(;;) {
                await this.startSoundUntilDone();
            }
        });
    });

    P.cat.whenFlag( async function() {
        this.direction = (Math.random()-0.5) * 180;
        // 「終わるまで音を鳴らす」をずっと繰り返す、スレッドを起動する
        this.startThread( async function() {
            const steps = 20;
            for(;;) {
                this.moveSteps( steps );
                this.ifOnEdgeBounds();
            }
        });

    });
}