/**
 * new AcyncFunction で作るときと new Function で作るときの
 * スコープの違い
 * 
 * どちらも、メソッドスコープを参照しない。
 * 引数で渡すとき、プリミティブ型の変数は変化しない。オブジェクトの中身は変わる。
 */


const AsyncFunction = Object.getPrototypeOf(async () => { }).constructor

function myfunc01() {
    const a = 10;
    const obj = {};
    obj.a = 20;
    const code = `
    obj.a += x; 
    console.log(obj);
    `;
    try {
        const f =  new AsyncFunction('a,obj',code);
        f(a, obj).catch(e=>{console.error("code",code); throw new Error(e);}); // <--- try-catchしないです。
    
    }catch(e) {
        console.log("code=",code)
        console.log("ほいほい")
        console.log("catch success")
        throw new Error(e)

    }
    console.log('スコープ上の a, obj = ', a, obj)
}


myfunc01();

function myfunc02() {
    const a = 20;
    const code = `console.log(a)`;
    try{
        const f = new Function(code);
        //f();      
    }catch(e){
        console.log("code=",code)
        throw new Error(e)
    }
}

myfunc02();




