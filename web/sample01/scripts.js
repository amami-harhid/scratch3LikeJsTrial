const draw = function(render){
  render.renderer.draw();
}

LS.start = async function (){
  const LayerGroup = ["1", "2"];
  const render = new LS.Render(LayerGroup);
  const stage = new LS.Stage(render, "stage", LayerGroup[0]);
  await stage.backdrops.loadImage('jurassic', '../assets/Jurassic.svg');
  stage.scale = {x:100,y:100};
  const wait_time = 1000/30;
  for(;;){
    stage.update();
    draw(render);
    await LS.Utils.wait(wait_time);
  }
      
};