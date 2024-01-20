/**
 * Wait解除手法実験
 * 
 * (1) Tread へ対して emit をすることで 解除する ⇒ Tread数が多いと
 * 
 */


function getMemory() {
    console.log(`使用可能なメモリ    ${(performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`);
    console.log(`割り当てられたメモリ  ${(performance.memory.totalJSHeapSize / 1024).toFixed(2)}KB`);
    console.log(`現在使用中のメモリ   ${(performance.memory.usedJSHeapSize / 1024).toFixed(2)}KB`);
}

const wait = ms => new Promise(r => setTimeout(r, ms));

const Thread = class {

    constructor(runtime, f) {
        this.runtime = runtime;
        this.f = f;
        this.stop = "";
        this.interval;
        this._release = false;
        this._preTick = 0;
        this._tick = 0;
        const me = this;
        // thread数が11 を超えると 警告が出る。
        // thread数が多すぎると( 300個など) 速度が落ちる。
//        this.runtime.on('TICK', function(tick){
//            me._release = true;
//            me._tick = tick;
//        });
    }
    async exec() {
        this.f();
    }
    async wait2( ms) {
        const _preTick = this.runtime._tick;
        while ( true ){
            //console.log(_preTick, this._tick)
            if( this.runtime._tick - _preTick > ms ) break;
            await P.wait(0);
        }
        return;

    }
    async wait () {
        const me = this;
        for(;;) {
            if( me._release === true) break;
            await P.wait(2);
        }
        me._release = false;
        return ;
    }
}

const Runtime = class extends P.EventEmitter{
    constructor() {
        super();
        this.lastClock = performance.now();
        this._clock = this.lastClock;
        this._interval = 999999999;
        this._release = false;
        this._tick = 0;
        const me = this;
        this.on('TICK', function(tick){
            me._tick = tick;
        });
    }
    set interval( interval ){
        this._interval = interval;
    }
    get interval () {
        return this._interval;
    }


}

const runtime = new Runtime();
runtime.interval = 33 - 3

const threads = [];

let counter = 0;
let timerGokei = 0;
let timerCount = 0;
const awaitMs = 29
// Thread数は 20個を超えるとFPSを維持するのがつらくなる。
Array(200).fill().map(_=>{
    counter += 1;
    const type = `Loop${counter}`
    const thread = new Thread(runtime, async function(){
        const me = this;
        let lastDate = performance.now();
        //let d = performance.now();
        const _count = 10;
        let index = 0;
        for(;;) {
            //console.log("============(1)");
            await P.wait(awaitMs);
            //await me.wait2(awaitMs);
            index += 1;
            const date1 = performance.now();
            //timerGokei += date1-lastDate;
            //timerCount += 1;
            //console.log("============(1)",type, index, 0, "wait release(1)", date1-lastDate);
            lastDate = date1;
            if(index > _count) break;
            //await P.wait(5);
            let index2 = 0;
            for(;;) {
//                await me.wait();
                await P.wait(awaitMs);
                //await me.wait2(awaitMs);
                index2 += 1;
                if(index2 > _count) break;
                //await P.wait(5);
                //let d2 = performance.now();
                const date2 = performance.now();
                timerGokei += date2-lastDate;
                timerCount += 1;
                console.log("----------(2)",type, index, index2, "wait release(2)", date2-lastDate);
                lastDate = date2;
                getMemory();
            }
        }
    });

    threads.push(thread);

})

threads.map(t=> {
    t.exec();
})
for(let i=0; i<threads.length; i++) {
    const t = threads[i]
    t.exec();

}

(async function(){
    const tick = runtime.interval;
    let lastTimer = new Date().getTime();
    const firstTimer = lastTimer;
    for(;;) {
        const nextTimer = new Date().getTime();
        if( nextTimer - firstTimer > 10 * 1000 ) break;
        const timer = nextTimer - lastTimer;
        if( timer > tick) {
            for(let i=0; i<threads.length; i++) {
                const t = threads[i]
                //t.clock();
                //t.runtime.emit('TICK', nextTimer);
            }        
            lastTimer = nextTimer;
        }
        await P.wait(runtime.interval);
    }
    console.log(timerCount, timerGokei, timerGokei/timerCount )
});

