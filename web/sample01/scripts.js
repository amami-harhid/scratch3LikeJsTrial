let stage, spriteA;
const LayerGroup = ["1"];
const wait_time = 1000/30;

LS.process.staging = async function() {
  const render = new LS.Render(LayerGroup);
  stage = new LS.Stage(render, "stage", LayerGroup[0]);
  await stage.backdrops.loadImage('jurassic', '../assets/Jurassic.svg');
  stage.scale = {x:100,y:100};
  stage.update();
};
LS.process.draw = function() {
  stage.draw();
}
