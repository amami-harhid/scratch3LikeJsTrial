/**
 * Sample20
 * 
 * メッセージ
 * 二匹のネコがお話しをする
 * お話しは、メッセージ送信 を使う。
 * 背景は、PNG を使う。
 * 同じmessageID を複数で受け取るときは、同時に起動される。
 * 
 * 送ったらすぐに次の処理へ： broadcast(messageID, ～)
 * 終わるまで待つ：　await broadcastAndWait(messageID, ～)
 */

P.preload = async function() {
    this.loadImage('../assets/backdrop.png','BackDrop');
    this.loadImage('../assets/cat.svg','Cat1');
    this.loadImage('../assets/cat2.svg','Cat2');
}

P.prepare = async function() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.BackDrop );

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

const MessageCat1Say = 'BUBBLE1_SAY';
const MessageCat1Think = 'BUBBLE1_THINK';
const MessageCat2Say = 'BUBBLE2_SAY';
const MessageCat2Think = 'BUBBLE2_THINK';
const MessageTAIJYO = 'TAIJYO';

P.setting = async function() {
    P.stage.whenFlag( async function() {
        await P.wait(1000);
        //(左) "こんにちは。良い天気ですね"
        await this.broadcastAndWait(MessageCat1Say, bubbleTextArr[0], 3); 
        //(右) "💚こんにちは💚青空がよい感じですね"
        await this.broadcastAndWait(MessageCat2Say, bubbleTextArr2[0], 1);
        //(右) "どこにおでかけですか"
        await this.broadcastAndWait(MessageCat2Say, bubbleTextArr2[1], 2);
        //(左) "ちょっと近くのスーパーに買い物にいくんですよ"
        await this.broadcastAndWait(MessageCat1Say, bubbleTextArr[1], 1);
        //(右) "あらあらそれはいいですね"
        await this.broadcastAndWait(MessageCat2Think, bubbleTextArr2[2], 4);
        // お互いに退場
        this.broadcast(MessageTAIJYO);
    });
    P.cat.whenBroadcastReceived(MessageCat1Say, async function() {
        const me = this;
        for(let i=0;i<10;i++){
            me.setXY(me.position.x, me.position.y+2);
        }
        for(let i=0;i<10;i++){
            me.setXY(me.position.x, me.position.y-2);
        }
    });
    P.cat.whenBroadcastReceived(MessageCat1Say, async function(text="", time=-1) {
        // Cat の フキダシ を出す
        if(time>0) {
            await this.sayForSecs(text, time);
        }else{
            this.say(text);
        }
    });
    P.cat.whenBroadcastReceived(MessageTAIJYO, async function() {
        // Cat 退場
        console.log('Cat 退場');
        this.direction *= -1;
        for(;;) {

            this.moveSteps(5);
            if(this.isTouchingEdge()) {
                break;
            }
        }
        this.visible = false;        
    });
    P.cat2.whenBroadcastReceived(MessageTAIJYO, async function() {
        // Cat2 退場
        console.log('Cat2 退場');
        this.direction *= -1;
        for(;;) {

            this.moveSteps(5);
            if(this.isTouchingEdge()) {
                break;
            }
        }
        this.visible = false;        
    });

    P.cat2.whenBroadcastReceived(MessageCat2Say, async function() {
        const me = this;
        for(let i=0;i<10;i++){
            me.setXY(me.position.x, me.position.y+2);
        }
        for(let i=0;i<10;i++){
            me.setXY(me.position.x, me.position.y-2);
        }
    });
    P.cat2.whenBroadcastReceived(MessageCat2Say, async function(text="", time=-1) {
        // Cat2 の フキダシ を出す
        if(time>0) {
            await this.sayForSecs(text, time);
        }else{
            this.say(text);
        }
    });
    P.cat2.whenBroadcastReceived(MessageCat2Think, async function(text="", time=-1) {
        // Cat2 の フキダシ を出す
        if(time>0) {
            await this.thinkForSecs(text, time);
        }else{
            this.think(text);
        }
    });
}
