P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');

}

P.prepare = async function() {
    P.wait_time = P.Env.pace;

    P.stage = new P.Stage( "stage" );
    P.stage.addImage( P.images.Jurassic );

}
P.setting = async function() {

    P.stage.whenFlag(async function(){
        // TODO addSound 処理時間が長いとき、登録順が逆になるときがある。なんとかしたい。
        this.addSound( P.sounds.Chill, { 'volume' : 125 } );
    });
    P.stage.whenFlag( async function() {
        for(;;){
            // 終わるまで音を鳴らす
            await this.startSoundUntilDone();
            //await P.Utils.wait( P.wait_time );
        }
    });
}
