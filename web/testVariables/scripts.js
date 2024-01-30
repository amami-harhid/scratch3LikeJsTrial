const Variables = class {

    constructor() {
        this.map = new Map();
        this.v = {};
        const me = this;
        let timeoutId = 0;
        const delay = 100;
        window.addEventListener('resize', async function(){
            
            clearTimeout(timeoutId);
            
            timeoutId = setTimeout(async function(){
                //console.log('resize')
                const r1 = P.getRenderRate();
                //console.log('resize(1)', r1);
                await P.wait(100);
                const r2 = P.getRenderRate();
                //console.log('resize(2)', r2);
                const keys = Array.from(me.map.keys());
                keys.map((k)=>{
                    const v = me.map.get(k);
                    v.resize();
                });

            }, delay);
        }, false);
    }
    add(label, scale) {
        if(!this.map.has(label)) {
            const length = this.map.size;
            const v = new P.Variable(label, length+1,  scale);
            this.map.set(label, v);
            this.v[label] = v;
        }
    }

    getVariable(label) {
        if(this.map.has(label)) {
            const v = this.map.get(label);
            return v;
        }
        return null;
    }
    automatic () {

        const mapKeys = this.map.keys();
        const keys = [...mapKeys];
        const sortKeys = keys.sort(function(a, b){
            a.no < b.no;
        })
        console.log(sortKeys);

        let prevPosition;
        sortKeys.map((key,idx)=>{
            const v = this.map.get(key);
            const size = v.size;
            console.log(size);
            if( prevPosition == undefined) {
                const x = 10;
                const y = 10;
                prevPosition = {x: x, y: y};
                v.setPosition( {x: x, y: y} );
            }else{
                const x = 10;
                const y = prevPosition.y + size.h;
                prevPosition = {x: x, y: y};
                v.setPosition( {x: x, y: y} );
            }
        })

    }

}
P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
}

P.prepare = async function() {
    const a = new P.Stage();
    P.variables = new Variables();
    P.variables.add('Counter');
    P.variables.add('マウス');
    P.variables.v.Counter.setPosition( {x: 40, y:15} )
    P.variables.v.マウス.setPosition( {x: 330, y:44} )

    P.variables.v.Counter.value = 0;
    P.variables.v.マウス.value = 'xxxxx';
    //P.variables.automatic();
/*
    P.test01 = new P.Variable('Counter', undefined, 1, 2);
    P.test01.changeLabel('Counter');
    P.test02 = new P.Variable('マウス', undefined, 2, 2);
    P.test02.changeLabel('マウス');
*/  
}

P.setting = async function() {

    console.log('P._render.stageWidth', P._render.stageWidth)
    console.log('P._render.stageHeight', P._render.stageHeight)
    console.log('P.canvas.width', P.canvas.width)
    console.log('P.canvas.height', P.canvas.height)

    const dragTargets = document.querySelectorAll('.dragTarget');
    console.log('dragTargets',dragTargets)
    Array.from(dragTargets).map(d=>{
        d.addEventListener('mouseover', function(){
            const id = d.id;
            const balloons = document.querySelectorAll(`#${id} .monitor_balloon`);
            Array.from(balloons).map(b=>{
                b.style.display = 'inline';
            });
        })
        d.addEventListener('mouseout', function(){
            const id = d.id;
            const balloons = document.querySelectorAll(`#${id} .monitor_balloon`);
            Array.from(balloons).map(b=>{
                b.style.display = 'none';
            });
        })
      
    })


    P.stage.whenFlag( async function() {
        this.addImage( P.images.Jurassic );

        let counter = 0;
        for(;;) {
    
            P.variables.v.Counter.value= counter;
    
            await P.wait(1000);
            counter += 1;
        }
    });

    P.stage.whenFlag( async function() {
        let counter = 0;
        for(;;) {
            const position = P.mousePosition;
            P.variables.v.マウス.value = ` ${Math.ceil(position.x)} , ${Math.ceil(position.y)}`;
    
            await P.wait(33);
            counter += 1;
        }
    });

}

function dragMoveListener (event) {

    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
  
    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
  
    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
}