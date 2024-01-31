const Process = require('./process');
const Monitor = require('./monitor');

const Monitors = class {

    constructor() {
        this.map = new Map();
        this.v = {};
        const me = this;
        let timeoutId = 0;
        const delay = 100;
        // Scale させると位置がずれる問題。
        // 参考：https://www.ipentec.com/document/css-representation-position-of-scaled-element
        // --> 結局のところ、style.top , style.left で操作するのがよさそうだと思う。
        window.addEventListener('resize', async function(){
            
            clearTimeout(timeoutId);
            const keys = Array.from(me.map.keys());
            keys.map((k)=>{
                const v = me.map.get(k);
                v.resize();
            });
            
            timeoutId = setTimeout(async function(){
                const process = Process.default;
                //console.log('resize')
                const r1 = process.getRenderRate();
                //console.log('resize(1)', r1);
                await process.wait(100);
                const r2 = process.getRenderRate();
                //console.log('resize(2)', r2);
                const keys = Array.from(me.map.keys());
                keys.map((k)=>{
                    const v = me.map.get(k);
                    v.resize(true);
                });

            }, delay);
        }, false);
    }
    add(label, scale) {
        if(!this.map.has(label)) {
            const length = this.map.size;
            const v = new Monitor(label, length+1,  scale);
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
        //console.log(sortKeys);

        let prevPosition;
        sortKeys.map((key,idx)=>{
            const v = this.map.get(key);
            const size = v.size;
            //console.log(size);
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

module.exports = Monitors;