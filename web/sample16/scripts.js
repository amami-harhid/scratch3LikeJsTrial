/**
 * Sample16
 * スプライト() : 回転方向⇒左右のみ回転 
 * スプライト（CAT2) : 回転方向⇒自由に回転  
 * スプライト（CAT3) : 回転方向⇒回転しない
 * 
 * 各スプライトはマウスポインターに向いて追いかける。
 * ５秒ごとに元の位置に戻る。
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

    P.cat1 = new P.Sprite("Cat1");
    P.cat1.addImage( P.images.Cat );
    P.cat1.setPosition( -P.stageWidth/4, +P.stageHeight/4 );
    P.cat1.effect.color = 50;
    P.cat1.setRotationStyle( P.RotationStyle.LEFT_RIGHT );

    P.cat2 = new P.Sprite("Cat2");
    P.cat2.addImage( P.images.Cat );
    P.cat2.setPosition( 0, 0 );

    P.cat3 = new P.Sprite("Cat3");
    P.cat3.addImage( P.images.Cat );
    P.cat3.setPosition( P.stageWidth /4, -P.stageHeight/4 );
    P.cat3.effect.color = 100;
    P.cat3.setRotationStyle( P.RotationStyle.DONT_ROTATE );

}

const _changeDirection = 1;

P.setting = async function() {
    P.stage.whenFlag(async function() {
        this.addSound( P.sounds.Chill, { 'volume' : 20 } );
    });
    P.stage.whenFlag(async function() {
        // ずっと繰り返す
        for(;;) {
            await this.startSoundUntilDone();
        }
    });
    P.stage.whenFlag(async function() {
        // ずっと繰り返す
        for(;;) {
            // ３秒待つ
            await P.wait(5000);
            P.cat1.setPosition( -P.stageWidth/4, +P.stageHeight/4 );
            P.cat2.setPosition( 0, 0 );
            P.cat3.setPosition( P.stageWidth /4, -P.stageHeight/4 );
        }
    });
    P.cat1.whenFlag( async function() {
        // ずっと繰り返す
        for(;;) {
            this.pointToMouse();
            this.moveSteps(2);
        }    
    });
    P.cat2.whenFlag( async function() {
        // ずっと繰り返す
        for(;;) {
            this.pointToMouse();
            this.moveSteps(2);
        }    
    });
    P.cat3.whenFlag( async function() {
        // ずっと繰り返す
        for(;;) {
            this.pointToMouse();
            this.moveSteps(2);
        }    
    });
}