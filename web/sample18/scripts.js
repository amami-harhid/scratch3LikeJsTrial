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
}

P.prepare = async function() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );

    P.cross = new P.Sprite("Cross");
    P.cross.addImage( P.images.Cross01 );
    P.cross.addImage( P.images.Cross02 );
    P.cross.setScale(100,100);

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
    P.cross.whenFlag( async function() {
        this.direction = 90;
        // ずっと繰り返す
        for(;;) {
            if(P.keyboard.isKeyPressed('ArrowRight')){
                this.moveSteps(10);
            }
            if(P.keyboard.isKeyPressed('ArrowLeft')){
                this.moveSteps(-10);
            }
        }    
    });
    P.cross.whenFlag( async function() {
        // ずっと繰り返す
        for(;;) {
            // Keyboard 改良点
            // 矢印キーを押しながら、スペースキーを検知させたい
            if(P.keyboard.isKeyPressed('Space')){
                const options = {scale:{x:20,y:20},direction:0}
                this.clone(options).then(c=>{
                    //console.log('clone', c.id)
                    c.life = 1000;
                    c.startThread(async function(){
                        for(;;) {
                            this.moveSteps(10);
                            if(this.life < 0){
                                break;
                            }
                        }
                        // this.remove() <--- なんとかすること！
                        // remove() を２回読んでも ２回目以降は無視したい。
                        // drawableID が renderer で管理されていないときは無視すること。
                    });
                    c.startThread(async function(){
                        for(;;) {
                            //this.nextCostume();
                            // nextCostume() のなかで端に触れたら跳ね返る、を入れたのは失敗だった。
                            if(this.life < 0){
                                break;
                            }
                        }
                    });
                    c.startThread(async function(){
                        for(;;) {
                            if(this.isTouchingEdge() || this.life < 0){
                                break;
                            }
                        }
                    });
                })
                //await P.waitUntil( P.keyboard.isKeyNotPressed.bind(P.keyboard) );
            }
        }    
    });
    P.cross.whenFlag( async function() {
        // ずっと繰り返す
        //for(;;) {
        //    console.log(P.keyboard._keysPressed);
        //    await P.wait(100);
        //}    
    });
}
