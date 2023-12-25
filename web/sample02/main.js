const Sounds = class {
  static async Wait (milliSecond = Sounds.WAIT_TIME) {
    return new Promise(resolve => setTimeout(resolve, milliSecond));
  }
  static WAIT_TIME () {
    return 0.05;
  }
  static get AudioEngine() {
    if( Sounds._audioEngine ) {
      return Sounds._audioEngine;
    }
    const audioEngine = new AudioEngine();
    Sounds._audioEngine = audioEngine;
    return audioEngine;
  }
  static set AudioEngine(obj) {
    Sounds._audioEngine = obj;
  }
  constructor() {
    this._cancel = false;
  }

  async startSound(untilDone = false) {
    this._cancel = false;
    if( untilDone ) {
      for(;;) {
        this.soundPlayer.play();
        await this.soundPlayer.finished(); // 終わるまで待つ
        if(this._cancel) break;
        await Sounds.Wait();
      }
    }else{
      this.soundPlayer.play();
    }
  }
  startSoundUntilDone() {
    this.startSound(true);
  }
  stop() {
    this._cancel = true;
    this.soundPlayer.stop();
  }

  async createSoundPlayer(soundPath) {
    const data = await this._loadSound(soundPath);
    const soundPlayer = await Sounds.AudioEngine.decodeSoundPlayer({data});
    this.soundPlayer = soundPlayer;
    const soundEffectChain = Sounds.soundEffectChain;
    Sounds.soundEffectChain = soundEffectChain;
    Sounds.soundEffectChain.set(Sounds.soundEffectChain.pitch.name, 150);
//    this.soundPlayer.connect(Sounds.soundEffectChain.pan);
    this.volume = 0;
//    this.soundPlayer.connect(Sounds.soundEffectChain.pitch);
    this.soundPlayer.connect(Sounds.soundEffectChain);
    // Volume 以外のエフェクトが効かない。どうして？
    return soundPlayer;
  }

  set playbackRate(value) {
    this.soundPlayer.setPlaybackRate(value);
  }
  set volume(value) {
    Sounds.soundEffectChain.set(Sounds.soundEffectChain.volume.name, value);
  }
  get volume() {
    const volume = Sounds.soundEffectChain.get(Sounds.soundEffectChain.volume.name);
    return volume;
  }
  volumeUp(value) {
    let _volume = this.volume;
    this.volume = _volume + value;
  }

  get soundPlayer() {
    return this._soundPlayer;
  }
  set soundPlayer(obj) {
    this._soundPlayer = obj;
  }
  static get soundEffectChain() {
    if( Sounds._soundEffectChain ) {
      return Sounds._soundEffectChain;
    }
    const soundEffectChain = Sounds.AudioEngine.createEffectChain();
    return soundEffectChain;
  }
  static set soundEffectChain(obj) {
    Sounds._soundEffectChain = obj;
  }
  async _loadSound(soundPath) {
    let response = await fetch(soundPath);
    let buffer = await response.arrayBuffer();
    let data =  new Uint8Array(buffer);
    return data;
  }

  setPlaybackRate(value) {
    this.soundPlayer.setPlaybackRate(value);
  }

}