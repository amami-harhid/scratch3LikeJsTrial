let stage, spriteA;
const wait_time = 1000/30;

LS.process.staging = async function() {
  const render = new LS.Render();
  stage = new LS.Stage(render, "stage");
  await stage.backdrops.loadImage('jurassic', '../assets/Jurassic.svg');
  stage.scale = {x:100,y:100};
  stage.update();
};
LS.process.draw = function() {
  stage.draw();
}
