/**
 * Sample10
 * スプライトのクローンを作る（スプライトに触ったらクローンを作る）
 * クローンされたら動きだす（端に触れたらミャーとないて折り返す）
 */
P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
    this.loadSound('../assets/Cat.wav','Mya');
}

P.prepare = async function() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );
    P.cat = new P.Sprite("Cat");
    P.cat.addImage( P.images.Cat );
}

function WaitUntil ( condition, src ) {
    return new Promise( async (resolve) => {
        const _condition = condition.bind(src);

        for(;;) {
            console.log('WaitUntil loop')
            if( _condition() === true ) {
                resolve();
                break;
            }
            await P.Utils.wait(500);
        }
    });
}

P.setting = async function() {

    P.stage.whenFlag(async function() {
        this.addSound( P.sounds.Chill, { 'volume' : 50 } );
    });
    P.stage.whenFlag(async function() {
        this.startThread( async function() {
            for(;;) {
                await this.startSoundUntilDone();
                await P.Utils.wait(P.Env.pace);
            }
        });
    });
    P.cat.whenFlag( async function() {
        // 音を登録する
        this.addSound( P.sounds.Mya, { 'volume' : 1 } );
    });
    P.cat.whenFlag( async function() {
        // 向きをランダムに変える。
        const me = this;
        const direction = 1;
        // ずっと繰り返す、スレッドを起動する
        me.startThread( async function() {
            for(;;) {
                me.direction += direction;
                await P.Utils.wait(P.Env.pace);
            }
        });
        const steps = 10;
        // ずっと繰り返す、スレッドを起動する
        me.startThread( async function() {
            for(;;) {
                if( me.isMouseTouching() ) {
                    P.spriteClone( me, async function(){
                        const clone = this;
                        clone.position.x = 100;
                        clone.position.y = -100;
                        clone.scale.x = 50;
                        clone.scale.y = 50;
                        clone.effect.color = 50;
                        clone.life = 1000;
                        // ずっと繰り返す、スレッドを起動する
                        clone.startThread( async function() {
                           for(;;) {
                                clone.moveSteps( steps );
                                // 端に触れたら
                                clone.isTouchingEdge(function(){
                                    // ミャーと鳴く。
                                    clone.soundPlay()
                                });
                                clone.ifOnEdgeBounds();
                                await P.Utils.wait(P.Env.pace);
                            }
                        });
            
                    });
                }
                const waitTime = P.Env.pace; 
                await P.Utils.waitUntil(  me.isNotMouseTouching, waitTime,  me ); 
                await P.Utils.wait(P.Env.pace);
            }
        });

    });

}