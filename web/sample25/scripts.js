/**
 * Sample25
 * 
 * 弾発射数をモニター表示
 * 左矢印、右矢印で、シップが左右に動き、スペースキーで 弾を発射（発射する弾はクローン）
 * 発射した数をモニター表示する。
 * 
 */
P.preload = async function() {
    //this.loadImage(`${HOST}/assets/Jurassic.svg`,'Jurassic');
    this.loadImage(`${HOST}/assets/Stars.png`,'Stars');
    this.loadImage(`${HOST}/assets/ship-wheel.png`,'ShipWheel');
    this.loadImage(`${HOST}/assets/ghost-a.svg`,'GohstA');
    this.loadImage(`${HOST}/assets/ghost-b.svg`,'GohstB');
    this.loadImage(`${HOST}/assets/ghost-c.svg`,'GohstC');
    this.loadImage(`${HOST}/assets/ghost-d.svg`,'GohstD');
    this.loadSound(`${HOST}/assets/Chill.wav`,'Chill');
    this.loadImage(`${HOST}/assets/cross1.svg`,'Cross01');
    this.loadImage(`${HOST}/assets/cross2.svg`,'Cross02');
    this.loadSound(`${HOST}/assets/Pew.wav`,'Pew');
    this.loadSound(`${HOST}/assets/Boing.wav`,'Boing');
//    this.loadSound(`${HOST}/assets/Loop01.mp3`,'Loop01');
}

P.prepare = async function() {

    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Stars );

    P.enemy = new P.Sprite("enemy");
    P.enemy.setVisible(false);     
    P.enemy.position.y = P.stageHeight/2 * 0.9
    P.enemy.addImage( P.images.GohstA );
    P.enemy.addImage( P.images.GohstB );
    P.enemy.addImage( P.images.GohstC );
    P.enemy.addImage( P.images.GohstD );
    P.enemy.scale = {x:30,y:30}

    P.cross = new P.Sprite("Cross");
    P.cross.position.y = -P.stageHeight/2 * 0.6 
    P.cross.addImage( P.images.ShipWheel );
    P.cross.addImage( P.images.Cross02 );
    P.cross.setScale(25,25);
    P.cross.setVisible(false);

    P.sound = new P.Sprite("Sound");


    P.monitors = new P.Monitors();
    P.monitors.add('POINT');
    P.monitors.add('TIMER');
    // 名前がJS変数として成立しないとき（ここでは途中にスペースあり), 次のようにして参照できる。
    P.monitors.v.POINT.setPosition( {x: 35, y:15} )
    // 名前がJS変数として成立するならば、日本語を使える。途中に全角スペースは使えない。
    P.monitors.v.TIMER.setPosition( {x: 35, y:45} )

    P.monitors.v.POINT.value = 0;
    P.monitors.v.TIMER.value = 0;
}

