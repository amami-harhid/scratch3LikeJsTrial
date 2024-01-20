/**
 * Sample20
 * 
 * メッセージ
 * 二匹のネコがお話しをする
 * お話しは、メッセージ送信 を使う。
 * 
 */

//P.Env.bubbleScaleLinkedToSprite = true
P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadImage('../assets/cat.svg','Cat1');
    this.loadImage('../assets/cat2.svg','Cat2');
}

P.prepare = async function() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );

    P.cat = new P.Sprite("Cat");
    P.cat.setRotationStyle( P.RotationStyle.LEFT_RIGHT );
    P.cat.addImage( P.images.Cat1 );
    P.cat.addImage( P.images.Cat2 );
    P.cat.position = {x: -150, y: 0}
    P.cat.direction = 90;
    P.cat2 = new P.Sprite("Cat2");
    P.cat2.setRotationStyle( P.RotationStyle.LEFT_RIGHT );
    P.cat2.addImage( P.images.Cat1 );
    P.cat2.addImage( P.images.Cat2 );
    P.cat2.direction = -90;
    P.cat2.position = {x: 150, y: 0}

}

const bubbleTextArr = [
    "こんにちは。良い天気ですね",
    "ちょっと近くのスーパーに買い物にいくんですよ",
    "",
];
const bubbleTextArr2 = [
    "💚こんにちは💚青空がよい感じですね",
    "どこにおでかけですか",
    "あらあらそれはいいですね",
];
P.setting = async function() {
    P.stage.whenFlag( async function() {
        await P.wait(1000);
        //(左) "こんにちは。良い天気ですね"
        this.sendMessage('BUBBLE1', 'say', bubbleTextArr[0], 2); 
        await P.wait(2000);
        //(右) "💚こんにちは💚青空がよい感じですね"
        this.sendMessage('BUBBLE2', 'say', bubbleTextArr2[0], 2);
        await P.wait(2000);
        //(右) "どこにおでかけですか"
        this.sendMessage('BUBBLE2', 'say', bubbleTextArr2[1], 2);
        await P.wait(2000);
        //(左) "ちょっと近くのスーパーに買い物にいくんですよ"
        this.sendMessage('BUBBLE1', 'say', bubbleTextArr[1], 2);
        await P.wait(2000);
        //(右) "あらあらそれはいいですね"
        this.sendMessage('BUBBLE2', 'think', bubbleTextArr2[2], 2);
    });
    P.cat.recieveMessage('BUBBLE1', async function() {
        const me = this;
        for(let i=0;i<10;i++){
            me.setXY(me.position.x, me.position.y+2);
        }
        for(let i=0;i<10;i++){
            me.setXY(me.position.x, me.position.y-2);
        }
    });
    P.cat.recieveMessage('BUBBLE1', async function(type="say", text="", time=-1) {
        // Cat の フキダシ を出す
        if( type == 'say') {
            if(time>0) {
                await this.sayForSecs(text, time);
            }else{
                this.say(text);
            }
        }
        if( type == 'think') {
            if(time>0) {
                await this.thinkForSecs(text, time);
            }else{
                this.think(text);
            }
        }
    });

    P.cat2.recieveMessage('BUBBLE2', async function() {
        const me = this;
        for(let i=0;i<10;i++){
            me.setXY(me.position.x, me.position.y+2);
        }
        for(let i=0;i<10;i++){
            me.setXY(me.position.x, me.position.y-2);
        }
    });
    P.cat2.recieveMessage('BUBBLE2', async function(type="say", text="", time=-1) {
        // Cat2 の フキダシ を出す
        if( type == 'say') {
            if(time>0) {
                await this.sayForSecs(text, time);
            }else{
                this.say(text);
            }
        }
        if( type == 'think') {
            if(time>0) {
                await this.thinkForSecs(text, time);
            }else{
                this.think(text);
            }
        }
    });
}
