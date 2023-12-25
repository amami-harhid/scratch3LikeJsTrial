/**
 * p5 で作ったCanvas を使うと
 * ScratchRenderer にてエラーが起きる
 * Uncaught (in promise) Error: Could not get WebGL context: this browser or environment may not support WebGL.
 * 
 */
const Character = class {
    constructor (renderer, name, order, imageUrl, x=0, y=0, scale={x:100,y:100} ) {
      this.renderer = renderer;
      this.name = name;
      this.order = order;
      this.x = x;
      this.y = y;
      this.scale = scale;
      this.skinId;
      this.skinSVGIdx = -1;
      this.skinSVGArr = [];
      this.color = 0;
      this.mosaic = 0;
      this.fisheye = 0;
      this.drawableID = renderer.createDrawable(this.order);
      this.loaded = false;
      if(Array.isArray(imageUrl)){
        imageUrl.forEach(url=>{
          this.updateImage(url); 
        })
      }else{
        this.updateImage(imageUrl); 
      }
    }
    async svgText(imageUrl) {
      let svg = await fetch(imageUrl)
      let txt = await svg.text();
      return txt;
    }
    async updateImage(imageUrl) {
      //let txt = this.svgText(imageUrl);
      const _this = this;
      //var image = new Image();
      let t = await this.svgText(imageUrl);
      //txt.then(t=>{
        let skinId =_this.renderer.createSVGSkin(t);
        if( this.skinSVGArr.length == 0){
          this.skinId = skinId;  
          this.skinSVGIdx = 0;
        }
        this.skinSVGArr.push(t);
        _this.renderer.updateDrawableProperties(_this.drawableID, {
          skinId: this.skinId,
          scale: [_this.scale.x, _this.scale.y],
          color: this.color,
          mosaic: this.mosaic,
          fisheye: this.fisheye,

        });
        _this.loaded = true;
      //});  
    }
    nextCostume() {
      if( this.skinSVGArr.length > 0) {
        if( this.skinSVGIdx+1 < this.skinSVGArr.length ) {
          this.skinSVGIdx += 1;
        }else{
          this.skinSVGIdx = 0;
        }
        let t = this.skinSVGArr[this.skinSVGIdx ];
        this.renderer.updateSVGSkin(this.skinId, t);
      }
    }
    update() {
      const _this = this;
      this.renderer.updateDrawableProperties(this.drawableID, {
        position: [_this.x, _this.y],
        scale: [_this.scale.x, _this.scale.y],
        direction: 90,
        skinId: _this.skinId,
        color: _this.color,
        mosaic: _this.mosaic,
        fisheye: _this.fisheye,
      });
      _this.renderer.draw();
    }
    isTouching(_targetCharacter, _callback) {
      let _targetDrawableId = _targetCharacter.drawableID;
      if( this.renderer.isTouchingDrawables(_targetDrawableId) ) {
        if( _callback ){
          _callback();
        }
        return true;
      }
      return false;
    }
    move() {

    }
}
const Wait = async function (second) {
  return new Promise(resolve => setTimeout(resolve, second));
}
let soundPlayer;
let soundPlayer2;
let soundPlayer3;
const moduleStart = async() => {

  scratch_setup();
  //scratch_drawup();
  setInterval(scratch_drawup, 1000/30);
  
  const audioEngine = new AudioEngine();
  // audio file をfetchで読み込む。
  // responseを arrayBuffer化し Uint8Arrayへ変換
  // AudioEngine#decodeSoundPlayer へは　{data}として渡す
  // AudioEngine#_decodeSounde の中で　sound.data として
  // 参照しているため。
  {
    let response = await fetch('./assets/Cat.wav');
    let buffer = await response.arrayBuffer();
    let data =  new Uint8Array(buffer);
    soundPlayer = await audioEngine.decodeSoundPlayer({data});
    soundPlayer.setPlaybackRate(2);
    // AudioEngine#createEffectChain で AudioEffectsインスタンスを作る。
    // effects.volume は VolumeEffect インスタンス
    // effects.pan は、PanEffect インスタンス
    // effects.pitch は、PitchEffect インスタンス
    const effects = audioEngine.createEffectChain(); 
    effects.set(effects.volume.name, 10);
    // SoundPlayer#connect で Effect を渡すことで効果が出る。
    soundPlayer.connect(effects.volume);  
    // TODO 異なるEffectを 複数connect することは試していないので試すこと！    
  }
  {
    let response = await fetch('./assets/Boing.wav');
    let buffer = await response.arrayBuffer();
    let data =  new Uint8Array(buffer);
  
    soundPlayer2 = await audioEngine.decodeSoundPlayer({data});
    soundPlayer2.setPlaybackRate(1);
    const effects = audioEngine.createEffectChain(); 
    effects.set(effects.volume.name, 30);
    soundPlayer2.connect(effects.volume);
  }
  {
    let response = await fetch('./assets/Chill.wav');
    let buffer = await response.arrayBuffer();
    let data =  new Uint8Array(buffer);
  
    soundPlayer3= await audioEngine.decodeSoundPlayer({data});
    const effects = audioEngine.createEffectChain(); 
    console.log(effects);
    effects.set(effects.volume.name, 10);
    soundPlayer3.setPlaybackRate(1);
    soundPlayer3.connect(effects.volume);
  }
  // 音を終わるまで待つのは、soundPlayer.play()の後に
  // await soundPlayer.finished(); とすること
  // もちろん async関数の中でしか使えない。
  for(;;) {
    soundPlayer3.play();
    await soundPlayer3.finished(); // 終わるまで待つ
    await Wait(1); //<-- ここの場合ではなくてもよいがブラウザハングをさけるため念のためにつける。
  }
};
let canvas;
const W = innerWidth;//759;//480;//innerWidth;  480*2 = 760
const H = innerHeight;//569;//360;//innerHeight; 360*2 = 620;
const CanvasRate = 1;
let character;
let character2;
let renderer;

