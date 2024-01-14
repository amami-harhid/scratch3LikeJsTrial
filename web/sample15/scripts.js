/**
 * Sample15
 * スプライト（CAT) は端を越えて進めない。
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
    P.cat.addImage( P.images.Cat );
    P.cat.direction = 90;
}

P.setting = async function() {
    P.stage.whenFlag(async function() {
        this.addSound( P.sounds.Chill, { 'volume' : 20 } );
    });
    P.stage.whenFlag(async function() {
        for(;;) {
            await this.startSoundUntilDone();
        }
    });
    P.cat.whenFlag( async function() {
        // ずっと繰り返す、スレッドを起動する
        for(;;) {
            this.moveSteps(10);
        }    
 });
}