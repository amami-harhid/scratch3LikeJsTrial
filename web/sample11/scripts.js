/**
 * Sample11
 * スプライト（CAT)を １秒で「どこかの」場所へ移動する
 * 
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
    P.cat.position.x = 0;
    P.cat.position.y = 0;
    P.cat.addImage( P.images.Cat );
}

const _changeDirection = 1;

P.setting = async function() {
    P.stage.whenFlag(async function() {
        this.addSound( P.sounds.Chill, { 'volume' : 50 } );
    });
    P.stage.whenFlag(async function() {
        for(;;) {
            await this.startSoundUntilDone();
        }
    });
    P.cat.whenFlag(async function() {
        for(;;) {
            // 繰り返すごとに 1秒待つ
            await P.wait(1000);
            // １秒でどこかへ行く
            const randomPoint = P.randomPoint;
            await this.glideToPosition(1,  randomPoint.x, randomPoint.y);            
        }
    });
}