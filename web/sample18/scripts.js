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
    this.loadImage('../assets/butterfly1.svg','Butterfly01');
    this.loadImage('../assets/butterfly2.svg','Butterfly02');
}

P.prepare = async function() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );

    P.cross = new P.Sprite("Cross");
    P.cross.addImage( P.images.Cross01 );
    P.cross.addImage( P.images.Cross02 );
    P.cross.setScale(300,300);

    P.butterfly = new P.Sprite("Butterfly");
    P.butterfly.addImage( P.images.Butterfly01 );
    P.butterfly.addImage( P.images.Butterfly02 );
    P.butterfly.setVisible(false);

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
        // ずっと繰り返す
        for(;;) {
            this.rotationRight(5);
        }    
    });
    P.cross.whenFlag( async function() {
        // ずっと繰り返す
        for(;;) {
            if ( this.isMouseTouching() ) {
                this.nextCostume();
                await P.Utils.waitUntil( this.isNotMouseTouching, P.Env.pace, this);
                this.nextCostume();
            }
        }    
    });
    P.cross.whenFlag( async function() {
        // ずっと繰り返す
        for(;;) {
            if ( this.isMouseTouching() ) {
                const butterfly = P.butterfly;
                const mousePosition = P.mousePosition;
                butterfly.position.x = mousePosition.x;
                butterfly.position.y = mousePosition.y;
                const scale = {x: 15, y: 15}
                butterfly.scale.x = scale.x;
                butterfly.scale.y = scale.y;
                butterfly.direction = P.randomDirection;
                P.butterfly.clone().then(async (s)=>{
                    s.life = 5000; // ミリ秒。クローンが生きている時間。（およその時間）
                    s.setVisible(true);
                    s.startThread(async function(){                        
                        for(;;) {
                            // ランダムな場所
                            const randomPoint = P.randomPoint;
                            // １秒でどこかに行く。
                            await this.glideToPosition(1, randomPoint.x, randomPoint.y);
                            // ライフがゼロになったら「繰り返し」を抜ける
                            if( this.life < 0) {
                                break;
                            }
                        }
                    })
                    s.startThread(async function(){                        
                        let _scaleRate = 0.5;
                        for(;;) {
                            // だんだんと大きくなる
                            this.scale.x += _scaleRate;
                            this.scale.y += _scaleRate;
                            this.nextCostume();
                            // ライフがゼロになったら「繰り返し」を抜ける
                            if( this.life < 0) {
                                break;
                            }
                        }
                    })
                });
                // 下をコメントアウトすると、十字にさわっている間は クローンを作り続ける
                // 下を生かすと、十字に触ったときにクローンを作るが、次には進まない
                await P.Utils.waitUntil( this.isNotMouseTouching, P.Env.pace, this); // 「マウスポインターが触らない」迄待つ。
                await P.Utils.wait(100); // 100ミリ秒待つ。 <== クローン発生する間隔
            }
        }
    });

}
