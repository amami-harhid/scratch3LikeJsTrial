/**
 * Sample13
 * スプライト（CAT) ポインターを追いかける
 * 
 */
P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}

P.prepare = async function() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );
    P.cat = new P.Sprite("Cat");
    P.cat.position.x = 0;
    P.cat.position.y = 0;
    P.cat.addImage( P.images.Cat );
}

const _changeDirection = 1;

P.setting = async function() {
    console.log('window.devicePixelRatio=',window.devicePixelRatio)
    P.stage.whenFlag(async function() {
        this.addSound( P.sounds.Chill, { 'volume' : 50 } );
    });
    P.stage.whenFlag(async function() {
        for(;;) {
            await this.startSoundUntilDone();
            //await P.Utils.wait(P.Env.pace);
        }
    });
    P.stage.whenFlag(async function() {
        for(;;) {
            const pageX = this.mouse.pageX;
            const pageY = this.mouse.pageY;
            const clientX = this.mouse.clientX;
            const clientY = this.mouse.clientY;
            const x = this.mouse.x;
            const y = this.mouse.y;
            const _scratchX = x - P.canvas.width/2; //this.mouse.scratchX;
            const _scratchY = P.canvas.height/2 - y //this.mouse.scratchY;
            const scratchX = this.mouse.scratchX;
            const scratchY = this.mouse.scratchY;
            console.log(`pageX=${pageX}, pageY=${pageY}`);
            console.log(`clientX=${clientX}, clientY=${clientY}`);
            console.log(`x=${x}, y=${y}`);
            console.log(`canvas=(${P.canvas.width},${P.canvas.height})`)
            console.log(`scratchX=${scratchX}, scratchY=${scratchY}`);
            console.log(`_scratchX=${_scratchX}, _scratchY=${_scratchY}`);

            //await P.Utils.wait(P.Env.pace);
        }
    });
    /* 
    P.cat.whenFlag(async function() {
        for(;;) {
            await P.Utils.wait(1000);
            const x = (Math.random()-0.5) * P.stageWidth;
            const y = (Math.random()-0.5) * P.stageHeight;
            await this.glideToPosition(1, x, y);            
        }
    });
    */
    P.cat.whenFlag( async function() {
        // ずっと繰り返す、スレッドを起動する
        this.startThread( async function() {
            for(;;) {
                this.pointToPointer();
                this.moveSteps(1);
            }    
        })
    });
}