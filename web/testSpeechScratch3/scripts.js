/**
 * TEST SPEECH
 * 
 * Scratch3 スピーチの実験
 * 
 * 実験では、お話が終わるのを待ってくれないです
 * 
 * Scratch3のスピーチは 次の仕組みです
 * 
 * https://github.com/scratchfoundation/scratch-vm/blob/develop/src/extensions/scratch3_text2speech/index.js#L742
 *
 * (1) URL を組み立てる
 * (2) fetchして音をGETする
 * (3) 音を soundPlayer に食わせて
 * (4) ピッチや音量を与えて 再生する
 * (5) soundPlayer.play() の中で stop を EMIT している。それを受けて SoundPlayerをdeleteしている。
 * 
 * ■ ja-JP, male, あいうえお 
 * https://synthesis-service.scratch.mit.edu/synth?locale=ja-JP&gender=male&text=%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81%8A
 * 
 */
const SERVER_HOST = 'https://synthesis-service.scratch.mit.edu';
const SERVER_TIMEOUT = 10000; 


P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
P.prepare = function() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );
    P.cat = new P.Sprite("Cat");
    P.cat.addImage( P.images.Cat );

}
P.setting = function() {

    P.stage.whenFlag(function(){
        this.addSound( P.sounds.Chill, { 'volume' : 30 } );
    })
    P.stage.whenFlag(async function() {
        for(;;) {
            await this.startSoundUntilDone();
        }
    });

    // ネコにさわったらお話する
    P.cat.whenFlag( async function(){
        const words = `なになに？どうしたの？`;
        const properties = {'pitch': 1.5, 'volume': 200}
        for(;;) {
            if( this.isMouseTouching() ) {
                await this.broadcastAndWait('SPEECH', words, properties, 'female')
                // マウスタッチしないまで待つ
                await P.Utils.waitUntil( this.isNotMouseTouching, P.Env.pace,  this ); 

            }

        }

    });
    
    // ネコをクリックしたらお話する
    P.cat.whenClicked(function(){
        const words = `そこそこ。そこがかゆいの。`;
        const properties = {'pitch': 1.5, 'volume': 200}
        this.broadcast('SPEECH', words, properties, 'female')
    });

    P.cat.whenBroadcastReceived('SPEECH', async function(words, properties, gender='male', locale='ja-JP') {

        const _properties = (properties)? properties : {};

        // 128文字までしか許容しないとする
        const text = encodeURIComponent(words.substring(0, 128));
        let path = `${SERVER_HOST}/synth`;
        path += `?locale=${locale}`;
        path += `&gender=${gender}`;
        path += `&text=${text}`;

        const sounds = new P.Sounds()
        const name = 'ScratchSpeech'; // <-- なんでもよいが、変数に使える文字であること
        P.loadSound(path, name).then(s=>{
            const name = s.name;
            const data = s.data;
            sounds.setSound(name, data, _properties).then(_=>{
                sounds.startSoundUntilDone()
            })
        });

    });

}
