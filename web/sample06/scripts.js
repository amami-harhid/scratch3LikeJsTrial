const _p = P;
_p.staging = async function() {
  _p.wait_time = P.Env.pace;
  const render = new P.Render();
  _p.stage = new MyStage("stage");

  _p.spriteA = new MyCat(_p.stage, "spriteA");
  _p.spriteA.position = {x:0, y:0};
  _p.spriteA.scale = {x:50, y:50};
  _p.spriteA.direction = Math.random() * (360);
  _p.spriteA.effect = {'fisheye': 150, 'color': 10};
  await _p.spriteA.loadImage();
  // ↑ 以降でクローンを作るが、ロードしたイメージは引き継がれる。
  _p.spriteB = _p.spriteA.clone();
  _p.spriteB.position = {x:_p.spriteA.position.x+200, y:_p.spriteA.position.y};
  _p.spriteB.scale = {x:50, y:50};
  _p.spriteB.direction = Math.random() * (360);
  _p.spriteB.clearEffect();
  _p.spriteB.effect = {'color': 100};
  _p.spriteB.whenFlag(async function(){
      await _p.spriteB.loadSound('boing','../assets/Boing.wav',{'volume':5});  
    });
  _p.spriteC = _p.spriteA.clone();
  _p.spriteC.position = {x:_p.spriteA.position.x-200, y:_p.spriteA.position.y+20};
  _p.spriteC.scale = {x:50, y:50};
  _p.spriteC.direction = Math.random() * (360);
  _p.spriteC.clearEffect();
  _p.spriteC.effect = {'color': 50, 'mosaic': 50};
  _p.spriteC.whenFlag(async function(){
    await _p.spriteC.loadSound('boing','../assets/Boing.wav',{'volume':5});  
  });

  _p.stage.update();
  _p.stage.draw();
  _p.stage.whenFlag(async function(){
    console.log('startSoundUntilDone')
    for(;;){
      await _p.stage.startSoundUntilDone();
      await P.Utils.wait(_p.wait_time);
    }
  });
  _p.stage.whenFlag(async function(){
    for(;;) {
      _p.spriteA.nextCostume();
      _p.spriteB.nextCostume();
      _p.spriteC.nextCostume();
      await P.Utils.wait(_p.wait_time);
    }
  });
  _p.spriteA.whenClicked(async function(){
    const scale = _p.spriteA.scale;
    _p.spriteA.setScale(scale.x * -1, scale.y);
  });
  _p.spriteB.whenClicked(async function(){
    const scale = _p.spriteB.scale;
    _p.spriteB.setScale(scale.x * -1, scale.y);
  });
  _p.spriteC.whenClicked(async function(){
    const scale = _p.spriteC.scale;
    _p.spriteC.setScale(scale.x * -1, scale.y);
  });
  _p.stage.whenClicked(async function(){
    const scale = _p.stage.scale;
    _p.stage.setScale(scale.x * -1, scale.y);
    _p.stage.nextSound();
  });
 
}


_p.start = async function(){
  let pitch = 1;
  let picthPower = 0.01;
  _p.spriteB.setSoundPitch(pitch);
  _p.spriteC.setSoundPitch(pitch);
  const times = Array(40).fill();
  const MoveSteps = 20;
  const Clone1MoveSteps = 10;
  const Clone2MoveSteps = 10;
  for(;;){

    for(const t in times){
      pitch += picthPower;
      if(pitch > 3 || pitch < 0.5) picthPower *= -1;

      _p.spriteB.setSoundPitch(pitch);
      _p.spriteC.setSoundPitch(pitch);
      _p.spriteA.moveSteps(MoveSteps);
      _p.spriteA.ifOnEdgeBounds();
      _p.spriteB.moveSteps(Clone1MoveSteps);
      if(_p.spriteB.isTouchingTarget(_p.spriteA)) {
        _p.spriteA.direction += ((Math.random()) - 0.5)*45;
        _p.spriteB.moveSteps(Clone1MoveSteps*(-3));
        _p.spriteB.direction += 180;
      }
      _p.spriteB.ifOnEdgeBounds();
      if(_p.spriteB.isTouchingEdge()){
        _p.spriteB.soundPlay();
      }
      _p.spriteC.moveSteps(Clone2MoveSteps);
      if(_p.spriteC.isTouchingTarget(_p.spriteA)) {
        _p.spriteC.moveSteps(Clone2MoveSteps*(-3));
        _p.spriteC.direction += 180;
      }
      if(_p.spriteB.isTouchingTarget(_p.spriteC)) {
        _p.spriteB.moveSteps(Clone1MoveSteps*(-3));
        _p.spriteC.moveSteps(Clone2MoveSteps*(-3));
        _p.spriteB.direction += 180;
        _p.spriteC.direction += 180;
      }
      _p.spriteC.ifOnEdgeBounds();
      if(_p.spriteC.isTouchingEdge()){
        _p.spriteC.soundPlay();
      }
      _p.stage.update();
      await P.Utils.wait(_p.wait_time);
    }

    await P.Utils.wait(_p.wait_time);
  }


}

_p.draw = function() {
  _p.stage.draw();
}
