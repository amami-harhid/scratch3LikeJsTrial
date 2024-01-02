const MyCat = class extends LS.Sprite {
  constructor(render, name, options) {
    super(render,name, options);
    this.life = 100;
  }
  async loadImage() {
    await this.costumes.loadImage('cat', '../assets/cat.svg');
    await this.costumes.loadImage('cat2', '../assets/cat2.svg');
  }

  update() {
    super.update();
    if(this.isClone === true) {
      this.life -= 1;
      if( this.life < 0 ) {
        console.log(`remove (${this.name})`);
        this.remove();
      }    
    }
  }

}