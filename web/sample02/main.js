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
const Chill = '../assets/Chill.wav';
let sound;
const start = async() => {

  scratch_setup();
  //scratch_drawup();
  setInterval(scratch_drawup, 1000/30);
  
  const sound = new Sounds();
  await sound.createSoundPlayer(Chill);
  let _playbackRate = 0.5;
  sound.pitch = 0.5;
  sound.volume = 50;
  setInterval(function(){
    if( sound.volume == 10 ){
        sound.volume = 100;
    }else{
        sound.volume = 10;
    }
  },500);
  setInterval(function(){
    if( _playbackRate > 2) {
      _playbackRate = 0.5;
    }
    _playbackRate += 0.1;
    sound.pitch = _playbackRate;
  },20);
  for(;;){
    await sound.startSoundUntilDone();
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
  const main = document.getElementById('main');
  const canvas = document.createElement('canvas');
  main.appendChild(canvas);
  renderer = new ScratchRenderer(canvas);
  renderer.setLayerGroupOrdering(['1','2']);
  renderer.resize( W, H);
  renderer.setStageSize(-W/2,W/2,-H/2,+H/2);
  const costumes = ["../assets/cat.svg","../assets/cat2.svg"];
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
  }
  character.nextCostume();
  character2.nextCostume();

  //requestAnimationFrame(scratch_drawup);
}

