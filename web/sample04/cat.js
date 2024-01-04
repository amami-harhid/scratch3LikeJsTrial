const MyCat = class extends LS.Sprite {

    constructor(render, name) {
        super(render,name);
    }
    async loadImage() {
        await this.costumes.loadImage('cat', '../assets/cat.svg');
        await this.costumes.loadImage('cat2', '../assets/cat2.svg');
    }

};