/**
 * Sample19
 * 
 * 吹き出し(SAY, THINK)
 * 
 */
/* 
SkinID
RenderWebGL# createTextSkin (type, text, pointsLeft)
type: "say" or "think"
text: 
pointsLeft:(boolean) which side the bubble is pointing

作成したスプライトのdrawingID は同じものを使い

const P._bubbleSkinId = await P.render.renderer.createTextSkin("say", "SAMPLE TEXT", true);

const properties = {
    skinId: P._bubbleSkinId,
    direction: 90,
    scale: [ 100, 100],
    position: [ sprite.position.x, sprite.position.y],
}
P.render.renderer.updateDrawableProperties( drawableID, properties );

*/
P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadImage('../assets/cat.svg','Cat');
}

P.prepare = async function() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );

    P.cat = new P.Sprite("Cat");
    P.cat.addImage( P.images.Cat );

}

P.setting = async function() {
    P.cat.whenFlag( async function() {
        const bubbleDrawableID = P.render.renderer.createDrawable(P.StageLayering.SPRITE_LAYER);
        const drawableID = P.cat.drawableID;
        console.log(bubbleDrawableID)
        P._bubbleSkinId = P.render.renderer.createTextSkin(
            "think", 
            "SAMPLE TEXT,SAMPLE TEXT", 
            true, 
            [0, 0]
        );
        console.log(P._bubbleSkinId)
        const properties = {
            skinId: P._bubbleSkinId,
            direction: 90,
            scale: [ 100, 100],
            position: [ P.cat.position.x+20, P.cat.position.y+80],
        }
        P.render.renderer.updateDrawableSkinId(bubbleDrawableID, P._bubbleSkinId);
        P.render.renderer.updateDrawableProperties( bubbleDrawableID, properties );
    });

}
