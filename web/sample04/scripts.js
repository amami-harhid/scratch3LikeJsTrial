let stage, spriteA;
let spriteAClone1;
let spriteAClone2;
const wait_time = LS.Env.pace;

LS.process.staging = async function() {

  const render = new LS.Render();
  stage = new LS.Stage(render, "stage");
  await stage.backdrops.loadImage('mural', '../assets/Mural.png');

  spriteA = new LS.Sprite(render, "spriteA");
  await spriteA.costumes.loadImage('cat', '../assets/cat.svg');
  stage.addSprite(spriteA)
  stage.scale = {x:100,y:100};
//  await LS.Utils.wait(1000);
  spriteAClone1 = spriteA.clone({point:{x:spriteA.position.x+30, y:spriteA.position.y-40}});
  spriteAClone2 = spriteA.clone();
  spriteAClone1.setScale(150);  
  stage.update();
  stage.draw();
}
LS.process.start = async ()=> {
  const sounds = new LS.Sounds();
  //this.sounds = sounds;
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

