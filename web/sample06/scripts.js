P.staging = async function() {
    P.wait_time = P.Env.pace;
    const render = new P.Render();
    P.stage = new MyStage("stage");
  
    P.spriteA = new MyCat( P.stage, "spriteA");
    P.spriteA.position = {x:0, y:0};
    P.spriteA.scale = {x:50, y:50};
    P.spriteA.direction = Math.random() * 360;
    P.spriteA.effect = { 'fisheye' : 150, 'color' : 10 };
    await P.spriteA.loadImage();
    // ↑ 以降でクローンを作るが、ロードしたイメージは引き継がれる。
    P.spriteB = P.spriteA.clone();
    P.spriteB.position = { x: P.spriteA.position.x+200, y: P.spriteA.position.y };
    P.spriteB.scale = { x:50, y:50 };
    P.spriteB.direction = Math.random() * 360;
    P.spriteB.clearEffect();
    P.spriteB.effect = { 'color' : 100 };
    P.spriteB.whenFlag(async function(){
        await P.spriteB.loadSound( 'boing', '../assets/Boing.wav', { 'volume' : 5 } );  
    });
    P.spriteC = P.spriteA.clone();
    P.spriteC.position = {x: P.spriteA.position.x-200, y: P.spriteA.position.y+20 };
    P.spriteC.scale = {x:50, y:50};
    P.spriteC.direction = Math.random() * 360;
    P.spriteC.clearEffect();
    P.spriteC.effect = { 'color': 50, 'mosaic': 50 };
    P.spriteC.whenFlag( async function() {
        await P.spriteC.loadSound( 'boing', '../assets/Boing.wav', { 'volume' : 5 } );  
    });
  
    P.stage.update();
    P.stage.draw();
    P.stage.whenFlag( async function() {
        for(;;){
            await P.stage.startSoundUntilDone();
            await P.Utils.wait( P.wait_time );
        }
    });
    P.stage.whenFlag( async function() {
        for(;;) {
            P.spriteA.nextCostume();
            P.spriteB.nextCostume();
            P.spriteC.nextCostume();
            await P.Utils.wait( P.wait_time );
        }
    });
    P.spriteA.whenClicked( async function() {
        const scale = P.spriteA.scale;
        P.spriteA.setScale( scale.x * -1, scale.y );
    });
    P.spriteB.whenClicked( async function() {
        const scale = P.spriteB.scale;
        P.spriteB.setScale( scale.x * -1, scale.y );
    });
    P.spriteC.whenClicked( async function() {
        const scale = P.spriteC.scale;
        P.spriteC.setScale( scale.x * -1, scale.y );
    });
    P.stage.whenClicked( async function() {
        const scale = P.stage.scale;
        P.stage.setScale( scale.x * -1, scale.y );
        P.stage.nextSound();
    });
}

P.start = async function() {
    let pitch = 1;
    let picthPower = 0.01;
    P.spriteB.setSoundPitch(pitch);
    P.spriteC.setSoundPitch(pitch);
    const times = Array(40).fill();
    const MoveSteps = 20;
    const Clone1MoveSteps = 10;
    const Clone2MoveSteps = 10;
    for(;;){
        for( const t in times ){
            pitch += picthPower;
            if ( pitch > 3 || pitch < 0.5 ) picthPower *= -1;
            P.spriteB.setSoundPitch( pitch );
            P.spriteC.setSoundPitch( pitch );
            P.spriteA.moveSteps( MoveSteps );
            P.spriteA.ifOnEdgeBounds();
            P.spriteB.moveSteps( Clone1MoveSteps );
            if( P.spriteB.isTouchingTarget( P.spriteA )) {
                P.spriteA.direction += ( Math.random() - 0.5 ) * 45;
                P.spriteB.moveSteps( Clone1MoveSteps*(-3) );
                P.spriteB.direction += 180;
            }
            P.spriteB.ifOnEdgeBounds();
            if( P.spriteB.isTouchingEdge() ){
                P.spriteB.soundPlay();
            }
            P.spriteC.moveSteps(Clone2MoveSteps);
            if( P.spriteC.isTouchingTarget( P.spriteA ) ) {
                P.spriteC.moveSteps( Clone2MoveSteps*(-3) );
                P.spriteC.direction += 180;
            }
            if( P.spriteB.isTouchingTarget( P.spriteC ) ) {
                P.spriteB.moveSteps( Clone1MoveSteps*(-3) );
                P.spriteC.moveSteps( Clone2MoveSteps*(-3) );
                P.spriteB.direction += 180;
                P.spriteC.direction += 180;
            }
            P.spriteC.ifOnEdgeBounds();
            if( P.spriteC.isTouchingEdge() ){
                P.spriteC.soundPlay();
            }
            P.stage.update();
            await P.Utils.wait( P.wait_time );
        }
        await P.Utils.wait( P.wait_time );
    }
}

P.draw = function() {
    P.stage.draw();
}