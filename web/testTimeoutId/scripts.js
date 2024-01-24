/**
 * threadのなかで EventEmitter.on でメッセージを受けたとき
 * throw したらどうなるか？
 * 
 */

const emitter = new P.EventEmitter();
let testInx = 0;
async function Tester (name, emitter) {
    emitter.emit ( 'STOP' ); let stopper = false; ;emitter.once ( 'STOP', function() {stopper= true; console.log('testInx=',testInx) })
    let idx = 0;
    for(let i=0;i<10;i++) {
        if(stopper === true) break;
        idx+=1;
        await P.wait(300);
    }
    console.log('name=',name,':idx=',idx)
    emitter.removeAllListeners('STOP');
}

async function go() {

    setTimeout(Tester, 0, '0001', emitter);
    setTimeout(Tester, 0, '0002', emitter);
    setTimeout(Tester, 0, '0003', emitter);
    
};

go();
