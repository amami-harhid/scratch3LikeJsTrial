const draw = function(render){
    render.renderer.draw();
}
LS.start = async function (){
    const LayerGroup = ["1", "2"];
    const render = new LS.Render(LayerGroup);
    const stage = new LS.Stage(render, "stage", LayerGroup[0]);
    await stage.backdrops.loadImage('jurassic', '../assets/Jurassic.svg');
    stage.scale = {x:100,y:100};
    const spriteA = new LS.Sprite(render, "spriteA",  LayerGroup[1]);
    spriteA.scale = {x:80,y:80};
    await spriteA.costumes.loadImage('catA', '../assets/cat.svg');    
    stage.addSprite(spriteA)
    stage.update();

    const times = Array(40).fill();
    const wait_time = 1000/30;
    for(;;){

      for(const t in times){
        spriteA.setScale(spriteA.scale.x + 5);
        stage.update();
        draw(render);
        await LS.Utils.wait(wait_time);
      }
      for(const t in times){
        spriteA.setScale(spriteA.scale.x - 5);
        stage.update();
        draw(render);
        await LS.Utils.wait(wait_time);
      }

      await LS.Utils.wait(wait_time);
    }
        
  };
