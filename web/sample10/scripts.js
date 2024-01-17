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
    P.cat.position.x = 200;
    P.cat.position.y = 150;
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
    P.cat.whenFlag( async function() {
        // 音を登録する
        this.addSound( P.sounds.Mya, { 'volume' : 1 } );
    });
    P.cat.whenFlag( async function() {
        // ずっと繰り返す、スレッドを起動する
        this.startThread( async function() {
            for(;;) {
                this.direction += _changeDirection; // TOP Scope にあるので参照可能
            }    
        })
    });
    P.cat.whenFlag( async function() {
        // ずっと繰り返す
        for(;;) {
            if( this.isMouseTouching() ) {
                this.clone();
            }
            // マウスタッチしないまで待つ
            await P.Utils.waitUntil( this.isNotMouseTouching, P.Env.pace,  this ); 
        }
});
    P.cat.whenCloned(async function(){
        const clone = this; // 'this' is cloned instance;
        clone.position.x = 100;
        clone.position.y = -100;
        clone.scale.x = 50;
        clone.scale.y = 50;
        clone.effect.color = 50;
        clone.life = 1000;
        clone.setVisible(true)
        const steps = 10;   // <--- TOP SCOPE でないときはスレッド内に定義しないと参照できない！
        // ずっと繰り返す
        for(;;) {
            clone.moveSteps( steps );
            // 端に触れたら
            clone.isTouchingEdge(function(){
                // ミャーと鳴く。
                clone.soundPlay()
            });
            clone.ifOnEdgeBounds();
        }
    });
}