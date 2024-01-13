const P1 = class {

    constructor() {
        this.x = 10;
    }

    whenFlag ( func ) {
        const me = this;
        window.addEventListener('click',function(){
            P.Rewrite.exec(func, me);
    
        });
    }
    whenFlag1 ( func ) {
        const me = this;
        const _aa = A.getInstance();
        const scope = _aa.setup;
        
        const _rewrite = P.Rewrite;
        window.addEventListener('click',function(me){
            const af = _rewrite._rewrite( func );
            console.log(af);
            let bindedFunc = af.bind( me );
    
            setTimeout(bindedFunc, 0, me);
            //P.Rewrite.exec(func, scope);
    
        });
    }
    startThread(func) {
        const me = this;
        const _rewrite = P.Rewrite;
        const af = _rewrite._rewrite( func );
        console.log(af);
        let bindedFunc = af.bind( me );

        setTimeout(bindedFunc, 0, me);

    }
}

const A = class {
    static getInstance() {
        if(A._ins == undefined) {
            A._ins = new A();
        }
        return A._ins;
    }
    constructor() {
        this.p1 = new P1();
    }
    go() {
        this.setup();
    }

}

const aa = A.getInstance();

const z = 12345000;
aa.setup = function() {

    this.p1.whenFlag( function() {
        const y = this.x + 100;
        console.log("(1)y=",y);
    } );
    this.p1.whenFlag1( function(me) {
        console.log('me',me)
        const y = 100 + z + me.x;
        console.log("(2)y=",y);
    } );
    this.p1.startThread( async function(me) {
        console.log('me',me)
        
        for(;;) {
            me.x -= 1;
            const y = 100 + z + me.x;
            console.log("(3)y=",y);    
            P.Utils.wait(10);
        }
    } );
}
aa.go();