const scratch_setup = function() {
  const main = document.getElementById('canvas');
  const canvas = document.createElement('canvas');
  main.appendChild(canvas);
  renderer = new ScratchRenderer(canvas);
  renderer.setLayerGroupOrdering(['1','2']);
  renderer.resize( W, H);
  renderer.setStageSize(-W/2,W/2,-H/2,+H/2);
  const costumes = ["./assets/cat.svg","./assets/cat2.svg"];
  character = new Character(renderer, "cat", "1", costumes, 0, 0, {x:500, y:500});    
  character2 = new Character(renderer, "cat2", "2", costumes, 0, 100, {x:-150, y:150});
  
}
const Power = 50;
let speed = Power;
let chara1RightSpeed = 20;
let chara2RightSpeed = -20;
let chara1OutofChara2 = true;
const scratch_drawup = function () {

  if(character.isTouching(character2)) {
    if(soundPlayer2) soundPlayer2.stop();
    renderer.setBackgroundColor(1,1,1,1);
    character.fisheye = 100;
    if(chara1OutofChara2 === true) {
      chara1RightSpeed *= -1;
      character.scale.x *= -1;  
      chara2RightSpeed *= -1;
      character2.scale.x *= -1;
      speed = Math.random()*Power;
    }
    chara1OutofChara2 = false;
  }else{
    chara1OutofChara2 = true;
    renderer.setBackgroundColor(0.6,0.1,0.1, 1);
    character.fisheye = 0;
  }
  character.update();
  character2.update();
  character.x += chara1RightSpeed;
  if( character.x > W/2 || character.x < -W/2) {
    chara1RightSpeed *= -1;
    character.scale.x *= -1;
    soundPlayer.play();
  }
  character2.y += speed;
  speed += -2;
  if( character2.y < -H/2 ) {
    speed = Power;
  }
  character2.x += chara2RightSpeed;
  if( character2.x > W/2 || character2.x < -W/2) {
    chara2RightSpeed *= -1;
    character2.scale.x *= -1;
    soundPlayer2.play();
  }
  character.nextCostume();
  character2.nextCostume();

  //requestAnimationFrame(scratch_drawup);
}

