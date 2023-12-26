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

  /**
   * Start sound.
   */
  startSound() {
    this.soundPlayer.play();
  }

  /**
   * Start sound until done forEver.
   */
  async soundForever() {
    this._cancel = false;
    for(;;) {
      this.soundPlayer.play();
      await this.soundPlayer.finished(); // 終わるまで待つ
      if(this._cancel) break;
      await Sounds.Wait();
    }
  }

  /**
   * Start sound until done.
   */
  async startSoundUntilDone() {
    this.soundPlayer.play();
    await this.soundPlayer.finished(); // 終わるまで待つ
  }

  /**
   * Stop immediately without fading out. May cause audible clipping
   */
  stopImmediately() {
    this._cancel = true;
    this.soundPlayer.stopImmediately();
  }

  /**
   * Stop playback after quickly fading out.
   * if immediately is specified, stop immediately without fading out. May cause audible clipping
   * @param {boolean} - immediately.
   */
  stop(immediately = false) {    
    this._cancel = true;
    if(immediately) {
      this.soundPlayer.stopImmediately();
    }else{
      this.soundPlayer.stop();
    }
  }

  /**
   * create sound player.
   * @param {string} - soundUrl.
   * @returns {SoundPlayer} - soundPlayer.
   */
  async createSoundPlayer(soundUrl) {
    const data = await this._loadSound(soundUrl);
    const soundPlayer = await Sounds.AudioEngine.decodeSoundPlayer({data});
    this.soundPlayer = soundPlayer;
    const soundEffectChain = Sounds.soundEffectChain;
    Sounds.soundEffectChain = soundEffectChain;
//    Sounds.soundEffectChain.set(Sounds.soundEffectChain.pitch.name, 150);
//    this.soundPlayer.connect(Sounds.soundEffectChain.pan);
//    this.volume = 0;
//    this.soundPlayer.connect(Sounds.soundEffectChain.pitch);
    this.soundPlayer.connect(Sounds.soundEffectChain);
    // Volume 以外のエフェクトが効かない。どうして？
    return soundPlayer;
  }

  /**
   * volume setter.
   * @param {number} - volume of sound.
   */
  set volume(value) {
    Sounds.soundEffectChain.set(Sounds.soundEffectChain.volume.name, value);
//    Sounds.soundEffectChain.update();
    Sounds.soundEffectChain.volume.update();
  }
  /**
   * volume getter
   * @returns {number} - volume of sound.
   */
  get volume() {
    const volume = Sounds.soundEffectChain[Sounds.soundEffectChain.volume.name].value;
    return volume;
  }

  /**
   * soundPlayer getter
   * @returns {SoundPlayer} - _soundPlayer.
   */
  get soundPlayer() {
    return this._soundPlayer;
  }
  /**
   * soundPlayer setter
   * @param {SoundPlayer} - _soundPlayer.
   */
  set soundPlayer(_soundPlayer) {
    this._soundPlayer = _soundPlayer;
  }
  /**
   * effectChain getter
   * @returns {EffectChain} - effectChain.
   */
  static get soundEffectChain() {
    if( Sounds._soundEffectChain ) {
      return Sounds._soundEffectChain;
    }
    const soundEffectChain = Sounds.AudioEngine.createEffectChain();
    return soundEffectChain;
  }
  /**
   * effectChain setter
   * @param {EffectChain} _effectChain - effectChain.
   */
  static set soundEffectChain(_effectChain) {
    Sounds._soundEffectChain = _effectChain;
  }
  /**
   * load sound data
   * @param {string} soundUrl - url of sound data.
   * @returns {Unit8Array} - sound's arayBuffer.
   */
  async _loadSound(soundUrl) {
    let response = await fetch(soundUrl);
    let buffer = await response.arrayBuffer();
    let data =  new Uint8Array(buffer);
    return data;
  }

  /**
   * Set the sound's playback rate.
   * @param {number} value - pitch rate. Default is 1.
   */
  set pitch(value = 1) {
    /*
    Sounds.soundEffectChain.set(Sounds.soundEffectChain.pitch.name, value);
    Sounds.soundEffectChain.pitch.value = value;
    Sounds.soundEffectChain.pitch.update();
    */
    this.soundPlayer.setPlaybackRate(value);
  }

}