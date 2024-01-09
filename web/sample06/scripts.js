P.preload = async function() {
    this.loadSound('boingWav','../assets/Boing.wav');
    this.loadSound('catWav','../assets/Cat.wav');
    this.loadSound('chillWav','../assets/Chill.wav');
    this.loadImage('cat1','../assets/cat.svg');
    this.loadImage('cat2','../assets/cat2.svg');
    this.loadImage('Jurassic','../assets/Jurassic.svg');
}
P.setup = async function() {

}
P.staging = async function( render ) {
    P.wait_time = P.Env.pace;
//    const render = new P.Render();
    P.stage = new MyStage( render, "stage" );
    P.stage.whenFlag(async function(){
        this.addSound( 'chillWav', P.sounds.chillWav , { 'volume' : 25 } );  
    });
    P.stage.addImage( 'Jurassic', P.images.Jurassic );
    P.spriteA = new MyCat( P.stage, "spriteA" );
    P.spriteA.position = { x:0, y:0 };
    P.spriteA.scale = { x:100, y:100 };
    P.spriteA.direction = Math.random() * 360;
    //P.spriteA.effect = { 'fisheye' : 150, 'color' : 10 };
//    await P.spriteA.loadImage();
    //await P.spriteA.loadImage();
    P.spriteA.addImage( 'cat1', P.images.cat1 );
    P.spriteA.addImage( 'cat2', P.images.cat2 );
    //await P.Utils.wait(0)
    // ↑ 以降でクローンを作るが、ロードしたイメージは引き継がれない。
    P.spriteB = P.spriteA.clone();
    P.spriteB.position = { x: P.spriteA.position.x+200, y: P.spriteA.position.y };
    P.spriteB.scale = { x:50, y:50 };
    P.spriteB.direction = Math.random() * 360;
    P.spriteB.clearEffect();
    P.spriteB.addImage('cat1', P.images.cat1);
    P.spriteB.addImage('cat2', P.images.cat2);
    //P.spriteB.effect = { 'color' : 100, 'ghost': 50 };
    P.spriteC = P.spriteA.clone();
    P.spriteC.position = {x: P.spriteA.position.x-200, y: P.spriteA.position.y+20 };
    P.spriteC.scale = {x:50, y:50};
    P.spriteC.direction = Math.random() * 360;
    P.spriteC.clearEffect();
    //P.spriteC.effect = { 'color': 50, 'mosaic': 50 };
    P.spriteC.addImage('cat1', P.images.cat1);
    P.spriteC.addImage('cat2', P.images.cat2);

    // (1) addImage で await をしないとき、イメージを設定しないのはなぜか？
    // (2) クローンしたキャラが コスチューム切り替わらないのはなぜか？

    //await P.Utils.wait(10)

    P.spriteB.whenFlag(async function(){
        //await this.loadSound( 'boing', '../assets/Boing.wav', { 'volume' : 5 } );  
        this.addSound( 'boingWave', P.sounds.boingWav , { 'volume' : 25 } );  
    });
    P.spriteC.whenFlag( async function() {
        //await this.loadSound( 'boing', '../assets/Boing.wav', { 'volume' : 5 } );  
        this.addSound( 'cat', P.sounds.catWav , { 'volume' : 25 } );  
    });
    //P.stage.update();
    //P.stage.draw();
    P.stage.whenFlag( async function() {
        for(;;){
            await this.startSoundUntilDone();
            await P.Utils.wait( P.wait_time );
        }
    });
    P.stage.whenFlag( async function() {
        const _sprites = this.sprites;
        for(;;) {
            _sprites.map(_s => {
                _s.nextCostume();
            });
            await P.Utils.wait( P.wait_time );
        }
    });
    P.spriteA.whenClicked( async function() {
        const scale = this.scale;
        this.setScale( scale.x * -1, scale.y );
    });
    P.spriteB.whenClicked( async function() {
        const scale = this.scale;
        this.setScale( scale.x * -1, scale.y );
    });
    P.spriteC.whenClicked( async function() {
        const scale = this.scale;
        this.setScale( scale.x * -1, scale.y );
    });
    P.stage.whenClicked( async function() {
        // 横向きに反転させる
        const scale = this.scale;
        this.setScale( scale.x * -1, scale.y );
        this.nextSound();
    });

//    P.stage.update();
//    P.stage.draw();
}

P.start = async function() {
    let pitch = 1;
    let picthPower = 0.01;
    P.spriteB.setSoundPitch(pitch);
    P.spriteC.setSoundPitch(pitch);
    const times = Array(40).fill();
    const MoveStepsA = 5;
    const MoveSteps = 20;
    const Clone1MoveSteps = 10;
    const Clone2MoveSteps = 10;
    let _visible = true;
    for(;;){
        for( const t in times ){
            pitch += picthPower;
            if ( pitch > 3 || pitch < 0.5 ) picthPower *= -1;
            P.spriteB.setSoundPitch( pitch );
            P.spriteC.setSoundPitch( pitch );
            P.spriteA.moveSteps( MoveStepsA );
            P.spriteA.ifOnEdgeBounds();
            if( P.spriteA.isTouchingEdge() ){
                P.spriteB.updateVisible(true);
                P.spriteC.updateVisible(true);
            }
            P.spriteB.moveSteps( Clone1MoveSteps );
            if( P.spriteB.isTouchingTarget( P.spriteA )) {
                P.spriteA.direction += ( Math.random() - 0.5 ) * 45;
                P.spriteB.moveSteps( Clone1MoveSteps*(-3) );
                P.spriteB.direction += 180;
            }
            P.spriteB.ifOnEdgeBounds();
            if( P.spriteB.isTouchingEdge() ){
                P.spriteB.soundPlay();
                _visible = !_visible;
                P.spriteB.updateVisible(false);
            }
            P.spriteC.moveSteps(Clone2MoveSteps);
            if( P.spriteC.isTouchingTarget( P.spriteA ) ) {
                P.spriteC.moveSteps( Clone2MoveSteps*(-3) );
                P.spriteC.direction += 180;
            }
            if( P.spriteB.isTouchingTarget( P.spriteC ) ) {
                P.spriteB.updateVisible(false);
                P.spriteB.moveSteps( Clone1MoveSteps*(-3) );
                P.spriteC.moveSteps( Clone2MoveSteps*(-3) );
                P.spriteB.direction += 180;
                P.spriteC.direction += 180;
            }
            P.spriteC.ifOnEdgeBounds();
            if( P.spriteC.isTouchingEdge() ){
                P.spriteC.soundPlay();
                _visible = !_visible;
                P.spriteC.updateVisible(false);
            }
            P.stage.update();
            await P.Utils.wait( P.wait_time );
        }
        await P.Utils.wait( P.wait_time );
    }
}

P.draw = function() {
    P.stage.update();
    P.stage.draw();
}