/**
 * Sample12
 * スプライト（CAT)を １秒でクリックした場所へ移動する
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
    "use strict";
    P.stage.whenFlag(async function() {
        this.addSound( P.sounds.Chill, { 'volume' : 50 } );
    });
    P.stage.whenFlag(async function() {
        for(;;) {
            await this.startSoundUntilDone();
            //await P.Utils.wait(P.Env.pace);
        }
    });
    P.stage.whenClicked(async function() {

        // CANVAS上のマウス位置の計算、うまくいかない！
        // window.devicePixelRatio のせい？
        // --> .render.stageWidth(480) .render.stageHeight(360) と Canvasの大きさの比率で Spriteの比率へ変換するべき
        const x = P.stage.mouse.scratchX;
        const y = P.stage.mouse.scratchY;
        console.log(`stageWidth=${P.render.stageWidth}, stageHeight=${this.render.stageHeight}`)
        console.log(`canvas=(${P.canvas.width},${P.canvas.height})`)
        console.log(`mouse=(${P.stage.mouse.x},${P.stage.mouse.y}), x,y = (${x},${y})`)
        //await P.cat.glideToPosition(0.5, x, y);     
        P.cat.move(x,y)
    });
}