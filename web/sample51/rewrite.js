const exec = function ( f, me,...args ) {
    const af = rewrite(f);
    //console.log(js_beautify(af.toString(), Constant.JsBeautifyOptions));
    let bindedFunc = af.bind(me);
//    console.log(...args);
    bindedFunc(...args);
}

const rewrite = function ( f ) {
    let code = f.toString();
    const theVar = getEventObjectVarName(code)
//    console.log(theVar)
    // コメントを消す
    code = removeComments(code);
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
    code = js_beautify(code, Constant.JsBeautifyOptions);
    code = code.replace(Constant.RegexLoopDef, '$1$2' + Constant.LoopProtectionCode);
    code = js_beautify(code, Constant.JsBeautifyOptions);
    code = removeComments(removeOuter(code))
    const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor
    let af = (theVar.length>0)? new AsyncFunction(theVar,code):new AsyncFunction(code);
    return af;
  }
  const removeOuter = function(funcS) {
    return funcS.substring(funcS.indexOf('{') + 1, funcS.lastIndexOf('}'));
  }
  const removeComments = function(funcS) {
    return funcS.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');
  }
  const getEventObjectVarName = function (funcS) {
    return funcS.substring(funcS.indexOf('(') + 1, funcS.indexOf(')'))
  }

const Constant = {
    RegexLoopDef : /([while|for]\s\([^\)]*?\)\s)({)/g ,
    LoopProtectionCode : `await P.Utils.wait(P.Env.pace); \n` ,
    JsBeautifyOptions : {
        indent_size: 2,
        space_in_empty_paren: false,
        space_in_paren: false,            
    },

}
  
