const A = class extends Object {

    go(func) {

        this.func = func;

    }

    start(code) {

        this.func(code);
    }


}


const code = `
console.log('test');
console.log(i);
`
const _a = A.getPrototypeOf(async () => {}).constructor
const aa = new A(); 

aa.test = function(){

    this.go(function(code) {

        const AsyncFunction = A.getPrototypeOf(async () => {}).constructor
        let af = new AsyncFunction(code)
        af();

    })

}

aa.test()

aa.start(code);