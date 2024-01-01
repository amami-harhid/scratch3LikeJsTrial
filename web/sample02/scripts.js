let stage, spriteA;
const LayerGroup = ["1","2"];
const wait_time = LS.Env.pace;

LS.process.staging = async function() {
  const render = new LS.Render(LayerGroup);
  stage = new LS.Stage(render, "stage", LayerGroup[0]);
  await stage.backdrops.loadImage('jurassic', '../assets/Jurassic.svg');
  stage.scale = {x:100,y:100};
  spriteA = new LS.Sprite(render, "spriteA",  LayerGroup[1]);
  spriteA.scale = {x:80,y:80};
  await spriteA.costumes.loadImage('pico', '../assets/pico.png');
  stage.addSprite(spriteA);
  stage.update();
  stage.draw();

};

LS.process.start = async ()=> {
  const times = Array(40).fill();
  const wait_time = 1000/30;
  for(;;){

    for(const t in times){
      spriteA.setScale(spriteA.scale.x + 5);
      stage.update();
      //stage.draw();
      await LS.Utils.wait(wait_time);
    }
    for(const t in times){
      spriteA.setScale(spriteA.scale.x - 5);
      stage.update();
      //stage.draw();
      await LS.Utils.wait(wait_time);
    }

    await LS.Utils.wait(wait_time);
  }

};
LS.process.draw = async function() {
  stage.draw();
}
