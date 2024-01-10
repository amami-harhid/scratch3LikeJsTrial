const MyCat = class extends P.Sprite {
    constructor(stage, name, options) {
        super(stage, name, options);
        this.life = Infinity;
        //this.loadImage();
    
    }

    update() {
        super.update();
        if(this.life != Infinity) {
            this.life -= 1;
            if( this.life < 0 ) {
                //console.log(`remove (${this.name})`);
                this.remove();
            }    
        }
    }
}