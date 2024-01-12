const MyCat = class extends P.Sprite {
    constructor(stage, name, options) {
        super(stage, name, options);
        this.life = Infinity;
        //this.loadImage();
    
    }

    update() {
        super.update();
        if( this.life < 0 ) {
            this.soundSwitch(P.sounds.Cat)
            this.soundPlay();
        }    
}
}