/**
 * TEST SPEECH
 * 
 * Scratch3 スピーチの実験
 * 
 * 実験では、お話しを broadcast を経由していますが、broadcastAndWait() ではお話しが終わったことがわからないです
 * --> broadcastAndWait()にてお話の終わりを検知できるようにしました！！やったね。
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
        this.addSound( P.sounds.Chill, { 'volume' : 20 } );
    })
    P.stage.whenFlag(async function() {
        for(;;) {
            await this.startSoundUntilDone();
        }
    });

    // ネコにさわったらお話する
    P.cat.whenFlag( async function(){
        this.__waitTouching = false;
        const words = `なになに？どうしたの？`;
        const properties = {'pitch': 2, 'volume': 100}
        for(;;) {
            if( this.isMouseTouching() ) {
                await this.broadcastAndWait('SPEECH', words, properties, 'male');
                // マウスタッチしないまで待つ
                //await P.Utils.waitUntil( this.isNotMouseTouching, P.Env.pace,  this ); 

            }

        }

    });
    
    // ネコをクリックしたらお話する
    P.cat.whenClicked(function(){
        const words = `そこそこ。そこがかゆいの。`;
        const properties = {'pitch': 1.7, 'volume': 500}
        this.broadcast('SPEECH', words, properties, 'female')
    });

    P.cat.whenBroadcastReceived('SPEECH', async function(words, properties, gender='male', locale='ja-JP') {

        const _properties = (properties)? properties : {};

        const speech = P.Speech.getInstance();
        speech.gender = gender;
        speech.locale = locale;
        await speech.speakAndWait(words, _properties)

    });

}
