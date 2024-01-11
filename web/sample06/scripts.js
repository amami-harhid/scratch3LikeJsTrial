P.preload = async function() {
    this.loadSound('../assets/Boing.wav','Boing');
    this.loadSound('../assets/Cat.wav','Cat');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadSound('../assets/Bossa Nova.wav','BossaNova')
    this.loadImage('../assets/cat.svg','Cat1');
    this.loadImage('../assets/cat2.svg','Cat2');
    this.loadImage('../assets/Jurassic.svg','Jurassic');
}
P.setup = async function(render) {
    P.stage = new MyStage( render, "stage" );
    P.spriteA = new MyCat( P.stage, "spriteA", {'effect': {'color': 100}});
    P.stage.addImage( P.images.Jurassic );
    P.spriteA.addImage( P.images.Cat1 );
    P.spriteA.addImage( P.images.Cat2 );
    P.spriteA.position = { x:0, y:0 };
    P.spriteA.scale = { x:100, y:100 };
    P.spriteA.direction = Math.random() * 360;

}
P.staging = async function( render ) {
    P.MoveStepsA = 10;

    P.wait_time = P.Env.pace;
//    const render = new P.Render();
    P.stage.whenFlag(async function(){
        // TODO addSound 処理時間が長いとき、登録順が逆になるときがある。なんとかしたい。
        this.addSound( P.sounds.Chill, { 'volume' : 125 } );
        this.addSound( P.sounds.BossaNova , { 'volume' : 25 } );  
        P.start2(render);
    });
    P.spriteA.whenFlag(async function(){
        //await this.loadSound( 'boing', '../assets/Boing.wav', { 'volume' : 5 } );  
//            this.addSound( P.sounds.Boing , { 'volume' : 25 } ); 
//            this.addSound( P.sounds.Cat , { 'volume' : 25 } );  
    });
//    await P.spriteA.loadImage();
    //await P.spriteA.loadImage();
    //await P.Utils.wait(0)
    // ↑ 以降でクローンを作るが、ロードしたイメージは引き継がれない。
    //console.log('sprites staging spriteA.costume.costumes = ', P.spriteA.costumes.costumes)
    const optionsB = {'position': { x: P.spriteA.position.x+50, y: P.spriteA.position.y }}
    
    P.spriteA.clone(optionsB).then(async (v)=>{
        P.spriteB = v;
//        console.log('clone B ,  stage.sprites size=', P.stage.sprites.length);
//        console.log('clone B ,  spriteB skinId=', P.spriteB.skinId);
//        console.log('clone B ,  spriteB constumes.skinId=', P.spriteB.costumes.skinId);
        //P.spriteB.position = { x: P.spriteA.position.x+200, y: P.spriteA.position.y };
        P.spriteB.clearEffect();
        P.spriteB.scale = { x:100, y:100 };
        P.spriteB.direction = Math.random() * 360;
        P.spriteB.whenFlag(async function(){ // これは動作しない。
            this.addSound( P.sounds.Boing , { 'volume' : 25 } );
        });
        P.spriteB.whenClicked( async function() {
            const scale = this.scale;
            this.setScale( scale.x * -1, scale.y );
        });
//        P.stage.update();
//        P.stage.draw();
    });
//    P.spriteB.addImage( P.images.Cat1);
//    P.spriteB.addImage( P.images.Cat2);
    //P.spriteB.effect = { 'color' : 100, 'ghost': 50 };
    P.spriteA.clone().then(v=>{
        P.spriteC = v;
        P.spriteC.position = {x: P.spriteA.position.x-200, y: P.spriteA.position.y+20 };
        P.spriteC.scale = {x:50, y:50};
        P.spriteC.direction = Math.random() * 360;
        P.spriteC.clearEffect();
        P.spriteC.whenClicked( async function() {
            const scale = this.scale;
            this.setScale( scale.x * -1, scale.y );
        });
        P.stage.update();
        P.stage.draw();
    });
    //P.spriteC.effect = { 'color': 50, 'mosaic': 50 };
//    P.spriteC.addImage( P.images.Cat1);
//    P.spriteC.addImage( P.images.Cat2);

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
                //_s.nextCostume();
                //_s.ifOnEdgeBounds();
                
            });
            await P.Utils.wait( P.wait_time );
        }
    });
    P.spriteA.whenClicked( async function() {
        if( P.MoveStepsA == 3 ) {
            P.MoveStepsA = 0;
        }else{
            P.MoveStepsA = 3;
        }
        //const scale = this.scale;
        //this.setScale( scale.x * -1, scale.y );
    });
    P.stage.whenClicked( async function() {
        // 横向きに反転させる
        const scale = this.scale;
        this.setScale( scale.x * -1, scale.y );
        this.nextSound();
    });
    //P.spriteD = await P.spriteA.clone();
/*
    P.spriteD.whenClicked( async function() {
        const x = new MyCat(P.stage, "spriteX" );
        x.position = {x: (Math.random()-0.5) * 200, y: (Math.random()-0.5) * 200}
        x.addImage( P.images.Cat1 );
        x.addImage( P.images.Cat2 );
    });
*/
//    P.stage.update();
//    P.stage.draw();
}

