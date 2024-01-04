LS.process.staging = async function() {
  const _p = this;
  _p.wait_time = LS.Env.pace;
  const render = new LS.Render();
  _p.stage = new LS.Stage(render, "stage");
  await _p.stage.backdrops.loadImage('mural', '../assets/Mural.png');

  _p.spriteA = new MyCat(render, "spriteA",{scale:{x:100,y:100},direction:45});
  await _p.spriteA.loadImage();
  _p.stage.addSprite(_p.spriteA)
  _p.spriteAClone1 = _p.spriteA.clone(
    {'position':{x:_p.spriteA.position.x+200, y:_p.spriteA.position.y}, 
     'scale':{x:50,y:50},
     'direction': 50
    });
  _p.spriteAClone2 = _p.spriteA.clone(
    {'position':{x:_p.spriteA.position.x-200, y:_p.spriteA.position.y}, 
     'scale':{x:+50,y:50},
     'direction': -80
    }
  );
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
      _p.spriteA.nextCostume();
      _p.spriteAClone1.nextCostume();
      _p.spriteAClone2.nextCostume();
      await LS.Utils.wait(_p.wait_time);
    }
  });
  _p.stage.whenFlag(async function(){
    start(_p);
  });
  _p.spriteA.whenClicked(async function(){
    const scale = _p.spriteA.scale;
    _p.spriteA.setScale(scale.x * -1, scale.y);
  });
  _p.spriteAClone1.whenClicked(async function(){
    const scale = _p.spriteAClone1.scale;
    _p.spriteAClone1.setScale(scale.x * -1, scale.y);
  });
  _p.spriteAClone2.whenClicked(async function(){
    const scale = _p.spriteAClone2.scale;
    _p.spriteAClone2.setScale(scale.x * -1, scale.y);
  });
  _p.stage.whenClicked(async function(){
    const scale = _p.stage.scale;
    _p.stage.setScale(scale.x * -1, scale.y);
  });

  /*
  _p.spriteAClone1.whenTouchingTarget(_p.spriteA,async function(){
    _p.spriteAClone1.direction  *= -1;
//    _p.spriteAClone1.moveSteps *= -1;
  });
  _p.spriteAClone2.whenTouchingTarget(_p.spriteA,async function(){
    _p.spriteAClone2.direction  *= -1;
  });
*/
}
const start = async function(_p){
  const sounds = new LS.Sounds();
  await sounds.loadSound('boing','../assets/Boing.wav');
  sounds.volume = 5;
  let pitch = 1;
  let picthPower = 0.01;
  sounds.pitch = pitch;
  const times = Array(40).fill();
  const MoveSteps = 20;
  const Clone1MoveSteps = 10;
  const Clone2MoveSteps = 10;
  for(;;){

    for(const t in times){
      pitch += picthPower;
      if(pitch > 3 || pitch < 0.5) picthPower *= -1;

      sounds.pitch = pitch;
      _p.spriteA.moveSteps(MoveSteps);
      _p.spriteA.ifOnEdgeBounds();
      _p.spriteAClone1.moveSteps(Clone1MoveSteps);
      if(_p.spriteAClone1.isTouchingTarget(_p.spriteA)) {
        _p.spriteA.direction += ((Math.random()) - 0.5)*45;
        _p.spriteAClone1.moveSteps(Clone1MoveSteps*(-3));
        _p.spriteAClone1.direction += 180;
      }
      _p.spriteAClone1.ifOnEdgeBounds();
      if(_p.spriteAClone1.isTouchingEdge()){
          sounds.play();
      }
      _p.spriteAClone2.moveSteps(Clone2MoveSteps);
      if(_p.spriteAClone2.isTouchingTarget(_p.spriteA)) {
        _p.spriteAClone2.moveSteps(Clone2MoveSteps*(-3));
        _p.spriteAClone2.direction += 180;
      }
      if(_p.spriteAClone1.isTouchingTarget(_p.spriteAClone2)) {
        _p.spriteAClone1.moveSteps(Clone1MoveSteps*(-3));
        _p.spriteAClone2.moveSteps(Clone2MoveSteps*(-3));
        _p.spriteAClone1.direction += 180;
        _p.spriteAClone2.direction += 180;
      }
      _p.spriteAClone2.ifOnEdgeBounds();
      //_p.spriteAClone2.position.x += _p.spriteAClone2.moveSteps;
      if(_p.spriteAClone2.isTouchingEdge()){
        sounds.play();
      }
      _p.stage.update();
      await LS.Utils.wait(_p.wait_time);
    }

    await LS.Utils.wait(_p.wait_time);
  }

}
LS.process.draw = async function() {
  const _p = this;
  _p.stage.draw();
}
