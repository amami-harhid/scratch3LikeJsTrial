LS.process.staging = async function() {
  const _p = this;
  _p.wait_time = 500;//LS.Env.pace;
  const render = new LS.Render();
  _p.stage = new LS.Stage(render, "stage");
  await _p.stage.backdrops.loadImage('mural', '../assets/Mural.png');

  _p.spriteA = new MyCat(render, "spriteA");
  await _p.spriteA.loadImage();
  _p.stage.addSprite(_p.spriteA)
  _p.stage.scale = {x:100,y:100};
  _p.spriteAClone1 = _p.spriteA.clone(
    {'position':{x:_p.spriteA.position.x+30, y:_p.spriteA.position.y-40}, 
     'scale':{x:-250,y:250}
    });
  _p.spriteAClone2 = _p.spriteA.clone();
//  spriteAClone1.setScale(150);  
  _p.stage.update();
  _p.stage.draw();
  _p.stage.whenFlag(function(){
    console.log('stage when flag');
  });
  _p.stage.whenFlag(function(){
    console.log('stage when flag2');
  });
  _p.stage.whenFlag(async function(){
    for(;;) {
      //_p.spriteA.nextCostume();
      //_p.spriteAClone1.nextCostume();
      await LS.Utils.wait(_p.wait_time);
    }
  });
  _p.stage.whenFlag(async function(){
    start(_p);
  });

}
const start = async function(_p){
  const sounds = new LS.Sounds();
  await sounds.loadSound('boing','../assets/Boing.wav');
  sounds.volume = 5;
  let pitch = 1;
  sounds.pitch = pitch;
  const times = Array(40).fill();
  const walkStep = 3;
  for(;;){

    for(const t in times){
      pitch += 0.01;
      sounds.pitch = pitch;
      _p.spriteA.setScale(_p.spriteA.scale.x + 5);
      _p.spriteAClone1.position.x += walkStep;
      _p.spriteAClone2.position.x -= walkStep;
      _p.stage.update();
      //stage.draw();
      sounds.play();
      //console.log(`mouse x=${stage.mouse.x}, y=${stage.mouse.y}`);
      await LS.Utils.wait(_p.wait_time);
    }

    for(const t in times){
      pitch -= 0.01;
      sounds.pitch = pitch;
      _p.spriteA.setScale(_p.spriteA.scale.x - 5);
      _p.spriteAClone1.position.x -= walkStep;
      _p.spriteAClone2.position.x += walkStep;
      _p.stage.update();
      //stage.draw();
      sounds.play();
      //console.log(`mouse x=${stage.mouse.x}, y=${stage.mouse.y}`);
      await LS.Utils.wait(_p.wait_time);
    }
    await LS.Utils.wait(_p.wait_time);
  }

}
LS.process.draw = async function() {
  const _p = this;
  _p.stage.draw();
}
