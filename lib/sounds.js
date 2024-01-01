const AudioEngine = require('scratch-audio');
const Importer = require('./importer');
const Process = require('./process');
const Sounds = class {

    constructor() {
        this.audioEngine = new AudioEngine();
        this.effects = this.audioEngine.createEffectChain();
        this.soundPlayers = new Map();
        this.soundPlayer = null;
    }

    async loadSound( name, sound ) {
        const data = await Importer.loadSound(sound);
        const soundPlayer = await this.audioEngine.decodeSoundPlayer({data});
        if(this.soundPlayer == null){
            this.soundPlayer = soundPlayer;
        }
        this.soundPlayers.set(name, soundPlayer);
        this.soundPlayer.connect(this.effects);

    }
    switch(name) {
        const soundPlayer = this.soundPlayers.get(name);
        if(soundPlayer){
            this.soundPlayer = soundPlayer;
        }

    }

    play() {
        this.soundPlayer.connect(this.effects);
        this.soundPlayer.play();
    }
    set volume(value) {
        this.effects.set(this.effects.volume.name, value);
        this.effects.volume.update();
    }
    get volume(){
        const volume = this.effects[this.effects.volume.name].value;
        return volume;
    }
    set pitch(value = 1) {
        this.soundPlayer.setPlaybackRate(value);
    }
    async startSoundUntilDone() {
        this.soundPlayer.play();
        await this.soundPlayer.finished(); // 終わるまで待つ
    }
    stop() {
        this.soundPlayer.stop();
    }

    stopImmediately() {
        this.soundPlayer.stopImmediately();
    }
};

module.exports = Sounds;