const loadSound = async function (name, sound, preFunc, postFunc, counter) {
    if(sound) {
        if(typeof sound === 'string') {
            console.log('-----start counter=', counter);
            if(preFunc) {
                preFunc();
            }
            let responce = await fetch(sound);
            let buffer = await responce.arrayBuffer();
            let data =  new Uint8Array(buffer);
            if(postFunc) {
                postFunc();
            }
            console.log('-----end counter=', counter);
            return {name:name, data:data};
        }
    }
    // 例外を起こすべきところ。
}
let count = 0;
function preFunc () {
    count += 1;
}
function postFunc () {
    count -= 1;
}
async function nextStep() {
    console.log('nextStep');
    const r = await Promise.all(dataArray);
    r.map(v=>{
        console.log(v.name, v.data);
    })
    console.log('next');
    const r2 = await Promise.all(dataArray2);
    r2.map(v=>{
        console.log(v.name, v.data);
    })
}
let dataArray = [];
let dataArray2 = [];

let counter = 0
console.log("loadSound start---------");
Array(10).fill().map(async (_)=>{
    counter += 1;
    let data = loadSound(`cat-${counter}`,'../assets/Cat.wav', preFunc,postFunc,counter);
    dataArray.push(data);
});
Array(10).fill().map(async (_)=>{
    counter += 1;
    let data = loadSound(`cat2-${counter}`,'../assets/Cat.wav', preFunc,postFunc,counter);
    dataArray2.push(data);
});
console.log("loadSound end ---------");


nextStep();