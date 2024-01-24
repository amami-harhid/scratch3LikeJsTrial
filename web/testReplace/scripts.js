const code = `
function() {
if( 1 == 0 ) {
    console.log(1)
}
// クリックフラグをみて実行中でないときにスレッドを実行する。
if( threadStartFlag == false) {
    // 「終わるまで音を鳴らす」をずっと繰り返す、スレッドを起動する
    this.startThread( async function() {
        // スレッド起動したら
        threadStartFlag = true;
        for(;;) {
            await this.startSoundUntilDone();
            // トップスコープにて定義しているので参照可能。
            if( threadStartFlag == false) {
                break;
            }
        }
        while (true) {
            
        }
        threadStartFlag = false;
    });
} else {
    threadStartFlag = false;
    this.soundStop(); // 鳴っている音を止める。
}
}
`;
const JsBeautifyOptions = {
    indent_size: 2,
    space_in_empty_paren: false,
    space_in_paren: false,            
}
const LoopProtectionCode = `if(_stopper_===true){break;}\n await P.Utils._waitRapperRewrited(P.Env.pace); \n`;

const regex = /((while|for)\s\([^\)]*?\)\s)({)/g ;
let _code1 = P.js_beautify(code, JsBeautifyOptions);
console.log("code1",_code1);

let _code2 = _code1.replace(regex, '$1$3' + LoopProtectionCode);
console.log("code2",_code2);
let _code3 = P.js_beautify(_code2, JsBeautifyOptions);

console.log("code3",_code3);

