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

    P.spriteB = new MyCat( P.stage, "spriteB", {'effect': {'color': 120}});
    P.spriteB.direction = Math.random() * 360;
    P.spriteB.addImage( P.images.Cat1 );
    P.spriteB.addImage( P.images.Cat2 );

}
P.staging = async function( render ) {
    P.MoveStepsA = 20;

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

/* 
    P.spriteA.clone(optionsB).then(async (v)=>{
        P.spriteB = v;
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
    });
*/    


    // Cloneスプライトは、端に触れたときに一瞬止まることがある。
    P.spriteC = new MyCat(P.stage, 'CatC', {effect:{color:0}})
    await P.spriteC.addImage( P.images.Cat1 );
    await P.spriteC.addImage( P.images.Cat2 );
    P.spriteC.direction = Math.random() * 360;
    P.spriteC.z = -1;
    P.stage.sprites.map(s=>{
        console.log(s.name);
    });
    for(let i=0; i< 2; i++){
        const x = new MyCat(P.stage, 'CatC', {effect:{color:0}})
        await x.addImage( P.images.Cat1 );
        await x.addImage( P.images.Cat2 );
        x.direction = Math.random() * 360;
        x.whenFlag(async function(){
            for(;;) {
                this.ifOnEdgeBounds();
                this.moveSteps( 5 );    
                await P.Utils.wait(P.pace);
            }
        });
    }    
    //P.spriteC = await P.spriteA.clone({effect:{color:0}});
    //console.log(`SpriteC drawableID = ${P.spriteC.drawableID}, skinID=${P.spriteC.skinId}`)

/* 
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
*/
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
}

P.start2 = async function(render) {
//    P.spriteC.skinId = 3;
    P.stage.update();
    P.spriteA.addSound( P.sounds.Boing , { 'volume' : 25 } ); 
    P.spriteA.addSound( P.sounds.Cat , { 'volume' : 25 } ); 
//    P.spriteB.addSound( P.sounds.Boing , { 'volume' : 25 } ); 
//    P.spriteB.addSound( P.sounds.Cat , { 'volume' : 25 } ); 
//    P.spriteC.addSound( P.sounds.Boing , { 'volume' : 25 } ); 
//    P.spriteC.addSound( P.sounds.Cat , { 'volume' : 25 } ); 

    let pitch = 1;
    let picthPower = 0.01;
//    P.spriteB.setSoundPitch(pitch);
//    P.spriteC.setSoundPitch(pitch);
    const times = Array(40).fill();
    const MoveSteps = 20;
    const Clone1MoveSteps = 20;
    const Clone2MoveSteps = 20;
    let _visible = true;
    let _spriteAMakeClone = true;
    let _idx = 0;
    for(;;){
        //for( const t in times ){
        for( let i=0; i<times.length; i++ ){
            console.log(`SpriteA drawableID = ${P.spriteA.drawableID}, skinID=${P.spriteA.costumes.skinId}`)
            console.log(`SpriteB drawableID = ${P.spriteB.drawableID}, skinID=${P.spriteB.costumes.skinId}`)
            console.log(`SpriteC drawableID = ${P.spriteC.drawableID}, skinID=${P.spriteC.costumes.skinId}`)
            pitch += picthPower;
            if ( pitch > 3 || pitch < 0.5 ) picthPower *= -1;
            if( P.spriteA.isTouchingEdge() ) {
                //console.log('SpriteA 外に出た', ++_idx)
                const optionsX = {'position':{x: (Math.random() - 0.5) * 300, y: (Math.random() - 0.5) * 200}, 'scale':{x:100, y:100}, effect:{'color' : 50}}
                if( _spriteAMakeClone ) {
                    _spriteAMakeClone = true;
                    P.spriteA.clone(optionsX).then(async (v)=>{
                        P.stage.update();
                        P.stage.draw();
                        //console.log('SpriteA クローンを作った')
                        _spriteAMakeClone = true;
                        const x = v;                    
                        x.life = 50;
                        setInterval(function(){
                            if( x.scale.x > 2) {
                                x.scale.x -= 2;
                                x.scale.y -= 2;    
                            }
                        },33);
                    });    
                }
            }
            P.spriteA.ifOnEdgeBounds();
            P.spriteA.moveSteps( P.MoveStepsA);
            P.spriteB.ifOnEdgeBounds();
            P.spriteB.moveSteps( Clone1MoveSteps );
            P.spriteC.ifOnEdgeBounds();
            P.spriteC.moveSteps(Clone2MoveSteps);

            await P.Utils.wait( P.wait_time );
        }
        await P.Utils.wait( P.wait_time  );
    }
}

P.draw = function() {
    P.stage.update();
    P.stage.draw();
}