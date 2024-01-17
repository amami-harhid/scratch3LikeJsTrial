const Event = class extends P.EventEmitter {

    constructor(runtime) {
        super();
        this.runtime = runtime;
        this.count = 0;
    }
    registEvent() {
        for(let i=0; i<10; i++) {
            this.on("E00"+(i+1), function(count) {
                const _count = count;
                console.log("E00"+(i+1), 'start', _count);
                let _i = new Date();
                for(;;) {
                    const __i = new Date();
                    if(__i -_i > 1000) {
                        break;
                    }
                }
                console.log("E00"+(i+1), 'end', _count);
            })
    
        }
    }
}

const Runtime = class {

    constructor() {
        this.event = new Event(this);
        this.event.registEvent();
    }

    fire( id, count ) {
        this.event.emit( id, count )
    }
}
const runtime = new Runtime();
console.log(runtime.event)

for(let i=0; i<10; i++){
    runtime.fire('E00'+(i+1), i);
}
