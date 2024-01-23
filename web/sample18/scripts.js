/**
 * Sample18
 * 
 * キーボード操作
 * 左矢印、右矢印で、シップが左右に動く。
 * スペースキーで 弾を発射（発射する弾はクローン）
 * 
 */
P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cross1.svg','Cross01');
    this.loadImage('../assets/cross2.svg','Cross02');
    this.loadSound('../assets/Pew.wav','Pew');
}

P.prepare = async function() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );

    P.cross = new P.Sprite("Cross");
    P.cross.position.y = -P.stageHeight/2 * 0.6 
    P.cross.addImage( P.images.Cross01 );
    P.cross.addImage( P.images.Cross02 );
    P.cross.setScale(100,100);

}

const _changeDirection = 1;

P.setting = async function() {
    P.stage.whenFlag(async function() {
        this.addSound( P.sounds.Chill, { 'volume' : 20 } );
    });
    P.cross.whenFlag(async function() {
        this.addSound( P.sounds.Pew, { 'volume' : 100 } );
    });
    P.stage.whenFlag(async function() {
        // ずっと繰り返す
        for(;;) {
            await this.startSoundUntilDone();
        }
    });
    P.cross.whenFlag( async function() {
        this.direction = 90;
        // ずっと繰り返す
        for(;;) {
            if(P.getKeyIsDown('RightArrow')){
                this.moveSteps(15);
            }
            if(P.getKeyIsDown('LeftArrow')){
                this.moveSteps(-15);
            }
        }    
    });
    P.cross.whenFlag( async function() {
        // ずっと繰り返す
        for(;;) {
            // 矢印キーを押しながら、スペースキーを検知させたい
            if(P.getKeyIsDown('Space')){
                this.soundPlay();
                const options = {scale:{x:20,y:20},direction:0}
                this.clone(options);
                //次をコメントアウトしているときは キー押下中連続してクローン作る  
                //await P.waitUntil( P.keyboard.isKeyNotPressed.bind(P.keyboard) );
            }
        }    
    });
    P.cross.whenCloned(function(){
        const c = this; // <--- cross instance;
        const bounds = c.render.renderer.getBounds(c.drawableID);
        const height = Math.abs(bounds.top - bounds.bottom);
        c.position.y += height / 2;
        c.nextCostume();
        c.setVisible(true);
    });
    P.cross.whenCloned(function(){
        const c = this; // <--- cross instance;
        for(;;) {
            const x = this.position.x;
            const y = this.position.y;
            this.setXY(x,y+10);
            if(this.isTouchingEdge()){
                break;
            }
        }
        this.remove();
    });
    P.cross.whenCloned(function(){
        const c = this; // <--- cross instance;
        for(;;) {
            this.turnRight(15);
            if(this.isTouchingEdge()){
                break;
            }
        }
        this.remove();
    });
}
