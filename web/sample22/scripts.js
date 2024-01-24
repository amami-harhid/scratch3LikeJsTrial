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
P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
P.prepare = function() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );
    P.cat = new P.Sprite("Cat", {scale:{x:200,y:200}});
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
                this.say(words);
                await this.broadcastAndWait('SPEECH', words, properties, 'male');
                
                // 「送って待つ」を使うことで スピーチが終わるまで次のループに進まないため、
                // 以下の「マウスタッチしない迄待つ」のコードが不要である。
                //await P.Utils.waitUntil( this.isNotMouseTouching, P.Env.pace,  this ); 

            }else{
                this.say("");
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

        await this.speechAndWait(words, properties, gender, locale);

    });

}
