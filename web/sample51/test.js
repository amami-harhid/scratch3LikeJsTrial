const Wait = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const UntilMs = 0;
const Until = async (condition, callback) => new Promise(async(resolve) => {
  const _f = function(){
    if(condition()) {
      if( callback ){
        callback();
      }
      resolve();    
    }else{
      setTimeout(_f, UntilMs);
    }
  }
  _f();
});

const BlockLike = class {
  constructor(fps) {
    Object.defineProperty(
      this,
      'FPS',{
          value: fps,
        }
    );
    this.loopProtection = {
      protectionRelease : false,
    };
  }
  protectionRelease() {
    this.loopProtection.protectionRelease = true;
  }
  exec ( f, me,...args ) {
    const af = this._rewrite(f);
    console.log(js_beautify(af.toString(), BlockLike.JsBeautifyOptions()));
    let bindedFunc = af.bind(me);
//    console.log(...args);
    bindedFunc(...args);
  }
//  eval(code, scope) {
//    return (eval("("+code+")"));
//  }
  _rewrite( f ) {
    let code = f.toString();
    const theVar = BlockLike.getEventObjectVarName(code)
//    console.log(theVar)
    // コメントを消す
    code = BlockLike.removeComments(code);
/* 整形の結果「Left Curly Bracket({)の前の改行をなくす
  SemiColonで終わらない行にSemiColonは付与しないことに注意。
  while(true)
  {x+=1;break}
  ↓
  while (true) {
    x += 1;
    break
  }
*/
    code = js_beautify(code, BlockLike.JsBeautifyOptions());
    code = code.replace(BlockLike.RegexLoopDef, '$1$2' + BlockLike.LoopProtectionCode);
    code = js_beautify(code, BlockLike.JsBeautifyOptions());
    code = BlockLike.removeComments(BlockLike.removeOuter(code))
    const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor
    let af = (theVar.length>0)? new AsyncFunction(theVar,code):new AsyncFunction(code);
    return af;
  }
  static removeOuter(funcS) {
    return funcS.substring(funcS.indexOf('{') + 1, funcS.lastIndexOf('}'));
  }
  static removeComments(funcS) {
    return funcS.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');
  }
  static getEventObjectVarName (funcS) {
    return funcS.substring(funcS.indexOf('(') + 1, funcS.indexOf(')'))
  }
  static JsBeautifyOptions(){
    return {
          indent_size: 2,
          space_in_empty_paren: false,
          space_in_paren: false,
    };
  }
  static get RegexLoopDef() {
    return /([while|for]\s\([^\)]*?\)\s)({)/g;
  }
  static get LoopProtectionCode() {
    //return `await Until(_ => this.loopProtection.protectionRelease === true, () => { this.loopProtection.protectionRelease = false; }); \n`;
    return `await Wait(16); \n`;
  }
}