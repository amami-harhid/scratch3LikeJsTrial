P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
}

P.prepare = async function() {
    P.stage = new P.Stage();
    P.stage.addImage( P.images.Jurassic );

    P.monitors = new P.Monitors();
    P.monitors.add('Counter 2');
    P.monitors.add('マウス');
    // 名前がJS変数として成立しないとき（ここでは途中にスペースあり), 次のようにして参照できる。
    P.monitors.v['Counter 2'].setPosition( {x: 35, y:15} )
    // 名前がJS変数として成立するならば、日本語を使える。途中に全角スペースは使えない。
    P.monitors.v.マウス.setPosition( {x: 35, y:45} )

    P.monitors.v['Counter 2'].value = 0;
    P.monitors.v.マウス.value = 'xxxxx';
    P.monitors.automatic();
}

P.setting = async function() {


    P.stage.whenFlag( async function() {

        let counter = 0;
        for(;;) {
    
            P.monitors.v['Counter 2'].value= counter;
            // 1秒待つ
            await P.wait(1000); 
            // インクリメントする
            counter += 1;
        }
    });

    P.stage.whenFlag( async function() {
        for(;;) {
            const position = P.mousePosition;
            P.monitors.v.マウス.value = ` ${Math.ceil(position.x)} , ${Math.ceil(position.y)}`;            
        }
    });

}