P.setting = async function() {

    P.gameOver = function() {
        if( P.monitors.v.TIMER.value > 49 ) {
            return true;
        }
        return false;
    }

    P.stage.whenRightNow(async function() {
        this.addSound( P.sounds.Chill, { 'volume' : 20 } );
    });
    P.cross.whenRightNow(async function() {
        this.setVisible(true);
        this.addSound( P.sounds.Pew, { 'volume' : 100 } );
        this.switchCostume(P.images.ShipWheel.name)
    });
    P.sound.whenRightNow(function(){
        this.addSound( P.sounds.Boing, { 'volume' : 100 } );
  
    });

    P.stage.whenFlag(async function() {
        // ずっと繰り返す
        for(;;) {
            await this.startSoundUntilDone();
            if(P.gameOver()){
                break;
            }
        }
    });
    P.stage.whenFlag(async function() {
        // ずっと繰り返す
        for(;;) {
            await P.wait(1000);
            P.monitors.v.TIMER.value += 1;
            if(P.gameOver()){
                break;
            }
        }
    });

    P.enemy.whenRightNow(async function() {
//        this.addSound( P.sounds.Boing, { 'volume' : 100 } );
    });
    P.enemy.whenFlag( async function(){
        this.setVisible(false); 
        for(;;){
            await P.wait(100);
            this.costumes.nextCostume();
            if(P.gameOver()){
                break;
            }
        }    
    });
    P.enemy.whenFlag( async function(){
        let counter = 0;
        let waitTime = 1000;
        for(;;){
            if(P.gameOver()){
                break;
            }
            await P.wait(waitTime);
            this.position.x = (Math.random() -0.5) * P.stageWidth*0.9;
            this.clone();
        }    
    });

    P.enemy.whenCloned(function(){
        this.clearEffect();
        this.setVisible(true);
        for(;;) {
            if(P.gameOver()){
                break;
            }
            if(!this.isAlive()) break;
            this.changeY(-2)
            if(this.position.y < -P.stageHeight/2 ) {
                if(P.monitors.v.POINT.value > 0){
                    P.monitors.v.POINT.value -= 1;
                }
                this.remove();
                break;
            }
        }

    });
    P.enemy.whenCloned(async function(){
        for(;;) {
            if(P.gameOver()){
                break;
            }
            await P.wait(500);
            if(this.isAlive()){
                this.costumes.nextCostume();
            }else{
                break;
            }
        }
    });
    P.enemy.whenCloned(async function(){
        try{
            for(;;) {
                if(P.gameOver()){
                    break;
                }
                if(!this.isAlive()) break;
                if(P.cross.clones.length>0) {
                    // cross のクローンに衝突したら、消える。
                    let touching = this.getTouchingTarget(P.cross.clones);
                    if( touching.length>0) {
                        P.monitors.v.POINT.value += 1;
                        //this.soundPlay();
                        P.sound.soundPlay();
                        const me = this;
                        setTimeout(async function(){
                            for(const i in Array(20).fill()){
                                me.direction -= 25;
                                me.effect.color += 50
                                me.scale.x *= 0.95
                                await P.wait(30)   
                            }
                            me.remove();

                        },0);
                        for(const t of touching){
                            t.remove();
                        }
                        break;
                    }
                }
            }
    
        }catch(e){
            console.log(e);
        }
    });

    P.cross.whenFlag( async function() {
        this.direction = 90;
    });
    P.cross.whenFlag( async function() {
        // ずっと繰り返す
        for(;;) {
            if(P.gameOver()){
                break;
            }
            this.direction += 5;
        }    
    });
    P.cross.whenFlag( async function() {
        // ずっと繰り返す
        const step = 10
        for(;;) {
            if(P.gameOver()){
                break;
            }
            // 右矢印キーがおされたとき
            if(P.getKeyIsDown('RightArrow')){
                this.changeX(step)
            }
            // 左矢印キーがおされたとき
            if(P.getKeyIsDown('LeftArrow')){
                this.changeX(step*(-1))
            }
        }    
    });
    P.SpaceKeyIsNotDown = function() {
        return !P.getKeyIsDown('Space');
    }
    P.cross.whenFlag( async function() {
        // ずっと繰り返す
        for(;;) {
            if(P.gameOver()){
                break;
            }
            // スペースキーが押されたとき
            // （他のキーが押されていてもOK）
            if(P.getKeyIsDown('Space')){
                this.soundPlay();
                this.clone();
                //次をコメントアウトしているときは キー押下中連続してクローン作る  
                await P.waitUntil( P.SpaceKeyIsNotDown );
            }
        }    
    });

    // クローンされたときの動作  
    P.cross.whenCloned(function(){
        const c = this; // <--- cross instance;
        const bounds = this.render.renderer.getBounds(c.drawableID);
        const height = Math.abs(bounds.top - bounds.bottom);
        this.position.y += height / 2;
    });
    // クローンされたときの動作  
    P.cross.whenCloned(function(){
        this.switchCostume(P.images.Cross02.name)
        this.scale = {x:15, y:15};
        this.setVisible(true);
        this.position.x = P.cross.position.x;
        this.direction = 0;
    });
    // クローンされたときの動作  
    P.cross.whenCloned(function(){
        const c = this; // <--- cross instance;
        for(;;) {
            if(P.gameOver()){
                break;
            }
            if(!this.isAlive()){
                break;
            }
            const x = this.position.x;
            const y = this.position.y;
            this.changeY(20);
            if(this.isTouchingHorizontalEdge()){
                this.remove();
                break;
            }
        }
        //console.log('cross clone ',this)
    });
    // クローンされたときの動作  
    P.cross.whenCloned(function(){
        const c = this; // <--- cross instance;
        for(;;) {
            if(P.gameOver()){
                break;
            }
            if(!this.isAlive()) break;
            this.turnRight(45);
            if(this.isTouchingEdge()){
                this.remove();
                break;
            }
        }
    });
}
