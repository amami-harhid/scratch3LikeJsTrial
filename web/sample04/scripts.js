/**
 * (1) MyStage, MyCat を 別ファイル化
 * (2) イベント登録を作りこむ ( )
 * 
 * 
 * 
 */


let stage, spriteA;
let spriteAClone1;
let spriteAClone2;
//LS.Env.pace = 500;
const wait_time = LS.Env.pace;
LS.process.staging = async function() {

  const render = new LS.Render();
  stage = new LS.Stage(render, "stage");
  await stage.backdrops.loadImage('mural', '../assets/Mural.png');

  spriteA = new MyCat(render, "spriteA");
  await spriteA.loadImage();
  stage.addSprite(spriteA)
  stage.scale = {x:100,y:100};
  spriteAClone1 = spriteA.clone({'position':{x:spriteA.position.x+30, y:spriteA.position.y-40}});
  spriteAClone2 = spriteA.clone();
  spriteAClone1.setScale(150);  
  stage.update();
  stage.draw();
  stage.whenFlag(function(){
    console.log('stage when flag');
  });
  stage.whenFlag(function(){
    console.log('stage when flag2');
  });
  stage.whenFlag(async function(){
    for(;;) {
      spriteA.nextCostume();
      spriteAClone1.nextCostume();
      await LS.Utils.wait(wait_time);
    }
  });
}

LS.process.start = async ()=> {
  const sounds = new LS.Sounds();
  await sounds.loadSound('boing','../assets/Boing.wav');
  sounds.volume = 5;
  let pitch = 1;
  sounds.pitch = pitch;
  const times = Array(40).fill();
  for(;;){

    for(const t in times){
      pitch += 0.01;
      sounds.pitch = pitch;
      spriteA.setScale(spriteA.scale.x + 5);
      spriteAClone1.position.x += 5;
      spriteAClone2.position.x -= 5;
      stage.update();
      //stage.draw();
      sounds.play();
      await LS.Utils.wait(wait_time);
    }

    for(const t in times){
      pitch -= 0.01;
      sounds.pitch = pitch;
      spriteA.setScale(spriteA.scale.x - 5);
      spriteAClone1.position.x -= 5;
      spriteAClone2.position.x += 5;
      stage.update();
      //stage.draw();
      sounds.play();
      await LS.Utils.wait(wait_time);
    }
    await LS.Utils.wait(wait_time);
  }

};
LS.process.draw = async function() {
  stage.draw();
}

const MyStage = class extends LS.Stage {
  constructor() {

  }
}

const MyCat = class extends LS.Sprite {
  constructor(render, name) {
    super(render,name);
  }
  async loadImage() {
    await this.costumes.loadImage('cat', '../assets/cat.svg');
    await this.costumes.loadImage('cat2', '../assets/cat2.svg');
  }

}