P.start2 = async function(render) {
    P.stage.update();
    //    P.stage.update();
    P.spriteA.addSound( P.sounds.Boing , { 'volume' : 25 } ); 
    P.spriteA.addSound( P.sounds.Cat , { 'volume' : 25 } ); 
    P.spriteB.addSound( P.sounds.Boing , { 'volume' : 25 } ); 
    P.spriteB.addSound( P.sounds.Cat , { 'volume' : 25 } ); 
    P.spriteC.addSound( P.sounds.Boing , { 'volume' : 25 } ); 
    P.spriteC.addSound( P.sounds.Cat , { 'volume' : 25 } ); 

    let pitch = 1;
    let picthPower = 0.01;
    P.spriteB.setSoundPitch(pitch);
    P.spriteC.setSoundPitch(pitch);
    const times = Array(40).fill();
    const MoveSteps = 20;
    const Clone1MoveSteps = 20;
    const Clone2MoveSteps = 20;
    let _visible = true;
//    let _spriteAMakeClone = true;
    let _idx = 0;
    for(;;){
        //for( const t in times ){
        for( let i=0; i<times.length; i++ ){
/* 
            console.log(`scripts.js: spriteA drawableId=${P.spriteA.drawableID}`)
            const skinSize = P.stage.render.renderer.getCurrentSkinSize(P.spriteA.drawableID);
            console.log(`scripts.js: spriteA skinSize= ${skinSize}, drawableId=${P.spriteA.drawableID}`)
            const targetBounds = P.stage.render.renderer.getBoundsForBubble(P.spriteA.drawableID)
            console.log(targetBounds)
            console.log(`scripts.js: spriteA targetBounds width= ${targetBounds.right-targetBounds.left},height= ${targetBounds.top-targetBounds.bottom}`)
            console.log(`left= ${skinSize[0]+targetBounds.left},right= ${skinSize[0]+targetBounds.right}`)
*/            
            pitch += picthPower;
            if ( pitch > 3 || pitch < 0.5 ) picthPower *= -1;
            P.spriteB.setSoundPitch( pitch );
            P.spriteC.setSoundPitch( pitch );
            //P.spriteA.nextCostume()
            P.spriteA.isTouchingEdge(function(){
                //P.spriteA.ifOnEdgeBounds();
                console.log('SpriteA 外に出た', ++_idx)
                //P.stage.update();
//                P.spriteA.soundPlay()
//                P.spriteB.updateVisible(true);
//                P.spriteC.updateVisible(true);
                //console.log('isTouchingEdge clone', ++_idx)
                const optionsX = {'position':{x: (Math.random() - 0.5) * 300, y: (Math.random() - 0.5) * 200}, 'scale':{x:200, y:200}, effect:{'color' : 50}}
                P.spriteA.clone(optionsX).then(async (v)=>{
                    P.stage.update();
                    P.stage.draw();
                    //console.log('SpriteA クローンを作った')
                    //_spriteAMakeClone = true;
                    const x = v;
                    x.life = 20;
                    setInterval(function(){
                        x.scale.x -= 10;
                        x.scale.y -= 10;
                        x.nextCostume();
                    },33);
                });    
            // P.spriteA.moveSteps( 5 ); // <= 微調整。 枠外に出て 枠内にキレイに戻らないので、何度も反転を繰り返してしまい、うごかなくなる。
                //P.Utils.wait(P.wait_time)

            });
            P.spriteA.nextCostume();
            P.spriteA.ifOnEdgeBounds();
            P.spriteA.moveSteps( P.MoveStepsA );
//            P.stage.update();
//            P.stage.update();
            P.spriteA.isTouchingEdge(async function(){
                await P.spriteA.moveSteps( P.MoveStepsA );
                console.log('double isTouchingEdge  ')
                // ifOnEdgeBounds() のあと double Touching が起こっている！
                // ifOnEdgeBounds() _keepInFence の引数は 次に移動するポイント（移動予測）かもしれない。

            });
            P.spriteB.nextCostume();
            P.spriteB.ifOnEdgeBounds();
            P.spriteB.moveSteps( Clone1MoveSteps );
            if( P.spriteB.isTouchingTarget( P.spriteA )) {
//                P.spriteA.direction += ( Math.random() - 0.5 ) * 45;
                //P.spriteB.moveSteps( Clone1MoveSteps*(-3) );
//                P.spriteB.direction += 180;
            }
            //P.stage.update();
            if( P.spriteB.isTouchingEdge() ){
                //P.spriteB.moveSteps( Clone1MoveSteps );
                P.spriteB.soundPlay();
            }
            if( P.spriteC.isTouchingTarget( P.spriteA ) ) {
                //P.spriteC.moveSteps( Clone2MoveSteps*(-3) );
//                P.spriteC.direction += 180;
            }
            if( P.spriteB.isTouchingTarget( P.spriteC ) ) {
                //P.spriteB.moveSteps( Clone1MoveSteps*(-3) );
                //P.spriteC.moveSteps( Clone2MoveSteps*(-3) );
//                P.spriteB.direction += 180;
//                P.spriteC.direction += 180;
            }
            P.spriteC.nextCostume();
            P.spriteC.moveSteps(Clone2MoveSteps);
            P.spriteC.ifOnEdgeBounds();
//            P.stage.update();
            if( P.spriteC.isTouchingEdge() ){
                P.spriteC.soundPlay();
            }
//            P.stage.update();
//            P.stage.draw();
            await P.Utils.wait( P.wait_time );
        }
        await P.Utils.wait( P.wait_time  );
    }
}

P.draw = function() {
    P.stage.update();
    P.stage.draw();
}