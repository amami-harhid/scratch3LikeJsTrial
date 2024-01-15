/**
 * Sample19
 * 
 * 吹き出し(SAY, THINK)
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
    P.cat.addImage( P.images.Cat1 );
    P.cat.addImage( P.images.Cat2 );
    P.cat.direction = 75;
    P.cat2 = new P.Sprite("Cat2");
    P.cat2.addImage( P.images.Cat1 );
    P.cat2.addImage( P.images.Cat2 );
    P.cat2.direction = 115;
    P.cat2.position = {x: -20, y: -120}

}

const bubble = {'type': 'say', 'text': "abcdefg", 'exit': false};
const bubble2 = {'type': 'think', 'text': "かきくえばぁかねがなるなりほうりゅうじ", 'exit': false};

P.setting = async function() {
    P.cat.whenFlag( async function() {
        for(;;) {
            this.ifOnEdgeBounds();
            this.moveSteps(1);
        }
    });
    P.cat2.whenFlag( async function() {
        for(;;) {
            this.ifOnEdgeBounds();
            this.moveSteps(1);
        }
    });
    P.cat.whenFlag( async function() {
        await P.wait(100)
        for(;;) {
            this.nextCostume();
            await P.wait(100)
        }
    });
    P.cat2.whenFlag( async function() {
        await P.wait(100)
        for(;;) {
            this.nextCostume();
            await P.wait(100)
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
        for(;;) {
            this.say(bubble.text);
            //this.say(bubble.text, {'scale':scale});
            if( bubble.exit === true) {
                this.say();
                break;
            }
        }

    });
    P.cat2.whenFlag( async function() {
        let scale = {x: 60, y:60};
        for(;;) {
            this.think(bubble2.text, {scale:scale});
            if( bubble2.exit === true) {
                this.say();
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

}
