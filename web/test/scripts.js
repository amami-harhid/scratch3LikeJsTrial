//const keyboard = P.Keyboard.default;



P.keyboard.on(P.keyboard.KEY_DOWN , function(key,code) {
    console.log( 'now down ')
})
P.keyboard.on(P.keyboard.KEY_DOWN , function(key, code) {
    console.log( 'down e.key=', key)
    console.log( 'down e.code=', code)
})
P.keyboard.on(P.keyboard.KEY_UP  , function(key, code) {
    console.log( 'now up ')
})

P.keyboard.on(P.keyboard.KEY_UP  , function(key, code) {
    console.log( 'up e.key=', key)
    console.log( 'up e.code=', code)
})

async function test () {
    console.log('---------startWatching----------');
    P.keyboard.startWatching();
    await P.wait(10*1000);
    console.log('---------stopWatching----------');
    P.keyboard.stopWatching();
}

test();