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
    this.loadImage('../assets/cat.svg','Cat1');
    this.loadImage('../assets/cat2.svg','Cat2');
}

P.prepare = async function() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );

    P.cat = new P.Sprite("Cat");
    P.cat.addImage( P.images.Cat1 );
    P.cat.addImage( P.images.Cat2 );

}

const bubble = {'type': 'say', 'text': "abcdefg", 'exit': false};

P.setting = async function() {
    P.cat.whenFlag( async function() {
        for(;;) {
            this.ifOnEdgeBounds();
            this.moveSteps(1);
        }
    });
    P.cat.whenFlag( async function() {
        await P.wait(100)
        for(;;) {
            this.nextCostume();
        }
    });
    P.cat.whenFlag( async function() {
        for(;;) {
            for(;;) {
                this.setScale(this.scale.x - 2, this.scale.y - 2);
                if(this.scale.x < 50) break;
            }
            for(;;) {
                this.setScale(this.scale.x + 2, this.scale.y + 2);
                if(this.scale.x > 150) break;
            }
        }
    });
    P.cat.whenFlag( async function() {
        //let scale = {x: 100, y:100};
        for(;;) {
            this.say(bubble.text);
            //this.say(bubble.text, {'scale':scale});
            if( bubble.exit === true) {
                this.say();
                break;
            }
        }

    });
    P.cat.whenFlag( async function() {
        for(;;) {
            await P.wait(3000);
            bubble.type = 'think';
            await P.wait(3000);
            bubble.type = 'say';
            if( bubble.exit === true) {
                break;
            }
        }
    });
    P.cat.whenFlag( async function() {
        let idx = 0;
        for(;;) {
            bubble.text = `abcdefg${++idx}`;
            if( bubble.exit === true) {
                break;
            }
        }
    });
    P.cat.whenFlag( async function() {
        await P.wait(50000);
        //bubble.exit = true;
    });

/*
    P.cat.whenFlag( async function() {
        const bubbleDrawableID = P.render.renderer.createDrawable( P.StageLayering.SPRITE_LAYER );
        const drawableID = P.cat.drawableID;
        console.log(bubbleDrawableID)
        
        //const bubbleState = P.render.renderer._getBubbleState(this);
        //console.log("bubbleState",bubbleState);
        let onSpriteRight = true;
        P._bubbleSkinId = P.render.renderer.createTextSkin(
            "", 
            "", 
            onSpriteRight
        );
        //console.log(P._bubbleSkinId)
        for(;;) {
            const properties = {
                skinId: P._bubbleSkinId,
                direction: 90,
                scale: [ 100, 100],
                position: [ P.cat.position.x, P.cat.position.y],
            }
            //P.render.renderer.updateDrawableSkinId(bubbleDrawableID, P._bubbleSkinId);
            P.render.renderer.updateDrawableProperties( bubbleDrawableID, properties );
            onSpriteRight = P._spriteRight(this.drawableID, bubbleDrawableID, onSpriteRight);
    
            P.render.renderer.updateTextSkin ( P._bubbleSkinId, "say", "SAMPLE", onSpriteRight);
 
            await P.wait(5000);
    
            P.render.renderer.updateTextSkin ( P._bubbleSkinId, "say", "あいうえお", onSpriteRight);
            await P.wait(5000);
            //P.render.renderer.updateDrawableProperties( bubbleDrawableID, properties );
            P.render.renderer.updateTextSkin ( P._bubbleSkinId, "think", "かきくけこ", onSpriteRight);
            await P.wait(10000);

    
        }
        // Bubbleを完全に消す。
        P.render.renderer.destroyDrawable( bubbleDrawableID, P.StageLayering.SPRITE_LAYER);
        P.render.renderer.destroySkin( P._bubbleSkinId ) 
    });
    P._spriteRight = function( drawableID, bubbleDrawableID, _onSpriteRight ) {
        let onSpriteRight = _onSpriteRight;
        const [bubbleWidth, bubbleHeight] = P.render.renderer.getCurrentSkinSize( bubbleDrawableID );
        //console.log(`[bubbleWidth, bubbleHeight]=${[bubbleWidth, bubbleHeight]}`)
        const targetBounds = P.render.renderer.getBoundsForBubble( drawableID );
        //console.log(`targetBounds=(left:${ targetBounds.left }, right:${ targetBounds.right },top:${ targetBounds.top }, bottom:${ targetBounds.bottom }`)
        const stageSize = P.render.renderer.getNativeSize();
        //console.log(`stageSize=${stageSize}`)
        const stageBounds = {
            left: -stageSize[0] / 2,
            right: stageSize[0] / 2,
            top: stageSize[1] / 2,
            bottom: -stageSize[1] / 2
        };
        if( onSpriteRight === true && bubbleWidth + targetBounds.right > stageBounds.right && (targetBounds.left - bubbleWidth > stageBounds.left) ) {
            console.log('left');
            onSpriteRight = false;
        } else if( onSpriteRight === false && targetBounds.left - bubbleWidth < stageBounds.left && (bubbleWidth + targetBounds.right < stageBounds.right) ) {
            console.log('right');
            onSpriteRight = true;
        } else {
            console.log('other');
            const positionX = (onSpriteRight)? (Math.max(stageBounds.left,Math.min(stageBounds.right - bubbleWidth, targetBounds.right))):(Math.min(stageBounds.right - bubbleWidth,Math.max(stageBounds.left, targetBounds.left - bubbleWidth)));
            const positionY = Math.min(stageBounds.top, targetBounds.bottom + bubbleHeight);
            P.render.renderer.updateDrawablePosition(bubbleDrawableID, [positionX, positionY]);
        }
        return onSpriteRight;
    }
*/

}
